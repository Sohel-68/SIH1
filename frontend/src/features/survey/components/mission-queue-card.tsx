"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSurveyStore } from "../stores/use-survey-store";
import type { SurveyMission, SurveyMissionStatus } from "../types/survey-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardList,
  Clock,
  Calendar,
  User,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export interface MissionQueueCardProps {
  onSelectMission?: () => void;
}

export function MissionQueueCard({ onSelectMission }: MissionQueueCardProps) {
  const { missions, activeMissionId, selectMission, setNewMissionModalOpen } = useSurveyStore();
  const [filterStatus, setFilterStatus] = React.useState<string>("ALL");

  const filteredMissions = missions.filter((m) => {
    if (filterStatus === "ALL") return true;
    return m.status === filterStatus;
  });

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "EMERGENCY":
        return "danger";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "accent";
      default:
        return "outline";
    }
  };

  const getStatusVariant = (status: SurveyMissionStatus) => {
    switch (status) {
      case "QA_APPROVED":
        return "success";
      case "SUBMITTED":
        return "accent";
      case "IN_PROGRESS":
        return "warning";
      case "REJECTED":
        return "danger";
      default:
        return "outline";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-4 text-xs">
      {/* Header & Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">
            Cadastral Survey Queue ({missions.length})
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Active field survey missions and boundary demarcation orders.
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          className="font-bold"
          onClick={() => setNewMissionModalOpen(true)}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
        >
          New Survey Mission
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(["ALL", "IN_PROGRESS", "ASSIGNED", "SUBMITTED", "QA_APPROVED"] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors",
              filterStatus === st
                ? "bg-gov-primary text-white"
                : "bg-muted/40 text-muted-foreground hover:bg-muted"
            )}
          >
            {st.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {filteredMissions.map((m) => {
          const isSelected = m.id === activeMissionId;

          return (
            <div
              key={m.id}
              onClick={() => {
                selectMission(m.id);
                if (onSelectMission) onSelectMission();
              }}
              className={cn(
                "rounded-xl border p-4 transition-all cursor-pointer space-y-3",
                isSelected
                  ? "border-gov-primary bg-gov-primary/5 shadow-md ring-1 ring-gov-primary/30"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/20"
              )}
            >
              {/* Mission Header */}
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-foreground text-xs">{m.missionNumber}</span>
                <div className="flex items-center space-x-1.5">
                  <Badge variant={getPriorityVariant(m.priority)} size="sm">
                    {m.priority}
                  </Badge>
                  <Badge variant={getStatusVariant(m.status)} size="sm">
                    {m.status}
                  </Badge>
                </div>
              </div>

              {/* Title & Survey Target */}
              <div>
                <h4 className="font-bold text-foreground text-xs">{m.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  CTS No: <strong>{m.surveyNumber}</strong> &bull; {m.village}, {m.district}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>Field Progress</span>
                  <span>{m.progressPercent}%</span>
                </div>
                <Progress value={m.progressPercent} className="h-1.5" />
              </div>

              {/* Footer: Surveyor & Deadline */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/60">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[140px]">{m.assignedOfficerName.split(" ")[0]}</span>
                </div>
                <div className="flex items-center space-x-1 font-mono">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {m.deadlineDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
