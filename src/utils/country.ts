const GEO_API = "https://pim.thehorecastore.co/api/frontend/location";
const FALLBACK = "IN";

interface GeoResponse {
  status: string;
  countryCode: string;
}

// SSR: pass real user IP via X-Forwarded-For so API detects user's country, not server's
export async function getCountryCodeSSR(userIp?: string): Promise<string> {
  try {
    const reqHeaders: Record<string, string> = {};
    if (userIp) reqHeaders["X-Forwarded-For"] = userIp;

    const res  = await fetch(GEO_API, { cache: "no-store", headers: reqHeaders });
    const data: GeoResponse = await res.json();
    console.log("[Location API] userIp:", userIp, "| detected countryCode:", data.countryCode);
    if (data.status === "success" && data.countryCode) return data.countryCode;
  } catch {}
  return FALLBACK;
}

const CC_KEY      = "hc_country_code";
const CC_TIME_KEY = "hc_country_code_time";
const CC_TTL      = 60 * 60 * 1000; // 1 hour

// Client: caches in localStorage for 1 hour
export async function getCountryCodeClient(): Promise<string> {
  try {
    const cached     = localStorage.getItem(CC_KEY);
    const cachedTime = localStorage.getItem(CC_TIME_KEY);
    if (cached && cachedTime && Date.now() - Number(cachedTime) < CC_TTL) {
      return cached;
    }
    const res  = await fetch(GEO_API);
    const data: GeoResponse = await res.json();
    if (data.status === "success" && data.countryCode) {
      localStorage.setItem(CC_KEY,      data.countryCode);
      localStorage.setItem(CC_TIME_KEY, Date.now().toString());
      return data.countryCode;
    }
  } catch {}
  return FALLBACK;
}
