/**
 * Shipping charge rules (US only):
 *  Houston city  → $99
 *  Texas state   → $199
 *  Anywhere else → $299
 *  Non-US        → null (no shipping charge)
 */
export const getShippingCharge = (
  city: string,
  regionName: string,
  countryCode: string,
): number | null => {
  const co = (countryCode ?? "").toLowerCase().trim();
  const isUS = co === "us" || co === "united states";
  if (!isUS) return null;

  const c = (city ?? "").toLowerCase().trim();
  const r = (regionName ?? "").toLowerCase().trim();
  if (c === "houston") return 99;
  if (r === "texas" || r === "tx") return 199;
  return 299;
};
