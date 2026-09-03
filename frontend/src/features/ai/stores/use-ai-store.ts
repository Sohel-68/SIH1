import { create } from "zustand";
import type {
  AIDetectionRecord,
  AIDetectionType,
  AISeverity,
  AIDetectionStatus,
} from "../types/ai-types";
import { SAMPLE_AI_DETECTIONS } from "../constants/sample-detections";

interface AIState {
  detections: AIDetectionRecord[];
  selectedDetectionId: string;
  severityFilter: AISeverity | "ALL";
  typeFilter: AIDetectionType | "ALL";
  isModelModalOpen: boolean;
  isAdvisoryModalOpen: boolean;

  // Actions
  selectDetection: (id: string) => void;
  updateDetectionStatus: (id: string, status: AIDetectionStatus, reviewerNotes?: string) => void;
  setSeverityFilter: (filter: AISeverity | "ALL") => void;
  setTypeFilter: (filter: AIDetectionType | "ALL") => void;
  setModelModalOpen: (open: boolean) => void;
  setAdvisoryModalOpen: (open: boolean) => void;
}

export const useAIStore = create<AIState>((set) => ({
  detections: SAMPLE_AI_DETECTIONS,
  selectedDetectionId: "ai-det-01", // Default to critical road setback encroachment
  severityFilter: "ALL",
  typeFilter: "ALL",
  isModelModalOpen: false,
  isAdvisoryModalOpen: false,

  selectDetection: (selectedDetectionId) => set({ selectedDetectionId }),

  updateDetectionStatus: (id, status, reviewerNotes) => {
    set((state) => ({
      detections: state.detections.map((d) =>
        d.id === id ? { ...d, status, ...(reviewerNotes ? { reviewerNotes } : {}) } : d
      ),
    }));
  },

  setSeverityFilter: (severityFilter) => set({ severityFilter }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setModelModalOpen: (isModelModalOpen) => set({ isModelModalOpen }),
  setAdvisoryModalOpen: (isAdvisoryModalOpen) => set({ isAdvisoryModalOpen }),
}));
