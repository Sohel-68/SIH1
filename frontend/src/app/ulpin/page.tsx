"use client";

import * as React from "react";
import { RouteGuard } from "@/features/auth/components/route-guard";
import { useULPINStore } from "@/features/ulpin/stores/use-ulpin-store";
import { ULPINGeneratorCard } from "@/features/ulpin/components/ulpin-generator-card";
import { ULPINCertificate } from "@/features/ulpin/components/ulpin-certificate";
import { QRCodeDisplay } from "@/features/ulpin/components/qr-code-display";
import { VersionHistoryModal } from "@/features/ulpin/components/version-history-modal";
import { BulkULPINPanel } from "@/features/ulpin/components/bulk-ulpin-panel";
import { AuditLogPanel } from "@/features/ulpin/components/audit-log-panel";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Award,
  Layers,
  ShieldCheck,
  History,
  QrCode,
  Building,
} from "lucide-react";

export default function ULPINManagementPage() {
  const [activeTab, setActiveTab] = React.useState("generator");
  const { registry, activeUlpinId, selectRecord, setVersionModalOpen } = useULPINStore();

  const currentRecord = registry.find((r) => r.id === activeUlpinId) || registry[0];

  const tabs = [
    { id: "generator", label: "Generator & Versions", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { id: "certificate", label: "Certificate Studio", icon: <Award className="h-3.5 w-3.5" /> },
    { id: "bulk", label: "Bulk Operations", icon: <Layers className="h-3.5 w-3.5" /> },
    { id: "audit", label: "Audit Trail", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  ];

  return (
    <RouteGuard requiredPermissions={["ulpin:generate"]}>
      <div className="space-y-6">
        {/* Page Title & Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                National ULPIN &amp; Bhu-Aadhaar Engine
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Deterministic 14-Digit Base Generation, 3D Strata Keys, Non-Destructive Versioning &amp; Official Certificates.
              </p>
            </div>

            {/* Quick Registry Selector */}
            <div className="flex items-center space-x-2">
              <select
                value={currentRecord.id}
                onChange={(e) => selectRecord(e.target.value)}
                className="h-8 rounded-lg border border-input bg-card px-2.5 text-xs font-mono font-bold text-foreground focus:outline-none"
              >
                {registry.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.ulpin3D || r.baseUlpin} (v{r.version}{r.isCurrent ? "" : " - Superseded"})
                  </option>
                ))}
              </select>

              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold"
                onClick={() => setVersionModalOpen(true)}
                leftIcon={<History className="h-3.5 w-3.5 text-gov-accent" />}
              >
                Version History
              </Button>
            </div>
          </div>

          <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} variant="pills" />
        </div>

        {/* TAB 1: GENERATOR & VERSION STUDIO */}
        {activeTab === "generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in-0">
            {/* Left 8 Cols: Interactive Generator Console */}
            <div className="lg:col-span-8 space-y-6">
              <ULPINGeneratorCard />
            </div>

            {/* Right 4 Cols: Active Record Overview & Security QR */}
            <div className="lg:col-span-4 space-y-6">
              <QRCodeDisplay record={currentRecord} />

              <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-xs">
                <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
                  Active Registry Selection
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <p>
                    <span className="text-muted-foreground">Base:</span>{" "}
                    <strong className="text-foreground">{currentRecord.baseUlpin}</strong>
                  </p>
                  {currentRecord.ulpin3D && (
                    <p>
                      <span className="text-muted-foreground">3D Key:</span>{" "}
                      <strong className="text-gov-accent">{currentRecord.ulpin3D}</strong>
                    </p>
                  )}
                  <p>
                    <span className="text-muted-foreground">Version:</span>{" "}
                    <Badge variant={currentRecord.isCurrent ? "success" : "warning"} size="sm">
                      v{currentRecord.version} ({currentRecord.status})
                    </Badge>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Owner:</span>{" "}
                    <span className="text-foreground font-sans font-semibold">{currentRecord.ownerName}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CERTIFICATE STUDIO */}
        {activeTab === "certificate" && (
          <div className="space-y-6 animate-in fade-in-0">
            <ULPINCertificate record={currentRecord} />
          </div>
        )}

        {/* TAB 3: BULK OPERATIONS */}
        {activeTab === "bulk" && (
          <div className="space-y-6 animate-in fade-in-0">
            <BulkULPINPanel />
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === "audit" && (
          <div className="space-y-6 animate-in fade-in-0">
            <AuditLogPanel />
          </div>
        )}

        {/* Global Version History Modal */}
        <VersionHistoryModal />
      </div>
    </RouteGuard>
  );
}
