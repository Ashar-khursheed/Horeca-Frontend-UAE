/** UAE customer addresses skip state + ZIP; cities load directly from country. */

export function isUaeAddressCountry(countryName?: string | null): boolean {
  if (process.env.NEXT_PUBLIC_REGION === "UAE") return true;
  const name = (countryName ?? "").toLowerCase();
  return name.includes("arab emirates") || name === "uae" || name === "ae";
}
