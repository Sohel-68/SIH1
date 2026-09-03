"use client";

import * as React from "react";
import { ULPIN_THROUGHPUT_METRICS } from "../constants/mock-analytics-data";
import { Badge } from "@/components/ui/badge";
import { QrCode, ShieldCheck, Download, AlertOctagon, RotateCcw, Zap } from "lucide-react";

export function ULPINThroughputCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <QrCode className="h-4 w-4 text-gov-primary" />
            <span>ULPIN Issuance &amp; Verification Throughput</span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Real-time telemetry on Bhu-Aadhaar generation velocity, fraud interception, and citizen QR verifications.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-gov-success font-mono font-bold text-[11px]">
          <Zap className="h-3.5 w-3.5 animate-pulse" />
          <span>Avg Latency: {ULPIN_THROUGHPUT_METRICS.avgGenerationTimeMs}ms</span>
        </div>
      </div>

      {/* Grid of Real-Time Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 rounded-lg border border-border bg-card space-y-1">
          <span className="text-[10px] text-muted-foreground block font-sans">Generated Today</span>
          <span className="text-lg font-black text-foreground block">
            {ULPIN_THROUGHPUT_METRICS.generatedToday.toLocaleString()}
          </span>
          <span className="text-[10px] text-gov-success font-sans">+14% vs yesterday</span>
        </div>

        <div className="p-3 rounded-lg border border-border bg-card space-y-1">
          <span className="text-[10px] text-muted-foreground block font-sans">Verified Today</span>
          <span className="text-lg font-black text-foreground block">
            {ULPIN_THROUGHPUT_METRICS.verifiedToday.toLocaleString()}
          </span>
          <span className="text-[10px] text-gov-primary font-sans">Portal &amp; Mobile</span>
        </div>

        <div className="p-3 rounded-lg border border-gov-danger/40 bg-gov-danger/5 space-y-1">
          <span className="text-[10px] text-muted-foreground block font-sans">Duplicates Blocked</span>
          <span className="text-lg font-black text-gov-danger block">
            {ULPIN_THROUGHPUT_METRICS.duplicateAttemptsBlocked}
          </span>
          <span className="text-[10px] text-gov-danger font-sans">Collision Guard Active</span>
        </div>

        <div className="p-3 rounded-lg border border-border bg-card space-y-1">
          <span className="text-[10px] text-muted-foreground block font-sans">QR Scans Logged</span>
          <span className="text-lg font-black text-foreground block">
            {ULPIN_THROUGHPUT_METRICS.qrScansToday.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-sans">Tamper-evident</span>
        </div>
      </div>
    </div>
  );
}
