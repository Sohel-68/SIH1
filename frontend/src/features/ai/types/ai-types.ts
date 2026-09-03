export type AIDetectionType =
  | "ENCROACHMENT"
  | "BOUNDARY_CONFLICT"
  | "FOOTPRINT_MISMATCH"
  | "SATELLITE_CHANGE"
  | "DOCUMENT_FORGERY"
  | "LAND_USE_ANOMALY"
  | "STRUCTURAL_DAMAGE"
  | "SURVEY_ANOMALY";

export type AISeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type AIDetectionStatus =
  | "UNREVIEWED"
  | "CONFIRMED_VIOLATION"
  | "FALSE_POSITIVE"
  | "NOTICE_ISSUED"
  | "RESOLVED";

export interface XAIExplanation {
  confidencePercent: number; // e.g. 94.2
  primaryReason: string;
  evidenceDetails: {
    satelliteImageDiffUrl?: string;
    encroachingMeters?: number;
    encroachingAreaSqm?: number;
    coordinateDelta?: [number, number];
    documentChecksumMismatch?: string;
    affectedBoundaryEdge?: string;
    damageSeverityPercent?: number;
  };
  legalStatutoryReference: string; // e.g. "Section 53, MRTP Act 1966"
  actionableRecommendation: string;
}

export interface AIDetectionRecord {
  id: string;
  detectionType: AIDetectionType;
  severity: AISeverity;
  targetUlpin: string;
  parcelId: string;
  title: string;
  coordinates: [number, number]; // [lng, lat]
  geometryPolygon?: [number, number][]; // Encroachment / change polygon
  explanation: XAIExplanation;
  detectedAt: string;
  status: AIDetectionStatus;
  reviewerNotes?: string;
}

export interface CompositeTitleRisk {
  overallScore: number; // 0 (Safe) to 100 (Severe Risk)
  riskTier: "MINIMAL" | "LOW" | "MODERATE" | "HIGH" | "SEVERE";
  factors: {
    boundaryIntegrity: number;     // 0-100
    ownershipConsistency: number; // 0-100
    surveyPrecision: number;       // 0-100
    disputeHistory: number;        // 0-100
    encroachmentExposure: number;  // 0-100
    documentAuthenticity: number;  // 0-100
    mutationContinuity: number;    // 0-100
  };
  explanations: string[];
}
