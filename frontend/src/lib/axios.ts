import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let the browser set Content-Type for FormData (includes boundary)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt token refresh when:
    // 1. We got a 401
    // 2. We haven't already retried
    // 3. The request wasn't itself a refresh-token or signin call
    // 4. The store thinks we are actually authenticated (has a token)
    const { token, isAuthenticated } = useAuthStore.getState();
    const isAuthRoute =
      originalRequest.url?.includes("/user/refresh-token") ||
      originalRequest.url?.includes("/user/signin") ||
      originalRequest.url?.includes("/user/profile");

    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute &&
      isAuthenticated &&
      token
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/user/refresh-token`,
          {},
          { withCredentials: true },
        );

        const { token: newToken, user } = refreshResponse.data;
        useAuthStore.getState().setAuthState(user, newToken);

        if (newToken) {
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch {
        // Refresh failed — user session is truly expired
        useAuthStore.getState().logout();
        if (!window.location.pathname.includes("/auth/")) {
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
