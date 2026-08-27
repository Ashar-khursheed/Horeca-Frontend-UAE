/** UAE customer addresses skip state + ZIP; cities load directly from country. */

export function isUaeCountryName(countryName?: string | null): boolean {
  const name = (countryName ?? "").toLowerCase().trim();
  return name.includes("arab emirates") || name === "uae" || name === "ae";
}

export function isUaeAddressCountry(countryName?: string | null): boolean {
  if (process.env.NEXT_PUBLIC_REGION === "UAE") return true;
  return isUaeCountryName(countryName);
}

/** Name-only GCC check (no storefront region). Use on forms where the user picks a country. */
export function isGccCountryName(countryName?: string | null): boolean {
  if (isUaeCountryName(countryName)) return true;
  const name = (countryName ?? "").toLowerCase().trim();
  if (!name) return false;
  return (
    name.includes("saudi") ||
    name === "ksa" ||
    name === "sa" ||
    name.includes("kuwait") ||
    name === "kw" ||
    name.includes("qatar") ||
    name === "qa" ||
    name.includes("bahrain") ||
    name === "bh" ||
    name.includes("oman") ||
    name === "om"
  );
}

/** GCC: UAE, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman. Checkout hides state. */
export function isGccAddressCountry(countryName?: string | null): boolean {
  if (process.env.NEXT_PUBLIC_REGION === "UAE") return true;
  return isGccCountryName(countryName);
}
