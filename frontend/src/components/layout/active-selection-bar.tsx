"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalSelectionStore } from "@/stores/use-global-selection-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Box,
  Building2,
  QrCode,
  Sparkles,
  Compass,
  FileText,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export function ActiveSelectionBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeSelection, hasActiveSelection, clearActiveSelection } =
    useGlobalSelectionStore();

  const [isMinimized, setIsMinimized] = React.useState(false);

  // Do not display on login or verify pages
  if (!hasActiveSelection || !activeSelection || pathname === "/login" || pathname === "/verify") {
    return null;
  }

  return (
    <aside
      aria-label="Active Cadastral Selection HUD"
      className="fixed bottom-4 right-4 z-40 max-w-lg rounded-2xl border border-border/80 bg-card/95 p-3 shadow-2xl backdrop-blur-lg select-none transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gov-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gov-accent" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Active Cadastral Context
          </span>
          <Badge variant="outline" size="sm" className="font-mono text-[9px] text-gov-primary border-gov-primary/30">
            {activeSelection.village} &bull; {activeSelection.surveyNumber}
          </Badge>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized((prev) => !prev)}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            title={isMinimized ? "Expand HUD" : "Minimize HUD"}
            aria-label={isMinimized ? "Expand HUD" : "Minimize HUD"}
          >
            {isMinimized ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={clearActiveSelection}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            title="Clear Selection"
            aria-label="Clear Selection"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="pt-2 space-y-2.5">
          <div>
            <span className="font-mono font-bold text-xs text-foreground block truncate">
              {activeSelection.ulpin}
            </span>
            <p className="text-[11px] text-muted-foreground truncate">
              {activeSelection.propertyName} &bull; Owner: {activeSelection.ownerName || "Registered Title"}
            </p>
          </div>

          {/* Quick Cross-Module Jump Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Button
              variant={pathname === "/gis" ? "default" : "outline"}
              size="sm"
              className="h-7 text-[10px] font-semibold px-2"
              onClick={() => router.push("/gis")}
              leftIcon={<MapPin className="h-3 w-3 text-gov-primary" />}
            >
              2D GIS
            </Button>

            <Button
              variant={pathname === "/viewer-3d" ? "default" : "outline"}
              size="sm"
              className="h-7 text-[10px] font-semibold px-2"
              onClick={() => router.push("/viewer-3d")}
              leftIcon={<Box className="h-3 w-3 text-gov-accent" />}
            >
              3D Twin
            </Button>

            <Button
              variant={pathname === "/properties" ? "default" : "outline"}
              size="sm"
              className="h-7 text-[10px] font-semibold px-2"
              onClick={() => router.push("/properties")}
              leftIcon={<Building2 className="h-3 w-3 text-purple-500" />}
            >
              Property
            </Button>

            <Button
              variant={pathname === "/ulpin" ? "default" : "outline"}
              size="sm"
              className="h-7 text-[10px] font-semibold px-2"
              onClick={() => router.push("/ulpin")}
              leftIcon={<QrCode className="h-3 w-3 text-gov-primary" />}
            >
              ULPIN
            </Button>

            <Button
              variant={pathname === "/ai" ? "default" : "outline"}
              size="sm"
              className="h-7 text-[10px] font-semibold px-2"
              onClick={() => router.push("/ai")}
              leftIcon={<Sparkles className="h-3 w-3 text-purple-600" />}
            >
              AI Risk
            </Button>

            <Button
              variant={pathname === "/survey" ? "default" : "outline"}
              size="sm"
              className="h-7 text-[10px] font-semibold px-2"
              onClick={() => router.push("/survey")}
              leftIcon={<Compass className="h-3 w-3 text-gov-warning" />}
            >
              Survey
            </Button>

            <Button
              variant={pathname === "/admin" ? "default" : "outline"}
              size="sm"
              className="h-7 text-[10px] font-semibold px-2"
              onClick={() => router.push("/admin")}
              leftIcon={<FileText className="h-3 w-3 text-indigo-500" />}
            >
              E-Office
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
