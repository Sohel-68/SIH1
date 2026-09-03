"use client";

import * as React from "react";
import { useSurveyStore } from "../stores/use-survey-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Stamp,
  ShieldCheck,
} from "lucide-react";

export function QAWorkflowDialog() {
  const { isQADialogOpen, setQADialogOpen, missions, activeMissionId, addQAReview } =
    useSurveyStore();
  const { user } = useAuthStore();

  const mission = missions.find((m) => m.id === activeMissionId) || missions[0];

  const [verdict, setVerdict] = React.useState<"APPROVE" | "REJECT" | "REQUEST_CORRECTION">(
    "APPROVE"
  );
  const [comments, setComments] = React.useState("");

  if (!isQADialogOpen) return null;

  const handleSignoff = () => {
    // Generate digital signature hash
    const hexChars = "0123456789abcdef";
    let sigHash = "SIG-GOV-";
    for (let i = 0; i < 40; i++) {
      sigHash += hexChars[Math.floor(Math.random() * hexChars.length)];
    }

    addQAReview({
      id: `rev-${Date.now()}`,
      reviewerId: user?.id || "qa-officer-01",
      reviewerName: user?.fullName || "Anil Deshmukh (District Registrar)",
      reviewerRole: "DISTRICT_QA_OFFICER",
      verdict,
      comments: comments || (verdict === "APPROVE" ? "Statutory survey measurements confirmed." : "Re-survey ordered."),
      timestamp: new Date().toLocaleString(),
      digitalSignatureHash: sigHash,
    });
  };

  return (
    <Dialog
      isOpen={isQADialogOpen}
      onClose={() => setQADialogOpen(false)}
      maxWidth="md"
      title="District QA & Registrar Statutory Verification"
      description="Review captured field measurements, photographic evidence, and validation reports before statutory certification."
      footer={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setQADialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={verdict === "APPROVE" ? "default" : verdict === "REJECT" ? "destructive" : "secondary"}
            size="sm"
            className="font-bold"
            onClick={handleSignoff}
            leftIcon={<Stamp className="h-3.5 w-3.5" />}
          >
            Submit Statutory Verdict
          </Button>
        </div>
      }
    >
      <div className="space-y-4 pt-2 text-xs">
        {/* Mission Dossier Summary */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-foreground text-sm">
              {mission.missionNumber}
            </span>
            <Badge variant="outline" size="sm">
              {mission.surveyNumber} ({mission.village})
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
            <div className="p-1.5 rounded bg-card border">
              <span className="text-muted-foreground block text-[10px]">Points</span>
              <span className="font-bold text-foreground">{mission.points.length}</span>
            </div>
            <div className="p-1.5 rounded bg-card border">
              <span className="text-muted-foreground block text-[10px]">Photos</span>
              <span className="font-bold text-foreground">{mission.photos.length}</span>
            </div>
            <div className="p-1.5 rounded bg-card border">
              <span className="text-muted-foreground block text-[10px]">Surveyor</span>
              <span className="font-bold text-foreground truncate block">
                {mission.assignedOfficerName.split(" ")[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Verdict Selector */}
        <div className="space-y-1.5">
          <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
            Statutory Decision:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setVerdict("APPROVE")}
              className={`p-3 rounded-lg border text-left space-y-1 transition-all ${
                verdict === "APPROVE"
                  ? "border-gov-success bg-gov-success/10 text-gov-success ring-2 ring-gov-success/30"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <div className="font-bold text-xs">Approve Survey</div>
              <p className="text-[10px] text-muted-foreground">Authorize ULPIN generation.</p>
            </button>

            <button
              type="button"
              onClick={() => setVerdict("REQUEST_CORRECTION")}
              className={`p-3 rounded-lg border text-left space-y-1 transition-all ${
                verdict === "REQUEST_CORRECTION"
                  ? "border-gov-warning bg-gov-warning/10 text-gov-warning ring-2 ring-gov-warning/30"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              <div className="font-bold text-xs">Correction Req.</div>
              <p className="text-[10px] text-muted-foreground">Return to field officer.</p>
            </button>

            <button
              type="button"
              onClick={() => setVerdict("REJECT")}
              className={`p-3 rounded-lg border text-left space-y-1 transition-all ${
                verdict === "REJECT"
                  ? "border-gov-danger bg-gov-danger/10 text-gov-danger ring-2 ring-gov-danger/30"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <XCircle className="h-4 w-4" />
              <div className="font-bold text-xs">Reject Survey</div>
              <p className="text-[10px] text-muted-foreground">Critical error / boundary dispute.</p>
            </button>
          </div>
        </div>

        {/* Review Comments */}
        <div className="space-y-1">
          <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
            Official Endorsement Remarks:
          </span>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter official statutory comments, CTS map reconciliation remarks, or re-survey orders..."
            className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </Dialog>
  );
}
