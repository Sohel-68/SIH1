export interface AIPredictionTask {
  taskId: string;
  type: "FOOTPRINT_MATCH" | "DEED_OCR";
  confidenceScore: number;
  status: "QUEUED" | "PROCESSING" | "COMPLETED";
}

// AI Types
export * from "./types/ai-types";
export * from "./types/model-types";

// Constants & Datasets
export * from "./constants/risk-weightings";
export * from "./constants/sample-detections";

// Services
export * from "./services/encroachment-engine";
export * from "./services/satellite-change-engine";
export * from "./services/document-ai-engine";
export * from "./services/risk-scoring-engine";
export * from "./services/survey-ai-advisory";
export * from "./services/model-registry-service";

// State Stores
export * from "./stores/use-ai-store";

// Components
export * from "./components/ai-metrics-banner";
export * from "./components/detection-feed-card";
export * from "./components/explainable-ai-dossier";
export * from "./components/composite-risk-radar";
export * from "./components/satellite-comparator";
export * from "./components/model-management-modal";
export * from "./components/survey-advisory-dialog";

export const AI_MODULE_TAG = "ai";
