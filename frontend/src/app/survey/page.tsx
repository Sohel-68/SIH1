"use client";

import * as React from "react";
import { RouteGuard } from "@/features/auth/components/route-guard";
import { FieldTelemetryBar } from "@/features/survey/components/field-telemetry-bar";
import { BoundaryCapturePanel } from "@/features/survey/components/boundary-capture-panel";
import { PhotoEvidenceGallery } from "@/features/survey/components/photo-evidence-gallery";
import { FieldNotesPanel } from "@/features/survey/components/field-notes-panel";
import { MissionQueueCard } from "@/features/survey/components/mission-queue-card";
import { SurveyValidationModal } from "@/features/survey/components/survey-validation-modal";
import { QAWorkflowDialog } from "@/features/survey/components/qa-workflow-dialog";
import { NewMissionModal } from "@/features/survey/components/new-mission-modal";
import { Tabs } from "@/components/ui/tabs";
import { Radio, ClipboardList, CheckCircle2 } from "lucide-react";

export default function SurveyOperationsPage() {
  const [activeTab, setActiveTab] = React.useState("field-workspace");

  const tabs = [
    { id: "field-workspace", label: "Field Survey Console", icon: <Radio className="h-3.5 w-3.5" /> },
    { id: "missions", label: "Missions Queue", icon: <ClipboardList className="h-3.5 w-3.5" /> },
    { id: "qa-reviews", label: "QA & Registrar Approvals", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  ];

  return (
    <RouteGuard requiredPermissions={["survey:submit"]}>
      <div className="space-y-6">
        {/* Page Title & Navigation Tabs */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Survey Management &amp; Field Operations Platform
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              DGPS/RTK Field Rover Telemetry, Boundary Point Capture, Cryptographic Photo Evidence &amp; QA Signoff.
            </p>
          </div>

          <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} variant="pills" />
        </div>

        {/* TAB 1: FIELD SURVEY WORKSPACE */}
        {activeTab === "field-workspace" && (
          <div className="space-y-6 animate-in fade-in-0">
            {/* Live GNSS Rover Telemetry Bar */}
            <FieldTelemetryBar />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Columns: Boundary Point Capture Console */}
              <div className="lg:col-span-7 space-y-6">
                <BoundaryCapturePanel />
              </div>

              {/* Right 5 Columns: Photo Evidence & Field Observations */}
              <div className="lg:col-span-5 space-y-6">
                <PhotoEvidenceGallery />
                <FieldNotesPanel />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MISSIONS QUEUE */}
        {activeTab === "missions" && (
          <div className="space-y-6 animate-in fade-in-0">
            <MissionQueueCard onSelectMission={() => setActiveTab("field-workspace")} />
          </div>
        )}

        {/* TAB 3: QA & REGISTRAR APPROVALS */}
        {activeTab === "qa-reviews" && (
          <div className="space-y-6 animate-in fade-in-0">
            <div className="rounded-xl border border-border bg-card p-6 text-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Statutory Cadastral Quality Assurance Portal
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  District QA Officers and Registrars certify field survey accuracy before 3D ULPIN generation.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/20 border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground text-xs block">
                    Mission SM-2024-MH-403: CTS-144/A (Versova)
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Submitted by Senior Surveyor Priya Nair &bull; High Court Order
                  </span>
                </div>
                <button
                  onClick={() => alert("Reviewing Mission SM-2024-MH-403")}
                  className="px-3 py-1.5 rounded-lg bg-gov-primary text-white font-bold text-xs"
                >
                  Inspect &amp; Sign
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Modals */}
        <SurveyValidationModal />
        <QAWorkflowDialog />
        <NewMissionModal />
      </div>
    </RouteGuard>
  );
}
