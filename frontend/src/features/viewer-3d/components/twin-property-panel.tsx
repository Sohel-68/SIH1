"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDigitalTwinStore } from "../stores/use-digital-twin-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Info,
  X,
  Layers,
  Building,
  User,
  Hash,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Mountain,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function TwinPropertyPanel() {
  const router = useRouter();
  const {
    nodes,
    selectedNodeId,
    selectNode,
    isPropertyInspectorOpen,
    togglePropertyInspector,
  } = useDigitalTwinStore();

  const [copied, setCopied] = React.useState(false);

  if (!isPropertyInspectorOpen) return null;

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleCopyULPIN = () => {
    const key = selectedNode?.metadata.ulpin3D || selectedNode?.metadata.ulpin;
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="relative flex flex-col w-80 sm:w-96 h-full border-l border-border bg-card/95 backdrop-blur-md shadow-lg select-none z-10 animate-in slide-in-from-right duration-200">
      {/* Panel Header */}
      <div className="flex h-11 items-center justify-between px-4 border-b border-border/80">
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-gov-accent" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            3D Property Inspector
          </h3>
        </div>
        <button
          onClick={togglePropertyInspector}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Close Inspector"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {selectedNode ? (
          <>
            {/* Header: Node Type & 3D ULPIN */}
            <div className="p-3.5 rounded-xl border border-gov-accent/30 bg-gov-accent/5 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="accent" size="sm" className="font-mono text-[9px]">
                  {selectedNode.type}
                </Badge>
                {selectedNode.metadata.usageType && (
                  <Badge variant="outline" size="sm">
                    {selectedNode.metadata.usageType}
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="font-bold text-foreground text-sm">{selectedNode.name}</h3>
                <span className="text-[11px] text-muted-foreground font-mono">{selectedNode.code}</span>
              </div>

              {(selectedNode.metadata.ulpin3D || selectedNode.metadata.ulpin) && (
                <div className="flex items-center justify-between pt-1 border-t border-border/60">
                  <span className="font-mono text-xs font-bold text-foreground truncate">
                    {selectedNode.metadata.ulpin3D || selectedNode.metadata.ulpin}
                  </span>
                  <Tooltip content={copied ? "Copied!" : "Copy ULPIN"} position="left">
                    <button
                      onClick={handleCopyULPIN}
                      className="p-1 rounded text-gov-accent hover:bg-gov-accent/10"
                      aria-label="Copy ULPIN"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-gov-success" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* Spatial & Volumetric Measurements */}
            <div className="space-y-2">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                Volumetric Geometry
              </h4>
              <div className="rounded-lg border border-border divide-y divide-border bg-card">
                {selectedNode.metadata.carpetAreaSqm && (
                  <div className="p-2.5 flex justify-between">
                    <span className="text-muted-foreground">Carpet Area:</span>
                    <span className="font-bold text-foreground font-mono">
                      {selectedNode.metadata.carpetAreaSqm} m²
                    </span>
                  </div>
                )}
                {selectedNode.metadata.builtupAreaSqm && (
                  <div className="p-2.5 flex justify-between">
                    <span className="text-muted-foreground">Built-up Area:</span>
                    <span className="font-bold text-foreground font-mono">
                      {selectedNode.metadata.builtupAreaSqm} m²
                    </span>
                  </div>
                )}
                {selectedNode.metadata.volumeCum && (
                  <div className="p-2.5 flex justify-between">
                    <span className="text-muted-foreground">Volumetric Cube:</span>
                    <span className="font-bold text-foreground font-mono">
                      {selectedNode.metadata.volumeCum.toLocaleString()} m³
                    </span>
                  </div>
                )}
                <div className="p-2.5 flex justify-between">
                  <span className="text-muted-foreground">Height:</span>
                  <span className="font-mono text-foreground font-semibold">
                    {selectedNode.coordinates.heightMeters} m
                  </span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-muted-foreground">Elevation (AMSL):</span>
                  <span className="font-mono text-foreground font-semibold">
                    {selectedNode.coordinates.elevationAmsl} m
                  </span>
                </div>
              </div>
            </div>

            {/* Cadastral Ownership & Tax */}
            {selectedNode.metadata.ownerName && (
              <div className="space-y-2">
                <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                  Title &amp; Revenue
                </h4>
                <div className="rounded-lg border border-border divide-y divide-border bg-card">
                  <div className="p-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Registered Owner:</span>
                    <span className="font-semibold text-foreground text-right">
                      {selectedNode.metadata.ownerName}
                    </span>
                  </div>
                  {selectedNode.metadata.taxStatus && (
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-muted-foreground">Municipal Tax:</span>
                      <Badge variant="success" size="sm">
                        {selectedNode.metadata.taxStatus}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Real-World Coordinates */}
            <div className="space-y-2">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                Georeferenced Datum
              </h4>
              <div className="rounded-lg border border-border bg-card p-2.5 text-[11px] font-mono space-y-1 text-muted-foreground">
                <p>Lat: <span className="text-foreground">{selectedNode.coordinates.latitude.toFixed(6)}° N</span></p>
                <p>Lng: <span className="text-foreground">{selectedNode.coordinates.longitude.toFixed(6)}° E</span></p>
                <p>CRS: <span className="text-foreground">EPSG:4326 / UTM 43N</span></p>
              </div>
            </div>

            {/* Cross-Module Navigation Actions */}
            <div className="pt-2 space-y-2">
              <Button
                variant="default"
                size="sm"
                className="w-full font-bold"
                onClick={() => router.push("/properties")}
                leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
              >
                Inspect Full Cadastral Dossier
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full font-semibold"
                onClick={() => router.push("/gis")}
                leftIcon={<MapPin className="h-3.5 w-3.5" />}
              >
                View in 2D GIS Map
              </Button>
            </div>
          </>
        ) : (
          <EmptyState
            icon={<Building className="h-6 w-6 text-gov-accent" />}
            title="No Object Selected"
            description="Click on any building, floor slab, or strata apartment in the 3D viewport to inspect its volumetric measurements and 3D ULPIN."
            className="py-12 border-dashed bg-transparent"
          />
        )}
      </div>
    </aside>
  );
}
