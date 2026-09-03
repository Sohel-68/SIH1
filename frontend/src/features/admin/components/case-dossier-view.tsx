"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useWorkflowStore } from "../stores/use-workflow-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  Box,
  FileCheck,
  Download,
  Paperclip,
} from "lucide-react";

export function CaseDossierView() {
  const router = useRouter();
  const { cases, selectedCaseId } = useWorkflowStore();
  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4 text-xs select-none">
      {/* Dossier Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-black text-sm text-gov-primary">
              {selectedCase.caseNumber}
            </span>
            <Badge variant="outline" size="sm" className="font-mono text-[9px]">
              {selectedCase.caseType.replace("_", " ")}
            </Badge>
            <Badge
              variant={
                selectedCase.status === "APPROVED"
                  ? "success"
                  : selectedCase.status === "REJECTED"
                  ? "danger"
                  : "warning"
              }
              size="sm"
            >
              {selectedCase.status.replace("_", " ")}
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-foreground">{selectedCase.title}</h3>
          <p className="text-[11px] text-muted-foreground font-mono">
            E-Office File: {selectedCase.fileNumber} &bull; Dept: {selectedCase.currentDepartment}
          </p>
        </div>

        {/* SLA Callout */}
        <div className="p-2.5 rounded-xl border border-border bg-muted/30 text-center font-mono">
          <span className="text-[10px] text-muted-foreground block font-sans">Statutory Deadline</span>
          <span className="text-sm font-bold text-foreground block">
            {selectedCase.statutoryDeadline}
          </span>
          <span
            className={`text-[9px] font-bold block ${
              selectedCase.slaDaysRemaining < 0
                ? "text-gov-danger"
                : selectedCase.slaDaysRemaining <= 2
                ? "text-gov-warning"
                : "text-gov-success"
            }`}
          >
            {selectedCase.slaDaysRemaining < 0
              ? `${Math.abs(selectedCase.slaDaysRemaining)} Days Overdue`
              : `${selectedCase.slaDaysRemaining} Days Remaining`}
          </span>
        </div>
      </div>

      {/* Applicant & Property Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
        <div className="p-3 rounded-lg border border-border bg-card space-y-1">
          <span className="text-[10px] text-muted-foreground block font-sans">Applicant Details</span>
          <span className="font-bold text-foreground block">{selectedCase.applicantName}</span>
          <span className="text-[10px] text-muted-foreground block">{selectedCase.applicantMaskedId}</span>
        </div>

        <div className="p-3 rounded-lg border border-border bg-card space-y-1">
          <span className="text-[10px] text-muted-foreground block font-sans">Cadastral Location</span>
          <span className="font-bold text-foreground block">
            Village: {selectedCase.village} &bull; CTS-{selectedCase.surveyNumber}
          </span>
          {selectedCase.targetUlpin && (
            <span className="text-[10px] text-gov-primary font-bold truncate block" title={selectedCase.targetUlpin}>
              ULPIN: {selectedCase.targetUlpin}
            </span>
          )}
        </div>
      </div>

      {/* Attachments List */}
      {selectedCase.attachments.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="font-bold text-foreground uppercase tracking-wider text-[10px] flex items-center space-x-1">
            <Paperclip className="h-3.5 w-3.5 text-gov-accent" />
            <span>Case File Evidentiary Attachments ({selectedCase.attachments.length})</span>
          </span>

          <div className="space-y-1.5">
            {selectedCase.attachments.map((att) => (
              <div
                key={att.id}
                className="p-2.5 rounded-lg border border-border bg-muted/20 flex items-center justify-between font-mono text-[10px]"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gov-primary shrink-0" />
                  <div>
                    <span className="font-bold text-foreground block">{att.name}</span>
                    <span className="text-muted-foreground text-[9px]">
                      {att.size} &bull; SHA-256: {att.sha256Hash.substring(0, 16)}...
                    </span>
                  </div>
                </div>

                <Badge variant="outline" size="sm" className="font-mono text-[9px]">
                  VERIFIED
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spatial Inspection Links */}
      <div className="pt-2 border-t border-border flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold"
          onClick={() => router.push("/gis")}
          leftIcon={<MapPin className="h-3.5 w-3.5 text-gov-primary" />}
        >
          View Cadastral Map (2D)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold"
          onClick={() => router.push("/viewer-3d")}
          leftIcon={<Box className="h-3.5 w-3.5 text-gov-accent" />}
        >
          View Strata Digital Twin (3D)
        </Button>
      </div>
    </div>
  );
}
