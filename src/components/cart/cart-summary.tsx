"use client";

import {
  ArrowRight,
  Lock,
  MessageCircle,
  Phone,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  Tag,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { CartItem, fmtPrice } from "./cart-types";
import CTA from "../cta";
import { CurrencySymbol } from "../currency-symbol";
import {
  getUaeOrderShipping,
  isUaeShippingMarket,
  UAE_FREE_SHIPPING_MIN,
} from "@/utils/shipping";
import { UAE_VAT_RATE } from "dirham";

const CART_SUMMARY_KEY = "hc_cart_summary";

export default function CartSummary({ cartItems }: { cartItems: CartItem[] }) {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const country = useAppSelector((s) => s.country);
  // Sourced from the `frontend/countries/...` API response in Redux (state.country.data.name) —
  // VAT and the (lower) processing-fee rate only apply within the UAE.
  const isUAEUser = country?.data?.name === "United Arab Emirates";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const currencySymbol = cartItems[0]?.currencySymbol ?? "$";
  const subtotal = cartItems.reduce((s, c) => {
    const accessoriesTotal = (c.selectedAccessories ?? []).reduce(
      (a, acc) => a + (parseFloat(String(acc.price ?? 0)) || 0),
      0,
    );
    return s + (c.price + accessoriesTotal) * c.qty;
  }, 0);
  const isUaeShipping = isUaeShippingMarket({
    countryName: country?.data?.name,
    currencySymbol,
  });
  const itemShippingTotal = cartItems.reduce(
    (s, c) => s + c.shippingCost * c.qty,
    0,
  );
  const shippingTotal = isUaeShipping
    ? getUaeOrderShipping(subtotal)
    : itemShippingTotal;
  const freeShippingRemaining = isUaeShipping
    ? Math.max(0, UAE_FREE_SHIPPING_MIN - subtotal)
    : 0;
  const promoDiscount = promoApplied ? subtotal * 0.1 : 0;
  const taxable = subtotal - promoDiscount;
  // Processing fee: 2.95% for UAE addresses, 3.95% for everywhere else
  const PAYMENT_PROCESSING_FEE_RATE = isUAEUser ? 2.95 : 3.95;
  const paymentProcessingFee = (taxable * PAYMENT_PROCESSING_FEE_RATE) / 100;
  const ratePercent = isUAEUser ? UAE_VAT_RATE * 100 : 0; // VAT applies only within the UAE
  const taxRate = ratePercent / 100;
  // VAT calculated on subtotal (after discount) + processing fee + shipping
  const amountBeforeVAT = taxable + paymentProcessingFee + shippingTotal;
  const totalTax    = amountBeforeVAT * taxRate;
  const grandTotal   = amountBeforeVAT + totalTax;
  const totalItems = cartItems.reduce((s, c) => s + c.qty, 0);

  // ── Build summary object ───────────────────────────────────────────────────
  const buildSummary = () => ({
    subTotal:                subtotal,
    discountAmount:          promoDiscount,
    discountedSubtotal:      taxable,
    checkPaymentDiscount:    0,
    finalDiscountedSubtotal: taxable,
    shipping:                0,
    totalShippingCharges:    shippingTotal,    // API actual or location tier (99/199/299)
    liftGateFee:             0,
    residentialFee:          0,
    insideDeliveryFee:       0,
    additionalCharge:        0,
    additionalFees:          0,
    paymentProcessingFee:    paymentProcessingFee,
    paymentProcessingFeeRate: PAYMENT_PROCESSING_FEE_RATE,
    taxableAmount:           amountBeforeVAT,
    taxAmount:               totalTax,
    total:                   grandTotal,
    taxRatePercentage:       ratePercent,
    isCouponApplied:         promoApplied,
  });

  // ── Auto-save whenever cart items or promo changes ─────────────────────────
  useEffect(() => {
    if (cartItems.length === 0) return;
    try {
      localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(buildSummary()));
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, promoApplied, subtotal, shippingTotal, paymentProcessingFee, totalTax, grandTotal, ratePercent]);

  // ── Save + navigate on "Confirm & Pay" ────────────────────────────────────
  const handleConfirm = () => {
    try {
      localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(buildSummary()));
    } catch { /* ignore */ }
    router.push(isLoggedIn ? "/checkout" : "/loginOrder");
  };

  const handlePromo = () => {
    if (promoCode.toUpperCase() === "HORECA10") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  return (
    <div className="sticky top-24 space-y-4">
      {/* Order Summary */}
      {cartItems.length > 0 && (
        <>
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-sm">Summary Cart</h2>
            </div>

            <div className="p-5 space-y-3">
              <div className="space-y-2.5 text-sm">
                <SummaryRow
                  label={`Products Subtotal (${totalItems} item${totalItems !== 1 ? "s" : ""})`}
                  value={
                    <>
                      <CurrencySymbol currency={currencySymbol} fontsize="14px" />
                      {fmtPrice(subtotal)}
                    </>
                  }
                />
                {promoApplied && (
                  <SummaryRow
                    label="Promo (HORECA10)"
                    value={
                      <>
                        -<CurrencySymbol currency={currencySymbol} fontsize="14px" />
                        {fmtPrice(promoDiscount)}
                      </>
                    }
                    green
                    icon={<Tag size={12} />}
                  />
                )}
                <SummaryRow
                  label={`Payment Processing Fee (${PAYMENT_PROCESSING_FEE_RATE}%)`}
                  value={
                    <>
                      <CurrencySymbol currency={currencySymbol} fontsize="14px" />
                      {fmtPrice(paymentProcessingFee)}
                    </>
                  }
                />
                {isUaeShipping && (
                  <>
                    <SummaryRow
                      label="Shipping & Handling"
                      value={
                        shippingTotal > 0 ? (
                          <>
                            <CurrencySymbol currency={currencySymbol} fontsize="14px" />
                            {fmtPrice(shippingTotal)}
                          </>
                        ) : (
                          <span className="text-[#186737] font-semibold">Free</span>
                        )
                      }
                    />
                    {freeShippingRemaining > 0 && (
                      <p className="text-[11px] text-gray-500">
                        Add{" "}
                        <CurrencySymbol currency={currencySymbol} fontsize="11px" />
                        {fmtPrice(freeShippingRemaining)} more for free shipping
                        (orders of{" "}
                        <CurrencySymbol currency={currencySymbol} fontsize="11px" />
                        {fmtPrice(UAE_FREE_SHIPPING_MIN)}+)
                      </p>
                    )}
                  </>
                )}
                {ratePercent > 0 && (
                  <>
                    <SummaryRow
                      label="Amount Before VAT"
                      value={
                        <>
                          <CurrencySymbol currency={currencySymbol} fontsize="14px" />
                          {fmtPrice(amountBeforeVAT)}
                        </>
                      }
                    />
                    <SummaryRow
                      label={`VAT (${ratePercent.toFixed(2)}%)`}
                      value={
                        <>
                          <CurrencySymbol currency={currencySymbol} fontsize="14px" />
                          {fmtPrice(totalTax)}
                        </>
                      }
                    />
                  </>
                )}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900">Your Total</span>
                <span className="font-bold text-gray-900 text-xl">
                  <CurrencySymbol currency={currencySymbol} weight="bold" fontsize="18px" />
                  {fmtPrice(grandTotal)}
                </span>
              </div>

              {/* Promo code */}
              <div className="hidden ">
                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                  <Tag size={12} className="text-[#186737]" /> Promo Code
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError(false);
                    }}
                    placeholder="Enter code"
                    disabled={promoApplied}
                    className="flex-1 h-9 px-3 rounded-[7px] border border-gray-200 text-xs outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white disabled:bg-gray-50"
                  />
                  <button
                    onClick={handlePromo}
                    disabled={promoApplied}
                    className="h-9 px-3 rounded-[7px] bg-[#186737] hover:bg-[#145c30] disabled:bg-emerald-600 text-white text-xs font-semibold transition-colors shrink-0"
                  >
                    {promoApplied ? <CheckCircle size={14} /> : "Apply"}
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-red-500 mt-1">
                    Invalid code. Try <strong>HORECA10</strong>.
                  </p>
                )}
                {promoApplied && (
                  <p className="text-[11px] text-[#186737] font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle size={11} /> 10% discount applied!
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-3 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors duration-200"
              >
                Confirm &amp; Pay <ArrowRight size={16} />
              </button>

              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                By placing your order, you agree to HorecaStore&apos;s{" "}
                <Link
                  href="/pages/return-policy"
                  className="underline hover:text-[#186737]"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/pages/return-policy"
                  className="underline hover:text-[#186737]"
                >
                  Conditions of Use
                </Link>
                .
              </p>
            </div>
          </div>
        </>
      )}

      {/* Trust badges */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4 space-y-3">
        <TrustBadge
          icon={Lock}
          title="Secure Payment"
          desc="Every transaction is secured and encrypted."
        />
        <TrustBadge
          icon={RotateCcw}
          title="Returns & Refunds"
          desc="Return items within 14 days for a refund or exchange."
        />
        <TrustBadge
          icon={ShieldCheck}
          title="Data Protection"
          desc="Your personal data is secure and never shared."
        />
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          {["VISA", "MC", "PCI", "SSL"].map((badge) => (
            <span
              key={badge}
              className="text-[9px] font-black border border-gray-200 rounded px-1.5 py-0.5 text-gray-500 tracking-wider"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <CTA/>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SummaryRow({
  label,
  value,
  green,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  green?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span
        className={`flex items-center gap-1 ${green ? "text-[#186737]" : "text-gray-500"}`}
      >
        {icon} {label}
      </span>
      <span
        className={`font-semibold ${green ? "text-[#186737]" : "text-gray-900"}`}
      >
        {value}
      </span>
    </div>
  );
}

function TrustBadge({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-[#f0f9f4] flex items-center justify-center shrink-0">
        <Icon size={13} className="text-[#186737]" />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-800">{title}</p>
        <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
