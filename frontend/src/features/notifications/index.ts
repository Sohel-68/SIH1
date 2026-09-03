export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  channel: "IN_APP" | "SMS" | "EMAIL" | "PUSH";
  status: "UNREAD" | "READ";
  createdAt: string;
}

/**
 * Feature Module: Notification Engine
 * Manages push notifications, in-app alerts, and SMS delivery tracking.
 */
export const NOTIFICATIONS_MODULE_TAG = "notifications";
