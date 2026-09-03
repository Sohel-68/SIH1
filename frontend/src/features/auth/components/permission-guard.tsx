"use client";

import * as React from "react";
import { usePermissions } from "../hooks/use-permissions";
import type { Permission, UserRole } from "../types";

export interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAllPermissions?: boolean;
  role?: UserRole | UserRole[];
  minRole?: UserRole;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAllPermissions = false,
  role,
  minRole,
  fallback = null,
}: PermissionGuardProps) {
  const { hasRole, isRoleAtLeast, hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let isAllowed = true;

  if (role && !hasRole(role)) {
    isAllowed = false;
  }

  if (minRole && !isRoleAtLeast(minRole)) {
    isAllowed = false;
  }

  if (permission && !hasPermission(permission)) {
    isAllowed = false;
  }

  if (permissions && permissions.length > 0) {
    if (requireAllPermissions) {
      if (!hasAllPermissions(permissions)) isAllowed = false;
    } else {
      if (!hasAnyPermission(permissions)) isAllowed = false;
    }
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
