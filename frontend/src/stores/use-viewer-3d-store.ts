import { create } from "zustand";

interface Viewer3DState {
  selectedBuildingId: string | null;
  selectedFloorIndex: number | null;
  selectedUnitId: string | null;
  cutawayHeightM: number | null;
  wireframeMode: boolean;
  setSelectedBuilding: (id: string | null) => void;
  setSelectedFloor: (floorIndex: number | null) => void;
  setSelectedUnit: (unitId: string | null) => void;
  setCutawayHeight: (height: number | null) => void;
  toggleWireframe: () => void;
}

export const useViewer3DStore = create<Viewer3DState>((set) => ({
  selectedBuildingId: null,
  selectedFloorIndex: null,
  selectedUnitId: null,
  cutawayHeightM: null,
  wireframeMode: false,
  setSelectedBuilding: (selectedBuildingId) => set({ selectedBuildingId }),
  setSelectedFloor: (selectedFloorIndex) => set({ selectedFloorIndex }),
  setSelectedUnit: (selectedUnitId) => set({ selectedUnitId }),
  setCutawayHeight: (cutawayHeightM) => set({ cutawayHeightM }),
  toggleWireframe: () => set((state) => ({ wireframeMode: !state.wireframeMode })),
}));
