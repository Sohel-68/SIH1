"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAnalyticsStore } from "../stores/use-analytics-store";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Building,
  Compass,
  QrCode,
  User,
  ArrowRight,
} from "lucide-react";

export function GlobalCommandSearch() {
  const router = useRouter();
  const { isSearchModalOpen, setSearchModalOpen } = useAnalyticsStore();
  const [query, setQuery] = React.useState("");

  if (!isSearchModalOpen) return null;

  const demoResults = [
    {
      type: "ULPIN",
      label: "27518001004201-B01-TA-F05-U502",
      description: "Strata Unit 502, Palm Heights Tower A (Versova)",
      href: "/viewer-3d",
      icon: <BoxIcon className="h-4 w-4 text-gov-accent" />,
    },
    {
      type: "PARCEL",
      label: "Parcel P-401/A (CTS-142/1)",
      description: "Ground Cadastre 1,420 m² &bull; Rajiv M. Mehra",
      href: "/gis",
      icon: <MapPin className="h-4 w-4 text-gov-primary" />,
    },
    {
      type: "MISSION",
      label: "Mission SM-2024-MH-401",
      description: "Cadastral Boundary Re-survey (In Progress 75%)",
      href: "/survey",
      icon: <Compass className="h-4 w-4 text-gov-warning" />,
    },
    {
      type: "BUILDING",
      label: "Palm Heights Complex",
      description: "18-Storey Residential Tower &bull; 72 Strata Units",
      href: "/viewer-3d",
      icon: <Building className="h-4 w-4 text-purple-500" />,
    },
  ];

  const filtered = demoResults.filter(
    (r) =>
      r.label.toLowerCase().includes(query.toLowerCase()) ||
      r.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog
      isOpen={isSearchModalOpen}
      onClose={() => setSearchModalOpen(false)}
      maxWidth="md"
      title="National Cadastral Command Search"
      description="Quick search across ULPINs, Survey Missions, Land Parcels, Owners, and 3D Buildings."
    >
      <div className="space-y-3 pt-2 text-xs">
        <Input
          placeholder="Type to search (e.g. 502, CTS-142, Rajiv, Mission 401)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="h-10 text-xs"
          leftIcon={<Search className="h-4 w-4" />}
        />

        <div className="rounded-xl border border-border divide-y divide-border overflow-hidden max-h-72 overflow-y-auto">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSearchModalOpen(false);
                router.push(item.href);
              }}
              className="p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-lg bg-muted border border-border">
                  {item.icon}
                </div>
                <div>
                  <span className="font-mono font-bold text-foreground block">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{item.description}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="outline" size="sm" className="font-mono text-[9px]">
                  {item.type}
                </Badge>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
}

function BoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
