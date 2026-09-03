export type JurisdictionScope = "NATIONAL" | "STATE_MH" | "DISTRICT_MUMBAI";

export interface KPICardItem {
  id: string;
  label: string;
  value: string | number;
  changeText?: string;
  trend?: "up" | "down" | "neutral";
  category: "LAND" | "SURVEY" | "ULPIN" | "DISPUTE";
  iconName: string;
}

export interface StateCadastralRecord {
  stateCode: string;
  stateName: string;
  totalParcels: number;
  surveyedParcels: number;
  ulpinGenerated: number;
  coveragePercent: number;
  activeDisputes: number;
  priorityZone: "HIGH" | "MEDIUM" | "SATURATED";
}

export interface SurveyorProductivityItem {
  officerId: string;
  officerName: string;
  district: string;
  missionsCompleted: number;
  parcelsSurveyed: number;
  avgAccuracyCm: number;
  qaApprovalRate: number; // percentage
  status: "ACTIVE_FIELD" | "ON_LEAVE" | "QA_REVIEW";
}

export interface LandUseBreakdown {
  category: string;
  count: number;
  percentage: number;
  areaHectares: number;
  color: string;
}

export interface AIInspectionAlert {
  id: string;
  type: "ENCROACHMENT" | "STRUCTURAL_DAMAGE" | "FORGERY_SUSPECT" | "SETBACK_VIOLATION";
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  title: string;
  parcelOrUlpin: string;
  location: string;
  riskScore: number; // 0 to 100
  detectionDate: string;
  status: "PENDING_INVESTIGATION" | "NOTICE_ISSUED" | "DISMISSED";
}

export interface ExecutiveActivityItem {
  id: string;
  type: "MUTATION_APPROVED" | "SURVEY_SUBMITTED" | "ULPIN_GENERATED" | "COURT_STAY_NOTICE" | "QA_REJECTED";
  title: string;
  timestamp: string;
  actor: string;
  targetId: string;
}
