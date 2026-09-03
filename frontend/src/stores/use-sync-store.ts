import { create } from "zustand";

interface SyncState {
  isOnline: boolean;
  pendingMutationCount: number;
  isSyncing: boolean;
  setIsOnline: (isOnline: boolean) => void;
  setPendingMutationCount: (count: number) => void;
  setIsSyncing: (isSyncing: boolean) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  pendingMutationCount: 0,
  isSyncing: false,
  setIsOnline: (isOnline) => set({ isOnline }),
  setPendingMutationCount: (pendingMutationCount) => set({ pendingMutationCount }),
  setIsSyncing: (isSyncing) => set({ isSyncing }),
}));
