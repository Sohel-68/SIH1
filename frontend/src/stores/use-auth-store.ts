import { create } from "zustand";
import type { AuthUser, AuthTokens, SessionDetails, UserRole } from "@/features/auth/types";
import { DEMO_PERSONAS } from "@/features/auth/constants/rbac";

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  lastActivity: number;
  isProfileDrawerOpen: boolean;
  activeSessions: SessionDetails[];

  login: (user: AuthUser, tokens: AuthTokens, rememberMe?: boolean) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  switchRolePersona: (role: UserRole) => void;
  setProfileDrawerOpen: (open: boolean) => void;
  recordActivity: () => void;
  terminateSession: (sessionId: string) => void;
  hydrateAuth: () => void;
}

const DEFAULT_SESSIONS: SessionDetails[] = [
  {
    id: "sess-curr-01",
    ipAddress: "192.168.1.42 (NIC Gateway)",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0",
    browser: "Chrome 126",
    os: "Windows 11 Enterprise",
    deviceType: "Desktop",
    loginTime: "Today at 09:15 AM",
    lastActiveTime: "Active now",
    isCurrentSession: true,
  },
  {
    id: "sess-prev-02",
    ipAddress: "10.24.12.8 (Field Rover VPN)",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X)",
    browser: "Mobile Safari",
    os: "iPadOS 17.5",
    deviceType: "Tablet",
    loginTime: "Yesterday at 03:40 PM",
    lastActiveTime: "18h ago",
    isCurrentSession: false,
  },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  // Default to Super Admin persona for instant developer/evaluator exploration
  user: DEMO_PERSONAS.SUPER_ADMIN,
  tokens: {
    accessToken: "geostrata_access_token_demo_payload",
    refreshToken: "geostrata_refresh_token_demo_payload",
    tokenType: "Bearer",
    expiresIn: 3600,
  },
  isAuthenticated: true,
  rememberMe: true,
  lastActivity: Date.now(),
  isProfileDrawerOpen: false,
  activeSessions: DEFAULT_SESSIONS,

  login: (user, tokens, rememberMe = true) => {
    if (typeof window !== "undefined") {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("geostrata_token", tokens.accessToken);
      storage.setItem("geostrata_refresh_token", tokens.refreshToken);
      storage.setItem("geostrata_user", JSON.stringify(user));
      storage.setItem("geostrata_remember", rememberMe ? "true" : "false");
    }

    set({
      user,
      tokens,
      isAuthenticated: true,
      rememberMe,
      lastActivity: Date.now(),
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("geostrata_token");
      localStorage.removeItem("geostrata_refresh_token");
      localStorage.removeItem("geostrata_user");
      localStorage.removeItem("geostrata_remember");
      sessionStorage.removeItem("geostrata_token");
      sessionStorage.removeItem("geostrata_refresh_token");
      sessionStorage.removeItem("geostrata_user");
    }

    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isProfileDrawerOpen: false,
    });
  },

  setTokens: (tokens) => {
    if (typeof window !== "undefined") {
      const isRemember = get().rememberMe;
      const storage = isRemember ? localStorage : sessionStorage;
      storage.setItem("geostrata_token", tokens.accessToken);
      storage.setItem("geostrata_refresh_token", tokens.refreshToken);
    }
    set({ tokens });
  },

  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updates };
      if (typeof window !== "undefined") {
        const storage = state.rememberMe ? localStorage : sessionStorage;
        storage.setItem("geostrata_user", JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  switchRolePersona: (role) => {
    const persona = DEMO_PERSONAS[role];
    if (persona) {
      get().login(
        persona,
        {
          accessToken: `geostrata_token_${role.toLowerCase()}`,
          refreshToken: `geostrata_refresh_${role.toLowerCase()}`,
          tokenType: "Bearer",
          expiresIn: 3600,
        },
        get().rememberMe
      );
    }
  },

  setProfileDrawerOpen: (isProfileDrawerOpen) => set({ isProfileDrawerOpen }),

  recordActivity: () => set({ lastActivity: Date.now() }),

  terminateSession: (sessionId) => {
    set((state) => ({
      activeSessions: state.activeSessions.filter((s) => s.id !== sessionId),
    }));
  },

  hydrateAuth: () => {
    if (typeof window === "undefined") return;
    try {
      const isRemember = localStorage.getItem("geostrata_remember") === "true";
      const storage = isRemember ? localStorage : sessionStorage;
      const token = storage.getItem("geostrata_token");
      const refreshToken = storage.getItem("geostrata_refresh_token");
      const storedUser = storage.getItem("geostrata_user");

      if (token && storedUser) {
        set({
          tokens: {
            accessToken: token,
            refreshToken: refreshToken || "",
            tokenType: "Bearer",
            expiresIn: 3600,
          },
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          rememberMe: isRemember,
        });
      }
    } catch (e) {
      console.error("[GeoStrata Auth] Failed to hydrate auth session:", e);
    }
  },
}));
