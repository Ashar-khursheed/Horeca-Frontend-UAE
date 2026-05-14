import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://test-us.thehorecastore.co/api/frontend",
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

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  const clean = token.trim().replace(/^["']|["']$/g, "");
  localStorage.setItem("token", clean);
};

export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
};

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
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
