"use client";

import * as React from "react";
import { useULPINStore } from "../stores/use-ulpin-store";
import type { ULPINGenerationParams } from "../types/ulpin-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Layers,
  Building,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  ShieldCheck,
} from "lucide-react";

export function ULPINGeneratorCard() {
  const { registry, activeUlpinId, generateNewULPIN, createRevision } = useULPINStore();
  const currentRecord = registry.find((r) => r.id === activeUlpinId) || registry[0];

  const [isRevisionMode, setIsRevisionMode] = React.useState(false);
  const [revisionReason, setRevisionReason] = React.useState(
    "Mutation Deed of Partition / Transfer of Title"
  );

  // Form State
  const [stateCode, setStateCode] = React.useState("27");
  const [districtCode, setDistrictCode] = React.useState("518");
  const [talukaCode, setTalukaCode] = React.useState("4182");
  const [villageCode, setVillageCode] = React.useState("554210");
  const [surveyNumber, setSurveyNumber] = React.useState("CTS-142");
  const [subdivision, setSubdivision] = React.useState("01");
  const [parcelNumber, setParcelNumber] = React.useState("401A");

  // Vertical Strata Fields
  const [isStrata, setIsStrata] = React.useState(true);
  const [buildingCode, setBuildingCode] = React.useState("01");
  const [towerNumber, setTowerNumber] = React.useState("TA");
  const [floorLevel, setFloorLevel] = React.useState(5);
  const [unitNumber, setUnitNumber] = React.useState("502");

  // Measurements & Title
  const [carpetAreaSqm, setCarpetAreaSqm] = React.useState(125.0);
  const [elevationAmsl, setElevationAmsl] = React.useState(26.5);
  const [ownerName, setOwnerName] = React.useState("Rajiv M. Mehra & Sunita R. Mehra");

  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const params: ULPINGenerationParams = {
      hierarchy: {
        countryCode: "IND",
        stateCode,
        districtCode,
        talukaCode,
        villageCode,
        surveyNumber,
        subdivision,
        parcelNumber,
        ...(isStrata
          ? {
              buildingCode,
              towerNumber,
              floorLevel,
              unitNumber,
            }
          : {}),
      },
      centroid: [72.8285, 19.1382],
      elevationAmsl,
      carpetAreaSqm,
      volumeCum: isStrata ? carpetAreaSqm * 2.85 : undefined,
      ownerName,
      ownerMaskedId: "PAN: ABCDE****F / AADHAAR: XXXX-XXXX-4821",
      issuingAuthority: "Sub-Registrar Office, Andheri West",
    };

    if (isRevisionMode) {
      const result = createRevision(currentRecord.id, params, revisionReason);
      if (result.success) {
        setFeedback({
          type: "success",
          message: `Success! New Revision Version ${result.record?.version} generated: ${result.record?.ulpin3D || result.record?.baseUlpin}`,
        });
      } else {
        setFeedback({ type: "error", message: result.errors?.join("; ") || "Failed to generate revision." });
      }
    } else {
      const result = generateNewULPIN(params);
      if (result.success) {
        setFeedback({
          type: "success",
          message: `Success! ULPIN successfully generated: ${result.record?.ulpin3D || result.record?.baseUlpin}`,
        });
      } else {
        setFeedback({ type: "error", message: result.errors?.join("; ") || "Validation failed." });
      }
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Sparkles className="h-4 w-4 text-gov-accent" />
            <span>Deterministic ULPIN Generator</span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Generate official 14-digit Bhu-Aadhaar and 3D Strata volumetric keys.
          </p>
        </div>

        {/* Mode Toggle: New vs Revision */}
        <div className="flex items-center space-x-2 bg-muted/40 p-1 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setIsRevisionMode(false)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
              !isRevisionMode
                ? "bg-gov-primary text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            New ULPIN
          </button>
          <button
            type="button"
            onClick={() => setIsRevisionMode(true)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
              isRevisionMode
                ? "bg-gov-warning text-slate-950 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Revision
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg border flex items-center space-x-2 text-xs ${
            feedback.type === "success"
              ? "border-gov-success/30 bg-gov-success/10 text-gov-success"
              : "border-gov-danger/30 bg-gov-danger/10 text-gov-danger"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Revision Reason input if revision mode */}
        {isRevisionMode && (
          <div className="p-3 rounded-lg border border-gov-warning/40 bg-gov-warning/10 space-y-1.5">
            <label className="font-bold text-foreground block">
              Reason for Revision (Mandatory Audit Trail):
            </label>
            <Input
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              placeholder="e.g. Sub-division partition order / Boundary rectification"
              required
            />
            <p className="text-[10px] text-muted-foreground">
              Existing ULPIN ({currentRecord.ulpin3D || currentRecord.baseUlpin} v{currentRecord.version}) will be archived as SUPERSEDED. Never overwritten.
            </p>
          </div>
        )}

        {/* 12-Level Hierarchy Parameters */}
        <div className="space-y-2">
          <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
            Administrative &amp; Cadastral Parameters
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-semibold">State LGD (2)</label>
              <Input value={stateCode} onChange={(e) => setStateCode(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-semibold">District LGD (3)</label>
              <Input value={districtCode} onChange={(e) => setDistrictCode(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-semibold">Village LGD (5)</label>
              <Input value={villageCode} onChange={(e) => setVillageCode(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-semibold">Parcel No (4)</label>
              <Input value={parcelNumber} onChange={(e) => setParcelNumber(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* 3D Strata Parameters Toggle */}
        <div className="space-y-2.5 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
              <Building className="h-3.5 w-3.5 text-purple-500" />
              <span>Vertical 3D Strata Extension</span>
            </span>
            <button
              type="button"
              onClick={() => setIsStrata(!isStrata)}
              className="text-[11px] text-gov-accent font-semibold hover:underline"
            >
              {isStrata ? "Switch to 2D Ground Parcel" : "Enable 3D Strata Unit"}
            </button>
          </div>

          {isStrata && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg border border-border bg-muted/20">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-semibold">Building Code</label>
                <Input value={buildingCode} onChange={(e) => setBuildingCode(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-semibold">Tower Code</label>
                <Input value={towerNumber} onChange={(e) => setTowerNumber(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-semibold">Floor Level</label>
                <Input
                  type="number"
                  value={floorLevel}
                  onChange={(e) => setFloorLevel(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-semibold">Unit Number</label>
                <Input value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* Property Title & Spatial Extent */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-border">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] text-muted-foreground font-semibold">Registered Owner(s)</label>
            <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground font-semibold">Carpet Area (m²)</label>
            <Input
              type="number"
              value={carpetAreaSqm}
              onChange={(e) => setCarpetAreaSqm(parseFloat(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="default"
            size="sm"
            className="font-bold"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            {isRevisionMode ? "Issue New ULPIN Revision" : "Generate & Certify ULPIN"}
          </Button>
        </div>
      </form>
    </div>
  );
}
