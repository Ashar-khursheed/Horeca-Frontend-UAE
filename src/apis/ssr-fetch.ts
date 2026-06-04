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

    const countryCode = await getCountryCodeSSR();
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
