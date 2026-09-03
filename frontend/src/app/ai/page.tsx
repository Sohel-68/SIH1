"use client";

import * as React from "react";
import { RouteGuard } from "@/features/auth/components/route-guard";
import { AIMetricsBanner } from "@/features/ai/components/ai-metrics-banner";
import { DetectionFeedCard } from "@/features/ai/components/detection-feed-card";
import { ExplainableAIDossier } from "@/features/ai/components/explainable-ai-dossier";
import { CompositeRiskRadar } from "@/features/ai/components/composite-risk-radar";
import { SatelliteComparator } from "@/features/ai/components/satellite-comparator";
import { ModelManagementModal } from "@/features/ai/components/model-management-modal";
import { SurveyAdvisoryDialog } from "@/features/ai/components/survey-advisory-dialog";

export default function AIIntelligenceWorkspacePage() {
  return (
    <RouteGuard requiredPermissions={["analytics:read"]}>
      <div className="space-y-6 animate-in fade-in-0 duration-200">
        {/* Top AI Command & Status Banner */}
        <AIMetricsBanner />

        {/* Center Grid: Detections Stream & Explainable AI Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <DetectionFeedCard />
          </div>
          <div className="lg:col-span-7">
            <ExplainableAIDossier />
          </div>
        </div>

        {/* Bottom Grid: Composite Risk Radar & Satellite Change Comparator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <CompositeRiskRadar />
          </div>
          <div className="lg:col-span-6">
            <SatelliteComparator />
          </div>
        </div>

        {/* Global Dialogs */}
        <ModelManagementModal />
        <SurveyAdvisoryDialog />
      </div>
    </RouteGuard>
  );
}
