"use client";

import * as React from "react";
import { useSurveyStore } from "../stores/use-survey-store";
import { dgpsTelemetryService } from "../services/dgps-telemetry-service";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Radio,
  Signal,
  Battery,
  Wifi,
  WifiOff,
  Navigation,
  Globe,
  Crosshair,
  Satellite,
} from "lucide-react";

export function FieldTelemetryBar() {
  const { liveTelemetry, updateLiveTelemetry } = useSurveyStore();

  // Pulse simulated GNSS telemetry every 3 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      const updated = dgpsTelemetryService.getSimulatedTelemetry();
      updateLiveTelemetry(updated);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const isRtkFix = liveTelemetry.fixType === "RTK_FIX";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-xl border border-border bg-card/95 shadow-sm backdrop-blur-md text-xs select-none">
      {/* LEFT: GNSS Hardware & RTK Fix Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gov-primary/10 text-gov-primary">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-foreground">{liveTelemetry.roverModel.split("/")[0]}</span>
              <Badge variant={isRtkFix ? "success" : "warning"} size="sm" dot>
                {liveTelemetry.fixType.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              Base: {liveTelemetry.baseStationId} &bull; Age: {liveTelemetry.correctionLatencySec}s
            </p>
          </div>
        </div>

        {/* Live Coordinates */}
        <div className="hidden md:flex items-center space-x-2 border-l border-border pl-3 font-mono text-[11px]">
          <Crosshair className="h-3.5 w-3.5 text-gov-accent" />
          <span className="text-foreground font-semibold">
            {liveTelemetry.latitude.toFixed(6)}° N, {liveTelemetry.longitude.toFixed(6)}° E
          </span>
          <span className="text-muted-foreground">({liveTelemetry.altitudeAMSL}m AMSL)</span>
        </div>
      </div>

      {/* RIGHT: Accuracy, Satellites, HDOP, Battery, Offline */}
      <div className="flex items-center space-x-3 text-[11px] font-mono">
        {/* Horizontal Accuracy */}
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">Acc:</span>
          <span className="font-bold text-gov-success">
            {liveTelemetry.horizontalAccuracyCm.toFixed(1)} cm
          </span>
        </div>

        {/* Satellites */}
        <div className="flex items-center space-x-1 border-l border-border pl-2.5">
          <Satellite className="h-3 w-3 text-muted-foreground" />
          <span className="text-foreground font-semibold">{liveTelemetry.satelliteCount}</span>
        </div>

        {/* HDOP */}
        <div className="hidden sm:flex items-center space-x-1 border-l border-border pl-2.5">
          <span className="text-muted-foreground">HDOP:</span>
          <span className="text-foreground font-semibold">{liveTelemetry.hdop}</span>
        </div>

        {/* Battery */}
        <div className="flex items-center space-x-1 border-l border-border pl-2.5">
          <Battery className="h-3.5 w-3.5 text-gov-success" />
          <span className="text-foreground font-semibold">{liveTelemetry.batteryPercentage}%</span>
        </div>

        {/* Offline Sync Ready Indicator */}
        <div className="flex items-center space-x-1 border-l border-border pl-2.5">
          <Wifi className="h-3.5 w-3.5 text-gov-primary" />
          <span className="text-[10px] text-muted-foreground hidden sm:inline">Online Sync</span>
        </div>
      </div>
    </div>
  );
}
