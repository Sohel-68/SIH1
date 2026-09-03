"use client";

import React from "react";
import { useThemeStore } from "@/stores/use-theme-store";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Wifi, WifiOff, Globe } from "lucide-react";

export function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        {/* National GovTech Identity Branding */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-primary text-white shadow">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-foreground">
                GeoStrata
              </span>
              <Badge variant="secondary" className="text-[10px] uppercase">
                GovTech India
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              National 3D ULPIN & Vertical Property Mapping Platform
            </p>
          </div>
        </div>

        {/* Global System Telemetry & Controls */}
        <div className="flex items-center space-x-3">
          {/* Connectivity Status Pill */}
          <Badge
            variant={isOnline ? "success" : "danger"}
            className="flex items-center gap-1.5"
          >
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                <span>Offline Sync Mode</span>
              </>
            )}
          </Badge>

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle Government Dark/Light Mode"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gov-secondary" />
            ) : (
              <Sun className="h-5 w-5 text-gov-warning" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
