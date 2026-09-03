"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDigitalTwinStore } from "../stores/use-digital-twin-store";
import type { SectionCutMode } from "../types/twin-types";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Scissors, RotateCcw, X, Layers } from "lucide-react";

export function SectionController() {
  const {
    isSectionToolsOpen,
    toggleSectionTools,
    sectionCutMode,
    setSectionCut,
    sectionPlanePosition,
    setSectionPlanePosition,
    resetSectionCut,
  } = useDigitalTwinStore();

  if (!isSectionToolsOpen) return null;

  return (
    <div className="absolute top-16 right-4 z-20 w-80 rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-md select-none animate-in fade-in-0 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-border/70 mb-3">
        <div className="flex items-center space-x-2">
          <Scissors className="h-4 w-4 text-gov-accent" />
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Section Cutting Planes
          </h4>
        </div>
        <div className="flex items-center space-x-1.5">
          <Tooltip content="Reset Clipping Planes" position="left">
            <button
              onClick={resetSectionCut}
              className="p-1 rounded text-muted-foreground hover:text-foreground"
              aria-label="Reset Cut"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <button
            onClick={toggleSectionTools}
            className="p-1 rounded text-muted-foreground hover:text-foreground"
            aria-label="Close Section Tools"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {/* Cut Mode Selector */}
        <div className="grid grid-cols-3 gap-1.5">
          <Button
            variant={sectionCutMode === "horizontal" ? "default" : "outline"}
            size="sm"
            className="h-7 text-[11px] font-semibold"
            onClick={() => setSectionCut("horizontal", 27)}
          >
            Horizontal
          </Button>
          <Button
            variant={sectionCutMode === "vertical-x" ? "default" : "outline"}
            size="sm"
            className="h-7 text-[11px] font-semibold"
            onClick={() => setSectionCut("vertical-x", 0)}
          >
            Vertical-X
          </Button>
          <Button
            variant={sectionCutMode === "vertical-z" ? "default" : "outline"}
            size="sm"
            className="h-7 text-[11px] font-semibold"
            onClick={() => setSectionCut("vertical-z", 0)}
          >
            Vertical-Z
          </Button>
        </div>

        {/* Plane Position Slider */}
        {sectionCutMode !== "none" ? (
          <div className="space-y-2 pt-1 border-t border-border/70">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-muted-foreground font-semibold">Cutting Position:</span>
              <span className="font-mono font-bold text-foreground">
                {sectionPlanePosition.toFixed(1)} m
              </span>
            </div>

            <input
              type="range"
              min={sectionCutMode === "horizontal" ? 0 : -20}
              max={sectionCutMode === "horizontal" ? 54 : 20}
              step="0.5"
              value={sectionPlanePosition}
              onChange={(e) => setSectionPlanePosition(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-gov-accent"
            />
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground italic text-center py-1">
            Select a cutting mode above to slice the 3D model.
          </p>
        )}
      </div>
    </div>
  );
}
