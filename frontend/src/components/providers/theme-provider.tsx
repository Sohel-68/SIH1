"use client";

import React, { useEffect, useState } from "react";
import { useThemeStore, type ThemeMode } from "@/stores/use-theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem("geostrata_theme") as ThemeMode) || "system";
    setTheme(stored);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (useThemeStore.getState().theme === "system") {
        setTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [setTheme]);

  return <>{children}</>;
}
