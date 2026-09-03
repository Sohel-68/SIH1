"use client";

import * as React from "react";
import { useGISStore } from "../stores/use-gis-store";
import { Badge } from "@/components/ui/badge";
import { Ruler, AlertTriangle, Compass, CheckCircle2, Mountain } from "lucide-react";

export function MeasurementHUD() {
  const { drawingMode, liveMeasurements, activeDrawingCoords } = useGISStore();

  if (drawingMode === "none" || !liveMeasurements || activeDrawingCoords.length < 2) {
    return null;
  }

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 rounded-2xl border border-border/80 bg-card/95 text-foreground px-4 py-2.5 shadow-2xl backdrop-blur-md flex flex-wrap items-center gap-3.5 text-xs font-mono select-none animate-in fade-in-0 duration-200">
      <div className="flex items-center space-x-1.5 font-sans font-bold text-gov-primary">
        <Ruler className="h-4 w-4" />
        <span className="uppercase text-[10px] tracking-wider">Live Cadastral HUD</span>
      </div>

      {/* Area if Polygon */}
      {liveMeasurements.areaSqm > 0 && (
        <div className="flex items-center space-x-1.5 border-l border-border pl-3">
          <span className="text-[10px] text-muted-foreground font-sans">Area:</span>
          <span className="font-bold text-foreground">
            {liveMeasurements.areaSqm.toLocaleString()} m²
          </span>
          <span className="text-[10px] text-muted-foreground font-sans">
            ({liveMeasurements.areaAcres} ac / {liveMeasurements.areaHectares} ha)
          </span>
        </div>
      )}

      {/* Perimeter */}
      {liveMeasurements.perimeterMeters > 0 && (
        <div className="flex items-center space-x-1.5 border-l border-border pl-3">
          <span className="text-[10px] text-muted-foreground font-sans">Perimeter:</span>
          <span className="font-bold text-foreground">
            {liveMeasurements.perimeterMeters.toLocaleString()} m
          </span>
        </div>
      )}

      {/* Length */}
      {liveMeasurements.lengthMeters > 0 && (
        <div className="flex items-center space-x-1.5 border-l border-border pl-3">
          <span className="text-[10px] text-muted-foreground font-sans">Length:</span>
          <span className="font-bold text-foreground">
            {liveMeasurements.lengthMeters} m
          </span>
        </div>
      )}

      {/* Bearing */}
      <div className="flex items-center space-x-1.5 border-l border-border pl-3">
        <Compass className="h-3.5 w-3.5 text-gov-accent" />
        <span className="font-bold text-foreground">
          {liveMeasurements.bearingDegrees}°
        </span>
      </div>

      {/* Elevation Placeholder */}
      <div className="flex items-center space-x-1.5 border-l border-border pl-3">
        <Mountain className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-[10px] text-muted-foreground font-sans">Elevation:</span>
        <span className="font-bold text-foreground">{liveMeasurements.elevationMeters} m</span>
      </div>

      {/* Self-intersection Warning */}
      {liveMeasurements.isSelfIntersecting ? (
        <Badge variant="danger" size="sm" className="font-sans font-bold text-[9px] flex items-center space-x-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Self-Intersecting Polygon</span>
        </Badge>
      ) : (
        <Badge variant="success" size="sm" className="font-sans font-bold text-[9px] flex items-center space-x-1">
          <CheckCircle2 className="h-3 w-3" />
          <span>Valid Topology</span>
        </Badge>
      )}
    </div>
  );
}
