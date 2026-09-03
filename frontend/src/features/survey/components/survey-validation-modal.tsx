"use client";

import * as React from "react";
import { useSurveyStore } from "../stores/use-survey-store";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

export function SurveyValidationModal() {
  const { isValidationModalOpen, setValidationModalOpen, activeValidationReport } =
    useSurveyStore();

  if (!activeValidationReport) return null;

  const report = activeValidationReport;
  const isPass = report.overallStatus === "PASS";

  const checklistItems = [
    { label: "GPS / RTK Accuracy (Tolerance <= 0.05m)", passed: report.gpsAccuracyValid },
    { label: "Polygon Loop Closure (Gap <= 0.15m)", passed: report.boundaryClosed },
    { label: "Topological Non-Overlap Check (Adjacent Cadastre)", passed: report.noOverlaps },
    { label: "Corner Marker Photos (Minimum 4 Required)", passed: report.requiredPhotosPresent },
    { label: "Field Notes & Observations Logged", passed: report.requiredDocsPresent },
    { label: "Duplicate Vertex Detection", passed: report.noDuplicates },
    { label: "Planar Non-Self-Intersecting Topology", passed: report.topologyValid },
  ];

  return (
    <Dialog
      isOpen={isValidationModalOpen}
      onClose={() => setValidationModalOpen(false)}
      maxWidth="md"
      title="Cadastral Survey Validation Audit"
      description="Automated 7-point compliance check conforming to Survey of India and DILRMP accuracy standards."
      footer={
        <Button variant="default" size="sm" onClick={() => setValidationModalOpen(false)}>
          Close Audit Report
        </Button>
      }
    >
      <div className="space-y-4 pt-2 text-xs">
        {/* Overall Status Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between ${
            isPass
              ? "border-gov-success/30 bg-gov-success/10 text-gov-success"
              : "border-gov-warning/30 bg-gov-warning/10 text-gov-warning"
          }`}
        >
          <div className="flex items-center space-x-2">
            {isPass ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            <div>
              <span className="font-bold text-sm">
                {isPass ? "Cadastral Quality Audit PASSED" : "Review Required / Discrepancies Found"}
              </span>
              <p className="text-[11px] text-muted-foreground">
                {isPass
                  ? "All 7 statutory precision and evidence checks have succeeded."
                  : "Some survey parameters require field verification before final QA approval."}
              </p>
            </div>
          </div>
          <Badge variant={isPass ? "success" : "warning"} size="sm">
            {report.overallStatus}
          </Badge>
        </div>

        {/* Checklist List */}
        <div className="rounded-xl border border-border divide-y divide-border bg-card">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="p-2.5 flex items-center justify-between">
              <span className="text-foreground font-medium">{item.label}</span>
              <div className="flex items-center space-x-1.5">
                {item.passed ? (
                  <span className="inline-flex items-center space-x-1 text-gov-success font-semibold text-[11px]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>VERIFIED</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-gov-danger font-semibold text-[11px]">
                    <XCircle className="h-4 w-4" />
                    <span>FAILED</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Specific Discrepancies if any */}
        {report.issues.length > 0 && (
          <div className="p-3 rounded-lg border border-gov-danger/30 bg-gov-danger/5 space-y-1">
            <span className="font-bold text-gov-danger uppercase text-[10px]">
              Issues Flagged ({report.issues.length}):
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted-foreground">
              {report.issues.map((iss, i) => (
                <li key={i}>{iss}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Dialog>
  );
}
