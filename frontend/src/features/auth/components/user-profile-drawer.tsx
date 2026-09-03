"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { useAuditLogger } from "../hooks/use-audit-logger";
import { Drawer } from "@/components/ui/drawer";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./role-badge";
import { ROLES_METADATA } from "../constants/rbac";
import type { UserRole } from "../types";
import {
  User,
  Building2,
  MapPin,
  Clock,
  Shield,
  Laptop,
  Smartphone,
  Tablet,
  LogOut,
  Sliders,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export function UserProfileDrawer() {
  const router = useRouter();
  const {
    user,
    isProfileDrawerOpen,
    setProfileDrawerOpen,
    logout,
    activeSessions,
    terminateSession,
    switchRolePersona,
  } = useAuthStore();
  const { logEvent } = useAuditLogger();

  if (!user) return null;

  const handleLogout = () => {
    logEvent("LOGOUT", { trigger: "user_profile_drawer" });
    logout();
    setProfileDrawerOpen(false);
    router.push("/login");
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "Mobile":
        return <Smartphone className="h-4 w-4" />;
      case "Tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  return (
    <Drawer
      isOpen={isProfileDrawerOpen}
      onClose={() => setProfileDrawerOpen(false)}
      position="right"
      width="md"
      title="Government Officer Profile"
      description="National Cadastral Authority &bull; Digital Identity"
      footer={
        <div className="flex w-full items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-mono">
            ID: {user.employeeId || "IND-CITIZEN"}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="h-3.5 w-3.5" />}
          >
            Secure Logout
          </Button>
        </div>
      }
    >
      <div className="space-y-6 pb-4">
        {/* User Hero Identity */}
        <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/30 border border-border/80">
          <Avatar
            fallback={user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            size="lg"
            status="online"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground truncate">
              {user.fullName}
            </h4>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <div className="mt-2">
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>

        {/* Administrative Jurisdiction Information */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
            <Building2 className="h-3.5 w-3.5 text-gov-primary" />
            <span>Jurisdiction &amp; Department</span>
          </h5>

          <div className="grid grid-cols-1 gap-2 text-xs">
            {user.department && (
              <div className="p-2.5 rounded-lg border border-border bg-card flex justify-between items-center">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-semibold text-foreground text-right">{user.department}</span>
              </div>
            )}
            {user.state && (
              <div className="p-2.5 rounded-lg border border-border bg-card flex justify-between items-center">
                <span className="text-muted-foreground">State / UT:</span>
                <span className="font-semibold text-foreground">{user.state}</span>
              </div>
            )}
            {user.district && (
              <div className="p-2.5 rounded-lg border border-border bg-card flex justify-between items-center">
                <span className="text-muted-foreground">District / Division:</span>
                <span className="font-semibold text-foreground">{user.district}</span>
              </div>
            )}
            <div className="p-2.5 rounded-lg border border-border bg-card flex justify-between items-center">
              <span className="text-muted-foreground">Last Login:</span>
              <span className="font-semibold text-foreground font-mono">{user.lastLogin}</span>
            </div>
          </div>
        </div>

        {/* Evaluation Persona Switcher for the Evaluator */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
            <Sliders className="h-3.5 w-3.5 text-gov-accent" />
            <span>Role Switcher (RBAC Live Test)</span>
          </h5>

          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ROLES_METADATA) as UserRole[]).map((r) => {
              const isSelected = user.role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRolePersona(r)}
                  className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-gov-primary bg-gov-primary/10 text-gov-primary font-bold shadow-sm"
                      : "border-border hover:bg-muted/40 text-foreground"
                  }`}
                >
                  <span className="truncate">{ROLES_METADATA[r].title}</span>
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gov-primary ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Sessions & Devices */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
            <Shield className="h-3.5 w-3.5 text-gov-success" />
            <span>Active Government Sessions</span>
          </h5>

          <div className="space-y-2">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-lg border border-border bg-card flex items-start justify-between space-x-3 text-xs"
              >
                <div className="flex items-start space-x-2.5">
                  <div className="mt-0.5 p-1.5 rounded-md bg-muted text-muted-foreground">
                    {getDeviceIcon(session.deviceType)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-foreground">{session.browser} on {session.os}</span>
                      {session.isCurrentSession && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-gov-success/15 text-gov-success">
                          This Device
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {session.ipAddress} &bull; {session.lastActiveTime}
                    </p>
                  </div>
                </div>

                {!session.isCurrentSession && (
                  <button
                    onClick={() => terminateSession(session.id)}
                    className="p-1 rounded text-muted-foreground hover:text-gov-danger hover:bg-gov-danger/10 transition-colors"
                    title="Terminate Session"
                    aria-label="Terminate Session"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
