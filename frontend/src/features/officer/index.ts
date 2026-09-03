export interface OfficerApprovalItem {
  id: string;
  type: "SURVEY_SUBMISSION" | "DEED_REGISTRATION" | "STRATA_SUBDIVISION";
  submittedBy: string;
  submissionDate: string;
  urgency: "NORMAL" | "EXPEDITED";
}

/**
 * Feature Module: Government Officer Portal
 * Manages official validations, cadastral sign-offs, and dispute resolutions.
 */
export const OFFICER_MODULE_TAG = "officer";
