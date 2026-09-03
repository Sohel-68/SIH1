import { create } from "zustand";
import type { MeasurementResult, MeasurementType } from "../types/gis-types";
import { turfService } from "../services/turf-service";

interface MeasurementState {
  measurementType: MeasurementType;
  points: [number, number][];
  result: MeasurementResult | null;

  setMeasurementType: (type: MeasurementType) => void;
  addMeasurementPoint: (point: [number, number]) => void;
  clearMeasurement: () => void;
}

export const useMeasurementStore = create<MeasurementState>((set, get) => ({
  measurementType: "none",
  points: [],
  result: null,

  setMeasurementType: (measurementType) => {
    set({
      measurementType,
      points: [],
      result: null,
    });
  },

  addMeasurementPoint: (point) => {
    const { points, measurementType } = get();
    const newPoints = [...points, point];
    const res = turfService.formatMeasurement(measurementType, newPoints);
    set({
      points: newPoints,
      result: res,
    });
  },

  clearMeasurement: () => {
    set({
      measurementType: "none",
      points: [],
      result: null,
    });
  },
}));
