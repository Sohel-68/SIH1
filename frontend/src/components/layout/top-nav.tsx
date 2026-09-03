"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useShellStore } from "@/stores/use-shell-store";
import { useThemeStore } from "@/stores/use-theme-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { useNotificationStore, type NotificationCategory } from "@/stores/use-notification-store";
import { useDemoModeStore } from "@/stores/use-demo-mode-store";
import { RoleBadge } from "@/features/auth/components/role-badge";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Popover } from "@/components/ui/popover";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { KeyboardShortcutsModal } from "./keyboard-shortcuts-modal";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Laptop,
  Check,
  Wifi,
  WifiOff,
  User,
  Settings,
  LogOut,
  Play,
  HelpCircle,
  Clock,
  Sparkles,
  CheckCheck,
} from "lucide-react";

export function TopNav() {
  const router = useRouter();
  const { toggleMobileDrawer } = useShellStore();
  const { theme, resolvedTheme, setTheme } = useThemeStore();
  const { user, setProfileDrawerOpen, logout } = useAuthStore();
  const { setIsDemoModalOpen } = useDemoModeStore();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    filterCategory,
    setFilterCategory,
  } = useNotificationStore();

  const isOnline = useOnlineStatus();
  const [isShortcutsOpen, setIsShortcutsOpen] = React.useState(false);

  // Trigger Command Palette custom event
  const handleOpenSearch = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterCategory !== "ALL" && n.category !== filterCategory) return false;
    return !n.isArchived;
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/85 px-4 sm:px-6 backdrop-blur-md select-none">
      {/* Left: Mobile Drawer Trigger & Dynamic Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={toggleMobileDrawer}
          className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Breadcrumb />
      </div>

      {/* Center: Global Search Trigger Bar (Opens Command Palette) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div
          onClick={handleOpenSearch}
          className="flex w-full items-center justify-between h-9 rounded-lg border border-input bg-background/60 px-3 text-xs text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Search ULPIN, parcels, deeds, coordinates...</span>
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right: National Demo Button, Notifications, Connectivity, Theme, Profile */}
      <div className="flex items-center space-x-2">
        {/* SIH Demo Mode Trigger Button */}
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex h-8 text-xs font-bold border-gov-accent/40 bg-gov-accent/10 hover:bg-gov-accent/20 text-foreground"
          onClick={() => setIsDemoModalOpen(true)}
          leftIcon={<Play className="h-3.5 w-3.5 text-gov-accent" />}
        >
          National Demo
        </Button>

        {/* Keyboard Shortcuts Hint */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          title="Keyboard Shortcuts (?)"
          aria-label="Keyboard Shortcuts"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Connectivity Status Pill */}
        <Badge
          variant={isOnline ? "success" : "danger"}
          size="sm"
          className="hidden xl:inline-flex items-center gap-1"
        >
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span>Offline Mode</span>
            </>
          )}
        </Badge>

        {/* Notification Bell with Full Tray Popover */}
        <Popover
          align="right"
          trigger={
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gov-danger text-[9px] font-bold text-white ring-2 ring-background">
                  {unreadCount}
                </span>
              )}
            </Button>
          }
        >
          <div className="w-80 sm:w-96 p-2 space-y-2 text-xs">
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border/70 px-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="danger" size="sm">
                    {unreadCount} New
                  </Badge>
                )}
              </div>
              <button
                onClick={markAllAsRead}
                className="text-[10px] text-gov-primary hover:underline flex items-center space-x-1"
              >
                <CheckCheck className="h-3 w-3" />
                <span>Mark all read</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1 text-[10px]">
              {(["ALL", "AI_ALERT", "SURVEY", "ULPIN", "ADMIN_SLA"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat as NotificationCategory | "ALL")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    filterCategory === cat
                      ? "bg-gov-primary text-white font-semibold"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Notifications Scrollable List */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id);
                    router.push(n.targetHref);
                  }}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    !n.isRead
                      ? "border-gov-primary/40 bg-gov-primary/5 hover:bg-gov-primary/10"
                      : "border-border/60 bg-card/60 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-foreground line-clamp-1">{n.title}</span>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] line-clamp-2">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </Popover>

        {/* Theme Switcher */}
        <DropdownMenu
          align="right"
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Switch theme">
              {resolvedTheme === "dark" ? (
                <Moon className="h-4 w-4 text-gov-accent" />
              ) : (
                <Sun className="h-4 w-4 text-gov-warning" />
              )}
            </Button>
          }
          items={[
            {
              label: (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-3.5 w-3.5" />
                    <span>Light Theme</span>
                  </div>
                  {theme === "light" && <Check className="h-3.5 w-3.5 text-gov-primary" />}
                </div>
              ),
              onClick: () => setTheme("light"),
            },
            {
              label: (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-3.5 w-3.5" />
                    <span>Dark Theme</span>
                  </div>
                  {theme === "dark" && <Check className="h-3.5 w-3.5 text-gov-primary" />}
                </div>
              ),
              onClick: () => setTheme("dark"),
            },
            {
              label: (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Laptop className="h-3.5 w-3.5" />
                    <span>System Theme</span>
                  </div>
                  {theme === "system" && <Check className="h-3.5 w-3.5 text-gov-primary" />}
                </div>
              ),
              onClick: () => setTheme("system"),
            },
          ]}
        />

        {/* User Role Badge */}
        {user && (
          <div className="hidden xl:block">
            <RoleBadge role={user.role} size="sm" />
          </div>
        )}

        {/* User Profile Dropdown */}
        <DropdownMenu
          align="right"
          trigger={
            <button
              className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-primary/40 transition-all focus:outline-none"
              aria-label="Open officer profile"
            >
              <Avatar
                fallback={
                  user?.fullName
                    ? user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "GO"
                }
                size="sm"
                status="online"
              />
            </button>
          }
          header={
            <div>
              <p className="text-xs font-bold text-foreground truncate">
                {user?.fullName || "Government Officer"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.email || "officer@geostrata.gov.in"}
              </p>
            </div>
          }
          items={[
            {
              label: "Officer Profile & Sessions",
              icon: <User className="h-3.5 w-3.5" />,
              onClick: () => setProfileDrawerOpen(true),
            },
            {
              label: "System Settings",
              icon: <Settings className="h-3.5 w-3.5" />,
              onClick: () => router.push("/settings"),
            },
            { divider: true, label: "" },
            {
              label: "Sign Out",
              icon: <LogOut className="h-3.5 w-3.5" />,
              danger: true,
              onClick: () => {
                logout();
                if (typeof window !== "undefined") {
                  window.location.href = "/login";
                }
              },
            },
          ]}
        />
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </header>
  );
}
