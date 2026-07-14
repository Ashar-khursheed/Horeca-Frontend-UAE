// import { headers, cookies } from "next/headers";
// import { getCountryCodeSSR } from "@/utils/country";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE_URL ??
//   "https://test-us.thehorecastore.co/api";

// type Params  = Record<string, string | number | boolean | undefined | null>;
// type Options = {
//   revalidate?: number | false;
//   tags?: string[];
//   headers?: Record<string, string>;
//   method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   body?: Record<string, any>;
//   withAuth?: boolean;
//   /**
//    * Pass the country code from the caller (read once per page/layout).
//    * When provided, makeApiCallSSR does NOT read headers() or cookies() —
//    * the function stays outside the dynamic-render boundary and its fetch
//    * responses are ISR-cacheable.
//    *
//    * When omitted, falls back to reading x-country-code / hc_cc at the
//    * cost of opting the call into dynamic rendering (legacy behaviour).
//    */
//   countryCode?: string;
//   /**
//    * Pass the auth Bearer token from the caller (read once per page).
//    * When provided together with withAuth: true, no extra cookies() read occurs.
//    */
//   authToken?: string;
// };

// export async function makeApiCallSSR<T = unknown>(
//   path: string,
//   params?: Params,
//   options?: Options,
// ): Promise<T | null> {
//   try {
//     const qs = new URLSearchParams();

//     if (params) {
//       for (const [k, v] of Object.entries(params)) {
//         if (v !== undefined && v !== null && v !== "") {
//           qs.set(k, String(v));
//         }
//       }
//     }

//     // ── Country resolution ─────────────────────────────────────────────────────
//     // Prefer explicitly passed countryCode (caller read it once — no extra
//     // dynamic API call here). Fall back to reading headers/cookies only when
//     // the caller did not supply one (legacy path, makes the call dynamic).
//     let countryCode = options?.countryCode;
//     if (countryCode === undefined) {
//       try {
//         const reqHeaders = await headers();
//         countryCode =
//           reqHeaders.get("x-country-code") ??
//           (await cookies()).get("hc_cc")?.value ??
//           (await getCountryCodeSSR(
//             reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim(),
//           ));
//       } catch {}
//     }
//     if (countryCode) qs.set("force_country", countryCode);

//     const base = path.startsWith("http") ? path : `${API_BASE}${path}`;
//     const url  = qs.toString() ? `${base}?${qs.toString()}` : base;

//     // ── Auth header ────────────────────────────────────────────────────────────
//     // Use provided authToken when available to skip an extra cookies() read.
//     let authHeader: Record<string, string> = {};
//     if (options?.withAuth) {
//       const token =
//         options.authToken ?? (await cookies()).get("token")?.value;
//       if (token) authHeader = { Authorization: `Bearer ${token}` };
//     }

//     const method = options?.method ?? (options?.body ? "POST" : "GET");
//     const res = await fetch(url, {
//       method,
//       next: {
//         revalidate: options?.revalidate ?? 60,
//         ...(options?.tags?.length ? { tags: options.tags } : {}),
//       },
//       headers: {
//         "Content-Type": "application/json",
//         ...authHeader,
//         ...(options?.headers ?? {}),
//       },
//       ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
//     });
//     console.log("SSR FETCH =>", url);

//     if (!res.ok) throw new Error(`HTTP ${res.status}`);

//     return (await res.json()) as T;
//   } catch {
//     return null;
//   }
// }





import { headers, cookies } from "next/headers";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://test-us.thehorecastore.co/api";

type Params = Record<string, string | number | boolean | undefined | null>;

type Options = {
  revalidate?: number | false;
  tags?: string[];
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, any>;
  withAuth?: boolean;
  countryCode?: string;
  authToken?: string;
};

export async function makeApiCallSSR<T = unknown>(
  path: string,
  params?: Params,
  options?: Options,
): Promise<T | null> {
  try {
    
//     console.log(`
// ==========================================
// API PATH : ${path}
// PARAMS   : ${JSON.stringify(params)}
// STACK:
// ${new Error().stack?.split("\n").slice(2, 8).join("\n")}
// ==========================================
// `);
    const qs = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          qs.set(k, String(v));
        }
      });
    }

    // Read headers/cookies only once (only if required)
    let reqHeaders: Awaited<ReturnType<typeof headers>> | null = null;
    let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;

    if (!options?.countryCode || (options.withAuth && !options.authToken)) {
      [reqHeaders, cookieStore] = await Promise.all([
        headers(),
        cookies(),
      ]);
    }

    const countryCode =
      options?.countryCode ??
      reqHeaders?.get("x-country-code") ??
      cookieStore?.get("hc_cc")?.value ??
      "US";

    qs.set("force_country", countryCode);

    const base = path.startsWith("http")
      ? path
      : `${API_BASE}${path}`;

    const url = qs.toString() ? `${base}?${qs}` : base;

    let authHeader: Record<string, string> = {};

    if (options?.withAuth) {
      const token =
        options.authToken ??
        cookieStore?.get("token")?.value;

      if (token) {
        authHeader.Authorization = `Bearer ${token}`;
      }
    }

    const method =
      options?.method ?? (options?.body ? "POST" : "GET");

    const response = await fetch(url, {
      method,
      
      next: {
        revalidate: options?.revalidate ?? 60,
        ...(options?.tags?.length && { tags: options.tags }),
      },
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...(options?.headers ?? {}),
      },
      ...(options?.body && {
        body: JSON.stringify(options.body),
      }),
      
    });

    // console.log("SSR FETCH =>", url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (err) {
    console.error(err);
    return null;
  }
}