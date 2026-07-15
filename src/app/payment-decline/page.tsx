"use client";

import { useCartId } from "@/utils/cartId";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Shield,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem {
  id: number;
  name: string;
  sku: string;
  image: string;
  price: number;
  originalPrice: number;
  qty: number;
  deliveryDays: string;
  shipping: number;
  currency: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const DECLINED_CART: CartItem[] = [
  {
    id: 1,
    name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
    sku: "TBC-36SB-N6",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-36SB-N6_6bb5506e-9c7b-45cb-8134-5944faa67a1a.webp",
    price: 1916.21,
    originalPrice: 2395.26,
    qty: 1,
    deliveryDays: "5 to 7 Days",
    shipping: 195.0,
    currency: "$",
  },
  {
    id: 2,
    name: "BakeMax BMPM080 80 Qt. Planetary Mixer, Floor Model",
    sku: "BMPM080",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_7JiqdDIooIC58z6kKhvJ.webp",
    price: 19990.26,
    originalPrice: 22423.0,
    qty: 1,
    deliveryDays: "5 to 7 Days",
    shipping: 350.0,
    currency: "$",
  },
  {
    id: 3,
    name: 'Turbo Air TBC-24SB-N6 24" Super Deluxe Bottle Cooler, 3.6 cu. Ft.',
    sku: "TBC-24SB-N6",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-24SB-N6_196b76cb-f68f-4bb2-a05e-e3da2f0b30b4.webp",
    price: 1941.3,
    originalPrice: 2426.63,
    qty: 2,
    deliveryDays: "5 to 7 Days",
    shipping: 0,
    currency: "$",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const usd = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const subtotal = DECLINED_CART.reduce((s, i) => s + i.price * i.qty, 0);
const shippingTotal = DECLINED_CART.reduce((s, i) => s + i.shipping, 0);
const taxRate = 0.0825;
const taxAmount = subtotal * taxRate;
const total = subtotal + shippingTotal + taxAmount;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PaymentDeclinePage() {
  const cartId = useCartId();
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container py-3 flex items-center gap-2 text-sm">
          <Link     href={`/cart/${cartId}`} className="text-[#186737] hover:underline flex items-center gap-1.5">
            <ShoppingBag size={13} /> Cart
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/checkout" className="text-[#186737] hover:underline">
            Checkout
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-red-600">Payment Failed</span>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="global-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Payment Failed Alert */}
            <section className="bg-white rounded-[7px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-red-100 overflow-hidden">
              {/* Red top stripe */}
              <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-red-400" />
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 mt-0.5 hidden">
                    <XCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-lg font-bold text-red-700 mb-1 flex items-center gap-2">
                      <AlertCircle size={18} className="text-red-500" />
                      Payment Declined
                    </h1>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      Unfortunately, your payment for this{" "}
                      <Link href="/checkout" className="text-blue-600 underline hover:text-blue-700">
                        Order
                      </Link>{" "}
                      has been declined.
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      An issuing bank will often decline an attempt to charge a card if the name,
                      expiry date, or post code you entered doesn&apos;t match the bank&apos;s information.
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      In order to proceed with your order and avoid cancellation, we kindly ask you
                      to update your payment method to a valid credit card.
                    </p>

                    {/* Possible Reasons */}
                    <div className="bg-red-50 border border-red-100 rounded-[7px] p-4 mb-5">
                      <p className="text-sm font-semibold text-red-800 mb-2">Common Reasons for Decline:</p>
                      <ul className="space-y-1.5">
                        {[
                          "Incorrect card number, expiry date, or CVV",
                          "Billing address doesn't match bank records",
                          "Insufficient funds or card limit exceeded",
                          "Bank flagged the transaction for security",
                        ].map((reason) => (
                          <li key={reason} className="flex items-start gap-2 text-xs text-red-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 mb-4">
                      Please visit your order details to update the payment information for your order.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/checkout"
                        className="inline-flex items-center gap-2 bg-[#186737] hover:bg-[#145a2d] text-white text-sm font-semibold px-5 py-2.5 rounded-[7px] transition-colors"
                      >
                        Update Payment Method
                      </Link>
                      <Link
               href={`/cart/${cartId}`}
                        className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-[#186737] hover:text-[#186737] text-sm font-semibold px-5 py-2.5 rounded-[7px] transition-colors"
                      >
                        <ArrowLeft size={15} />
                        Back to Cart
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cart Summary */}
            <section className="bg-white rounded-[7px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={15} className="text-[#186737]" />
                  <h2 className="font-semibold text-gray-800">Cart Summary</h2>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
                  {DECLINED_CART.length} items
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {DECLINED_CART.map((item) => (
                  <div key={item.id} className="p-5">
                    <p className="text-[#B12704] text-xs font-semibold mb-3 flex items-center gap-1.5">
                      <Truck size={12} />
                      Shipping by {item.deliveryDays}
                    </p>
                    <div className="flex gap-4">
                      <div className="w-28 h-28 rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 mb-1">Model No: {item.sku}</p>
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Qty: {item.qty}
                        </p>
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <Truck size={11} className="text-[#186737]" />
                          Shipping charges apply
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-gray-900">
                            {item.currency}{usd(item.price)}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {item.currency}{usd(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Support */}
            <section className="bg-white rounded-[7px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Our support team is available 24/7 to assist you with any payment issues.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/pages/contact-us"
                  className="inline-flex items-center gap-2 bg-[#186737] hover:bg-[#145a2d] text-white text-sm font-semibold px-5 py-2.5 rounded-[7px] transition-colors"
                >
                  <MessageCircle size={15} />
                  Contact Support
                </Link>
                <a
                  href="tel:+1-800-000-0000"
                  className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-[#186737] hover:text-[#186737] text-sm font-semibold px-5 py-2.5 rounded-[7px] transition-colors"
                >
                  <Phone size={15} />
                  Call Us
                </a>
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN — Order Summary ────────────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-6">

            {/* Declined badge */}
            <div className="bg-red-50 border border-red-200 rounded-[7px] p-4 flex items-center gap-3">
              <XCircle size={22} className="text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-700">Payment Declined</p>
                <p className="text-xs text-red-500 mt-0.5">Your order was not placed</p>
              </div>
            </div>

            {/* Price breakdown */}
            <section className="bg-white rounded-[7px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
                <Package size={15} className="text-[#186737]" />
                Cart Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="h-px bg-gray-100" />

                <PriceLine
                  label={`Subtotal (${DECLINED_CART.length} items)`}
                  value={`$${usd(subtotal)}`}
                />
                <PriceLine
                  label="Shipping & Handling"
                  value={shippingTotal === 0 ? "Free" : `$${usd(shippingTotal)}`}
                  valueClass={shippingTotal === 0 ? "text-[#186737]" : undefined}
                />
                <PriceLine
                  label={`Tax (${(taxRate * 100).toFixed(2)}%)`}
                  value={`$${usd(taxAmount)}`}
                />

                <div className="h-px bg-gray-100" />

                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-gray-800 text-base">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">${usd(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-5 w-full bg-[#186737] hover:bg-[#145a2d] active:scale-[0.98] text-white font-semibold py-3.5 rounded-[7px] transition-all duration-150 flex items-center justify-center gap-2 text-sm shadow-md shadow-green-900/20"
              >
                Retry Payment
              </Link>

              <Link
             href={`/cart/${cartId}`}
                className="mt-2.5 w-full border border-gray-200 hover:border-[#186737] text-gray-600 hover:text-[#186737] font-semibold py-3 rounded-[7px] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft size={15} />
                Back to Cart
              </Link>
            </section>

            {/* Trust Badges */}
            <section className="bg-white rounded-[7px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 p-5">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { Icon: Shield, label: "Secure Payment", desc: "SSL encrypted" },
                  { Icon: RotateCcw, label: "Easy Returns", desc: "30-day policy" },
                  { Icon: CheckCircle2, label: "Data Safe", desc: "Never shared" },
                ].map(({ Icon, label, desc }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 rounded-[7px] bg-green-50 flex items-center justify-center">
                      <Icon size={16} className="text-[#186737]" />
                    </div>
                    <p className="text-[11px] font-semibold text-gray-700 leading-tight">{label}</p>
                    <p className="text-[10px] text-gray-400">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Help Links */}
            <section className="bg-white rounded-[7px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 p-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">
                Quick Links
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { Icon: MessageCircle, label: "Live Chat", href: "/pages/contact-us" },
                  { Icon: Phone, label: "Call Us", href: "tel:+1-800-000-0000" },
                ].map(({ Icon, label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-[7px] border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-[#186737] hover:text-[#186737] transition-all"
                  >
                    <Icon size={14} className="text-[#186737]" />
                    {label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function PriceLine({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span>
      <span className={`font-medium ${valueClass ?? ""}`}>{value}</span>
    </div>
  );
}
