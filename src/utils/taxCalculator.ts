import { TAX_STORAGE_KEY } from "@/store/slices/tax/taxSlice";
import type { TaxRateData } from "@/store/slices/tax/taxSlice";

export type { TaxRateData };

// Read tax data directly from localStorage (useful in non-Redux contexts)
export function getTaxRateData(): TaxRateData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TAX_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TaxRateData) : null;
  } catch {
    return null;
  }
}

export interface TaxBreakdown {
  rate: number;          // combined_rate as decimal  e.g. 0.08875
  ratePercent: number;   // human-readable %          e.g. 8.875
  taxOnSubtotal: number;
  taxOnShipping: number;
  totalTax: number;
  freightTaxable: boolean;
}

/**
 * Calculate tax using combined_rate from horeca_tax_rate.
 * - Tax always applies to subtotal.
 * - Tax applies to shipping only when freight_taxable === true.
 * - Pass `taxData` to use a Redux-sourced value; omits localStorage read.
 * - Returns all-zero breakdown when no tax data is available.
 */
export function calculateTax(
  subtotal: number,
  shippingTotal: number,
  taxData?: TaxRateData | null,
): TaxBreakdown {
  const data = taxData !== undefined ? taxData : getTaxRateData();

  if (!data) {
    return {
      rate: 0,
      ratePercent: 0,
      taxOnSubtotal: 0,
      taxOnShipping: 0,
      totalTax: 0,
      freightTaxable: false,
    };
  }

  const rate           = parseFloat(data.combined_rate) || 0;
  const freightTaxable = data.freight_taxable === true;
  const taxOnSubtotal  = subtotal * rate;
  const taxOnShipping  = freightTaxable ? shippingTotal * rate : 0;

  return {
    rate,
    ratePercent: parseFloat((rate * 100).toFixed(4)),
    taxOnSubtotal,
    taxOnShipping,
    totalTax: taxOnSubtotal + taxOnShipping,
    freightTaxable,
  };
}
