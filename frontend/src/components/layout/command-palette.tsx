"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { globalSearchService, type SearchResultItem } from "@/services/global-search-service";
import { useGlobalSelectionStore, DEMO_STRATA_UNIT, DEMO_MOTHER_PARCEL } from "@/stores/use-global-selection-store";
import { useDemoModeStore } from "@/stores/use-demo-mode-store";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Box,
  Building2,
  Compass,
  QrCode,
  Sparkles,
  ShieldCheck,
  Settings,
  Activity,
  Play,
  ArrowRight,
  Command,
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const { setActiveSelection } = useGlobalSelectionStore();
  const { setIsDemoModalOpen } = useDemoModeStore();

  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  useKeyboardShortcut({ key: "k", ctrlKey: true, metaKey: true }, () => {
    setIsOpen((prev) => !prev);
  });

  // Listen to custom window event for top-nav search click
  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, []);

  if (!isOpen) return null;

  const searchResults = globalSearchService.search(query);

  const quickNavLinks = [
    { label: "Dashboard (Command Center)", href: "/", icon: <Building2 className="h-4 w-4 text-gov-primary" /> },
    { label: "2D GIS Cadastral Engine", href: "/gis", icon: <MapPin className="h-4 w-4 text-gov-primary" /> },
    { label: "3D Strata Digital Twin", href: "/viewer-3d", icon: <Box className="h-4 w-4 text-gov-accent" /> },
    { label: "Property Title Registry (LADM)", href: "/properties", icon: <Building2 className="h-4 w-4 text-purple-500" /> },
    { label: "Field Survey Operations & DGPS", href: "/survey", icon: <Compass className="h-4 w-4 text-gov-warning" /> },
    { label: "ULPIN Bhu-Aadhaar Engine", href: "/ulpin", icon: <QrCode className="h-4 w-4 text-gov-primary" /> },
    { label: "AI Computer Vision Platform", href: "/ai", icon: <Sparkles className="h-4 w-4 text-purple-600" /> },
    { label: "State Land Records E-Office", href: "/admin", icon: <ShieldCheck className="h-4 w-4 text-indigo-500" /> },
    { label: "Global Activity Timeline", href: "/activity", icon: <Activity className="h-4 w-4 text-gov-success" /> },
    { label: "System Preferences & Language", href: "/settings", icon: <Settings className="h-4 w-4 text-muted-foreground" /> },
  ];

  const handleSelectResult = (item: SearchResultItem) => {
    if (item.associatedUlpin === DEMO_STRATA_UNIT.ulpin) {
      setActiveSelection(DEMO_STRATA_UNIT);
    } else if (item.associatedUlpin === DEMO_MOTHER_PARCEL.ulpin) {
      setActiveSelection(DEMO_MOTHER_PARCEL);
    }
    setIsOpen(false);
    router.push(item.targetHref);
  };

  const handleLaunchDemo = () => {
    setIsOpen(false);
    setIsDemoModalOpen(true);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      maxWidth="lg"
      title="Universal Cadastral Command Palette"
      description="Press Enter to jump to search results, execute actions, or navigate across modules."
    >
      <div className="space-y-4 pt-1 text-xs select-none">
        {/* Search Input */}
        <Input
          placeholder="Search by ULPIN, Owner, Survey No, Village, Building, or Action..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="h-10 text-xs"
          leftIcon={<Search className="h-4 w-4" />}
        />

        {/* SIH Demo Mode Banner Button */}
        <div
          onClick={handleLaunchDemo}
          className="p-3 rounded-xl border border-gov-accent/40 bg-gov-accent/10 hover:bg-gov-accent/20 cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-gov-accent text-white shadow-sm">
              <Play className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-foreground text-xs block">
                Run SIH National Cadastral Demo
              </span>
              <span className="text-[11px] text-muted-foreground">
                Automated 8-step simulation: Survey $\rightarrow$ Property $\rightarrow$ ULPIN $\rightarrow$ 3D Twin $\rightarrow$ AI $\rightarrow$ E-Office
              </span>
            </div>
          </div>
          <Badge variant="accent" size="sm" className="font-bold">
            Interactive Jury Mode
          </Badge>
        </div>

        {/* Dynamic Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <span className="font-bold text-foreground uppercase tracking-wider text-[10px] block">
              Search Results ({searchResults.length})
            </span>
            <div className="rounded-xl border border-border divide-y divide-border overflow-hidden max-h-56 overflow-y-auto">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  className="p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div>
                    <span className="font-bold text-foreground block">{item.title}</span>
                    <span className="text-[11px] text-muted-foreground">{item.subtitle}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" size="sm" className="font-mono text-[9px]">
                      {item.badgeText}
                    </Badge>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Navigation Links */}
        {!query.trim() && (
          <div className="space-y-2">
            <span className="font-bold text-foreground uppercase tracking-wider text-[10px] block">
              Quick Module Jump
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickNavLinks.map((nav) => (
                <div
                  key={nav.href}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(nav.href);
                  }}
                  className="p-2.5 rounded-lg border border-border bg-card/60 hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    {nav.icon}
                    <span className="font-medium text-foreground text-[11px]">{nav.label}</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-muted-foreground">Jump</kbd>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
