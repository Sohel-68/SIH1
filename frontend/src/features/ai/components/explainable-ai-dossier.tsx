"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAIStore } from "../stores/use-ai-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  AlertTriangle,
  Scale,
  FileText,
  MapPin,
  Box,
  CheckCircle2,
  XCircle,
  Send,
  ExternalLink,
} from "lucide-react";

export function ExplainableAIDossier() {
  const router = useRouter();
  const { detections, selectedDetectionId, updateDetectionStatus } = useAIStore();
  const selected = detections.find((d) => d.id === selectedDetectionId) || detections[0];

  const handleAction = (status: "CONFIRMED_VIOLATION" | "FALSE_POSITIVE" | "NOTICE_ISSUED") => {
    updateDetectionStatus(selected.id, status, `Updated by Official Reviewer at ${new Date().toLocaleTimeString()}`);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5 text-xs select-none">
      {/* Dossier Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Badge variant={selected.severity === "CRITICAL" ? "danger" : "warning"} size="sm">
              {selected.severity}
            </Badge>
            <span className="font-mono text-[11px] text-muted-foreground">
              {selected.detectionType}
            </span>
          </div>
          <h3 className="text-sm font-bold text-foreground">{selected.title}</h3>
          <p className="text-[11px] text-muted-foreground font-mono">
            Target ULPIN: <strong className="text-foreground">{selected.targetUlpin}</strong>
          </p>
        </div>

        {/* Confidence Gauge */}
        <div className="p-2.5 rounded-xl border border-gov-primary/30 bg-gov-primary/5 text-center font-mono">
          <span className="text-[10px] text-muted-foreground block font-sans">AI Confidence</span>
          <span className="text-base font-black text-gov-primary block">
            {selected.explanation.confidencePercent}%
          </span>
          <span className="text-[9px] text-gov-success font-sans">High Certainty</span>
        </div>
      </div>

      {/* 1. Plain-Language Cadastral Rationale */}
      <div className="space-y-1.5">
        <span className="font-bold text-foreground uppercase tracking-wider text-[10px] flex items-center space-x-1">
          <FileText className="h-3.5 w-3.5 text-gov-accent" />
          <span>1. Plain-Language Cadastral Assessment</span>
        </span>
        <div className="p-3.5 rounded-lg border border-border bg-muted/20 text-foreground leading-relaxed">
          {selected.explanation.primaryReason}
        </div>
      </div>

      {/* 2. Forensic Spatial & Document Evidence */}
      <div className="space-y-1.5">
        <span className="font-bold text-foreground uppercase tracking-wider text-[10px] flex items-center space-x-1">
          <ShieldCheck className="h-3.5 w-3.5 text-gov-primary" />
          <span>2. Forensic Spatial &amp; Document Evidence</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px]">
          {selected.explanation.evidenceDetails.encroachingMeters && (
            <div className="p-2.5 rounded-lg border border-border bg-card">
              <span className="text-[10px] text-muted-foreground block font-sans">Setback Encroachment</span>
              <span className="font-bold text-gov-danger text-sm">
                {selected.explanation.evidenceDetails.encroachingMeters} meters
              </span>
            </div>
          )}
          {selected.explanation.evidenceDetails.encroachingAreaSqm && (
            <div className="p-2.5 rounded-lg border border-border bg-card">
              <span className="text-[10px] text-muted-foreground block font-sans">Encroached Footprint</span>
              <span className="font-bold text-foreground text-sm">
                {selected.explanation.evidenceDetails.encroachingAreaSqm} m²
              </span>
            </div>
          )}
          {selected.explanation.evidenceDetails.affectedBoundaryEdge && (
            <div className="sm:col-span-2 p-2.5 rounded-lg border border-border bg-card">
              <span className="text-[10px] text-muted-foreground block font-sans">Affected Boundary Edge</span>
              <span className="font-semibold text-foreground font-sans">
                {selected.explanation.evidenceDetails.affectedBoundaryEdge}
              </span>
            </div>
          )}
          {selected.explanation.evidenceDetails.documentChecksumMismatch && (
            <div className="sm:col-span-2 p-2.5 rounded-lg border border-gov-danger/30 bg-gov-danger/5 text-gov-danger">
              <span className="text-[10px] text-muted-foreground block font-sans">Forensic Anomaly</span>
              <span className="font-semibold text-xs">
                {selected.explanation.evidenceDetails.documentChecksumMismatch}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Statutory Legal Citation */}
      <div className="space-y-1.5">
        <span className="font-bold text-foreground uppercase tracking-wider text-[10px] flex items-center space-x-1">
          <Scale className="h-3.5 w-3.5 text-amber-500" />
          <span>3. Statutory Legal Citation</span>
        </span>
        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-300 font-semibold text-[11px]">
          {selected.explanation.legalStatutoryReference}
        </div>
      </div>

      {/* 4. Actionable Government Recommendation */}
      <div className="space-y-1.5">
        <span className="font-bold text-foreground uppercase tracking-wider text-[10px] flex items-center space-x-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-gov-success" />
          <span>4. Recommended Administrative Action</span>
        </span>
        <div className="p-3 rounded-lg border border-gov-success/30 bg-gov-success/5 text-foreground leading-relaxed">
          {selected.explanation.actionableRecommendation}
        </div>
      </div>

      {/* Cross-Module Inspection Actions */}
      <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={() => router.push("/gis")}
            leftIcon={<MapPin className="h-3.5 w-3.5 text-gov-primary" />}
          >
            Inspect in 2D GIS
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={() => router.push("/viewer-3d")}
            leftIcon={<Box className="h-3.5 w-3.5 text-gov-accent" />}
          >
            Inspect in 3D Twin
          </Button>
        </div>

        {/* Triage Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs text-muted-foreground"
            onClick={() => handleAction("FALSE_POSITIVE")}
          >
            Dismiss (False Positive)
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-8 text-xs font-bold"
            onClick={() => handleAction("NOTICE_ISSUED")}
            leftIcon={<Send className="h-3.5 w-3.5" />}
          >
            Issue Statutory Notice
          </Button>
        </div>
      </div>
    </div>
  );
}
