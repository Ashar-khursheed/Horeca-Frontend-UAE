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
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { ShareButtons } from "./_components/share-buttons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderProduct {
  id: number;
  quantity: number;
  unit_price: string;
  shipping_charge: number;
  expectedShippingDate: string;
  product_supplier: {
    delivery_days: string;
  };
  product: {
    name: string;
    sku: string;
    brand_name: string;
    images: string[];
    image_urls: string[];
  };
}

interface OrderData {
  order_number: string;
  amount: string;
  shipping_charge: number;
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
  const parts = raw.split("\n");
  return {
    line1: parts[0]?.trim() ?? "",
    line2: parts[1]?.trim() ?? "",
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderID?: string }>;
}) {
  const { orderID } = await searchParams;

  const res = orderID
    ? await makeApiCallSSR<{ success: boolean; data: OrderData }>(
        `/frontend/orders/${orderID}`,
        undefined,
        { withAuth: true, revalidate: 0 }
      )
    : null;

  const order = res?.success ? res.data : null;

  if (!order) {
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

  const subtotal = Number(order.amount);
  const shippingTotal = order.shipping_charge;
  const taxAmount = Number(order.tax_amount);
  const taxRate = Number(order.tax_percentage) / 100;
  const total = Number(order.total_amount);
  const address = parseAddress(order.customer_address);
  const phone = `${order.customer.country_code} ${order.customer.mobile_number}`;

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
                <div className="flex items-start gap-2.5">
                  <Phone size={15} className="text-[#186737] mt-1 shrink-0" />
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Our representative will call you at{" "}
                    <span className="text-[#186737] font-bold whitespace-nowrap">{phone}</span>
                    . Kindly ensure the number is correct to avoid delivery delays.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-[#186737] mt-1 shrink-0" />
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Being delivered to{" "}
                    <span className="text-gray-800 font-semibold">
                      {address.line1}{address.line2 ? `, ${address.line2}` : ""}
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
                {order.order_products.map((item) => {
                  const img = item.product.images?.[0] ?? item.product.image_urls?.[0] ?? "";
                  const price = Number(item.unit_price);
                  const deliveryLabel = item.expectedShippingDate || item.product_supplier.delivery_days;

                  return (
                    <div key={item.id} className="p-4 bg-white hover:bg-gray-50/50 transition-colors">
                      <p className="text-[#B12704] text-xs font-semibold mb-3 flex items-center gap-1.5">
                        <Truck size={12} />
                        Estimated delivery: {deliveryLabel}
                      </p>
                      <div className="flex gap-4">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                          {img && (
                            <img
                              src={img}
                              alt={item.product.name}
                              className="w-full h-full object-contain p-1"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-400 mb-0.5">
                            Brand:{" "}
                            <span className="font-medium text-gray-600">{item.product.brand_name}</span>
                          </p>
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
                            {item.shipping_charge === 0 ? (
                              <span className="text-[#186737] font-semibold">Free Shipping</span>
                            ) : (
                              `Shipping: $${usd(item.shipping_charge)}`
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
                    name: p.product.name,
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
