/**
 * 3D Digital Twin AI Extension Point Interfaces
 * Architecture contracts for volumetric AI inspection and spatial analytics.
 */

export interface StructuralDamageReport {
  structuralSoundnessScore: number; // 0 to 100
  detectedCracksCount: number;
  criticalDamageIdentified: boolean;
  affectedFloorLevels: number[];
  recommendation: "CERTIFIED_STABLE" | "RETROFITTING_ADVISED" | "URGENT_EVACUATION_NOTICE";
}

export interface IBuildingDamageDetector {
  analyzeMeshIntegrity: (buildingNodeId: string) => Promise<StructuralDamageReport>;
}

export interface AirspaceEncroachmentReport {
  hasAirspaceViolation: boolean;
  encroachingVolumeCum: number;
  violatedSetbackMeters: number;
  encroachmentDirection: "NORTH" | "SOUTH" | "EAST" | "WEST" | "VERTICAL_HEIGHT_CAP";
  adjacentParcelAffected?: string;
}

export interface IVolumetricEncroachmentDetector {
  detect3DSetbackEncroachment: (buildingMesh: unknown, parcelBoundary: unknown) => Promise<AirspaceEncroachmentReport>;
}

export interface SolarIrradianceReport {
  annualSolarHours: number;
  usableRooftopAreaSqm: number;
  estimatedPvGenerationKwhYear: number;
  optimalPanelTiltDegrees: number;
}

export interface ISolarPotentialEstimator {
  calculateRooftopSolarPotential: (buildingNodeId: string) => Promise<SolarIrradianceReport>;
}
