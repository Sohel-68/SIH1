"use client";

import * as React from "react";
import { useWorkflowStore } from "../stores/use-workflow-store";
import type { CaseStatus } from "../types/workflow-types";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, XCircle, PenTool } from "lucide-react";

export function ApprovalSignoffDialog() {
  const {
    cases,
    selectedCaseId,
    isSignoffModalOpen,
    setSignoffModalOpen,
    updateCaseStatus,
  } = useWorkflowStore();

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const [decision, setDecision] = React.useState<"APPROVED" | "REJECTED" | "RETURNED_FOR_CORRECTION">("APPROVED");
  const [remarks, setRemarks] = React.useState("");

  if (!isSignoffModalOpen) return null;

  const handleSubmit = () => {
    if (!remarks.trim()) return;
    updateCaseStatus(
      selectedCase.id,
      decision,
      remarks.trim(),
      "Sanjay G. (Competent Authority)",
      "TEHSILDAR"
    );
    setSignoffModalOpen(false);
    setRemarks("");
  };

  return (
    <Dialog
      isOpen={isSignoffModalOpen}
      onClose={() => setSignoffModalOpen(false)}
      maxWidth="md"
      title="Statutory Case Adjudication &amp; Digital Signoff"
      description={`Record official final decision on ${selectedCase.caseNumber}.`}
      footer={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setSignoffModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={decision === "APPROVED" ? "default" : "destructive"}
            size="sm"
            onClick={handleSubmit}
            disabled={!remarks.trim()}
            leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}
          >
            Apply Digital Signature &amp; Finalize
          </Button>
        </div>
      }
    >
      <div className="space-y-4 pt-2 text-xs font-sans">
        {/* Decision Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground block">
            Adjudication Order
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setDecision("APPROVED")}
              className={`p-2.5 rounded-lg border font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 ${
                decision === "APPROVED"
                  ? "border-gov-success bg-gov-success text-white shadow-sm"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Approve Order</span>
            </button>

            <button
              onClick={() => setDecision("RETURNED_FOR_CORRECTION")}
              className={`p-2.5 rounded-lg border font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 ${
                decision === "RETURNED_FOR_CORRECTION"
                  ? "border-gov-warning bg-gov-warning text-slate-950 shadow-sm"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <span>Return for QA</span>
            </button>

            <button
              onClick={() => setDecision("REJECTED")}
              className={`p-2.5 rounded-lg border font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 ${
                decision === "REJECTED"
                  ? "border-gov-danger bg-gov-danger text-white shadow-sm"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Reject Case</span>
            </button>
          </div>
        </div>

        {/* Order Remarks */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground block">
            Official Adjudication Reasons &amp; Statutory Directives
          </label>
          <Textarea
            placeholder="Document legal grounds under Maharashtra Land Revenue Code / RTSA (e.g. Verified physical demarcation report and sanction mutation transfer)..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            className="text-xs"
          />
        </div>

        {/* Digital Signature Security Callout */}
        <div className="p-3 rounded-lg border border-gov-primary/30 bg-gov-primary/5 flex items-center space-x-2 text-[11px] font-mono text-gov-primary">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>
            Signing with Government Class-3 PKI Digital Signature Certificate. SHA-256 tamper seal will be appended to file.
          </span>
        </div>
      </div>
    </Dialog>
  );
}
