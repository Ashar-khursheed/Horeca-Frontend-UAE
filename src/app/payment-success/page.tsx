"use client";

import {
  CheckCircle2,
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
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { makeApiRequest } from "@/apis/axios-instance";
import { ShareButtons } from "./_components/share-buttons";
import Breadcrumb from "@/components/breadcum";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderProduct {
  id: number;
  quantity: number;
  unit_price: string;
  shipping_charge: string | number;
  expected_shipping_date?: string;
  expectedShippingDate?: string;
  product_supplier: {
    delivery_days: string;
  } | null;
  product: {
    sku: string;
    name: { en: string } | string;
    brand?: { name: { en: string } };
    brand_name?: string;
    warranty_attribute?: { en: string };
    warranty?: string;
    image_urls?: { en: string[] } | string[];
    images?: string[];
    translations?: Array<{ name: string; image_urls: string }>;
  };
}

interface OrderData {
  order_number: string;
  amount: string;
  shipping_charge: string | number;
  is_lift_gate: number;
  is_residential_address: number;
  is_inside_delivery: number;
  tax_percentage: string;
  tax_amount: string;
  total_amount: string;
  customer_address: string;
  customer: {
    email: string;
    country_code: string;
    mobile_number: string;
  };
  order_products: OrderProduct[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const usd = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function parseAddress(raw: string) {
  const clean = (s: string) =>
    s.split(",").map((p) => p.trim()).filter(Boolean).join(", ");
  const parts = raw.split(/\\n|\n/);
  return {
    line1: clean(parts[0]?.trim() ?? ""),
    line2: clean(parts[1]?.trim() ?? ""),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderID = searchParams.get("orderID");

  const [order,   setOrder]   = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!orderID) { setLoading(false); setError(true); return; }
    (async () => {
      try {
        const [res] = await Promise.all([
          makeApiRequest<{ success: boolean; data: OrderData }>(
            `frontend/orders/${orderID}`
          ),
          new Promise((r) => setTimeout(r, 3000)), // minimum 3s loading
        ]);
        if ((res as any)?.success && (res as any)?.data) {
          setOrder((res as any).data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderID]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E2E8F066]">
        {/* breadcrumb skeleton */}
        <div className="global-container py-3">
          <div className="flex items-center gap-2">
            {[80, 50, 70, 110].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />}
                <div className={`h-3 rounded bg-gray-200 animate-pulse`} style={{ width: w }} />
              </div>
            ))}
          </div>
        </div>

        <div className="global-container py-8">
          <div className="bg-white rounded-[10px] shadow-lg overflow-hidden">
            {/* green stripe */}
            <div className="h-2 w-full bg-linear-to-r from-[#186737] via-[#22a855] to-[#186737]" />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
              {/* ── LEFT skeleton ── */}
              <div className="p-4 sm:p-6 lg:p-8 border-r border-gray-100 order-2 lg:order-1">
                {/* success heading */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-1/3 mt-1" />
                  </div>
                </div>

                <div className="h-px bg-gray-100 mb-5" />

                {/* info rows */}
                <div className="space-y-4 mb-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-200 animate-pulse rounded w-full" />
                        <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-100 mb-5" />

                {/* order items heading */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
                </div>

                {/* order item cards */}
                <div className="border border-gray-100 rounded-[7px] overflow-hidden divide-y divide-gray-50">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4">
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-40 mb-3" />
                      <div className="flex gap-4">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-[7px] bg-gray-200 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2 pt-1">
                          <div className="h-3.5 bg-gray-200 animate-pulse rounded w-full" />
                          <div className="h-3.5 bg-gray-200 animate-pulse rounded w-3/4" />
                          <div className="h-3 bg-gray-100 animate-pulse rounded w-1/3" />
                          <div className="h-3 bg-gray-100 animate-pulse rounded w-1/4" />
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-20 mt-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-100 my-5" />

                {/* share + CTAs */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-36" />
                </div>
                <div className="flex gap-2 mb-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                  ))}
                </div>

                <div className="h-px bg-gray-100 my-5" />

                <div className="flex gap-3">
                  <div className="h-10 w-36 rounded-[7px] bg-gray-200 animate-pulse" />
                  <div className="h-10 w-36 rounded-[7px] bg-gray-100 animate-pulse" />
                </div>
              </div>

              {/* ── RIGHT skeleton ── */}
              <div className="flex flex-col gap-4 p-4 sm:p-6 order-1 lg:order-2 border-b border-gray-100 lg:border-b-0">
                {/* thank you card */}
                <div className="bg-green-50 rounded-[10px] p-6 flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-28" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-48" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-40" />
                  <div className="h-12 bg-gray-200 animate-pulse rounded-[7px] w-full mt-1" />
                </div>

                {/* order summary */}
                <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-3">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-32 mb-4" />
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-28" />
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-16" />
                    </div>
                  ))}
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between pt-1">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
                    <div className="h-5 bg-gray-200 animate-pulse rounded w-20" />
                  </div>
                </div>

                {/* trust badges */}
                <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className="w-8 h-8 rounded-[7px] bg-gray-200 animate-pulse" />
                        <div className="h-2.5 bg-gray-200 animate-pulse rounded w-10" />
                        <div className="h-2 bg-gray-100 animate-pulse rounded w-14" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* support */}
                <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4 space-y-3">
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-16 mx-auto" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 rounded-[7px] bg-gray-200 animate-pulse" />
                    <div className="h-10 rounded-[7px] bg-gray-200 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#E2E8F066] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-4">
            Unable to load order details. Please check your Orders page.
          </p>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 bg-[#186737] text-white text-sm font-semibold px-5 py-2.5 rounded-[7px]"
          >
            <Package size={15} />
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const subtotal      = Number(order.amount);
  const shippingTotal = Number(order.shipping_charge);
  const taxAmount     = Number(order.tax_amount);
  const taxRate       = Number(order.tax_percentage) / 100;
  const total         = Number(order.total_amount);
  const address       = parseAddress(order.customer_address ?? "");
  const phone         = `${order.customer.country_code ?? ""} ${order.customer.mobile_number ?? ""}`.trim();

  const hasLiftGate    = order.is_lift_gate           === 1;
  const hasResidential = order.is_residential_address === 1;
  const hasInside      = order.is_inside_delivery     === 1;
  const liftFee        = hasLiftGate    ? 75  : 0;
  const resFee         = hasResidential ? 199 : 0;
  const insideFee      = hasInside      ? 249 : 0;

  return (
    <div className="min-h-screen bg-[#E2E8F066]">

      <Breadcrumb crumbs={[
        { label: "Home",           href: "/" },
        { label: "Cart",           href: "/cart" },
        { label: "Checkout",       href: "/checkout" },
        { label: "Order Confirmed", href: null },
      ]} />

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
                    <span className="text-[#186737] font-bold">#{order.order_number}</span>
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
                    <span className="text-[#186737] font-bold break-all">{order.customer.email}</span>
                  </p>
                </div>
                {phone && (
                  <div className="flex items-start gap-2.5">
                    <Phone size={15} className="text-[#186737] mt-1 shrink-0" />
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                      Our representative will call you at{" "}
                      <span className="text-[#186737] font-bold whitespace-nowrap">{phone}</span>
                      . Kindly ensure the number is correct to avoid delivery delays.
                    </p>
                  </div>
                )}
                {address.line1 && (
                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-[#186737] mt-1 shrink-0" />
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                      Being delivered to{" "}
                      <span className="text-gray-800 font-semibold">
                        {address.line1}{address.line2 ? `, ${address.line2}` : ""}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 mb-5" />

              {/* Order items */}
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package size={16} className="text-[#186737]" />
                Order Items
              </h2>

              <div className="space-y-0 divide-y divide-gray-50 border border-gray-100 rounded-[7px] overflow-hidden">
                {order.order_products.map((item) => {
                  const iu = item.product.image_urls;
                  const img = iu && !Array.isArray(iu)
                    ? (iu as { en: string[] }).en?.[0] ?? ""
                    : Array.isArray(iu)
                    ? (iu as string[])[0] ?? ""
                    : item.product.images?.[0] ?? "";

                  const productName = typeof item.product.name === "object"
                    ? (item.product.name as { en: string }).en ?? ""
                    : item.product.name ?? item.product.translations?.[0]?.name ?? "";

                  const brandName = item.product.brand?.name?.en ?? item.product.brand_name ?? "";

                  const price = Number(item.unit_price);
                  const itemShipping = Number(item.shipping_charge);
                  const deliveryLabel = item.expected_shipping_date
                    ?? item.expectedShippingDate
                    ?? item.product_supplier?.delivery_days
                    ?? "";

                  return (
                    <div key={item.id} className="p-4 bg-white hover:bg-gray-50/50 transition-colors">
                      {deliveryLabel && (
                        <p className="text-[#B12704] text-xs font-semibold mb-3 flex items-center gap-1.5">
                          <Truck size={12} />
                          Estimated delivery: {deliveryLabel}
                        </p>
                      )}
                      <div className="flex gap-4">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                          {img && (
                            <img
                              src={img}
                              alt={productName}
                              className="w-full h-full object-contain p-1"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">
                            {productName}
                          </p>
                          {brandName && (
                            <p className="text-xs text-gray-400 mb-0.5">
                              Brand:{" "}
                              <span className="font-medium text-gray-600">{brandName}</span>
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mb-0.5">
                            Model No:{" "}
                            <span className="font-medium text-gray-600">{item.product.sku}</span>
                          </p>
                          <p className="text-xs text-gray-400 mb-2">
                            Qty:{" "}
                            <span className="font-semibold text-gray-700">{item.quantity}</span>
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-bold text-[#186737]">
                              ${usd(price)}
                            </span>
                            <span className="text-xs text-gray-400">/ Each</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Truck size={11} className="text-[#186737]" />
                            {itemShipping === 0 ? (
                              <span className="text-[#186737] font-semibold">Free Shipping</span>
                            ) : (
                              `Shipping: $${usd(itemShipping)}`
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                <ShareButtons
                  orderNumber={order.order_number}
                  email={order.customer.email}
                  total={total}
                  products={order.order_products.map((p) => ({
                    name: typeof p.product.name === "object"
                      ? (p.product.name as { en: string }).en ?? ""
                      : p.product.name ?? "",
                    sku: p.product.sku,
                    quantity: p.quantity,
                    unit_price: p.unit_price,
                  }))}
                />
              </div>

              <div className="h-px bg-gray-100 my-5" />

              {/* CTA buttons */}
              <div className="flex gap-3 w-full justify-between">
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
                  <p className="text-sm font-black text-[#186737] mt-0.5">#{order.order_number}</p>
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-[#186737]" />
                  Order Summary
                </h3>
                <div className="space-y-2.5 text-sm">
                  <Row
                    label={`Subtotal (${order.order_products.length} item${order.order_products.length !== 1 ? "s" : ""})`}
                    value={`$${usd(subtotal)}`}
                  />
                  <Row
                    label="Shipping & Handling"
                    value={shippingTotal === 0 ? "Free" : `$${usd(shippingTotal)}`}
                    valueClass={shippingTotal === 0 ? "text-[#186737]" : undefined}
                  />
                  {hasLiftGate    && <Row label="Lift Gate Service"       value={`$${usd(liftFee)}`} />}
                  {hasResidential && <Row label="Residential Address"     value={`$${usd(resFee)}`} />}
                  {hasInside      && <Row label="Inside Delivery"         value={`$${usd(insideFee)}`} />}
                  <Row
                    label={`Tax (${(taxRate * 100).toFixed(2)}%)`}
                    value={`$${usd(taxAmount)}`}
                  />
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
