"use client";

import * as React from "react";
import { useULPINStore } from "../stores/use-ulpin-store";
import type { BulkULPINBatch, BulkULPINItem } from "../types/ulpin-types";
import { bulkULPINService } from "../services/bulk-ulpin-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Layers,
  Download,
  Play,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Plus,
} from "lucide-react";

export function BulkULPINPanel() {
  const { registry, bulkBatches, processBulkBatch, logAuditEvent } = useULPINStore();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleRunDemoBatch = () => {
    setIsProcessing(true);

    const units = ["101", "102", "103", "104", "105"];
    const items: BulkULPINItem[] = units.map((u, i) => ({
      id: `item-${Date.now()}-${i}`,
      status: "QUEUED",
      params: {
        hierarchy: {
          countryCode: "IND",
          stateCode: "27",
          districtCode: "518",
          talukaCode: "4182",
          villageCode: "554210",
          surveyNumber: "CTS-142",
          subdivision: "01",
          parcelNumber: "401A",
          buildingCode: "01",
          towerNumber: "TB",
          floorLevel: 1,
          unitNumber: u,
        },
        centroid: [72.8285, 19.1382],
        elevationAmsl: 14.5 + 3.0,
        carpetAreaSqm: 95.0 + i * 5,
        volumeCum: (95.0 + i * 5) * 2.85,
        ownerName: `Batch Owner Unit ${u}`,
        ownerMaskedId: `PAN: AAAAA${i}000F`,
        issuingAuthority: "Sub-Registrar Office, Andheri West",
      },
    }));

    const batch: BulkULPINBatch = {
      batchId: `BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      totalCount: items.length,
      successCount: 0,
      failedCount: 0,
      status: "PROCESSING",
      timestamp: new Date().toLocaleTimeString(),
      items,
    };

    setTimeout(() => {
      processBulkBatch(batch);
      setIsProcessing(false);
    }, 600);
  };

  const handleExportCSV = () => {
    const csvContent = bulkULPINService.exportToCSV(registry);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GeoStrata_ULPIN_Registry_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    logAuditEvent("BULK_EXPORT", "ALL_RECORDS", `Exported ${registry.length} records to CSV.`);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Layers className="h-4 w-4 text-gov-accent" />
            <span>Bulk ULPIN Operations &amp; Batch Processing</span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Execute batch generation, validation, and national registry CSV exports.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Export All to CSV ({registry.length})
          </Button>

          <Button
            variant="default"
            size="sm"
            className="font-bold"
            disabled={isProcessing}
            onClick={handleRunDemoBatch}
            leftIcon={<Play className="h-3.5 w-3.5" />}
          >
            {isProcessing ? "Processing Batch..." : "Run Batch (Tower B Units)"}
          </Button>
        </div>
      </div>

      {/* Batch Activity History */}
      <div className="space-y-3">
        <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
          Batch Processing History ({bulkBatches.length})
        </span>

        {bulkBatches.length > 0 ? (
          <div className="space-y-2">
            {bulkBatches.map((b) => (
              <div key={b.batchId} className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground text-xs">{b.batchId}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={b.failedCount === 0 ? "success" : "warning"} size="sm">
                      {b.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">{b.timestamp}</span>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Total Items: {b.totalCount}</span>
                  <span className="text-gov-success font-semibold">Success: {b.successCount}</span>
                  {b.failedCount > 0 && <span className="text-gov-danger font-semibold">Failed: {b.failedCount}</span>}
                </div>

                <Progress value={Math.round((b.successCount / b.totalCount) * 100)} className="h-1.5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
            No bulk batches executed in this session. Click <strong>Run Batch</strong> above to test batch generation.
          </div>
        )}
      </div>
    </div>
  );
}
