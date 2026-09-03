"use client";

import * as React from "react";
import { useULPINStore } from "../stores/use-ulpin-store";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, User, FileText } from "lucide-react";

export function AuditLogPanel() {
  const { auditLogs } = useULPINStore();

  const getActionBadge = (action: string) => {
    switch (action) {
      case "ULPIN_GENERATED":
        return <Badge variant="success" size="sm">GENERATED</Badge>;
      case "ULPIN_REVISED":
        return <Badge variant="warning" size="sm">REVISED</Badge>;
      case "ULPIN_VERIFIED":
        return <Badge variant="accent" size="sm">VERIFIED</Badge>;
      case "BULK_EXPORT":
        return <Badge variant="outline" size="sm">EXPORT</Badge>;
      default:
        return <Badge variant="outline" size="sm">{action}</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 text-xs select-none">
      <div>
        <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
          <ShieldCheck className="h-4 w-4 text-gov-accent" />
          <span>ULPIN Issuance &amp; Verification Audit Trail ({auditLogs.length})</span>
        </h3>
        <p className="text-[11px] text-muted-foreground">
          Immutable tamper-evident security audit log for all cadastral identity operations.
        </p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-[11px]">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="p-2.5 text-left font-semibold">Action</th>
              <th className="p-2.5 text-left font-semibold">ULPIN / Target</th>
              <th className="p-2.5 text-left font-semibold">Operator</th>
              <th className="p-2.5 text-left font-semibold">Timestamp</th>
              <th className="p-2.5 text-left font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/20">
                <td className="p-2.5">{getActionBadge(log.action)}</td>
                <td className="p-2.5 font-bold text-foreground">{log.ulpin}</td>
                <td className="p-2.5 text-muted-foreground font-sans">{log.user}</td>
                <td className="p-2.5 text-muted-foreground">{log.timestamp}</td>
                <td className="p-2.5 text-muted-foreground font-sans">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
