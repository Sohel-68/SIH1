"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useAnalyticsStore } from "../stores/use-analytics-store";
import { STATE_CADASTRAL_DATA } from "../constants/state-cadastral-stats";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Globe, MapPin, Compass, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function LiveGISOverview() {
  const router = useRouter();
  const { setJurisdictionScope } = useAnalyticsStore();
  const [metricView, setMetricView] = React.useState<"COVERAGE" | "DENSITY" | "DISPUTES">("COVERAGE");

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Globe className="h-4 w-4 text-gov-accent" />
            <span>National Cadastral GIS &amp; ULPIN Saturation</span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Real-time geospatial synchronization across Survey of India and State Land Records Directorates.
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center space-x-1 bg-muted/40 p-1 rounded-lg border border-border">
          {(["COVERAGE", "DENSITY", "DISPUTES"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetricView(m)}
              className={cn(
                "px-2.5 py-1 rounded text-[10px] font-semibold transition-colors",
                metricView === m
                  ? "bg-gov-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* State-Wise Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-[11px]">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="p-2.5 text-left font-semibold">State / UT</th>
              <th className="p-2.5 text-left font-semibold">Total Parcels</th>
              <th className="p-2.5 text-left font-semibold">ULPINs Issued</th>
              <th className="p-2.5 text-left font-semibold">Coverage %</th>
              <th className="p-2.5 text-left font-semibold">Active Disputes</th>
              <th className="p-2.5 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {STATE_CADASTRAL_DATA.map((state) => (
              <tr key={state.stateCode} className="hover:bg-muted/20">
                <td className="p-2.5 font-bold font-sans text-foreground">
                  {state.stateName}
                  <span className="text-[10px] font-mono text-muted-foreground ml-1.5">
                    ({state.stateCode})
                  </span>
                </td>
                <td className="p-2.5 text-muted-foreground">
                  {state.totalParcels.toLocaleString()}
                </td>
                <td className="p-2.5 text-foreground font-semibold">
                  {state.ulpinGenerated.toLocaleString()}
                </td>
                <td className="p-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-10 text-right font-bold text-gov-primary">
                      {state.coveragePercent}%
                    </span>
                    <Progress value={state.coveragePercent} className="w-24 h-1.5" />
                  </div>
                </td>
                <td className="p-2.5">
                  <Badge
                    variant={state.activeDisputes > 10000 ? "danger" : "outline"}
                    size="sm"
                    className="font-mono text-[9px]"
                  >
                    {state.activeDisputes.toLocaleString()}
                  </Badge>
                </td>
                <td className="p-2.5 text-center">
                  <button
                    onClick={() => {
                      if (state.stateCode === "27") {
                        setJurisdictionScope("STATE_MH");
                      }
                      router.push("/gis");
                    }}
                    className="p-1 rounded text-gov-primary hover:bg-gov-primary/10 transition-colors inline-flex items-center space-x-0.5 text-[10px] font-sans font-semibold"
                  >
                    <span>Inspect GIS</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
