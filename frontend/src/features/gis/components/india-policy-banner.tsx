"use client";

import * as React from "react";
import { useGISStore } from "../stores/use-gis-store";
import { Button } from "@/components/ui/button";
import { Info, MapPin } from "lucide-react";

export function IndiaPolicyBanner() {
  const { isOutsideIndia, setCenter, setZoom } = useGISStore();

  if (!isOutsideIndia) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-xl w-[90%] sm:w-auto rounded-xl border border-sky-500/40 bg-sky-950/90 text-sky-200 px-4 py-2.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs select-none animate-in fade-in-0 duration-200">
      <div className="flex items-center space-x-2">
        <Info className="h-4 w-4 text-sky-400 shrink-0" />
        <span className="leading-snug">
          <strong>Viewing Mode Only.</strong> GeoStrata cadastral operations are available only inside the sovereign territory of the Republic of India.
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-7 text-[10px] font-bold border-sky-400/40 bg-sky-900/40 hover:bg-sky-900 text-sky-100 shrink-0"
        onClick={() => {
          setCenter([72.8285, 19.1382]);
          setZoom(16.5);
        }}
        leftIcon={<MapPin className="h-3 w-3" />}
      >
        Fly to India
      </Button>
    </div>
  );
}
