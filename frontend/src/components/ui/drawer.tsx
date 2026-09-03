"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: "left" | "right";
  width?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const widthClasses = {
  sm: "max-w-xs",
  md: "max-w-sm",
  lg: "max-w-md",
  xl: "max-w-xl",
};

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = "right",
  width = "md",
  className,
}: DrawerProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const slideVariants = {
    closed: {
      x: position === "right" ? "100%" : "-100%",
      transition: { duration: 0.22, ease: "easeInOut" },
    },
    open: {
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div
            className={cn(
              "fixed inset-y-0 flex max-w-full",
              position === "right" ? "right-0 pl-10" : "left-0 pr-10"
            )}
          >
            <motion.div
              variants={slideVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={cn(
                "relative w-screen bg-card border-border shadow-2xl flex flex-col h-full",
                position === "right" ? "border-l" : "border-r",
                widthClasses[width],
                className
              )}
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/70">
                <div>
                  {title && (
                    <h3 className="text-base font-semibold text-foreground">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Close drawer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 text-sm text-foreground">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="p-4 border-t border-border/70 bg-muted/20 flex items-center justify-end space-x-3">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
