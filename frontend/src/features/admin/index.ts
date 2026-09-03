export interface SystemNodeHealth {
  nodeId: string;
  role: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  memoryUsagePercentage: number;
}

// Workflow & Case Types
export * from "./types/workflow-types";
export * from "./types/case-types";

// Constants & Datasets
export * from "./constants/sla-statutory-limits";
export * from "./constants/sample-cases";

// Services
export * from "./services/workflow-engine";
export * from "./services/sla-engine";
export * from "./services/inter-department-service";
export * from "./services/notification-service";

// State Stores
export * from "./stores/use-workflow-store";

// Components
export * from "./components/sla-monitoring-banner";
export * from "./components/office-inbox-card";
export * from "./components/case-dossier-view";
export * from "./components/noting-sheet-panel";
export * from "./components/forward-department-modal";
export * from "./components/approval-signoff-dialog";

export const ADMIN_MODULE_TAG = "admin";
