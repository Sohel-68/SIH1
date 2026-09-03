"use client";

import * as React from "react";
import { useGISStore } from "../stores/use-gis-store";
import { useDrawingStore } from "../stores/use-drawing-store";
import { useMeasurementStore } from "../stores/use-measurement-store";
import { Badge } from "@/components/ui/badge";
import { Globe, Crosshair, Mountain, Ruler, Layers } from "lucide-react";

export function TelemetryBar() {
  const { telemetry, projection, setProjection } = useGISStore();
  const { mode: drawingMode } = useDrawingStore();
  const { measurementType } = useMeasurementStore();

  return (
    <div className="flex h-8 w-full items-center justify-between border-t border-border bg-card/95 px-3 text-[11px] font-mono text-muted-foreground select-none z-20 backdrop-blur-md">
      {/* Left: Coordinates & Projection */}
      <div className="flex items-center space-x-3 overflow-hidden">
        {/* WGS84 Lat/Long */}
        <div className="flex items-center space-x-1 shrink-0">
          <Globe className="h-3 w-3 text-gov-primary" />
          <span className="font-semibold text-foreground">
            {telemetry.lat.toFixed(6)}° N, {telemetry.lng.toFixed(6)}° E
          </span>
        </div>

        {/* UTM Zone 43N */}
        <div className="hidden md:flex items-center space-x-1 shrink-0 border-l border-border pl-3">
          <Crosshair className="h-3 w-3 text-gov-accent" />
          <span>
            UTM {telemetry.utmZone}: {telemetry.utmEasting.toLocaleString()} m E,{" "}
            {telemetry.utmNorthing.toLocaleString()} m N
          </span>
        </div>

        {/* Elevation */}
        <div className="hidden lg:flex items-center space-x-1 shrink-0 border-l border-border pl-3">
          <Mountain className="h-3 w-3 text-gov-warning" />
          <span>Elev: {telemetry.elevationMeters} m AMSL</span>
        </div>
      </div>

      {/* Right: Scale, Zoom, Mode Badge, CRS */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Active Mode Notice */}
        {drawingMode !== "none" && (
          <Badge variant="accent" size="sm" className="font-mono text-[9px] py-0">
            DRAW: {drawingMode.toUpperCase()}
          </Badge>
        )}
        {measurementType !== "none" && (
          <Badge variant="warning" size="sm" className="font-mono text-[9px] py-0">
            MEASURE: {measurementType.toUpperCase()}
          </Badge>
        )}

        {/* Zoom Level */}
        <span className="hidden sm:inline font-semibold text-foreground">
          z{telemetry.zoom.toFixed(1)}
        </span>

        {/* Scale Bar */}
        <div className="hidden sm:flex items-center space-x-1 border-l border-border pl-3">
          <div className="h-1.5 w-12 border-b-2 border-l-2 border-r-2 border-foreground" />
          <span>{telemetry.scaleMeters}m</span>
        </div>

        {/* CRS Badge / Toggle */}
        <button
          onClick={() =>
            setProjection(projection === "EPSG:4326" ? "EPSG:32643" : "EPSG:4326")
          }
          className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground font-bold text-[10px] transition-colors"
          title="Click to toggle CRS"
        >
          {projection}
        </button>
      </div>
    </div>
  );
}
