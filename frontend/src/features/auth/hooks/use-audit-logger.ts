import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { auditService } from "../services/audit-service";
import type { AuditSecurityEvent } from "../types";

export function useAuditLogger() {
  const { user } = useAuthStore();

  const logEvent = React.useCallback(
    (
      action: AuditSecurityEvent["action"],
      details?: Record<string, unknown>
    ) => {
      const event: AuditSecurityEvent = {
        action,
        actorId: user?.id || "anonymous",
        actorRole: user?.role || "ANONYMOUS",
        timestamp: new Date().toISOString(),
        details,
      };
      auditService.logSecurityEvent(event);
    },
    [user]
  );

  return { logEvent };
}
