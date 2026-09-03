"use client";

import * as React from "react";
import { LAND_USE_DISTRIBUTION, DIGITAL_TWIN_METRICS } from "../constants/mock-analytics-data";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, Box, Layers, PieChart, Trees, Landmark } from "lucide-react";

export function PropertyStrataCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Building2 className="h-4 w-4 text-gov-accent" />
            <span>Land Use Distribution &amp; 3D Strata Analytics</span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Zonal categorization, Floor Space Index (FSI) envelope, and vertical digital twin coverage.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" size="sm" className="font-mono text-[9px]">
            Urban: 44% &bull; Rural: 56%
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left 7 Cols: Land Use Breakdown Bars */}
        <div className="md:col-span-7 space-y-3">
          <span className="font-bold text-foreground uppercase tracking-wider text-[10px] block">
            Cadastral Land Use Classification
          </span>

          <div className="space-y-2">
            {LAND_USE_DISTRIBUTION.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-medium text-foreground">{item.category}</span>
                  <span className="font-mono text-muted-foreground">
                    {item.count.toLocaleString()} parcels &bull; <strong>{item.percentage}%</strong>
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: 3D Digital Twin Volumetric Summary */}
        <div className="md:col-span-5 p-4 rounded-xl border border-border bg-muted/20 space-y-3">
          <div className="flex items-center space-x-2">
            <Box className="h-4 w-4 text-gov-accent" />
            <span className="font-bold text-foreground text-xs uppercase tracking-wider">
              3D Digital Twin Coverage
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-card border border-border/60">
              <span className="text-[10px] text-muted-foreground block font-sans">Towers Modelled</span>
              <span className="font-bold text-foreground text-sm">
                {DIGITAL_TWIN_METRICS.buildingsModelled.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-card border border-border/60">
              <span className="text-[10px] text-muted-foreground block font-sans">Floors Extruded</span>
              <span className="font-bold text-foreground text-sm">
                {DIGITAL_TWIN_METRICS.totalFloorsExtruded.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-card border border-border/60">
              <span className="text-[10px] text-muted-foreground block font-sans">Strata Units</span>
              <span className="font-bold text-foreground text-sm">
                {DIGITAL_TWIN_METRICS.totalUnitsMapped.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-card border border-border/60">
              <span className="text-[10px] text-muted-foreground block font-sans">Avg Height</span>
              <span className="font-bold text-foreground text-sm">
                {DIGITAL_TWIN_METRICS.averageBuildingHeightMeters} m
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">3D Engine Sync Status:</span>
            <Badge variant="success" size="sm" dot>
              {DIGITAL_TWIN_METRICS.syncStatus}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
