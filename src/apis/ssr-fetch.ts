import { headers } from "next/headers";
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
};

/**
 * SSR-safe fetch wrapper for Next.js Server Components / page.tsx files.
 *
 * Usage:
 *   const json = await makeApiCallSSR("/products", { page: "1", per_page: "20" });
 *   const json = await makeApiCallSSR("/products", params, { revalidate: 300 });
 *   const json = await makeApiCallSSR<MyType>("/products");
 *
 * - Prepends API_BASE automatically (pass a full URL to skip).
 * - Filters out undefined / null / empty-string params.
 * - Returns parsed JSON on success, null on any error.
 */
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

    let userIp: string | undefined;
    try {
      const reqHeaders = await headers();
      const forwarded  = reqHeaders.get("x-forwarded-for");
      userIp = forwarded?.split(",")[0]?.trim() ?? undefined;
    } catch {}
    const countryCode = await getCountryCodeSSR(userIp);
    qs.set("force_country", countryCode);

    const base = path.startsWith("http") ? path : `${API_BASE}${path}`;
    const url  = qs.toString() ? `${base}?${qs.toString()}` : base;

    const method = options?.method ?? (options?.body ? "POST" : "GET");
    const res = await fetch(url, {
      method,
      next: {
        revalidate: options?.revalidate ?? 60,
        ...(options?.tags?.length ? { tags: options.tags } : {}),
      },
      headers: {
        "Content-Type": "application/json",
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
