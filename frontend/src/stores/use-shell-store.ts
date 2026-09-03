import { create } from "zustand";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ShellState {
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  isNotificationPanelOpen: boolean;
  activeRoute: string;
  breadcrumbs: BreadcrumbItem[];

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileDrawer: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  toggleSearchModal: () => void;
  setSearchModalOpen: (open: boolean) => void;
  toggleNotificationPanel: () => void;
  setNotificationPanelOpen: (open: boolean) => void;
  setActiveRoute: (route: string) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

export const useShellStore = create<ShellState>((set) => ({
  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,
  isSearchModalOpen: false,
  isNotificationPanelOpen: false,
  activeRoute: "/",
  breadcrumbs: [{ label: "Home", href: "/" }],

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),

  toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  setMobileDrawerOpen: (isMobileDrawerOpen) => set({ isMobileDrawerOpen }),

  toggleSearchModal: () => set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),
  setSearchModalOpen: (isSearchModalOpen) => set({ isSearchModalOpen }),

  toggleNotificationPanel: () =>
    set((state) => ({ isNotificationPanelOpen: !state.isNotificationPanelOpen })),
  setNotificationPanelOpen: (isNotificationPanelOpen) => set({ isNotificationPanelOpen }),

  setActiveRoute: (activeRoute) => set({ activeRoute }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));
