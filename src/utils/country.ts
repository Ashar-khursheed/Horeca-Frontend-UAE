const GEO_API = "https://pim.thehorecastore.co/api/frontend/location";
const FALLBACK = "IN";

interface GeoResponse {
  status: string;
  countryCode: string;
}

// SSR: Next.js caches this fetch for 1 hour across requests
export async function getCountryCodeSSR(): Promise<string> {
  try {
    const res = await fetch(GEO_API, { next: { revalidate: 3600 } });
    const data: GeoResponse = await res.json();
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
