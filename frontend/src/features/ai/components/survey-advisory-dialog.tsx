"use client";

import * as React from "react";
import { useAIStore } from "../stores/use-ai-store";
import { surveyAIAdvisory } from "../services/survey-ai-advisory";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

export function SurveyAdvisoryDialog() {
  const { isAdvisoryModalOpen, setAdvisoryModalOpen } = useAIStore();
  const advisory = surveyAIAdvisory.evaluateSurveyMission("mission-01");

  if (!isAdvisoryModalOpen) return null;

  return (
    <Dialog
      isOpen={isAdvisoryModalOpen}
      onClose={() => setAdvisoryModalOpen(false)}
      maxWidth="md"
      title="Field Survey AI Advisory Assistant"
      description="Pre-submission cadastral intelligence evaluating boundary coordinates against CTS village maps."
      footer={
        <Button variant="default" size="sm" onClick={() => setAdvisoryModalOpen(false)}>
          Acknowledge Advisory
        </Button>
      }
    >
      <div className="space-y-4 pt-2 text-xs">
        {/* Confidence Header */}
        <div className="p-3.5 rounded-xl border border-gov-success/40 bg-gov-success/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-gov-success" />
            <div>
              <span className="font-bold text-sm text-foreground">
                Cadastral Survey Qualified for Submission
              </span>
              <p className="text-[11px] text-muted-foreground">
                DGPS telemetry and boundary closure meet Survey of India Class-A criteria.
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm" className="font-mono font-bold">
            {advisory.confidenceScore}% Score
          </Badge>
        </div>

        {/* Warnings */}
        {advisory.warnings.length > 0 && (
          <div className="p-3.5 rounded-xl border border-gov-warning/40 bg-gov-warning/5 space-y-1.5">
            <span className="font-bold text-gov-warning uppercase text-[10px] flex items-center space-x-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Boundary Warnings:</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-foreground">
              {advisory.warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Positive Recommendations */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5">
          <span className="font-bold text-foreground uppercase text-[10px] flex items-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5 text-gov-primary" />
            <span>Cadastral Precision Confirmation:</span>
          </span>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-muted-foreground">
            {advisory.suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </Dialog>
  );
}
