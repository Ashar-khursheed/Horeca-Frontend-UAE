"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Info,
  MessageSquare,
  Package,
  Shield,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// ─── Mock data (replace with real API fetch) ─────────────────────────────────

const MOCK_ORDERS: Record<
  string,
  {
    id: string;
    date: string;
    status: "Pending" | "Processing" | "In Transit" | "Delivered" | "Cancelled";
    paymentStatus: "Paid" | "Pending" | "Refunded";
    total: number;
    customer: string;
    items: {
      id: number;
      name: string;
      brand: string;
      sku: string;
      qty: number;
      price: number;
      image: string;
    }[];
  }
> = {
  "11436": {
    id: "11436",
    date: "May 22, 2026",
    status: "Pending",
    paymentStatus: "Pending",
    total: 13487.33,
    customer: "Arshad Khan",
    items: [
      {
        id: 1,
        name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
        brand: "Turbo Air",
        sku: "TBC-36SB-N6",
        qty: 1,
        price: 2426.63,
        image:
          "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35898/79046/tbc-36sb-n6__79124.1694539695.jpg",
      },
      {
        id: 2,
        name: 'Beverage-Air MT49-1-W 52" Mega Top Refrigerator, 13.0 Cu. ft.',
        brand: "Beverage-Air",
        sku: "MT49-1-W",
        qty: 1,
        price: 2341.09,
        image:
          "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/1000/2000/mt49-1-w__12345.jpg",
      },
      {
        id: 3,
        name: 'Beverage-Air WTR24HC-V7 24" Worktop Refrigerator with Fan Top',
        brand: "Beverage-Air",
        sku: "WTR24HC-V7",
        qty: 1,
        price: 2340.99,
        image:
          "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/2000/3000/wtr24hc-v7__23456.jpg",
      },
      {
        id: 4,
        name: 'Turbo Air M3W46-3-N6 27" Super Deluxe Worktop Refrigerator, Shallow-Depth, 1 Section, 3.26 cu.ft.',
        brand: "Turbo Air",
        sku: "M3W46-3-N6",
        qty: 1,
        price: 2432.14,
        image:
          "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/3000/4000/m3w46-3-n6__34567.jpg",
      },
      {
        id: 5,
        name: 'True TWT-27-HC 28" Worktop Refrigerator with Backsplash, 7 Year Warranty',
        brand: "True Refrigeration",
        sku: "TWT-27-HC",
        qty: 1,
        price: 3946.48,
        image:
          "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/28706/66175/tuc-27f-hc__38834.1676404023.jpg",
      },
    ],
  },
  "11384": {
    id: "11384",
    date: "Apr 08, 2026",
    status: "Processing",
    paymentStatus: "Paid",
    total: 108.25,
    customer: "Arshad Khan",
    items: [
      {
        id: 1,
        name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler',
        brand: "Turbo Air",
        sku: "TBC-36SB-N6",
        qty: 1,
        price: 108.25,
        image:
          "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35898/79046/tbc-36sb-n6__79124.1694539695.jpg",
      },
    ],
  },
};

const CANCEL_REASONS = [
  "Changed my mind about the purchase",
  "Found a better deal elsewhere",
  "Budget constraints",
  "Need to delay the purchase",
  "Other reason",
];

const STATUS_BANNER: Record<
  string,
  { bg: string; border: string; icon: React.ElementType; iconColor: string; text: string; sub: string; canCancel: boolean }
> = {
  Pending: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: AlertCircle,
    iconColor: "text-amber-500",
    text: "Order Status: Pending",
    sub: "Your order is awaiting confirmation. You can still cancel it at this stage.",
    canCancel: true,
  },
  Processing: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: Info,
    iconColor: "text-blue-500",
    text: "Order Status: Processing",
    sub: "Your order is being prepared. Cancellation may still be possible — contact support for assistance.",
    canCancel: true,
  },
  "In Transit": {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: Truck,
    iconColor: "text-red-500",
    text: "Order Status: In Transit",
    sub: "Your order has already been shipped. Cancellation is no longer available at this stage.",
    canCancel: false,
  },
  Delivered: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: CheckCircle,
    iconColor: "text-red-500",
    text: "Order Status: Delivered",
    sub: "This order has been delivered. Please use the Return option instead.",
    canCancel: false,
  },
  Cancelled: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    icon: X,
    iconColor: "text-gray-400",
    text: "Order Already Cancelled",
    sub: "This order has already been cancelled.",
    canCancel: false,
  },
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CancelOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const order = MOCK_ORDERS[orderId] ?? {
    id: orderId,
    date: "N/A",
    status: "Pending" as const,
    paymentStatus: "Pending" as const,
    total: 0,
    customer: "—",
    items: [],
  };

  const banner = STATUS_BANNER[order.status] ?? STATUS_BANNER.Pending;
  const BannerIcon = banner.icon;

  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = banner.canCancel && selectedReason !== "";

  const handleCancel = () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="p-4 sm:p-6 max-w-[700px]">
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <X size={28} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Cancellation Requested</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Your cancellation request for order{" "}
              <span className="font-bold text-gray-800">#{order.id}</span> has been submitted.
              You will receive a confirmation email shortly.
            </p>
          </div>
          <div className="bg-gray-50 rounded-[7px] border border-gray-100 p-4 text-left w-full space-y-2">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Reason: </span>
              {selectedReason}
            </p>
            {comment && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Note: </span>
                {comment}
              </p>
            )}
          </div>
          <div className="flex gap-3 w-full mt-2">
            <Link
              href="/dashboard/orders"
              className="flex-1 py-2.5 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-center"
            >
              Back to Orders
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] ">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard/orders" className="hover:text-[#186737] transition-colors">My Orders</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Cancel Order</span>
      </nav>

      {/* Page header */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/orders"
            className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-500 hover:border-red-400 hover:text-red-500 transition-all shrink-0"
          >
            <ArrowLeft size={15} />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                <X size={15} className="text-red-500" />
              </div> */}
              <h1 className="text-xl font-bold text-gray-900">Cancel Order</h1>
              <span className="text-sm text-gray-400 font-medium">#{order.id}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-11s">
              You may cancel this order now
            </p>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className={`rounded-[7px] border ${banner.bg} ${banner.border} px-4 py-3.5 flex items-start gap-3`}>
        <BannerIcon size={16} className={`${banner.iconColor} shrink-0 mt-0.5`} />
        <div>
          <p className={`text-sm font-bold ${banner.iconColor}`}>{banner.text}</p>
          <p className="text-xs text-gray-600 mt-0.5">{banner.sub}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">

        {/* LEFT */}
        <div className="space-y-5">

          {/* Order information */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Order Information</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <InfoBlock label="Order Number" value={`#${order.id}`} accent />
                <InfoBlock label="Order Total" value={`$${fmt(order.total)}`} bold />
                <InfoBlock label="Order Date" value={order.date} />
                <InfoBlock label="Customer" value={order.customer} />
                <InfoBlock
                  label="Payment Status"
                  value={order.paymentStatus}
                  badge
                  badgeColor={
                    order.paymentStatus === "Paid"
                      ? "bg-emerald-50 text-emerald-700"
                      : order.paymentStatus === "Pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-gray-100 text-gray-500"
                  }
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Items In This Order</h2>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className="w-[60px] h-[60px] shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-1.5"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/60x60/f3f4f6/9ca3af?text=No+Img";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                        {item.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                        <span className="text-xs font-bold text-[#186737]">{item.brand}</span>
                        <span className="text-[11px] text-gray-400">
                          SKU: <span className="font-mono text-gray-500">{item.sku}</span>
                        </span>
                        <span className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          Qty: {item.qty}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900 shrink-0">
                      ${fmt(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation reason */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Reason for Cancellation</h2>
              <span className="ml-1 text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                Required
              </span>
            </div>
            <div className="p-5 space-y-3">
              {CANCEL_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-[7px] border cursor-pointer transition-all ${
                    selectedReason === reason
                      ? "border-red-300 bg-red-50/60"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                  } ${!banner.canCancel ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      selectedReason === reason
                        ? "border-red-500 bg-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedReason === reason && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="cancel_reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional comments */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare size={15} className="text-gray-400" />
              <h2 className="font-bold text-gray-900 text-sm">Additional Comments</h2>
              <span className="ml-1 text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                Optional
              </span>
            </div>
            <div className="p-5">
              <textarea
                rows={4}
                placeholder="Please provide any additional details..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={!banner.canCancel}
                className="w-full resize-none rounded-[7px] border border-gray-200 text-sm text-gray-700 p-3 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
              />
              <p className="text-[11px] text-gray-300 mt-1.5 text-right">
                {comment.length}/500
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-5 lg:sticky lg:top-6">

          {/* Order total card */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs text-gray-400 font-medium">Order Total</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">${fmt(order.total)}</p>
            </div>
            <div className="p-5 space-y-2.5">
              <MiniRow label="Order #" value={`#${order.id}`} />
              <MiniRow label="Date" value={order.date} />
              <MiniRow label="Items" value={`${order.items.length} item${order.items.length !== 1 ? "s" : ""}`} />
              <MiniRow label="Status" value={order.status} />
            </div>
          </div>

          {/* Important notice */}
          <div className="bg-blue-50 rounded-[7px] border border-blue-200 overflow-hidden">
            <div className="px-4 py-3.5 border-b border-blue-200 flex items-center gap-2">
              <Info size={14} className="text-blue-600" />
              <h3 className="font-bold text-blue-700 text-sm">Important Notice</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {[
                  "Once your order is confirmed, cancellation may not be possible.",
                  "If items have been shipped, return policies will apply.",
                  "You will receive a cancellation confirmation email.",
                  "Any payments made will be refunded within 7–10 business days.",
                ].map((note) => (
                  <li key={note} className="flex items-start gap-2 text-[12px] text-blue-700">
                    <Shield size={11} className="shrink-0 mt-0.5 text-blue-500" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleCancel}
              disabled={!canSubmit || loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-[7px] text-sm font-bold transition-all shadow-sm ${
                canSubmit && !loading
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-red-200 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <X size={15} />
                  Cancel This Order
                </>
              )}
            </button>

            <Link
              href="/dashboard/orders"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft size={14} />
              Keep Order &amp; Go Back
            </Link>
          </div>

          {!selectedReason && banner.canCancel && (
            <div className="flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-[7px] px-3 py-2.5">
              <AlertTriangle size={12} className="shrink-0 mt-0.5" />
              Please select a cancellation reason to proceed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoBlock({
  label,
  value,
  accent,
  bold,
  badge,
  badgeColor,
}: {
  label: string;
  value: string;
  accent?: boolean;
  bold?: boolean;
  badge?: boolean;
  badgeColor?: string;
}) {
  return (
    <div>
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      {badge ? (
        <span className={`inline-flex text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 ${badgeColor}`}>
          {value}
        </span>
      ) : (
        <p
          className={`text-sm mt-0.5 ${
            accent ? "font-bold text-[#186737]" : bold ? "font-black text-gray-900" : "font-semibold text-gray-700"
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-semibold text-gray-700">{value}</span>
    </div>
  );
}
