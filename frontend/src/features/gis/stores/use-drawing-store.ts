import { create } from "zustand";
import type { Feature } from "geojson";
import type { DrawingMode } from "../types/gis-types";
import { turfService } from "../services/turf-service";

interface DrawingState {
  mode: DrawingMode;
  activePoints: [number, number][];
  history: [number, number][][];
  redoStack: [number, number][][];
  isSnappingEnabled: boolean;
  snapToleranceMeters: number;
  drawnFeatures: Feature[];

  setMode: (mode: DrawingMode) => void;
  addPoint: (point: [number, number]) => void;
  updateLastPoint: (point: [number, number]) => void;
  undo: () => void;
  redo: () => void;
  clearActive: () => void;
  finishDrawing: () => Feature | null;
  addFeature: (feature: Feature) => void;
  addFeatures: (features: Feature[]) => void;
  deleteDrawnFeature: (index: number) => void;
  toggleSnapping: () => void;
  setSnapTolerance: (meters: number) => void;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  mode: "none",
  activePoints: [],
  history: [],
  redoStack: [],
  isSnappingEnabled: true,
  snapToleranceMeters: 6,
  drawnFeatures: [],

  setMode: (mode) => {
    set({
      mode,
      activePoints: [],
      history: [],
      redoStack: [],
    });
  },

  addPoint: (point) => {
    const { activePoints, history } = get();
    const newPoints = [...activePoints, point];
    set({
      activePoints: newPoints,
      history: [...history, activePoints],
      redoStack: [],
    });
  },

  updateLastPoint: (point) => {
    const { activePoints } = get();
    if (activePoints.length === 0) return;
    const newPoints = [...activePoints];
    newPoints[newPoints.length - 1] = point;
    set({ activePoints: newPoints });
  },

  undo: () => {
    const { history, activePoints, redoStack } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      activePoints: previous,
      history: history.slice(0, history.length - 1),
      redoStack: [...redoStack, activePoints],
    });
  },

  redo: () => {
    const { redoStack, activePoints, history } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set({
      activePoints: next,
      redoStack: redoStack.slice(0, redoStack.length - 1),
      history: [...history, activePoints],
    });
  },

  clearActive: () => {
    set({
      activePoints: [],
      history: [],
      redoStack: [],
      mode: "none",
    });
  },

  finishDrawing: () => {
    const { mode, activePoints, drawnFeatures } = get();
    if (activePoints.length === 0) return null;

    let feature: Feature | null = null;
    const id = `drawn-${Date.now()}`;

    if (mode === "point" && activePoints.length >= 1) {
      feature = {
        type: "Feature",
        properties: { id, type: "Survey Point", name: `Point ${drawnFeatures.length + 1}` },
        geometry: { type: "Point", coordinates: activePoints[0] },
      };
    } else if (mode === "line" && activePoints.length >= 2) {
      const len = turfService.calculateLength(activePoints);
      feature = {
        type: "Feature",
        properties: {
          id,
          type: "Boundary Line",
          name: `Corridor ${drawnFeatures.length + 1}`,
          lengthMeters: len.meters,
        },
        geometry: { type: "LineString", coordinates: activePoints },
      };
    } else if (
      (mode === "polygon" || mode === "rectangle" || mode === "circle" || mode === "freehand") &&
      activePoints.length >= 3
    ) {
      const ring = [...activePoints];
      if (
        ring[0][0] !== ring[ring.length - 1][0] ||
        ring[0][1] !== ring[ring.length - 1][1]
      ) {
        ring.push(ring[0]);
      }
      const area = turfService.calculateArea(ring);
      const perim = turfService.calculatePerimeter(ring);

      feature = {
        type: "Feature",
        properties: {
          id,
          type: "Drawn Parcel",
          name: `Custom Parcel ${drawnFeatures.length + 1}`,
          areaSqm: area.sqm,
          perimeterMeters: perim,
        },
        geometry: { type: "Polygon", coordinates: [ring] },
      };
    }

    if (feature) {
      set({
        drawnFeatures: [...drawnFeatures, feature],
        activePoints: [],
        history: [],
        redoStack: [],
        mode: "none",
      });
      return feature;
    }

    return null;
  },

  addFeature: (feature) =>
    set((state) => ({ drawnFeatures: [...state.drawnFeatures, feature] })),

  addFeatures: (features) =>
    set((state) => ({ drawnFeatures: [...state.drawnFeatures, ...features] })),

  deleteDrawnFeature: (index) => {
    set((state) => ({
      drawnFeatures: state.drawnFeatures.filter((_, idx) => idx !== index),
    }));
  },

  toggleSnapping: () => set((state) => ({ isSnappingEnabled: !state.isSnappingEnabled })),
  setSnapTolerance: (snapToleranceMeters) => set({ snapToleranceMeters }),
}));
