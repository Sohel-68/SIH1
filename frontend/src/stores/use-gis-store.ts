import { create } from "zustand";

interface GISState {
  activeLayers: string[];
  selectedParcelId: string | null;
  viewport: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
  toggleLayer: (layerId: string) => void;
  setSelectedParcel: (id: string | null) => void;
  setViewport: (viewport: Partial<GISState["viewport"]>) => void;
}

export const useGISStore = create<GISState>((set) => ({
  activeLayers: ["cadastral-parcels", "building-footprints"],
  selectedParcelId: null,
  viewport: {
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4.8,
    pitch: 45,
    bearing: 0,
  },
  toggleLayer: (layerId) =>
    set((state) => ({
      activeLayers: state.activeLayers.includes(layerId)
        ? state.activeLayers.filter((l) => l !== layerId)
        : [...state.activeLayers, layerId],
    })),
  setSelectedParcel: (selectedParcelId) => set({ selectedParcelId }),
  setViewport: (newViewport) =>
    set((state) => ({
      viewport: { ...state.viewport, ...newViewport },
    })),
}));
