export interface ReportGenerationRequest {
  ulpin: string;
  templateType: "BHU_AADHAAR_3D" | "VALUATION_EXTRACT" | "DISPUTE_DOSSIER";
  format: "PDF" | "GEOJSON";
}

/**
 * Feature Module: Cadastral Reports
 * Generates official Bhu-Aadhaar 3D property certificates and extracts.
 */
export const REPORTS_MODULE_TAG = "reports";
