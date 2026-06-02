"use client";

import {
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Share2,
  Shield,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderProduct {
  id: number;
  name: string;
  sku: string;
  image: string;
  qty: number;
  price: number;
  originalPrice: number;
  deliveryDays: string;
  shipping: number;
  brand: string;
  currency: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ORDER_NUMBER = "HS-20260518-4821";

const USER = {
  name: "John Mitchell",
  email: "john.mitchell@example.com",
  phone: "+1 (310) 555-0192",
};

const DELIVERY_ADDRESS = {
  line1: "0000 Los Angeles Memorial Lewis & Blvd",
  city: "Los Angeles",
  state: "California",
  zip: "90015",
  country: "United States",
};

const ORDER_PRODUCTS: OrderProduct[] = [
  {
    id: 1,
    name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
    sku: "TBC-36SB-N6",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-36SB-N6_6bb5506e-9c7b-45cb-8134-5944faa67a1a.webp",
    qty: 1,
    price: 1916.21,
    originalPrice: 2395.26,
    deliveryDays: "5 to 7 Days",
    shipping: 195.0,
    brand: "Turbo Air",
    currency: "$",
  },
  {
    id: 2,
    name: "BakeMax BMPM080 80 Qt. Planetary Mixer, Floor Model",
    sku: "BMPM080",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_7JiqdDIooIC58z6kKhvJ.webp",
    qty: 1,
    price: 19990.26,
    originalPrice: 22423.0,
    deliveryDays: "5 to 7 Days",
    shipping: 350.0,
    brand: "BakeMax",
    currency: "$",
  },
  {
    id: 3,
    name: 'Turbo Air TBC-24SB-N6 24" Super Deluxe Bottle Cooler, 3.6 cu. Ft.',
    sku: "TBC-24SB-N6",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-24SB-N6_196b76cb-f68f-4bb2-a05e-e3da2f0b30b4.webp",
    qty: 2,
    price: 1941.3,
    originalPrice: 2426.63,
    deliveryDays: "5 to 7 Days",
    shipping: 0,
    brand: "Turbo Air",
    currency: "$",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const usd = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const subtotal = ORDER_PRODUCTS.reduce((s, i) => s + i.price * i.qty, 0);
const shippingTotal = ORDER_PRODUCTS.reduce((s, i) => s + i.shipping, 0);
const taxRate = 0.0825;
const taxAmount = subtotal * taxRate;
const total = subtotal + shippingTotal + taxAmount;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PaymentSuccessPage() {
  const handleWhatsApp = () => {
    const message = ORDER_PRODUCTS.map(
      (p) =>
        `Product: ${p.name}\nSKU: ${p.sku}\nQty: ${p.qty}\nPrice: ${p.currency}${usd(p.price)}\n---`
    ).join("\n");
    const encoded = encodeURIComponent(
      `Order #${ORDER_NUMBER} placed successfully!\n\n${message}`
    );
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  const handleEmail = () => {
    const body = ORDER_PRODUCTS.map(
      (p) =>
        `Product: ${p.name}\nSKU: ${p.sku}\nQty: ${p.qty}\nPrice: ${p.currency}${usd(p.price)}`
    ).join("\n\n---\n\n");
    const subject = encodeURIComponent(`Order #${ORDER_NUMBER} — Placed Successfully`);
    const encodedBody = encodeURIComponent(
      `Hi,\n\nYour order #${ORDER_NUMBER} has been placed!\n\n${body}\n\nTotal: $${usd(total)}`
    );
    window.open(`mailto:${USER.email}?subject=${subject}&body=${encodedBody}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#E2E8F066]">

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container py-3 flex items-center gap-1.5 text-sm overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="text-[#186737] hover:underline flex items-center gap-1 shrink-0">
            <ShoppingBag size={13} /> Home
          </Link>
          <ChevronRight size={13} className="text-gray-300 shrink-0" />
          <Link href="/cart" className="text-[#186737] hover:underline shrink-0">Cart</Link>
          <ChevronRight size={13} className="text-gray-300 shrink-0" />
          <Link href="/checkout" className="text-[#186737] hover:underline shrink-0">Checkout</Link>
          <ChevronRight size={13} className="text-gray-300 shrink-0" />
          <span className="font-semibold text-[#186737] shrink-0">Order Confirmed</span>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <div className="global-container py-8">
        <div className="bg-white rounded-[10px] shadow-lg overflow-hidden">

          {/* ── Green success stripe ─────────────────────────────────────────── */}
          <div className="h-2 w-full bg-linear-to-r from-[#186737] via-[#22a855] to-[#186737]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0">

            {/* ── LEFT ──────────────────────────────────────────────────────── */}
            <div className="p-4 sm:p-6 lg:p-8 border-r border-gray-100 order-2 lg:order-1">

              {/* Success heading */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-50 border-2 border-[#186737] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} className="text-[#186737]" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#186737] leading-snug">
                    Congratulations! Your Order has been placed successfully.
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Order Number:{" "}
                    <span className="text-[#186737] font-bold">#{ORDER_NUMBER}</span>
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-5" />

              {/* Confirmation info */}
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-2.5">
                  <Mail size={15} className="text-[#186737] mt-1 shrink-0" />
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Confirmation will be sent to your email at{" "}
                    <span className="text-[#186737] font-bold break-alls">{USER.email}</span>
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone size={15} className="text-[#186737] mt-1 shrink-0" />
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Our representative will call you at{" "}
                    <span className="text-[#186737] font-bold whitespace-nowrap">{USER.phone}</span>
                    . Kindly ensure the number is correct to avoid delivery delays.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-[#186737] mt-1 shrink-0" />
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Being delivered to{" "}
                    <span className="text-gray-800 font-semibold">
                      {DELIVERY_ADDRESS.line1}, {DELIVERY_ADDRESS.city},{" "}
                      {DELIVERY_ADDRESS.state} {DELIVERY_ADDRESS.zip},{" "}
                      {DELIVERY_ADDRESS.country}
                    </span>
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-5" />

              {/* Order items */}
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package size={16} className="text-[#186737]" />
                Order Items
              </h2>

              <div className="space-y-0 divide-y divide-gray-50 border border-gray-100 rounded-[7px] overflow-hidden">
                {ORDER_PRODUCTS.map((item) => (
                  <div key={item.id} className="p-4 bg-white hover:bg-gray-50/50 transition-colors">
                    <p className="text-[#B12704] text-xs font-semibold mb-3 flex items-center gap-1.5">
                      <Truck size={12} />
                      Estimated delivery: {item.deliveryDays}
                    </p>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
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
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 mb-0.5">
                          Brand: <span className="font-medium text-gray-600">{item.brand}</span>
                        </p>
                        <p className="text-xs text-gray-400 mb-0.5">
                          Model No: <span className="font-medium text-gray-600">{item.sku}</span>
                        </p>
                        <p className="text-xs text-gray-400 mb-2">
                          Qty: <span className="font-semibold text-gray-700">{item.qty}</span>
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-[#186737]">
                            {item.currency}{usd(item.price)}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {item.currency}{usd(item.originalPrice)}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">/ Each</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Truck size={11} className="text-[#186737]" />
                          {item.shipping === 0 ? (
                            <span className="text-[#186737] font-semibold">Free Shipping</span>
                          ) : (
                            `Shipping: $${usd(item.shipping)}`
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-100 my-5" />

              {/* Share section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Share2 size={15} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    Share order details via:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center gap-2 px-4 py-2 rounded-[7px] border border-gray-200 hover:border-[#25D366] hover:bg-green-50 transition-all text-sm font-medium text-gray-600 hover:text-[#25D366]"
                  >
                    <svg viewBox="0 0 32 32" className="w-5 h-5 fill-[#25D366]">
                      <path d="M16.004 0C7.164 0 0 7.163 0 16.004c0 2.82.738 5.47 2.027 7.775L0 32l8.45-2.008A15.93 15.93 0 0016.004 32C24.836 32 32 24.836 32 16.004 32 7.163 24.836 0 16.004 0zm0 29.23a13.19 13.19 0 01-6.73-1.843l-.483-.288-4.997 1.188 1.21-4.867-.316-.5A13.19 13.19 0 012.77 16.004c0-7.297 5.938-13.234 13.234-13.234s13.234 5.937 13.234 13.234-5.937 13.226-13.234 13.226zm7.264-9.903c-.397-.2-2.352-1.16-2.717-1.29-.364-.132-.63-.198-.895.199-.265.397-1.028 1.29-1.26 1.555-.232.265-.464.298-.861.1-.397-.2-1.677-.618-3.194-1.97-1.18-1.053-1.977-2.353-2.21-2.75-.232-.397-.025-.61.175-.808.18-.177.397-.464.596-.695.198-.232.264-.398.397-.663.133-.265.066-.497-.033-.696-.1-.199-.895-2.155-1.226-2.95-.323-.773-.651-.668-.895-.68l-.762-.013c-.265 0-.696.1-1.06.497-.364.397-1.39 1.358-1.39 3.313s1.423 3.843 1.622 4.107c.198.265 2.8 4.275 6.784 5.996.948.41 1.688.654 2.265.838.952.303 1.819.26 2.504.158.764-.114 2.352-.961 2.684-1.889.332-.928.332-1.722.232-1.888-.1-.166-.365-.265-.763-.464z" />
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    onClick={handleEmail}
                    className="flex items-center gap-2 px-4 py-2 rounded-[7px] border border-gray-200 hover:border-[#186737] hover:bg-green-50 transition-all text-sm font-medium text-gray-600 hover:text-[#186737]"
                  >
                    <Mail size={16} className="text-[#186737]" />
                    Email
                  </button>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-5" />

              {/* CTA buttons */}
              <div className="flex gap-3 w-full justify-between ">
              <div>
                  <Link
                  href="/dashboard/orders"
                  className="inline-flex items-center justify-center gap-2 bg-[#186737] hover:bg-[#145a2d] text-white text-sm font-semibold px-5 py-2.5 rounded-[7px] transition-colors w-full xs:w-auto"
                >
                  <Package size={15} />
                  View My Orders
                </Link>
              </div>
              <div>
                  <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-[#186737] text-gray-600 hover:text-[#186737] text-sm font-semibold px-5 py-2.5 rounded-[7px] transition-colors w-full xs:w-auto"
                >
                  Continue Shopping
                </Link>
              </div>
              </div>
            </div>

            {/* ── RIGHT ─────────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4 p-4 sm:p-6 order-1 lg:order-2 border-b border-gray-100 lg:border-b-0">

              {/* Thank You visual */}
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-[10px] p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-[#186737] flex items-center justify-center mb-4 shadow-md">
                  <CheckCircle2 size={38} className="text-[#186737]" />
                </div>
                <h2 className="text-2xl font-black text-[#186737]">Thank You!</h2>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Your order has been confirmed and is being processed.
                </p>
                <div className="mt-4 bg-white rounded-[7px] border border-green-200 px-4 py-2 w-full">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Order ID</p>
                  <p className="text-sm font-black text-[#186737] mt-0.5">#{ORDER_NUMBER}</p>
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-[#186737]" />
                  Order Summary
                </h3>
                <div className="space-y-2.5 text-sm">
                  <Row label={`Subtotal (${ORDER_PRODUCTS.length} items)`} value={`$${usd(subtotal)}`} />
                  <Row
                    label="Shipping & Handling"
                    value={shippingTotal === 0 ? "Free" : `$${usd(shippingTotal)}`}
                    valueClass={shippingTotal === 0 ? "text-[#186737]" : undefined}
                  />
                  <Row label={`Tax (${(taxRate * 100).toFixed(2)}%)`} value={`$${usd(taxAmount)}`} />
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-bold text-gray-800">Total Paid</span>
                    <span className="text-lg font-black text-[#186737]">${usd(total)}</span>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { Icon: Shield, label: "Secure", desc: "SSL encrypted" },
                    { Icon: RotateCcw, label: "Returns", desc: "30-day policy" },
                    { Icon: CheckCircle2, label: "Verified", desc: "Safe checkout" },
                  ].map(({ Icon, label, desc }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-[7px] bg-green-50 flex items-center justify-center">
                        <Icon size={14} className="text-[#186737]" />
                      </div>
                      <p className="text-[11px] font-bold text-gray-700">{label}</p>
                      <p className="text-[10px] text-gray-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">
                  Need Help?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { Icon: MessageCircle, label: "Live Chat", href: "/pages/contact-us" },
                    { Icon: Phone, label: "Call Us", href: "tel:+1-800-000-0000" },
                  ].map(({ Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] border border-gray-200 text-xs font-semibold text-gray-600 hover:border-[#186737] hover:text-[#186737] transition-all"
                    >
                      <Icon size={13} className="text-[#186737]" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────
function Row({
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
