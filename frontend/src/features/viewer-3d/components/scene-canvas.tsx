"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDigitalTwinStore } from "../stores/use-digital-twin-store";
import { ThreeSceneManager } from "../services/three-scene-manager";
import { CAMERA_PRESETS } from "../constants/camera-presets";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Maximize2,
  Compass,
  RotateCcw,
  Sun,
  Moon,
  Layers,
  Ruler,
  HelpCircle,
} from "lucide-react";

export function SceneCanvas() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sceneManagerRef = React.useRef<ThreeSceneManager | null>(null);

  const {
    nodes,
    selectedNodeId,
    selectNode,
    explodedViewOffset,
    isolatedFloorNumber,
    hideAboveFloor,
    hideBelowFloor,
    sectionCutMode,
    sectionPlanePosition,
    lightingMode,
    sunAltitudeDegrees,
    sunAzimuthDegrees,
    isOrtho,
    activeBookmarkId,
    measurementResult,
  } = useDigitalTwinStore();

  // Initialize Three.js WebGL Engine
  React.useEffect(() => {
    if (!containerRef.current) return;

    const manager = new ThreeSceneManager(containerRef.current);
    sceneManagerRef.current = manager;

    manager.populateDigitalTwin(nodes);
    manager.onSelect((id) => {
      selectNode(id);
    });

    return () => {
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  // Update Exploded View
  React.useEffect(() => {
    sceneManagerRef.current?.setExplodedViewOffset(explodedViewOffset);
  }, [explodedViewOffset]);

  // Update Floor Isolation
  React.useEffect(() => {
    sceneManagerRef.current?.applyFloorIsolation(isolatedFloorNumber, hideAboveFloor, hideBelowFloor);
  }, [isolatedFloorNumber, hideAboveFloor, hideBelowFloor]);

  // Update Section Cuts
  React.useEffect(() => {
    sceneManagerRef.current?.applySectionCut(sectionCutMode, sectionPlanePosition);
  }, [sectionCutMode, sectionPlanePosition]);

  // Update Selected Node Highlight
  React.useEffect(() => {
    sceneManagerRef.current?.highlightNode(selectedNodeId);
  }, [selectedNodeId]);

  // Update Lighting / Sun Simulation
  React.useEffect(() => {
    sceneManagerRef.current?.setSunLighting(sunAltitudeDegrees, sunAzimuthDegrees, lightingMode);
  }, [sunAltitudeDegrees, sunAzimuthDegrees, lightingMode]);

  // Update Orthographic vs Perspective Projection
  React.useEffect(() => {
    sceneManagerRef.current?.setCameraProjection(isOrtho);
  }, [isOrtho]);

  // Update Camera Bookmark
  React.useEffect(() => {
    const bookmark = CAMERA_PRESETS.find((b) => b.id === activeBookmarkId);
    if (bookmark && sceneManagerRef.current) {
      sceneManagerRef.current.setCameraBookmark(bookmark.position, bookmark.target);
    }
  }, [activeBookmarkId]);

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Surface */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Measurement Overlay HUD */}
      {measurementResult && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-card/95 border border-gov-warning/50 shadow-2xl backdrop-blur-md flex items-center space-x-3 text-xs animate-in fade-in-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gov-warning/15 text-gov-warning font-bold">
            📐
          </div>
          <div>
            <span className="font-mono font-bold text-foreground text-sm block">
              {measurementResult.primaryValue}
            </span>
            {measurementResult.secondaryValue && (
              <span className="text-[11px] text-muted-foreground">{measurementResult.secondaryValue}</span>
            )}
          </div>
        </div>
      )}

      {/* On-Screen Navigation & Interaction Hints */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-card/85 backdrop-blur-md border border-border text-[11px] text-muted-foreground">
        <span>Rotate: <strong>Left Click + Drag</strong></span>
        <span>&bull;</span>
        <span>Zoom: <strong>Mouse Wheel</strong></span>
        <span>&bull;</span>
        <span>Select: <strong>Left Click on Unit</strong></span>
      </div>
    </div>
  );
}
