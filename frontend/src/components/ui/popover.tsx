"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import { motion, AnimatePresence } from "framer-motion";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "left" | "right" | "center";
  className?: string;
}

export function Popover({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  align = "right",
  className,
}: PopoverProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !isOpen;
    if (!isControlled) setUncontrolledIsOpen(next);
    onOpenChange?.(next);
  };

  const close = () => {
    if (!isControlled) setUncontrolledIsOpen(false);
    onOpenChange?.(false);
  };

  useClickOutside(containerRef, close);

  const alignClasses = {
    left: "left-0 origin-top-left",
    right: "right-0 origin-top-right",
    center: "left-1/2 -translate-x-1/2 origin-top",
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 4 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full z-50 mt-1 min-w-[200px] rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg",
              alignClasses[align],
              className
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
