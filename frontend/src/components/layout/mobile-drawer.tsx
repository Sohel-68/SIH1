"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useShellStore } from "@/stores/use-shell-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { usePermissions } from "@/features/auth/hooks/use-permissions";
import { ROUTE_PERMISSIONS } from "@/features/auth/constants/rbac";
import { SIDEBAR_NAV_ITEMS } from "@/components/layout/sidebar";
import { RoleBadge } from "@/features/auth/components/role-badge";
import { Drawer } from "@/components/ui/drawer";
import { Globe, LogOut } from "lucide-react";

export function MobileDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useShellStore();
  const { user, logout } = useAuthStore();
  const { hasRole, hasAnyPermission } = usePermissions();

  const authorizedNavItems = React.useMemo(() => {
    return SIDEBAR_NAV_ITEMS.filter((item) => {
      const rule = ROUTE_PERMISSIONS[item.href];
      if (!rule) return true;
      if (rule.roles && !hasRole(rule.roles)) return false;
      if (rule.permissions && !hasAnyPermission(rule.permissions)) return false;
      return true;
    });
  }, [hasRole, hasAnyPermission]);

  const handleLogout = () => {
    logout();
    setMobileDrawerOpen(false);
    router.push("/login");
  };

  return (
    <Drawer
      isOpen={isMobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      position="left"
      width="sm"
      title={
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gov-primary text-white">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-bold text-foreground">GeoStrata</span>
              {user && <RoleBadge role={user.role} size="sm" showIcon={false} />}
            </div>
            <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
              GovTech Portal
            </span>
          </div>
        </div>
      }
      footer={
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-gov-danger hover:bg-gov-danger/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      }
    >
      <nav className="space-y-1 py-2">
        {authorizedNavItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={() => setMobileDrawerOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors",
                isActive
                  ? "bg-gov-primary text-white font-bold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </Drawer>
  );
}
