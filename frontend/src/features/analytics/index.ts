export interface VolumetricAnalyticsSummary {
  zoneCode: string;
  builtupVolumeCubicMeters: number;
  averageFloorSpaceIndex: number;
  strataDensityScore: number;
}

// Analytics Types
export * from "./types/analytics-types";

// Constants & Datasets
export * from "./constants/national-kpis";
export * from "./constants/state-cadastral-stats";
export * from "./constants/mock-analytics-data";

// Services
export * from "./services/analytics-service";
export * from "./services/report-export-service";

// State Stores
export * from "./stores/use-analytics-store";

// Components
export * from "./components/executive-kpi-grid";
export * from "./components/live-gis-overview";
export * from "./components/mission-analytics-card";
export * from "./components/property-strata-card";
export * from "./components/ulpin-throughput-card";
export * from "./components/survey-quality-card";
export * from "./components/ai-inspection-widgets";
export * from "./components/global-command-search";
export * from "./components/notification-feed";
export * from "./components/executive-report-modal";

export const ANALYTICS_MODULE_TAG = "analytics";
