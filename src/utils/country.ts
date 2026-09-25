import { getAuthCookieDomain } from "@/utils/canonical-origin";
import { getLocationData, setLocationData, type LocationData } from "@/utils/locationStorage";

const GEO_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}frontend/location`;
const FALLBACK = "IN";
const COOKIE_NAME = "hc_cc";
const MANUAL_COOKIE = "hc_cc_manual";
const MANUAL_KEY = "hc_country_manual";

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

export function readCountryCookie(): string | null {
  if (typeof window === "undefined") return null;
  const raw = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1]
    ?.trim();
  return raw || null;
}

export function isManualCountry(): boolean {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem(MANUAL_KEY) === "1" ||
    document.cookie.split(";").some((c) => c.trim() === `${MANUAL_COOKIE}=1`)
  );
}

function writeCookie(name: string, value: string, maxAge: number) {
  const parent = getAuthCookieDomain(window.location.hostname);
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${
    parent ? `; Domain=${parent}` : ""
  }`;
}

function writeCountryCookie(code: string, maxAge = 3600) {
  writeCookie(COOKIE_NAME, code, maxAge);
}

export function persistSelectedCountry(name: string, code: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CC_KEY, code);
  localStorage.setItem(CC_TIME_KEY, Date.now().toString());
  localStorage.setItem(MANUAL_KEY, "1");
  writeCountryCookie(code, 60 * 60 * 24 * 365);
  writeCookie(MANUAL_COOKIE, "1", 60 * 60 * 24 * 365);

  const prev = getLocationData();
  const sameCountry = prev?.country?.toLowerCase() === name.toLowerCase();
  const next: LocationData = {
    status: prev?.status ?? "success",
    country: name,
    countryCode: code,
    region: sameCountry ? (prev?.region ?? "") : "",
    regionName: sameCountry ? (prev?.regionName ?? "") : "",
    city: sameCountry ? (prev?.city ?? "") : "",
    zip: sameCountry ? (prev?.zip ?? "") : "",
    lat: prev?.lat ?? 0,
    lon: prev?.lon ?? 0,
    timezone: prev?.timezone ?? "",
    isp: prev?.isp ?? "",
    org: prev?.org ?? "",
    as: prev?.as ?? "",
    query: prev?.query ?? "",
  };
  setLocationData(next);
}

// Client: detects from browser (correct user IP), caches in localStorage + cookie
export async function getCountryCodeClient(): Promise<string> {
  try {
    const cached     = localStorage.getItem(CC_KEY);
    const cachedTime = localStorage.getItem(CC_TIME_KEY);
    const isValid    = cached && cachedTime && (Date.now() - Number(cachedTime) < CC_TTL);
    const cookieCode = readCountryCookie();

    if (isManualCountry() && cached) {
      return cached;
    }

    if (isValid && cached) {
      return cached;
    }

    // First visit: use the IP country cookie set by middleware
    if (cookieCode) {
      if (!isFetchingLocation && !isManualCountry()) {
        isFetchingLocation = true;
        fetch(GEO_API)
          .then((res) => res.json())
          .then((data: GeoResponse) => {
            if (isManualCountry()) return;
            if (data.status === "success" && data.countryCode) {
              localStorage.setItem(CC_KEY, data.countryCode);
              localStorage.setItem(CC_TIME_KEY, Date.now().toString());
            }
          })
          .catch(() => {})
          .finally(() => {
            isFetchingLocation = false;
          });
      }
      return cookieCode;
    }

    // Cache is expired or missing. Fetch in the background and do not await it.
    if (!isFetchingLocation && !isManualCountry()) {
      isFetchingLocation = true;
      fetch(GEO_API)
        .then((res) => res.json())
        .then((data: GeoResponse) => {
          if (isManualCountry()) return;
          if (data.status === "success" && data.countryCode) {
            const code = data.countryCode;
            localStorage.setItem(CC_KEY, code);
            localStorage.setItem(CC_TIME_KEY, Date.now().toString());
            writeCountryCookie(code);
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
