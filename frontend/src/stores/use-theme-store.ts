import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "system",
  resolvedTheme: "light",
  setTheme: (theme) => {
    const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
    if (typeof window !== "undefined") {
      localStorage.setItem("geostrata_theme", theme);
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
    }
    set({ theme, resolvedTheme });
  },
  toggleTheme: () => {
    const current = get().resolvedTheme;
    const next = current === "light" ? "dark" : "light";
    get().setTheme(next);
  },
}));
