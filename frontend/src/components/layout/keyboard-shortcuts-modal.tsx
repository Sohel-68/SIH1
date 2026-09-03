"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ["Ctrl", "K"], description: "Open Universal Command Palette & Search" },
    { keys: ["?"], description: "Open Keyboard Shortcuts Cheatsheet" },
    { keys: ["Esc"], description: "Dismiss Active Dialog or Drawer" },
    { keys: ["G", "D"], description: "Navigate to National Dashboard" },
    { keys: ["G", "M"], description: "Navigate to 2D GIS Cadastral Engine" },
    { keys: ["G", "3"], description: "Navigate to 3D Strata Digital Twin" },
    { keys: ["G", "P"], description: "Navigate to Property Title Registry" },
    { keys: ["G", "S"], description: "Navigate to Field Survey Operations" },
    { keys: ["G", "U"], description: "Navigate to ULPIN Bhu-Aadhaar Engine" },
    { keys: ["G", "A"], description: "Navigate to AI Computer Vision Platform" },
    { keys: ["G", "R"], description: "Navigate to E-Office Administration" },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="National Cadastre &bull; Keyboard Shortcuts"
      description="Accelerate your workflow with system-wide hotkeys and navigation shortcuts."
      footer={
        <Button variant="default" size="sm" onClick={onClose}>
          Got it
        </Button>
      }
    >
      <div className="space-y-3 pt-2 text-xs font-sans select-none">
        <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
          {shortcuts.map((sc, i) => (
            <div key={i} className="p-3 flex items-center justify-between hover:bg-muted/20">
              <span className="text-foreground font-medium">{sc.description}</span>
              <div className="flex items-center space-x-1">
                {sc.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 rounded border border-border bg-muted font-mono text-[11px] font-bold text-foreground shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
