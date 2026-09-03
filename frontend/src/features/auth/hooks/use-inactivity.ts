import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useAuditLogger } from "./use-audit-logger";
import { useRouter } from "next/navigation";

export interface UseInactivityOptions {
  timeoutMs?: number; // Total inactivity timeout (default: 15 mins)
  warningMs?: number; // Warning modal time before timeout (default: 60s)
}

export function useInactivity({
  timeoutMs = 15 * 60 * 1000,
  warningMs = 60 * 1000,
}: UseInactivityOptions = {}) {
  const router = useRouter();
  const { isAuthenticated, logout, lastActivity, recordActivity } = useAuthStore();
  const { logEvent } = useAuditLogger();

  const [isWarningOpen, setIsWarningOpen] = React.useState(false);
  const [secondsRemaining, setSecondsRemaining] = React.useState(warningMs / 1000);

  // User activity listeners
  React.useEffect(() => {
    if (!isAuthenticated) return;

    let throttleTimer: NodeJS.Timeout | null = null;

    const handleActivity = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          recordActivity();
          throttleTimer = null;
        }, 1000);
      }
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }));

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [isAuthenticated, recordActivity]);

  // Inactivity interval check
  React.useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivity;
      const warningThreshold = timeoutMs - warningMs;

      if (elapsed >= timeoutMs) {
        // Session expired
        logEvent("SESSION_EXPIRY", { reason: "inactivity_timeout", elapsedMs: elapsed });
        setIsWarningOpen(false);
        logout();
        router.push("/login?reason=inactivity");
      } else if (elapsed >= warningThreshold) {
        setIsWarningOpen(true);
        const remaining = Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000));
        setSecondsRemaining(remaining);
      } else {
        setIsWarningOpen(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity, timeoutMs, warningMs, logout, logEvent, router]);

  const extendSession = React.useCallback(() => {
    recordActivity();
    setIsWarningOpen(false);
  }, [recordActivity]);

  const logoutNow = React.useCallback(() => {
    logEvent("LOGOUT", { trigger: "user_inactivity_dialog" });
    setIsWarningOpen(false);
    logout();
    router.push("/login");
  }, [logEvent, logout, router]);

  return {
    isWarningOpen,
    secondsRemaining,
    extendSession,
    logoutNow,
  };
}
