"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import CTA from "@/components/cta";
import {
  AlertCircle,
  ArrowLeft,
  Box,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Search,
  Shield,
  Star,
  Truck,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ApiOrderProduct {
  id: number;
  quantity: number;
  unit_price: string;
  status: string;
  expected_shipping_date?: string;
  expectedShippingDate?: string;
  product_supplier: {
    delivery_days: string;
    return_policy: string;
  } | null;
  product: {
    sku: string;
    brand_name?: string;
    warranty?: string;
    brand?: { name: { en: string } };
    warranty_attribute?: { en: string };
    name?: { en: string };
    image_urls?: { en: string[] } | string;
    translations?: Array<{ name: string; image_urls: string }>;
  };
}

interface ApiCustomer {
  name: string;
  email: string;
  country_code: string;
  mobile_number: string;
}

interface PaymentEntry {
  id: number;
  transaction_id: string;
  payment_method: string;
  amount: string;
  status: string;
  payment_mode: string;
  created_at: string;
  payment_details?: { receipt_url?: string };
}

interface ApiTrackingOrder {
  id: number;
  order_number: string;
  status: string;
  amount: string;
  tax_percentage: string;
  tax_amount: string;
  discount: string;
  additional_discount_amount: string;
  shipping_charge: number;
  total_amount: string;
  is_paid: number;
  is_reserved: number;
  paid_amount: string;
  pending_amount: string;
  payment_link: string | null;
  payment_mode: string | null;
  created_at: string;
  customer: ApiCustomer;
  customer_address: string;
  order_products: ApiOrderProduct[];
  payments: PaymentEntry[];
  currency: {
    source_title: string;
    source_symbol: string;
    target_title: string;
    target_symbol: string;
    conversion_rate: number;
  };
}

interface TrackingApiResponse {
  success: boolean;
  message: string;
  data: ApiTrackingOrder;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { key: "order_placed",      label: "Order Placed",       desc: "Your order was placed successfully." },
  { key: "order_confirmed",   label: "Order Confirmed",    desc: "Your order has been reviewed and confirmed by our team." },
  { key: "processing",        label: "Processing",         desc: "Your order is being prepared and packed at the warehouse." },
  { key: "ready_to_dispatch", label: "Ready for Dispatch", desc: "All items are packed and ready to leave the warehouse." },
  { key: "shipped",           label: "Shipped",            desc: "Your order has been handed off to the courier." },
  { key: "out_for_delivery",  label: "Out for Delivery",   desc: "Almost there! Your order is out for delivery today." },
  { key: "delivered",         label: "Delivered",          desc: "Your order was delivered and signed for successfully." },
];

const STATUS_TO_STEP: Record<string, number> = {
  Pending:      0,
  Processing:   2,
  Shipped:      4,
  "In Transit": 5,
  Delivered:    6,
};

const STATUS_CFG = {
  Delivered:    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle },
  "In Transit": { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500",   icon: Truck },
  Shipped:      { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500",   icon: Truck },
  Processing:   { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500",  icon: Box },
  Pending:      { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500",  icon: Box },
  Cancelled:    { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500",    icon: AlertCircle },
} as const;

const DEFAULT_SC = { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", dot: "bg-gray-400", icon: Package };

const PAYMENT_CFG = {
  Paid:     { bg: "bg-emerald-50", text: "text-emerald-700" },
  Pending:  { bg: "bg-amber-50",  text: "text-amber-700" },
  Refunded: { bg: "bg-gray-100",  text: "text-gray-500" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDateTime(str: string) {
  try {
    const d = new Date(str.replace(" ", "T"));
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  } catch {
    return { date: str, time: "" };
  }
}

function getProductImage(imageUrls: { en: string[] } | string | null | undefined): string {
  if (!imageUrls) return "";
  // New format: { en: ["url"] }
  if (typeof imageUrls === "object" && !Array.isArray(imageUrls)) {
    return (imageUrls as { en: string[] }).en?.[0] ?? "";
  }
  // Old format: JSON string "["url"]"
  try {
    const arr = JSON.parse(imageUrls as string);
    return Array.isArray(arr) ? (arr[0] ?? "") : "";
  } catch {
    return imageUrls as string;
  }
}

function getPaymentStatus(order: ApiTrackingOrder): "Paid" | "Pending" | "Refunded" {
  if (order.is_paid === 1) return "Paid";
  if (order.status === "Cancelled" && Number(order.paid_amount) > 0) return "Refunded";
  return "Pending";
}

// ─── Page shell (Suspense wrapper required for useSearchParams) ─────────────────

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackOrderContent />
    </Suspense>
  );
}

// ─── Inner page ────────────────────────────────────────────────────────────────

function TrackOrderContent() {
  const searchParams = useSearchParams();

  const [input, setInput]       = useState("");
  const [query, setQuery]       = useState("");
  const [order, setOrder]       = useState<ApiTrackingOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const orderNumber = searchParams.get("order_number");
    if (orderNumber) {
      setInput(orderNumber);
      doFetch(orderNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doFetch(orderNumber: string) {
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    setApiError("");
    setQuery(orderNumber);
    try {
      const res = await makeApiRequest<TrackingApiResponse>(
        "frontend/orders/tracking",
        { params: { order_number: orderNumber } }
      );
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setNotFound(true);
      }
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleTrack(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    doFetch(trimmed);
  }

  function handleReset() {
    setInput("");
    setQuery("");
    setOrder(null);
    setNotFound(false);
    setApiError("");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#186737] font-bold text-sm hover:opacity-80 transition-opacity">
            <ArrowLeft size={15} />
            Back to Home
          </Link>
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">Track Order</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Hero search card ────────────────────────────────────────────── */}
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-linear-to-br from-[#186737] to-[#145c30] px-6 py-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
              <Package size={24} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Track your order</h1>
            <p className="text-sm text-white/75 mt-2 max-w-md mx-auto">
              Enter your order number to see live status and delivery updates.
            </p>
          </div>

          <div className="px-6 py-7">
            <form onSubmit={handleTrack} className="max-w-xl mx-auto space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. 11476"
                  className="w-full pl-10 pr-10 py-3 rounded-[7px] border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all"
                  suppressHydrationWarning
                />
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-full py-3 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-[#186737]/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    Track Order
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                You&apos;ll find your order number in your confirmation email or SMS.
              </p>
            </form>

            <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-gray-100">
              <Link href="/dashboard/orders" className="flex items-center gap-1.5 text-xs font-semibold text-[#186737] hover:underline">
                <User size={13} />
                View all orders
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-xs font-semibold text-[#186737] hover:underline">
                <MessageCircle size={13} />
                Contact support
              </Link>
            </div>
          </div>
        </div>

        {/* ── API error ───────────────────────────────────────────────────── */}
        {apiError && (
          <div className="bg-white rounded-[7px] border border-red-100 shadow-sm p-8 text-center">
            <AlertCircle size={24} className="mx-auto text-red-400 mb-3" />
            <p className="text-sm font-bold text-gray-900">Something went wrong</p>
            <p className="text-sm text-gray-500 mt-1">{apiError}</p>
            <button
              onClick={handleReset}
              className="mt-4 px-5 py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Not found ───────────────────────────────────────────────────── */}
        {notFound && (
          <div className="bg-white rounded-[7px] border border-red-100 shadow-sm p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Order not found</h2>
            <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto">
              We couldn&apos;t find an order with number{" "}
              <span className="font-mono font-bold text-gray-700">#{query}</span>.
              Please double-check and try again.
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/dashboard/orders"
                className="px-5 py-2.5 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View My Orders
              </Link>
            </div>
          </div>
        )}

        {/* ── Order detail ────────────────────────────────────────────────── */}
        {order && <OrderDetail order={order} onReset={handleReset} />}
      </div>
    </div>
  );
}

// ─── Order Detail ──────────────────────────────────────────────────────────────

function OrderDetail({ order, onReset }: { order: ApiTrackingOrder; onReset: () => void }) {
  const sc = STATUS_CFG[order.status as keyof typeof STATUS_CFG] ?? DEFAULT_SC;
  const paymentStatus = getPaymentStatus(order);
  const pc = PAYMENT_CFG[paymentStatus];
  const currentIdx = STATUS_TO_STEP[order.status] ?? 1;
  const placedAt = formatDateTime(order.created_at);

  const sym                = order.currency?.target_symbol ?? "$";
  const subtotal           = Number(order.amount);
  const tax                = Number(order.tax_amount);
  const shipping           = Number(order.shipping_charge);
  const discount           = Number(order.discount);
  const additionalDiscount = Number(order.additional_discount_amount);
  const total              = Number(order.total_amount);

  const addressLines = order.customer_address
    ? order.customer_address.split(/\\n|\n/)
    : [];

  const expectedDelivery =
    order.order_products[0]?.expected_shipping_date ??
    order.order_products[0]?.expectedShippingDate ?? "";

  // First step is "Order Reserved" when is_reserved === 1
  const isReserved = order.is_reserved === 1;
  const timelineSteps = TIMELINE_STEPS.map((s, i) =>
    i === 0 && isReserved
      ? { ...s, label: "Order Reserved", desc: "Your order was reserved successfully. Payment is under verification." }
      : s
  );
  const isCancelled = order.status === "Cancelled";
  const displayTimelineSteps = isCancelled
    ? [
        { key: "order_placed", label: timelineSteps[0].label, desc: timelineSteps[0].desc },
        { key: "order_cancelled", label: "Order Cancelled", desc: "Your order has been cancelled." },
      ]
    : timelineSteps;
  const displayCurrentIdx = isCancelled ? 1 : currentIdx;

  return (
    <div className="space-y-5">
      {/* ── Order Header ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={onReset}
              className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all shrink-0 mt-0.5"
            >
              <Search size={15} />
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">Order #{order.order_number}</h2>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {order.status}
                </span>
                {/* <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>
                  {paymentStatus}
                </span> */}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Placed on {placedAt.date} at {placedAt.time}
                {expectedDelivery && (
                  <>
                    <span className="mx-2 text-gray-200">|</span>
                    Est. Delivery:{" "}
                    <span className="font-semibold text-gray-600">{expectedDelivery}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          {/* <button className="flex items-center gap-2 px-4 py-2.5 rounded-[7px] text-sm font-semibold bg-[#186737] text-white hover:bg-[#145c30] transition-all shadow-sm shadow-[#186737]/20 shrink-0">
            <Download size={14} />
            Download Invoice
          </button> */}
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5 items-start">

        {/* ── LEFT ──────────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Order Items */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package size={15} className="text-[#186737]" />
              <h3 className="font-bold text-gray-900 text-sm">Order Items</h3>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                {order.order_products.length} item{order.order_products.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {order.order_products.map((op) => {
                const name =
                  (op.product.name as { en: string } | undefined)?.en ??
                  op.product.translations?.[0]?.name ?? "—";
                const brandName =
                  op.product.brand?.name?.en ?? op.product.brand_name ?? "";
                const warranty =
                  op.product.warranty_attribute?.en ?? op.product.warranty ?? "";
                const image = getProductImage(op.product.image_urls ?? op.product.translations?.[0]?.image_urls);
                const estDelivery =
                  op.expected_shipping_date ?? op.expectedShippingDate ?? "";
                const price = Number(op.unit_price);
                return (
                  <div key={op.id} className="p-5 flex gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="w-18 h-18 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={image || "https://placehold.co/72x72/f3f4f6/9ca3af?text=No+Img"}
                        alt={name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://placehold.co/72x72/f3f4f6/9ca3af?text=No+Img";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{name}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                            <span className="text-xs font-bold text-[#186737]">{brandName}</span>
                            <span className="text-[11px] text-gray-400">
                              SKU: <span className="font-mono text-gray-500">{op.product.sku}</span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                            {warranty && (
                              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                <Shield size={10} className="text-[#186737] shrink-0" />
                                {warranty}
                              </span>
                            )}
                            {op.product_supplier?.delivery_days && (
                              <span className="text-[11px] text-gray-400">
                                Ships in {op.product_supplier.delivery_days}
                              </span>
                            )}
                          </div>
                          {estDelivery && (
                            <p className="text-[11px] text-[#186737] font-medium mt-1">
                              Est. delivery: {estDelivery}
                            </p>
                          )}
                          <div className="mt-2">
                            <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Qty: {op.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-base font-bold text-gray-900">
                            {sym}{fmt(price * op.quantity)}
                          </p>
                          {op.quantity > 1 && (
                            <p className="text-[11px] text-gray-400 mt-0.5">{sym}{fmt(price)} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Items Subtotal</span>
              <span className="text-sm font-bold text-gray-900">{sym}{fmt(subtotal)}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Order Progress</h3>
              </div>
              <span className="text-[11px] font-semibold text-[#186737] bg-[#f0f9f4] px-2.5 py-1 rounded-full border border-[#c3e6d4]">
                {isCancelled ? "Order Cancelled" : (timelineSteps[currentIdx]?.label ?? order.status)}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {displayTimelineSteps.map((step, i) => {
                const isCompleted   = i <= displayCurrentIdx;
                const isCurrent     = i === displayCurrentIdx;
                const isLast        = i === displayTimelineSteps.length - 1;
                const lineCompleted = i < displayCurrentIdx;
                const isCancelledStep = step.key === "order_cancelled";

                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isCompleted
                            ? isCancelledStep
                              ? "bg-red-500 shadow-md shadow-red-200"
                              : "bg-[#186737] shadow-md shadow-[#186737]/25"
                            : "bg-white border-2 border-gray-200"
                        } ${isCurrent && !isCancelledStep ? "ring-4 ring-[#186737]/15" : ""}`}
                      >
                        {isCompleted ? (
                          isCancelledStep ? (
                            <X size={13} className="text-white" />
                          ) : (
                            <CheckCircle size={15} className="text-white" />
                          )
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-gray-300" />
                        )}
                      </div>
                      {!isLast && (
                        <div className="w-0.5 flex-1 min-h-7 my-1 rounded-full">
                          <div className={`w-full h-full rounded-full ${lineCompleted ? "bg-[#186737]" : "bg-gray-100"}`} />
                        </div>
                      )}
                    </div>

                    <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-5"}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${
                            isCancelledStep
                              ? "text-red-500"
                              : isCompleted ? "text-gray-900" : "text-gray-400"
                          }`}>
                            {step.label}
                          </p>
                          {isCurrent && !isCancelledStep && (
                            <span className="text-[10px] font-bold text-[#186737] bg-[#f0f9f4] px-2 py-0.5 rounded-full border border-[#c3e6d4]">
                              Current
                            </span>
                          )}
                        </div>
                        {i === 0 && (
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">
                            {placedAt.date} · {placedAt.time}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 leading-relaxed ${
                        isCancelledStep
                          ? "text-red-400"
                          : isCompleted ? "text-gray-500" : "text-gray-300"
                      }`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer + Shipping Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <User size={13} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Customer</h3>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm font-bold text-gray-900">{order.customer.name}</p>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Mail size={11} className="text-gray-400 shrink-0" />
                    {order.customer.email}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Phone size={11} className="text-gray-400 shrink-0" />
                    {order.customer.country_code} {order.customer.mobile_number}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <MapPin size={13} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Shipping Address</h3>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {addressLines.map((line, i) => (
                    <span key={i}>
                      {line.trim()}
                      {i < addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT ──────────────────────────────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-6">

          {/* Order Summary */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <FileText size={15} className="text-[#186737]" />
              <h3 className="font-bold text-gray-900 text-sm">Order Summary</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-2.5">
                <SummaryRow label="Subtotal" value={`${sym}${fmt(subtotal)}`} />
                {discount > 0 && (
                  <SummaryRow label="Coupon Discount" value={`-${sym}${fmt(discount)}`} green />
                )}
                {additionalDiscount > 0 && (
                  <SummaryRow label="Additional Discount" value={`-${sym}${fmt(additionalDiscount)}`} green />
                )}
                {tax > 0 && (
                  <SummaryRow
                    label={`Tax (${Number(order.tax_percentage).toFixed(2)}%)`}
                    value={`${sym}${fmt(tax)}`}
                  />
                )}
                {shipping > 0 && (
                  <SummaryRow label="Shipping" value={`${sym}${fmt(shipping)}`} />
                )}
              </div>
              <div className="border-t border-gray-100 pt-3.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-black text-xl text-gray-900">{sym}{fmt(total)}</span>
                </div>
              </div>
              {/* <button className="w-full flex items-center justify-center gap-2 py-3 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors shadow-sm shadow-[#186737]/20">
                <Download size={14} />
                Download Invoice
              </button> */}
            </div>
          </div>

          {/* Payment Details */}
          {(order.payments ?? []).length > 0 && (
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <CreditCard size={15} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Payment Details</h3>
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  {order.payments.length} payment{order.payments.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {order.payments.map((payment, idx) => (
                  <div key={payment.id} className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-700">Payment #{idx + 1}</span>
                      <span className="text-sm font-black text-gray-900">{sym}{fmt(Number(payment.amount))}</span>
                    </div>
                    <DetailRow
                      label="Method"
                      value={payment.payment_method === "Square" ? "Credit / Debit Card" : payment.payment_method}
                    />
                    <DetailRow label="Status">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        payment.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {payment.status}
                      </span>
                    </DetailRow>
                    <DetailRow label="Transaction ID">
                      <span className="text-[11px] font-mono text-gray-500 break-all text-right max-w-[170px]">
                        {payment.transaction_id}
                      </span>
                    </DetailRow>
                    <DetailRow label="Date">
                      <span className="text-xs text-gray-600">
                        {(() => { const dt = formatDateTime(payment.created_at); return `${dt.date} at ${dt.time}`; })()}
                      </span>
                    </DetailRow>
                  </div>
                ))}
              </div>

              {order.is_paid === 0 && Number(order.pending_amount) > 0 && (
                <div className="px-5 pb-5 space-y-3">
                  <div className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-[7px] px-3 py-2">
                    <span className="text-sm font-semibold text-amber-700">Pending Amount</span>
                    <span className="text-sm font-black text-amber-700">{sym}{fmt(Number(order.pending_amount))}</span>
                  </div>
                  {order.payment_link && (
                    <a
                      href={order.payment_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors"
                    >
                      <CreditCard size={14} />
                      Pay Now
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Need Help */}
          <CTA/>
          {/* <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-[7px] bg-[#f0f9f4] border border-[#c3e6d4] flex items-center justify-center shrink-0">
                <Headphones size={17} className="text-[#186737]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Need Help?</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Our team is here to help with your order.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors">
                <MessageCircle size={13} />
                Chat Now
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors">
                <Phone size={13} />
        <a href="tel:+18664467322" className="flex gap-1.5 items-center">  <Phone size={13} />
                Call Now</a>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-colors">
                <Star size={13} />
                Rate Order
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-colors">
                <AlertCircle size={13} />
                Report Issue
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SummaryRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${green ? "text-[#186737]" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

function DetailRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-gray-400 shrink-0 mt-0.5">{label}</span>
      {children ?? <span className="text-xs font-semibold text-gray-800 text-right">{value}</span>}
    </div>
  );
}
