"use client";

import * as React from "react";
import { useSelectionStore } from "../stores/use-selection-store";
import { useGISStore } from "../stores/use-gis-store";
import { coordinateProjectionService } from "../services/coordinate-projection-service";
import type { CadastralParcel } from "../types/gis-types";

export interface SearchMatch {
  id: string;
  title: string;
  subtitle: string;
  type: "CADASTRAL_PARCEL" | "NOMINATIM_GEOCODE" | "COORDINATES";
  lng: number;
  lat: number;
  parcel?: CadastralParcel;
}

export function useGISSearch() {
  const { parcels, selectParcel } = useSelectionStore();
  const { setCenter, setZoom, setPickedCoordinate, setSelectedParcel, setPropertyPanelOpen } =
    useGISStore();

  const [query, setQuery] = React.useState("");
  const [nominatimResults, setNominatimResults] = React.useState<SearchMatch[]>([]);
  const [isSearchingNominatim, setIsSearchingNominatim] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  // Load recent searches from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("geostrata_gis_recent_searches");
        if (saved) setRecentSearches(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveSearch = (text: string) => {
    if (!text.trim()) return;
    const updated = [text, ...recentSearches.filter((s) => s !== text)].slice(0, 6);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("geostrata_gis_recent_searches", JSON.stringify(updated));
      } catch {}
    }
  };

  // OpenStreetMap Nominatim Geocoding with 350ms debounce
  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setNominatimResults([]);
      setIsSearchingNominatim(false);
      return;
    }

    setIsSearchingNominatim(true);
    const timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          trimmed
        )}&countrycodes=in&limit=4&addressdetails=1`;

        const res = await fetch(url, {
          headers: { "Accept-Language": "en" },
        });

        if (res.ok) {
          const data = await res.json();
          const matches: SearchMatch[] = data.map((item: any) => ({
            id: `nom-${item.place_id}`,
            title: item.display_name.split(",")[0],
            subtitle: item.display_name,
            type: "NOMINATIM_GEOCODE",
            lng: parseFloat(item.lon),
            lat: parseFloat(item.lat),
          }));
          setNominatimResults(matches);
        }
      } catch (e) {
        console.warn("Nominatim Geocoding notice (using offline cadastre fallback):", e);
      } finally {
        setIsSearchingNominatim(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Combined Results: Local Cadastre + Coordinates + Nominatim
  const results = React.useMemo<SearchMatch[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: SearchMatch[] = [];

    // 1. Direct coordinate match e.g. "19.1382, 72.8285"
    const coordParts = q.split(/[\s,]+/).map(Number);
    if (coordParts.length === 2 && !isNaN(coordParts[0]) && !isNaN(coordParts[1])) {
      const lat = coordParts[0] < coordParts[1] ? coordParts[0] : coordParts[1];
      const lng = coordParts[0] > coordParts[1] ? coordParts[0] : coordParts[1];
      matches.push({
        id: "coord-direct",
        title: `GPS Fix: ${lat.toFixed(6)}°, ${lng.toFixed(6)}°`,
        subtitle: `EPSG:4326 Coordinate FlyTo`,
        type: "COORDINATES",
        lng,
        lat,
      });
    }

    // 2. Local Cadastral Records
    parcels.forEach((p) => {
      const matchUlpin = p.ulpin.toLowerCase().includes(q);
      const matchOwner = p.ownerName.toLowerCase().includes(q);
      const matchSurvey = p.surveyNumber.toLowerCase().includes(q);
      const matchParcelNo = p.parcelNumber.toLowerCase().includes(q);
      const matchVillage = p.village.toLowerCase().includes(q) || p.district.toLowerCase().includes(q);

      if (matchUlpin || matchOwner || matchSurvey || matchParcelNo || matchVillage) {
        matches.push({
          id: `cad-${p.id}`,
          title: `${p.surveyNumber} • ${p.ownerName}`,
          subtitle: `ULPIN: ${p.ulpin} | ${p.village}, ${p.district}`,
          type: "CADASTRAL_PARCEL",
          lng: p.centroid[0],
          lat: p.centroid[1],
          parcel: p,
        });
      }
    });

    // 3. Append Nominatim geocoded results
    nominatimResults.forEach((nom) => {
      if (!matches.some((m) => m.id === nom.id)) {
        matches.push(nom);
      }
    });

    return matches;
  }, [query, parcels, nominatimResults]);

  const selectSearchResult = (match: SearchMatch) => {
    setCenter([match.lng, match.lat]);
    setZoom(17.5);

    // Drop interactive pin
    const picked = coordinateProjectionService.formatPickedCoordinate(match.lng, match.lat);
    setPickedCoordinate(picked);

    if (match.parcel) {
      selectParcel(match.parcel);
      setSelectedParcel(match.parcel);
      setPropertyPanelOpen(true);
    }

    saveSearch(query);
  };

  return {
    query,
    setQuery,
    results,
    isSearchingNominatim,
    recentSearches,
    selectSearchResult,
  };
}
