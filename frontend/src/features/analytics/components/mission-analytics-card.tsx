"use client";

import * as React from "react";
import { SURVEYOR_LEADERBOARD } from "../constants/mock-analytics-data";
import { Badge } from "@/components/ui/badge";
import { Compass, CheckCircle2, Clock, Award, UserCheck, AlertTriangle } from "lucide-react";

export function MissionAnalyticsCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Compass className="h-4 w-4 text-gov-accent" />
            <span>Field Survey Mission Operations &amp; Productivity</span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Operational status tracking, DGPS precision verification, and Cadastral Surveyor rankings.
          </p>
        </div>

        <Badge variant="outline" size="sm" className="font-mono text-[9px]">
          Survey of India CORS Linked
        </Badge>
      </div>

      {/* Operational Status Breakdown Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono">
        <div className="p-2.5 rounded-lg border border-border bg-card">
          <span className="text-[10px] text-muted-foreground block font-sans">Assigned</span>
          <span className="text-sm font-bold text-foreground">42,100</span>
        </div>
        <div className="p-2.5 rounded-lg border border-gov-warning/40 bg-gov-warning/5">
          <span className="text-[10px] text-muted-foreground block font-sans">In Field</span>
          <span className="text-sm font-bold text-gov-warning">18,450</span>
        </div>
        <div className="p-2.5 rounded-lg border border-gov-success/40 bg-gov-success/5">
          <span className="text-[10px] text-muted-foreground block font-sans">Completed</span>
          <span className="text-sm font-bold text-gov-success">182,400</span>
        </div>
        <div className="p-2.5 rounded-lg border border-indigo-500/40 bg-indigo-500/5">
          <span className="text-[10px] text-muted-foreground block font-sans">Pending QA</span>
          <span className="text-sm font-bold text-indigo-500">3,820</span>
        </div>
        <div className="p-2.5 rounded-lg border border-gov-danger/40 bg-gov-danger/5">
          <span className="text-[10px] text-muted-foreground block font-sans">Re-survey Orders</span>
          <span className="text-sm font-bold text-gov-danger">1,240</span>
        </div>
      </div>

      {/* Surveyor Leaderboard Table */}
      <div className="space-y-2 pt-1">
        <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
          Top Cadastral Survey Officers (Precision &amp; Throughput)
        </span>

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-[11px]">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="p-2.5 text-left font-semibold">Survey Officer</th>
                <th className="p-2.5 text-left font-semibold">District Jurisdiction</th>
                <th className="p-2.5 text-left font-semibold">Missions</th>
                <th className="p-2.5 text-left font-semibold">Avg RTK Acc</th>
                <th className="p-2.5 text-left font-semibold">QA Pass Rate</th>
                <th className="p-2.5 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {SURVEYOR_LEADERBOARD.map((officer) => (
                <tr key={officer.officerId} className="hover:bg-muted/20">
                  <td className="p-2.5 font-bold font-sans text-foreground">
                    {officer.officerName}
                  </td>
                  <td className="p-2.5 text-muted-foreground font-sans">
                    {officer.district}
                  </td>
                  <td className="p-2.5 text-foreground font-semibold">
                    {officer.missionsCompleted} missions
                  </td>
                  <td className="p-2.5 text-gov-success font-semibold">
                    {officer.avgAccuracyCm} cm
                  </td>
                  <td className="p-2.5 text-gov-primary font-bold">
                    {officer.qaApprovalRate}%
                  </td>
                  <td className="p-2.5 text-center font-sans">
                    <Badge
                      variant={officer.status === "ACTIVE_FIELD" ? "success" : "outline"}
                      size="sm"
                      className="text-[9px]"
                    >
                      {officer.status.replace("_", " ")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
