"use client";

import * as React from "react";
import * as maplibregl from "mapbox-gl";
import * as L from "leaflet";
import "maplibre-gl/dist/maplibre-gl.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "leaflet/dist/leaflet.css";

import { useGISStore } from "../stores/use-gis-store";
import { BASEMAP_PROVIDERS } from "../constants/basemap-providers";
import {
  CADASTRAL_PARCELS_GEOJSON,
  CADASTRAL_BUILDINGS_GEOJSON,
  SURVEY_MARKERS_GEOJSON,
  AI_ENCROACHMENTS_GEOJSON,
  AI_BOUNDARY_CONFLICTS_GEOJSON,
  AI_RISK_ZONES_GEOJSON,
  AI_SATELLITE_CHANGES_GEOJSON,
  AI_ROAD_WIDENING_GEOJSON,
} from "../constants/sample-cadastral-geojson";
import { ADMIN_BOUNDARIES_GEOJSON } from "../constants/sample-admin-boundaries-geojson";
import { coordinateProjectionService } from "../services/coordinate-projection-service";
import { useGlobalSelectionStore, DEMO_MOTHER_PARCEL, DEMO_STRATA_UNIT } from "@/stores/use-global-selection-store";
import { DrawingPalette } from "./drawing-palette";
import { MeasurementHUD } from "./measurement-hud";
import { IndiaPolicyBanner } from "./india-policy-banner";
import { BasemapSwitcher } from "./basemap-switcher";
import { GPSLocationButton } from "./gps-location-button";
import { CoordinateInspector } from "./coordinate-inspector";
import { Compass, AlertTriangle, RefreshCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Safe WebGL Detection Utility
function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl") ||
      canvas.getContext("webgl2");
    return Boolean(gl && gl instanceof WebGLRenderingContext);
  } catch {
    return false;
  }
}

export function RealMapCanvas() {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapboxInstanceRef = React.useRef<maplibregl.Map | null>(null);
  const leafletInstanceRef = React.useRef<L.Map | null>(null);
  const mapboxMarkerRef = React.useRef<maplibregl.Marker | null>(null);
  const leafletMarkerRef = React.useRef<L.Marker | null>(null);

  // Engine selection state: 'webgl' or 'leaflet'
  const [activeEngine, setActiveEngine] = React.useState<"webgl" | "leaflet">("webgl");
  const [diagnosticError, setDiagnosticError] = React.useState<{
    title: string;
    message: string;
    details?: string;
  } | null>(null);
  const [engineLogs, setEngineLogs] = React.useState<string[]>([]);

  const {
    center,
    zoom,
    bearing,
    pitch,
    realBasemap,
    setCenter,
    setZoom,
    setBearing,
    setPitch,
    updateCursorTelemetry,
    drawingMode,
    addDrawingVertex,
    activeDrawingCoords,
    layerVisibility,
    layerOpacity,
    setSelectedParcel,
    setPropertyPanelOpen,
    isCoordinatePickerActive,
    pickedCoordinate,
    setPickedCoordinate,
    activeAdminUnit,
  } = useGISStore();

  const { setActiveSelection } = useGlobalSelectionStore();

  // Structured Logging Helper
  const logEngine = React.useCallback((message: string) => {
    console.log(`[GeoStrata GIS Engine] ${message}`);
    setEngineLogs((prev) => [...prev.slice(-15), message]);
  }, []);

  // Configure Leaflet standard icons
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      logEngine("✓ CSS loaded");
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }
  }, [logEngine]);

  // Clean up all map instances
  const destroyCurrentMaps = React.useCallback(() => {
    if (mapboxMarkerRef.current) {
      mapboxMarkerRef.current.remove();
      mapboxMarkerRef.current = null;
    }
    if (leafletMarkerRef.current) {
      leafletMarkerRef.current.remove();
      leafletMarkerRef.current = null;
    }
    if (mapboxInstanceRef.current) {
      try {
        mapboxInstanceRef.current.remove();
      } catch (e) {
        console.warn("Mapbox GL cleanup notice:", e);
      }
      mapboxInstanceRef.current = null;
    }
    if (leafletInstanceRef.current) {
      try {
        leafletInstanceRef.current.remove();
      } catch (e) {
        console.warn("Leaflet cleanup notice:", e);
      }
      leafletInstanceRef.current = null;
    }
  }, []);

  // --------------------------------------------------------------------------
  // WebGL MAP ENGINE INITIALIZER (MapLibre / Mapbox GL)
  // --------------------------------------------------------------------------
  const initWebGLMap = React.useCallback(
    (container: HTMLDivElement) => {
      destroyCurrentMaps();

      const width = container.offsetWidth;
      const height = container.offsetHeight;

      logEngine(`✓ Container found (${width}x${height}px)`);

      const hasWebGL = isWebGLAvailable();
      if (!hasWebGL) {
        logEngine("⚠ WebGL unavailable in current environment - initiating Leaflet fallback");
        setActiveEngine("leaflet");
        return;
      }

      logEngine("✓ WebGL available");

      const provider = BASEMAP_PROVIDERS[realBasemap] || BASEMAP_PROVIDERS.osm;

      const initialStyle: maplibregl.StyleSpecification = {
        version: 8,
        sources: {
          "basemap-source": {
            type: "raster",
            tiles: provider.tiles && provider.tiles.length > 0 ? provider.tiles : ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: provider.attribution || "© OpenStreetMap contributors",
            maxzoom: provider.maxZoom || 19,
          },
        },
        layers: [
          {
            id: "basemap-layer",
            type: "raster",
            source: "basemap-source",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      };

      if (provider.overlayTiles && provider.overlayTiles.length > 0) {
        initialStyle.sources["basemap-overlay-source"] = {
          type: "raster",
          tiles: provider.overlayTiles,
          tileSize: 256,
          maxzoom: provider.maxZoom || 19,
        };
        initialStyle.layers.push({
          id: "basemap-overlay-layer",
          type: "raster",
          source: "basemap-overlay-source",
          minzoom: 0,
          maxzoom: 22,
        });
      }

      (maplibregl as any).accessToken = "public_free_osm";

      const map = new maplibregl.Map({
        container: container,
        style: initialStyle,
        center: center,
        zoom: zoom,
        bearing: bearing,
        pitch: pitch,
        maxPitch: 60,
      });

      logEngine(`✓ Style loaded: ${provider.name}`);

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
      map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

      map.on("mousemove", (e: any) => {
        updateCursorTelemetry(e.lngLat.lng, e.lngLat.lat);
      });

      map.on("moveend", () => {
        const c = map.getCenter();
        setCenter([c.lng, c.lat]);
        setZoom(map.getZoom());
        setBearing(map.getBearing());
        setPitch(map.getPitch());
      });

      map.on("load", () => {
        try {
          // 1. Cadastral Parcels Layer
          map.addSource("cadastral-parcels-source", {
            type: "geojson",
            data: CADASTRAL_PARCELS_GEOJSON,
          });

          map.addLayer({
            id: "layer-parcels-fill",
            type: "fill",
            source: "cadastral-parcels-source",
            layout: {
              visibility: layerVisibility["layer-parcels"] ? "visible" : "none",
            },
            paint: {
              "fill-color": [
                "case",
                ["==", ["get", "status"], "DISPUTED"],
                "#ef4444",
                ["==", ["get", "landUse"], "Commercial"],
                "#3b82f6",
                "#10b981",
              ],
              "fill-opacity": ((layerOpacity["layer-parcels"] || 85) / 100) * 0.45,
            },
          });

          map.addLayer({
            id: "layer-parcels-line",
            type: "line",
            source: "cadastral-parcels-source",
            layout: {
              visibility: layerVisibility["layer-parcels"] ? "visible" : "none",
            },
            paint: {
              "line-color": "#0ea5e9",
              "line-width": 2,
              "line-opacity": (layerOpacity["layer-parcels"] || 85) / 100,
            },
          });

          // 2. 3D Building Extrusions
          map.addSource("cadastral-buildings-source", {
            type: "geojson",
            data: CADASTRAL_BUILDINGS_GEOJSON,
          });

          map.addLayer({
            id: "layer-buildings-fill",
            type: "fill",
            source: "cadastral-buildings-source",
            layout: {
              visibility: layerVisibility["layer-buildings"] ? "visible" : "none",
            },
            paint: {
              "fill-color": "#f59e0b",
              "fill-opacity": ((layerOpacity["layer-buildings"] || 75) / 100) * 0.6,
            },
          });

          map.addLayer({
            id: "layer-buildings-line",
            type: "line",
            source: "cadastral-buildings-source",
            layout: {
              visibility: layerVisibility["layer-buildings"] ? "visible" : "none",
            },
            paint: {
              "line-color": "#d97706",
              "line-width": 2,
            },
          });

          // 3. Survey Rover Markers (With Clustering)
          map.addSource("survey-markers-source", {
            type: "geojson",
            data: SURVEY_MARKERS_GEOJSON,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          });

          // Clusters
          map.addLayer({
            id: "survey-clusters",
            type: "circle",
            source: "survey-markers-source",
            filter: ["has", "point_count"],
            layout: {
              visibility: layerVisibility["layer-survey-points"] ? "visible" : "none",
            },
            paint: {
              "circle-color": "#8b5cf6",
              "circle-radius": ["step", ["get", "point_count"], 14, 5, 20, 15, 28],
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });

          map.addLayer({
            id: "survey-cluster-count",
            type: "symbol",
            source: "survey-markers-source",
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-size": 11,
              visibility: layerVisibility["layer-survey-points"] ? "visible" : "none",
            },
            paint: {
              "text-color": "#ffffff",
            },
          });

          // Unclustered survey points
          map.addLayer({
            id: "layer-survey-points",
            type: "circle",
            source: "survey-markers-source",
            filter: ["!", ["has", "point_count"]],
            layout: {
              visibility: layerVisibility["layer-survey-points"] ? "visible" : "none",
            },
            paint: {
              "circle-radius": 6,
              "circle-color": "#8b5cf6",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });

          // 4. AI Violations (Encroachments, Conflicts, Risk Zones)
          map.addSource("ai-violations-source", {
            type: "geojson",
            data: AI_ENCROACHMENTS_GEOJSON,
          });

          map.addLayer({
            id: "layer-ai-violations",
            type: "fill",
            source: "ai-violations-source",
            layout: {
              visibility: layerVisibility["layer-ai-violations"] ? "visible" : "none",
            },
            paint: {
              "fill-color": "#dc2626",
              "fill-opacity": ((layerOpacity["layer-ai-violations"] || 85) / 100) * 0.4,
            },
          });

          // 5. Administrative Boundaries
          map.addSource("admin-boundaries-source", {
            type: "geojson",
            data: ADMIN_BOUNDARIES_GEOJSON,
          });

          map.addLayer({
            id: "layer-admin-bounds",
            type: "line",
            source: "admin-boundaries-source",
            layout: {
              visibility: layerVisibility["layer-admin-bounds"] ? "visible" : "none",
            },
            paint: {
              "line-color": "#ef4444",
              "line-width": 2.5,
              "line-dasharray": [3, 2],
            },
          });

          // 6. Active Drawing Geometry Layer
          map.addSource("active-drawing-source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });

          map.addLayer({
            id: "active-drawing-fill",
            type: "fill",
            source: "active-drawing-source",
            paint: {
              "fill-color": "#0ea5e9",
              "fill-opacity": 0.3,
            },
          });

          map.addLayer({
            id: "active-drawing-line",
            type: "line",
            source: "active-drawing-source",
            paint: {
              "line-color": "#0284c7",
              "line-width": 3,
              "line-dasharray": [2, 1],
            },
          });

          map.addLayer({
            id: "active-drawing-points",
            type: "circle",
            source: "active-drawing-source",
            paint: {
              "circle-radius": 5,
              "circle-color": "#0284c7",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });

          logEngine("✓ Sources loaded");
          logEngine("✓ Layers rendered");

          // Cross-Module Synchronizer on Parcel Click
          map.on("click", "layer-parcels-fill", (e: any) => {
            if (!e.features || e.features.length === 0) return;
            const feature = e.features[0];
            const props = feature.properties;

            setSelectedParcel({
              id: props?.id || "parcel-01",
              ulpin: props?.ulpin || "27518001004201",
              parcelNumber: props?.parcelNumber || "P-401/A",
              surveyNumber: props?.surveyNumber || "CTS-142/1",
              ownerName: props?.ownerName || "Rajiv M. Mehra",
              carpetAreaSqm: props?.carpetAreaSqm || 1420.5,
              perimeterMeters: 154.2,
              landUse: props?.landUse || "Residential",
              state: props?.state || "Maharashtra",
              district: props?.district || "Mumbai Suburban",
              taluka: props?.taluka || "Andheri",
              village: props?.village || "Versova",
              status: props?.status || "ACTIVE",
              centroid: [72.8285, 19.1382],
              geometry: feature as any,
              registeredDate: "14-Jan-2022",
            });

            setPropertyPanelOpen(true);

            if (props?.ulpin === "27518001004201") {
              setActiveSelection(DEMO_MOTHER_PARCEL);
            } else {
              setActiveSelection(DEMO_STRATA_UNIT);
            }
          });

          map.on("mouseenter", "layer-parcels-fill", () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "layer-parcels-fill", () => {
            map.getCanvas().style.cursor = "";
          });
        } catch (layerErr: any) {
          console.error("Error setting up WebGL vector layers:", layerErr);
        }
      });

      // Map Click Event (Drawing Mode OR Interactive Coordinate Picker)
      map.on("click", (e: any) => {
        const store = useGISStore.getState();
        if (store.drawingMode !== "none") {
          addDrawingVertex([e.lngLat.lng, e.lngLat.lat]);
          return;
        }

        // Coordinate Picker Mode or General Point Inspector
        if (store.isCoordinatePickerActive) {
          const picked = coordinateProjectionService.formatPickedCoordinate(e.lngLat.lng, e.lngLat.lat);
          setPickedCoordinate(picked);
        }
      });

      map.on("error", (errEvent: any) => {
        if (errEvent?.error?.status !== 404) {
          console.warn("[MapLibre Event Notice]:", errEvent?.error || errEvent);
        }
      });

      mapboxInstanceRef.current = map;
      setDiagnosticError(null);
    },
    [
      destroyCurrentMaps,
      logEngine,
      realBasemap,
      center,
      zoom,
      bearing,
      pitch,
      layerVisibility,
      layerOpacity,
      updateCursorTelemetry,
      setCenter,
      setZoom,
      setBearing,
      setPitch,
      setSelectedParcel,
      setPropertyPanelOpen,
      setActiveSelection,
      addDrawingVertex,
      setPickedCoordinate,
    ]
  );

  // --------------------------------------------------------------------------
  // LEAFLET FALLBACK ENGINE INITIALIZER
  // --------------------------------------------------------------------------
  const initLeafletMap = React.useCallback(
    (container: HTMLDivElement) => {
      destroyCurrentMaps();

      const width = container.offsetWidth;
      const height = container.offsetHeight;

      logEngine(`✓ Initializing Leaflet Engine (${width}x${height}px)`);

      const provider = BASEMAP_PROVIDERS[realBasemap] || BASEMAP_PROVIDERS.osm;
      const tileUrl = provider.tiles?.[0] || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

      const leafletMap = L.map(container, {
        center: [center[1], center[0]],
        zoom: zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(leafletMap);
      L.control.scale({ imperial: false, metric: true, position: "bottomleft" }).addTo(leafletMap);

      L.tileLayer(tileUrl, {
        attribution: provider.attribution || "© OpenStreetMap contributors",
        maxZoom: provider.maxZoom || 19,
      }).addTo(leafletMap);

      logEngine(`✓ Style loaded: ${provider.name} (Leaflet Raster)`);

      // Add Cadastral Parcels
      if (layerVisibility["layer-parcels"]) {
        L.geoJSON(CADASTRAL_PARCELS_GEOJSON as any, {
          style: (feature) => ({
            fillColor:
              feature?.properties?.status === "DISPUTED"
                ? "#ef4444"
                : feature?.properties?.landUse === "Commercial"
                ? "#3b82f6"
                : "#10b981",
            fillOpacity: ((layerOpacity["layer-parcels"] || 85) / 100) * 0.45,
            color: "#0ea5e9",
            weight: 2,
            opacity: (layerOpacity["layer-parcels"] || 85) / 100,
          }),
          onEachFeature: (feature, layer) => {
            const p = feature.properties;
            layer.bindTooltip(
              `<div class="text-xs font-mono font-bold">${p.surveyNumber}</div><div class="text-[10px] text-muted-foreground">${p.ownerName}</div>`,
              { sticky: true }
            );
            layer.on("click", () => {
              setSelectedParcel({
                id: p?.id || "parcel-01",
                ulpin: p?.ulpin || "27518001004201",
                parcelNumber: p?.parcelNumber || "P-401/A",
                surveyNumber: p?.surveyNumber || "CTS-142/1",
                ownerName: p?.ownerName || "Rajiv M. Mehra",
                carpetAreaSqm: p?.carpetAreaSqm || 1420.5,
                perimeterMeters: 154.2,
                landUse: p?.landUse || "Residential",
                state: p?.state || "Maharashtra",
                district: p?.district || "Mumbai Suburban",
                taluka: p?.taluka || "Andheri",
                village: p?.village || "Versova",
                status: p?.status || "ACTIVE",
                centroid: [72.8285, 19.1382],
                geometry: feature as any,
                registeredDate: "14-Jan-2022",
              });
              setPropertyPanelOpen(true);
              setActiveSelection(DEMO_MOTHER_PARCEL);
            });
          },
        }).addTo(leafletMap);
      }

      // Add Buildings
      if (layerVisibility["layer-buildings"]) {
        L.geoJSON(CADASTRAL_BUILDINGS_GEOJSON as any, {
          style: {
            fillColor: "#f59e0b",
            fillOpacity: ((layerOpacity["layer-buildings"] || 75) / 100) * 0.6,
            color: "#d97706",
            weight: 2,
          },
        }).addTo(leafletMap);
      }

      // Add Survey Markers
      if (layerVisibility["layer-survey-points"]) {
        L.geoJSON(SURVEY_MARKERS_GEOJSON as any, {
          pointToLayer: (feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 6,
              fillColor: "#8b5cf6",
              color: "#ffffff",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.9,
            }),
        }).addTo(leafletMap);
      }

      // Add AI Violations
      if (layerVisibility["layer-ai-violations"]) {
        L.geoJSON(AI_ENCROACHMENTS_GEOJSON as any, {
          style: {
            fillColor: "#dc2626",
            fillOpacity: ((layerOpacity["layer-ai-violations"] || 85) / 100) * 0.35,
            color: "#ef4444",
            weight: 2,
            dashArray: "4, 4",
          },
        }).addTo(leafletMap);
      }

      // Telemetry & sync events
      leafletMap.on("mousemove", (e) => {
        updateCursorTelemetry(e.latlng.lng, e.latlng.lat);
      });

      leafletMap.on("moveend", () => {
        const c = leafletMap.getCenter();
        setCenter([c.lng, c.lat]);
        setZoom(leafletMap.getZoom());
      });

      leafletMap.on("click", (e) => {
        const store = useGISStore.getState();
        if (store.drawingMode !== "none") {
          addDrawingVertex([e.latlng.lng, e.latlng.lat]);
        } else if (store.isCoordinatePickerActive) {
          const picked = coordinateProjectionService.formatPickedCoordinate(e.latlng.lng, e.latlng.lat);
          setPickedCoordinate(picked);
        }
      });

      logEngine("✓ Sources loaded (Leaflet)");
      logEngine("✓ Layers rendered (Leaflet)");

      leafletInstanceRef.current = leafletMap;
      setDiagnosticError(null);
    },
    [
      destroyCurrentMaps,
      logEngine,
      realBasemap,
      center,
      zoom,
      layerVisibility,
      layerOpacity,
      updateCursorTelemetry,
      setCenter,
      setZoom,
      setSelectedParcel,
      setPropertyPanelOpen,
      setActiveSelection,
      addDrawingVertex,
      setPickedCoordinate,
    ]
  );

  // --------------------------------------------------------------------------
  // Map Mounting & Resize Observer (Prevents Zero-Dimension Initialization)
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let resizeTimer: any;
    let initialized = false;

    const checkDimensionsAndInit = () => {
      if (!container) return;
      const w = container.offsetWidth;
      const h = container.offsetHeight;

      if (w > 0 && h > 0 && !initialized) {
        initialized = true;
        try {
          if (activeEngine === "webgl") {
            initWebGLMap(container);
          } else {
            initLeafletMap(container);
          }
        } catch (err: any) {
          console.error("Map initialization exception:", err);
          if (activeEngine === "webgl") {
            logEngine("⚠ WebGL exception thrown - failing over to Leaflet renderer...");
            setActiveEngine("leaflet");
          } else {
            setDiagnosticError({
              title: "Map Engine Initialization Failure",
              message: err?.message || "Unknown error initializing mapping engine.",
              details: err?.stack,
            });
          }
        }
      }
    };

    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!initialized) {
          checkDimensionsAndInit();
        } else {
          if (mapboxInstanceRef.current) {
            mapboxInstanceRef.current.resize();
          }
          if (leafletInstanceRef.current) {
            leafletInstanceRef.current.invalidateSize();
          }
        }
      }, 50);
    });

    observer.observe(container);
    checkDimensionsAndInit();

    return () => {
      observer.disconnect();
      clearTimeout(resizeTimer);
      destroyCurrentMaps();
    };
  }, [activeEngine, initWebGLMap, initLeafletMap, destroyCurrentMaps, logEngine]);

  // --------------------------------------------------------------------------
  // Interactive Draggable Pin Marker for Picked Coordinates
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    if (!pickedCoordinate) {
      if (mapboxMarkerRef.current) {
        mapboxMarkerRef.current.remove();
        mapboxMarkerRef.current = null;
      }
      if (leafletMarkerRef.current) {
        leafletMarkerRef.current.remove();
        leafletMarkerRef.current = null;
      }
      return;
    }

    const { lng, lat } = pickedCoordinate;

    // 1. WebGL (Mapbox GL) Draggable Marker
    if (mapboxInstanceRef.current) {
      const map = mapboxInstanceRef.current;

      if (!mapboxMarkerRef.current) {
        const el = document.createElement("div");
        el.className = "flex h-7 w-7 items-center justify-center rounded-full bg-gov-accent text-slate-950 font-bold shadow-xl border-2 border-white cursor-grab";
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

        const marker = new maplibregl.Marker({
          element: el,
          draggable: true,
        })
          .setLngLat([lng, lat])
          .addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLngLat();
          const updated = coordinateProjectionService.formatPickedCoordinate(pos.lng, pos.lat);
          setPickedCoordinate(updated);
        });

        mapboxMarkerRef.current = marker;
      } else {
        mapboxMarkerRef.current.setLngLat([lng, lat]);
      }
    }

    // 2. Leaflet Draggable Marker
    if (leafletInstanceRef.current) {
      const lMap = leafletInstanceRef.current;

      if (!leafletMarkerRef.current) {
        const lMarker = L.marker([lat, lng], { draggable: true }).addTo(lMap);
        lMarker.on("dragend", () => {
          const pos = lMarker.getLatLng();
          const updated = coordinateProjectionService.formatPickedCoordinate(pos.lng, pos.lat);
          setPickedCoordinate(updated);
        });
        leafletMarkerRef.current = lMarker;
      } else {
        leafletMarkerRef.current.setLatLng([lat, lng]);
      }
    }
  }, [pickedCoordinate, setPickedCoordinate]);

  // --------------------------------------------------------------------------
  // Basemap Tile Swapping (Zero-Reload)
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    const provider = BASEMAP_PROVIDERS[realBasemap];
    if (!provider) return;

    if (mapboxInstanceRef.current) {
      try {
        const source = mapboxInstanceRef.current.getSource("basemap-source") as any;
        if (source && typeof source.setTiles === "function") {
          source.setTiles(provider.tiles);
        }
      } catch (e) {
        console.warn("Tile update note:", e);
      }
    }

    if (leafletInstanceRef.current && mapContainerRef.current) {
      initLeafletMap(mapContainerRef.current);
    }
  }, [realBasemap, initLeafletMap]);

  // --------------------------------------------------------------------------
  // Active Vector Drawing Sync (Mapbox GL)
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    if (!mapboxInstanceRef.current) return;
    const map = mapboxInstanceRef.current;

    const source = map.getSource("active-drawing-source") as any;
    if (!source || typeof source.setData !== "function") return;

    if (activeDrawingCoords.length === 0) {
      source.setData({
        type: "FeatureCollection",
        features: [],
      });
      return;
    }

    const features: any[] = [];

    activeDrawingCoords.forEach((coord, idx) => {
      features.push({
        type: "Feature",
        properties: { vertexIndex: idx },
        geometry: {
          type: "Point",
          coordinates: coord,
        },
      });
    });

    if (activeDrawingCoords.length >= 2) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: activeDrawingCoords,
        },
      });
    }

    if (activeDrawingCoords.length >= 3 && drawingMode === "polygon") {
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[...activeDrawingCoords, activeDrawingCoords[0]]],
        },
      });
    }

    source.setData({
      type: "FeatureCollection",
      features,
    });
  }, [activeDrawingCoords, drawingMode]);

  return (
    <div className="relative flex-1 h-full w-full overflow-hidden bg-slate-950 select-none">
      {/* India Sovereign Policy Banner */}
      <IndiaPolicyBanner />

      {/* Primary Hardware Map Viewport */}
      <div
        ref={mapContainerRef}
        id="geostrata-map-canvas"
        className="h-full w-full relative outline-none"
        style={{ minHeight: "200px" }}
      />

      {/* Detailed Diagnostic Panel */}
      {diagnosticError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-lg w-full rounded-2xl border border-gov-danger/40 bg-card p-6 shadow-2xl space-y-4 text-foreground">
            <div className="flex items-center space-x-3 text-gov-danger">
              <div className="p-2.5 rounded-xl bg-gov-danger/10 border border-gov-danger/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <Badge variant="danger" size="sm" className="font-mono text-[10px]">
                  GIS DIAGNOSTIC EXCEPTION
                </Badge>
                <h3 className="text-base font-bold tracking-tight">{diagnosticError.title}</h3>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {diagnosticError.message}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveEngine("leaflet");
                  setDiagnosticError(null);
                }}
              >
                Switch to Leaflet Renderer
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setDiagnosticError(null);
                  if (mapContainerRef.current) {
                    initWebGLMap(mapContainerRef.current);
                  }
                }}
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              >
                Retry WebGL Engine
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive Coordinate Inspector */}
      <CoordinateInspector />

      {/* Engine Status & Telemetry Pill */}
      <div className="absolute top-3 right-3 z-30 flex items-center space-x-2 pointer-events-auto">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-md border border-border text-[11px] font-mono shadow-sm">
          <Activity className="h-3 w-3 text-gov-primary animate-pulse" />
          <span className="text-muted-foreground uppercase text-[9px] font-bold">ENGINE:</span>
          <span className="font-bold text-foreground">
            {activeEngine === "webgl" ? "MapLibre (WebGL)" : "Leaflet (Canvas/DOM)"}
          </span>
          <button
            onClick={() => setActiveEngine((prev) => (prev === "webgl" ? "leaflet" : "webgl"))}
            className="ml-1 text-[9px] text-gov-primary underline hover:text-gov-accent font-sans"
            title="Toggle Engine"
          >
            Switch
          </button>
        </div>

        {/* Compass Heading Indicator */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 backdrop-blur-md border border-border shadow-sm text-foreground cursor-pointer hover:bg-muted/80 transition-transform"
          onClick={() => {
            if (mapboxInstanceRef.current) {
              mapboxInstanceRef.current.resetNorthPitch();
            }
          }}
          title="Reset North & Pitch"
        >
          <Compass
            className="h-4 w-4 text-gov-primary transition-transform duration-200"
            style={{ transform: `rotate(${-bearing}deg)` }}
          />
        </div>
      </div>

      {/* Floating Basemap Gallery Selector */}
      <BasemapSwitcher />

      {/* Floating Vector Drawing Palette */}
      <DrawingPalette />

      {/* Live Turf.js Geodesic Measurement HUD */}
      <MeasurementHUD />

      {/* High-Accuracy GPS Locator Button */}
      <div className="absolute bottom-16 right-3 z-30">
        <GPSLocationButton />
      </div>
    </div>
  );
}
