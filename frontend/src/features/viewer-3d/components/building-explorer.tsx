"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDigitalTwinStore } from "../stores/use-digital-twin-store";
import type { DigitalTwinNode } from "../types/twin-types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  ChevronRight,
  ChevronDown,
  Building,
  Home,
  Hash,
  Search,
  Eye,
  Focus,
  X,
  Sliders,
} from "lucide-react";

export function BuildingExplorer() {
  const {
    nodes,
    selectedNodeId,
    selectNode,
    isExplorerOpen,
    toggleExplorer,
    setIsolatedFloorNumber,
    isolatedFloorNumber,
  } = useDigitalTwinStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedIds, setExpandedIds] = React.useState<string[]>([
    "node-twin-parcel-01",
    "node-twin-bldg-01",
    "node-twin-tower-a",
    "node-twin-flr-5",
    "node-twin-unit-502",
  ]);

  if (!isExplorerOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "PARCEL":
        return <Hash className="h-3.5 w-3.5 text-gov-primary" />;
      case "BUILDING":
      case "TOWER":
        return <Building className="h-3.5 w-3.5 text-purple-500" />;
      case "FLOOR":
        return <Layers className="h-3.5 w-3.5 text-indigo-500" />;
      case "UNIT":
        return <Home className="h-3.5 w-3.5 text-gov-accent" />;
      default:
        return <Layers className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const renderNode = (node: DigitalTwinNode, depth: number = 0) => {
    const isExpanded = expandedIds.includes(node.id);
    const isSelected = selectedNodeId === node.id;
    const children = nodes.filter((n) => n.parentId === node.id);
    const hasChildren = children.length > 0;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        node.name.toLowerCase().includes(q) ||
        node.code.toLowerCase().includes(q) ||
        node.metadata.ulpin3D?.toLowerCase().includes(q);

      const hasMatchingChild = children.some(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.metadata.ulpin3D?.toLowerCase().includes(q)
      );

      if (!matches && !hasMatchingChild) return null;
    }

    return (
      <div key={node.id} className="text-xs select-none">
        <div
          onClick={() => selectNode(node.id)}
          style={{ paddingLeft: `${depth * 14 + 6}px` }}
          className={cn(
            "flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer transition-colors group",
            isSelected
              ? "bg-gov-accent/15 text-gov-accent font-bold border border-gov-accent/40"
              : "hover:bg-muted/50 text-foreground"
          )}
        >
          <div className="flex items-center space-x-1.5 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                className="p-0.5 rounded text-muted-foreground hover:text-foreground"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            ) : (
              <span className="w-3" />
            )}

            {getNodeIcon(node.type)}
            <span className="truncate">{node.name}</span>
          </div>

          <div className="flex items-center space-x-1 shrink-0 ml-1.5">
            {node.type === "FLOOR" && node.metadata.floorLevel && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const fNum = node.metadata.floorLevel!;
                  setIsolatedFloorNumber(isolatedFloorNumber === fNum ? null : fNum);
                }}
                className={cn(
                  "p-1 rounded text-[10px] font-mono",
                  isolatedFloorNumber === node.metadata.floorLevel
                    ? "bg-gov-warning text-slate-950 font-bold"
                    : "text-muted-foreground hover:bg-muted"
                )}
                title="Isolate Floor"
              >
                Solo
              </button>
            )}

            <Badge variant="outline" size="sm" className="font-mono text-[9px] px-1 py-0 hidden sm:inline-flex">
              {node.code}
            </Badge>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="space-y-0.5 border-l border-border/40 ml-3">
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootNodes = nodes.filter((n) => !n.parentId);

  return (
    <aside className="relative flex flex-col w-72 sm:w-80 h-full border-r border-border bg-card/95 backdrop-blur-md shadow-lg select-none z-10 animate-in slide-in-from-left duration-200">
      {/* Panel Header */}
      <div className="flex h-11 items-center justify-between px-4 border-b border-border/80">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-gov-accent" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Building Explorer
          </h3>
        </div>
        <button
          onClick={toggleExplorer}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Close Explorer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-border/60">
        <Input
          placeholder="Search floor, unit, or ULPIN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="h-3.5 w-3.5" />}
          className="h-8 text-xs"
        />
      </div>

      {/* Hierarchical Tree Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {rootNodes.map((root) => renderNode(root))}
      </div>
    </aside>
  );
}
