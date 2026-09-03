"use client";

import * as React from "react";
import { SURVEY_QUALITY_METRICS } from "../constants/mock-analytics-data";
import { Badge } from "@/components/ui/badge";
import { Radio, Satellite, ShieldCheck, Camera, CheckCircle2 } from "lucide-react";

export function SurveyQualityCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Radio className="h-4 w-4 text-gov-accent" />
            <span>Survey Quality &amp; DGPS Precision Assurance</span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Compliance monitoring against Survey of India 5cm cadastral boundary tolerance.
          </p>
        </div>

        <Badge variant="success" size="sm" dot>
          National Standards Compliant
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center font-mono">
        <div className="p-3 rounded-lg border border-border bg-card">
          <span className="text-[10px] text-muted-foreground block font-sans">Avg RTK Acc</span>
          <span className="text-base font-bold text-gov-success">
            {SURVEY_QUALITY_METRICS.avgAccuracyCm} cm
          </span>
          <span className="text-[9px] text-muted-foreground block">Max tol: 5.0 cm</span>
        </div>

        <div className="p-3 rounded-lg border border-border bg-card">
          <span className="text-[10px] text-muted-foreground block font-sans">Satellites Avg</span>
          <span className="text-base font-bold text-foreground">
            {SURVEY_QUALITY_METRICS.satelliteCountAvg}
          </span>
          <span className="text-[9px] text-muted-foreground block">GPS + GLONASS</span>
        </div>

        <div className="p-3 rounded-lg border border-border bg-card">
          <span className="text-[10px] text-muted-foreground block font-sans">RTK Fix Usage</span>
          <span className="text-base font-bold text-gov-primary">
            {SURVEY_QUALITY_METRICS.rtkFixUsagePercent}%
          </span>
          <span className="text-[9px] text-muted-foreground block">CORS Linked</span>
        </div>

        <div className="p-3 rounded-lg border border-border bg-card">
          <span className="text-[10px] text-muted-foreground block font-sans">Photo Evidence</span>
          <span className="text-base font-bold text-foreground">
            {SURVEY_QUALITY_METRICS.photoEvidenceCoveragePercent}%
          </span>
          <span className="text-[9px] text-muted-foreground block">SHA-256 Hashed</span>
        </div>

        <div className="p-3 rounded-lg border border-border bg-card">
          <span className="text-[10px] text-muted-foreground block font-sans">QA First Pass</span>
          <span className="text-base font-bold text-gov-success">
            {SURVEY_QUALITY_METRICS.qaApprovalFirstPassPercent}%
          </span>
          <span className="text-[9px] text-muted-foreground block">Registrar Queue</span>
        </div>

        <div className="p-3 rounded-lg border border-gov-danger/30 bg-gov-danger/5">
          <span className="text-[10px] text-muted-foreground block font-sans">Re-survey Orders</span>
          <span className="text-base font-bold text-gov-danger">
            {SURVEY_QUALITY_METRICS.rejectionRatePercent}%
          </span>
          <span className="text-[9px] text-gov-danger block">Below 2% Target</span>
        </div>
      </div>
    </div>
  );
}
