"use client";

import * as React from "react";
import { useAIStore } from "../stores/use-ai-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  FileSearch,
  Compass,
} from "lucide-react";

export function AIMetricsBanner() {
  const { detections, setModelModalOpen, setAdvisoryModalOpen } = useAIStore();

  const criticalCount = detections.filter((d) => d.severity === "CRITICAL").length;
  const encroachmentCount = detections.filter((d) => d.detectionType === "ENCROACHMENT").length;
  const unreviewedCount = detections.filter((d) => d.status === "UNREVIEWED").length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card shadow-sm text-xs select-none">
      {/* LEFT: Engine Status & Title */}
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/30">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-sm text-foreground tracking-tight">
              National Cadastral AI &amp; Spatial Vision Engine
            </h2>
            <Badge variant="accent" size="sm" className="font-mono text-[9px]">
              Active Inference
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Multi-spectral satellite difference detection, volumetric setback checks &amp; deed OCR auditing.
          </p>
        </div>
      </div>

      {/* CENTER: Operational Metrics */}
      <div className="flex items-center space-x-4 font-mono text-[11px]">
        <div className="flex items-center space-x-1.5">
          <span className="text-muted-foreground font-sans">Critical Violations:</span>
          <Badge variant="danger" size="sm" className="font-bold">
            {criticalCount}
          </Badge>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 border-l border-border pl-3">
          <span className="text-muted-foreground font-sans">Encroachments:</span>
          <span className="font-bold text-foreground">{encroachmentCount}</span>
        </div>

        <div className="hidden md:flex items-center space-x-1.5 border-l border-border pl-3">
          <span className="text-muted-foreground font-sans">Pending Review:</span>
          <span className="font-bold text-gov-warning">{unreviewedCount}</span>
        </div>

        <div className="hidden lg:flex items-center space-x-1.5 border-l border-border pl-3 text-gov-success">
          <Cpu className="h-3.5 w-3.5" />
          <span className="font-bold">4 Models Online</span>
        </div>
      </div>

      {/* RIGHT: Quick Action Modals */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold"
          onClick={() => setModelModalOpen(true)}
          leftIcon={<Cpu className="h-3.5 w-3.5 text-purple-500" />}
        >
          Model Registry
        </Button>

        <Button
          variant="default"
          size="sm"
          className="h-8 text-xs font-bold"
          onClick={() => setAdvisoryModalOpen(true)}
          leftIcon={<Compass className="h-3.5 w-3.5" />}
        >
          Survey AI Advisory
        </Button>
      </div>
    </div>
  );
}
