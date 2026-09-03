import { create } from "zustand";

export type NotificationCategory =
  | "SURVEY"
  | "ULPIN"
  | "PROPERTY"
  | "AI_ALERT"
  | "ADMIN_SLA";

export interface GlobalNotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  targetHref: string;
  priority: "CRITICAL" | "HIGH" | "NORMAL";
}

interface NotificationState {
  notifications: GlobalNotificationItem[];
  filterCategory: NotificationCategory | "ALL";
  unreadCount: number;

  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  setFilterCategory: (category: NotificationCategory | "ALL") => void;
  addNotification: (notification: Omit<GlobalNotificationItem, "id" | "isRead" | "isArchived">) => void;
}

const SAMPLE_NOTIFICATIONS: GlobalNotificationItem[] = [
  {
    id: "notif-01",
    category: "AI_ALERT",
    title: "Airspace Road Setback Encroachment (3.2m)",
    message: "Critical violation detected on Versova DP road widening corridor (CTS-144/A).",
    timestamp: "10m ago",
    isRead: false,
    isArchived: false,
    targetHref: "/ai",
    priority: "CRITICAL",
  },
  {
    id: "notif-02",
    category: "ADMIN_SLA",
    title: "High Court Easement Case Escalated to Collector",
    message: "Statutory 14-day RTSA deadline breached for CASE-2024-MH-DSP-0082.",
    timestamp: "25m ago",
    isRead: false,
    isArchived: false,
    targetHref: "/admin",
    priority: "HIGH",
  },
  {
    id: "notif-03",
    category: "ULPIN",
    title: "3D Bhu-Aadhaar Key Generated",
    message: "Deterministic strata identity 27518001004201-B01-TA-F05-U502 sealed.",
    timestamp: "1h ago",
    isRead: false,
    isArchived: false,
    targetHref: "/ulpin",
    priority: "NORMAL",
  },
  {
    id: "notif-04",
    category: "SURVEY",
    title: "Field Demarcation Mission SM-2024-MH-401 QA Approved",
    message: "Horizontal accuracy 1.4 cm verified by District QA Officer.",
    timestamp: "2h ago",
    isRead: true,
    isArchived: false,
    targetHref: "/survey",
    priority: "NORMAL",
  },
  {
    id: "notif-05",
    category: "PROPERTY",
    title: "Form 6 Ferfar Mutation Recorded",
    message: "Title transfer approved for Palm Heights Tower A, Unit 502.",
    timestamp: "4h ago",
    isRead: true,
    isArchived: false,
    targetHref: "/properties",
    priority: "NORMAL",
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: SAMPLE_NOTIFICATIONS,
  filterCategory: "ALL",
  unreadCount: SAMPLE_NOTIFICATIONS.filter((n) => !n.isRead && !n.isArchived).length,

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead && !n.isArchived).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, isRead: true }));
      return {
        notifications: updated,
        unreadCount: 0,
      };
    });
  },

  archiveNotification: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isArchived: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead && !n.isArchived).length,
      };
    });
  },

  setFilterCategory: (filterCategory) => set({ filterCategory }),

  addNotification: (notification) => {
    const newItem: GlobalNotificationItem = {
      ...notification,
      id: `notif-${Date.now()}`,
      isRead: false,
      isArchived: false,
    };
    set((state) => {
      const updated = [newItem, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead && !n.isArchived).length,
      };
    });
  },
}));
