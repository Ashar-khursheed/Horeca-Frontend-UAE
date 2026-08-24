import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import { getDefaultAddressCache, getLocationData } from "@/utils/locationStorage";
import { getShippingCharge } from "@/utils/shipping";
import type { OrderStep } from "./order-processing-modal";
import { updateProfile as updateProfileThunk } from "@/store/slices/my-profile/profileSlice";
import type { AppDispatch } from "@/store/store";

const CART_SUMMARY_KEY = "hc_cart_summary";
export const COUPON_KEY = "hc_coupon";

// Decoded fields from the CCAvenue return leg (POST encResp to
// apiUrls.CCAVENUE_DECODE_RESPONSE, then parse the returned query string).
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

export interface PlaceOrderParams {
  rawProducts: any[];
  liftGate: boolean;
  residential: boolean;
  insideDelivery: boolean;
  ratePercent: number;
  paymentProcessingFee: number;
  ccavenue: CCAvenueResult;
  onStep: (step: OrderStep) => void;
}

// ── Update profile (non-blocking) ────────────────────────────────────────────
export async function updateProfile(
  params: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
  },
  dispatch: AppDispatch,
) {
  try {
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    await dispatch(updateProfileThunk({
      name:          `${params.firstName} ${params.lastName}`.trim(),
      country_code:  params.countryCode || user.country_code || "",
      mobile_number: params.phone.replace(/\D/g, ""),
      type:          user?.type || "Individual",
      ...(user?.type === "Business" && { business_name: user?.business_detail?.business_name }),
    })).unwrap();
  } catch {
    /* non-blocking */
  }
}

// ── Build products array ──────────────────────────────────────────────────────
function buildProducts(rawProducts: any[]) {
  console.log("aspodasjdasdjasdfasu",rawProducts)
  const defaultAddr = getDefaultAddressCache();
  const location = getLocationData();
  const deliveryCharge = getShippingCharge(
    defaultAddr?.city ?? location?.city ?? "",
    defaultAddr?.state ?? location?.regionName ?? "",
    defaultAddr?.country ?? location?.countryCode ?? location?.country ?? "",
  );
  return rawProducts.map((cp: any) => {
    const qty = Number(cp.quantity) || 1;
    const own =
      Number(cp.shipping_charge) ||
      Number(cp.product?.shipping_charge) ||
      0;
    return {
      product_id: cp.product_id ?? cp.id,
      vendor_id: cp.vendor_product_supplier?.vendor_id,
      quantity: qty,
      shipping_charge: own > 0 ? own * qty : (deliveryCharge ?? 0) * qty,
      unit_price: parseFloat(cp.unit_price ?? cp.product?.price ?? 0),
      accessory_item_ids: (cp.accessory_charges ?? []).map((a: any) => a.accessory_item_id),
    };
  });
}

// ── Place order ───────────────────────────────────────────────────────────────
async function createOrder(params: PlaceOrderParams) {
  const defaultAddr = getDefaultAddressCache();
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const couponId = localStorage.getItem("coupon_id") ?? "";
  const discountVal = localStorage.getItem("discount_value") ?? 0;
  const sessionId = localStorage.getItem("session_id") ?? "";
  const localSummary = JSON.parse(localStorage.getItem(CART_SUMMARY_KEY) ?? "{}");
  const taxPercent = +(params.ratePercent ?? localSummary?.taxRatePercentage ?? 0).toFixed(2);

  const res = (await makeApiRequest(apiUrls.PLACE_ORDER, {
    method: "POST",
    data: {
      customer_id: user?.id,
      customer_address_id: defaultAddr?.id,
      tax_percentage: taxPercent,
      ship_all_at_once: 1,
      is_lift_gate: params.liftGate ? 1 : 0,
      is_residential_address: params.residential ? 1 : 0,
      is_inside_delivery: params.insideDelivery ? 1 : 0,
      separate_deliveries: 0,
      products: buildProducts(params.rawProducts),
      utm_id: sessionId,
      ...(couponId ? { coupon_id: couponId, discount: discountVal } : {}),
      is_reserved: 0,
      pay_with_cheque: 0,
      payment_mode: "CC Avenue",
      additional_amount_price: params.paymentProcessingFee,
      additional_amount_name: "Payment Processing Fee",
    },
  })) as any;

  if (!res?.success) throw new Error(res?.message ?? "Order could not be placed. Please contact support.");
  return res?.data;
}

// ── Payment history (non-blocking) ───────────────────────────────────────────
async function savePaymentHistory(orderData: any, ccavenue: CCAvenueResult) {
  try {
    const paymentDate = orderData?.updated_at
      ? orderData.updated_at.split(/[T ]/)[0]
      : new Date().toISOString().split("T")[0];
    await makeApiRequest(apiUrls.PAYMENT_HISTORY, {
      method: "POST",
      data: {
        order_id: orderData?.id,
        transaction_id: ccavenue.tracking_id,
        payment_mode: ccavenue.payment_mode || "Credit Card",
        amount: orderData?.total_amount,
        status: "Completed",
        payment_date: paymentDate,
        notes: `Bank ref: ${ccavenue.bank_ref_no}`,
        payment_details: JSON.stringify(ccavenue),
        payment_method: "CCAvenue",
      },
    });
  } catch {
    console.warn("Payment history failed (non-blocking)");
  }
}

// ── Fetch full order details ──────────────────────────────────────────────────
async function fetchFullOrder(orderId: number, fallback: any) {
  try {
    const res = (await makeApiRequest(apiUrls.ORDER_DETAIL(orderId), { method: "GET" })) as any;
    return res?.success && res?.data ? res.data : fallback;
  } catch {
    return fallback;
  }
}

// ── MAIN: Place order after a successful CCAvenue payment ────────────────────
// Called from checkout/page.tsx once the customer is redirected back from
// CCAvenue's hosted payment page and the encResp has been decoded + confirmed
// successful — the order is only created now, not before the redirect.
export async function placeOrderWithPayment(params: PlaceOrderParams): Promise<number> {
  const { onStep } = params;

  // 1. Create order
  onStep("order");
  const orderData = await createOrder(params);
  const orderId = orderData?.id;
  localStorage.removeItem(CART_SUMMARY_KEY);

  // 2. Fetch full order details
  const fullOrderData = await fetchFullOrder(orderId, orderData);

  // 3. Non-blocking: record the CCAvenue payment against the order
  await savePaymentHistory(fullOrderData, params.ccavenue);

  // 4. Save to localStorage + clear coupon
  localStorage.setItem("recentOrder", JSON.stringify(fullOrderData));
  [COUPON_KEY, CART_SUMMARY_KEY, "coupon_id", "discount_value", "discount_type"]
    .forEach((k) => localStorage.removeItem(k));

  return orderId;
}

// ── Parse API error to user-friendly message ─────────────────────────────────
export function parseOrderError(err: any): string {
  const resData = err?.response?.data;
  const raw: string = resData?.errors?.[0] ?? resData?.message ?? err?.message ?? "";
  if (raw.includes("VALUE_TOO_HIGH")) return "Payment could not be processed. Please contact support.";
  if (raw.includes("INSUFFICIENT_FUNDS")) return "Insufficient funds. Please use a different card.";
  if (raw.includes("CVV") || raw.includes("cvv")) return "Invalid CVV. Please check your card details.";
  if (raw.includes("CARD_EXPIRED") || raw.includes("expired")) return "Your card has expired. Please use a different card.";
  if (raw.toLowerCase().includes("payment")) return "Payment failed. Please try again or use a different card.";
  if (raw.includes("card") || raw.includes("Card")) return "Card payment failed. Please check your card details.";
  if (raw) return raw.length > 150 ? "Payment failed. Please try again." : raw;
  return "Something went wrong. Please try again.";
}
