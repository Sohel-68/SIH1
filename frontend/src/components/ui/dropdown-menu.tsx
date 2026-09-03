"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import { motion, AnimatePresence } from "framer-motion";

export interface DropdownMenuItem {
  id?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  divider?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  className?: string;
  header?: React.ReactNode;
}

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  className,
  header,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 4 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute top-full z-50 mt-1 min-w-[190px] rounded-md border border-border bg-popover p-1 shadow-lg ring-1 ring-black/5 focus:outline-none",
              align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
              className
            )}
            role="menu"
          >
            {header && (
              <div className="px-3 py-2 border-b border-border/70 mb-1">
                {header}
              </div>
            )}
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="my-1 h-px bg-border/70" />;
              }

              return (
                <button
                  key={index}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded transition-colors text-left select-none",
                    item.disabled
                      ? "opacity-50 cursor-not-allowed text-muted-foreground"
                      : item.danger
                      ? "text-gov-danger hover:bg-gov-danger/10 hover:text-gov-danger"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  role="menuitem"
                >
                  <div className="flex items-center space-x-2">
                    {item.icon && <span className="h-4 w-4 shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
