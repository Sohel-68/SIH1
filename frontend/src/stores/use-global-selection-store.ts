import { create } from "zustand";

export interface ActivePropertySelection {
  ulpin: string;
  parcelId: string;
  propertyName: string;
  village: string;
  surveyNumber: string;
  coordinates: [number, number]; // [lng, lat]
  buildingId?: string;
  buildingName?: string;
  floorNumber?: number;
  unitId?: string;
  unitNumber?: string;
  ownerName?: string;
  areaSqm?: number;
}

interface GlobalSelectionState {
  activeSelection: ActivePropertySelection | null;
  hasActiveSelection: boolean;

  // Actions
  setActiveSelection: (selection: ActivePropertySelection | null) => void;
  clearActiveSelection: () => void;
  selectDemoMotherParcel: () => void;
  selectDemoStrataUnit: () => void;
}

export const DEMO_MOTHER_PARCEL: ActivePropertySelection = {
  ulpin: "27518001004201",
  parcelId: "parcel-01",
  propertyName: "Palm Heights Ground Cadastre",
  village: "Versova",
  surveyNumber: "CTS-142/1",
  coordinates: [72.8285, 19.1382],
  buildingId: "bldg-01",
  buildingName: "Palm Heights Complex",
  ownerName: "Rajiv M. Mehra",
  areaSqm: 1420.5,
};

export const DEMO_STRATA_UNIT: ActivePropertySelection = {
  ulpin: "27518001004201-B01-TA-F05-U502",
  parcelId: "parcel-01",
  propertyName: "Flat 502, Tower A, Palm Heights",
  village: "Versova",
  surveyNumber: "CTS-142/1",
  coordinates: [72.8285, 19.1382],
  buildingId: "bldg-01",
  buildingName: "Tower A (Palm Heights)",
  floorNumber: 5,
  unitId: "unit-502",
  unitNumber: "Flat 502",
  ownerName: "Rajiv M. Mehra & Sunita R. Mehra",
  areaSqm: 88.5,
};

export const useGlobalSelectionStore = create<GlobalSelectionState>((set) => ({
  activeSelection: DEMO_STRATA_UNIT, // Initialized with active strata unit
  hasActiveSelection: true,

  setActiveSelection: (activeSelection) =>
    set({
      activeSelection,
      hasActiveSelection: activeSelection !== null,
    }),

  clearActiveSelection: () =>
    set({
      activeSelection: null,
      hasActiveSelection: false,
    }),

  selectDemoMotherParcel: () =>
    set({
      activeSelection: DEMO_MOTHER_PARCEL,
      hasActiveSelection: true,
    }),

  selectDemoStrataUnit: () =>
    set({
      activeSelection: DEMO_STRATA_UNIT,
      hasActiveSelection: true,
    }),
}));
