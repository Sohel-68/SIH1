"use client";

import * as React from "react";
import { RouteGuard } from "@/features/auth/components/route-guard";
import { ViewerToolbar } from "@/features/viewer-3d/components/viewer-toolbar";
import { BuildingExplorer } from "@/features/viewer-3d/components/building-explorer";
import { SceneCanvas } from "@/features/viewer-3d/components/scene-canvas";
import { TwinPropertyPanel } from "@/features/viewer-3d/components/twin-property-panel";
import { FloorController } from "@/features/viewer-3d/components/floor-controller";
import { SectionController } from "@/features/viewer-3d/components/section-controller";

export default function DigitalTwinViewerPage() {
  return (
    <RouteGuard requiredPermissions={["parcel:read"]}>
      <div className="flex flex-col flex-1 h-full w-full overflow-hidden bg-slate-950">
        {/* Top Command Ribbon / 3D Toolbar */}
        <ViewerToolbar />

        {/* Center Interactive 3D Spatial Canvas */}
        <div className="relative flex flex-1 h-full w-full overflow-hidden">
          {/* Left Collapsible Building Hierarchy Explorer */}
          <BuildingExplorer />

          {/* Center WebGL 3D Scene Viewport */}
          <div className="relative flex-1 h-full w-full overflow-hidden">
            <SceneCanvas />

            {/* Floating Overlays */}
            <FloorController />
            <SectionController />
          </div>

          {/* Right Collapsible 3D Property Inspector Panel */}
          <TwinPropertyPanel />
        </div>
      </div>
    </RouteGuard>
  );
}
