"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGISStore } from "../stores/use-gis-store";
import { useSelectionStore } from "../stores/use-selection-store";
import { importExportService } from "../services/import-export-service";
import { formatConverter } from "../services/format-converter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Tabs } from "@/components/ui/tabs";
import {
  Info,
  X,
  Copy,
  ExternalLink,
  Navigation,
  Download,
  AlertTriangle,
  Building,
  User,
  Hash,
  MapPin,
  Check,
  History,
  FileCheck2,
  Box,
  Layers,
  Sparkles,
  GitCommit,
  Radio,
} from "lucide-react";

export function PropertyPanel() {
  const { isPropertyPanelOpen, setPropertyPanelOpen, setCenter, setZoom } = useGISStore();
  const { selectedParcel, clearSelection } = useSelectionStore();
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("intelligence");

  if (!isPropertyPanelOpen) return null;

  const handleCopyULPIN = () => {
    if (!selectedParcel) return;
    navigator.clipboard.writeText(selectedParcel.ulpin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoomTo = () => {
    if (!selectedParcel) return;
    setCenter(selectedParcel.centroid);
    setZoom(18);
  };

  const handleExportParcel = () => {
    if (!selectedParcel) return;
    importExportService.downloadGeoJSON([selectedParcel.geometry], `ULPIN_${selectedParcel.ulpin}.geojson`);
  };

  return (
    <aside className="relative flex flex-col w-84 sm:w-96 h-full border-l border-border bg-card/95 backdrop-blur-md shadow-2xl select-none z-10 animate-in slide-in-from-right duration-200">
      {/* Panel Header */}
      <div className="flex h-11 items-center justify-between px-4 border-b border-border/80">
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-gov-accent" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Property Inspector
          </h3>
        </div>

        <div className="flex items-center space-x-1">
          {selectedParcel && (
            <Tooltip content="Zoom To Parcel" position="bottom">
              <button
                onClick={handleZoomTo}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                aria-label="Zoom to Parcel"
              >
                <Navigation className="h-3.5 w-3.5 text-gov-primary" />
              </button>
            </Tooltip>
          )}
          <button
            onClick={() => setPropertyPanelOpen(false)}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Close Property Panel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="px-3 pt-2 border-b border-border/60">
        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="underline"
          tabs={[
            { id: "intelligence", label: "Intelligence", icon: <Info className="h-3.5 w-3.5" /> },
            { id: "survey", label: "Survey", icon: <Radio className="h-3.5 w-3.5" /> },
            { id: "mutation", label: "Mutation", icon: <History className="h-3.5 w-3.5" /> },
            { id: "ulpin", label: "ULPIN", icon: <Hash className="h-3.5 w-3.5" /> },
          ]}
        />
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {selectedParcel ? (
          <>
            {/* ULPIN Bhu-Aadhaar Hero Banner */}
            <div className="p-3.5 rounded-xl border border-gov-primary/30 bg-gov-primary/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  14-Digit 3D ULPIN
                </span>
                <Badge
                  variant={
                    selectedParcel.status === "ACTIVE"
                      ? "success"
                      : selectedParcel.status === "DISPUTED"
                      ? "danger"
                      : "warning"
                  }
                  size="sm"
                  dot
                >
                  {selectedParcel.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-sm sm:text-base font-black text-foreground tracking-tight">
                  {selectedParcel.ulpin}
                </span>
                <Tooltip content={copied ? "Copied!" : "Copy ULPIN"} position="left">
                  <button
                    onClick={handleCopyULPIN}
                    className="p-1 rounded hover:bg-gov-primary/15 text-gov-primary transition-colors"
                    aria-label="Copy ULPIN"
                  >
                    {copied ? <Check className="h-4 w-4 text-gov-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* TAB 1: PROPERTY INTELLIGENCE */}
            {activeTab === "intelligence" && (
              <div className="space-y-3 animate-in fade-in-0">
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Survey / CTS No.</span>
                    <span className="font-bold text-foreground font-mono">{selectedParcel.surveyNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Cadastral Plot</span>
                    <span className="font-bold text-foreground font-mono">{selectedParcel.parcelNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Carpet Area</span>
                    <span className="font-bold text-foreground font-mono">{selectedParcel.carpetAreaSqm.toLocaleString()} m²</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Land Use</span>
                    <span className="font-bold text-foreground">{selectedParcel.landUse}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase block">Registered Owner</span>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gov-primary" />
                    <span className="font-bold text-foreground">{selectedParcel.ownerName}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase block">Cadastral Jurisdiction</span>
                  <div className="flex items-center space-x-1.5 text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-gov-accent shrink-0" />
                    <span>{selectedParcel.village}, {selectedParcel.taluka}, {selectedParcel.district}, {selectedParcel.state}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SURVEY HISTORY */}
            {activeTab === "survey" && (
              <div className="space-y-3 animate-in fade-in-0">
                <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Latest RTK DGPS Mission</span>
                    <Badge variant="accent" size="sm" className="font-mono text-[9px]">SURV-2026-042</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-muted-foreground block text-[9px]">GNSS Precision:</span>
                      <span className="text-gov-success font-bold">1.4 cm (Fixed)</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">Survey Datum:</span>
                      <span className="text-foreground">WGS84 / UTM 43N</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">GCP Benchmark:</span>
                      <span className="text-gov-primary font-bold">GCP-102</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">Surveyor ID:</span>
                      <span className="text-foreground">IN-MH-704</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Corner Boundary Markers (4 Points)
                  </span>
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between text-slate-300">
                      <span>CP-1 (NW Corner):</span>
                      <span className="text-gov-primary">72.8280° E, 19.1385° N</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>CP-2 (NE Corner):</span>
                      <span className="text-gov-primary">72.8290° E, 19.1385° N</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>CP-3 (SE Corner):</span>
                      <span className="text-gov-primary">72.8290° E, 19.1379° N</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>CP-4 (SW Corner):</span>
                      <span className="text-gov-primary">72.8280° E, 19.1379° N</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MUTATION TIMELINE */}
            {activeTab === "mutation" && (
              <div className="space-y-3 animate-in fade-in-0">
                <div className="relative pl-5 border-l-2 border-border space-y-3.5">
                  <div className="relative">
                    <div className="absolute -left-[25px] top-0.5 h-3 w-3 rounded-full bg-gov-success border-2 border-background" />
                    <span className="text-[10px] font-mono text-muted-foreground">14-Jan-2026</span>
                    <h5 className="text-xs font-bold text-foreground">3D Strata Sub-division Approved</h5>
                    <p className="text-[10px] text-muted-foreground">48 Residential vertical units registered under ISO 19152 LADM.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[25px] top-0.5 h-3 w-3 rounded-full bg-gov-primary border-2 border-background" />
                    <span className="text-[10px] font-mono text-muted-foreground">18-Aug-2023</span>
                    <h5 className="text-xs font-bold text-foreground">Title Mutation (Sale Deed #842)</h5>
                    <p className="text-[10px] text-muted-foreground">Transferred from Original Gaothan Assignee to Rajiv M. Mehra.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[25px] top-0.5 h-3 w-3 rounded-full bg-slate-500 border-2 border-background" />
                    <span className="text-[10px] font-mono text-muted-foreground">05-Mar-2019</span>
                    <h5 className="text-xs font-bold text-foreground">Initial Cadastral Survey (CTS Sheet #14)</h5>
                    <p className="text-[10px] text-muted-foreground">City Survey Office, Andheri Taluka.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ULPIN BREAKDOWN */}
            {activeTab === "ulpin" && (
              <div className="space-y-3 animate-in fade-in-0">
                <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2 text-xs font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    National ULPIN Architecture
                  </span>
                  <div className="space-y-1">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">State Code (27):</span>
                      <span className="font-bold text-foreground">Maharashtra</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">District (518):</span>
                      <span className="font-bold text-foreground">Mumbai Suburban</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Taluka (001):</span>
                      <span className="font-bold text-foreground">Andheri</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Village (0042):</span>
                      <span className="font-bold text-foreground">Versova</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Parcel ID (01):</span>
                      <span className="font-bold text-gov-primary">CTS-142/1</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cross-Module Navigation Links */}
            <div className="pt-2 border-t border-border/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Synchronized Module Portals
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/viewer-3d" className="w-full">
                  <Button variant="default" size="sm" className="w-full text-xs font-bold justify-start" leftIcon={<Box className="h-3.5 w-3.5" />}>
                    Open 3D Twin
                  </Button>
                </Link>

                <Link href="/properties" className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold justify-start" leftIcon={<FileCheck2 className="h-3.5 w-3.5 text-gov-primary" />}>
                    LADM Record
                  </Button>
                </Link>

                <Link href="/survey" className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold justify-start" leftIcon={<Radio className="h-3.5 w-3.5 text-gov-accent" />}>
                    Survey Mission
                  </Button>
                </Link>

                <Link href="/ai" className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold justify-start" leftIcon={<Sparkles className="h-3.5 w-3.5 text-gov-warning" />}>
                    AI Risk Audit
                  </Button>
                </Link>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportParcel}
                className="w-full text-xs font-medium text-muted-foreground hover:text-foreground"
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Export Parcel GeoJSON
              </Button>
            </div>
          </>
        ) : (
          <div className="py-12 text-center space-y-3">
            <MapPin className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground font-sans">
              Click any cadastral parcel on the map to inspect ownership, 3D strata units, survey history, and ULPIN lifecycle.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
