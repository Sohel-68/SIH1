"use client";

import * as React from "react";
import { usePropertyStore } from "../stores/use-property-store";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, ShieldAlert, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";

export function IndiaBoundaryGuard() {
  const { boundaryViolationAlert, setBoundaryViolationAlert, checkCadastralOperationAllowed } =
    usePropertyStore();

  const handleTestOutside = () => {
    // Coordinates in London / Greenwich: -0.1276, 51.5074 (Outside India)
    checkCadastralOperationAllowed([-0.1276, 51.5074], "Create Parcel");
  };

  const handleTestInside = () => {
    // Coordinates in Mumbai: 72.8285, 19.1382 (Inside India)
    const allowed = checkCadastralOperationAllowed([72.8285, 19.1382], "Create Parcel");
    if (allowed) {
      alert("Validated: Coordinates lie within sovereign Indian territory (Maharashtra). Cadastral mutation permitted.");
    }
  };

  return (
    <>
      {/* India-First Sovereign Status Bar Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl border border-border bg-card shadow-sm text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gov-primary/10 text-gov-primary font-bold">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-foreground">Sovereign Geospatial Governance</span>
              <Badge variant="success" size="sm" dot>
                Republic of India Active
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Survey of India Vertical Datum &bull; DILRMP Cadastral Enforcement Enabled
            </p>
          </div>
        </div>

        {/* Boundary Evaluator Quick-Test Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-[11px] h-7"
            onClick={handleTestInside}
            leftIcon={<ShieldCheck className="h-3 w-3 text-gov-success" />}
          >
            Verify In-Bounds
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-[11px] h-7 text-gov-danger border-gov-danger/30 hover:bg-gov-danger/10"
            onClick={handleTestOutside}
            leftIcon={<ShieldAlert className="h-3 w-3" />}
          >
            Simulate Out-of-Bounds
          </Button>
        </div>
      </div>

      {/* Sovereign Boundary Violation Modal */}
      <Dialog
        isOpen={boundaryViolationAlert !== null}
        onClose={() => setBoundaryViolationAlert(null)}
        maxWidth="sm"
        title={
          <div className="flex items-center space-x-2 text-gov-danger">
            <ShieldAlert className="h-5 w-5" />
            <span>Cadastral Boundary Violation</span>
          </div>
        }
        footer={
          <Button variant="default" size="sm" onClick={() => setBoundaryViolationAlert(null)}>
            Acknowledge &amp; Return
          </Button>
        }
      >
        <div className="space-y-3 py-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <div className="p-3.5 rounded-lg border border-gov-danger/30 bg-gov-danger/10 text-gov-danger font-semibold text-xs">
            {boundaryViolationAlert}
          </div>

          <p>
            The selected coordinates or survey vectors fall outside the official sovereign boundary of the Republic of India.
          </p>

          <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1 text-muted-foreground">
            <p className="font-bold text-foreground">Statutory Protocol:</p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>Global map exploration is permitted in read-only mode.</li>
              <li>Parcel creation, vertex editing, and ULPIN assignment are strictly restricted to Indian territory.</li>
              <li>Survey of India geodetic reference: EPSG:4326 / UTM Zone 43N.</li>
            </ul>
          </div>
        </div>
      </Dialog>
    </>
  );
}
