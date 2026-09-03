"use client";

import * as React from "react";
import { useGISStore } from "../stores/use-gis-store";
import { useSurveyStore } from "@/features/survey/stores/use-survey-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  MapPin,
  X,
  Copy,
  Check,
  ExternalLink,
  Send,
  Crosshair,
  Compass,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export function CoordinateInspector() {
  const {
    isCoordinatePickerActive,
    pickedCoordinate,
    setPickedCoordinate,
    setCoordinatePickerActive,
  } = useGISStore();

  const [copiedType, setCopiedType] = React.useState<string | null>(null);
  const [surveySent, setSurveySent] = React.useState(false);

  if (!isCoordinatePickerActive && !pickedCoordinate) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  const handleSendToSurvey = () => {
    if (!pickedCoordinate) return;

    useSurveyStore.getState().addCapturedPoint({
      id: `pt-gis-${Date.now().toString().slice(-4)}`,
      pointNumber: Math.floor(Math.random() * 100) + 1,
      label: `GIS-PICK-${pickedCoordinate.utm.easting.toFixed(0)}`,
      latitude: pickedCoordinate.lat,
      longitude: pickedCoordinate.lng,
      altitudeAMSL: pickedCoordinate.elevationMeters,
      accuracyMeters: 0.014,
      hdop: 0.9,
      satelliteCount: 22,
      fixType: "RTK_FIX",
      timestamp: new Date().toISOString(),
      isCornerMarker: true,
      notes: `Imported from GIS Coordinate Inspector (UTM 43N: ${pickedCoordinate.utm.easting}, ${pickedCoordinate.utm.northing})`,
    });

    setSurveySent(true);
    setTimeout(() => setSurveySent(false), 2500);
  };

  return (
    <div className="absolute top-14 left-4 z-30 w-84 sm:w-96 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl p-4 space-y-3.5 select-none animate-in fade-in-0 slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gov-primary/10 text-gov-primary">
            <Crosshair className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-foreground tracking-tight">
              Coordinate Inspector
            </h4>
            <p className="text-[10px] text-muted-foreground font-medium">
              WGS84 &bull; UTM Zone 43N (EPSG:32643)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Badge
            variant={isCoordinatePickerActive ? "accent" : "outline"}
            size="sm"
            className="font-mono text-[9px]"
          >
            {isCoordinatePickerActive ? "CLICK MAP TO PIN" : "PINNED"}
          </Badge>
          <button
            onClick={() => {
              setPickedCoordinate(null);
              setCoordinatePickerActive(false);
            }}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Close Coordinate Inspector"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Coordinate Values Matrix */}
      {pickedCoordinate ? (
        <div className="space-y-2.5 text-xs font-mono">
          {/* Latitude & Longitude (WGS84) */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase block">Latitude</span>
              <span className="font-bold text-foreground">{pickedCoordinate.lat.toFixed(6)}°</span>
              <span className="text-[10px] text-slate-400 block truncate">
                {pickedCoordinate.formattedDMS.lat}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase block">Longitude</span>
              <span className="font-bold text-foreground">{pickedCoordinate.lng.toFixed(6)}°</span>
              <span className="text-[10px] text-slate-400 block truncate">
                {pickedCoordinate.formattedDMS.lng}
              </span>
            </div>
          </div>

          {/* UTM Zone 43N & Elevation */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase block">UTM Easting</span>
              <span className="font-bold text-gov-primary">{pickedCoordinate.utm.easting.toFixed(1)} m</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase block">UTM Northing</span>
              <span className="font-bold text-gov-primary">{pickedCoordinate.utm.northing.toFixed(1)} m</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase block">Elevation</span>
              <span className="font-bold text-gov-accent">{pickedCoordinate.elevationMeters} m</span>
            </div>
          </div>

          {/* Action Button Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => handleCopy(`${pickedCoordinate.lat.toFixed(6)}, ${pickedCoordinate.lng.toFixed(6)}`, "coords")}
              className="px-2 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-[10px] font-sans font-medium flex items-center justify-center space-x-1 transition-colors"
            >
              {copiedType === "coords" ? <Check className="h-3 w-3 text-gov-success" /> : <Copy className="h-3 w-3" />}
              <span>{copiedType === "coords" ? "Copied!" : "Coords"}</span>
            </button>

            <button
              onClick={() => handleCopy(pickedCoordinate.wkt, "wkt")}
              className="px-2 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-[10px] font-sans font-medium flex items-center justify-center space-x-1 transition-colors"
            >
              {copiedType === "wkt" ? <Check className="h-3 w-3 text-gov-success" /> : <Copy className="h-3 w-3" />}
              <span>{copiedType === "wkt" ? "Copied!" : "WKT"}</span>
            </button>

            <button
              onClick={() => handleCopy(pickedCoordinate.geojsonString, "geojson")}
              className="px-2 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-[10px] font-sans font-medium flex items-center justify-center space-x-1 transition-colors"
            >
              {copiedType === "geojson" ? <Check className="h-3 w-3 text-gov-success" /> : <Copy className="h-3 w-3" />}
              <span>{copiedType === "geojson" ? "Copied!" : "GeoJSON"}</span>
            </button>

            <a
              href={pickedCoordinate.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-[10px] font-sans font-medium flex items-center justify-center space-x-1 transition-colors text-foreground"
            >
              <span>Maps</span>
              <ExternalLink className="h-3 w-3 text-gov-primary" />
            </a>
          </div>

          {/* Survey Bridge Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendToSurvey}
            className="w-full text-xs font-bold"
            leftIcon={surveySent ? <Check className="h-3.5 w-3.5 text-gov-success" /> : <Send className="h-3.5 w-3.5 text-gov-accent" />}
          >
            {surveySent ? "Point Captured in Survey Mission!" : "Populate Survey Workspace"}
          </Button>
        </div>
      ) : (
        <div className="py-4 text-center space-y-2">
          <MapPin className="h-6 w-6 text-gov-primary mx-auto animate-bounce" />
          <p className="text-xs text-muted-foreground font-sans">
            Click anywhere on the map to place a draggable coordinate inspection pin.
          </p>
        </div>
      )}
    </div>
  );
}
