import { headers, cookies } from "next/headers";
import { getCountryCodeSSR } from "@/utils/country";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://test-us.thehorecastore.co/api";

type Params  = Record<string, string | number | boolean | undefined | null>;
type Options = {
  revalidate?: number | false;
  tags?: string[];
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any>;
  withAuth?: boolean;
};

// Custom in-memory caching to bypass Next.js 2MB response cache size limits
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

export async function makeApiCallSSR<T = unknown>(
  path: string,
  params?: Params,
  options?: Options,
): Promise<T | null> {
  try {
    const qs = new URLSearchParams();

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "") {
          qs.set(k, String(v));
        }
      }
    }

    let countryCode = "IN";
    try {
      const reqHeaders = await headers();
      // x-country-code is injected by middleware (works on first visit too)
      countryCode = reqHeaders.get("x-country-code")
        ?? (await cookies()).get("hc_cc")?.value
        ?? await getCountryCodeSSR(
            reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim()
          );
    } catch {}
    qs.set("force_country", countryCode);

    const base = path.startsWith("http") ? path : `${API_BASE}${path}`;
    const url  = qs.toString() ? `${base}?${qs.toString()}` : base;

    const method = options?.method ?? (options?.body ? "POST" : "GET");
    const revalidateVal = options?.revalidate ?? 60;
    
    // Check custom cache if GET request and caching is enabled
    const isCacheable = method === "GET" && typeof revalidateVal === "number" && revalidateVal > 0;
    const cacheKey = `${url}::${options?.withAuth ? 'auth' : 'guest'}`;

    if (isCacheable) {
      const cached = memoryCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.value as T;
      }
    }

    // Auth token from cookie (only when withAuth: true)
    let authHeader: Record<string, string> = {};
    if (options?.withAuth) {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        authHeader = { Authorization: `Bearer ${token}` };
      }
    }

    const res = await fetch(url, {
      method,
      next: {
        revalidate: revalidateVal,
        ...(options?.tags?.length ? { tags: options.tags } : {}),
      },
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...(options?.headers ?? {}),
      },
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as T;

    if (isCacheable) {
      memoryCache.set(cacheKey, {
        value: data,
        expiresAt: Date.now() + revalidateVal * 1000,
      });
    }

    return data;
  } catch {
    return null;
  }
}

