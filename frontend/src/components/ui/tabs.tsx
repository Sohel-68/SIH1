"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: "underline" | "pills" | "enclosed";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "underline",
  className,
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center space-x-1",
        variant === "underline" && "border-b border-border/80",
        variant === "pills" && "bg-muted/50 p-1 rounded-lg border border-border/50",
        variant === "enclosed" && "border-b border-border space-x-2",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md select-none",
              tab.disabled && "opacity-40 cursor-not-allowed",
              variant === "underline" && [
                "rounded-none pb-2.5 -mb-px hover:text-foreground",
                isActive ? "text-gov-primary font-bold" : "text-muted-foreground",
              ],
              variant === "pills" && [
                "rounded-md",
                isActive ? "text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground",
              ],
              variant === "enclosed" && [
                "border border-transparent rounded-t-md",
                isActive
                  ? "border-border border-b-background bg-background text-foreground font-bold -mb-px"
                  : "text-muted-foreground hover:text-foreground",
              ]
            )}
          >
            {/* Animated Active Pill / Underline Indicator */}
            {isActive && variant === "underline" && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gov-primary"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            {isActive && variant === "pills" && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-md bg-gov-primary shadow-sm"
                style={{ zIndex: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}

            <span className="relative z-10 flex items-center space-x-2">
              {tab.icon && <span className="h-4 w-4 shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span>{tab.badge}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
