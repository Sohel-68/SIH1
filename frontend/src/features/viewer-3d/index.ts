export interface StrataMeshGeometry {
  unitId: string;
  vertices: Float32Array;
  indices: Uint16Array;
  color: string;
  floorLevel: number;
}

// 3D Types
export * from "./types/twin-types";
export * from "./types/camera-types";

// Constants & Presets
export * from "./constants/default-scene";
export * from "./constants/camera-presets";

// Services
export * from "./services/three-scene-manager";
export * from "./services/gis-sync-service";
export * from "./services/performance-engine";

// Importers & AI Extension Interfaces
export * from "./importers/twin-importers";
export * from "./ai/twin-ai-interfaces";

// State Stores
export * from "./stores/use-digital-twin-store";

// Components
export * from "./components/scene-canvas";
export * from "./components/viewer-toolbar";
export * from "./components/building-explorer";
export * from "./components/floor-controller";
export * from "./components/section-controller";
export * from "./components/twin-property-panel";

export const VIEWER_3D_MODULE_TAG = "viewer-3d";
