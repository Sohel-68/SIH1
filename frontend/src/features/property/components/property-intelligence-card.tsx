"use client";

import * as React from "react";
import { usePropertyStore } from "../stores/use-property-store";
import { LifecycleBadge } from "./lifecycle-badge";
import { MutationTimeline } from "./mutation-timeline";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  ShieldCheck,
  Building,
  User,
  FileText,
  AlertTriangle,
  Receipt,
  Layers,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Coins,
  CheckCircle2,
} from "lucide-react";

export function PropertyIntelligenceCard() {
  const { dossier, updateLifecycleState } = usePropertyStore();
  const [activeTab, setActiveTab] = React.useState("ownership");
  const [copied, setCopied] = React.useState(false);

  const handleCopyULPIN = () => {
    navigator.clipboard.writeText(dossier.baseUlpin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "ownership", label: "Ownership & Rights", icon: <User className="h-3.5 w-3.5" /> },
    { id: "mutations", label: "Mutation History", icon: <FileText className="h-3.5 w-3.5" /> },
    { id: "tax", label: "Municipal Tax", icon: <Receipt className="h-3.5 w-3.5" /> },
    { id: "disputes", label: "Legal & Disputes", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
    { id: "strata", label: "3D Digital Twin", icon: <Layers className="h-3.5 w-3.5" /> },
    { id: "ai-risk", label: "AI Risk Profile", icon: <Sparkles className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-xs">
      {/* ------------------------------------------------------------- */}
      {/* 1. Header Banner with 14-Digit ULPIN & 3D ULPIN               */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-gov-primary/10 via-card to-gov-accent/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Cadastral Property Dossier
              </span>
              <LifecycleBadge state={dossier.lifecycleState} />
            </div>

            <div className="flex items-center space-x-3">
              <h2 className="text-base sm:text-lg font-black text-foreground font-mono">
                {dossier.baseUlpin}
              </h2>
              <Tooltip content={copied ? "Copied!" : "Copy Base ULPIN"} position="right">
                <button
                  onClick={handleCopyULPIN}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                  aria-label="Copy ULPIN"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-gov-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </Tooltip>
            </div>

            {dossier.ulpin3D && (
              <div className="flex items-center space-x-1.5 text-[11px] font-mono text-gov-accent">
                <Layers className="h-3 w-3" />
                <span>3D Strata ULPIN: {dossier.ulpin3D}</span>
              </div>
            )}
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg border border-border bg-background/80 text-center">
              <span className="text-[10px] text-muted-foreground block">Carpet Area</span>
              <span className="font-bold text-foreground font-mono">{dossier.spatialUnit.areaSqm} m²</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg border border-border bg-background/80 text-center">
              <span className="text-[10px] text-muted-foreground block">Elevation</span>
              <span className="font-bold text-foreground font-mono">{dossier.spatialUnit.elevationAmsl}m AMSL</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg border border-border bg-background/80 text-center">
              <span className="text-[10px] text-muted-foreground block">Volumetric Cube</span>
              <span className="font-bold text-foreground font-mono">{dossier.spatialUnit.volumeCum?.toLocaleString()} m³</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Navigation Tabs                                            */}
      {/* ------------------------------------------------------------- */}
      <div className="px-4 pt-3 border-b border-border">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} variant="underline" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Tab Body                                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4">
        {/* TAB 1: OWNERSHIP & RIGHTS (LADM ISO 19152) */}
        {activeTab === "ownership" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">
                Registered Title Holders (LA_Party)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dossier.parties.map((party) => (
                  <div key={party.id} className="p-3 rounded-lg border border-border bg-card space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-xs">{party.name}</span>
                      <Badge variant="outline" size="sm" className="font-mono">
                        {(party.shareRatio * 100).toFixed(0)}% Share
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground space-y-0.5">
                      <p>Identity: {party.identifierType} ({party.identifierMasked})</p>
                      <p>Contact: {party.contactNumber || "N/A"}</p>
                      <p className="truncate">Address: {party.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restrictions & Mortgages (LA_RRR) */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">
                Encumbrances &amp; Legal Restrictions (LA_Restriction)
              </h4>
              {dossier.baUnit.la_rrr.restrictions.map((res) => (
                <div key={res.id} className="p-3 rounded-lg border border-gov-warning/30 bg-gov-warning/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gov-warning text-xs">{res.type}</span>
                    <span className="font-mono text-foreground font-bold">
                      ₹ {res.encumbranceAmount?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{res.details}</p>
                  <span className="text-[10px] text-muted-foreground">
                    Beneficiary Authority: <strong>{res.beneficiaryAuthority}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MUTATION HISTORY */}
        {activeTab === "mutations" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
                Official Mutation Ledger (Form 6 Ferfar Patrak)
              </span>
              <span className="text-[11px] text-muted-foreground">
                Total Entries: {dossier.mutationHistory.length}
              </span>
            </div>
            <MutationTimeline entries={dossier.mutationHistory} />
          </div>
        )}

        {/* TAB 3: MUNICIPAL TAX STATUS */}
        {activeTab === "tax" && (
          <div className="space-y-3">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">
              Municipal Property Tax Assessments (MCGM)
            </h4>
            <div className="rounded-lg border border-border divide-y divide-border bg-card">
              {dossier.taxAssessments.map((tax, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground text-xs">FY {tax.assessmentYear}</span>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Receipt: {tax.receiptNumber || "Pending"} &bull; Paid: {tax.paymentDate || "N/A"}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-mono font-bold text-foreground text-xs block">
                      ₹ {tax.taxAmount.toLocaleString()}
                    </span>
                    <Badge variant={tax.paymentStatus === "PAID" ? "success" : "danger"} size="sm">
                      {tax.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LEGAL DISPUTES */}
        {activeTab === "disputes" && (
          <div className="space-y-3">
            {dossier.disputes.length > 0 ? (
              dossier.disputes.map((disp) => (
                <div key={disp.id} className="p-3.5 rounded-lg border border-gov-danger/30 bg-gov-danger/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gov-danger text-xs">{disp.courtCaseNumber}</span>
                    <Badge variant="danger" size="sm">Injunction Active</Badge>
                  </div>
                  <p className="text-xs text-foreground">{disp.summary}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-xl border border-dashed border-gov-success/30 bg-gov-success/5 space-y-2">
                <CheckCircle2 className="h-8 w-8 text-gov-success mx-auto" />
                <h4 className="text-xs font-bold text-foreground">Zero Active Litigation</h4>
                <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                  No civil disputes, injunctions, or revenue contest notices found in the National Judicial Data Grid (NJDG) for this parcel.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: 3D DIGITAL TWIN LINKAGE */}
        {activeTab === "strata" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-purple-500" />
                <span className="font-bold text-foreground text-xs">
                  {dossier.strataBreakdown.buildingName}
                </span>
                <Badge variant="outline" size="sm">LOD2 Mesh Linked</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
                <div className="p-2 rounded bg-card border">
                  <span className="text-[10px] text-muted-foreground block">Towers</span>
                  <span className="font-bold text-foreground">{dossier.strataBreakdown.towersCount}</span>
                </div>
                <div className="p-2 rounded bg-card border">
                  <span className="text-[10px] text-muted-foreground block">Floors</span>
                  <span className="font-bold text-foreground">{dossier.strataBreakdown.floorsCount}</span>
                </div>
                <div className="p-2 rounded bg-card border">
                  <span className="text-[10px] text-muted-foreground block">Strata Units</span>
                  <span className="font-bold text-foreground">{dossier.strataBreakdown.unitsCount}</span>
                </div>
                <div className="p-2 rounded bg-card border">
                  <span className="text-[10px] text-muted-foreground block">Volumetric Area</span>
                  <span className="font-bold text-foreground">{dossier.strataBreakdown.totalVolumetricAreaSqm.toLocaleString()} m²</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This cadastral parcel is structured according to 3D volumetric strata standards, with vertical floor slabs and 3D Bhu-Aadhaar coordinates ready for the 3D Digital Twin Viewer.
            </p>
          </div>
        )}

        {/* TAB 6: AI RISK ASSESSMENT PLACEHOLDER */}
        {activeTab === "ai-risk" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-gov-accent" />
                  <span className="font-bold text-foreground text-xs">AI Risk &amp; Integrity Analysis</span>
                </div>
                <Badge variant="success" size="sm">
                  Score: {dossier.aiRiskAnalysis.compositeScore} / 100 ({dossier.aiRiskAnalysis.riskLevel})
                </Badge>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  Automated Checks:
                </span>
                <ul className="space-y-1 text-[11px] text-muted-foreground">
                  {dossier.aiRiskAnalysis.detectedAnomalies.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="h-3 w-3 text-gov-success shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
