import { apiClient } from "@/lib/api-client";
import type { AuditSecurityEvent } from "../types";

export const auditService = {
  /**
   * Log an IAM security event to the tamper-evident audit ledger
   */
  async logSecurityEvent(event: AuditSecurityEvent): Promise<void> {
    try {
      // Send to backend audit endpoint asynchronously
      await apiClient.post("/audit/log", {
        action: `IAM_${event.action}`,
        entity_name: "SECURITY_SESSION",
        entity_id: event.actorId,
        actor_id: event.actorId,
        actor_role: event.actorRole,
        details: {
          ...event.details,
          timestamp: event.timestamp,
          ip: event.ipAddress || "Client-Reported",
          userAgent: event.userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "SSR"),
        },
      });
    } catch (err) {
      // In-flight audit error should be logged to console without blocking UX
      console.warn("[GeoStrata Audit Ledger] Buffered security event:", event, err);
    }
  },
};
