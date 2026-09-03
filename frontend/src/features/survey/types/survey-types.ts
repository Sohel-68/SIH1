export type SurveyMissionStatus =
  | "DRAFT"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "QA_APPROVED"
  | "REJECTED"
  | "RETURNED_FOR_CORRECTION";

export type SurveyPriority = "EMERGENCY" | "HIGH" | "MEDIUM" | "LOW";

export type GNSSFixType =
  | "RTK_FIX"         // 0.01 - 0.02m accuracy
  | "RTK_FLOAT"       // 0.05 - 0.20m accuracy
  | "DGPS"            // 0.10 - 0.50m accuracy
  | "SBAS"            // 0.50 - 1.50m accuracy
  | "AUTONOMOUS_GPS"; // 1.50 - 5.00m accuracy

export interface GNSSPoint {
  id: string;
  pointNumber: number;
  label: string; // e.g. "CP-1", "CP-2", "GCP-10"
  latitude: number;
  longitude: number;
  altitudeAMSL: number;
  accuracyMeters: number;
  hdop: number;
  satelliteCount: number;
  fixType: GNSSFixType;
  baseStationId?: string;
  correctionAgeSec?: number;
  timestamp: string;
  isCornerMarker: boolean;
  notes?: string;
}

export interface SurveyPhoto {
  id: string;
  photoUrl: string;
  caption: string;
  cornerMarkerRef?: string; // e.g. "CP-1"
  latitude: number;
  longitude: number;
  elevationAMSL: number;
  headingAzimuthDeg: number; // 0 - 360 compass direction
  timestamp: string;
  deviceModel: string;
  sha256Hash: string; // Cryptographic tamper-evident hash
  isVerified: boolean;
}

export interface SurveyFieldNote {
  id: string;
  authorName: string;
  textContent: string;
  category: "BOUNDARY_DISPUTE" | "TOPOGRAPHIC_FEATURE" | "ENCROACHMENT_FLAG" | "GENERAL";
  audioMemoUrl?: string;
  sketchUrl?: string;
  timestamp: string;
}

export interface SurveyValidationChecklist {
  gpsAccuracyValid: boolean;
  boundaryClosed: boolean;
  noOverlaps: boolean;
  requiredPhotosPresent: boolean;
  requiredDocsPresent: boolean;
  noDuplicates: boolean;
  topologyValid: boolean;
  overallStatus: "PASS" | "WARN" | "FAIL";
  issues: string[];
}

export interface QAApprovalReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: "DISTRICT_QA_OFFICER" | "DISTRICT_REGISTRAR" | "SUPER_ADMIN";
  verdict: "APPROVE" | "REJECT" | "REQUEST_CORRECTION";
  comments: string;
  timestamp: string;
  digitalSignatureHash: string;
}

export interface SurveyMission {
  id: string;
  missionNumber: string; // e.g. "SM-2024-MH-401"
  title: string;
  parcelId: string;
  ulpin?: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  surveyNumber: string;
  assignedOfficerId: string;
  assignedOfficerName: string;
  priority: SurveyPriority;
  status: SurveyMissionStatus;
  scheduledDate: string;
  deadlineDate: string;
  completionDate?: string;
  progressPercent: number; // 0 to 100
  notes?: string;
  rejectionReason?: string;
  points: GNSSPoint[];
  photos: SurveyPhoto[];
  fieldNotes: SurveyFieldNote[];
  validationChecklist?: SurveyValidationChecklist;
  qaReviews: QAApprovalReview[];
}
