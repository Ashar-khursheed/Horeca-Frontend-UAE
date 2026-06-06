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

    // console.log("[SSR API]", url);
    // console.log("[SSR API] force_country:", countryCode);

    // Auth token from cookie (only when withAuth: true)
    let authHeader: Record<string, string> = {};
    if (options?.withAuth) {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        authHeader = { Authorization: `Bearer ${token}` };
      }
    }

    const method = options?.method ?? (options?.body ? "POST" : "GET");
    const res = await fetch(url, {
      method,
      next: {
        revalidate: options?.revalidate ?? 60,
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

    return (await res.json()) as T;
  } catch {
    return null;
  }
}
