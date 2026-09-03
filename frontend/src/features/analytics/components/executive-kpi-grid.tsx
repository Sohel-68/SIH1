"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useAnalyticsStore } from "../stores/use-analytics-store";
import { analyticsService } from "../services/analytics-service";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Building2,
  Box,
  QrCode,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileCheck,
  XCircle,
  FileText,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export function ExecutiveKPIGrid() {
  const { jurisdictionScope } = useAnalyticsStore();
  const kpis = analyticsService.getKPIsForScope(jurisdictionScope);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Layers":
        return <Layers className="h-4 w-4 text-gov-primary" />;
      case "Building2":
        return <Building2 className="h-4 w-4 text-purple-500" />;
      case "Box":
        return <Box className="h-4 w-4 text-gov-accent" />;
      case "QrCode":
        return <QrCode className="h-4 w-4 text-gov-primary" />;
      case "ShieldCheck":
        return <ShieldCheck className="h-4 w-4 text-gov-success" />;
      case "Clock":
        return <Clock className="h-4 w-4 text-gov-warning" />;
      case "CheckCircle2":
        return <CheckCircle2 className="h-4 w-4 text-gov-success" />;
      case "FileCheck":
        return <FileCheck className="h-4 w-4 text-indigo-500" />;
      case "XCircle":
        return <XCircle className="h-4 w-4 text-gov-danger" />;
      case "FileText":
        return <FileText className="h-4 w-4 text-gov-primary" />;
      case "AlertTriangle":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "Users":
        return <Users className="h-4 w-4 text-gov-accent" />;
      default:
        return <Layers className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 select-none">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="rounded-xl border border-border bg-card p-3.5 shadow-sm space-y-2 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="p-1.5 rounded-lg bg-muted/50 border border-border/50">
              {getIcon(kpi.iconName)}
            </div>
            {kpi.changeText && (
              <span
                className={cn(
                  "text-[10px] font-mono font-semibold flex items-center space-x-0.5",
                  kpi.trend === "up"
                    ? "text-gov-success"
                    : kpi.trend === "down"
                    ? "text-gov-warning"
                    : "text-muted-foreground"
                )}
              >
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : kpi.trend === "down" ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                <span className="truncate max-w-[90px]">{kpi.changeText}</span>
              </span>
            )}
          </div>

          <div>
            <span className="font-mono text-base sm:text-lg font-black text-foreground block tracking-tight">
              {kpi.value}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground line-clamp-1 block" title={kpi.label}>
              {kpi.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
