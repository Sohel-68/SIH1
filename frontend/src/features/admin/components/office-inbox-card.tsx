"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useWorkflowStore, type InboxFolder } from "../stores/use-workflow-store";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Inbox,
  Search,
  AlertTriangle,
  Clock,
  FileCheck,
  Building,
} from "lucide-react";

export function OfficeInboxCard() {
  const {
    cases,
    selectedCaseId,
    selectCase,
    activeInboxTab,
    setActiveInboxTab,
    searchFilter,
    setSearchFilter,
  } = useWorkflowStore();

  const filteredCases = cases.filter((c) => {
    if (activeInboxTab === "PENDING" && c.status !== "PENDING" && c.status !== "UNDER_REVIEW" && c.status !== "INSPECTION_ORDERED") {
      return false;
    }
    if (activeInboxTab === "ASSIGNED" && c.status !== "ASSIGNED") return false;
    if (activeInboxTab === "APPROVED" && c.status !== "APPROVED") return false;
    if (activeInboxTab === "REJECTED" && c.status !== "REJECTED") return false;

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        c.caseNumber.toLowerCase().includes(q) ||
        c.fileNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.targetUlpin && c.targetUlpin.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-3 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/70">
        <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
          <Inbox className="h-3.5 w-3.5 text-gov-accent" />
          <span>Department File Trays</span>
        </h3>

        {/* Folder Pills */}
        <div className="flex items-center space-x-1">
          {(["PENDING", "ASSIGNED", "APPROVED", "REJECTED", "ALL"] as const).map((folder) => (
            <button
              key={folder}
              onClick={() => setActiveInboxTab(folder)}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-semibold transition-colors",
                activeInboxTab === folder
                  ? "bg-gov-primary text-white"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted"
              )}
            >
              {folder}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <Input
        placeholder="Search case no, file no, or ULPIN..."
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
        className="h-8 text-xs"
        leftIcon={<Search className="h-3.5 w-3.5" />}
      />

      {/* Cases List */}
      <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
        {filteredCases.map((c) => {
          const isSelected = c.id === selectedCaseId;

          return (
            <div
              key={c.id}
              onClick={() => selectCase(c.id)}
              className={cn(
                "p-3 rounded-xl border transition-all cursor-pointer space-y-1.5",
                isSelected
                  ? "border-gov-primary bg-gov-primary/5 shadow-sm ring-1 ring-gov-primary/30"
                  : "border-border bg-card/60 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[11px] text-gov-primary">
                  {c.caseNumber}
                </span>
                <Badge
                  variant={
                    c.priority === "EMERGENCY"
                      ? "danger"
                      : c.priority === "HIGH"
                      ? "warning"
                      : "outline"
                  }
                  size="sm"
                  className="font-mono text-[9px]"
                >
                  {c.priority}
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-foreground text-xs leading-snug line-clamp-2">
                  {c.title}
                </h4>
                <p className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">
                  File: {c.fileNumber} &bull; {c.currentDepartment}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/50">
                <span className="text-muted-foreground">
                  Officer: <strong className="text-foreground">{c.currentAssigneeRole}</strong>
                </span>

                {/* SLA Indicator */}
                <span
                  className={cn(
                    "font-mono font-semibold flex items-center space-x-1",
                    c.slaDaysRemaining < 0
                      ? "text-gov-danger font-bold"
                      : c.slaDaysRemaining <= 2
                      ? "text-gov-warning font-bold"
                      : "text-gov-success"
                  )}
                >
                  <Clock className="h-3 w-3" />
                  <span>
                    {c.slaDaysRemaining < 0
                      ? `${Math.abs(c.slaDaysRemaining)}d Overdue`
                      : `${c.slaDaysRemaining}d SLA`}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
