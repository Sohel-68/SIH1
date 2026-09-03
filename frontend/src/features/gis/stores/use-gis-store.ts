import { create } from "zustand";
import type { TelemetryCoordinates, DrawingMode, CadastralParcel, BasemapStyle } from "../types/gis-types";
import type { RealBasemapId } from "../constants/basemap-providers";
import type { LiveMeasurementData } from "../services/drawing-service";
import type { PickedCoordinateData } from "../services/coordinate-projection-service";
import type { AdministrativeUnit } from "../constants/sample-admin-boundaries-geojson";
import { turfService } from "../services/turf-service";
import { drawingService } from "../services/drawing-service";
import { indiaBoundaryService } from "@/features/property/services/india-boundary-service";

interface GISState {
  center: [number, number]; // [lng, lat]
  zoom: number;
  bearing: number;
  pitch: number;
  realBasemap: RealBasemapId;
  basemap: BasemapStyle; // Backwards-compatible
  projection: "EPSG:4326" | "EPSG:32643";

  // UI Panels
  isLayerPanelOpen: boolean;
  isPropertyPanelOpen: boolean;
  isSearchModalOpen: boolean;
  isImportExportModalOpen: boolean;
  isBasemapSwitcherOpen: boolean;

  // Interactive Coordinate Picker
  isCoordinatePickerActive: boolean;
  pickedCoordinate: PickedCoordinateData | null;

  // Administrative Boundary Selection
  activeAdminUnit: AdministrativeUnit | null;

  // Real drawing tools
  drawingMode: DrawingMode;
  activeDrawingCoords: [number, number][];
  drawingUndoStack: [number, number][][];
  isSnappingEnabled: boolean;
  liveMeasurements: LiveMeasurementData | null;

  // India Sovereign Policy
  isOutsideIndia: boolean;

  // Selected Parcel / Feature
  selectedParcel: CadastralParcel | null;

  // Geolocation
  userLocation: [number, number] | null;
  userLocationAccuracyMeters: number | null;

  // Layer visibility & opacity
  layerVisibility: Record<string, boolean>;
  layerOpacity: Record<string, number>;

  // Cursor Telemetry
  telemetry: TelemetryCoordinates;

  // Actions
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setBearing: (bearing: number) => void;
  setPitch: (pitch: number) => void;
  setRealBasemap: (basemap: RealBasemapId) => void;
  setBasemap: (basemap: BasemapStyle) => void;
  setProjection: (projection: "EPSG:4326" | "EPSG:32643") => void;

  toggleLayerPanel: () => void;
  togglePropertyPanel: () => void;
  setLayerPanelOpen: (open: boolean) => void;
  setPropertyPanelOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setImportExportModalOpen: (open: boolean) => void;
  setBasemapSwitcherOpen: (open: boolean) => void;

  // Coordinate Picker Actions
  setCoordinatePickerActive: (active: boolean) => void;
  setPickedCoordinate: (data: PickedCoordinateData | null) => void;

  // Admin Hierarchy
  setActiveAdminUnit: (unit: AdministrativeUnit | null) => void;

  // Drawing Actions
  setDrawingMode: (mode: DrawingMode) => void;
  addDrawingVertex: (coord: [number, number]) => void;
  undoDrawingVertex: () => void;
  redoDrawingVertex: () => void;
  finishDrawing: () => void;
  cancelDrawing: () => void;
  toggleSnapping: () => void;

  // Selection
  setSelectedParcel: (parcel: CadastralParcel | null) => void;

  // Geolocation
  setUserLocation: (coords: [number, number] | null, accuracyMeters?: number) => void;

  // Layer toggles
  setLayerVisible: (layerId: string, visible: boolean) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;

  updateCursorTelemetry: (lng: number, lat: number) => void;
  resetView: () => void;
}

const DEFAULT_CENTER: [number, number] = [72.8285, 19.1382]; // Versova Cadastre
const DEFAULT_ZOOM = 16.5;

function getStoredBasemap(): RealBasemapId {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("geostrata_selected_basemap") as RealBasemapId;
      if (saved) return saved;
    } catch {}
  }
  return "osm";
}

export const useGISStore = create<GISState>((set, get) => ({
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  bearing: 0,
  pitch: 0,
  realBasemap: getStoredBasemap(),
  basemap: "dark",
  projection: "EPSG:4326",

  isLayerPanelOpen: true,
  isPropertyPanelOpen: false,
  isSearchModalOpen: false,
  isImportExportModalOpen: false,
  isBasemapSwitcherOpen: false,

  isCoordinatePickerActive: false,
  pickedCoordinate: null,
  activeAdminUnit: null,

  drawingMode: "none",
  activeDrawingCoords: [],
  drawingUndoStack: [],
  isSnappingEnabled: true,
  liveMeasurements: null,

  isOutsideIndia: false,
  selectedParcel: null,

  userLocation: null,
  userLocationAccuracyMeters: null,

  layerVisibility: {
    "layer-parcels": true,
    "layer-survey-numbers": true,
    "layer-ulpin-labels": true,
    "layer-buildings": true,
    "layer-3d-buildings": true,
    "layer-survey-points": true,
    "layer-roads": true,
    "layer-admin-bounds": true,
    "layer-villages": true,
    "layer-ai-violations": true,
    "layer-drone-imagery": false,
  },
  layerOpacity: {
    "layer-parcels": 85,
    "layer-survey-numbers": 90,
    "layer-ulpin-labels": 100,
    "layer-buildings": 75,
    "layer-3d-buildings": 80,
    "layer-survey-points": 100,
    "layer-roads": 70,
    "layer-admin-bounds": 90,
    "layer-villages": 80,
    "layer-ai-violations": 85,
    "layer-drone-imagery": 90,
  },

  telemetry: {
    lng: DEFAULT_CENTER[0],
    lat: DEFAULT_CENTER[1],
    utmEasting: 271500,
    utmNorthing: 2117200,
    utmZone: "43N",
    elevationMeters: 14.5,
    zoom: DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0,
    scaleMeters: 50,
  },

  setCenter: (center) => {
    const isInside = indiaBoundaryService.isInsideIndia(center[0], center[1]);
    set({
      center,
      isOutsideIndia: !isInside,
    });
    get().updateCursorTelemetry(center[0], center[1]);
  },

  setZoom: (zoom) => {
    set({ zoom });
    const scale = Math.round(1000 / Math.pow(2, zoom - 12));
    set((state) => ({
      telemetry: { ...state.telemetry, zoom, scaleMeters: Math.max(5, scale) },
    }));
  },

  setBearing: (bearing) => set({ bearing }),
  setPitch: (pitch) => set({ pitch }),

  setRealBasemap: (realBasemap) => {
    set({ realBasemap });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("geostrata_selected_basemap", realBasemap);
      } catch {}
    }
  },

  setBasemap: (basemap) => set({ basemap }),
  setProjection: (projection) => set({ projection }),

  toggleLayerPanel: () => set((state) => ({ isLayerPanelOpen: !state.isLayerPanelOpen })),
  togglePropertyPanel: () => set((state) => ({ isPropertyPanelOpen: !state.isPropertyPanelOpen })),
  setLayerPanelOpen: (isLayerPanelOpen) => set({ isLayerPanelOpen }),
  setPropertyPanelOpen: (isPropertyPanelOpen) => set({ isPropertyPanelOpen }),
  setSearchModalOpen: (isSearchModalOpen) => set({ isSearchModalOpen }),
  setImportExportModalOpen: (isImportExportModalOpen) => set({ isImportExportModalOpen }),
  setBasemapSwitcherOpen: (isBasemapSwitcherOpen) => set({ isBasemapSwitcherOpen }),

  setCoordinatePickerActive: (isCoordinatePickerActive) => set({ isCoordinatePickerActive }),
  setPickedCoordinate: (pickedCoordinate) => set({ pickedCoordinate }),
  setActiveAdminUnit: (activeAdminUnit) => {
    set({ activeAdminUnit });
    if (activeAdminUnit) {
      set({
        center: activeAdminUnit.centroid,
        zoom: activeAdminUnit.zoom,
      });
    }
  },

  setDrawingMode: (drawingMode) => {
    if (get().isOutsideIndia && drawingMode !== "none") {
      return;
    }
    set({
      drawingMode,
      activeDrawingCoords: [],
      drawingUndoStack: [],
      liveMeasurements: null,
    });
  },

  addDrawingVertex: (coord) => {
    const state = get();
    if (state.isOutsideIndia) return;

    let finalCoord = coord;
    if (state.isSnappingEnabled && state.activeDrawingCoords.length > 0) {
      finalCoord = drawingService.snapToNearestVertex(coord, state.activeDrawingCoords);
    }

    const newCoords: [number, number][] = [...state.activeDrawingCoords, finalCoord];
    const measurements = drawingService.computeLiveMeasurements(state.drawingMode, newCoords);

    set({
      activeDrawingCoords: newCoords,
      drawingUndoStack: [...state.drawingUndoStack, state.activeDrawingCoords],
      liveMeasurements: measurements,
    });
  },

  undoDrawingVertex: () => {
    const { drawingUndoStack, drawingMode } = get();
    if (drawingUndoStack.length === 0) return;
    const previous = drawingUndoStack[drawingUndoStack.length - 1];
    const newStack = drawingUndoStack.slice(0, -1);
    const measurements = drawingService.computeLiveMeasurements(drawingMode, previous);

    set({
      activeDrawingCoords: previous,
      drawingUndoStack: newStack,
      liveMeasurements: measurements,
    });
  },

  redoDrawingVertex: () => {},

  finishDrawing: () => {
    set({
      drawingMode: "none",
      activeDrawingCoords: [],
      drawingUndoStack: [],
      liveMeasurements: null,
    });
  },

  cancelDrawing: () => {
    set({
      drawingMode: "none",
      activeDrawingCoords: [],
      drawingUndoStack: [],
      liveMeasurements: null,
    });
  },

  toggleSnapping: () => set((state) => ({ isSnappingEnabled: !state.isSnappingEnabled })),

  setSelectedParcel: (selectedParcel) => set({ selectedParcel }),

  setUserLocation: (coords, accuracyMeters) =>
    set({
      userLocation: coords,
      userLocationAccuracyMeters: accuracyMeters || null,
    }),

  setLayerVisible: (layerId, visible) =>
    set((state) => ({
      layerVisibility: { ...state.layerVisibility, [layerId]: visible },
    })),

  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layerOpacity: { ...state.layerOpacity, [layerId]: opacity },
    })),

  updateCursorTelemetry: (lng, lat) => {
    const utm = turfService.wgs84ToUtmZone43N(lng, lat);
    set((state) => ({
      telemetry: {
        ...state.telemetry,
        lng: Math.round(lng * 1000000) / 1000000,
        lat: Math.round(lat * 1000000) / 1000000,
        utmEasting: utm.easting,
        utmNorthing: utm.northing,
        utmZone: utm.zone,
      },
    }));
  },

  resetView: () => {
    set({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      bearing: 0,
      pitch: 0,
      isOutsideIndia: false,
    });
  },
}));
