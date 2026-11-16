/**
 * Region of this build. This repository is the UAE storefront
 * (www.horecastore.ae), so UAE is the default; only an explicit US region
 * switches to the US site. NEXT_PUBLIC_REGION is inlined at build time and is
 * compared case-insensitively (the README documents "uae", code uses "UAE").
 */
const REGION = (process.env.NEXT_PUBLIC_REGION ?? "").toUpperCase();
const CONFIGURED_SITE_URL =
  process.env.NEXT_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";

export const IS_UAE_REGION = !(REGION === "US" || REGION === "USA");

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
