/**
 * Shipping charge rules (US only):
 *  Houston city  → $99
 *  Texas state   → $199
 *  Anywhere else → $299
 */
export const getShippingCharge = (city: string, regionName: string): number => {
  const c = (city ?? "").toLowerCase().trim();
  const r = (regionName ?? "").toLowerCase().trim();
  if (c === "houston") return 99;
  if (r === "texas") return 199;
  return 299;
};
