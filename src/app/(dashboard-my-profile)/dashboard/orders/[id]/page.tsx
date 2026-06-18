"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import {
  AlertCircle,
  ArrowLeft,
  Box,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  Headphones,
  Mail,
  MapPin,
  Package,
  Phone,
  Shield,
  Truck,
  User,
  X
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TrackingEntry {
  id: number;
  status: string;
  description: string;
  created_at: string;
}

interface PaymentEntry {
  id: number;
  transaction_id: string;
  payment_method: string;
  amount: string;
  status: string;
  payment_mode: string;
  payment_details?: { receipt_url?: string };
}

interface ApiOrderProduct {
  id: number;
  quantity: number;
  unit_price: string;
  status: string;
  is_returnable: string;
  expected_shipping_date: string;
  product_supplier: { delivery_days: string; return_policy: string };
  product: {
    id: number;
    sku: string;
    name: { en: string };
    image_urls: { en: string[] };
    brand?: { name: { en: string } };
    warranty_attribute?: { en: string };
  };
}

interface ApiOrderDetail {
  id: number;
  order_number: string;
  status: string;
  total_amount: string;
  amount: string;
  tax_amount: string;
  tax_percentage: string;
  shipping_charge: number;
  discount: string;
  additional_discount_amount: string;
  is_lift_gate: number;
  is_residential_address: number;
  is_inside_delivery: number;
  is_paid: number;
  paid_amount: string;
  payment_mode: string | null;
  is_reserved: number;
  pay_with_cheque: number;
  created_at: string;
  customer_address: string;
  customer: {
    name: string;
    email: string;
    type: string;
    country_code: string;
    mobile_number: string;
  };
  order_products: ApiOrderProduct[];
  tracking: TrackingEntry[];
  payments: PaymentEntry[];
  total_products: number;
}

interface OrderDetailResponse {
  success: boolean;
  data: ApiOrderDetail;
}

// ── Timeline ──────────────────────────────────────────────────────────────────

const STEPS = [
  {
    key: "order_placed",
    label: "Order Placed",
    desc: "Your order was placed successfully.",
  },
  {
    key: "order_confirmed",
    label: "Order Confirmed",
    desc: "Your order has been reviewed and confirmed by our team.",
  },
  {
    key: "processings",
    label: "Processing",
    desc: "Your order is being prepared and packed at the warehouse.",
  },
  {
    key: "ready_to_dispatch",
    label: "Ready for Dispatch",
    desc: "All items are packed and ready to leave the warehouse.",
  },
  {
    key: "shipped",
    label: "Shipped",
    desc: "Your order has been handed off to the courier.",
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    desc: "Almost there! Your order is out for delivery today.",
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Your order was completed successfully.",
  },
  // {
  //   key: "completedd",
  //   label: "Completed",
  //   desc: "Your order was completed successfully.",
  // },
];

const TRACKING_TO_STEP: Record<string, string> = {
  "Order Created By Customer": "order_placed",
  "Order Created By Backend Panel": "order_placed",
  "Order Confirmed": "order_confirmed",
  Processing: "processings",
  "Ready for Dispatch": "ready_to_dispatch",
  Shipped: "shipped",
  "Out for Delivery": "out_for_delivery",
  Delivered: "delivered",
  // Completed: "completedd",
};

const STATUS_TO_STEP_IDX: Record<string, number> = {
  // step 0 – Order Placed/Reserved
  Pending: 0,
  Cancelled: 0,
  // step 1 – Order Confirmed
  Confirmed: 1,
  // step 2 – Processing
  Processing: 2,
  "Supplier Delivery": 2,
  International: 2,
  Export: 2,
  "On hold": 2,
  // step 3 – Ready for Dispatch
  "Ready to ship": 3,
  // step 4 – Shipped
  Shipped: 4,
  Pickups: 4,
  // step 5 – Out for Delivery
  "Out for delivery": 5,
  "In Transit": 5,
  // step 6 – Delivered
  Delivered: 6,
  // step 7 – Completed
  // Completed: 7,
};

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    icon: React.ElementType;
  }
> = {
  Delivered: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle,
  },
  "In Transit": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    icon: Truck,
  },
  Shipped: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    icon: Truck,
  },
  Processing: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: Box,
  },
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: Clock,
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    icon: AlertCircle,
  },
};

const DEFAULT_SC = {
  bg: "bg-gray-100",
  text: "text-gray-600",
  border: "border-gray-200",
  dot: "bg-gray-400",
  icon: Package,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function formatDateTime(str: string) {
  const d = new Date(str);
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    full:
      d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }) +
      " at " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

function getPaymentBadge(order: ApiOrderDetail) {
  if (order.is_paid === 1)
    return { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-700" };
  if (order.status === "Cancelled" && Number(order.paid_amount) > 0)
    return { label: "Refunded", bg: "bg-gray-100", text: "text-gray-600" };
  return { label: "Pending", bg: "bg-amber-50", text: "text-amber-700" };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<ApiOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await makeApiRequest<OrderDetailResponse>(
          `frontend/orders/${id}`,
        );
        if (res.success) setOrder(res.data);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error || !order) return <ErrorState />;

  const sc = STATUS_CFG[order.status] ?? DEFAULT_SC;
  const pay = getPaymentBadge(order);
  const currentIdx = STATUS_TO_STEP_IDX[order.status] ?? 1;
  const placedAt = formatDateTime(order.created_at);

  // Build tracking timestamp map
  const trackingMap: Record<string, TrackingEntry> = {};
  for (const t of order.tracking) {
    const stepKey = TRACKING_TO_STEP[t.status];
    if (stepKey) trackingMap[stepKey] = t;
  }

  const estDelivery = order.order_products[0]?.expected_shipping_date ?? "";

  const steps = STEPS.map((s, i) =>
    i === 0 && order.is_reserved === 1 && order.pay_with_cheque === 1
      ? {
          ...s,
          label: "Order Reserved",
          desc: "Your order was reserved successfully. Payment is under verification.",
        }
      : s,
  );
  const isCancelled = order.status === "Cancelled";
  const displaySteps = isCancelled
    ? [
        { key: "order_placed", label: steps[0].label, desc: steps[0].desc },
        { key: "order_cancelled", label: "Order Cancelled", desc: "Your order has been cancelled." },
      ]
    : steps;
  const displayCurrentIdx = isCancelled ? 1 : currentIdx;
  const subtotal = Number(order.amount);
  const tax = Number(order.tax_amount);
  const discount = Number(order.discount);
  const additionalDiscount = Number(order.additional_discount_amount);
  const total = Number(order.total_amount);
  const liftFee    = order.is_lift_gate           === 1 ? 75  : 0;
  const resFee     = order.is_residential_address === 1 ? 199 : 0;
  const insideFee  = order.is_inside_delivery     === 1 ? 249 : 0;
  const shipping = total - subtotal - tax + discount + additionalDiscount - liftFee - resFee - insideFee;

  const addressLines = order.customer_address.split(/\\n|\n/).filter(Boolean);
  const firstPayment = order.payments[0];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href="/dashboard"
          className="hover:text-[#186737] transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={12} />
        <Link
          href="/dashboard/orders"
          className="hover:text-[#186737] transition-colors"
        >
          My Orders
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">
          Order #{order.order_number}
        </span>
      </nav>

      {/* Order Header */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard/orders"
              className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all shrink-0 mt-0.5"
            >
              <ArrowLeft size={15} />
            </Link>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">
                  Order #{order.order_number}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {order.status}
                </span>
                {/* <span
                  className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${pay.bg} ${pay.text}`}
                >
                  {pay.label}
                </span> */}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Placed on {placedAt.full}
                {estDelivery && (
                  <>
                    <span className="mx-2 text-gray-200">|</span>
                    Est. Delivery:{" "}
                    <span className="font-semibold text-gray-600">
                      {estDelivery}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {/* {order.status !== "Cancelled" && order.status !== "Delivered" && (
              <Link
                href={`/dashboard/orders/cancel-order/${order.id}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[7px] text-sm font-semibold border border-gray-200 text-red-500 hover:bg-red-50 transition-all"
              >
                Cancel Order
              </Link>
            )}
            <Link
              href={`/dashboard/orders/return-order/${order.id}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              <RotateCcw size={14} />
              Return
            </Link> */}
            {/* <button className="flex items-center gap-2 px-4 py-2.5 rounded-[7px] text-sm font-semibold bg-[#186737] text-white hover:bg-[#145c30] transition-all shadow-sm shadow-[#186737]/20">
              <Download size={14} />
              Download Invoice
            </button> */}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5 items-start">
        {/* LEFT */}
        <div className="space-y-5">
          {/* Order Items */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Order Items</h2>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                {order.order_products.length} item
                {order.order_products.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {order.order_products.map((item) => {
                const name = item.product.name?.en ?? "";
                const image = item.product.image_urls?.en?.[0] ?? "";
                const brand = item.product.brand?.name?.en ?? "";
                const warranty = item.product.warranty_attribute?.en ?? "";
                const deliveryDays = item.product_supplier?.delivery_days ?? "";
                const lineTotal = Number(item.unit_price) * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="p-5 flex gap-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-[72px] h-[72px] shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={image}
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
                          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                            {name}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                            {brand && (
                              <span className="text-xs font-bold text-[#186737]">
                                {brand}
                              </span>
                            )}
                            <span className="text-[11px] text-gray-400">
                              SKU:{" "}
                              <span className="font-mono text-gray-500">
                                {item.product.sku}
                              </span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                            {warranty && (
                              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                <Shield
                                  size={10}
                                  className="text-[#186737] shrink-0"
                                />
                                {warranty}
                              </span>
                            )}
                            {deliveryDays && (
                              <span className="text-[11px] text-gray-400">
                                Ships in {deliveryDays}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Qty: {item.quantity}
                            </span>
                            {item.status && (
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                                item.status === "Delivered"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : item.status === "Request Return" || item.status === "Return Requested"
                                  ? "bg-orange-50 text-orange-700 border-orange-200"
                                  : item.status === "Returned" || item.status === "Refunded"
                                  ? "bg-red-50 text-red-600 border-red-200"
                                  : item.status === "Cancelled"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : item.status === "Shipped" || item.status === "In Transit"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }`}>
                                {item.status}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-base font-bold text-gray-900">
                            ${fmt(lineTotal)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              ${fmt(Number(item.unit_price))} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                Items Subtotal
              </span>
              <span className="text-sm font-bold text-gray-900">
                ${fmt(subtotal)}
              </span>
            </div>
          </div>

          {/* Order Progress Timeline */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-[#186737]" />
                <h2 className="font-bold text-gray-900 text-sm">
                  Order Progress
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-[#186737] bg-[#f0f9f4] px-2.5 py-1 rounded-full border border-[#c3e6d4]">
                {isCancelled ? "Order Cancelled" : (steps[currentIdx]?.label ?? order.status)}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {displaySteps.map((step, i) => {
                const isCompleted = i <= displayCurrentIdx;
                const isCurrent = i === displayCurrentIdx;
                const isLast = i === displaySteps.length - 1;
                const lineCompleted = i < displayCurrentIdx;
                const isCancelledStep = step.key === "order_cancelled";
                const trackingEntry = trackingMap[step.key];
                const dt = trackingEntry
                  ? formatDateTime(trackingEntry.created_at)
                  : null;

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
                        <div className="w-0.5 flex-1 min-h-[28px] my-1 rounded-full">
                          <div
                            className={`w-full h-full rounded-full ${lineCompleted ? "bg-[#186737]" : "bg-gray-100"}`}
                          />
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-5"}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold ${
                              isCancelledStep
                                ? "text-red-500"
                                : isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && !isCancelledStep && (
                            <span className="text-[10px] font-bold text-[#186737] bg-[#f0f9f4] px-2 py-0.5 rounded-full border border-[#c3e6d4]">
                              Current
                            </span>
                          )}
                        </div>
                        {isCompleted && dt && (
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">
                            {dt.date} · {dt.time}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-0.5 leading-relaxed ${
                          isCancelledStep
                            ? "text-red-400"
                            : isCompleted ? "text-gray-500" : "text-gray-300"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer + Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <User size={13} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Customer</h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-[#186737] font-semibold mt-0.5">
                    {order.customer.type}
                  </p>
                </div>
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
                <h3 className="font-bold text-gray-900 text-sm">
                  Shipping Address
                </h3>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {addressLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5 lg:sticky lg:top-6">
          {/* Order Summary */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <FileText size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Order Summary</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-2.5">
                <SummaryRow label="Subtotal" value={`$${fmt(subtotal)}`} />
                {discount > 0 && (
                  <SummaryRow
                    label="Coupon Discount"
                    value={`-$${fmt(discount)}`}
                    green
                  />
                )}
                {additionalDiscount > 0 && (
                  <SummaryRow
                    label="Additional Discount"
                    value={`-$${fmt(additionalDiscount)}`}
                    green
                  />
                )}
                  {shipping > 0 ? (
                  <SummaryRow label="Shipping" value={`$${fmt(shipping)}`} />
                ) : (
                  <SummaryRow label="Shipping" value="Free" green />
                )}
                {order.is_lift_gate           === 1 && <SummaryRow label="Lift Gate Service"       value={`$${fmt(liftFee)}`} />}
                {order.is_residential_address === 1 && <SummaryRow label="Residential Address"     value={`$${fmt(resFee)}`} />}
                {order.is_inside_delivery     === 1 && <SummaryRow label="Inside Delivery"         value={`$${fmt(insideFee)}`} />}
                <SummaryRow
                  label={`Tax (${Number(order.tax_percentage).toFixed(2)}%)`}
                  value={`$${fmt(tax)}`}
                />
              
              </div>

              <div className="border-t border-gray-100 pt-3.5 mt-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-black text-xl text-gray-900">
                    ${fmt(total)}
                  </span>
                </div>
              </div>

              {/* <button className="w-full mt-1 flex items-center justify-center gap-2 py-3 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors shadow-sm shadow-[#186737]/20">
                <Download size={14} />
                Download Invoice
              </button> */}
            </div>
          </div>

          {/* Payment Details */}
          {firstPayment && (
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <CreditCard size={15} className="text-[#186737]" />
                <h2 className="font-bold text-gray-900 text-sm">
                  Payment Details
                </h2>
              </div>
              <div className="p-5 space-y-3">
                <DetailRow label="Method" value={firstPayment.payment_method} />
                <DetailRow label="Status">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pay.bg} ${pay.text}`}
                  >
                    {firstPayment.status}
                  </span>
                </DetailRow>
                <DetailRow label="Transaction ID">
                  <span className="text-[11px] font-mono text-gray-500 break-all text-right max-w-[170px]">
                    {firstPayment.transaction_id}
                  </span>
                </DetailRow>
                {/* {firstPayment.payment_details?.receipt_url && (
                  <DetailRow label="Receipt">
                    <a
                      href={firstPayment.payment_details.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#186737] hover:underline font-semibold"
                    >
                      View Receipt
                    </a>
                  </DetailRow>
                )} */}
              </div>
            </div>
          )}

          {/* Need Help */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
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
              {/* <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors">
                <MessageCircle size={13} />
                Chat Now
              </button> */}
              <button className="flex items-center w-full justify-center gap-1.5 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors">
                <a href="tel:+18664467322" className="flex gap-1.5">
                  {" "}
                  <Phone size={13} />
                  Call Now
                </a>
              </button>
              {/* <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-colors">
                <Star size={13} />
                Rate Order
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-colors">
                <AlertCircle size={13} />
                Report Issue
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Loading Skeleton ───────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-64" />
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex gap-4">
          <div className="w-9 h-9 bg-gray-100 rounded-[7px]" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-56" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5">
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4"
            >
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 bg-gray-100 rounded w-20" />
                <div className="h-3 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────────────────

function ErrorState() {
  return (
    <div className="p-4 sm:p-6 max-w-[1400px]">
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm py-20 text-center">
        <AlertCircle size={40} className="mx-auto text-red-200 mb-3" />
        <p className="text-sm font-semibold text-gray-400">
          Failed to load order details
        </p>
        <Link
          href="/dashboard/orders"
          className="mt-3 inline-block text-xs text-[#186737] hover:underline font-medium"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryRow({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span
        className={`font-semibold ${green ? "text-[#186737]" : "text-gray-900"}`}
      >
        {value}
      </span>
    </div>
  );
}

function DetailRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-gray-400 shrink-0 mt-0.5">{label}</span>
      {children ?? (
        <span className="text-xs font-semibold text-gray-800 text-right">
          {value}
        </span>
      )}
    </div>
  );
}
