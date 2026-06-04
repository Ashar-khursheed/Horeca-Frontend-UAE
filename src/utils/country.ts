// const GEO_API = "https://pim.thehorecastore.co/api/frontend/location";
// const FALLBACK = "IN";
// const COOKIE_NAME = "hc_cc";

// interface GeoResponse {
//   status: string;
//   countryCode: string;
// }

// // SSR: reads country from cookie set by client (most reliable)
// // Falls back to location API with user IP if cookie not present
// export async function getCountryCodeSSR(userIp?: string, cookieValue?: string): Promise<string> {
//   // Cookie set by the browser on previous visit — most accurate
//   if (cookieValue) {
//     console.log("[Location] from cookie:", cookieValue);
//     return cookieValue;
//   }
//   try {
//     const reqHeaders: Record<string, string> = {};
//     if (userIp) reqHeaders["X-Forwarded-For"] = userIp;
//     const res  = await fetch(GEO_API, { cache: "no-store", headers: reqHeaders });
//     const data: GeoResponse = await res.json();
//     console.log("[Location] from API | userIp:", userIp, "| countryCode:", data.countryCode);
//     if (data.status === "success" && data.countryCode) return data.countryCode;
//   } catch {}
//   console.log("[Location] fallback to:", FALLBACK);
//   return FALLBACK;
// }

// const CC_KEY      = "hc_country_code";
// const CC_TIME_KEY = "hc_country_code_time";
// const CC_TTL      = 60 * 60 * 1000; // 1 hour

// // Client: detects from browser (correct user IP), caches in localStorage + cookie
// export async function getCountryCodeClient(): Promise<string> {
//   try {
//     const cached     = localStorage.getItem(CC_KEY);
//     const cachedTime = localStorage.getItem(CC_TIME_KEY);
//     if (cached && cachedTime && Date.now() - Number(cachedTime) < CC_TTL) {
//       return cached;
//     }
//     const res  = await fetch(GEO_API);
//     const data: GeoResponse = await res.json();
//     if (data.status === "success" && data.countryCode) {
//       const code = data.countryCode;
//       localStorage.setItem(CC_KEY,      code);
//       localStorage.setItem(CC_TIME_KEY, Date.now().toString());
//       // Also set cookie so SSR can read it on next request
//       document.cookie = `${COOKIE_NAME}=${code}; path=/; max-age=3600; SameSite=Lax`;
//       return code;
//     }
//   } catch {}
//   return FALLBACK;
// }


const GEO_API = "https://pim.thehorecastore.co/api/frontend/location";
const FALLBACK = "AE"; // HorecaStore default

const CC_COOKIE_KEY = "hc_country_code";
const CC_LS_KEY     = "hc_country_code";
const CC_TIME_KEY   = "hc_country_code_time";
const CC_TTL        = 60 * 60 * 1000; // 1 hour

interface GeoResponse {
  status:      string;
  countryCode: string;
}

// ─── Cookie helpers (client-side only) ───────────────────────────────────────

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, minutes: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

// ─── SSR: cookie se padho, fallback IP-based ─────────────────────────────────

/**
 * SSR ke andar use karo.
 *
 * @param userIp      - User ka real IP (x-forwarded-for se)
 * @param cookieCountry - Already parsed cookie value (ssr-fetch.ts se pass karo)
 *
 * Priority:
 *   1. cookieCountry param (caller ne already cookie padh li)
 *   2. next/headers cookies → "hc_country_code"
 *   3. User IP se GEO API call
 *   4. FALLBACK ("AE")
 */
export async function getCountryCodeSSR(
  userIp?: string,
  cookieCountry?: string,
): Promise<string> {
  // 1️⃣ Caller ne cookie value pass ki hai
  if (cookieCountry) {
    console.log("[Location SSR] from passed cookie:", cookieCountry);
    return cookieCountry;
  }

  // 2️⃣ next/headers se cookies khud padho
  try {
    const { cookies } = await import("next/headers");
    const cookieStore  = await cookies();
    const fromCookie   = cookieStore.get(CC_COOKIE_KEY)?.value;
    if (fromCookie) {
      console.log("[Location SSR] from next/headers cookie:", fromCookie);
      return fromCookie;
    }
  } catch {
    // cookies() not available in this context — skip
  }

  // 3️⃣ IP-based GEO API (user IP forward karo)
  try {
    const reqHeaders: Record<string, string> = {};
    if (userIp) reqHeaders["X-Forwarded-For"] = userIp;

    const res  = await fetch(GEO_API, { cache: "no-store", headers: reqHeaders });
    const data: GeoResponse = await res.json();
    console.log("[Location SSR] userIp:", userIp, "| detected:", data.countryCode);
    if (data.status === "success" && data.countryCode) return data.countryCode;
  } catch {
    // GEO API fail — fallback
  }

  return FALLBACK;
}

// ─── Client: localStorage + cookie mein cache karo ──────────────────────────

/**
 * Client-side use karo (useEffect / client component).
 * Priority:
 *   1. Cookie  → instant, SSR-compatible
 *   2. localStorage cache (1 hour TTL)
 *   3. GEO API call → save to both cookie + localStorage
 *   4. FALLBACK ("AE")
 */
export async function getCountryCodeClient(): Promise<string> {
  try {
    // 1️⃣ Cookie check
    const fromCookie = getCookie(CC_COOKIE_KEY);
    if (fromCookie) {
      console.log("[Location Client] from cookie:", fromCookie);
      return fromCookie;
    }

    // 2️⃣ localStorage cache check
    const cached     = localStorage.getItem(CC_LS_KEY);
    const cachedTime = localStorage.getItem(CC_TIME_KEY);
    if (cached && cachedTime && Date.now() - Number(cachedTime) < CC_TTL) {
      console.log("[Location Client] from localStorage:", cached);
      setCookie(CC_COOKIE_KEY, cached, 60);
      return cached;
    }

    // 3️⃣ Fresh GEO API call
    const res  = await fetch(GEO_API);
    const data: GeoResponse = await res.json();
    if (data.status === "success" && data.countryCode) {
      const cc = data.countryCode;
      localStorage.setItem(CC_LS_KEY,   cc);
      localStorage.setItem(CC_TIME_KEY, Date.now().toString());
      setCookie(CC_COOKIE_KEY, cc, 60);
      console.log("[Location Client] from API:", cc);
      return cc;
    }
  } catch {
    // Silent fail
  }

  return FALLBACK;
}