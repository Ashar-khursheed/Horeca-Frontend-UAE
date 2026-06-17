import type { DefaultAddressCache } from "./locationStorage";

const usChargeByLocation = (city: string, regionName: string): number => {
  const c = (city ?? "").toLowerCase().trim();
  const r = (regionName ?? "").toLowerCase().trim();
  if (c === "houston") return 99;
  if (r === "texas" || r === "tx") return 199;
  return 299;
};

/**
 * Shipping charge from IP-detected location:
 *  Non-US country → 0 (free)
 *  US Houston     → $99
 *  US Texas       → $199
 *  US other       → $299
 */
export const getShippingCharge = (
  city: string,
  regionName: string,
  countryCode: string,
): number => {
  const co = (countryCode ?? "").toLowerCase().trim();
  const isUS = co === "us" || co === "united states";
  if (!isUS) return 0;
  return usChargeByLocation(city, regionName);
};

/**
 * Shipping charge from the logged-in user's saved default address (hc_default_address).
 * Uses address country name to decide US vs non-US tiers.
 */
export const getShippingChargeFromAddress = (addr: DefaultAddressCache): number => {
  const countryName = (addr.related_country?.name ?? addr.country ?? "").toLowerCase().trim();
  const isUS = countryName === "united states" || countryName === "us";
  if (!isUS) return 0;
  const city = addr.related_city?.name ?? addr.city ?? "";
  const state = addr.related_state?.name ?? addr.state ?? "";
  return usChargeByLocation(city, state);
};
