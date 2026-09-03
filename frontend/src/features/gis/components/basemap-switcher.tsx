"use client";

import * as React from "react";
import { useGISStore } from "../stores/use-gis-store";
import { BASEMAP_PROVIDERS, type RealBasemapId } from "../constants/basemap-providers";
import { Badge } from "@/components/ui/badge";
import { Layers, Check, X } from "lucide-react";

export function BasemapSwitcher() {
  const {
    realBasemap,
    setRealBasemap,
    isBasemapSwitcherOpen,
    setBasemapSwitcherOpen,
  } = useGISStore();

  if (!isBasemapSwitcherOpen) return null;

  return (
    <div className="absolute top-16 left-4 z-30 w-72 rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-2xl backdrop-blur-md select-none animate-in fade-in-0 duration-200 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-gov-primary" />
          <span className="font-bold text-xs text-foreground uppercase tracking-wider">
            Basemap Gallery
          </span>
        </div>
        <button
          onClick={() => setBasemapSwitcherOpen(false)}
          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close basemap selector"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.values(BASEMAP_PROVIDERS).map((bm) => {
          const isSelected = realBasemap === bm.id;

          return (
            <div
              key={bm.id}
              onClick={() => setRealBasemap(bm.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                isSelected
                  ? "border-gov-primary bg-gov-primary/10 shadow-sm ring-1 ring-gov-primary/40 font-bold"
                  : "border-border/60 bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <div className="relative h-16 w-full rounded-lg overflow-hidden border border-border/40 bg-slate-900">
                <img
                  src={bm.thumbnail}
                  alt={bm.name}
                  className="h-full w-full object-cover"
                />
                {isSelected && (
                  <div className="absolute top-1 right-1 p-0.5 rounded-full bg-gov-primary text-white shadow">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>

              <div>
                <span className="text-[11px] font-semibold text-foreground block truncate">
                  {bm.name}
                </span>
                <span className="text-[9px] text-muted-foreground line-clamp-1">
                  {bm.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
