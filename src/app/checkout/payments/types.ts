export type PaymentMethod = "ccavenue" | "touras" | "stripe" | "cod";

export interface StripeBillingDetails {
  name: string;
  email: string;
  phone: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface StripeCardSummary {
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
}

export interface StripePaymentMethodResult {
  paymentMethodId: string;
  card: StripeCardSummary;
}

export interface StripeChargeResult {
  paymentIntentId: string;
  clientSecret: string;
  card: StripeCardSummary;
}

export interface OrderPaymentRecord {
  transactionId: string;
  paymentMode: string;
  paymentMethod: string;
  details: unknown;
  notes?: string;
}

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
}

export function resolveCurrencyCode(
  rawProducts: Array<{
    product?: {
      currency?: { title?: string; name?: string; symbol?: string } | string;
    };
  }>,
  isUAEUser: boolean,
): string {
  const currency = rawProducts?.[0]?.product?.currency;
  const raw =
    typeof currency === "string"
      ? currency
      : (currency?.title ?? currency?.name ?? currency?.symbol ?? "");
  const value = String(raw).trim().toUpperCase();
  if (value.includes("AED") || value === "د.إ") return "AED";
  if (value.includes("USD") || value === "$") return "USD";
  return isUAEUser ? "AED" : "USD";
}

export function toIsoCountry(nameOrCode: string | null | undefined): string {
  const raw = (nameOrCode ?? "").trim();
  if (!raw) return "US";
  if (/^[a-z]{2}$/i.test(raw)) return raw.toUpperCase();
  const map: Record<string, string> = {
    "united states": "US",
    usa: "US",
    "united arab emirates": "AE",
    uae: "AE",
    canada: "CA",
    "united kingdom": "GB",
    australia: "AU",
    india: "IN",
  };
  return map[raw.toLowerCase()] ?? "US";
}
