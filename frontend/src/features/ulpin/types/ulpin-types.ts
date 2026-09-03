export type ULPINStatus =
  | "DRAFT"
  | "APPROVED"
  | "ISSUED"
  | "SUPERSEDED"
  | "REVOKED";

export interface AdministrativeHierarchyCodes {
  countryCode: string; // e.g. "IND"
  stateCode: string;   // e.g. "27" (Maharashtra)
  districtCode: string;// e.g. "518" (Mumbai Suburban)
  talukaCode: string;  // e.g. "4182" (Andheri)
  villageCode: string; // e.g. "554210" (Versova)
  surveyNumber: string;// e.g. "CTS-142"
  subdivision: string; // e.g. "01"
  parcelNumber: string;// e.g. "401A"
  buildingCode?: string;// e.g. "01"
  towerNumber?: string; // e.g. "TA"
  floorLevel?: number;  // e.g. 5
  unitNumber?: string;  // e.g. "502"
}

export interface ULPINRecord {
  id: string;
  baseUlpin: string; // 14 digits (e.g. "27518001004201")
  ulpin3D?: string;  // e.g. "27518001004201-B01-TA-F05-U502"
  version: number;
  isCurrent: boolean;
  status: ULPINStatus;
  hierarchy: AdministrativeHierarchyCodes;
  centroid: [number, number]; // [longitude, latitude]
  elevationAmsl: number;
  carpetAreaSqm: number;
  volumeCum?: number;
  ownerName: string;
  ownerMaskedId: string;
  issueDate: string;
  issuingAuthority: string;
  qrPayload: string;
  verificationHash: string; // SHA-256 tamper-evident digital seal
  reasonForRevision?: string;
  supersededByUlpin?: string;
  previousVersionId?: string;
}

export interface ULPINGenerationParams {
  hierarchy: AdministrativeHierarchyCodes;
  centroid: [number, number];
  elevationAmsl: number;
  carpetAreaSqm: number;
  volumeCum?: number;
  ownerName: string;
  ownerMaskedId: string;
  issuingAuthority: string;
}

export interface ULPINValidationResult {
  isValid: boolean;
  checks: {
    hierarchyValid: boolean;
    noDuplicateUlpin: boolean;
    noDuplicateParcel: boolean;
    geometryMatched: boolean;
    surveyMatched: boolean;
    checksumValid: boolean;
  };
  errors: string[];
  warnings: string[];
}

export interface BulkULPINItem {
  id: string;
  params: ULPINGenerationParams;
  status: "QUEUED" | "SUCCESS" | "ERROR";
  resultRecord?: ULPINRecord;
  error?: string;
}

export interface BulkULPINBatch {
  batchId: string;
  totalCount: number;
  successCount: number;
  failedCount: number;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  timestamp: string;
  items: BulkULPINItem[];
}
