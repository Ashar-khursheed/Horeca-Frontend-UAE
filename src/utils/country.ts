const GEO_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}frontend/location`;
const FALLBACK = "IN";
const COOKIE_NAME = "hc_cc";

interface GeoResponse {
  status: string;
  countryCode: string;
}

// SSR: reads country from cookie set by client (most reliable)
// Falls back to location API with user IP if cookie not present
export async function getCountryCodeSSR(userIp?: string, cookieValue?: string): Promise<string> {
  // Cookie set by the browser on previous visit — most accurate
  if (cookieValue) return cookieValue;
  try {
    const reqHeaders: Record<string, string> = {};
    if (userIp) reqHeaders["X-Forwarded-For"] = userIp;
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 400);
    const res  = await fetch(GEO_API, { cache: "no-store", headers: reqHeaders, signal: controller.signal });
    clearTimeout(tid);
    const data: GeoResponse = await res.json();
    if (data.status === "success" && data.countryCode) return data.countryCode;
  } catch {}
  return FALLBACK;
}

const CC_KEY      = "hc_country_code";
const CC_TIME_KEY = "hc_country_code_time";
const CC_TTL      = 5 * 60 * 1000; // 5 minutes

let isFetchingLocation = false;

// Client: detects from browser (correct user IP), caches in localStorage + cookie
export async function getCountryCodeClient(): Promise<string> {
  try {
    const cached     = localStorage.getItem(CC_KEY);
    const cachedTime = localStorage.getItem(CC_TIME_KEY);
    const isValid    = cached && cachedTime && (Date.now() - Number(cachedTime) < CC_TTL);

    if (isValid && cached) {
      return cached;
    }

    // Cache is expired or missing. Fetch in the background and do not await it.
    if (!isFetchingLocation) {
      isFetchingLocation = true;
      fetch(GEO_API)
        .then((res) => res.json())
        .then((data: GeoResponse) => {
          if (data.status === "success" && data.countryCode) {
            const code = data.countryCode;
            localStorage.setItem(CC_KEY, code);
            localStorage.setItem(CC_TIME_KEY, Date.now().toString());
            document.cookie = `${COOKIE_NAME}=${code}; path=/; max-age=3600; SameSite=Lax`;
          }
        })
        .catch(() => {})
        .finally(() => {
          isFetchingLocation = false;
        });
    }

    // Return cached (even if expired) or fallback immediately to avoid blocking requests
    return cached || FALLBACK;
  } catch {
    return FALLBACK;
  }
}
