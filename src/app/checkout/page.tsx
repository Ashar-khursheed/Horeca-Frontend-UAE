"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { AddressCheckout, AddressCheckoutHandle } from "./address-checkout";
import OrderProcessingModal, { OrderStep } from "./order-processing-modal";
import {
  updateProfile,
  placeOrderWithPayment,
  parseOrderError,
} from "./place-order-api";
import Breadcrumb from "@/components/breadcum";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCart,
  hydrateCart,
  resetApiStatus,
  clearCart,
  clearApiEntries,
} from "@/store/slices/cart/cartSlice";
import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import { fetchAddresses } from "@/store/slices/customer-address/customerAddressSlice";
import { fetchCounts } from "@/store/slices/customer-counts/customerCountsSlice";
import { TAX_STORAGE_KEY } from "@/store/slices/tax/taxSlice";
import {
  getDefaultAddressCache,
  getLocationData,
} from "@/utils/locationStorage";
import { getCartId } from "@/utils/cartId";
import {
  getShippingCharge,
  getShippingChargeFromAddress,
} from "@/utils/shipping";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Pencil, Tag, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CheckoutPayment, { CheckoutPaymentHandle } from "./checkout-payment";
import { Modal } from "@/components/ui/modal";

const CART_SUMMARY_KEY = "hc_cart_summary";
export const COUPON_KEY = "hc_coupon";

interface CartSummaryCache {
  subTotal: number;
  discountAmount: number;
  totalShippingCharges: number;
  taxRatePercentage: number;
  isCouponApplied: boolean;
}

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const resolveStr = (
  v: { en?: string; ar?: string } | string | null | undefined,
): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v.en ?? v.ar ?? "";
};

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const t = localStorage.getItem("token");
    return t ? t.trim().replace(/^["']|["']$/g, "") : null;
  } catch {
    return null;
  }
};

// API base URL

function CouponAppliedBadge({
  couponInfo,
  discount,
}: {
  couponInfo: {
    coupon_code: string;
    discount_type: string;
    discount_value: number;
  };
  discount: number;
}) {
  const label =
    couponInfo.discount_type === "fixed"
      ? "$" + couponInfo.discount_value.toFixed(2) + " off"
      : couponInfo.discount_value + "% off";
  return (
    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-2">
      <div>
        <p className="text-[12px] font-semibold text-green-700">
          {couponInfo.coupon_code}
        </p>
        <p className="text-[11px] text-green-600">
          {label} &mdash; saving ${discount.toFixed(2)}
        </p>
      </div>
      <span className="text-[11px] font-bold text-green-700">Applied</span>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const rawProducts = useAppSelector((s: any) => s.cart.rawProducts);
  const guestItems = useAppSelector((s: any) => s.cart.items);
  const apiStatus = useAppSelector((s) => s.cart.apiStatus);
  const addresses = useAppSelector((s) => s.customerAddress.addresses);
  const isAddressSaving = useAppSelector((s) => s.customerAddress.submitting);
  const country = useAppSelector((s) => s.country);
  const paymentHandleRef = useRef<CheckoutPaymentHandle | null>(null);
  const addressCheckoutRef = useRef<AddressCheckoutHandle | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartSummary, setCartSummary] = useState<CartSummaryCache | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState(country?.data?.phone_code ?? undefined);
  const [code, setCode] = useState("");
  const [codeApplied, setCodeApplied] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponInfo, setCouponInfo] = useState<{
    coupon_id: number;
    coupon_code: string;
    discount_type: string;
    discount_value: number;
  } | null>(null);
  const [discount, setDiscount] = useState(0);
  const [showCouponAnim, setShowCouponAnim] = useState(false);
  const [liftGate, setLiftGate] = useState(false);
  const [residential, setResidential] = useState(false);
  const [insideDelivery, setInsideDelivery] = useState(false);
  const [showShippingPolicyModal, setShowShippingPolicyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  // â"€â"€ Derived state
  const hasAddress =
    addresses.some((a) => a.is_default) || !!getDefaultAddressCache();

  const isUSUser = (() => {
    const defaultAddr = getDefaultAddressCache();
    if (defaultAddr?.country) {
      return defaultAddr.country.toLowerCase().includes("united states");
    }
    const loc = getLocationData();
    return (
      loc?.countryCode === "US" ||
      loc?.country?.toLowerCase().includes("united states") ||
      false
    );
  })();

  // Mobile step (1 = Contact + Address, 2 = Cart + Payment)
  const [mobileStep, setMobileStep] = useState(1);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderStep, setOrderStep] = useState<OrderStep>("idle");
  const [orderError, setOrderError] = useState<string | null>(null);

  const [phoneError, setPhoneError] = useState("");
  const [addressStepError, setAddressStepError] = useState("");

  // US phone format & API validation
  const isoCode = getLocationData()?.countryCode ?? "";
  const isUSPhone = (countryCode as any) === "+1" || isoCode === "US";

  const formatUSPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits.length ? `(${digits}` : "";
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = isUSPhone ? formatUSPhone(e.target.value) : e.target.value;
    setPhone(val);
    setPhoneError("");
  };


  const fetchedRef = useRef(false);
  const taxFetchedZip = useRef<string | null>(null);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Read saved cart summary for pricing
    try {
      const raw = localStorage.getItem(CART_SUMMARY_KEY);
      if (raw) {
        const saved: CartSummaryCache = JSON.parse(raw);
        setCartSummary(saved);
      }
    } catch {
      /* ignore */
    }

    // Restore saved coupon
    try {
      const savedCoupon = localStorage.getItem(COUPON_KEY);
      if (savedCoupon) {
        const c = JSON.parse(savedCoupon);
        setCode(c.coupon_code ?? "");
        setCodeApplied(true);
        setDiscount(c.discount_amount ?? 0);
        setCouponInfo({
          coupon_id: c.coupon_id,
          coupon_code: c.coupon_code,
          discount_type: c.discount_type,
          discount_value: c.discount_value,
        });
      }
    } catch {
      /* ignore */
    }

    // Pre-fill user info from localStorage
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const user = JSON.parse(raw);
        setEmail(user.email ?? "");
        const code = user.country_code || country?.data?.phone_code || "";
        const mobile = user.mobile_number ?? "";
        setCountryCode(code);

        // US format apply on autofill
        const locCode = getLocationData()?.countryCode ?? "";
        const isUS = code === "+1" || locCode === "US";
        if (isUS && mobile) {
          const digits = mobile.replace(/\D/g, "").slice(0, 10);
          let formatted = digits;
          if (digits.length > 6)
            formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
          else if (digits.length > 3)
            formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
          else if (digits.length) formatted = `(${digits}`;
          setPhone(formatted);
        } else {
          setPhone(mobile);
        }

        const parts = (user.name ?? "").trim().split(/\s+/);
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" "));
      }
    } catch {
      /* ignore */
    }

    // Fetch cart
    const token = getToken();
    setIsLoggedIn(!!token);
    const location = getLocationData();
    if (token) {
      dispatch(resetApiStatus());
      dispatch(fetchCart(location?.country ?? ""));
      dispatch(fetchAddresses());
    } else {
      dispatch(hydrateCart());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const location = getLocationData();
    if (location?.country) dispatch(fetchCountryByName(location.country));
  }, [dispatch]);

  // ── Recalculate shipping & tax when default address changes ──────────────────
  useEffect(() => {
    const defaultAddr = addresses.find((a) => a.is_default);
    if (!defaultAddr) return;

    // Flat rate for the new address (per-unit, same tiers as cart page)
    const flatRatePerUnit = getShippingChargeFromAddress(defaultAddr as any);

    // Sum per-item shipping the same way the cart page does:
    // If the product has its own shippingCharge → use that × qty
    // Otherwise fall back to the address flat-rate × qty
    const newTotalShipping = (rawProducts as any[]).reduce((sum, cp) => {
      const qty = Number(cp.quantity) || 1;
      const productOwn =
        Number(cp.shipping_charge) ||
        Number(cp.product?.shipping_charge) ||
        0;
      const itemShipping =
        productOwn > 0 ? productOwn * qty : flatRatePerUnit * qty;
      return sum + itemShipping;
    }, 0);

    const isUS =
      (defaultAddr as any).country?.toLowerCase().includes("united states") ||
      (defaultAddr as any).related_country?.name
        ?.toLowerCase()
        .includes("united states");

    if (isUS && (defaultAddr as any).zip_code) {
      const zip = (defaultAddr as any).zip_code;
      const city = encodeURIComponent((defaultAddr as any).city ?? "");

      // Use cached tax data if zip matches — avoid duplicate API calls
      try {
        const cached = localStorage.getItem(TAX_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.zip === zip) {
            const cachedRate = parseFloat(
              (parseFloat(parsed.combined_rate ?? "0") * 100).toFixed(2),
            );
            setCartSummary((prev) => {
              if (!prev) return prev;
              const discountedSub = prev.subTotal - (prev.discountAmount ?? 0);
              const taxableAmount = discountedSub + newTotalShipping;
              const taxAmount = taxableAmount * (cachedRate / 100);
              const updated = {
                ...prev,
                totalShippingCharges: newTotalShipping,
                taxRatePercentage: cachedRate,
                discountedSubtotal: discountedSub,
                finalDiscountedSubtotal: discountedSub,
                taxableAmount,
                taxAmount,
                total: taxableAmount + taxAmount,
              };
              localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(updated));
              return updated;
            });
            return;
          }
        }
      } catch {
        /* ignore */
      }

      // Prevent duplicate API calls for the same zip in this session
      if (taxFetchedZip.current === zip) return;
      taxFetchedZip.current = zip;

      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}frontend/tax/rate?zip=${zip}&country=US&city=${city}`,
      )
        .then((r) => r.json())
        .then((data) => {
          const newRate = parseFloat(
            (parseFloat(data.combined_rate ?? "0") * 100).toFixed(2),
          );
          setCartSummary((prev) => {
            if (!prev) return prev;
            const discountedSub = prev.subTotal - (prev.discountAmount ?? 0);
            const taxableAmount = discountedSub + newTotalShipping;
            const taxAmount = taxableAmount * (newRate / 100);
            const updated = {
              ...prev,
              totalShippingCharges: newTotalShipping,
              taxRatePercentage: newRate,
              discountedSubtotal: discountedSub,
              finalDiscountedSubtotal: discountedSub,
              taxableAmount,
              taxAmount,
              total: taxableAmount + taxAmount,
            };
            localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(updated));
            localStorage.setItem(TAX_STORAGE_KEY, JSON.stringify(data));
            return updated;
          });
        })
        .catch(() => {
          taxFetchedZip.current = null; // allow retry on next render
          setCartSummary((prev) => {
            if (!prev) return prev;
            const discountedSub = prev.subTotal - (prev.discountAmount ?? 0);
            const taxableAmount = discountedSub + newTotalShipping;
            const taxRate = (prev.taxRatePercentage ?? 0) / 100;
            const taxAmount = taxableAmount * taxRate;
            const updated = {
              ...prev,
              totalShippingCharges: newTotalShipping,
              discountedSubtotal: discountedSub,
              finalDiscountedSubtotal: discountedSub,
              taxableAmount,
              taxAmount,
              total: taxableAmount + taxAmount,
            };
            localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(updated));
            return updated;
          });
        });
    } else {
      setCartSummary((prev) => {
        if (!prev) return prev;
        const discountedSub = prev.subTotal - (prev.discountAmount ?? 0);
        const taxableAmount = discountedSub + newTotalShipping;
        const updated = {
          ...prev,
          totalShippingCharges: newTotalShipping,
          taxRatePercentage: 0,
          discountedSubtotal: discountedSub,
          finalDiscountedSubtotal: discountedSub,
          taxableAmount,
          taxAmount: 0,
          total: taxableAmount,
        };
        localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(updated));
        return updated;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses, rawProducts]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiCartItems = rawProducts.map((cp: any) => ({
    id: cp.id as number,
    name: resolveStr(cp.product?.name),
    image: cp.product?.images?.en?.[0] ?? cp.product?.images?.ar?.[0] ?? "",
    qty: cp.quantity as number,
    price: parseFloat(cp.unit_price ?? cp.product?.price ?? 0),
    shipping: parseFloat(cp.shipping_charge ?? 0),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accessories: (cp.accessory_charges ?? []).reduce(
      (s: number, a: any) => s + parseFloat(a.accessory_item_price ?? 0),
      0,
    ),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guestCartItems = guestItems.map((item: any) => ({
    id: item.productId as number,
    name: item.name ?? "",
    image: item.image ?? "",
    qty: item.quantity as number,
    price: item.price ?? 0,
    shipping: item.shippingCharge ?? 0,
    accessories: (item.selectedAccessories ?? []).reduce(
      (s: number, a: { price: number }) => s + a.price,
      0,
    ),
  }));

  const cartItems = isLoggedIn ? apiCartItems : guestCartItems;
  const currencySymbol: string =
    (rawProducts[0] as any)?.product?.currency?.symbol ?? "$";

  // â"€â"€ Pricing
  const baseSubtotal = cartSummary?.subTotal ?? 0;
  const baseShipping = cartSummary?.totalShippingCharges ?? 0;
  const ratePercent = cartSummary?.taxRatePercentage ?? 0;
  const taxRate = ratePercent / 100;
  const liftFee = liftGate ? 75 : 0;
  const resFee = residential ? 199 : 0;
  const insideFee = insideDelivery ? 249 : 0;
  const discountedSubtotal = baseSubtotal - discount;
  // Tax calculated on discounted subtotal + shipping
  const taxOnBase = (discountedSubtotal + baseShipping) * taxRate;
  const taxOnFees = (liftFee + resFee + insideFee) * taxRate;
  const totalTax = taxOnBase + taxOnFees;
  const grandTotal =
    discountedSubtotal + baseShipping + liftFee + resFee + insideFee + totalTax;
  const totalItems = cartItems.reduce((s: any, c: any) => s + c.qty, 0);

  const isCartLoading =
    isLoggedIn && (apiStatus === "idle" || apiStatus === "loading");

  // Google Analytics begin_checkout event
  useEffect(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;
    const w = window as any;
    if (w.beginCheckoutEventFired) return;
    w.beginCheckoutEventFired = true;
    w.dataLayer = w.dataLayer || [];

    const sendBeginCheckoutEvent = () => {
      const eventData = {
        currency: "USD",
        value: grandTotal,
        items: cartItems.map((item: any, index: number) => ({
          item_id: item.modelNo || item.sku || String(item.id),
          item_name: item.name || "Unknown Product",
          index,
          item_brand: "",
          item_category: "",
          item_list_id: String(item.id),
          item_list_name: item.name || "Unknown Product",
          item_variant: "",
          location_id: String(item.vendorId || ""),
          price: item.price,
          quantity: item.qty,
        })),
      };

      if (w.gtag) w.gtag("event", "begin_checkout", eventData);
    };

    if (!w.gtagLoaded) {
      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=GTM-KZNMLW32";
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => {
        w.gtag = function () { w.dataLayer.push(arguments); };
        w.gtag("js", new Date());
        w.gtag("config", "GTM-KZNMLW32", { debug_mode: true });
        w.gtagLoaded = true;
        sendBeginCheckoutEvent();
      };
    } else {
      sendBeginCheckoutEvent();
    }
  }, [cartItems, grandTotal]);

  const handleApplyCode = async () => {
    if (!code.trim()) {
      setCodeError("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    setCodeError("");
    try {
      const res = await makeApiRequest<{
        success: boolean;
        message: string;
        data: {
          coupon_id: number;
          coupon_code: string;
          discount_type: "fixed" | "percentage";
          discount_value: string;
        };
      }>(
        `customer/check-coupon?coupon_code=${code}&orderValue=${grandTotal.toFixed(2)}`,
      );

      if (res?.success && res?.data) {
        const { coupon_id, coupon_code, discount_type, discount_value } =
          res.data;
        const dv = Number(discount_value);

        const discountAmount =
          discount_type === "fixed" ? dv : (baseSubtotal * dv) / 100;

        if (discountAmount > baseSubtotal) {
          setCodeError(
            `Coupon discount ($${dv.toFixed(2)}) exceeds your order subtotal ($${baseSubtotal.toFixed(2)}). This coupon cannot be applied.`,
          );
          return;
        }

        const info = {
          coupon_id,
          coupon_code,
          discount_type,
          discount_value: dv,
        };

        localStorage.setItem(
          COUPON_KEY,
          JSON.stringify({ ...info, discount_amount: discountAmount }),
        );
        localStorage.setItem("coupon_id", String(coupon_id));
        localStorage.setItem("discount_value", String(discountAmount));
        localStorage.setItem("discount_type", discount_type);

        // Update hc_cart_summary with coupon applied
        try {
          const raw = localStorage.getItem(CART_SUMMARY_KEY);
          if (raw) {
            const summary = JSON.parse(raw);
            const sub = summary.subTotal ?? 0;
            const shipping = summary.totalShippingCharges ?? 0;
            const rate = (summary.taxRatePercentage ?? 0) / 100;
            const r2 = (n: number) => Math.round(n * 100) / 100;
            const discountedSub = r2(sub - discountAmount);
            const taxableAmt = r2(discountedSub + shipping);
            const taxAmt = r2(taxableAmt * rate);
            const updated = {
              ...summary,
              discountAmount: r2(discountAmount),
              discountedSubtotal: discountedSub,
              finalDiscountedSubtotal: discountedSub,
              taxableAmount: taxableAmt,
              taxAmount: taxAmt,
              total: r2(taxableAmt + taxAmt),
              isCouponApplied: true,
            };
            localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(updated));
            setCartSummary(updated);
          }
        } catch {
          /* ignore */
        }

        setCouponInfo(info);
        setDiscount(discountAmount);
        setCodeApplied(true);
        setCodeError("");
        setShowCouponAnim(true);
        setTimeout(() => setShowCouponAnim(false), 2500);
      } else {
        setCodeError(res?.message || "Invalid coupon code");
      }
    } catch (err: any) {
      setCodeError(
        err?.response?.data?.message || "Failed to apply coupon. Try again.",
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    localStorage.removeItem(COUPON_KEY);
    localStorage.removeItem("coupon_id");
    localStorage.removeItem("discount_value");
    localStorage.removeItem("discount_type");

    // Reset hc_cart_summary to original values (no coupon)
    try {
      const raw = localStorage.getItem(CART_SUMMARY_KEY);
      if (raw) {
        const summary = JSON.parse(raw);
        const sub = summary.subTotal ?? 0;
        const shipping = summary.totalShippingCharges ?? 0;
        const rate = (summary.taxRatePercentage ?? 0) / 100;
        const r2 = (n: number) => Math.round(n * 100) / 100;
        const taxableAmt = r2(sub + shipping);
        const taxAmt = r2(taxableAmt * rate);
        const updated = {
          ...summary,
          discountAmount: 0,
          discountedSubtotal: sub,
          finalDiscountedSubtotal: sub,
          taxableAmount: taxableAmt,
          taxAmount: taxAmt,
          total: r2(taxableAmt + taxAmt),
          isCouponApplied: false,
        };
        localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(updated));
        setCartSummary(updated);
      }
    } catch {
      /* ignore */
    }

    setCode("");
    setCodeApplied(false);
    setCouponInfo(null);
    setDiscount(0);
    setCodeError("");
  };

  const handlePlaceOrder = async () => {
    setOrderError(null);

    // 0. Terms check
    if (!termsAccepted) {
      setTermsError(true);
      return;
    }

    // 1. Phone check
    if (!phone) {
      setPhoneError("Phone number is required");
      setTimeout(() => {
        const el = document.getElementById("phone-input");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus();
      }, 50);
      return;
    }
    setPhoneError("");

    // 2. Address validate (no API)
    if (addressCheckoutRef.current) {
      const ok = await addressCheckoutRef.current.validate();
      if (!ok) {
        setOrderError(
          "Please fill in your delivery address before placing your order.",
        );
        setTimeout(() => {
          const el =
            document.getElementById("address-street-input") ??
            document.getElementById("shipping-address-section");
          if (el) {
            window.scrollTo({
              top: el.getBoundingClientRect().top + window.scrollY - 100,
              behavior: "smooth",
            });
            (el as HTMLInputElement).focus?.();
          }
        }, 50);
        return;
      }
    }

    // 3. Card tokenize (no API)
    if (!paymentHandleRef.current) {
      setOrderError(
        "Payment form is not ready. Please wait a moment and try again.",
      );
      return;
    }
    setOrderStep("card");
    let token: any;
    try {
      token = await paymentHandleRef.current.getPaymentToken();
    } catch {
      setOrderStep("idle");
      return;
    }
    if (!token) {
      setOrderStep("idle");
      setOrderError("Could not process card. Please try again.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      // 5. Address save
      setOrderStep("address");
      const addressSaved = await addressCheckoutRef.current?.save();
      if (!addressSaved) {
        setOrderStep("idle");
        setOrderError(
          "Please fill in your delivery address before placing your order.",
        );
        document
          .getElementById("shipping-address-section")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      // 4. Profile update
      setOrderStep("profile");
      await updateProfile(
        {
          firstName,
          lastName,
          email,
          phone,
          countryCode: (countryCode as any) ?? "",
        },
        dispatch,
      );

      // 6. Payment + order + history (all in place-order-api.ts)
      const orderId = await placeOrderWithPayment({
        token,
        amount: Number(grandTotal.toFixed(2)),
        firstName,
        lastName,
        email,
        phone,
        countryCode: (countryCode as any) ?? "",
        rawProducts,
        liftGate,
        residential,
        insideDelivery,
        ratePercent,
        cardDetails: paymentHandleRef.current?.getCardDetails(),
        onStep: setOrderStep,
      });

      setOrderStep("done");
      dispatch(fetchCounts() as any);
      // Clear Redux cart so "Added!" badges reset on all product cards
      dispatch(clearApiEntries());
      dispatch(clearCart());
      setTimeout(
        () => router.replace(`/payment-success?orderID=${orderId}`),
        1200,
      );
    } catch (err: any) {
      setOrderStep("idle");
      setOrderError(parseOrderError(err));
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: null },
  ];

  // â"€â"€ Shared blocks (used in both mobile & desktop)
  const contactBlock = (
    <div className="mb-7">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          Contact information
        </h2>
        {/* <Link
          href="/dashboard/my-profile?mode=checkout"
          className="text-xs font-semibold text-green-700 flex gap-1.5 items-center"
        >
          Edit Info <Pencil className="w-3" />
        </Link> */}
      </div>
      <div className="space-y-3">
        <Field
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="Email"
          disable
        />
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          <Field
            value={`${firstName} ${lastName}`}
            onChange={setFirstName}
            placeholder="Full name"
            disable
          />
          <div id="phone-field-wrapper">
            <div
              className={`relative flex items-center w-full h-12 border rounded-md bg-white overflow-hidden ${phoneError ? "border-red-400" : "border-gray-300"}`}
            >
              <div className="flex items-center gap-1.5 px-3 bg-white border-r border-gray-200 h-full shrink-0">
                {country.loading ? (
                  <span className="text-xs text-gray-400 animate-pulse">
                    ...
                  </span>
                ) : (
                  <>
                    {country.data?.icon && (
                      <img
                        src={country.data.icon}
                        alt=""
                        className="w-5 h-4 object-cover rounded-sm"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {countryCode ?? ""}
                    </span>
                  </>
                )}
              </div>
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder={isUSPhone ? "(432) 423-4234" : "Phone number"}
                className="flex-1 h-full px-3 text-sm outline-none bg-white placeholder:text-gray-400"
              />
            </div>
            {phoneError && (
              <p className="text-[11px] text-red-500 mt-1">{phoneError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const addressBlock = (
    <AddressCheckout
      ref={addressCheckoutRef}
      onFormChange={() => setOrderError(null)}
    />
  );
  //     height: 364px;
  //     overflow-x: auto;
  //     padding: 12px;
  // }
  const cartBlock = (
    <div
      className={`space-y-4 mb-6 p-3 ${cartItems.length > 4 ? "h-[350px] overflow-y-auto" : ""}`}
    >
      {isCartLoading ? (
        <div className="space-y-4 py-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-16 h-16 rounded-md bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-14 shrink-0 mt-1" />
            </div>
          ))}
        </div>
      ) : cartItems.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          Your cart is empty.
        </p>
      ) : (
        cartItems.map((item: any) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-md border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.qty}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">
                {item.name}
              </p>
              {item.accessories > 0 && (
                <p className="text-[11px] text-gray-400 mt-0.5">
                  +{currencySymbol}
                  {usd(item.accessories)} accessories
                </p>
              )}
              {item.shipping > 0 && isUSUser && (
                <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400">
                  <Truck size={10} /> {currencySymbol}
                  {usd(item.shipping)} shipping
                </div>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-800 shrink-0">
              {currencySymbol}
              {usd((item.price + item.accessories) * item.qty)}
            </span>
          </div>
        ))
      )}
    </div>
  );

  const discountBlock = (
    <>
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <Tag
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setCodeError("");
            }}
            placeholder="Enter coupon code"
            disabled={codeApplied}
            className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>
        <div className="relative shrink-0">
          {/* Animation floats above the button */}
          <AnimatePresence>
            {showCouponAnim && (
              <motion.div
                key="lottie"
                initial={{ scale: 0.3, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: -50 }}
                exit={{ scale: 0.3, opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                style={{ bottom: "100%" }}
              >
                {/* <DotLottieReact
                  src="https://lottie.host/11f725f0-3999-46da-943d-20e61d1661e5/KPPrJBbOjt.lottie"
                  autoplay
                  style={{ width: 80, height: 80 }}
                /> */}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button stays visible */}
          {codeApplied ? (
            <button
              onClick={handleRemoveCoupon}
              className="h-10 px-4 rounded-md bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-colors border border-red-200"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={handleApplyCode}
              disabled={couponLoading || !code}
              className="h-10 px-4 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 text-sm font-medium transition-colors min-w-[68px]"
            >
              {couponLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                "Apply"
              )}
            </button>
          )}
        </div>
      </div>

      {codeError && (
        <p className="text-[11px] text-red-500 mb-2">{codeError}</p>
      )}

      {codeApplied && couponInfo && (
        <CouponAppliedBadge couponInfo={couponInfo} discount={discount} />
      )}
    </>
  );

  const feeOptions = [
    {
      label: "Lift Gate Service",
      desc: "Required for deliveries without loading dock",
      fee: 75,
      state: liftGate,
      toggle: () => setLiftGate((v) => !v),
    },
    {
      label: "Residential Address",
      desc: "Delivery to home or residential location",
      fee: 199,
      state: residential,
      toggle: () => setResidential((v) => !v),
    },
    {
      label: "Inside Delivery Address",
      desc: "Delivery inside the building",
      fee: 249,
      state: insideDelivery,
      toggle: () => setInsideDelivery((v) => !v),
    },
  ];

  const deliveryBlock = (
    <div className="mb-6 border border-gray-200 rounded-[7px] overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">
          Lift Gate or Residential Address
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {feeOptions.map(({ label, desc, fee, state, toggle }) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-3.5"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              <p
                className={`text-xs font-medium mt-1 ${state ? "text-[#186737]" : "text-gray-400"}`}
              >
                +${fee}.00 fee will be added
              </p>
            </div>
            {/* Toggle switch */}
            <button
              type="button"
              onClick={toggle}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${state ? "bg-[#186737]" : "bg-gray-200"}`}
              role="switch"
              aria-checked={state}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${state ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const pricingBlock =
    isCartLoading || isAddressSaving ? (
      <div className="space-y-3 animate-pulse mb-4">
        {[80, 64, 56, 48].map((w) => (
          <div key={w} className="flex justify-between items-center">
            <div
              className="h-3 bg-gray-200 rounded"
              style={{ width: `${w}%` }}
            />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        ))}
        <div className="h-px bg-gray-200 my-3" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 bg-gray-200 rounded w-28" />
          <div className="h-5 bg-gray-200 rounded w-24" />
        </div>
      </div>
    ) : (
      <>
        <div className="space-y-2 text-sm mb-4">
          <PriceRow
            label={`Subtotal (${totalItems} item${totalItems !== 1 ? "s" : ""})`}
            value={`${currencySymbol}${usd(baseSubtotal)}`}
          />
          {codeApplied && (
            <>
              <PriceRow
                label="Discount"
                value={`-${currencySymbol}${usd(discount)}`}
                green
              />
              <PriceRow
                label="Subtotal after discount"
                value={`${currencySymbol}${usd(discountedSubtotal)}`}
              />
            </>
          )}
          {baseShipping > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1">
                Shipping &amp; Handling
                <button
                  type="button"
                  onClick={() => setShowShippingPolicyModal(true)}
                  className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] font-bold flex items-center justify-center hover:border-[#186737] hover:text-[#186737] transition-colors leading-none"
                  aria-label="Shipping policy info"
                >
                  ?
                </button>
              </span>
              <span className="font-medium text-gray-800">{currencySymbol}{usd(baseShipping)}</span>
            </div>
          )}
          {liftGate && (
            <PriceRow
              label={`Lift Gate Service${ratePercent > 0 ? ` ` : ""}`}
              value={`${currencySymbol}${usd(liftFee)}`}
            />
          )}
          {residential && (
            <PriceRow
              label={`Residential Address${ratePercent > 0 ? `` : ""}`}
              value={`${currencySymbol}${usd(resFee)}`}
            />
          )}
          {insideDelivery && (
            <PriceRow
              label={`Inside Delivery${ratePercent > 0 ? ` ` : ""}`}
              value={`${currencySymbol}${usd(insideFee)}`}
            />
          )}
          {ratePercent > 0 && (
            <PriceRow
              label={`Tax (${ratePercent}%)`}
              value={`${currencySymbol}${usd(totalTax)}`}
            />
          )}
        </div>
        <div className="h-px bg-gray-200 mb-4" />
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-gray-900 text-base">
            Total Amount
          </span>
          <span className="font-bold text-gray-900 text-xl">
            {currencySymbol}
            {usd(grandTotal)}
          </span>
        </div>
      </>
    );

  const placeOrderBtn = (
    <>
      {orderError && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-red-700">{orderError}</p>
        </div>
      )}
      <div className={`flex items-start gap-3 p-3 rounded-md border mb-4 ${termsError ? "border-red-400 bg-red-50" : "border-gray-200"}`}>
        <input
          id="terms-checkbox-desktop"
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => {
            setTermsAccepted(e.target.checked);
            if (e.target.checked) setTermsError(false);
          }}
          className="mt-0.5 w-4 h-4 shrink-0 accent-[#186737] cursor-pointer"
        />
        <div>
          <label htmlFor="terms-checkbox-desktop" className="text-sm text-gray-700 cursor-pointer">
            Please read our Terms and conditions before proceeding with the payments.
          </label>
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="flex items-center gap-1 text-[#186737] text-sm font-medium hover:underline mt-0.5"
          >
            Terms and Conditions
            <span className="w-4 h-4 rounded-full border border-[#186737] text-[10px] font-bold flex items-center justify-center leading-none">?</span>
          </button>
          {termsError && (
            <p className="text-xs text-red-500 mt-1">⚠ Please accept the terms and conditions to proceed</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 flex-wrap gap-4">
        <Link
          href={`/cart/${getCartId()}`}
          className="flex items-center gap-1 text-[#186737] text-sm hover:underline font-medium"
        >
          <ChevronRight size={14} className="rotate-180" /> Return to cart
        </Link>
        <button
          type="button"
          disabled={isPlacingOrder}
          className="flex items-center gap-2 bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-md text-sm transition-colors"
          onClick={handlePlaceOrder}
        >
          {isPlacingOrder ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      <OrderProcessingModal step={orderStep} />
      <Breadcrumb crumbs={crumbs} />

      {/*  MOBILE LAYOUT â€" step-based (hidden on lg+)  */}
      <div className="lg:hidden min-h-screen bg-gray-50">
        {/* â"€â"€ Step indicator bar */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-0 max-w-sm mx-auto">
            {/* Step 1 */}
            <button
              onClick={() => setMobileStep(1)}
              className="flex items-center gap-2 flex-1"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${mobileStep >= 1 ? "bg-[#186737] text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {mobileStep > 1 ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  "1"
                )}
              </div>
              <span
                className={`text-xs font-semibold ${mobileStep === 1 ? "text-[#186737]" : "text-gray-400"}`}
              >
                Info &amp; Address
              </span>
            </button>

            {/* Connector */}
            <div className="flex-1 flex items-center px-1">
              <div
                className={`h-0.5 w-full transition-colors ${mobileStep > 1 ? "bg-[#186737]" : "bg-gray-200"}`}
              />
              <ChevronRight
                size={14}
                className={`shrink-0 -ml-1 ${mobileStep > 1 ? "text-[#186737]" : "text-gray-300"}`}
              />
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${mobileStep === 2 ? "bg-[#186737] text-white" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <span
                className={`text-xs font-semibold ${mobileStep === 2 ? "text-[#186737]" : "text-gray-400"}`}
              >
                Cart &amp; Payment
              </span>
            </div>
          </div>
        </div>

        {/* â"€â"€ STEP 1: Contact + Address  */}
        {mobileStep === 1 && (
          <div className="px-4 py-5 space-y-1 pb-28">
            {/* Contact card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
              {contactBlock}
            </div>

            {/* Address card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
              {addressBlock}
            </div>

            {/* Fixed bottom CTA */}
            <div className=" bg-white border-t border-gray-100 px-4 py-3 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.07)]">
              {addressStepError && (
                <p className="text-xs text-red-500 mb-2 text-center">
                  {addressStepError}
                </p>
              )}
              <button
                type="button"
                onClick={async () => {
                  // Phone validation
                  if (!phone) {
                    setPhoneError("Phone number is required");
                    document
                      .getElementById("phone-field-wrapper")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                    return;
                  }
                  setPhoneError("");

                  // Address validation
                  const valid = await addressCheckoutRef.current?.validate();
                  if (!valid) {
                    setAddressStepError(
                      "Please fill in all required address fields.",
                    );
                    return;
                  }
                  setAddressStepError("");
                  setMobileStep(2);
                  window.scrollTo(0, 0);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#186737] hover:bg-[#145c30] active:scale-[0.98] text-white font-semibold py-3.5 rounded-[7px] text-sm transition-all"
              >
                Continue to Cart &amp; Payment
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* â"€â"€ STEP 2: Cart + Payment */}
        {mobileStep === 2 && (
          <div className="px-4 py-5 pb-36 space-y-4">
            {/* Cart items card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
              <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#186737] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
                Order Items
              </h2>
              {cartBlock}
              <div className="h-px bg-gray-100 my-4" />
              {discountBlock}
            </div>

            {/* Delivery options card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              {deliveryBlock}
            </div>

            {/* Payment form card */}

            {/* Price summary card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
              {pricingBlock}
            </div>
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
              <h2 className="text-sm font-bold text-gray-800 mb-4">
                Payment Details
              </h2>
              <CheckoutPayment
                squareAppId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
                squareLocationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
                onHandleReady={(h) => {
                  paymentHandleRef.current = h;
                }}
              />
            </div>
            {/* Fixed bottom Place Order CTA */}
            <div className=" bg-white border-t border-gray-100 px-4 py-3 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.07)]">
              <div className={`flex items-start gap-3 p-3 rounded-md border mb-3 ${termsError ? "border-red-400 bg-red-50" : "border-gray-200"}`}>
                <input
                  id="terms-checkbox-mobile"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (e.target.checked) setTermsError(false);
                  }}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#186737] cursor-pointer"
                />
                <div>
                  <label htmlFor="terms-checkbox-mobile" className="text-xs text-gray-700 cursor-pointer">
                    Please read our Terms and conditions before proceeding with the payments.
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="flex items-center gap-1 text-[#186737] text-xs font-medium hover:underline mt-0.5"
                  >
                    Terms and Conditions
                    <span className="w-3.5 h-3.5 rounded-full border border-[#186737] text-[9px] font-bold flex items-center justify-center leading-none">?</span>
                  </button>
                  {termsError && (
                    <p className="text-[11px] text-red-500 mt-0.5">⚠ Please accept the terms and conditions to proceed</p>
                  )}
                </div>
              </div>
              {orderError && (
                <div className="mb-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-red-700">{orderError}</p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileStep(1);
                    window.scrollTo(0, 0);
                  }}
                  className="flex items-center gap-1.5 px-4 py-3.5 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
                >
                  <ChevronRight size={15} className="rotate-180" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={isPlacingOrder}
                  onClick={handlePlaceOrder}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] text-white font-semibold py-3.5 rounded-[7px] text-sm transition-all"
                >
                  {isPlacingOrder ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order {currencySymbol}
                      {usd(grandTotal)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showShippingPolicyModal}
        onClose={() => setShowShippingPolicyModal(false)}
        title="Freight Delivery & Inspection Policy"
        width="max-w-4xl"
      >
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4 sticky top-0 z-10">
            <p className="text-yellow-800 font-semibold">
              ⚠️ Important: You or any person receiving the delivery on your
              behalf must thoroughly inspect the shipment before signing.
            </p>
          </div>
          <p className="text-gray-900 font-medium">
            Please carefully follow the step-by-step instructions below. By
            following these steps, you may be eligible to file a claim in case of
            damaged items.
          </p>
          <div className="bg-red-50 border border-red-200 p-3 rounded-md">
            <p className="text-red-700 font-semibold">
              TheHorecaStore.com will not be responsible for any shipment that is
              signed for without complete inspection.
            </p>
            <p className="text-red-600 text-sm mt-1">
              You should never feel pressured by the delivery driver to sign
              unless you are fully satisfied with the condition of your order.
            </p>
          </div>
          <h4 className="text-base font-bold text-gray-900 mt-6 flex items-center gap-2">
            <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
            Standard Freight Delivery Policy
          </h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>Standard freight delivery means the driver will deliver your order to the edge of the truck only.</li>
            <li>If you select Standard Delivery, you are responsible for unloading the shipment.</li>
            <li>The driver may park the truck at the closest safe location, such as a loading dock or delivery entrance.</li>
            <li>The driver will not unload the freight or bring it inside your premises.</li>
          </ul>
          <h4 className="text-base font-bold text-gray-900 mt-6 flex items-center gap-2">
            <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
            Inspect Outer Packaging Before Signing
          </h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>Carefully examine the external packaging for any visible damage.</li>
            <li>If you notice dents, tears, broken pallets, or crushed boxes, <strong className="text-red-600">do not accept the shipment</strong>.</li>
            <li>Inform the driver that you are refusing delivery due to visible damage.</li>
            <li><strong className="text-red-600">Do not sign the delivery receipt for damaged shipments.</strong></li>
          </ul>
          <h4 className="text-base font-bold text-gray-900 mt-6 flex items-center gap-2">
            <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
            Signing for the Delivery
          </h4>
          <p className="font-semibold text-gray-900">You may sign for the shipment only after:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fully inspecting all items</li>
            <li>Confirming there is no major damage or missing parts</li>
          </ul>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
            <p className="font-bold text-red-900 mb-2">⚠️ Critical Warning:</p>
            <p className="text-red-800 text-sm mb-2">Once a shipment is signed and accepted:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-red-700">
              <li>The customer becomes responsible for any freight claims</li>
              <li>TheHorecaStore.com is not obligated to replace or compensate for transit damage</li>
            </ul>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Order & Delivery Acknowledgement"
        width="max-w-4xl"
      >
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">
            Order &amp; Delivery Acknowledgement
          </h3>
          <p>
            This Order &amp; Delivery Acknowledgement (&quot;Declaration&quot;) is entered into
            by the undersigned Customer and The HorecaStore INC, with its
            registered office in Houston, Texas, United States.
          </p>
          <p>
            By placing an order and/or signing this Declaration, the Customer
            confirms that they have read, understood, and agreed to the following
            terms:
          </p>
          <h4 className="text-base font-semibold text-gray-900 mt-4">
            1. Order Confirmation &amp; Scope
          </h4>
          <p>
            All products, services, and delivery options included in the order are
            limited strictly to what is stated on the invoice and order
            confirmation. No verbal assurances, assumptions, or third-party
            statements shall be considered binding unless expressly documented in
            writing by The HorecaStore INC.
          </p>
          <h4 className="text-base font-semibold text-gray-900 mt-4">
            2. Delivery Type &amp; Access
          </h4>
          <p>
            Unless explicitly stated and paid for on the invoice, delivery is
            curbside delivery only. Any movement of the product beyond the curb,
            driveway, gate, threshold, or building entrance constitutes inside
            delivery and is not included unless purchased separately.
          </p>
        </div>
      </Modal>

      {/* â DESKTOP LAYOUT â€" 2-column (hidden on mobile) */}
      <div className="hidden lg:block global-container bg-white">
        <div className="grid grid-cols-1 relative lg:grid-cols-[60%_40%] max-w-7xl mx-auto relative">
          {/* â"€â"€ LEFT  */}
          <div className="px-6 md:px-12 xl:px-20 py-10 pt-0 border-r border-gray-100">
            {/* <CheckoutPayment
              squareAppId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
              squareLocationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
              onHandleReady={(h) => {
                paymentHandleRef.current = h;
              }}
            /> */}
            <div className="flex items-center gap-3 mb-6" />
            {contactBlock}
            {addressBlock}
            <div className="h-px bg-gray-200 my-4" />
            {deliveryBlock}
            <div className="h-px bg-gray-200 my-4" />
            <CheckoutPayment
              squareAppId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
              squareLocationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
              onHandleReady={(h) => {
                paymentHandleRef.current = h;
              }}
            />
            {placeOrderBtn}
          </div>

          {/* â"€â"€ RIGHT â€" Order Summary  */}
          <div className=" bg-[#fafafa] sticky top-0 ">
            <div className="bg-[#fafafa] border-l border-gray-100 px-6 md:px-10 py-10 sticky top-0">
              {cartBlock}
              {discountBlock}

              <div className="h-px bg-gray-200 my-4" />
              {pricingBlock}
              {/* {placeOrderBtn} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// â"€â"€â"€ Sub-components

function Field({
  value,
  onChange,
  type = "text",
  placeholder,
  disable,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disable?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disable}
      className={`w-full h-12 px-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white placeholder:text-gray-400 transition-all ${disable ? "cursor-not-allowed" : ""}`}
    />
  );
}

function PriceRow({
  label,
  value,
  green = false,
  muted = false,
}: {
  label: string;
  value: string;
  green?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <span
        className={`font-medium ${green ? "text-[#186737]" : muted ? "text-gray-400 italic text-xs" : "text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
}
