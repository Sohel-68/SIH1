"use client";

import * as React from "react";
import { useAnalyticsStore } from "@/features/analytics/stores/use-analytics-store";
import { reportExportService } from "@/features/analytics/services/report-export-service";
import type { JurisdictionScope } from "@/features/analytics/types/analytics-types";

// Executive Analytics Components
import { ExecutiveKPIGrid } from "@/features/analytics/components/executive-kpi-grid";
import { LiveGISOverview } from "@/features/analytics/components/live-gis-overview";
import { MissionAnalyticsCard } from "@/features/analytics/components/mission-analytics-card";
import { PropertyStrataCard } from "@/features/analytics/components/property-strata-card";
import { ULPINThroughputCard } from "@/features/analytics/components/ulpin-throughput-card";
import { SurveyQualityCard } from "@/features/analytics/components/survey-quality-card";
import { AIInspectionWidgets } from "@/features/analytics/components/ai-inspection-widgets";
import { NotificationFeed } from "@/features/analytics/components/notification-feed";
import { GlobalCommandSearch } from "@/features/analytics/components/global-command-search";
import { ExecutiveReportModal } from "@/features/analytics/components/executive-report-modal";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Printer,
  Download,
  ShieldCheck,
  Building,
  MapPin,
  Sliders,
  FileSpreadsheet,
} from "lucide-react";

export default function ExecutiveDashboardPage() {
  const {
    jurisdictionScope,
    setJurisdictionScope,
    setSearchModalOpen,
    setReportModalOpen,
  } = useAnalyticsStore();

  const handleExportCSV = () => {
    const csvContent = reportExportService.exportKPIsToCSV(jurisdictionScope);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GeoStrata_Executive_Report_${jurisdictionScope}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Top Header Command Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              National Cadastral Command Center
            </h1>
            <Badge variant="accent" size="sm" className="font-mono text-[9px]">
              GovTech v2.4
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Executive Decision Platform &bull; Survey of India &bull; Department of Land Resources (DoLR).
          </p>
        </div>

        {/* Jurisdiction Switcher & Command Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Jurisdiction Selector */}
          <div className="flex items-center space-x-1 bg-muted/40 p-1 rounded-lg border border-border text-xs">
            {(
              [
                { id: "NATIONAL", label: "National View" },
                { id: "STATE_MH", label: "Maharashtra" },
                { id: "DISTRICT_MUMBAI", label: "Mumbai Suburban" },
              ] as const
            ).map((scope) => (
              <button
                key={scope.id}
                onClick={() => setJurisdictionScope(scope.id as JurisdictionScope)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  jurisdictionScope === scope.id
                    ? "bg-gov-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {scope.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={() => setSearchModalOpen(true)}
            leftIcon={<Search className="h-3.5 w-3.5" />}
          >
            Command Search
          </Button>

          {/* CSV Export */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={handleExportCSV}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Export CSV
          </Button>

          {/* Executive Briefing Dossier */}
          <Button
            variant="default"
            size="sm"
            className="h-8 text-xs font-bold"
            onClick={() => setReportModalOpen(true)}
            leftIcon={<Printer className="h-3.5 w-3.5" />}
          >
            Briefing Dossier
          </Button>
        </div>
      </div>

      {/* 1. 12 National KPI Cards */}
      <ExecutiveKPIGrid />

      {/* 2. Live GIS Overview & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <LiveGISOverview />
        </div>
        <div className="lg:col-span-4">
          <NotificationFeed />
        </div>
      </div>

      {/* 3. Operations & Land Use */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MissionAnalyticsCard />
        </div>
        <div className="lg:col-span-5">
          <PropertyStrataCard />
        </div>
      </div>

      {/* 4. ULPIN Throughput & Precision Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ULPINThroughputCard />
        </div>
        <div className="lg:col-span-6">
          <SurveyQualityCard />
        </div>
      </div>

      {/* 5. AI Inspection Placeholders */}
      <AIInspectionWidgets />

      {/* Global Modals */}
      <GlobalCommandSearch />
      <ExecutiveReportModal />
    </div>
  );
}
