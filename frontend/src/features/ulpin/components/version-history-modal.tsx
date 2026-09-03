"use client";

import * as React from "react";
import { useULPINStore } from "../stores/use-ulpin-store";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Layers,
  Calendar,
  User,
} from "lucide-react";

export function VersionHistoryModal() {
  const { registry, activeUlpinId, isVersionModalOpen, setVersionModalOpen, selectRecord } =
    useULPINStore();

  const currentRecord = registry.find((r) => r.id === activeUlpinId) || registry[0];

  // Find all records that belong to this parcel / baseUlpin
  const versionChain = registry
    .filter(
      (r) =>
        r.baseUlpin === currentRecord.baseUlpin &&
        r.hierarchy.unitNumber === currentRecord.hierarchy.unitNumber
    )
    .sort((a, b) => b.version - a.version);

  return (
    <Dialog
      isOpen={isVersionModalOpen}
      onClose={() => setVersionModalOpen(false)}
      maxWidth="md"
      title="ULPIN Version Lineage & Revision History"
      description="Complete immutable version history. Previous ULPIN records are archived and never overwritten."
      footer={
        <Button variant="default" size="sm" onClick={() => setVersionModalOpen(false)}>
          Close History
        </Button>
      }
    >
      <div className="space-y-4 pt-2 text-xs">
        {/* Header identifier */}
        <div className="p-3 rounded-xl border border-border bg-muted/20 flex justify-between items-center">
          <div>
            <span className="font-bold text-foreground text-xs block">
              {currentRecord.ulpin3D || currentRecord.baseUlpin}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Survey No: {currentRecord.hierarchy.surveyNumber} &bull; Parcel {currentRecord.hierarchy.parcelNumber}
            </span>
          </div>
          <Badge variant="outline" size="sm" className="font-mono">
            {versionChain.length} Total Versions
          </Badge>
        </div>

        {/* Timeline of Versions */}
        <div className="space-y-3">
          {versionChain.map((rec, idx) => {
            const isLatest = rec.isCurrent;

            return (
              <div
                key={rec.id}
                className={`p-3.5 rounded-xl border space-y-2 transition-colors ${
                  isLatest
                    ? "border-gov-success/40 bg-gov-success/5 shadow-sm"
                    : "border-border bg-card/60 opacity-90"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-foreground text-xs">
                      Version {rec.version}
                    </span>
                    <Badge variant={isLatest ? "success" : "warning"} size="sm">
                      {isLatest ? "CURRENT ACTIVE" : "SUPERSEDED"}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{rec.issueDate}</span>
                  </span>
                </div>

                <div className="text-[11px] space-y-1">
                  <p>
                    <span className="text-muted-foreground">Owner(s):</span>{" "}
                    <strong className="text-foreground">{rec.ownerName}</strong>
                  </p>
                  {rec.reasonForRevision && (
                    <p className="text-amber-800 text-[10px] pt-1">
                      <strong>Revision Note:</strong> {rec.reasonForRevision}
                    </p>
                  )}
                  {rec.supersededByUlpin && (
                    <p className="text-muted-foreground text-[10px]">
                      Superseded By: <strong className="font-mono text-foreground">{rec.supersededByUlpin}</strong>
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-border flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                  <span className="truncate max-w-[240px]">Hash: {rec.verificationHash.slice(0, 20)}...</span>
                  <button
                    onClick={() => {
                      selectRecord(rec.id);
                      setVersionModalOpen(false);
                    }}
                    className="text-gov-primary font-semibold hover:underline"
                  >
                    Select This Record
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
}
