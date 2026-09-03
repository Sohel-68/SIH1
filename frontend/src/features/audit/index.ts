export interface AuditEntry {
  id: string;
  action: string;
  entityName: string;
  entityId: string;
  actorRole: string;
  timestamp: string;
  recordHash: string;
}

/**
 * Feature Module: Audit Ledger
 * Displays tamper-evident immutable transaction logs for judicial & governance reviews.
 */
export const AUDIT_MODULE_TAG = "audit";
