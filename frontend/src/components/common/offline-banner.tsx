"use client";

import * as React from "react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { WifiOff, RefreshCw } from "lucide-react";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="sticky top-16 z-20 w-full bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md select-none">
      <div className="flex items-center space-x-2">
        <WifiOff className="h-4 w-4 shrink-0" />
        <span>
          Offline Mode Active: Operating on local IndexedDB cadastral cache. Offline survey points and mutations will sync upon reconnection.
        </span>
      </div>
      <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider bg-slate-950 text-white px-2 py-0.5 rounded">
        Local Cache Online
      </span>
    </div>
  );
}
