"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 space-y-5 select-none">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gov-primary/10 text-gov-primary border border-gov-primary/30">
        <MapPin className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <Badge variant="outline" size="sm" className="font-mono text-[10px] text-gov-danger border-gov-danger/30">
          HTTP 404 &bull; RECORD NOT LOCATED
        </Badge>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Cadastral File Not Found
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The requested administrative page, parcel route, or case record does not exist in the National Land Records Registry.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <Link href="/">
          <Button variant="default" size="sm" leftIcon={<Home className="h-4 w-4" />}>
            Command Center
          </Button>
        </Link>
        <Link href="/gis">
          <Button variant="outline" size="sm" leftIcon={<Compass className="h-4 w-4" />}>
            Open 2D GIS Map
          </Button>
        </Link>
      </div>
    </div>
  );
}
