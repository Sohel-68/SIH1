"use client";

import * as React from "react";
import { useGISStore } from "../stores/use-gis-store";
import type { DrawingMode } from "../types/gis-types";
import {
  MousePointer,
  Square,
  Circle,
  Slash,
  PenTool,
  Magnet,
  Undo2,
  Check,
  X,
  MapPin,
} from "lucide-react";

export function DrawingPalette() {
  const {
    drawingMode,
    setDrawingMode,
    isSnappingEnabled,
    toggleSnapping,
    undoDrawingVertex,
    finishDrawing,
    cancelDrawing,
    activeDrawingCoords,
    isOutsideIndia,
  } = useGISStore();

  const tools: { id: DrawingMode; label: string; icon: React.ReactNode }[] = [
    { id: "none", label: "Pan & Inspect", icon: <MousePointer className="h-4 w-4" /> },
    { id: "polygon", label: "Draw Polygon", icon: <PenTool className="h-4 w-4" /> },
    { id: "line", label: "Draw Line / Boundary", icon: <Slash className="h-4 w-4" /> },
    { id: "point", label: "Drop Boundary Stone", icon: <MapPin className="h-4 w-4" /> },
    { id: "rectangle", label: "Draw Rectangle", icon: <Square className="h-4 w-4" /> },
    { id: "circle", label: "Draw Radius Buffer", icon: <Circle className="h-4 w-4" /> },
  ];

  return (
    <div className="absolute top-16 right-4 z-30 flex flex-col items-center gap-1.5 p-1.5 rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-md select-none">
      {tools.map((t) => {
        const isActive = drawingMode === t.id;
        const isDisabled = isOutsideIndia && t.id !== "none";

        return (
          <button
            key={t.id}
            onClick={() => setDrawingMode(t.id)}
            disabled={isDisabled}
            className={`p-2 rounded-xl transition-all ${
              isActive
                ? "bg-gov-primary text-white shadow-md scale-105"
                : isDisabled
                ? "opacity-40 cursor-not-allowed text-muted-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
            title={isDisabled ? "Drawing restricted to India" : t.label}
            aria-label={t.label}
          >
            {t.icon}
          </button>
        );
      })}

      <div className="w-6 h-px bg-border/80 my-0.5" />

      {/* Snapping Toggle */}
      <button
        onClick={toggleSnapping}
        className={`p-2 rounded-xl transition-all ${
          isSnappingEnabled
            ? "bg-gov-accent/20 text-gov-accent font-bold"
            : "text-muted-foreground hover:bg-muted/60"
        }`}
        title={`Vertex Snapping: ${isSnappingEnabled ? "ENABLED" : "DISABLED"}`}
        aria-label="Toggle Vertex Snapping"
      >
        <Magnet className="h-4 w-4" />
      </button>

      {/* Active Drawing Controls (Undo, Finish, Cancel) */}
      {drawingMode !== "none" && (
        <>
          <div className="w-6 h-px bg-border/80 my-0.5" />

          <button
            onClick={undoDrawingVertex}
            disabled={activeDrawingCoords.length === 0}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-40 transition-all"
            title="Undo Last Vertex"
            aria-label="Undo Last Vertex"
          >
            <Undo2 className="h-4 w-4" />
          </button>

          <button
            onClick={finishDrawing}
            disabled={activeDrawingCoords.length < 2}
            className="p-2 rounded-xl bg-gov-success text-white hover:bg-gov-success/90 disabled:opacity-40 shadow-sm transition-all"
            title="Finish Drawing & Save"
            aria-label="Finish Drawing"
          >
            <Check className="h-4 w-4" />
          </button>

          <button
            onClick={cancelDrawing}
            className="p-2 rounded-xl bg-gov-danger/10 text-gov-danger hover:bg-gov-danger/20 transition-all"
            title="Cancel Drawing"
            aria-label="Cancel Drawing"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
