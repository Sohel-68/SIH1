export type GovernmentDepartment =
  | "REVENUE"
  | "SURVEY"
  | "MUNICIPALITY_MCGM"
  | "FOREST"
  | "URBAN_PLANNING"
  | "DISASTER_MANAGEMENT";

export type GovernmentRole =
  | "SURVEY_OFFICER"
  | "QA_OFFICER"
  | "SUB_REGISTRAR"
  | "TEHSILDAR"
  | "DISTRICT_COLLECTOR"
  | "STATE_ADMIN"
  | "NATIONAL_ADMIN";

export type CaseType =
  | "MUTATION_TRANSFER"
  | "BOUNDARY_SURVEY"
  | "ULPIN_ISSUANCE"
  | "BOUNDARY_DISPUTE"
  | "LAND_CONVERSION_NA"
  | "ENCROACHMENT_EVICTION";

export type CaseStatus =
  | "DRAFT"
  | "PENDING"
  | "ASSIGNED"
  | "UNDER_REVIEW"
  | "INSPECTION_ORDERED"
  | "APPROVED"
  | "REJECTED"
  | "RETURNED_FOR_CORRECTION"
  | "CLOSED";

export type CasePriority = "EMERGENCY" | "HIGH" | "MEDIUM" | "LOW";

export interface SLARule {
  caseType: CaseType;
  statutoryLimitDays: number;
  warningThresholdDays: number;
  autoEscalateToRole: GovernmentRole;
}
