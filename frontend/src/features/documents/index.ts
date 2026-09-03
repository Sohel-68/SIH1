export interface UploadedDocumentRecord {
  id: string;
  title: string;
  documentType: "TITLE_DEED" | "FLOOR_PLAN" | "ENCUMBRANCE_CERTIFICATE";
  checksumSha256: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
}

/**
 * Feature Module: Document Verification
 * Manages title deeds, encrypted file uploads, and cryptographic checksum verification.
 */
export const DOCUMENTS_MODULE_TAG = "documents";
