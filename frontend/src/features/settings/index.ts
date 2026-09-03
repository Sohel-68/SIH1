export interface CoordinateReferenceSystemConfig {
  epsgCode: number;
  projectionName: string;
  verticalBenchmark: string;
}

/**
 * Feature Module: System Settings
 * GIS CRS configuration, projection transforms, and portal preferences.
 */
export const SETTINGS_MODULE_TAG = "settings";
