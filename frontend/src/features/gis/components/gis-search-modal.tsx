"use client";

import * as React from "react";
import { useGISStore } from "../stores/use-gis-store";
import { useGISSearch, type SearchMatch } from "../hooks/use-gis-search";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, ArrowRight, Globe, Navigation, Loader2 } from "lucide-react";

export function GISSearchModal() {
  const { isSearchModalOpen, setSearchModalOpen } = useGISStore();
  const { query, setQuery, results, isSearchingNominatim, recentSearches, selectSearchResult } =
    useGISSearch();

  const handleSelect = (match: SearchMatch) => {
    selectSearchResult(match);
    setSearchModalOpen(false);
  };

  return (
    <Dialog
      isOpen={isSearchModalOpen}
      onClose={() => setSearchModalOpen(false)}
      maxWidth="lg"
      title="Global Cadastral & Geocoding Search"
      description="Search across national 3D ULPIN registry, survey CTS numbers, village/taluka limits, or direct WGS84 coordinates."
    >
      <div className="space-y-4 pt-2">
        {/* Search Input */}
        <div className="relative">
          <Input
            placeholder="Search e.g. 27518001004201, Versova, CTS-142/1, Rajiv Mehra, or 19.1382, 72.8285..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={
              isSearchingNominatim ? (
                <Loader2 className="h-4 w-4 animate-spin text-gov-primary" />
              ) : undefined
            }
            autoFocus
          />
        </div>

        {/* Results List */}
        {results.length > 0 && (
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Spatial Results Found ({results.length})
            </span>
            {results.map((match) => (
              <div
                key={match.id}
                onClick={() => handleSelect(match)}
                className="p-2.5 rounded-lg border border-border bg-card hover:bg-muted/60 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gov-primary/10 text-gov-primary">
                    {match.type === "CADASTRAL_PARCEL" ? (
                      <MapPin className="h-4 w-4" />
                    ) : match.type === "COORDINATES" ? (
                      <Navigation className="h-4 w-4 text-gov-accent" />
                    ) : (
                      <Globe className="h-4 w-4 text-gov-success" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-foreground text-xs truncate">
                        {match.title}
                      </span>
                      <Badge
                        variant={
                          match.type === "CADASTRAL_PARCEL"
                            ? "default"
                            : match.type === "COORDINATES"
                            ? "accent"
                            : "outline"
                        }
                        size="sm"
                        className="font-mono text-[9px] shrink-0"
                      >
                        {match.type === "CADASTRAL_PARCEL"
                          ? "CADASTRE"
                          : match.type === "COORDINATES"
                          ? "GPS COORD"
                          : "NOMINATIM"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      {match.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-semibold text-gov-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                  <span>FlyTo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Searches */}
        {query.trim() === "" && recentSearches.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Recent Searches</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(term)}
                  className="px-2.5 py-1 rounded-md border border-border bg-muted/30 text-xs text-foreground hover:bg-muted transition-colors font-mono"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
