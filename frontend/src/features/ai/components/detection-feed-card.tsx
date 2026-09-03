"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useAIStore } from "../stores/use-ai-store";
import type { AISeverity, AIDetectionType } from "../types/ai-types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  FileSearch,
  Building,
  Radio,
  Eye,
} from "lucide-react";

export function DetectionFeedCard() {
  const {
    detections,
    selectedDetectionId,
    selectDetection,
    severityFilter,
    setSeverityFilter,
  } = useAIStore();

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredDetections = detections.filter((d) => {
    if (severityFilter !== "ALL" && d.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.targetUlpin.toLowerCase().includes(q) ||
        d.detectionType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityBadge = (severity: AISeverity) => {
    switch (severity) {
      case "CRITICAL":
        return <Badge variant="danger" size="sm" className="font-bold text-[9px]">CRITICAL</Badge>;
      case "HIGH":
        return <Badge variant="warning" size="sm" className="font-bold text-[9px]">HIGH</Badge>;
      case "MEDIUM":
        return <Badge variant="outline" size="sm" className="text-purple-600 border-purple-500/40 text-[9px]">MEDIUM</Badge>;
      default:
        return <Badge variant="outline" size="sm" className="text-[9px]">{severity}</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-3 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/70">
        <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-gov-accent" />
          <span>Automated Detection Stream ({detections.length})</span>
        </h3>

        {/* Severity Filter Pills */}
        <div className="flex items-center space-x-1">
          {(["ALL", "CRITICAL", "HIGH", "MEDIUM"] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-semibold transition-colors",
                severityFilter === sev
                  ? "bg-gov-primary text-white"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted"
              )}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <Input
        placeholder="Filter by title, ULPIN, or violation type..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-8 text-xs"
        leftIcon={<Search className="h-3.5 w-3.5" />}
      />

      {/* Detections List */}
      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
        {filteredDetections.map((d) => {
          const isSelected = d.id === selectedDetectionId;

          return (
            <div
              key={d.id}
              onClick={() => selectDetection(d.id)}
              className={cn(
                "p-3 rounded-xl border transition-all cursor-pointer space-y-1.5",
                isSelected
                  ? "border-gov-primary bg-gov-primary/5 shadow-sm ring-1 ring-gov-primary/30"
                  : "border-border bg-card/60 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  {getSeverityBadge(d.severity)}
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {d.detectionType.replace("_", " ")}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-gov-primary font-bold">
                  {d.explanation.confidencePercent}% Conf.
                </span>
              </div>

              <div>
                <h4 className="font-bold text-foreground text-xs leading-snug">{d.title}</h4>
                <p className="text-[10px] font-mono text-muted-foreground truncate">
                  ULPIN: {d.targetUlpin}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/50 text-muted-foreground">
                <span>{d.detectedAt}</span>
                <Badge variant="outline" size="sm" className="text-[9px]">
                  {d.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
