"use client";

import * as React from "react";
import { EXECUTIVE_NOTIFICATIONS } from "../constants/mock-analytics-data";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, FileText, CheckCircle2, Clock } from "lucide-react";

export function NotificationFeed() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 text-xs select-none">
      <div className="flex items-center justify-between pb-2 border-b border-border/70">
        <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
          <Bell className="h-4 w-4 text-gov-accent" />
          <span>Statutory Notifications &amp; Activity Stream</span>
        </h3>
        <Badge variant="accent" size="sm" className="font-mono text-[9px]">
          3 New Alerts
        </Badge>
      </div>

      <div className="space-y-2.5">
        {EXECUTIVE_NOTIFICATIONS.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg border border-border bg-muted/20 flex items-start justify-between gap-3 hover:bg-muted/40 transition-colors"
          >
            <div className="space-y-1">
              <span className="font-bold text-foreground block">{item.title}</span>
              <p className="text-[11px] text-muted-foreground">
                Target: <span className="font-mono font-semibold">{item.targetId}</span> &bull; {item.actor}
              </p>
            </div>
            <div className="shrink-0 flex items-center space-x-1 font-mono text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
