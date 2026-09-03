"use client";

import * as React from "react";
import { riskScoringEngine } from "../services/risk-scoring-engine";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, ShieldCheck, AlertTriangle, Layers } from "lucide-react";

export function CompositeRiskRadar() {
  const [selectedProfile, setSelectedProfile] = React.useState<"SAFE" | "DISPUTED">("DISPUTED");

  const riskData = React.useMemo(() => {
    return selectedProfile === "SAFE"
      ? riskScoringEngine.getSamplePropertyRisk()
      : riskScoringEngine.getHighRiskPropertyRisk();
  }, [selectedProfile]);

  const factors = [
    { label: "Boundary Integrity (20%)", value: riskData.factors.boundaryIntegrity },
    { label: "Ownership Consistency (20%)", value: riskData.factors.ownershipConsistency },
    { label: "Survey Precision (15%)", value: riskData.factors.surveyPrecision },
    { label: "Dispute History (15%)", value: riskData.factors.disputeHistory },
    { label: "Encroachment Exposure (15%)", value: riskData.factors.encroachmentExposure },
    { label: "Document Authenticity (10%)", value: riskData.factors.documentAuthenticity },
    { label: "Mutation Continuity (5%)", value: riskData.factors.mutationContinuity },
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <ShieldAlert className="h-4 w-4 text-gov-accent" />
            <span>Composite Title Risk Engine (7 Factors)</span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Multi-dimensional risk evaluation conforming to Ministry of Rural Development standards.
          </p>
        </div>

        {/* Profile Switcher */}
        <div className="flex items-center space-x-1 bg-muted/40 p-1 rounded-lg border border-border">
          <button
            onClick={() => setSelectedProfile("DISPUTED")}
            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
              selectedProfile === "DISPUTED"
                ? "bg-gov-danger text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Disputed Parcel CTS-144/A
          </button>
          <button
            onClick={() => setSelectedProfile("SAFE")}
            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
              selectedProfile === "SAFE"
                ? "bg-gov-success text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Palm Heights (CTS-142)
          </button>
        </div>
      </div>

      {/* Hero Score Banner */}
      <div className="p-4 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">
            Composite Title Risk Score
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-black text-foreground">
              {riskData.overallScore}
            </span>
            <span className="text-muted-foreground text-xs font-mono">/ 100</span>
          </div>
        </div>

        <Badge
          variant={
            riskData.riskTier === "SEVERE"
              ? "danger"
              : riskData.riskTier === "HIGH"
              ? "warning"
              : "success"
          }
          size="default"
          className="font-bold"
        >
          {riskData.riskTier} RISK TIER
        </Badge>
      </div>

      {/* 7 Factor Progress Bars */}
      <div className="space-y-2.5">
        <span className="font-bold text-foreground uppercase tracking-wider text-[10px] block">
          Factor-by-Factor Risk Decomposition
        </span>

        {factors.map((f) => (
          <div key={f.label} className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="font-sans font-medium text-foreground">{f.label}</span>
              <span className={f.value > 50 ? "text-gov-danger font-bold" : "text-gov-success"}>
                {f.value} / 100
              </span>
            </div>
            <Progress value={f.value} className="h-1.5" />
          </div>
        ))}
      </div>

      {/* Explanations */}
      {riskData.explanations.length > 0 && (
        <div className="p-3 rounded-lg border border-gov-danger/30 bg-gov-danger/5 space-y-1">
          <span className="font-bold text-gov-danger uppercase text-[10px]">
            Statutory Risk Flags ({riskData.explanations.length}):
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted-foreground">
            {riskData.explanations.map((exp, idx) => (
              <li key={idx}>{exp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
