"use client";

import * as React from "react";
import { useWorkflowStore } from "../stores/use-workflow-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  AlertTriangle,
  Send,
  PenTool,
  CheckCircle2,
  Building,
} from "lucide-react";

export function SLAMonitoringBanner() {
  const { cases, setForwardModalOpen, setSignoffModalOpen } = useWorkflowStore();

  const totalCases = cases.length;
  const overdueCases = cases.filter((c) => c.slaDaysRemaining < 0).length;
  const warningCases = cases.filter((c) => c.slaDaysRemaining >= 0 && c.slaDaysRemaining <= 2).length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card shadow-sm text-xs select-none">
      {/* Title & E-Office Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gov-primary/10 text-gov-primary border border-gov-primary/30">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-sm text-foreground tracking-tight">
              State Land Records Administration &amp; E-Office
            </h2>
            <Badge variant="accent" size="sm" className="font-mono text-[9px]">
              RTSA Act Compliant
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Maharashtra Land Revenue Code, 1966 &bull; Cadastral file movements, noting sheets &amp; statutory signoffs.
          </p>
        </div>
      </div>

      {/* SLA Operational Counters */}
      <div className="flex items-center space-x-4 font-mono text-[11px]">
        <div className="flex items-center space-x-1.5">
          <span className="text-muted-foreground font-sans">Active Files:</span>
          <span className="font-bold text-foreground">{totalCases}</span>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 border-l border-border pl-3">
          <span className="text-muted-foreground font-sans">SLA Warning:</span>
          <Badge variant="warning" size="sm" className="font-bold">
            {warningCases} nearing deadline
          </Badge>
        </div>

        <div className="hidden md:flex items-center space-x-1.5 border-l border-border pl-3">
          <span className="text-muted-foreground font-sans">Escalated:</span>
          <Badge variant="danger" size="sm" className="font-bold">
            {overdueCases} Overdue
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold"
          onClick={() => setForwardModalOpen(true)}
          leftIcon={<Send className="h-3.5 w-3.5 text-gov-primary" />}
        >
          Forward File
        </Button>

        <Button
          variant="default"
          size="sm"
          className="h-8 text-xs font-bold"
          onClick={() => setSignoffModalOpen(true)}
          leftIcon={<PenTool className="h-3.5 w-3.5" />}
        >
          Statutory Signoff
        </Button>
      </div>
    </div>
  );
}
