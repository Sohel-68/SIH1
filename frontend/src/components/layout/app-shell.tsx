"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { Footer } from "@/components/layout/footer";
import { UserProfileDrawer } from "@/features/auth/components/user-profile-drawer";
import { SessionTimeoutDialog } from "@/features/auth/components/session-timeout-dialog";
import { ActiveSelectionBar } from "@/components/layout/active-selection-bar";
import { CommandPalette } from "@/components/layout/command-palette";
import { SIHDemoModal } from "@/components/layout/sih-demo-modal";
import { OfflineBanner } from "@/components/common/offline-banner";
import { useAuthStore } from "@/stores/use-auth-store";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { hydrateAuth } = useAuthStore();

  // Hydrate auth session on mount
  React.useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  // Auth pages render standalone without application shell
  const isAuthPage = pathname === "/login" || pathname === "/forgot-password";
  const isFullScreenApp = pathname === "/gis" || pathname.startsWith("/viewer-3d");

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-background">
        {children}
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background">
      {/* 1. Desktop & Tablet Responsive Fixed Sidebar */}
      <Sidebar />

      {/* 2. Slide-out Mobile Navigation Drawer */}
      <MobileDrawer />

      {/* 3. Main Viewport Surface */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Offline Connectivity Alert Banner */}
        <OfflineBanner />

        {/* Scrollable Page Body OR Edge-to-Edge Fullscreen Workspace */}
        {isFullScreenApp ? (
          <main className="flex-1 overflow-hidden relative flex flex-col">
            {children}
          </main>
        ) : (
          <>
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl space-y-6">
                {children}
              </div>
            </main>
            <Footer />
          </>
        )}
      </div>

      {/* 4. Global Integrated HUDs, Modals, & Event Observers */}
      <ActiveSelectionBar />
      <CommandPalette />
      <SIHDemoModal />
      <UserProfileDrawer />
      <SessionTimeoutDialog />
    </div>
  );
}
