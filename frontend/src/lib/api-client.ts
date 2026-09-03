import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/use-auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CSRF / Secure Cookie support
});

// Refresh Token Queue management for concurrent 401s
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// -------------------------------------------------------------
// Request Interceptor: Attach JWT Token and Trace ID
// -------------------------------------------------------------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const isRemember = localStorage.getItem("geostrata_remember") === "true";
      const storage = isRemember ? localStorage : sessionStorage;
      const token = storage.getItem("geostrata_token");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers["X-Correlation-ID"] = crypto.randomUUID();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------------------------------------
// Response Interceptor: 401 Refresh Token Rotation Queue
// -------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and request has not already been retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // If the 401 came from the refresh endpoint itself, logout immediately
      if (originalRequest.url?.includes("/auth/refresh")) {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login?reason=session_expired";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until the ongoing refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const isRemember = localStorage.getItem("geostrata_remember") === "true";
        const storage = isRemember ? localStorage : sessionStorage;
        const refreshToken = storage.getItem("geostrata_refresh_token");

        if (!refreshToken) {
          throw new Error("No refresh token present in storage");
        }

        // Request rotated token pair from backend
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = refreshResponse.data.data.accessToken;
        const newRefreshToken = refreshResponse.data.data.refreshToken;

        // Update stored tokens
        storage.setItem("geostrata_token", newAccessToken);
        if (newRefreshToken) {
          storage.setItem("geostrata_refresh_token", newRefreshToken);
        }

        useAuthStore.getState().setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || refreshToken,
          tokenType: "Bearer",
          expiresIn: 3600,
        });

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        useAuthStore.getState().logout();
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login?reason=session_expired";
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
