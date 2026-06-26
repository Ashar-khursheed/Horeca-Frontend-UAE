import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import { getDefaultAddressCache, getLocationData } from "@/utils/locationStorage";
import { getShippingCharge } from "@/utils/shipping";
import type { OrderStep } from "./order-processing-modal";
import { updateProfile as updateProfileThunk } from "@/store/slices/my-profile/profileSlice";
import type { AppDispatch } from "@/store/store";

const CART_SUMMARY_KEY = "hc_cart_summary";
export const COUPON_KEY = "hc_coupon";

export interface PlaceOrderParams {
  token: string;
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  rawProducts: any[];
  liftGate: boolean;
  residential: boolean;
  insideDelivery: boolean;
  ratePercent: number;
  cardDetails: any;
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

// ── Square payment ────────────────────────────────────────────────────────────
async function processSquarePayment(token: string, amount: number) {
  const idempotencyKey = crypto.randomUUID();
  const res = (await makeApiRequest(apiUrls.SQUARE_PAYMENT, {
    method: "POST",
    data: { source_id: token, amount, idempotency_key: idempotencyKey },
  })) as any;
  if (!res?.success) throw new Error(res?.message ?? "Payment failed. Please try again.");
  return res;
}

// ── Build products array ──────────────────────────────────────────────────────
function buildProducts(rawProducts: any[]) {
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
      accessory_item_ids: (cp.accessory_charges ?? []).map((a: any) => a.id),
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
      payment_mode: "Square",
    },
  })) as any;

  if (!res?.success) throw new Error(res?.message ?? "Order could not be placed. Please contact support.");
  return res?.data;
}

// ── Payment history (non-blocking) ───────────────────────────────────────────
async function savePaymentHistory(orderData: any, paymentRes: any) {
  try {
    const paymentDate = orderData?.updated_at
      ? orderData.updated_at.split(/[T ]/)[0]
      : new Date().toISOString().split("T")[0];
    await makeApiRequest(apiUrls.PAYMENT_HISTORY, {
      method: "POST",
      data: {
        order_id: orderData?.id,
        transaction_id: paymentRes?.payment?.id,
        payment_mode: "Credit Card",
        amount: orderData?.total_amount,
        status: "Completed",
        payment_date: paymentDate,
        notes: "",
        payment_details: JSON.stringify(paymentRes?.payment ?? {}),
        payment_method: "Square",
      },
    });
  } catch {
    console.warn("Payment history failed (non-blocking)");
  }
}

// ── Screen transaction (non-blocking) ────────────────────────────────────────
async function saveScreenTransaction(params: PlaceOrderParams, orderData: any, paymentRes: any) {
  try {
    const defaultAddr = getDefaultAddressCache();
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    const { cardDetails, amount, firstName, lastName, email, phone } = params;
    const billingFirst = user?.name?.split(" ")?.[0] ?? firstName;
    const billingLast = user?.name?.split(" ")?.slice(1)?.join(" ") ?? lastName;
    const billingAddr = defaultAddr?.address ?? "";
    const billingCity = defaultAddr?.related_city?.name ?? defaultAddr?.city ?? "";
    const billingState = defaultAddr?.related_state?.name ?? defaultAddr?.state ?? "";
    const billingZip = defaultAddr?.zip_code ?? "";
    const codeMap: Record<string, string> = {
      "united states": "US", canada: "CA", "united kingdom": "GB",
      australia: "AU", "united arab emirates": "AE", uae: "AE",
    };
    const rawCountry = (defaultAddr?.related_country?.name ?? defaultAddr?.country ?? "").toLowerCase().trim();
    const billingCountry = codeMap[rawCountry] ?? rawCountry.slice(0, 2).toUpperCase();
    const expMonth = String(cardDetails?.expMonth ?? "").padStart(2, "0");
    const expYear = String(cardDetails?.expYear ?? "").slice(-2);

    await makeApiRequest(apiUrls.SCREEN_TRANSACTION, {
      method: "POST",
      data: {
        order_id: String(orderData?.id),
        amount,
        billing_first_name: billingFirst, billing_last_name: billingLast,
        billing_email: user?.email ?? email, billing_phone: user?.mobile_number ?? phone,
        billing_address: billingAddr, billing_city: billingCity,
        billing_state: billingState, billing_zip: billingZip, billing_country: billingCountry,
        shipping_first_name: billingFirst, shipping_last_name: billingLast,
        shipping_address: billingAddr, shipping_city: billingCity,
        shipping_state: billingState, shipping_zip: billingZip, shipping_country: billingCountry,
        card_bin: "", card_last4: cardDetails?.last4 ?? "",
        card_type: cardDetails?.brand ?? "", card_expiration: expMonth + expYear,
      },
    });
  } catch {
    console.warn("Screen transaction failed (non-blocking)");
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

// ── MAIN: Place order with all API calls ─────────────────────────────────────
export async function placeOrderWithPayment(params: PlaceOrderParams): Promise<number> {
  const { token, amount, onStep } = params;

  // 1. Square payment
  onStep("payment");
  const paymentRes = await processSquarePayment(token, amount);

  // 2. Create order
  onStep("order");
  const orderData = await createOrder(params);
  const orderId = orderData?.id;
  localStorage.removeItem(CART_SUMMARY_KEY);

  // 3. Fetch full order details
  const fullOrderData = await fetchFullOrder(orderId, orderData);

  // 4. Non-blocking: payment history + screen transaction (parallel)
  await Promise.allSettled([
    savePaymentHistory(fullOrderData, paymentRes),
    saveScreenTransaction(params, fullOrderData, paymentRes),
  ]);

  // 5. Save to localStorage + clear coupon
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
