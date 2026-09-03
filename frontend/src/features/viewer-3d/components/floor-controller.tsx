"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDigitalTwinStore } from "../stores/use-digital-twin-store";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Sliders,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  X,
  RotateCcw,
} from "lucide-react";

export function FloorController() {
  const {
    isFloorToolsOpen,
    toggleFloorTools,
    activeFloorLevel,
    setActiveFloorLevel,
    isolatedFloorNumber,
    setIsolatedFloorNumber,
    hideAboveFloor,
    setHideAboveFloor,
    hideBelowFloor,
    setHideBelowFloor,
    explodedViewOffset,
    setExplodedViewOffset,
  } = useDigitalTwinStore();

  if (!isFloorToolsOpen) return null;

  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-xl rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-md select-none animate-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-border/70 mb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="h-4 w-4 text-gov-accent" />
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Floor &amp; Strata Tools
          </h4>
        </div>
        <div className="flex items-center space-x-1.5">
          <Tooltip content="Reset Floor Filters" position="top">
            <button
              onClick={() => {
                setIsolatedFloorNumber(null);
                setHideAboveFloor(null);
                setHideBelowFloor(null);
                setExplodedViewOffset(0);
              }}
              className="p-1 rounded text-muted-foreground hover:text-foreground"
              aria-label="Reset Filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <button
            onClick={toggleFloorTools}
            className="p-1 rounded text-muted-foreground hover:text-foreground"
            aria-label="Close Floor Tools"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Floor Level Slider & Isolation */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground font-semibold">Active Floor Level:</span>
            <span className="font-mono font-bold text-foreground text-sm">
              Floor {activeFloorLevel} / 18
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="18"
            step="1"
            value={activeFloorLevel}
            onChange={(e) => setActiveFloorLevel(parseInt(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-gov-accent"
          />

          <div className="flex items-center gap-1.5 pt-1">
            <Button
              variant={isolatedFloorNumber === activeFloorLevel ? "default" : "outline"}
              size="sm"
              className="flex-1 h-7 text-[11px]"
              onClick={() =>
                setIsolatedFloorNumber(
                  isolatedFloorNumber === activeFloorLevel ? null : activeFloorLevel
                )
              }
            >
              {isolatedFloorNumber === activeFloorLevel ? "Solo Active" : "Solo Floor"}
            </Button>

            <Tooltip content="Hide Floors Above Active" position="top">
              <Button
                variant={hideAboveFloor === activeFloorLevel ? "secondary" : "outline"}
                size="sm"
                className="h-7 text-[11px] px-2"
                onClick={() =>
                  setHideAboveFloor(
                    hideAboveFloor === activeFloorLevel ? null : activeFloorLevel
                  )
                }
              >
                <ArrowUp className="h-3 w-3 mr-1" /> Hide Above
              </Button>
            </Tooltip>

            <Tooltip content="Hide Floors Below Active" position="top">
              <Button
                variant={hideBelowFloor === activeFloorLevel ? "secondary" : "outline"}
                size="sm"
                className="h-7 text-[11px] px-2"
                onClick={() =>
                  setHideBelowFloor(
                    hideBelowFloor === activeFloorLevel ? null : activeFloorLevel
                  )
                }
              >
                <ArrowDown className="h-3 w-3 mr-1" /> Hide Below
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Exploded View Vertical Expansion */}
        <div className="space-y-2 sm:border-l sm:border-border sm:pl-4">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground font-semibold flex items-center space-x-1">
              <Sparkles className="h-3.5 w-3.5 text-gov-accent" />
              <span>Exploded View Expansion:</span>
            </span>
            <span className="font-mono font-bold text-foreground">
              {Math.round(explodedViewOffset * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={explodedViewOffset}
            onChange={(e) => setExplodedViewOffset(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-gov-accent"
          />

          <p className="text-[10px] text-muted-foreground pt-1 leading-tight">
            Separates each vertical floor slab along the Y-axis to reveal interior apartment boundaries and core shafts.
          </p>
        </div>
      </div>
    </div>
  );
}
