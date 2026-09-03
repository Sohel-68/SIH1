"use client";

import * as React from "react";
import { AI_INSPECTION_ALERTS } from "../constants/mock-analytics-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  AlertTriangle,
  FileSearch,
  Building,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export function AIInspectionWidgets() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Sparkles className="h-4 w-4 text-gov-accent" />
            <span>AI Cadastral Inspection &amp; Spatial Risk Placeholders</span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Predictive machine learning extension interfaces for volumetric setback violations and deed authentication.
          </p>
        </div>

        <Badge variant="outline" size="sm" className="font-mono text-[9px] text-purple-600 border-purple-500/30">
          AI Architecture Ready
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {AI_INSPECTION_ALERTS.map((alt) => (
          <div
            key={alt.id}
            className={`p-4 rounded-xl border space-y-2.5 ${
              alt.severity === "CRITICAL"
                ? "border-gov-danger/40 bg-gov-danger/5"
                : alt.severity === "HIGH"
                ? "border-gov-warning/40 bg-gov-warning/5"
                : "border-purple-500/40 bg-purple-500/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <Badge
                variant={alt.severity === "CRITICAL" ? "danger" : alt.severity === "HIGH" ? "warning" : "outline"}
                size="sm"
                className="font-bold text-[9px]"
              >
                {alt.type.replace("_", " ")}
              </Badge>
              <span className="font-mono font-bold text-xs text-foreground">
                Risk Score: {alt.riskScore}/100
              </span>
            </div>

            <div>
              <h4 className="font-bold text-foreground text-xs">{alt.title}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Target: <span className="font-mono font-semibold text-foreground">{alt.parcelOrUlpin}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">{alt.location}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px]">
              <span className="text-muted-foreground font-mono">Flagged: {alt.detectionDate}</span>
              <Badge variant="outline" size="sm" className="text-[9px]">
                {alt.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
