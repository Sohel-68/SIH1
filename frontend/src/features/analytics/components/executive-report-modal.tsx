"use client";

import * as React from "react";
import { useAnalyticsStore } from "../stores/use-analytics-store";
import { analyticsService } from "../services/analytics-service";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, Award, ShieldCheck } from "lucide-react";

export function ExecutiveReportModal() {
  const { isReportModalOpen, setReportModalOpen, jurisdictionScope } = useAnalyticsStore();
  const kpis = analyticsService.getKPIsForScope(jurisdictionScope);
  const stateRecords = analyticsService.getStateRecords();

  if (!isReportModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      isOpen={isReportModalOpen}
      onClose={() => setReportModalOpen(false)}
      maxWidth="lg"
      title="Official Executive Cadastral Briefing Dossier"
      description="Ministry of Rural Development &bull; Department of Land Resources (DoLR) National Status Report."
      footer={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setReportModalOpen(false)}>
            Close
          </Button>
          <Button variant="default" size="sm" onClick={handlePrint} leftIcon={<Printer className="h-3.5 w-3.5" />}>
            Print / Save PDF Dossier
          </Button>
        </div>
      }
    >
      <div className="space-y-6 pt-2 text-xs font-sans text-slate-900 bg-white p-6 rounded-xl border border-slate-300 select-none">
        {/* Header */}
        <div className="text-center border-b pb-4 space-y-1">
          <h2 className="text-base font-bold tracking-widest uppercase">
            GOVERNMENT OF INDIA &bull; NATIONAL 3D ULPIN PLATFORM
          </h2>
          <p className="text-xs text-slate-600 font-semibold">
            Executive Briefing Dossier &bull; Jurisdiction: {jurisdictionScope.replace("_", " ")}
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            Generated on: {new Date().toLocaleString()} &bull; Security Level: OFFICIAL USE ONLY
          </p>
        </div>

        {/* 12 Key Indicators Summary Table */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            1. Key Performance Indicators (National Overview)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {kpis.map((k) => (
              <div key={k.id} className="p-2.5 rounded border border-slate-200 bg-slate-50 font-mono">
                <span className="text-[10px] text-slate-500 block font-sans">{k.label}</span>
                <span className="font-bold text-slate-900 text-sm">{k.value}</span>
                {k.changeText && <span className="text-[9px] text-slate-500 block font-sans">{k.changeText}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* State Cadastral Summary */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            2. State-Wise Cadastral Saturation Status
          </h3>
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead className="bg-slate-100 text-slate-600 border-b">
                <tr>
                  <th className="p-2 text-left">State</th>
                  <th className="p-2 text-left">Total Parcels</th>
                  <th className="p-2 text-left">ULPINs Issued</th>
                  <th className="p-2 text-left">Coverage %</th>
                  <th className="p-2 text-left">Active Disputes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stateRecords.map((s) => (
                  <tr key={s.stateCode}>
                    <td className="p-2 font-bold font-sans">{s.stateName}</td>
                    <td className="p-2">{s.totalParcels.toLocaleString()}</td>
                    <td className="p-2 font-bold">{s.ulpinGenerated.toLocaleString()}</td>
                    <td className="p-2">{s.coveragePercent}%</td>
                    <td className="p-2">{s.activeDisputes.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
