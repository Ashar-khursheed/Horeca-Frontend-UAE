import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCountryCodeClient } from "@/utils/country";

const axiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://test-us.thehorecastore.co/api/",
    baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Token Helpers ────────────────────────────────────────────────────────────

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return token.trim().replace(/^["']|["']$/g, "");
  } catch {
    return null;
  }
};

// const AUTH_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds
const AUTH_MAX_AGE = 259200; // 72 hours
const AUTH_MAX_MS = AUTH_MAX_AGE * 1000;

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  const clean = token.trim().replace(/^["']|["']$/g, "");
  const loginTime = Date.now().toString();
  localStorage.setItem("token", clean);
  localStorage.setItem("login_time", loginTime);
  document.cookie = `token=${clean}; path=/; SameSite=Lax; max-age=${AUTH_MAX_AGE}`;
  document.cookie = `login_time=${loginTime}; path=/; SameSite=Lax; max-age=${AUTH_MAX_AGE}`;
};

export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("login_time");
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "login_time=; path=/; max-age=0; SameSite=Lax";
};

export { AUTH_MAX_MS };

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const countryCode = await getCountryCodeClient();
    config.params = { ...config.params, force_country: countryCode };
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthEndpoint) {
      removeAuthToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Generic Request ──────────────────────────────────────────────────────────

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const makeApiRequest = async <T = unknown>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { method = "GET", data, params, headers: customHeaders = {} } = options;

  const isFormData = data instanceof FormData;

  const response = await axiosInstance({
    url,
    method,
    params,
    ...(data !== undefined && { data }),
    headers: {
      ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
      ...customHeaders,
    },
  });

  return response.data;
};

export default axiosInstance;
