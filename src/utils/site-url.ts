/**
 * Region of this build. This repository is the UAE storefront
 * (www.horecastore.ae).
 *
 * The configured site URL decides first: the www.horecastore.ae deployment is
 * built with NEXT_PUBLIC_REGION=US (verified on 2026-11-16: the live site
 * served the US homepage schema and US-priced Product schema after the first
 * SEO deploy), so the region variable alone cannot be trusted. Without a site
 * URL, UAE is the default and only an explicit US region switches to the US
 * site (compared case-insensitively; the README documents "uae").
 */
const REGION = (process.env.NEXT_PUBLIC_REGION ?? "").toUpperCase();
const CONFIGURED_SITE_URL =
  process.env.NEXT_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";

function siteHost(url: string): string {
  try {
    return new URL(url.includes("://") ? url : `https://${url}`).hostname
      .toLowerCase()
      .replace(/^www\./, "");
  } catch {
    return "";
  }
}

const CONFIGURED_HOST = siteHost(CONFIGURED_SITE_URL);

export const IS_UAE_REGION = CONFIGURED_HOST
  ? CONFIGURED_HOST.endsWith(".ae")
  : !(REGION === "US" || REGION === "USA");

const DEFAULT_SITE_URL = IS_UAE_REGION
  ? "https://www.horecastore.ae"
  : "https://www.thehorecastore.com";

export const SITE_URL = (CONFIGURED_SITE_URL || DEFAULT_SITE_URL).replace(
  /\/$/,
  "",
);

/**
 * Country whose prices the store is listed in (AED for UAE, USD for US).
 * Structured data must always be built for this country, never for the
 * visitor's country: crawlers are geolocated too (Googlebot mostly crawls
 * from the US), and a converted amount labelled with the store currency is a
 * wrong price for Google Merchant Center and rich results.
 */
export const STORE_COUNTRY_CODE = IS_UAE_REGION ? "AE" : "US";
