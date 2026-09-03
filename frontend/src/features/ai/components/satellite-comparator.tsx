"use client";

import * as React from "react";
import { satelliteChangeEngine } from "../services/satellite-change-engine";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Sparkles, Layers, ArrowRight } from "lucide-react";

export function SatelliteComparator() {
  const changeData = React.useMemo(() => {
    return satelliteChangeEngine.compareEpochs("parcel-02");
  }, []);

  const [epoch1, epoch2] = changeData.epochsCompared;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Sparkles className="h-4 w-4 text-gov-accent" />
            <span>Multi-Temporal Satellite Change Detection</span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Bi-temporal difference analysis detecting unauthorized additions and cadastral footprint changes.
          </p>
        </div>

        <Badge variant="warning" size="sm" className="font-mono text-[9px]">
          Confidence: {changeData.confidencePercent}%
        </Badge>
      </div>

      {/* Bi-Temporal Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Baseline 2021 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground flex items-center space-x-1 text-[11px]">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Historical Baseline ({epoch1.epochDate})</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{epoch1.satelliteSensor}</span>
          </div>

          <div className="relative h-44 w-full rounded-xl border border-border overflow-hidden bg-slate-900">
            <img
              src={epoch1.imageryUrl}
              alt="Baseline Imagery"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-white font-mono text-[10px] border border-white/20">
              Vacant Backyard
            </div>
          </div>
        </div>

        {/* Latest 2026 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground flex items-center space-x-1 text-[11px]">
              <Calendar className="h-3.5 w-3.5 text-gov-primary" />
              <span>Latest Survey ({epoch2.epochDate})</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{epoch2.satelliteSensor}</span>
          </div>

          <div className="relative h-44 w-full rounded-xl border-2 border-gov-warning overflow-hidden bg-slate-900">
            <img
              src={epoch2.imageryUrl}
              alt="Latest Imagery"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-gov-warning text-slate-950 font-bold font-mono text-[10px] shadow">
              +142 m² New Construction Detected
            </div>
          </div>
        </div>
      </div>

      {/* Metric Callout */}
      <div className="p-3 rounded-lg border border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <span className="text-muted-foreground">
          Detected: <strong className="text-foreground">1 New Unsanctioned Tin Roof Structure</strong>
        </span>
        <span className="font-mono font-bold text-gov-warning">
          Footprint Area: {changeData.totalNewBuiltupAreaSqm} m²
        </span>
      </div>
    </div>
  );
}
