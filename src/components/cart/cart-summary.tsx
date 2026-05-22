"use client";

import {
  ArrowRight,
  Lock,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
  Tag,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CartItem, fmtPrice, TAX_RATE } from "./cart-types";

export default function CartSummary({ cartItems }: { cartItems: CartItem[] }) {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);

  const subtotal     = cartItems.reduce((s, c) => s + c.price * c.qty, 0);
  const shippingTotal = cartItems.reduce((s, c) => s + c.shippingCost * c.qty, 0);
  const promoDiscount = promoApplied ? subtotal * 0.1 : 0;
  const tax          = (subtotal - promoDiscount) * TAX_RATE;
  const grandTotal   = subtotal + shippingTotal - promoDiscount + tax;
  const totalItems   = cartItems.reduce((s, c) => s + c.qty, 0);

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
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-sm">Summary Cart</h2>
        </div>

        <div className="p-5 space-y-3">
          <div className="space-y-2.5 text-sm">
            <SummaryRow
              label={`Subtotal (${totalItems} item${totalItems !== 1 ? "s" : ""})`}
              value={`$${fmtPrice(subtotal)}`}
            />
            <SummaryRow
              label={`Shipping & Handling (${cartItems.length} item${cartItems.length !== 1 ? "s" : ""})`}
              value={shippingTotal === 0 ? "Free" : `$${fmtPrice(shippingTotal)}`}
              green={shippingTotal === 0}
            />
            {promoApplied && (
              <SummaryRow
                label="Promo (HORECA10)"
                value={`-$${fmtPrice(promoDiscount)}`}
                green
                icon={<Tag size={12} />}
              />
            )}
            <SummaryRow label="Tax (8.25%)" value={`$${fmtPrice(tax)}`} />
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="font-bold text-gray-900 text-xl">${fmtPrice(grandTotal)}</span>
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
                onChange={(e) => { setPromoCode(e.target.value); setPromoError(false); }}
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

          <Link
            href="/checkout"
            className="w-full py-3 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors duration-200"
          >
            Confirm &amp; Pay <ArrowRight size={16} />
          </Link>

          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            By placing your order, you agree to HorecaStore&apos;s{" "}
            <Link href="/" className="underline hover:text-[#186737]">Privacy Policy</Link>{" "}
            and{" "}
            <Link href="/" className="underline hover:text-[#186737]">Conditions of Use</Link>.
          </p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4 space-y-3">
        <TrustBadge icon={Lock} title="Secure Payment" desc="Every transaction is secured and encrypted." />
        <TrustBadge icon={RotateCcw} title="Returns & Refunds" desc="Return items within 14 days for a refund or exchange." />
        <TrustBadge icon={ShieldCheck} title="Data Protection" desc="Your personal data is secure and never shared." />
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

      {/* Need Help */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
        <div className="flex items-start gap-3 mb-3.5">
          <div className="w-9 h-9 rounded-full bg-[#f0f9f4] border-2 border-[#c3e6d4] flex items-center justify-center shrink-0">
            <MessageCircle size={15} className="text-[#186737]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Need Help Placing Order</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
              Our Customer Success Team will guide you with every step.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors">
            <MessageCircle size={13} /> Chat Now
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors">
            <Phone size={13} /> Call Now
          </button>
        </div>
      </div>
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
  value: string;
  green?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={`flex items-center gap-1 ${green ? "text-[#186737]" : "text-gray-500"}`}>
        {icon} {label}
      </span>
      <span className={`font-semibold ${green ? "text-[#186737]" : "text-gray-900"}`}>{value}</span>
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
