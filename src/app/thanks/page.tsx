"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { CheckCircle2, MessageCircle, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── Page ─────────────────────────────────────────────────────────────────────
// Landing page for legacy payment-gateway redirect URLs (?id=… for Paymob,
// ?session_id=… for Stripe, or neither for CCAvenue) that still point at
// /thanks. Pings the matching backend endpoint to finalize the order, then
// shows a confirmation screen.
export default function ThanksPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "done">("pending");
  const notified = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (notified.current) return;
    notified.current = true;

    const id = searchParams.get("id");
    const sessionId = searchParams.get("session_id");
    const query = searchParams.toString();

    (async () => {
      try {
        if (id) {
          // Paymob
          await makeApiRequest(`paymob/thanks${query ? `?${query}` : ""}`);
        } else if (sessionId) {
          // Stripe
          await makeApiRequest(`stripe/thanks${query ? `?${query}` : ""}`);
        } else {
          // CCAvenue
          await makeApiRequest("ccavenue/thanks", { method: "POST" });
        }
      } catch (err) {
        console.error("Error confirming payment:", err);
      } finally {
        setStatus("done");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#E2E8F066] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-[10px] shadow-lg overflow-hidden">
        {/* ── Green stripe ─────────────────────────────────────────────────── */}
        <div className="h-2 w-full bg-linear-to-r from-[#186737] via-[#22a855] to-[#186737]" />

        <div className="p-6 sm:p-10 flex flex-col items-center text-center">
          {status === "pending" ? (
            <>
              <div className="w-16 h-16 rounded-full border-4 border-[#186737]/20 border-t-[#186737] animate-spin mb-5" />
              <p className="text-sm text-gray-500">Confirming your payment…</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-[#186737] flex items-center justify-center mb-5 shadow-sm">
                <CheckCircle2 size={40} className="text-[#186737]" />
              </div>
              <h1 className="text-2xl md:text-[28px] font-black text-[#186737] mb-3">
                Payment Successful
              </h1>
              <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-8">
                Thank you for your purchase! Your payment has been processed
                successfully and your order is now confirmed. We&apos;ll send
                you an email with your order details and shipping information
                shortly.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8">
                <Link
                  href="/dashboard/orders"
                  className="inline-flex items-center justify-center gap-2 bg-[#186737] hover:bg-[#145a2d] text-white text-sm font-semibold px-6 py-3 rounded-[7px] transition-colors"
                >
                  <Package size={15} />
                  View My Orders
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-[#186737] text-gray-600 hover:text-[#186737] text-sm font-semibold px-6 py-3 rounded-[7px] transition-colors"
                >
                  <ShoppingBag size={15} />
                  Continue Shopping
                </Link>
              </div>

              <div className="w-full border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-600 mb-3">
                  Need help with your order?
                </p>
                <Link
                  href="/pages/contact-us"
                  className="inline-flex items-center justify-center gap-2 bg-[#186737] hover:bg-[#145a2d] text-white text-sm font-semibold px-6 py-3 rounded-[7px] transition-colors"
                >
                  <MessageCircle size={15} />
                  Contact Support
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
