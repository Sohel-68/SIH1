import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "../types";
import { ROLES_METADATA } from "../constants/rbac";
import { ShieldAlert, ShieldCheck, Shield, User, Compass, Landmark } from "lucide-react";

export interface RoleBadgeProps {
  role?: UserRole;
  showIcon?: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function RoleBadge({
  role = "CITIZEN",
  showIcon = true,
  size = "sm",
  className,
}: RoleBadgeProps) {
  const meta = ROLES_METADATA[role] || ROLES_METADATA.CITIZEN;

  const getRoleIcon = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return <ShieldAlert className="h-3 w-3" />;
      case "STATE_ADMIN":
        return <Landmark className="h-3 w-3" />;
      case "DISTRICT_REGISTRAR":
        return <ShieldCheck className="h-3 w-3" />;
      case "GOVERNMENT_OFFICER":
        return <Shield className="h-3 w-3" />;
      case "SURVEY_OFFICER":
        return <Compass className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <Badge
      variant={meta.badgeVariant}
      size={size}
      className={className}
      dot={role !== "CITIZEN"}
    >
      <span className="flex items-center space-x-1">
        {showIcon && getRoleIcon()}
        <span>{meta.title}</span>
      </span>
    </Badge>
  );
}
