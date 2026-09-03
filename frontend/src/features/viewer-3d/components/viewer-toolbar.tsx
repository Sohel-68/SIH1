"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDigitalTwinStore } from "../stores/use-digital-twin-store";
import { gisSyncService } from "../services/gis-sync-service";
import { CAMERA_PRESETS } from "../constants/camera-presets";
import type { CameraMode, LightingMode, Measurement3DType } from "../types/twin-types";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Compass,
  Eye,
  Camera,
  Layers,
  Info,
  Sun,
  Moon,
  Sunset,
  Ruler,
  Maximize2,
  Box,
  Scissors,
  Sliders,
  RotateCcw,
  MapPin,
  Footprints,
  Plane,
  User,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function ViewerToolbar() {
  const router = useRouter();
  const {
    cameraMode,
    setCameraMode,
    isOrtho,
    toggleOrtho,
    activeBookmarkId,
    applyBookmark,
    lightingMode,
    setLightingMode,
    shadowsEnabled,
    toggleShadows,
    measurementType,
    setMeasurementType,
    setMeasurementResult,
    clearMeasurement,
    isExplorerOpen,
    toggleExplorer,
    isPropertyInspectorOpen,
    togglePropertyInspector,
    isFloorToolsOpen,
    toggleFloorTools,
    isSectionToolsOpen,
    toggleSectionTools,
    resetScene,
  } = useDigitalTwinStore();

  const handleMeasurementClick = (type: Measurement3DType) => {
    if (measurementType === type) {
      clearMeasurement();
      return;
    }
    setMeasurementType(type);

    // Compute realistic architectural 3D measurements for Palm Heights Tower 1
    if (type === "height") {
      setMeasurementResult({
        type: "height",
        primaryValue: "54.0 m (Total Building Height)",
        secondaryValue: "18 Storeys &bull; Floor-to-Floor Height: 3.0 m",
        points: [[0, 0, 0], [0, 54, 0]],
      });
    } else if (type === "volume") {
      setMeasurementResult({
        type: "volume",
        primaryValue: "26,550 m³ (Enclosed Volumetric Envelope)",
        secondaryValue: "72 Strata Apartments &bull; Total Floor Area: 8,850 m²",
        points: [[-12, 0, -12], [12, 54, 12]],
      });
    } else if (type === "distance") {
      setMeasurementResult({
        type: "distance",
        primaryValue: "33.94 m (Diagonal Footprint)",
        secondaryValue: "Setback: 6.0 m to Western Boundary",
        points: [[-12, 0, -12], [12, 0, 12]],
      });
    } else if (type === "area") {
      setMeasurementResult({
        type: "area",
        primaryValue: "576.0 m² (Typical Floor Plate)",
        secondaryValue: "24.0 m × 24.0 m Concrete Slab",
        points: [[-12, 0, -12], [12, 0, 12]],
      });
    }
  };

  const bookmarkItems = CAMERA_PRESETS.map((preset) => ({
    label: (
      <div className="flex items-center space-x-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: preset.thumbnailColor }} />
        <span className="text-xs font-semibold">{preset.name}</span>
      </div>
    ),
    onClick: () => applyBookmark(preset),
  }));

  const handleSyncToGIS = () => {
    gisSyncService.sync3DToGIS();
    router.push("/gis");
  };

  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-border bg-card/90 px-3 py-1.5 shadow-sm backdrop-blur-md select-none z-20">
      {/* LEFT: Building Explorer Toggle, Camera Bookmarks, Perspective/Ortho */}
      <div className="flex items-center space-x-2">
        <Tooltip content="Toggle Strata Building Explorer" position="bottom">
          <Button
            variant={isExplorerOpen ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={toggleExplorer}
            leftIcon={<Layers className="h-3.5 w-3.5" />}
          >
            <span className="hidden sm:inline">Explorer</span>
          </Button>
        </Tooltip>

        {/* Camera Bookmarks Dropdown */}
        <DropdownMenu
          align="left"
          trigger={
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold" leftIcon={<Camera className="h-3.5 w-3.5" />}>
              <span className="hidden sm:inline">Camera View</span>
            </Button>
          }
          items={bookmarkItems}
        />

        {/* Orthographic / Perspective Toggle */}
        <Tooltip content={isOrtho ? "Switch to Perspective View" : "Switch to Orthographic View"} position="bottom">
          <Button
            variant={isOrtho ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={toggleOrtho}
          >
            {isOrtho ? "ORTHO" : "PERSP"}
          </Button>
        </Tooltip>
      </div>

      {/* CENTER: Floor Tools, Section Tools, Lighting & 3D Measurements */}
      <div className="flex items-center space-x-1.5">
        {/* Floor Tools Overlay Toggle */}
        <Tooltip content="Floor Isolation & Exploded View Tools" position="bottom">
          <Button
            variant={isFloorToolsOpen ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={toggleFloorTools}
            leftIcon={<Sliders className="h-3.5 w-3.5" />}
          >
            <span className="hidden md:inline">Floor Tools</span>
          </Button>
        </Tooltip>

        {/* Section Plane Tool Toggle */}
        <Tooltip content="Architectural Section Cutting Planes" position="bottom">
          <Button
            variant={isSectionToolsOpen ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={toggleSectionTools}
            leftIcon={<Scissors className="h-3.5 w-3.5" />}
          >
            <span className="hidden md:inline">Section Cuts</span>
          </Button>
        </Tooltip>

        {/* Lighting Simulation Palette */}
        <div className="flex items-center space-x-0.5 bg-muted/40 p-0.5 rounded-lg border border-border">
          <Tooltip content="Day Light Mode" position="bottom">
            <button
              onClick={() => setLightingMode("day")}
              className={cn("p-1.5 rounded transition-colors", lightingMode === "day" ? "bg-gov-primary text-white" : "text-muted-foreground hover:text-foreground")}
              aria-label="Day Mode"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Tooltip content="Golden Hour Mode" position="bottom">
            <button
              onClick={() => setLightingMode("golden-hour")}
              className={cn("p-1.5 rounded transition-colors", lightingMode === "golden-hour" ? "bg-gov-primary text-white" : "text-muted-foreground hover:text-foreground")}
              aria-label="Golden Hour"
            >
              <Sunset className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Tooltip content="Night Lighting Mode" position="bottom">
            <button
              onClick={() => setLightingMode("night")}
              className={cn("p-1.5 rounded transition-colors", lightingMode === "night" ? "bg-gov-primary text-white" : "text-muted-foreground hover:text-foreground")}
              aria-label="Night Mode"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>

        {/* 3D Measurement Palette */}
        <div className="flex items-center space-x-0.5 bg-muted/40 p-0.5 rounded-lg border border-border">
          <Tooltip content="Measure Building & Floor Height" position="bottom">
            <button
              onClick={() => handleMeasurementClick("height")}
              className={cn("p-1.5 rounded transition-colors", measurementType === "height" ? "bg-gov-warning text-slate-950 font-bold" : "text-muted-foreground hover:text-foreground")}
              aria-label="Measure Height"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Tooltip content="Measure Distance" position="bottom">
            <button
              onClick={() => handleMeasurementClick("distance")}
              className={cn("p-1.5 rounded transition-colors", measurementType === "distance" ? "bg-gov-warning text-slate-950 font-bold" : "text-muted-foreground hover:text-foreground")}
              aria-label="Measure Distance"
            >
              <Ruler className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Tooltip content="Measure Volumetric Cube (m³)" position="bottom">
            <button
              onClick={() => handleMeasurementClick("volume")}
              className={cn("p-1.5 rounded transition-colors", measurementType === "volume" ? "bg-gov-warning text-slate-950 font-bold" : "text-muted-foreground hover:text-foreground")}
              aria-label="Measure Volume"
            >
              <Box className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* RIGHT: 2D GIS Sync, Reset Scene, Property Inspector Toggle */}
      <div className="flex items-center space-x-2">
        {/* 2D GIS Synchronization */}
        <Tooltip content="Synchronize & Pan in 2D GIS Map" position="bottom">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={handleSyncToGIS}
            leftIcon={<MapPin className="h-3.5 w-3.5 text-gov-primary" />}
          >
            <span className="hidden xl:inline">Sync 2D GIS</span>
          </Button>
        </Tooltip>

        {/* Reset Scene */}
        <Tooltip content="Reset Camera & Exploded View" position="bottom">
          <Button variant="ghost" size="icon-sm" onClick={resetScene} aria-label="Reset 3D Scene">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </Tooltip>

        {/* Property Inspector Toggle */}
        <Tooltip content="Toggle 3D Property Inspector" position="bottom">
          <Button
            variant={isPropertyInspectorOpen ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={togglePropertyInspector}
            leftIcon={<Info className="h-3.5 w-3.5" />}
          >
            <span className="hidden sm:inline">Inspector</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
