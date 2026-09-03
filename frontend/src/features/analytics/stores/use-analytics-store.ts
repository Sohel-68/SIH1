import { create } from "zustand";
import type { JurisdictionScope } from "../types/analytics-types";

interface AnalyticsState {
  jurisdictionScope: JurisdictionScope;
  isSearchModalOpen: boolean;
  isReportModalOpen: boolean;
  searchQuery: string;
  activeTab: string;

  setJurisdictionScope: (scope: JurisdictionScope) => void;
  setSearchModalOpen: (open: boolean) => void;
  setReportModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  jurisdictionScope: "NATIONAL",
  isSearchModalOpen: false,
  isReportModalOpen: false,
  searchQuery: "",
  activeTab: "command-center",

  setJurisdictionScope: (jurisdictionScope) => set({ jurisdictionScope }),
  setSearchModalOpen: (isSearchModalOpen) => set({ isSearchModalOpen }),
  setReportModalOpen: (isReportModalOpen) => set({ isReportModalOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
