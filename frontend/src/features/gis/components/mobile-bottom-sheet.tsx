"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useGISStore } from "../stores/use-gis-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Box, Building2, QrCode, X } from "lucide-react";

export function MobileBottomSheet() {
  const router = useRouter();
  const { selectedParcel, setSelectedParcel } = useGISStore();

  if (!selectedParcel) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 rounded-t-2xl border-t border-border bg-card/95 p-4 shadow-2xl backdrop-blur-lg select-none animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center space-x-2">
          <Badge variant="accent" size="sm" className="font-mono text-[9px]">
            {selectedParcel.surveyNumber}
          </Badge>
          <span className="font-bold text-xs text-foreground truncate">
            {selectedParcel.village} Cadastre
          </span>
        </div>
        <button
          onClick={() => setSelectedParcel(null)}
          className="p-1 rounded text-muted-foreground hover:text-foreground"
          aria-label="Dismiss Sheet"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="py-2.5 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold text-gov-primary">
            {selectedParcel.ulpin}
          </span>
          <Badge variant="outline" size="sm" className="text-[9px]">
            {selectedParcel.landUse}
          </Badge>
        </div>

        <p className="text-muted-foreground text-[11px] truncate">
          Owner: <strong className="text-foreground">{selectedParcel.ownerName}</strong> &bull; Area:{" "}
          <strong className="text-foreground">{selectedParcel.carpetAreaSqm} m²</strong>
        </p>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            className="h-8 text-[10px]"
            onClick={() => router.push("/viewer-3d")}
            leftIcon={<Box className="h-3 w-3" />}
          >
            3D Twin
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px]"
            onClick={() => router.push("/properties")}
            leftIcon={<Building2 className="h-3 w-3" />}
          >
            Dossier
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px]"
            onClick={() => router.push("/ulpin")}
            leftIcon={<QrCode className="h-3 w-3" />}
          >
            ULPIN
          </Button>
        </div>
      </div>
    </div>
  );
}
