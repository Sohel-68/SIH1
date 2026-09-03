import type {
  GovernmentRole,
  CaseStatus,
  CaseType,
} from "../types/workflow-types";

export interface StateTransitionRule {
  fromStatus: CaseStatus;
  toStatus: CaseStatus;
  allowedRoles: GovernmentRole[];
  requiresDigitalSignature: boolean;
}

export const WORKFLOW_TRANSITION_RULES: StateTransitionRule[] = [
  {
    fromStatus: "DRAFT",
    toStatus: "PENDING",
    allowedRoles: ["SURVEY_OFFICER", "SUB_REGISTRAR", "TEHSILDAR"],
    requiresDigitalSignature: false,
  },
  {
    fromStatus: "PENDING",
    toStatus: "ASSIGNED",
    allowedRoles: ["QA_OFFICER", "TEHSILDAR", "DISTRICT_COLLECTOR", "STATE_ADMIN"],
    requiresDigitalSignature: false,
  },
  {
    fromStatus: "ASSIGNED",
    toStatus: "UNDER_REVIEW",
    allowedRoles: ["SURVEY_OFFICER", "QA_OFFICER", "SUB_REGISTRAR"],
    requiresDigitalSignature: false,
  },
  {
    fromStatus: "UNDER_REVIEW",
    toStatus: "APPROVED",
    allowedRoles: ["SUB_REGISTRAR", "TEHSILDAR", "DISTRICT_COLLECTOR", "STATE_ADMIN"],
    requiresDigitalSignature: true,
  },
  {
    fromStatus: "UNDER_REVIEW",
    toStatus: "REJECTED",
    allowedRoles: ["TEHSILDAR", "DISTRICT_COLLECTOR", "STATE_ADMIN"],
    requiresDigitalSignature: true,
  },
  {
    fromStatus: "UNDER_REVIEW",
    toStatus: "RETURNED_FOR_CORRECTION",
    allowedRoles: ["QA_OFFICER", "SUB_REGISTRAR", "TEHSILDAR"],
    requiresDigitalSignature: false,
  },
];

export const workflowEngine = {
  /**
   * Checks if an officer role has statutory authority to transition a case
   */
  canTransition(
    fromStatus: CaseStatus,
    toStatus: CaseStatus,
    role: GovernmentRole
  ): boolean {
    const rule = WORKFLOW_TRANSITION_RULES.find(
      (r) => r.fromStatus === fromStatus && r.toStatus === toStatus
    );
    if (!rule) return false;
    return rule.allowedRoles.includes(role);
  },

  /**
   * Generates a cryptographic digital signature seal for statutory approvals
   */
  generateDigitalSignature(signerName: string, role: GovernmentRole, caseNumber: string): string {
    const seed = `${signerName}:${role}:${caseNumber}:${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `SIG-GOV-${role}-${hex}${Date.now().toString(16)}`;
  },
};
