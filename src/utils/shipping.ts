import type { DefaultAddressCache } from "./locationStorage";

/** UAE: flat 30 AED shipping below 500 AED subtotal; free at 500+. */
export const UAE_FREE_SHIPPING_MIN = 500;
export const UAE_FLAT_SHIPPING = 30;

export function isUaeShippingMarket(opts?: {
  countryName?: string | null;
  countryCode?: string | null;
  currencySymbol?: string | null;
}): boolean {
  const region = process.env.NEXT_PUBLIC_REGION;
  const cur = (opts?.currencySymbol ?? "").trim();
  if (region === "UAE") return true;
  if (cur === "AED" || cur === "د.إ") return true;
  if (region === "US") return false;
  const name = (opts?.countryName ?? "").toLowerCase();
  const code = (opts?.countryCode ?? "").toLowerCase();
  return name.includes("arab emirates") || code === "ae";
}

export function getUaeOrderShipping(subtotal: number): number {
  if (!(subtotal > 0)) return 0;
  return subtotal < UAE_FREE_SHIPPING_MIN ? UAE_FLAT_SHIPPING : 0;
}

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
