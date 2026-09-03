"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { RouteGuard } from "@/features/auth/components/route-guard";
import { GISToolbar } from "@/features/gis/components/gis-toolbar";
import { LayerPanel } from "@/features/gis/components/layer-panel";
import { PropertyPanel } from "@/features/gis/components/property-panel";
import { TelemetryBar } from "@/features/gis/components/telemetry-bar";
import { GISSearchModal } from "@/features/gis/components/gis-search-modal";
import { ImportExportModal } from "@/features/gis/components/import-export-modal";
import { MobileBottomSheet } from "@/features/gis/components/mobile-bottom-sheet";

// Dynamically import MapLibre WebGL canvas with SSR disabled
const RealMapCanvas = dynamic(
  () =>
    import("@/features/gis/components/real-map-canvas").then(
      (mod) => mod.RealMapCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 h-full w-full flex items-center justify-center bg-slate-950 text-slate-400 text-xs font-mono select-none">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 border-2 border-gov-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-gov-primary font-bold">
            Initializing GPU MapLibre GL JS Engine...
          </span>
          <span className="text-[10px] text-muted-foreground">
            Loading Sovereign Basemap &bull; OpenStreetMap
          </span>
        </div>
      </div>
    ),
  }
);

export default function GISWorkspacePage() {
  return (
    <RouteGuard requiredPermissions={["parcel:read"]}>
      <div className="flex flex-col flex-1 h-full w-full overflow-hidden bg-background">
        {/* Top Command Ribbon / GIS Toolbar */}
        <GISToolbar />

        {/* Center Interactive Real Map Workspace */}
        <div className="relative flex flex-1 h-full w-full overflow-hidden">
          {/* Left Collapsible Layer Management Panel */}
          <LayerPanel />

          {/* Center MapLibre GL JS Map Canvas */}
          <RealMapCanvas />

          {/* Right Collapsible Property Inspector Panel */}
          <PropertyPanel />
        </div>

        {/* Bottom Telemetry Status Bar */}
        <TelemetryBar />

        {/* Mobile Parcel Bottom Sheet */}
        <MobileBottomSheet />

        {/* Global GIS Modals */}
        <GISSearchModal />
        <ImportExportModal />
      </div>
    </RouteGuard>
  );
}
