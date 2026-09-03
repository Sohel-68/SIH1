import type { SLARule, CaseType } from "../types/workflow-types";

export const SLA_STATUTORY_LIMITS: Record<CaseType, SLARule> = {
  MUTATION_TRANSFER: {
    caseType: "MUTATION_TRANSFER",
    statutoryLimitDays: 15,
    warningThresholdDays: 4,
    autoEscalateToRole: "TEHSILDAR",
  },
  BOUNDARY_SURVEY: {
    caseType: "BOUNDARY_SURVEY",
    statutoryLimitDays: 7,
    warningThresholdDays: 2,
    autoEscalateToRole: "DISTRICT_COLLECTOR",
  },
  ULPIN_ISSUANCE: {
    caseType: "ULPIN_ISSUANCE",
    statutoryLimitDays: 3,
    warningThresholdDays: 1,
    autoEscalateToRole: "SUB_REGISTRAR",
  },
  BOUNDARY_DISPUTE: {
    caseType: "BOUNDARY_DISPUTE",
    statutoryLimitDays: 30,
    warningThresholdDays: 7,
    autoEscalateToRole: "DISTRICT_COLLECTOR",
  },
  LAND_CONVERSION_NA: {
    caseType: "LAND_CONVERSION_NA",
    statutoryLimitDays: 30,
    warningThresholdDays: 5,
    autoEscalateToRole: "STATE_ADMIN",
  },
  ENCROACHMENT_EVICTION: {
    caseType: "ENCROACHMENT_EVICTION",
    statutoryLimitDays: 14,
    warningThresholdDays: 3,
    autoEscalateToRole: "DISTRICT_COLLECTOR",
  },
};
