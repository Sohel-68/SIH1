import type { CompositeTitleRisk } from "../types/ai-types";
import { RISK_WEIGHTINGS } from "../constants/risk-weightings";

export const riskScoringEngine = {
  /**
   * Calculate Multi-Factor Composite Title Risk Score (0-100)
   */
  computeCompositeRisk(factors: CompositeTitleRisk["factors"]): CompositeTitleRisk {
    const overallScore = Math.round(
      factors.boundaryIntegrity * RISK_WEIGHTINGS.BOUNDARY_INTEGRITY +
      factors.ownershipConsistency * RISK_WEIGHTINGS.OWNERSHIP_CONSISTENCY +
      factors.surveyPrecision * RISK_WEIGHTINGS.SURVEY_PRECISION +
      factors.disputeHistory * RISK_WEIGHTINGS.DISPUTE_HISTORY +
      factors.encroachmentExposure * RISK_WEIGHTINGS.ENCROACHMENT_EXPOSURE +
      factors.documentAuthenticity * RISK_WEIGHTINGS.DOCUMENT_AUTHENTICITY +
      factors.mutationContinuity * RISK_WEIGHTINGS.MUTATION_CONTINUITY
    );

    let riskTier: CompositeTitleRisk["riskTier"] = "MINIMAL";
    if (overallScore > 80) riskTier = "SEVERE";
    else if (overallScore > 60) riskTier = "HIGH";
    else if (overallScore > 40) riskTier = "MODERATE";
    else if (overallScore > 20) riskTier = "LOW";

    const explanations: string[] = [];
    if (factors.encroachmentExposure > 50) {
      explanations.push("High setback encroachment exposure flagged along western road corridor.");
    }
    if (factors.disputeHistory > 50) {
      explanations.push("Active easement contestation pending before Revenue Court.");
    }
    if (factors.boundaryIntegrity > 50) {
      explanations.push("Physical boundary wall position deviates from revenue village map sheet.");
    }

    return {
      overallScore,
      riskTier,
      factors,
      explanations,
    };
  },

  /**
   * Returns sample evaluation for Palm Heights Complex (CTS-142/1)
   */
  getSamplePropertyRisk(): CompositeTitleRisk {
    return this.computeCompositeRisk({
      boundaryIntegrity: 15,    // Safe
      ownershipConsistency: 10, // Safe
      surveyPrecision: 8,       // Excellent DGPS survey (1.4 cm)
      disputeHistory: 20,       // Resolved dispute
      encroachmentExposure: 18, // Within setback limits
      documentAuthenticity: 5,  // Fully registered
      mutationContinuity: 10,   // Complete Form 6 Ferfar trail
    });
  },

  /**
   * Returns sample evaluation for High-Risk Disputed Parcel (CTS-144/A)
   */
  getHighRiskPropertyRisk(): CompositeTitleRisk {
    return this.computeCompositeRisk({
      boundaryIntegrity: 85,
      ownershipConsistency: 70,
      surveyPrecision: 40,
      disputeHistory: 95,
      encroachmentExposure: 92,
      documentAuthenticity: 60,
      mutationContinuity: 50,
    });
  },
};
