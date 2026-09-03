"use client";

import * as React from "react";
import { useULPINStore } from "../stores/use-ulpin-store";
import type { ULPINRecord } from "../types/ulpin-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building,
  User,
  Hash,
  MapPin,
  Calendar,
  Layers,
  Award,
} from "lucide-react";

export interface VerificationCardProps {
  initialQuery?: string;
  onViewCertificate?: (record: ULPINRecord) => void;
}

export function VerificationCard({ initialQuery = "", onViewCertificate }: VerificationCardProps) {
  const { verifyULPIN, registry } = useULPINStore();
  const [query, setQuery] = React.useState(initialQuery || "27518001004201-B01-TA-F05-U502");
  const [searched, setSearched] = React.useState(true);
  const [result, setResult] = React.useState<{
    record: ULPINRecord | null;
    status: "AUTHENTIC_ACTIVE" | "SUPERSEDED_HISTORICAL" | "NOT_FOUND";
  }>(() => verifyULPIN(query));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = verifyULPIN(query.trim());
    setResult(res);
    setSearched(true);
  };

  const record = result.record;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 text-xs select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-gov-accent" />
          <span>National Bhu-Aadhaar &amp; ULPIN Verification Portal</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          Instant public title authentication backed by official Ministry of Rural Development records.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by 14-digit ULPIN, 3D Key, Owner Name, or Survey Number..."
          className="h-10 text-xs"
          leftIcon={<Search className="h-4 w-4" />}
        />
        <Button type="submit" variant="default" size="default" className="font-bold px-6">
          Verify
        </Button>
      </form>

      {/* Quick Search Suggestions */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
        <span>Try Sample:</span>
        <button
          type="button"
          onClick={() => {
            const q = "27518001004201-B01-TA-F05-U502";
            setQuery(q);
            setResult(verifyULPIN(q));
          }}
          className="font-mono text-gov-primary hover:underline"
        >
          Unit 502 (Active 3D)
        </button>
        <span>&bull;</span>
        <button
          type="button"
          onClick={() => {
            const q = "27518001004201";
            setQuery(q);
            setResult(verifyULPIN(q));
          }}
          className="font-mono text-gov-primary hover:underline"
        >
          P-401/A (Mother Parcel)
        </button>
        <span>&bull;</span>
        <button
          type="button"
          onClick={() => {
            const q = "Rajiv M. Mehra (Sole)";
            setQuery(q);
            setResult(verifyULPIN(q));
          }}
          className="font-mono text-gov-warning hover:underline"
        >
          Historical Sole Owner (Superseded)
        </button>
      </div>

      {/* Verification Result Dossier */}
      {searched && (
        <div className="pt-2 border-t border-border">
          {result.status === "AUTHENTIC_ACTIVE" && record && (
            <div className="p-5 rounded-2xl border border-gov-success/40 bg-gov-success/5 space-y-4 animate-in fade-in-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-6 w-6 text-gov-success shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      AUTHENTIC &amp; CURRENT TITULAR RECORD
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      This ULPIN is valid, active, and verified against Government Cadastral Registry.
                    </span>
                  </div>
                </div>
                <Badge variant="success" size="default" className="font-bold">
                  VERIFIED &bull; VERSION {record.version}
                </Badge>
              </div>

              {/* ULPIN Key Hero */}
              <div className="p-3 rounded-xl bg-card border border-border flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Verified ULPIN Identifier
                  </span>
                  <span className="font-mono text-base sm:text-lg font-black text-foreground">
                    {record.ulpin3D || record.baseUlpin}
                  </span>
                </div>
                {onViewCertificate && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold text-xs"
                    onClick={() => onViewCertificate(record)}
                    leftIcon={<Award className="h-3.5 w-3.5" />}
                  >
                    View Official Certificate
                  </Button>
                )}
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <span className="text-muted-foreground block text-[10px]">Registered Owner</span>
                  <span className="font-bold text-foreground text-xs block">{record.ownerName}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{record.ownerMaskedId}</span>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <span className="text-muted-foreground block text-[10px]">Cadastral Location</span>
                  <span className="font-semibold text-foreground block">
                    CTS No: {record.hierarchy.surveyNumber} &bull; Parcel {record.hierarchy.parcelNumber}
                  </span>
                  <span className="text-muted-foreground">
                    Versova, Andheri, Mumbai Suburban (MH)
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <span className="text-muted-foreground block text-[10px]">Spatial Specifications</span>
                  <span className="font-bold text-foreground font-mono block">
                    Carpet Area: {record.carpetAreaSqm} m²
                  </span>
                  <span className="text-muted-foreground font-mono">
                    Elevation: {record.elevationAmsl}m AMSL
                  </span>
                </div>
              </div>

              {/* Digital Verification Signature */}
              <div className="p-2.5 rounded-lg bg-card/60 border border-border text-[10px] font-mono text-muted-foreground flex flex-wrap justify-between items-center gap-2">
                <span>Issuing Authority: {record.issuingAuthority}</span>
                <span className="truncate max-w-[280px]">Hash: {record.verificationHash}</span>
              </div>
            </div>
          )}

          {result.status === "SUPERSEDED_HISTORICAL" && record && (
            <div className="p-5 rounded-2xl border border-gov-warning/40 bg-gov-warning/5 space-y-4 animate-in fade-in-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-gov-warning shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      SUPERSEDED HISTORICAL RECORD (ARCHIVED)
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      This record represents an earlier version (v{record.version}) that has been superseded by a subsequent mutation.
                    </span>
                  </div>
                </div>
                <Badge variant="warning" size="default" className="font-bold">
                  SUPERSEDED &bull; V{record.version}
                </Badge>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                <span className="text-muted-foreground font-semibold">Successor ULPIN:</span>
                <span className="font-mono font-bold text-foreground block">
                  {record.supersededByUlpin || "See Current Version"}
                </span>
                {record.reasonForRevision && (
                  <p className="text-xs text-amber-800 pt-1">
                    <strong>Reason for Superseding:</strong> {record.reasonForRevision}
                  </p>
                )}
              </div>
            </div>
          )}

          {result.status === "NOT_FOUND" && (
            <EmptyState
              icon={<XCircle className="h-6 w-6 text-gov-danger" />}
              title="No Cadastral Record Found"
              description={`The query "${query}" did not match any official 2D or 3D ULPIN in the national registry. Please check the digits and try again.`}
              className="py-8"
            />
          )}
        </div>
      )}
    </div>
  );
}
