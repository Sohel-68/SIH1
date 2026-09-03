import type { GovernmentCase } from "../types/case-types";
import { SLA_STATUTORY_LIMITS } from "../constants/sla-statutory-limits";

export type SLAStatus = "HEALTHY" | "WARNING" | "BREACHED";

export const slaEngine = {
  /**
   * Determine current SLA state of a government case
   */
  getSLAStatus(caseItem: GovernmentCase): SLAStatus {
    if (caseItem.slaDaysRemaining < 0) return "BREACHED";
    const rule = SLA_STATUTORY_LIMITS[caseItem.caseType];
    if (!rule) return "HEALTHY";
    if (caseItem.slaDaysRemaining <= rule.warningThresholdDays) return "WARNING";
    return "HEALTHY";
  },

  /**
   * Checks if a case warrants statutory auto-escalation
   */
  checkAutoEscalate(caseItem: GovernmentCase): {
    shouldEscalate: boolean;
    escalateToRole?: string;
    reason?: string;
  } {
    if (caseItem.slaDaysRemaining < 0 && !caseItem.isEscalated) {
      const rule = SLA_STATUTORY_LIMITS[caseItem.caseType];
      return {
        shouldEscalate: true,
        escalateToRole: rule?.autoEscalateToRole || "DISTRICT_COLLECTOR",
        reason: `Statutory limit of ${rule?.statutoryLimitDays || 15} days breached under Right to Services Act.`,
      };
    }
    return { shouldEscalate: false };
  },
};
