"use client";

import * as React from "react";
import { useInactivity } from "../hooks/use-inactivity";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, ShieldAlert } from "lucide-react";

export function SessionTimeoutDialog() {
  const { isWarningOpen, secondsRemaining, extendSession, logoutNow } = useInactivity();

  return (
    <Dialog
      isOpen={isWarningOpen}
      onClose={extendSession}
      maxWidth="sm"
      title={
        <div className="flex items-center space-x-2 text-gov-warning">
          <Clock className="h-5 w-5" />
          <span>Session Inactivity Notice</span>
        </div>
      }
      footer={
        <>
          <Button variant="outline" size="sm" onClick={logoutNow}>
            Sign Out
          </Button>
          <Button variant="default" size="sm" onClick={extendSession}>
            Extend Session
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <p>
          Per Government of India Information Security Guidelines, your authenticated cadastral session will expire automatically due to inactivity.
        </p>

        <div className="p-3 rounded-lg bg-gov-warning/10 border border-gov-warning/20 flex items-center justify-between">
          <span className="font-semibold text-foreground">Auto-logout in:</span>
          <span className="font-mono text-base font-bold text-gov-warning">
            {secondsRemaining}s
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Click <strong>Extend Session</strong> to keep your current cadastral edits and session active.
        </p>
      </div>
    </Dialog>
  );
}
