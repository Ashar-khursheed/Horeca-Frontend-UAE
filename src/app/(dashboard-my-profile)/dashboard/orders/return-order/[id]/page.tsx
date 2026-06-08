"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Info,
  MessageSquare,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// ─── Mock data (replace with real API fetch) ──────────────────────────────────

interface ReturnItem {
  id: number;
  name: string;
  brand: string;
  sku: string;
  warranty: string;
  deliveredDate: string;
  qty: number;
  price: number;
  image: string;
  returnable: boolean;
  nonReturnableReason?: string;
}

interface ReturnOrder {
  id: string;
  deliveredDate: string;
  total: number;
  items: ReturnItem[];
}

const MOCK_ORDERS: Record<string, ReturnOrder> = {
  "2838": {
    id: "2838",
    deliveredDate: "Tue, May 26 – Wed, May 27",
    total: 31.08,
    items: [
      {
        id: 1,
        name: "Chef 360 Stainless Steel GN Pan 1/1 X 100 mm",
        brand: "Chef360",
        sku: "CS5703",
        warranty: "90 Days",
        deliveredDate: "Tue, May 26 – Wed, May 27",
        qty: 1,
        price: 37.10,
        image: "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35898/79046/tbc-36sb-n6__79124.1694539695.jpg",
        returnable: false,
        nonReturnableReason: "Outside 7 Days return window",
      },
    ],
  },
  "11436": {
    id: "11436",
    deliveredDate: "Mon, May 19 – Tue, May 20",
    total: 13487.33,
    items: [
      {
        id: 1,
        name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
        brand: "Turbo Air",
        sku: "TBC-36SB-N6",
        warranty: "3 Years",
        deliveredDate: "Mon, May 19 – Tue, May 20",
        qty: 1,
        price: 2426.63,
        image: "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35898/79046/tbc-36sb-n6__79124.1694539695.jpg",
        returnable: true,
      },
      {
        id: 2,
        name: 'Beverage-Air MT49-1-W 52" Mega Top Refrigerator, 13.0 Cu. ft.',
        brand: "Beverage-Air",
        sku: "MT49-1-W",
        warranty: "2 Years",
        deliveredDate: "Mon, May 19 – Tue, May 20",
        qty: 2,
        price: 2341.09,
        image: "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35898/79046/tbc-36sb-n6__79124.1694539695.jpg",
        returnable: true,
      },
      {
        id: 3,
        name: 'True TWT-27-HC 28" Worktop Refrigerator with Backsplash',
        brand: "True Refrigeration",
        sku: "TWT-27-HC",
        warranty: "7 Years",
        deliveredDate: "Mon, May 19 – Tue, May 20",
        qty: 1,
        price: 3946.48,
        image: "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/28706/66175/tuc-27f-hc__38834.1676404023.jpg",
        returnable: false,
        nonReturnableReason: "Outside 7 Days return window",
      },
    ],
  },
};

const RETURN_REASONS = [
  "Changed my mind about the purchase",
  "Found a better deal elsewhere",
  "Budget constraints",
  "Received damaged or defective item",
  "Wrong item delivered",
  "Other reason",
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReturnOrderPage() {
  const params = useParams();
  const orderId = params.id as string;

  const order: ReturnOrder = MOCK_ORDERS[orderId] ?? {
    id: orderId,
    deliveredDate: "N/A",
    total: 0,
    items: [],
  };

  // { itemId: returnQty }
  const [selectedItems, setSelectedItems] = useState<Record<number, number>>({});
  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleItem = (item: ReturnItem) => {
    if (!item.returnable) return;
    setSelectedItems((prev) => {
      if (prev[item.id]) {
        const next = { ...prev };
        delete next[item.id];
        return next;
      }
      return { ...prev, [item.id]: 1 };
    });
  };

  const changeQty = (item: ReturnItem, delta: number) => {
    setSelectedItems((prev) => {
      const current = prev[item.id] ?? 0;
      const next = Math.max(1, Math.min(item.qty, current + delta));
      return { ...prev, [item.id]: next };
    });
  };

  const selectedCount = Object.keys(selectedItems).length;
  const selectedReturnTotal = order.items
    .filter((i) => selectedItems[i.id])
    .reduce((sum, i) => sum + i.price * selectedItems[i.id], 0);

  const canSubmit = selectedCount > 0 && selectedReason !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="p-4 sm:p-6 max-w-[700px]">
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
            <CheckCircle size={28} className="text-[#186737]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Return Request Submitted</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Your return request for order{" "}
              <span className="font-bold text-gray-800">#{order.id}</span> has been submitted.
              Our team will review it and contact you within 2–3 business days.
            </p>
          </div>
          <div className="bg-gray-50 rounded-[7px] border border-gray-100 p-4 text-left w-full space-y-2">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Items selected: </span>
              {selectedCount} item{selectedCount !== 1 ? "s" : ""}
            </p>
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

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard/orders" className="hover:text-[#186737] transition-colors">My Orders</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Return Order</span>
      </nav>

      {/* Page header */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/orders"
            className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all shrink-0"
          >
            <ArrowLeft size={15} />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">Return Order</h1>
              <span className="text-sm text-gray-400 font-medium">#{order.id}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Select items from your order that you want to return and specify the quantity.
            </p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-[7px] border border-green-200 bg-green-50 px-4 py-3.5 flex items-start gap-3">
        <Info size={16} className="text-[#186737] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-700 leading-relaxed">
          Select the items you wish to return and specify the quantity. Non-returnable items cannot be selected.
          You can only return items that meet our return policy criteria.{" "}
          <span className="font-bold text-[#186737] cursor-pointer hover:underline">See our full Return Policy.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

        {/* ── LEFT ── */}
        <div className="space-y-5">

          {/* Order info */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <Package size={14} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Order #{order.id}</h2>
              <span className="ml-auto text-[11px] text-gray-400">
                Delivered on {order.deliveredDate}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => {
                const isSelected = !!selectedItems[item.id];
                const returnQty = selectedItems[item.id] ?? 1;

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={`p-4 flex gap-3 transition-colors ${
                      item.returnable
                        ? isSelected
                          ? "bg-green-50/40 cursor-pointer"
                          : "hover:bg-gray-50/60 cursor-pointer"
                        : "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="mt-1 shrink-0">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                          !item.returnable
                            ? "border-gray-200 bg-gray-100"
                            : isSelected
                            ? "border-[#186737] bg-[#186737]"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && item.returnable && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Image */}
                    <div className="w-14 h-14 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://placehold.co/60x60/f3f4f6/9ca3af?text=No+Img";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
                          {item.name}
                        </p>
                        {!item.returnable ? (
                          <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                            <X size={10} /> Non-returnable
                          </span>
                        ) : (
                          <p className="text-sm font-bold text-gray-900 shrink-0">
                            ${fmt(item.price)}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5">
                        <span className="text-xs font-bold text-[#186737]">{item.brand}</span>
                        <span className="text-[11px] text-gray-400">
                          SKU: <span className="font-mono text-gray-500">{item.sku}</span>
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Warranty: <span className="font-semibold text-gray-600">{item.warranty}</span>
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Delivered: <span className="font-semibold text-gray-600">{item.deliveredDate}</span>
                        </span>
                        <span className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          Original Qty: {item.qty}
                        </span>
                      </div>

                      {item.nonReturnableReason && (
                        <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                          <X size={10} className="shrink-0" />
                          Non-returnable reason: {item.nonReturnableReason}
                        </p>
                      )}

                      {/* Qty selector — only when selected and returnable */}
                      {isSelected && item.returnable && item.qty > 1 && (
                        <div
                          className="flex items-center gap-2 mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[11px] text-gray-500 font-medium">Return qty:</span>
                          <div className="flex items-center border border-gray-200 rounded-[7px] overflow-hidden">
                            <button
                              onClick={() => changeQty(item, -1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-gray-800">
                              {returnQty}
                            </span>
                            <button
                              onClick={() => changeQty(item, +1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <span className="text-[11px] text-gray-400">of {item.qty}</span>
                        </div>
                      )}
                    </div>

                    {/* Price for returnable items (on its own line for mobile) */}
                    {item.returnable && (
                      <div className="hidden sm:flex flex-col items-end justify-between shrink-0">
                        {isSelected && (
                          <span className="text-[10px] font-semibold text-[#186737] bg-green-50 px-2 py-0.5 rounded-full">
                            Selected
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reason for Return */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare size={14} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Reason for Return</h2>
              <span className="ml-1 text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                Required
              </span>
            </div>
            <div className="p-5 space-y-2.5">
              {RETURN_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-[7px] border cursor-pointer transition-all ${
                    selectedReason === reason
                      ? "border-[#186737] bg-green-50/50"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      selectedReason === reason
                        ? "border-[#186737] bg-[#186737]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedReason === reason && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="return_reason"
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
              <MessageSquare size={14} className="text-gray-400" />
              <h2 className="font-bold text-gray-900 text-sm">Additional Comments</h2>
              <span className="ml-1 text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                Optional
              </span>
            </div>
            <div className="p-5">
              <textarea
                rows={4}
                placeholder="Describe the issue or provide any additional details..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                className="w-full resize-none rounded-[7px] border border-gray-200 text-sm text-gray-700 p-3 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-300"
              />
              <p className="text-[11px] text-gray-300 mt-1.5 text-right">
                {comment.length}/500
              </p>
            </div>
          </div>

        </div>

        {/* ── RIGHT sidebar ── */}
        <div className="space-y-5 lg:sticky lg:top-6">

          {/* Order Summary */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <RotateCcw size={14} className="text-[#186737]" />
              <h3 className="font-bold text-gray-900 text-sm">Order Summary</h3>
            </div>
            <div className="p-5 space-y-3">
              <SummaryRow
                label="Total Items"
                value={`${order.items.length} item${order.items.length !== 1 ? "s" : ""}`}
              />
              <SummaryRow
                label="Selected for Return"
                value={
                  selectedCount > 0
                    ? `${selectedCount} item${selectedCount !== 1 ? "s" : ""}`
                    : "None"
                }
                highlight={selectedCount > 0}
              />
              <div className="border-t border-gray-100 pt-3">
                <SummaryRow
                  label="Order Total"
                  value={`$${fmt(order.total)}`}
                  bold
                />
                {selectedCount > 0 && (
                  <SummaryRow
                    label="Return Amount"
                    value={`$${fmt(selectedReturnTotal)}`}
                    highlight
                    bold
                  />
                )}
              </div>
              <SummaryRow label="Delivery Date" value={order.deliveredDate} />
            </div>
          </div>

          {/* Return policy notice */}
          <div className="bg-blue-50 rounded-[7px] border border-blue-200 overflow-hidden">
            <div className="px-4 py-3.5 border-b border-blue-200 flex items-center gap-2">
              <Info size={14} className="text-blue-600" />
              <h3 className="font-bold text-blue-700 text-sm">Return Policy</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {[
                  "Returns accepted within 7 days of delivery.",
                  "Items must be unused and in original packaging.",
                  "Refund processed within 7–10 business days after approval.",
                  "You will receive a return shipping label via email.",
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
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-[7px] text-sm font-bold transition-all shadow-sm ${
                canSubmit && !loading
                  ? "bg-[#186737] text-white hover:bg-[#145c30] shadow-green-200 cursor-pointer"
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
                  <RotateCcw size={15} />
                  Start Return Process ({selectedCount} Item{selectedCount !== 1 ? "s" : ""})
                </>
              )}
            </button>

            <Link
              href="/dashboard/orders"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft size={14} />
              Back to Orders
            </Link>
          </div>

          {/* Validation hint */}
          {!canSubmit && (
            <div className="flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-[7px] px-3 py-2.5">
              <AlertTriangle size={12} className="shrink-0 mt-0.5" />
              {selectedCount === 0
                ? "Select at least one item to return."
                : "Please select a reason for return to proceed."}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryRow({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-gray-400">{label}</span>
      <span
        className={`text-xs ${
          highlight
            ? "font-bold text-[#186737]"
            : bold
            ? "font-black text-gray-900"
            : "font-semibold text-gray-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
