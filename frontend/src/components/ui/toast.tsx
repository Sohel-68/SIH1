"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useToastStore, type ToastItem } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type?: ToastItem["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-gov-success shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-gov-warning shrink-0" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-gov-danger shrink-0" />;
      default:
        return <Info className="h-5 w-5 text-gov-primary shrink-0" />;
    }
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className={cn(
              "pointer-events-auto flex items-start space-x-3 rounded-lg border border-border/80 bg-card p-4 shadow-xl text-card-foreground",
              toast.type === "error" && "border-gov-danger/40 bg-gov-danger/5",
              toast.type === "success" && "border-gov-success/40 bg-gov-success/5",
              toast.type === "warning" && "border-gov-warning/40 bg-gov-warning/5"
            )}
            role="alert"
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0 pt-0.5">
              <h5 className="text-xs font-bold leading-none text-foreground">
                {toast.title}
              </h5>
              {toast.description && (
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
