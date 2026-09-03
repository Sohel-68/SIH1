"use client";

import * as React from "react";
import { useWorkflowStore } from "../stores/use-workflow-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  PenTool,
  CheckCircle2,
  ShieldCheck,
  Send,
  User,
} from "lucide-react";

export function NotingSheetPanel() {
  const { cases, selectedCaseId, addNotingEntry } = useWorkflowStore();
  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const [newRemark, setNewRemark] = React.useState("");

  const handleAddNote = () => {
    if (!newRemark.trim()) return;
    addNotingEntry(
      selectedCase.id,
      newRemark.trim(),
      "Reviewing Officer (Revenue Desk)",
      "TEHSILDAR"
    );
    setNewRemark("");
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/70">
        <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
          <PenTool className="h-3.5 w-3.5 text-gov-accent" />
          <span>Official E-Office Green-Paper Noting Sheet</span>
        </h3>
        <span className="font-mono text-[10px] text-muted-foreground">
          {selectedCase.notingSheet.length} Official Paragraphs Recorded
        </span>
      </div>

      {/* Official Noting Sheet Scrollable Container */}
      <div className="p-4 rounded-xl border border-emerald-600/30 bg-emerald-950/5 dark:bg-emerald-950/20 space-y-4 max-h-96 overflow-y-auto">
        {selectedCase.notingSheet.map((note) => (
          <div
            key={note.id}
            className="space-y-1.5 pb-3 border-b border-emerald-600/20 last:border-none last:pb-0"
          >
            {/* Paragraph Number & Author Header */}
            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  Para {note.paragraphNumber}.
                </span>
                <span className="font-bold text-foreground font-sans">
                  {note.authorName} ({note.department})
                </span>
              </div>
              <span className="text-muted-foreground">{note.timestamp}</span>
            </div>

            {/* Paragraph Text */}
            <p className="text-[11px] text-foreground font-sans leading-relaxed pl-4 border-l-2 border-emerald-500/40">
              {note.remarks}
            </p>

            {/* Digital Signature Seal if Present */}
            {note.digitalSignatureHash && (
              <div className="pt-1 pl-4 flex items-center space-x-1 text-[9px] font-mono text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3 shrink-0" />
                <span className="truncate">Digitally Signed: {note.digitalSignatureHash}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Append New Note Form */}
      <div className="space-y-2 pt-2 border-t border-border">
        <span className="font-bold text-foreground text-[10px] uppercase tracking-wider block">
          Append Official Remark / Order
        </span>
        <Textarea
          placeholder="Enter official departmental noting, order instructions, or referral remarks..."
          value={newRemark}
          onChange={(e) => setNewRemark(e.target.value)}
          rows={2}
          className="text-xs"
        />
        <div className="flex justify-end">
          <Button
            variant="default"
            size="sm"
            onClick={handleAddNote}
            disabled={!newRemark.trim()}
            leftIcon={<Send className="h-3 w-3" />}
          >
            Append Note to Green Sheet
          </Button>
        </div>
      </div>
    </div>
  );
}
