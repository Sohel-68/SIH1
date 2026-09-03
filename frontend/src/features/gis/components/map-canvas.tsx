"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useGISStore } from "../stores/use-gis-store";
import { useLayerStore } from "../stores/use-layer-store";
import { useSelectionStore } from "../stores/use-selection-store";
import { useDrawingStore } from "../stores/use-drawing-store";
import { useMeasurementStore } from "../stores/use-measurement-store";
import { turfService } from "../services/turf-service";
import type { CadastralParcel } from "../types/gis-types";
import { BASEMAP_PRESETS } from "../constants/basemaps";
import {
  Compass,
  Plus,
  Minus,
  Maximize2,
  Navigation,
  Crosshair,
  Layers,
} from "lucide-react";

export function MapCanvas() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Stores
  const {
    center,
    zoom,
    bearing,
    basemap,
    setCenter,
    setZoom,
    setBearing,
    resetView,
    updateCursorTelemetry,
    setPropertyPanelOpen,
  } = useGISStore();

  const { layers } = useLayerStore();
  const { parcels, selectedParcel, selectParcel, hoveredParcelId, setHoveredParcelId } =
    useSelectionStore();

  const {
    mode: drawingMode,
    activePoints,
    isSnappingEnabled,
    snapToleranceMeters,
    addPoint,
    updateLastPoint,
    finishDrawing,
    drawnFeatures,
  } = useDrawingStore();

  const { measurementType, points: measurePoints, addMeasurementPoint, result: measureResult } =
    useMeasurementStore();

  // Dragging / Pan state
  const [isPanning, setIsPanning] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number } | null>(null);
  const [snapPoint, setSnapPoint] = React.useState<[number, number] | null>(null);

  // Active layer visibility checks
  const isParcelsVisible = layers.find((l) => l.id === "layer-parcels")?.visible ?? true;
  const parcelsOpacity = layers.find((l) => l.id === "layer-parcels")?.opacity ?? 0.85;
  const isUlpinVisible = layers.find((l) => l.id === "layer-ulpin-labels")?.visible ?? true;
  const isBuildingsVisible = layers.find((l) => l.id === "layer-buildings")?.visible ?? true;
  const isSurveyVisible = layers.find((l) => l.id === "layer-survey-points")?.visible ?? true;
  const isRoadsVisible = layers.find((l) => l.id === "layer-roads")?.visible ?? true;

  // Geographic projection to screen pixels
  const coordToPixel = React.useCallback(
    (lng: number, lat: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // Web Mercator / Equirectangular scale factor approximation
      const scale = Math.pow(2, zoom) * 350;
      const x = width / 2 + (lng - center[0]) * scale;
      const y = height / 2 - (lat - center[1]) * scale;

      return { x, y };
    },
    [center, zoom]
  );

  const pixelToCoord = React.useCallback(
    (x: number, y: number): [number, number] => {
      if (!containerRef.current) return center;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const scale = Math.pow(2, zoom) * 350;

      const lng = center[0] + (x - width / 2) / scale;
      const lat = center[1] - (y - height / 2) / scale;

      return [lng, lat];
    },
    [center, zoom]
  );

  // Collect all vertices from parcels for snapping
  const allCadastralVertices = React.useMemo(() => {
    const vList: [number, number][] = [];
    parcels.forEach((p) => {
      if (p.geometry.geometry.type === "Polygon") {
        p.geometry.geometry.coordinates[0].forEach((c) => vList.push([c[0], c[1]]));
      }
    });
    return vList;
  }, [parcels]);

  // Mouse Handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPanning && dragStart) {
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      const scale = Math.pow(2, zoom) * 350;

      const newLng = center[0] - dx / scale;
      const newLat = center[1] + dy / scale;
      setCenter([newLng, newLat]);
      setDragStart({ x, y });
      return;
    }

    let [lng, lat] = pixelToCoord(x, y);

    // Snapping detection if drawing
    if (drawingMode !== "none" && isSnappingEnabled) {
      const snap = turfService.findSnapVertex([lng, lat], allCadastralVertices, snapToleranceMeters);
      if (snap.snapped) {
        lng = snap.point[0];
        lat = snap.point[1];
        setSnapPoint(snap.point);
      } else {
        setSnapPoint(null);
      }
    } else {
      setSnapPoint(null);
    }

    updateCursorTelemetry(lng, lat);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan on middle click or when in default exploration mode
    if (e.button === 0 && drawingMode === "none" && measurementType === "none") {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setIsPanning(true);
        setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDragStart(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    const newZoom = Math.min(22, Math.max(12, zoom + delta));
    setZoom(newZoom);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let [lng, lat] = pixelToCoord(x, y);

    // Apply snap point if available
    if (snapPoint) {
      lng = snapPoint[0];
      lat = snapPoint[1];
    }

    // If drawing mode active
    if (drawingMode !== "none") {
      addPoint([lng, lat]);
      return;
    }

    // If measurement mode active
    if (measurementType !== "none") {
      addMeasurementPoint([lng, lat]);
      return;
    }
  };

  const handleParcelClick = (e: React.MouseEvent, parcel: CadastralParcel) => {
    e.stopPropagation();
    if (drawingMode !== "none" || measurementType !== "none") {
      handleCanvasClick(e);
      return;
    }
    selectParcel(parcel);
    setPropertyPanelOpen(true);
  };

  const activeBasemap = BASEMAP_PRESETS[basemap] || BASEMAP_PRESETS.dark;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleCanvasClick}
      className={cn(
        "relative flex-1 w-full h-full overflow-hidden select-none",
        isPanning ? "cursor-grabbing" : drawingMode !== "none" ? "cursor-crosshair" : "cursor-grab"
      )}
      style={{
        backgroundColor: activeBasemap.thumbnailColor,
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Basemap Cartographic Background Layer                      */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {/* Procedural Cartographic Grid & Benchmarks */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              basemap === "dark" || basemap === "satellite" || basemap === "hybrid"
                ? `linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                   linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`
                : `linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
                   linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)`,
            backgroundSize: `${Math.pow(2, zoom - 12) * 8}px ${Math.pow(2, zoom - 12) * 8}px`,
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Interactive SVG Vector Layers Engine                       */}
      {/* ------------------------------------------------------------- */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* A. Municipal Roads & Access Corridors */}
        {isRoadsVisible && (
          <g opacity={0.6}>
            <line
              x1={coordToPixel(72.825, 19.1388).x}
              y1={coordToPixel(72.825, 19.1388).y}
              x2={coordToPixel(72.833, 19.1388).x}
              y2={coordToPixel(72.833, 19.1388).y}
              stroke="#64748b"
              strokeWidth={Math.max(6, Math.pow(2, zoom - 14) * 5)}
              strokeLinecap="round"
            />
            <line
              x1={coordToPixel(72.8293, 19.135).x}
              y1={coordToPixel(72.8293, 19.135).y}
              x2={coordToPixel(72.8293, 19.141).x}
              y2={coordToPixel(72.8293, 19.141).y}
              stroke="#64748b"
              strokeWidth={Math.max(5, Math.pow(2, zoom - 14) * 4)}
              strokeLinecap="round"
            />
          </g>
        )}

        {/* B. Cadastral Parcels (Polygons) */}
        {isParcelsVisible &&
          parcels.map((parcel) => {
            if (parcel.geometry.geometry.type !== "Polygon") return null;
            const ring = parcel.geometry.geometry.coordinates[0];
            const pointsString = ring.map((c) => `${coordToPixel(c[0], c[1]).x},${coordToPixel(c[0], c[1]).y}`).join(" ");

            const isSelected = selectedParcel?.id === parcel.id;
            const isHovered = hoveredParcelId === parcel.id;

            // Status color matching
            const statusBorderMap = {
              ACTIVE: "#2563eb",
              PENDING_SURVEY: "#f59e0b",
              DISPUTED: "#ef4444",
              LOCKED: "#64748b",
            };

            const strokeColor = isSelected ? "#06b6d4" : statusBorderMap[parcel.status] || "#2563eb";
            const fillColor = isSelected
              ? "rgba(6, 182, 212, 0.25)"
              : isHovered
              ? "rgba(37, 99, 235, 0.2)"
              : `rgba(37, 99, 235, ${0.12 * parcelsOpacity})`;

            return (
              <g
                key={parcel.id}
                className="pointer-events-auto cursor-pointer transition-all"
                onClick={(e) => handleParcelClick(e, parcel)}
                onMouseEnter={() => setHoveredParcelId(parcel.id)}
                onMouseLeave={() => setHoveredParcelId(null)}
              >
                {/* Parcel Boundary Polygon */}
                <polygon
                  points={pointsString}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 3 : 1.75}
                  strokeDasharray={parcel.status === "DISPUTED" ? "4 2" : undefined}
                />

                {/* Vertex Markers when Selected */}
                {isSelected &&
                  ring.map((c, vIdx) => {
                    const { x, y } = coordToPixel(c[0], c[1]);
                    return (
                      <circle
                        key={vIdx}
                        cx={x}
                        cy={y}
                        r={4}
                        fill="#06b6d4"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                    );
                  })}
              </g>
            );
          })}

        {/* C. Building Footprints (Extrusion base) */}
        {isBuildingsVisible &&
          parcels.slice(0, 3).map((parcel) => {
            const centroid = parcel.centroid;
            const { x, y } = coordToPixel(centroid[0], centroid[1]);
            const bWidth = Math.max(20, Math.pow(2, zoom - 14) * 22);
            const bHeight = Math.max(16, Math.pow(2, zoom - 14) * 18);

            return (
              <rect
                key={`bldg-${parcel.id}`}
                x={x - bWidth / 2}
                y={y - bHeight / 2}
                width={bWidth}
                height={bHeight}
                fill="rgba(139, 92, 246, 0.35)"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                rx={2}
                className="pointer-events-none"
              />
            );
          })}

        {/* D. DGPS Survey Benchmarks (GCPs) */}
        {isSurveyVisible &&
          parcels.map((parcel, idx) => {
            if (parcel.geometry.geometry.type !== "Polygon") return null;
            const ring = parcel.geometry.geometry.coordinates[0];
            const firstVertex = ring[0];
            const { x, y } = coordToPixel(firstVertex[0], firstVertex[1]);

            return (
              <g key={`survey-pt-${idx}`} className="pointer-events-none">
                <circle cx={x} cy={y} r={5} fill="#f59e0b" stroke="#ffffff" strokeWidth={1.5} />
                <circle cx={x} cy={y} r={10} fill="none" stroke="#f59e0b" strokeWidth={0.75} opacity={0.6} />
              </g>
            );
          })}

        {/* E. Active Drawing Mode Coordinates & Preview */}
        {drawingMode !== "none" && activePoints.length > 0 && (
          <g className="pointer-events-none">
            {activePoints.map((pt, idx) => {
              const { x, y } = coordToPixel(pt[0], pt[1]);
              return (
                <circle
                  key={`draw-pt-${idx}`}
                  cx={x}
                  cy={y}
                  r={5}
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              );
            })}
            {activePoints.length >= 2 && (
              <polyline
                points={activePoints.map((pt) => `${coordToPixel(pt[0], pt[1]).x},${coordToPixel(pt[0], pt[1]).y}`).join(" ")}
                fill={drawingMode === "polygon" ? "rgba(6, 182, 212, 0.2)" : "none"}
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray="4 2"
              />
            )}
          </g>
        )}

        {/* F. Active Measurement Mode Visualization */}
        {measurementType !== "none" && measurePoints.length > 0 && (
          <g className="pointer-events-none">
            {measurePoints.map((pt, idx) => {
              const { x, y } = coordToPixel(pt[0], pt[1]);
              return (
                <circle
                  key={`measure-pt-${idx}`}
                  cx={x}
                  cy={y}
                  r={4}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              );
            })}
            {measurePoints.length >= 2 && (
              <polyline
                points={measurePoints.map((pt) => `${coordToPixel(pt[0], pt[1]).x},${coordToPixel(pt[0], pt[1]).y}`).join(" ")}
                fill={measurementType === "area" ? "rgba(245, 158, 11, 0.2)" : "none"}
                stroke="#f59e0b"
                strokeWidth={2}
              />
            )}
          </g>
        )}

        {/* G. Snapping Target Indicator */}
        {snapPoint && (
          <circle
            cx={coordToPixel(snapPoint[0], snapPoint[1]).x}
            cy={coordToPixel(snapPoint[0], snapPoint[1]).y}
            r={8}
            fill="none"
            stroke="#22c55e"
            strokeWidth={2}
            className="animate-ping"
          />
        )}
      </svg>

      {/* ------------------------------------------------------------- */}
      {/* 3. Centroid 3D ULPIN Bhu-Aadhaar HTML Markers                 */}
      {/* ------------------------------------------------------------- */}
      {isUlpinVisible &&
        parcels.map((parcel) => {
          const { x, y } = coordToPixel(parcel.centroid[0], parcel.centroid[1]);
          const isSelected = selectedParcel?.id === parcel.id;

          return (
            <div
              key={`ulpin-tag-${parcel.id}`}
              style={{ left: `${x}px`, top: `${y}px` }}
              onClick={(e) => handleParcelClick(e, parcel)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight shadow-md transition-all cursor-pointer whitespace-nowrap border select-none",
                isSelected
                  ? "bg-gov-accent text-slate-950 border-white ring-2 ring-gov-accent/40"
                  : "bg-card/90 text-foreground border-border/80 hover:bg-gov-primary hover:text-white"
              )}
            >
              <span>{parcel.ulpin.slice(-6)}</span>
            </div>
          );
        })}

      {/* ------------------------------------------------------------- */}
      {/* 4. Live Geodesic Measurement HUD Pill                         */}
      {/* ------------------------------------------------------------- */}
      {measureResult && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-card/95 border border-gov-warning/40 shadow-xl backdrop-blur-md flex items-center space-x-3 text-xs">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gov-warning/15 text-gov-warning font-bold">
            📐
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-foreground font-mono text-sm">
                {measureResult.primaryValue}
              </span>
              <span className="text-[10px] uppercase font-bold text-gov-warning">
                {measureResult.type}
              </span>
            </div>
            {measureResult.secondaryValue && (
              <p className="text-[11px] text-muted-foreground">{measureResult.secondaryValue}</p>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. On-Map Navigation & Orientation Controls (Right Rail)      */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1.5">
        {/* North Compass / Reset Bearing */}
        <button
          onClick={() => setBearing(0)}
          className="p-2 rounded-lg bg-card/90 border border-border text-foreground hover:bg-muted shadow-md transition-all"
          title="Reset Bearing (North)"
          aria-label="Reset Bearing (North)"
        >
          <Compass className="h-4 w-4 text-gov-danger" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-lg bg-card/90 border border-border shadow-md overflow-hidden divide-y divide-border">
          <button
            onClick={() => setZoom(Math.min(22, zoom + 1))}
            className="p-2 text-foreground hover:bg-muted transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom(Math.max(12, zoom - 1))}
            className="p-2 text-foreground hover:bg-muted transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* Locate Me (GPS) */}
        <button
          onClick={resetView}
          className="p-2 rounded-lg bg-card/90 border border-border text-foreground hover:bg-muted shadow-md transition-all"
          title="Locate Cadastre Centroid"
          aria-label="Locate Cadastre Centroid"
        >
          <Navigation className="h-4 w-4 text-gov-primary" />
        </button>
      </div>
    </div>
  );
}
