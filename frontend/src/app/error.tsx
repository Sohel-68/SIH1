"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("GeoStrata Runtime Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 space-y-5 select-none">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gov-danger/10 text-gov-danger border border-gov-danger/30">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <Badge variant="danger" size="sm" className="font-mono text-[10px]">
          SYSTEM EXCEPTION
        </Badge>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Application Error Detected
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          An unexpected runtime error occurred while rendering the geospatial layer. Session data has been preserved.
        </p>
        {error.digest && (
          <p className="font-mono text-[10px] text-muted-foreground">
            Digest: {error.digest}
          </p>
        )}
      </div>

      <Button variant="default" size="sm" onClick={() => reset()} leftIcon={<RotateCcw className="h-4 w-4" />}>
        Recover &amp; Reload Workspace
      </Button>
    </div>
  );
}
