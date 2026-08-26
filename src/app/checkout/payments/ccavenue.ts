import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";

export const CCAVENUE_DELIVERY_OPTIONS_KEY = "hc_ccavenue_delivery_options";
export const CCAVENUE_PROCESSED_KEY = "hc_ccavenue_processed_tracking_id";

export interface CCAvenueResult {
  order_id: string;
  tracking_id: string;
  bank_ref_no: string;
  order_status: string;
  status_code: string;
  payment_mode: string;
  amount: string;
  currency: string;
}

export interface CCAvenueDeliveryOptions {
  liftGate: boolean;
  residential: boolean;
  insideDelivery: boolean;
  ratePercent: number;
  paymentProcessingFee: number;
}

export function persistCCAvenueDeliveryOptions(
  options: CCAvenueDeliveryOptions,
) {
  localStorage.setItem(CCAVENUE_DELIVERY_OPTIONS_KEY, JSON.stringify(options));
}

export function readCCAvenueDeliveryOptions(): Partial<CCAvenueDeliveryOptions> {
  try {
    return JSON.parse(
      localStorage.getItem(CCAVENUE_DELIVERY_OPTIONS_KEY) ?? "{}",
    );
  } catch {
    return {};
  }
}

export function parseCCAvenueResponse(decoded: string): CCAvenueResult {
  const parsed = new URLSearchParams(decoded.replace(/^"|"$/g, ""));
  return {
    order_id: parsed.get("order_id") ?? "",
    tracking_id: parsed.get("tracking_id") ?? "",
    bank_ref_no: parsed.get("bank_ref_no") ?? "",
    order_status: parsed.get("order_status") ?? "",
    status_code: parsed.get("status_code") ?? "",
    payment_mode: parsed.get("payment_mode") ?? "",
    amount: parsed.get("amount") ?? "",
    currency: parsed.get("currency") ?? "",
  };
}

export async function initiateCCAvenuePayment(params: {
  amount: number;
  currency: string;
}): Promise<string> {
  const res = await makeApiRequest<{
    success: boolean;
    message: string;
    data: {
      payment_url: string;
      order_id: number;
      amount: string;
      currency: string;
    };
  }>(apiUrls.CCAVENUE_INITIATE_PAYMENT, {
    method: "POST",
    data: {
      order_id: `ORD-${Date.now()}`,
      amount: params.amount,
      currency: params.currency,
    },
  });

  if (!res?.success || !res?.data?.payment_url) {
    throw new Error(
      res?.message ?? "Could not start payment. Please try again.",
    );
  }

  return res.data.payment_url;
}

export async function decodeCCAvenueResponse(
  encResp: string,
): Promise<CCAvenueResult> {
  const decodeRes = await makeApiRequest<{ success: boolean; data: string }>(
    apiUrls.CCAVENUE_DECODE_RESPONSE,
    { method: "POST", data: { encResp } },
  );

  if (!decodeRes?.success || !decodeRes?.data) {
    throw new Error("Could not verify payment. Please contact support.");
  }

  return parseCCAvenueResponse(decodeRes.data);
}
