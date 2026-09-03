/**
 * AI Extension Point Interfaces
 * Architectural contracts for intelligent cadastral analysis modules.
 */

export interface AIEncroachmentAnalysis {
  hasEncroachment: boolean;
  confidenceScore: number; // 0.0 to 1.0
  encroachedAreaSqm: number;
  encroachingEntity: "ROAD_RIGHT_OF_WAY" | "ADJACENT_PRIVATE_PARCEL" | "GOV_RESERVED" | "WATER_BODY";
  detectedBoundingBox?: [number, number, number, number];
}

export interface IEncroachmentDetector {
  analyzeParcelEncroachment: (parcelId: string, currentPolygon: unknown) => Promise<AIEncroachmentAnalysis>;
}

export interface AIBuildingFootprint {
  footprintCoordinates: number[][][];
  estimatedHeightMeters: number;
  estimatedFloors: number;
  roofType: "FLAT" | "GABLE" | "TERRACE";
  confidence: number;
}

export interface IBuildingFootprintExtractor {
  extractFootprintsFromSatellite: (bbox: [number, number, number, number]) => Promise<AIBuildingFootprint[]>;
}

export interface AIDocumentForgeryReport {
  isTampered: boolean;
  confidence: number;
  digitalSealAuthentic: boolean;
  watermarkDetected: boolean;
  tamperedRegions: Array<{ pageNumber: number; boundingBox: [number, number, number, number]; anomalyType: string }>;
}

export interface IDocumentForgeryValidator {
  verifyTitleDeedIntegrity: (documentFileUrl: string) => Promise<AIDocumentForgeryReport>;
}

export interface AIDeedOCRResult {
  detectedSurveyNumber?: string;
  detectedOwnerNames: string[];
  detectedAreaSqm?: number;
  registrationDate?: string;
  subRegistrarSealVerified: boolean;
  rawExtractedText: string;
}

export interface IDocumentOCRParser {
  digitizeHistoricalRoR: (scannedDocumentUrl: string) => Promise<AIDeedOCRResult>;
}

export interface AIRiskReport {
  compositeScore: number; // 0 to 100
  titleRisk: number;
  encroachmentRisk: number;
  litigationRisk: number;
  recommendedAction: "APPROVE_AUTOMATED" | "MANUAL_REVENUE_INSPECTION" | "RE_SURVEY_REQUIRED";
}

export interface IRiskScoringModel {
  computePropertyRiskProfile: (parcelId: string) => Promise<AIRiskReport>;
}
