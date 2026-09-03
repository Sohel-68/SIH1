/**
 * Statutory Multi-Factor Title Risk Weightings
 * Conforming to Department of Land Resources (DoLR) Title Risk Standard
 */

export const RISK_WEIGHTINGS = {
  BOUNDARY_INTEGRITY: 0.20,      // 20%
  OWNERSHIP_CONSISTENCY: 0.20,   // 20%
  SURVEY_PRECISION: 0.15,        // 15%
  DISPUTE_HISTORY: 0.15,         // 15%
  ENCROACHMENT_EXPOSURE: 0.15,   // 15%
  DOCUMENT_AUTHENTICITY: 0.10,   // 10%
  MUTATION_CONTINUITY: 0.05,     // 5%
};

export const RISK_TIERS = {
  MINIMAL: { min: 0, max: 20, label: "Minimal Risk", color: "text-gov-success" },
  LOW: { min: 21, max: 40, label: "Low Risk", color: "text-gov-primary" },
  MODERATE: { min: 41, max: 60, label: "Moderate Risk", color: "text-gov-warning" },
  HIGH: { min: 61, max: 80, label: "High Risk", color: "text-amber-600" },
  SEVERE: { min: 81, max: 100, label: "Severe Contestation", color: "text-gov-danger" },
};
