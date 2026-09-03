"use client";

import * as React from "react";
import { useActivityTimelineStore, type ActivityModule } from "@/stores/use-activity-timeline-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Compass,
  QrCode,
  Building,
  Box,
  MapPin,
  Clock,
} from "lucide-react";

export default function ActivityTimelinePage() {
  const {
    events,
    selectedModule,
    setSelectedModule,
    searchQuery,
    setSearchQuery,
    exportTimelineCSV,
  } = useActivityTimelineStore();

  const handleExport = () => {
    const csv = exportTimelineCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GeoStrata_Activity_Timeline_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEvents = events.filter((e) => {
    if (selectedModule !== "ALL" && e.module !== selectedModule) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.actor.toLowerCase().includes(q) ||
        e.targetIdentifier.toLowerCase().includes(q) ||
        e.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getModuleIcon = (mod: ActivityModule) => {
    switch (mod) {
      case "GIS":
        return <MapPin className="h-4 w-4 text-gov-primary" />;
      case "VIEWER_3D":
        return <Box className="h-4 w-4 text-gov-accent" />;
      case "PROPERTY":
        return <Building className="h-4 w-4 text-purple-500" />;
      case "SURVEY":
        return <Compass className="h-4 w-4 text-gov-warning" />;
      case "ULPIN":
        return <QrCode className="h-4 w-4 text-gov-primary" />;
      case "AI":
        return <AlertTriangle className="h-4 w-4 text-gov-danger" />;
      case "ADMIN":
        return <ShieldCheck className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              National Cadastral Activity Stream
            </h1>
            <Badge variant="accent" size="sm" className="font-mono text-[9px]">
              Live Audit Trail
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Immutable cross-module log of DGPS surveys, ULPIN generations, AI inspections, and revenue adjudications.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          leftIcon={<Download className="h-3.5 w-3.5" />}
        >
          Export Timeline CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {(["ALL", "GIS", "VIEWER_3D", "PROPERTY", "SURVEY", "ULPIN", "AI", "ADMIN"] as const).map(
            (m) => (
              <button
                key={m}
                onClick={() => setSelectedModule(m as ActivityModule | "ALL")}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                  selectedModule === m
                    ? "bg-gov-primary text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {m.replace("_", " ")}
              </button>
            )
          )}
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search events, actors, or ULPIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs"
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
        {filteredEvents.map((e) => (
          <div key={e.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-card border-2 border-gov-primary">
              <div className="h-1.5 w-1.5 rounded-full bg-gov-primary" />
            </div>

            {/* Event Card */}
            <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2 hover:border-primary/40 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-muted border border-border">
                    {getModuleIcon(e.module)}
                  </div>
                  <span className="font-bold text-xs text-foreground">{e.title}</span>
                  <Badge variant="outline" size="sm" className="font-mono text-[9px]">
                    {e.module}
                  </Badge>
                </div>

                <span className="font-mono text-[10px] text-muted-foreground flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{e.timestamp}</span>
                </span>
              </div>

              <p className="text-xs text-foreground font-sans leading-relaxed">
                {e.details}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
                <span>
                  Actor: <strong className="text-foreground font-sans">{e.actor}</strong>
                </span>
                <span>
                  Target: <strong className="text-gov-primary">{e.targetIdentifier}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
