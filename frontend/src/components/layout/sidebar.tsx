"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useShellStore } from "@/stores/use-shell-store";
import { Tooltip } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Box,
  Building2,
  Compass,
  QrCode,
  Sparkles,
  Activity,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";

export interface NavMenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  isAction?: boolean;
}

export const SIDEBAR_NAV_ITEMS: NavMenuItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "GIS Mapping", href: "/gis", icon: Map },
  { title: "3D Digital Twin", href: "/viewer-3d", icon: Box },
  { title: "Properties", href: "/properties", icon: Building2 },
  { title: "Survey", href: "/survey", icon: Compass },
  { title: "ULPIN", href: "/ulpin", icon: QrCode },
  { title: "AI Intelligence", href: "/ai", icon: Sparkles },
  { title: "Activity Stream", href: "/activity", icon: Activity },
  { title: "Administration", href: "/admin", icon: ShieldCheck },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

import { usePermissions } from "@/features/auth/hooks/use-permissions";
import { ROUTE_PERMISSIONS } from "@/features/auth/constants/rbac";

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, setActiveRoute } = useShellStore();
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

  const handleNavClick = (href: string) => {
    setActiveRoute(href);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("geostrata_token");
      window.location.reload();
    }
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-30 shrink-0 select-none",
        isSidebarCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Sidebar Header Brand Identity */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/70">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gov-primary text-white shadow-sm shrink-0">
            <Globe className="h-5 w-5" />
          </div>
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col whitespace-nowrap overflow-hidden"
              >
                <span className="text-sm font-bold tracking-tight text-foreground">
                  GeoStrata
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  National 3D Cadastre
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle Icon */}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Menu List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {authorizedNavItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          const linkContent = (
            <Link
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "relative flex items-center h-10 rounded-lg text-xs font-medium transition-all duration-150 group",
                isSidebarCollapsed ? "justify-center px-0" : "px-3 space-x-3",
                isActive
                  ? "text-gov-primary font-semibold bg-gov-primary/10 dark:bg-gov-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {/* Animated Active Indicator Pill on Left */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-gov-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}

              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110",
                  isActive ? "text-gov-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />

              {!isSidebarCollapsed && (
                <span className="truncate flex-1">{item.title}</span>
              )}

              {!isSidebarCollapsed && item.badge && (
                <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gov-primary/15 text-gov-primary">
                  {item.badge}
                </span>
              )}
            </Link>
          );

          return (
            <div key={item.title}>
              {isSidebarCollapsed ? (
                <Tooltip content={item.title} position="right" delayMs={100}>
                  {linkContent}
                </Tooltip>
              ) : (
                linkContent
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Navigation: Logout */}
      <div className="p-2 border-t border-border/70">
        {isSidebarCollapsed ? (
          <Tooltip content="Logout" position="right" delayMs={100}>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center h-10 rounded-lg text-xs font-medium text-gov-danger hover:bg-gov-danger/10 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 px-3 h-10 rounded-lg text-xs font-medium text-gov-danger hover:bg-gov-danger/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
