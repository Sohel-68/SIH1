"use client";

import * as React from "react";
import { RouteGuard } from "@/features/auth/components/route-guard";
import { IndiaBoundaryGuard } from "@/features/property/components/india-boundary-guard";
import { HierarchyTree } from "@/features/property/components/hierarchy-tree";
import { PropertyIntelligenceCard } from "@/features/property/components/property-intelligence-card";

export default function PropertyIntelligencePage() {
  return (
    <RouteGuard requiredPermissions={["parcel:read"]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            National Land Administration &amp; Property Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            ISO 19152 (LADM) Compliant Property Registry, 12-Level Administrative Hierarchy &amp; Cadastral Mutation Timeline.
          </p>
        </div>

        {/* India-First Sovereign Territorial Boundary Enforcement Banner */}
        <IndiaBoundaryGuard />

        {/* 2-Column Responsive Spatial Registry Surface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 12-Level Administrative Hierarchy Tree */}
          <div className="lg:col-span-4 space-y-3">
            <HierarchyTree />
          </div>

          {/* Right Column: Property Intelligence Dossier */}
          <div className="lg:col-span-8 space-y-4">
            <PropertyIntelligenceCard />
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
