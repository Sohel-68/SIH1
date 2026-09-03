export interface QueuedMutation {
  id: string;
  endpoint: string;
  payload: unknown;
  timestamp: number;
  retryAttempts: number;
}

/**
 * Feature Module: Offline Synchronization
 * Handles local IndexedDB mutation queueing, automatic background retry, and conflict alerts.
 */
export const OFFLINE_SYNC_MODULE_TAG = "offline-sync";
