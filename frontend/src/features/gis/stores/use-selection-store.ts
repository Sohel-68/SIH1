import { create } from "zustand";
import type { CadastralParcel } from "../types/gis-types";
import { SAMPLE_CADASTRAL_PARCELS } from "../constants/sample-cadastre";

interface SelectionState {
  parcels: CadastralParcel[];
  selectedParcel: CadastralParcel | null;
  hoveredParcelId: string | null;

  setParcels: (parcels: CadastralParcel[]) => void;
  selectParcel: (parcel: CadastralParcel | null) => void;
  selectParcelById: (idOrUlpin: string) => void;
  setHoveredParcelId: (id: string | null) => void;
  clearSelection: () => void;
  updateParcel: (id: string, updates: Partial<CadastralParcel>) => void;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  parcels: SAMPLE_CADASTRAL_PARCELS,
  selectedParcel: null,
  hoveredParcelId: null,

  setParcels: (parcels) => set({ parcels }),

  selectParcel: (selectedParcel) => {
    set({ selectedParcel });
  },

  selectParcelById: (idOrUlpin) => {
    const { parcels } = get();
    const found = parcels.find(
      (p) => p.id === idOrUlpin || p.ulpin === idOrUlpin || p.parcelNumber === idOrUlpin
    );
    if (found) {
      set({ selectedParcel: found });
    }
  },

  setHoveredParcelId: (hoveredParcelId) => set({ hoveredParcelId }),

  clearSelection: () => set({ selectedParcel: null }),

  updateParcel: (id, updates) => {
    set((state) => {
      const updatedParcels = state.parcels.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
      const updatedSelected =
        state.selectedParcel?.id === id
          ? { ...state.selectedParcel, ...updates }
          : state.selectedParcel;

      return {
        parcels: updatedParcels,
        selectedParcel: updatedSelected,
      };
    });
  },
}));
