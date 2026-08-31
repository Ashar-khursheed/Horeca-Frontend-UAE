"use client";

import CTA from "@/components/cta";
import { useCartId } from "@/utils/cartId";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import Link from "next/link";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PaymentDeclinePage() {
  const cartId = useCartId();
  const cartHref = cartId ? `/cart/${cartId}` : "/cart";

  return (
    <div className="min-h-screens bg-[#E2E8F066] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-7xl bg-white rounded-[10px] shadow-lg overflow-hidden">
        {/* ── Red stripe ───────────────────────────────────────────────────── */}
        <div className="h-2 w-full bg-linear-to-r from-red-600 via-red-500 to-red-600" />

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-0">
          {/* ── LEFT ────────────────────────────────────────────────────────── */}
          <div className="p-6 sm:p-8 lg:border-r border-gray-100">
            {/* Status icon + heading */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-red-50 border-4 border-red-500 flex items-center justify-center shrink-0 shadow-sm">
                <XCircle size={26} className="text-red-500" />
              </div>
              <div>
                <h1 className="text-xl md:text-[22px] font-black text-red-600">
                  Payment Declined
                </h1>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  We couldn&apos;t process your payment for this order.
                  Don&apos;t worry — your card has not been charged and your
                  cart items are still saved.
                </p>
              </div>
            </div>

            {/* Common reasons */}
            <div className="bg-red-50 border border-red-100 rounded-[7px] p-4 mb-5">
              <p className="text-sm font-bold text-red-800 mb-2.5 flex items-center gap-2">
                <AlertTriangle size={15} className="text-red-500" />
                Common Reasons for Decline
              </p>
              <ul className="space-y-1.5">
                {[
                  "Incorrect card number, expiry date, or CVV",
                  "Billing address doesn't match your bank records",
                  "Insufficient funds or card limit exceeded",
                  "Your bank flagged the transaction for security review",
                ].map((reason) => (
                  <li
                    key={reason}
                    className="flex items-start gap-2 text-xs text-red-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* What you can do */}
            <div className="mb-5">
              <p className="text-sm font-bold text-gray-800 mb-3">
                What you can do next
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  {
                    Icon: CreditCard,
                    title: "Check Your Card",
                    desc: "Verify the card number, expiry and CVV are correct",
                  },
                  {
                    Icon: Wallet,
                    title: "Try Another Method",
                    desc: "Use a different card or payment option",
                  },
                  {
                    Icon: Landmark,
                    title: "Contact Your Bank",
                    desc: "Ask your bank to approve the transaction",
                  },
                ].map(({ Icon, title, desc }) => (
                  <div
                    key={title}
                    className="border border-gray-100 rounded-[7px] p-3.5 bg-gray-50/60"
                  >
                    <div className="w-8 h-8 rounded-[7px] bg-white border border-gray-200 flex items-center justify-center mb-2">
                      <Icon size={15} className="text-[#186737]" />
                    </div>
                    <p className="text-xs font-bold text-gray-800 mb-0.5">
                      {title}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-snug">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100 mb-5" />

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/checkout"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#186737] hover:bg-[#145a2d] active:scale-[0.98] text-white text-sm font-semibold py-3.5 rounded-[7px] transition-all shadow-md shadow-green-900/20"
              >
                <RotateCcw size={15} />
                Retry Payment
              </Link>
              <Link
                href={cartHref}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-[#186737] text-gray-600 hover:text-[#186737] text-sm font-semibold py-3.5 rounded-[7px] transition-all"
              >
                <ArrowLeft size={15} />
                Back to Cart
              </Link>
            </div>
          </div>

          {/* ── RIGHT ───────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 p-6 sm:p-6 bg-gray-50/40 lg:bg-transparent border-t lg:border-t-0 border-gray-100">
            {/* Support */}
            <CTA />

            {/* Trust badges */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  {
                    Icon: ShieldCheck,
                    label: "Secure",
                    desc: "SSL encrypted",
                  },
                  { Icon: RotateCcw, label: "Returns", desc: "30-day" },
                  { Icon: CheckCircle2, label: "Data Safe", desc: "Private" },
                ].map(({ Icon, label, desc }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="w-9 h-9 rounded-[7px] bg-green-50 flex items-center justify-center">
                      <Icon size={16} className="text-[#186737]" />
                    </div>
                    <p className="text-[10.5px] font-semibold text-gray-700 leading-tight">
                      {label}
                    </p>
                    <p className="text-[9px] text-gray-400">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
