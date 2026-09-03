import type { LA_Party, LA_BAUnit, LA_SpatialUnit, LA_SpatialSource } from "./ladm-types";

export type PropertyLifecycleState =
  | "VACANT_LAND"
  | "CONSTRUCTION"
  | "SURVEY"
  | "VERIFICATION"
  | "ULPIN_ASSIGNED"
  | "TAX_ACTIVE"
  | "TRANSFER"
  | "ARCHIVED";

export interface MutationEntry {
  id: string;
  mutationNumber: string; // e.g. "FERFAR-2024-8841"
  filingDate: string;
  approvalDate?: string;
  mutationType: "SALE_TRANSFER" | "INHERITANCE" | "PARTITION" | "MORTGAGE" | "GOV_ACQUISITION";
  previousOwner: string;
  newOwner: string;
  sanctioningAuthority: string; // e.g. "Tahsildar Andheri"
  status: "SANCTIONED" | "NOTICE_ISSUED" | "DISPUTED" | "REJECTED";
  documentReference: string;
  remarks?: string;
}

export interface TaxAssessment {
  assessmentYear: string;
  annualRatableValue: number;
  taxAmount: number;
  paidAmount: number;
  paymentStatus: "PAID" | "PENDING" | "OVERDUE";
  receiptNumber?: string;
  paymentDate?: string;
}

export interface DisputeRecord {
  id: string;
  courtCaseNumber: string;
  courtName: string;
  disputeType: "BOUNDARY_ENCROACHMENT" | "TITLE_CONTEST" | "TENANCY_DISPUTE" | "EASEMENT_RIGHT";
  plaintiff: string;
  defendant: string;
  injunctionActive: boolean;
  filingDate: string;
  summary: string;
}

export interface PropertyDossier {
  id: string;
  baseUlpin: string;
  ulpin3D?: string;
  parcelNumber: string;
  surveyNumber: string;
  subdivision: string;
  lifecycleState: PropertyLifecycleState;
  spatialUnit: LA_SpatialUnit;
  baUnit: LA_BAUnit;
  parties: LA_Party[];
  documents: LA_SpatialSource[];
  mutationHistory: MutationEntry[];
  taxAssessments: TaxAssessment[];
  disputes: DisputeRecord[];
  aiRiskAnalysis: {
    compositeScore: number; // 0 to 100
    riskLevel: "LOW" | "MODERATE" | "HIGH";
    encroachmentRisk: number;
    titleFraudRisk: number;
    detectedAnomalies: string[];
  };
  strataBreakdown: {
    buildingName: string;
    towersCount: number;
    floorsCount: number;
    unitsCount: number;
    totalVolumetricAreaSqm: number;
  };
}
