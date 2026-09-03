import { create } from "zustand";

export type ToastType = "default" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID();
    const newToast: ToastItem = { ...toast, id, type: toast.type || "default" };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    const duration = toast.duration || 4000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);

    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearAll: () => set({ toasts: [] }),
}));

export function useToast() {
  const { addToast, removeToast, clearAll } = useToastStore();

  return {
    toast: addToast,
    dismiss: removeToast,
    clearAll,
    success: (title: string, description?: string) =>
      addToast({ title, description, type: "success" }),
    warning: (title: string, description?: string) =>
      addToast({ title, description, type: "warning" }),
    error: (title: string, description?: string) =>
      addToast({ title, description, type: "error" }),
  };
}
