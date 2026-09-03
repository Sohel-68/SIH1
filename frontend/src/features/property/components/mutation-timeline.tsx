"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { MutationEntry } from "../types/intelligence-types";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Stamp,
  UserCheck,
  Building,
  Layers,
  FileCheck,
  Sparkles,
} from "lucide-react";

export interface MutationTimelineProps {
  entries: MutationEntry[];
  className?: string;
}

export function MutationTimeline({ entries, className }: MutationTimelineProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
        No mutation entries recorded for this cadastral parcel.
      </div>
    );
  }

  return (
    <div className={cn("relative pl-6 space-y-6 select-none", className)}>
      {/* Vertical Spine Line */}
      <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-border" />

      {entries.map((entry, index) => {
        const isSanctioned = entry.status === "SANCTIONED";

        return (
          <div key={entry.id || index} className="relative group">
            {/* Timeline Milestone Dot */}
            <div
              className={cn(
                "absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                isSanctioned
                  ? "bg-gov-primary border-background text-white shadow-sm"
                  : "bg-gov-warning border-background text-slate-950 shadow-sm"
              )}
            >
              {isSanctioned ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            </div>

            {/* Mutation Content Card */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-colors space-y-2 text-xs">
              {/* Header: Mutation Number & Status */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-foreground text-sm">
                    {entry.mutationNumber}
                  </span>
                  <Badge
                    variant={
                      entry.status === "SANCTIONED"
                        ? "success"
                        : entry.status === "DISPUTED"
                        ? "danger"
                        : "warning"
                    }
                    size="sm"
                  >
                    {entry.status}
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {entry.approvalDate || entry.filingDate}
                </span>
              </div>

              {/* Title Transfer Chain */}
              <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/60">
                <div className="flex items-center space-x-1.5 min-w-0">
                  <UserCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground truncate">{entry.previousOwner}</span>
                </div>
                <ArrowRight className="h-3 w-3 text-gov-primary shrink-0" />
                <div className="font-semibold text-foreground truncate">
                  {entry.newOwner}
                </div>
              </div>

              {/* Authority & Document Reference */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/70">
                <div className="flex items-center space-x-1">
                  <Stamp className="h-3 w-3 text-gov-accent" />
                  <span>{entry.sanctioningAuthority}</span>
                </div>
                <div className="font-mono text-foreground/80">
                  Ref: {entry.documentReference}
                </div>
              </div>

              {entry.remarks && (
                <p className="text-[11px] text-muted-foreground italic pt-0.5">
                  &ldquo;{entry.remarks}&rdquo;
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
