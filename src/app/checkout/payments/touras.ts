import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";

export const TOURAS_CHECKOUT_KEY = "hc_touras_checkout";
export const TOURAS_CART_KEY = "hc_touras_cart_backup";
export const TOURAS_PROCESSED_KEY = "hc_touras_processed_transaction_id";

export interface TourasCheckoutState {
  liftGate: boolean;
  residential: boolean;
  insideDelivery: boolean;
  ratePercent: number;
  paymentProcessingFee: number;
}

export interface TourasInitiateData {
  me_id: string;
  merchant_request: string;
  hash: string;
  post_url: string;
}

export interface TourasResult {
  success: boolean;
  orderNo: string;
  transactionId: string;
  amount: string;
  currency: string;
  status: string;
}

interface TourasCallbackData {
  status?: string;
  amount?: string | number;
  transaction_id?: string;
  tracking_id?: string;
  order_number?: string;
  order_no?: string;
  currency?: string;
  success?: string | number | boolean;
}

function isPaidStatus(status?: string | null): boolean {
  const s = (status ?? "").toLowerCase();
  return s === "success" || s === "successful" || s === "paid" || s === "completed";
}

function isFailedStatus(status?: string | null): boolean {
  const s = (status ?? "").toLowerCase();
  return ["failed", "failure", "cancelled", "canceled", "aborted"].includes(s);
}

export function persistTourasCheckout(
  options: TourasCheckoutState,
  products: unknown[],
) {
  localStorage.setItem(TOURAS_CHECKOUT_KEY, JSON.stringify(options));
  localStorage.setItem(TOURAS_CART_KEY, JSON.stringify(products));
}

export function readTourasCheckout(): Partial<TourasCheckoutState> {
  try {
    return JSON.parse(localStorage.getItem(TOURAS_CHECKOUT_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function readTourasCartBackup<T = unknown>(): T[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(TOURAS_CART_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearTourasCheckout() {
  localStorage.removeItem(TOURAS_CHECKOUT_KEY);
  localStorage.removeItem(TOURAS_CART_KEY);
}

export function isTourasReturn(searchParams: URLSearchParams): boolean {
  if (searchParams.get("encResp")) return false;
  const success = searchParams.get("success");
  return (
    !!searchParams.get("response") ||
    success === "1" ||
    success === "0" ||
    (!!searchParams.get("transaction_id") && !!searchParams.get("order_no"))
  );
}

function normalizeTourasResult(data: TourasCallbackData): TourasResult {
  const status = String(data.status ?? "");
  const successFlag =
    data.success === true ||
    data.success === 1 ||
    data.success === "1";
  return {
    success: successFlag || isPaidStatus(status),
    orderNo: String(data.order_no ?? data.order_number ?? ""),
    transactionId: String(data.transaction_id ?? data.tracking_id ?? ""),
    amount: String(data.amount ?? ""),
    currency: String(data.currency ?? ""),
    status,
  };
}

export async function initiateTourasPayment(amount: number): Promise<TourasInitiateData> {
  const res = await makeApiRequest<{
    success: boolean;
    message?: string;
    data: TourasInitiateData;
  }>(apiUrls.TOURAS_INITIATE, {
    method: "POST",
    data: {
      amount: Number(amount.toFixed(2)),
      channel: "WEB",
    },
  });

  if (
    !res?.success ||
    !res?.data?.merchant_request ||
    !res?.data?.hash ||
    !res?.data?.post_url
  ) {
    throw new Error(
      res?.message ?? "Could not start Touras payment. Please try again.",
    );
  }

  return res.data;
}

/** Same pattern as CCAvenue: leave checkout and POST to the gateway. */
export function redirectToTouras(data: TourasInitiateData) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = data.post_url;
  form.style.display = "none";

  const fields: Record<string, string> = {
    me_id: data.me_id || "",
    merchant_request: data.merchant_request,
    hash: data.hash,
  };

  Object.entries(fields).forEach(([name, value]) => {
    if (!value) return;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export async function resolveTourasReturn(
  searchParams: URLSearchParams,
): Promise<TourasResult> {
  const encrypted = searchParams.get("response");
  if (encrypted) {
    const res = await makeApiRequest<{
      success?: boolean;
      data?: TourasCallbackData;
    }>(apiUrls.TOURAS_CALLBACK, {
      method: "POST",
      data: { response: encrypted },
    });
    if (!res?.data) {
      throw new Error("Could not verify Touras payment. Please contact support.");
    }
    return normalizeTourasResult(res.data);
  }

  const success = searchParams.get("success");
  const status = searchParams.get("status") ?? "";
  const paid = success === "1" || isPaidStatus(status);
  const failed = success === "0" || isFailedStatus(status);

  return {
    success: paid && !failed,
    orderNo:
      searchParams.get("order_no") ?? searchParams.get("order_number") ?? "",
    transactionId: searchParams.get("transaction_id") ?? "",
    amount: searchParams.get("amount") ?? "",
    currency: searchParams.get("currency") ?? "",
    status,
  };
}
