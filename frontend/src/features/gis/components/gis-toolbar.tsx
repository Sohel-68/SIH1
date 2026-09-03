"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useGISStore } from "../stores/use-gis-store";
import { useDrawingStore } from "../stores/use-drawing-store";
import { useMeasurementStore } from "../stores/use-measurement-store";
import { usePermissions } from "@/features/auth/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Search,
  Layers,
  Info,
  Map as MapIcon,
  MousePointer,
  MapPin,
  Spline,
  Hexagon,
  Square,
  Circle,
  Pencil,
  Ruler,
  Maximize,
  Compass,
  Magnet,
  RotateCcw,
  RotateCw,
  Check,
  X,
  Upload,
  Download,
  ShieldAlert,
  Crosshair,
  Landmark,
} from "lucide-react";

import { BASEMAP_PROVIDERS, type RealBasemapId } from "../constants/basemap-providers";
import { ADMIN_HIERARCHY_TREE, type AdministrativeUnit } from "../constants/sample-admin-boundaries-geojson";

export function GISToolbar() {
  const {
    realBasemap,
    setRealBasemap,
    isLayerPanelOpen,
    toggleLayerPanel,
    isPropertyPanelOpen,
    togglePropertyPanel,
    setSearchModalOpen,
    setImportExportModalOpen,
    resetView,
    drawingMode,
    setDrawingMode,
    isOutsideIndia,
    isCoordinatePickerActive,
    setCoordinatePickerActive,
    activeAdminUnit,
    setActiveAdminUnit,
  } = useGISStore();

  const {
    undo,
    redo,
    finishDrawing,
    clearActive,
    isSnappingEnabled,
    toggleSnapping,
  } = useDrawingStore();

  const { measurementType, setMeasurementType, clearMeasurement } = useMeasurementStore();
  const { hasPermission } = usePermissions();

  const canDraw = (hasPermission("survey:submit") || hasPermission("parcel:write")) && !isOutsideIndia;

  // Basemap Dropdown Items
  const basemapItems = (Object.keys(BASEMAP_PROVIDERS) as RealBasemapId[]).map((key) => {
    const provider = BASEMAP_PROVIDERS[key];
    return {
      label: (
        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-medium">{provider.name}</span>
        </div>
      ),
      onClick: () => setRealBasemap(key),
    };
  });

  // Admin Boundaries Dropdown Items
  const adminItems = ADMIN_HIERARCHY_TREE.map((unit) => ({
    label: (
      <div className="flex items-center justify-between space-x-2 w-full">
        <span className="text-xs font-medium">{unit.name}</span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">{unit.level}</span>
      </div>
    ),
    onClick: () => setActiveAdminUnit(unit),
  }));

  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-border bg-card/90 px-3 py-1.5 shadow-sm backdrop-blur-md select-none z-20">
      {/* LEFT: Search, Layer Toggle, Basemap Selector, Admin Boundaries */}
      <div className="flex items-center space-x-2">
        {/* Layer Panel Toggle */}
        <Tooltip content="Toggle Cadastral Layers Panel" position="bottom">
          <Button
            variant={isLayerPanelOpen ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={toggleLayerPanel}
            leftIcon={<Layers className="h-3.5 w-3.5" />}
          >
            <span className="hidden sm:inline">Layers</span>
          </Button>
        </Tooltip>

        {/* Basemap Picker Dropdown */}
        <DropdownMenu
          align="left"
          trigger={
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold" leftIcon={<MapIcon className="h-3.5 w-3.5" />}>
              <span className="hidden sm:inline">{BASEMAP_PROVIDERS[realBasemap]?.name || "Basemap"}</span>
            </Button>
          }
          items={basemapItems}
        />

        {/* Admin Units Hierarchy Dropdown */}
        <DropdownMenu
          align="left"
          trigger={
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold" leftIcon={<Landmark className="h-3.5 w-3.5 text-gov-accent" />}>
              <span className="hidden md:inline">{activeAdminUnit?.name.split(" ")[0] || "Boundaries"}</span>
            </Button>
          }
          items={adminItems}
        />

        {/* Global GIS Cadastre Search Trigger */}
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="flex items-center space-x-2 h-8 px-3 rounded-lg border border-input bg-background/80 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-sm"
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden lg:inline">Search ULPIN, CTS No, Lat/Lng...</span>
          <span className="lg:hidden">Search...</span>
          <kbd className="hidden xl:inline-flex h-4 px-1 text-[9px] font-mono border rounded bg-muted">
            /
          </kbd>
        </button>
      </div>

      {/* CENTER: Coordinate Picker, Drawing & Measurement Palettes */}
      <div className="flex items-center space-x-1.5">
        {/* Interactive Coordinate Picker Toggle */}
        <Tooltip content="Interactive Coordinate Inspector (Proj4 UTM 43N)" position="bottom">
          <Button
            variant={isCoordinatePickerActive ? "accent" : "outline"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={() => setCoordinatePickerActive(!isCoordinatePickerActive)}
            leftIcon={<Crosshair className="h-3.5 w-3.5 text-gov-accent" />}
          >
            <span className="hidden md:inline">Inspect Point</span>
          </Button>
        </Tooltip>

        {/* Drawing Tools Palette (Gated by RBAC) */}
        {canDraw ? (
          <div className="flex items-center space-x-1 bg-muted/40 p-0.5 rounded-lg border border-border">
            <Tooltip content="Select Mode" position="bottom">
              <button
                type="button"
                onClick={() => {
                  setDrawingMode("none");
                  clearMeasurement();
                }}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  drawingMode === "none" && measurementType === "none"
                    ? "bg-gov-primary text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-label="Select Mode"
              >
                <MousePointer className="h-3.5 w-3.5" />
              </button>
            </Tooltip>

            <Tooltip content="Draw Survey Point" position="bottom">
              <button
                type="button"
                onClick={() => setDrawingMode("point")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  drawingMode === "point" ? "bg-gov-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-label="Draw Survey Point"
              >
                <MapPin className="h-3.5 w-3.5" />
              </button>
            </Tooltip>

            <Tooltip content="Draw Boundary LineString" position="bottom">
              <button
                type="button"
                onClick={() => setDrawingMode("line")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  drawingMode === "line" ? "bg-gov-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-label="Draw Boundary LineString"
              >
                <Spline className="h-3.5 w-3.5" />
              </button>
            </Tooltip>

            <Tooltip content="Draw Cadastral Polygon" position="bottom">
              <button
                type="button"
                onClick={() => setDrawingMode("polygon")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  drawingMode === "polygon" ? "bg-gov-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-label="Draw Cadastral Polygon"
              >
                <Hexagon className="h-3.5 w-3.5" />
              </button>
            </Tooltip>

            <Tooltip content="Draw Rectangle Parcel" position="bottom">
              <button
                type="button"
                onClick={() => setDrawingMode("rectangle")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  drawingMode === "rectangle" ? "bg-gov-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-label="Draw Rectangle Parcel"
              >
                <Square className="h-3.5 w-3.5" />
              </button>
            </Tooltip>

            <Tooltip content="Draw Circle Buffer" position="bottom">
              <button
                type="button"
                onClick={() => setDrawingMode("circle")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  drawingMode === "circle" ? "bg-gov-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-label="Draw Circle Buffer"
              >
                <Circle className="h-3.5 w-3.5" />
              </button>
            </Tooltip>

            {/* Snapping Toggle */}
            <Tooltip content={isSnappingEnabled ? "Snapping Enabled (5m)" : "Snapping Disabled"} position="bottom">
              <button
                type="button"
                onClick={toggleSnapping}
                className={cn(
                  "p-1.5 rounded transition-colors ml-1",
                  isSnappingEnabled ? "text-gov-success bg-gov-success/15" : "text-muted-foreground hover:bg-muted"
                )}
                aria-label="Toggle Snapping"
              >
                <Magnet className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-1 text-[11px] text-muted-foreground bg-muted/20 px-2 py-1 rounded border border-border">
            <ShieldAlert className="h-3.5 w-3.5 text-gov-warning" />
            <span>Read-Only Viewer</span>
          </div>
        )}

        {/* Measurement Tools Palette */}
        <div className="flex items-center space-x-1 bg-muted/40 p-0.5 rounded-lg border border-border">
          <Tooltip content="Measure Geodesic Area" position="bottom">
            <button
              type="button"
              onClick={() => {
                setDrawingMode("none");
                setMeasurementType("area");
              }}
              className={cn(
                "p-1.5 rounded transition-colors",
                measurementType === "area" ? "bg-gov-warning text-slate-950 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-label="Measure Area"
            >
              <Maximize className="h-3.5 w-3.5" />
            </button>
          </Tooltip>

          <Tooltip content="Measure Distance" position="bottom">
            <button
              type="button"
              onClick={() => {
                setDrawingMode("none");
                setMeasurementType("distance");
              }}
              className={cn(
                "p-1.5 rounded transition-colors",
                measurementType === "distance" ? "bg-gov-warning text-slate-950 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-label="Measure Distance"
            >
              <Ruler className="h-3.5 w-3.5" />
            </button>
          </Tooltip>

          <Tooltip content="Measure Bearing" position="bottom">
            <button
              type="button"
              onClick={() => {
                setDrawingMode("none");
                setMeasurementType("bearing");
              }}
              className={cn(
                "p-1.5 rounded transition-colors",
                measurementType === "bearing" ? "bg-gov-warning text-slate-950 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-label="Measure Bearing"
            >
              <Compass className="h-3.5 w-3.5" />
            </button>
          </Tooltip>

          {measurementType !== "none" && (
            <button onClick={clearMeasurement} className="p-1.5 text-gov-danger hover:bg-gov-danger/10 rounded" aria-label="Clear Measurement">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* RIGHT: Import/Export, Property Info Toggle, Extent Reset */}
      <div className="flex items-center space-x-2">
        {/* Import/Export Modal Trigger */}
        <Tooltip content="Import / Export Spatial Geometries (Shapefile, GeoJSON, KML, WKT)" position="bottom">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={() => setImportExportModalOpen(true)}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            <span className="hidden xl:inline">I/O</span>
          </Button>
        </Tooltip>

        {/* Reset Map Extent */}
        <Tooltip content="Fit To Entire Cadastre" position="bottom">
          <Button variant="ghost" size="icon-sm" onClick={resetView} aria-label="Reset Map Extent">
            <Crosshair className="h-4 w-4" />
          </Button>
        </Tooltip>

        {/* Property Panel Toggle */}
        <Tooltip content="Toggle Property Details Panel" position="bottom">
          <Button
            variant={isPropertyPanelOpen ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={togglePropertyPanel}
            leftIcon={<Info className="h-3.5 w-3.5" />}
          >
            <span className="hidden sm:inline">Inspector</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
