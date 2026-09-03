import { create } from "zustand";
import type { CadastralLayer } from "../types/gis-types";
import { DEFAULT_CADASTRAL_LAYERS } from "../constants/layers";

interface LayerState {
  layers: CadastralLayer[];
  toggleLayerVisibility: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  reorderLayers: (startIndex: number, endIndex: number) => void;
  addCustomLayer: (layer: CadastralLayer) => void;
  removeCustomLayer: (id: string) => void;
  resetLayers: () => void;
}

export const useLayerStore = create<LayerState>((set) => ({
  layers: DEFAULT_CADASTRAL_LAYERS,

  toggleLayerVisibility: (id) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      ),
    }));
  },

  setLayerOpacity: (id, opacity) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, opacity: Math.max(0, Math.min(1, opacity)) } : layer
      ),
    }));
  },

  reorderLayers: (startIndex, endIndex) => {
    set((state) => {
      const result = Array.from(state.layers);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      // Update z-indices
      return {
        layers: result.map((l, idx) => ({ ...l, zIndex: result.length - idx })),
      };
    });
  },

  addCustomLayer: (layer) => {
    set((state) => ({
      layers: [layer, ...state.layers],
    }));
  },

  removeCustomLayer: (id) => {
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
    }));
  },

  resetLayers: () => {
    set({ layers: DEFAULT_CADASTRAL_LAYERS });
  },
}));
