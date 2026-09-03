"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSurveyStore } from "../stores/use-survey-store";
import { turfService } from "@/features/gis/services/turf-service";
import { indiaBoundaryService } from "@/features/property/services/india-boundary-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Send,
  ShieldCheck,
  Compass,
  FileCheck,
} from "lucide-react";

export function BoundaryCapturePanel() {
  const {
    missions,
    activeMissionId,
    liveTelemetry,
    addCapturedPoint,
    deleteCapturedPoint,
    runValidationChecklist,
    submitActiveMission,
    setQADialogOpen,
  } = useSurveyStore();

  const mission = missions.find((m) => m.id === activeMissionId) || missions[0];

  const handleCapturePoint = () => {
    // 1. India-First Sovereign Boundary Validation
    if (!indiaBoundaryService.isInsideIndia(liveTelemetry.longitude, liveTelemetry.latitude)) {
      alert("Sovereign Boundary Enforcement: Point capture disabled outside the Republic of India.");
      return;
    }

    const nextPointNumber = mission.points.length + 1;
    const newPoint = {
      id: `pt-${Date.now()}`,
      pointNumber: nextPointNumber,
      label: `CP-${nextPointNumber}`,
      latitude: liveTelemetry.latitude,
      longitude: liveTelemetry.longitude,
      altitudeAMSL: liveTelemetry.altitudeAMSL,
      accuracyMeters: liveTelemetry.horizontalAccuracyCm / 100,
      hdop: liveTelemetry.hdop,
      satelliteCount: liveTelemetry.satelliteCount,
      fixType: liveTelemetry.fixType,
      baseStationId: liveTelemetry.baseStationId,
      correctionAgeSec: liveTelemetry.correctionLatencySec,
      timestamp: new Date().toLocaleTimeString(),
      isCornerMarker: true,
      notes: `Recorded at ${new Date().toLocaleTimeString()} with ${liveTelemetry.fixType}`,
    };

    addCapturedPoint(newPoint);
  };

  // Compute live boundary metrics using turf
  const pointCoords = mission.points.map((p) => [p.longitude, p.latitude]);
  const areaResult = turfService.calculateArea(pointCoords);
  const perimeterResult = turfService.calculatePerimeter(pointCoords);

  const isClosed =
    mission.points.length >= 3 &&
    (mission.points.length >= 4 ||
      (mission.points[0]?.latitude === mission.points[mission.points.length - 1]?.latitude &&
        mission.points[0]?.longitude === mission.points[mission.points.length - 1]?.longitude));

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-xs">
      {/* Panel Header */}
      <div className="p-4 border-b border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-foreground text-sm">
              {mission.missionNumber}
            </span>
            <Badge
              variant={
                mission.status === "QA_APPROVED"
                  ? "success"
                  : mission.status === "SUBMITTED"
                  ? "accent"
                  : mission.status === "IN_PROGRESS"
                  ? "warning"
                  : "outline"
              }
              size="sm"
            >
              {mission.status}
            </Badge>
            <Badge variant="outline" size="sm" className="font-mono text-[9px]">
              Priority: {mission.priority}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {mission.title} &bull; CTS No: <strong>{mission.surveyNumber}</strong> ({mission.village})
          </p>
        </div>

        {/* Action: Capture Live Point */}
        {mission.status !== "QA_APPROVED" && mission.status !== "SUBMITTED" && (
          <Button
            variant="default"
            size="sm"
            className="font-bold shadow-md"
            onClick={handleCapturePoint}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Record Corner Point (CP-{mission.points.length + 1})
          </Button>
        )}
      </div>

      {/* Real-Time Cadastral Geometry Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 border-b border-border/70 bg-background text-center font-mono">
        <div className="p-2 rounded-lg bg-card border border-border/60">
          <span className="text-[10px] text-muted-foreground block">Corner Points</span>
          <span className="font-bold text-foreground text-sm">{mission.points.length}</span>
        </div>
        <div className="p-2 rounded-lg bg-card border border-border/60">
          <span className="text-[10px] text-muted-foreground block">Enclosed Area</span>
          <span className="font-bold text-foreground text-sm">
            {areaResult.sqm.toLocaleString()} m²
          </span>
        </div>
        <div className="p-2 rounded-lg bg-card border border-border/60">
          <span className="text-[10px] text-muted-foreground block">Perimeter</span>
          <span className="font-bold text-foreground text-sm">{perimeterResult} m</span>
        </div>
        <div className="p-2 rounded-lg bg-card border border-border/60">
          <span className="text-[10px] text-muted-foreground block">Polygon Closure</span>
          <span className={cn("font-bold text-sm", isClosed ? "text-gov-success" : "text-gov-warning")}>
            {isClosed ? "Loop Closed" : "Open Loop"}
          </span>
        </div>
      </div>

      {/* Captured Vertices Table */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
            Captured Cadastral Boundary Points ({mission.points.length})
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Datum: EPSG:4326</span>
        </div>

        {mission.points.length > 0 ? (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-[11px] font-mono">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-2 text-left font-semibold">Label</th>
                  <th className="p-2 text-left font-semibold">Latitude</th>
                  <th className="p-2 text-left font-semibold">Longitude</th>
                  <th className="p-2 text-left font-semibold">Elevation</th>
                  <th className="p-2 text-left font-semibold">Accuracy</th>
                  <th className="p-2 text-left font-semibold">Fix Type</th>
                  <th className="p-2 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mission.points.map((pt) => (
                  <tr key={pt.id} className="hover:bg-muted/20">
                    <td className="p-2 font-bold text-gov-primary">{pt.label}</td>
                    <td className="p-2 text-foreground">{pt.latitude.toFixed(6)}° N</td>
                    <td className="p-2 text-foreground">{pt.longitude.toFixed(6)}° E</td>
                    <td className="p-2 text-muted-foreground">{pt.altitudeAMSL}m</td>
                    <td className="p-2 text-gov-success font-semibold">
                      {(pt.accuracyMeters * 100).toFixed(1)} cm
                    </td>
                    <td className="p-2">
                      <Badge variant="outline" size="sm" className="text-[9px] py-0">
                        {pt.fixType}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deleteCapturedPoint(pt.id)}
                        className="p-1 rounded text-muted-foreground hover:text-gov-danger hover:bg-gov-danger/10"
                        title="Delete point"
                        aria-label="Delete point"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
            No boundary points captured yet. Click <strong>Record Corner Point</strong> above to record live GNSS coordinates.
          </div>
        )}
      </div>

      {/* Footer Controls: Validation & QA Review */}
      <div className="p-4 border-t border-border bg-muted/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="font-semibold"
            onClick={() => runValidationChecklist()}
            leftIcon={<ShieldCheck className="h-3.5 w-3.5 text-gov-accent" />}
          >
            Run Validation Checklist
          </Button>

          {mission.status === "SUBMITTED" && (
            <Button
              variant="outline"
              size="sm"
              className="font-semibold text-purple-600 border-purple-500/30 hover:bg-purple-500/10"
              onClick={() => setQADialogOpen(true)}
              leftIcon={<FileCheck className="h-3.5 w-3.5" />}
            >
              QA &amp; Registrar Review
            </Button>
          )}
        </div>

        {mission.status !== "SUBMITTED" && mission.status !== "QA_APPROVED" && (
          <Button
            variant="default"
            size="sm"
            className="font-bold"
            onClick={() => submitActiveMission()}
            leftIcon={<Send className="h-3.5 w-3.5" />}
          >
            Submit Survey for QA Verification
          </Button>
        )}
      </div>
    </div>
  );
}
