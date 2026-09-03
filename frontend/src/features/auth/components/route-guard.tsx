"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { usePermissions } from "../hooks/use-permissions";
import { useAuditLogger } from "../hooks/use-audit-logger";
import type { Permission, UserRole } from "../types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./role-badge";
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";

export interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
}

export function RouteGuard({
  children,
  requiredRoles,
  requiredPermissions,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { hasRole, hasAnyPermission } = usePermissions();
  const { logEvent } = useAuditLogger();

  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, pathname, router]);

  // If unauthenticated, render nothing while redirecting
  if (!isAuthenticated || isChecking) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin text-gov-primary" />
          <span>Validating security credentials...</span>
        </div>
      </div>
    );
  }

  // Check Role authorization
  const roleAllowed = !requiredRoles || requiredRoles.length === 0 || hasRole(requiredRoles);

  // Check Permission authorization
  const permissionAllowed =
    !requiredPermissions || requiredPermissions.length === 0 || hasAnyPermission(requiredPermissions);

  if (!roleAllowed || !permissionAllowed) {
    logEvent("ACCESS_DENIED", {
      attemptedPath: pathname,
      requiredRoles,
      requiredPermissions,
      userRole: user?.role,
    });

    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="max-w-lg w-full border-gov-danger/30 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gov-danger/10 text-gov-danger mb-2">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              403 &bull; Unauthorized Cadastral Access
            </CardTitle>
            <CardDescription className="text-xs">
              National Security Protocol &bull; ISO 19152 LADM Access Restriction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-center text-muted-foreground">
            <p>
              Your active credentials do not have the required statutory clearance to view or mutate records at{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground font-semibold">{pathname}</code>.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <span>Your current role:</span>
              <RoleBadge role={user?.role} />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-center space-x-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}
              leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
            >
              Return to Portal
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push("/login")}
            >
              Switch Role
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
