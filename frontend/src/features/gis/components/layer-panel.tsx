"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useGISStore } from "../stores/use-gis-store";
import { useLayerStore } from "../stores/use-layer-store";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Layers,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  X,
  Sparkles,
  Sliders,
} from "lucide-react";

export function LayerPanel() {
  const { isLayerPanelOpen, setLayerPanelOpen } = useGISStore();
  const { layers, toggleLayerVisibility, setLayerOpacity, reorderLayers, resetLayers } =
    useLayerStore();

  const [expandedOpacityId, setExpandedOpacityId] = React.useState<string | null>(null);

  if (!isLayerPanelOpen) return null;

  return (
    <aside className="relative flex flex-col w-72 sm:w-80 h-full border-r border-border bg-card/95 backdrop-blur-md shadow-lg select-none z-10 animate-in slide-in-from-left duration-200">
      {/* Panel Header */}
      <div className="flex h-11 items-center justify-between px-4 border-b border-border/80">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-gov-primary" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Cadastral Layers
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-semibold">
            {layers.filter((l) => l.visible).length}/{layers.length}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <Tooltip content="Reset All Layers" position="bottom">
            <button
              onClick={resetLayers}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
              aria-label="Reset All Layers"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <button
            onClick={() => setLayerPanelOpen(false)}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Close Layer Panel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Layer List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {layers.map((layer, index) => {
          const isOpacityExpanded = expandedOpacityId === layer.id;

          return (
            <div
              key={layer.id}
              className={cn(
                "rounded-lg border transition-all p-2 text-xs",
                layer.visible
                  ? "border-border bg-card hover:border-primary/40"
                  : "border-transparent bg-muted/20 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                {/* Visibility Toggle & Color Swatch */}
                <div className="flex items-center space-x-2.5 flex-1 min-w-0 pr-2">
                  <button
                    type="button"
                    onClick={() => toggleLayerVisibility(layer.id)}
                    className={cn(
                      "p-1 rounded transition-colors shrink-0",
                      layer.visible
                        ? "text-gov-primary bg-gov-primary/10"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    aria-label={layer.visible ? `Hide ${layer.name}` : `Show ${layer.name}`}
                  >
                    {layer.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>

                  {/* Swatch */}
                  <span
                    className="h-3 w-3 rounded-full shrink-0 border border-black/10"
                    style={{ backgroundColor: layer.color }}
                  />

                  {/* Layer Name & Type */}
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-foreground truncate block text-xs">
                      {layer.name}
                    </span>
                    {layer.type === "future" && (
                      <span className="inline-flex items-center space-x-1 text-[9px] font-bold text-gov-accent">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>Extension Ready</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Layer Tools (Opacity dropdown & Order buttons) */}
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setExpandedOpacityId(isOpacityExpanded ? null : layer.id)}
                    className={cn(
                      "p-1 rounded text-muted-foreground hover:text-foreground",
                      isOpacityExpanded && "text-gov-primary bg-gov-primary/10"
                    )}
                    title="Opacity Slider"
                    aria-label="Opacity Slider"
                  >
                    <Sliders className="h-3 w-3" />
                  </button>

                  <button
                    disabled={index === 0}
                    onClick={() => reorderLayers(index, index - 1)}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move Layer Up"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>

                  <button
                    disabled={index === layers.length - 1}
                    onClick={() => reorderLayers(index, index + 1)}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move Layer Down"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Collapsible Opacity Slider */}
              {isOpacityExpanded && (
                <div className="mt-2 pt-2 border-t border-border/70 space-y-1 animate-in fade-in-0">
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Opacity</span>
                    <span>{Math.round(layer.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={layer.opacity}
                    onChange={(e) => setLayerOpacity(layer.id, parseFloat(e.target.value))}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-gov-primary"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
