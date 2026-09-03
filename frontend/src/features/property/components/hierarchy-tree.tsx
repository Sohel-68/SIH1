"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePropertyStore } from "../stores/use-property-store";
import { HIERARCHY_LEVEL_LABELS } from "../types/hierarchy-types";
import type { AdministrativeNode } from "../types/hierarchy-types";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronDown,
  Globe,
  MapPin,
  Building,
  Layers,
  Home,
  FileText,
  Hash,
} from "lucide-react";

export function HierarchyTree() {
  const { hierarchyNodes, selectedNodeId, selectHierarchyNode, expandedNodeIds, toggleExpandNode } =
    usePropertyStore();

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "COUNTRY":
        return <Globe className="h-3.5 w-3.5 text-gov-primary" />;
      case "STATE":
      case "DISTRICT":
      case "TALUKA":
        return <MapPin className="h-3.5 w-3.5 text-gov-accent" />;
      case "VILLAGE":
      case "WARD":
        return <MapPin className="h-3.5 w-3.5 text-gov-warning" />;
      case "SURVEY_NUMBER":
      case "SUBDIVISION":
      case "PARCEL":
        return <Hash className="h-3.5 w-3.5 text-gov-success" />;
      case "BUILDING":
        return <Building className="h-3.5 w-3.5 text-purple-500" />;
      case "FLOOR":
        return <Layers className="h-3.5 w-3.5 text-indigo-500" />;
      case "UNIT":
        return <Home className="h-3.5 w-3.5 text-emerald-500" />;
      default:
        return <FileText className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  // Build tree hierarchy map
  const renderNode = (node: AdministrativeNode, depth: number = 0) => {
    const isExpanded = expandedNodeIds.includes(node.id);
    const isSelected = selectedNodeId === node.id;
    const children = hierarchyNodes.filter((n) => n.parentId === node.id);
    const hasChildren = children.length > 0;

    return (
      <div key={node.id} className="text-xs select-none">
        <div
          onClick={() => selectHierarchyNode(node.id)}
          style={{ paddingLeft: `${depth * 14 + 6}px` }}
          className={cn(
            "flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer transition-colors group",
            isSelected
              ? "bg-gov-primary/10 text-gov-primary font-bold border border-gov-primary/30"
              : "hover:bg-muted/50 text-foreground"
          )}
        >
          <div className="flex items-center space-x-1.5 min-w-0">
            {/* Expand / Collapse toggle button */}
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandNode(node.id);
                }}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              <span className="w-4" />
            )}

            {/* Level Icon */}
            {getLevelIcon(node.level)}

            {/* Node Title & Level Badge */}
            <span className="truncate">{node.name}</span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0 ml-2">
            <span className="text-[10px] text-muted-foreground font-mono">
              {node.code}
            </span>
            <Badge
              variant="outline"
              size="sm"
              className="text-[9px] font-mono px-1 py-0 hidden sm:inline-flex"
            >
              {HIERARCHY_LEVEL_LABELS[node.level]}
            </Badge>
          </div>
        </div>

        {/* Render Children Recursively */}
        {isExpanded && hasChildren && (
          <div className="space-y-0.5 border-l border-border/40 ml-3.5">
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Root nodes are nodes with no parentId
  const rootNodes = hierarchyNodes.filter((n) => !n.parentId);

  return (
    <div className="space-y-1 overflow-y-auto max-h-[680px] p-2 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-border px-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          12-Level Cadastral Hierarchy
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          ISO 19152 (LADM)
        </span>
      </div>
      {rootNodes.map((root) => renderNode(root))}
    </div>
  );
}
