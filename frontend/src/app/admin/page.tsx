"use client";

import * as React from "react";
import { RouteGuard } from "@/features/auth/components/route-guard";
import { SLAMonitoringBanner } from "@/features/admin/components/sla-monitoring-banner";
import { OfficeInboxCard } from "@/features/admin/components/office-inbox-card";
import { CaseDossierView } from "@/features/admin/components/case-dossier-view";
import { NotingSheetPanel } from "@/features/admin/components/noting-sheet-panel";
import { ForwardDepartmentModal } from "@/features/admin/components/forward-department-modal";
import { ApprovalSignoffDialog } from "@/features/admin/components/approval-signoff-dialog";

export default function GovernmentAdministrationPage() {
  return (
    <RouteGuard requiredPermissions={["system:config"]}>
      <div className="space-y-6 animate-in fade-in-0 duration-200">
        {/* Top SLA & E-Office Command Banner */}
        <SLAMonitoringBanner />

        {/* Center Grid: Office Inbox Tray & Case Dossier + Green Noting Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <OfficeInboxCard />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <CaseDossierView />
            <NotingSheetPanel />
          </div>
        </div>

        {/* Global Dialogs */}
        <ForwardDepartmentModal />
        <ApprovalSignoffDialog />
      </div>
    </RouteGuard>
  );
}
