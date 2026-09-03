import { create } from "zustand";
import type {
  DigitalTwinNode,
  CameraMode,
  SectionCutMode,
  LightingMode,
  Measurement3DType,
  Measurement3DResult,
} from "../types/twin-types";
import type { CameraBookmark } from "../types/camera-types";
import { DEFAULT_TWIN_NODES } from "../constants/default-scene";
import { CAMERA_PRESETS } from "../constants/camera-presets";

interface DigitalTwinState {
  nodes: DigitalTwinNode[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;

  // Floor Controls
  activeFloorLevel: number;
  isolatedFloorNumber: number | null;
  hideAboveFloor: number | null;
  hideBelowFloor: number | null;
  explodedViewOffset: number; // 0.0 to 1.0

  // Section Cutting Planes
  sectionCutMode: SectionCutMode;
  sectionPlanePosition: number; // Range -20 to 60

  // Camera & Viewer
  cameraMode: CameraMode;
  isOrtho: boolean;
  activeBookmarkId: string;
  bookmarks: CameraBookmark[];

  // Lighting & Environment
  lightingMode: LightingMode;
  sunAltitudeDegrees: number; // 0° to 90°
  sunAzimuthDegrees: number; // 0° to 360°
  shadowsEnabled: boolean;

  // 3D Measurements
  measurementType: Measurement3DType;
  measurementResult: Measurement3DResult | null;

  // UI Panels
  isExplorerOpen: boolean;
  isPropertyInspectorOpen: boolean;
  isFloorToolsOpen: boolean;
  isSectionToolsOpen: boolean;

  // Actions
  selectNode: (id: string | null) => void;
  setHoveredNodeId: (id: string | null) => void;
  setActiveFloorLevel: (level: number) => void;
  setIsolatedFloorNumber: (floor: number | null) => void;
  setHideAboveFloor: (floor: number | null) => void;
  setHideBelowFloor: (floor: number | null) => void;
  setExplodedViewOffset: (offset: number) => void;

  setSectionCut: (mode: SectionCutMode, position?: number) => void;
  setSectionPlanePosition: (pos: number) => void;
  resetSectionCut: () => void;

  setCameraMode: (mode: CameraMode) => void;
  toggleOrtho: () => void;
  applyBookmark: (bookmark: CameraBookmark) => void;

  setLightingMode: (mode: LightingMode) => void;
  setSunAltitudeDegrees: (deg: number) => void;
  setSunAzimuthDegrees: (deg: number) => void;
  toggleShadows: () => void;

  setMeasurementType: (type: Measurement3DType) => void;
  setMeasurementResult: (result: Measurement3DResult | null) => void;
  clearMeasurement: () => void;

  toggleExplorer: () => void;
  togglePropertyInspector: () => void;
  toggleFloorTools: () => void;
  toggleSectionTools: () => void;
  resetScene: () => void;
}

export const useDigitalTwinStore = create<DigitalTwinState>((set, get) => ({
  nodes: DEFAULT_TWIN_NODES,
  selectedNodeId: "node-twin-unit-502", // Default to Unit 502
  hoveredNodeId: null,

  activeFloorLevel: 5,
  isolatedFloorNumber: null,
  hideAboveFloor: null,
  hideBelowFloor: null,
  explodedViewOffset: 0.0,

  sectionCutMode: "none",
  sectionPlanePosition: 27.0,

  cameraMode: "orbit",
  isOrtho: false,
  activeBookmarkId: "preset-aerial",
  bookmarks: CAMERA_PRESETS,

  lightingMode: "day",
  sunAltitudeDegrees: 55,
  sunAzimuthDegrees: 140,
  shadowsEnabled: true,

  measurementType: "none",
  measurementResult: null,

  isExplorerOpen: true,
  isPropertyInspectorOpen: true,
  isFloorToolsOpen: true,
  isSectionToolsOpen: false,

  selectNode: (selectedNodeId) => {
    set({ selectedNodeId });
    if (selectedNodeId) {
      const node = get().nodes.find((n) => n.id === selectedNodeId);
      if (node && node.metadata.floorLevel) {
        set({ activeFloorLevel: node.metadata.floorLevel });
      }
    }
  },

  setHoveredNodeId: (hoveredNodeId) => set({ hoveredNodeId }),
  setActiveFloorLevel: (activeFloorLevel) => set({ activeFloorLevel }),
  setIsolatedFloorNumber: (isolatedFloorNumber) => set({ isolatedFloorNumber }),
  setHideAboveFloor: (hideAboveFloor) => set({ hideAboveFloor }),
  setHideBelowFloor: (hideBelowFloor) => set({ hideBelowFloor }),
  setExplodedViewOffset: (explodedViewOffset) => set({ explodedViewOffset }),

  setSectionCut: (sectionCutMode, position) => {
    set({
      sectionCutMode,
      ...(position !== undefined ? { sectionPlanePosition: position } : {}),
      isSectionToolsOpen: true,
    });
  },

  setSectionPlanePosition: (sectionPlanePosition) => set({ sectionPlanePosition }),

  resetSectionCut: () => set({ sectionCutMode: "none" }),

  setCameraMode: (cameraMode) => set({ cameraMode }),
  toggleOrtho: () => set((state) => ({ isOrtho: !state.isOrtho })),

  applyBookmark: (bookmark) => {
    set({
      activeBookmarkId: bookmark.id,
      isOrtho: bookmark.isOrtho,
    });
  },

  setLightingMode: (lightingMode) => {
    if (lightingMode === "night") {
      set({ lightingMode, sunAltitudeDegrees: 5, sunAzimuthDegrees: 270 });
    } else if (lightingMode === "golden-hour") {
      set({ lightingMode, sunAltitudeDegrees: 15, sunAzimuthDegrees: 240 });
    } else {
      set({ lightingMode, sunAltitudeDegrees: 55, sunAzimuthDegrees: 140 });
    }
  },

  setSunAltitudeDegrees: (sunAltitudeDegrees) => set({ sunAltitudeDegrees }),
  setSunAzimuthDegrees: (sunAzimuthDegrees) => set({ sunAzimuthDegrees }),
  toggleShadows: () => set((state) => ({ shadowsEnabled: !state.shadowsEnabled })),

  setMeasurementType: (measurementType) => set({ measurementType, measurementResult: null }),
  setMeasurementResult: (measurementResult) => set({ measurementResult }),
  clearMeasurement: () => set({ measurementType: "none", measurementResult: null }),

  toggleExplorer: () => set((state) => ({ isExplorerOpen: !state.isExplorerOpen })),
  togglePropertyInspector: () =>
    set((state) => ({ isPropertyInspectorOpen: !state.isPropertyInspectorOpen })),
  toggleFloorTools: () => set((state) => ({ isFloorToolsOpen: !state.isFloorToolsOpen })),
  toggleSectionTools: () => set((state) => ({ isSectionToolsOpen: !state.isSectionToolsOpen })),

  resetScene: () => {
    set({
      isolatedFloorNumber: null,
      hideAboveFloor: null,
      hideBelowFloor: null,
      explodedViewOffset: 0.0,
      sectionCutMode: "none",
      measurementType: "none",
      measurementResult: null,
      activeFloorLevel: 5,
    });
  },
}));
