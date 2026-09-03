import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import type { Permission, UserRole } from "../types";
import { ROLES_METADATA } from "../constants/rbac";

export function usePermissions() {
  const { user } = useAuthStore();

  const userRole = user?.role;
  const userPermissions = React.useMemo(() => user?.permissions || [], [user?.permissions]);

  const hasRole = React.useCallback(
    (roleOrRoles: UserRole | UserRole[]): boolean => {
      if (!userRole) return false;
      if (Array.isArray(roleOrRoles)) {
        return roleOrRoles.includes(userRole);
      }
      return userRole === roleOrRoles;
    },
    [userRole]
  );

  const isRoleAtLeast = React.useCallback(
    (minRole: UserRole): boolean => {
      if (!userRole) return false;
      const userLevel = ROLES_METADATA[userRole]?.hierarchyLevel || 0;
      const requiredLevel = ROLES_METADATA[minRole]?.hierarchyLevel || 0;
      return userLevel >= requiredLevel;
    },
    [userRole]
  );

  const hasPermission = React.useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN") return true;
      return userPermissions.includes(permission);
    },
    [user, userPermissions]
  );

  const hasAnyPermission = React.useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN") return true;
      return permissions.some((p) => userPermissions.includes(p));
    },
    [user, userPermissions]
  );

  const hasAllPermissions = React.useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN") return true;
      return permissions.every((p) => userPermissions.includes(p));
    },
    [user, userPermissions]
  );

  return {
    userRole,
    userPermissions,
    hasRole,
    isRoleAtLeast,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
