"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  ImageIcon,
  Info,
  MessageSquare,
  Minus,
  Package,
  RotateCcw,
  Shield,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// ─── API Types ────────────────────────────────────────────────────────────────

interface ApiOrderProduct {
  id: number;
  quantity: number;
  unit_price: string;
  status: string;
  is_returnable: string | number;
  expected_shipping_date: string;
  product_supplier: { delivery_days: string; return_policy: string } | null;
  product: {
    id: number;
    sku: string;
    name: { en: string } | string;
    image_urls?: { en: string[] };
    brand?: { name: { en: string } };
    warranty_attribute?: { en: string };
  };
}

interface ApiOrder {
  id: number;
  order_number: string;
  status: string;
  updated_at: string;
  total_amount: string;
  order_products: ApiOrderProduct[];
}

interface ApiOrderResponse {
  success: boolean;
  data: ApiOrder;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

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

function mapProduct(op: ApiOrderProduct): ReturnItem {
  const name =
    typeof op.product.name === "object"
      ? (op.product.name as { en: string }).en ?? ""
      : op.product.name ?? "";
  const brand = op.product.brand?.name?.en ?? "";
  const warranty =
    op.product.warranty_attribute?.en ?? op.product_supplier?.return_policy ?? "";
  const image = op.product.image_urls?.en?.[0] ?? "";
  const returnable =
    op.is_returnable === 1 || op.is_returnable === "1" ||
    op.is_returnable === "yes" 

  return {
    id: op.id,
    name,
    brand,
    sku: op.product.sku,
    warranty,
    deliveredDate: op.expected_shipping_date ?? "",
    qty: op.quantity,
    price: Number(op.unit_price),
    image,
    returnable,
    nonReturnableReason: !returnable ? "Outside return window" : undefined,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReturnOrderPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const res = await makeApiRequest<ApiOrderResponse>(
          `frontend/orders/${orderId}`,
        );
        if (res.success) setOrder(res.data);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const [selectedItems, setSelectedItems] = useState<Record<number, number>>({});
  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [uploadVideos, setUploadVideos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (loading) return <LoadingSkeleton />;
  if (error || !order) return <ErrorState />;

  const isReturnWindowExpired =
    order.status === "Delivered" &&
    Date.now() - new Date(order.updated_at).getTime() > 7 * 24 * 60 * 60 * 1000;

  const items: ReturnItem[] = order.order_products.map((op) => {
    const item = mapProduct(op);
    if (isReturnWindowExpired) {
      return { ...item, returnable: false, nonReturnableReason: "Outside return window" };
    }
    return item;
  });
  const total = Number(order.total_amount);

  const toggleItem = (item: ReturnItem) => {
    if (!item.returnable) return;
    setSelectedItems((prev) => {
      if (prev[item.id]) {
        const next = { ...prev };
        delete next[item.id];
        return next;
      }
      return { ...prev, [item.id]: item.qty };
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
  const selectedReturnTotal = items
    .filter((i) => selectedItems[i.id])
    .reduce((sum, i) => sum + i.price * (selectedItems[i.id] ?? 1), 0);

  const isOtherReason = selectedReason === "Other reason";
  const canSubmit =
    selectedCount > 0 &&
    selectedReason !== "" &&
    (!isOtherReason || comment.trim() !== "");

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await Promise.all(
        Object.entries(selectedItems).map(([idStr, qty]) => {
          const fd = new FormData();
          fd.append("quantity", String(qty));
          fd.append("reason", selectedReason);
          if (isOtherReason && comment.trim()) {
            fd.append("description", comment.trim());
          }
          uploadImages.forEach((img) => fd.append("product_images[]", img));
          uploadVideos.forEach((vid) => fd.append("product_videos[]", vid));
          return makeApiRequest(`frontend/order-products/${idStr}/return`, {
            method: "POST",
            data: fd,
          });
        })
      );
      setSubmitted(true);
    } catch {
      setSubmitError("Failed to submit return request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────────
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
              <span className="font-bold text-gray-800">#{order.order_number}</span> has been
              submitted. Our team will review it and contact you within 2–3 business days.
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
              <span className="text-sm text-gray-400 font-medium">#{order.order_number}</span>
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
          Select the items you wish to return and specify the quantity. Non-returnable items cannot
          be selected. You can only return items that meet our return policy criteria.{" "}
          <span className="font-bold text-[#186737] cursor-pointer hover:underline">
            See our full Return Policy.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

        {/* ── LEFT ── */}
        <div className="space-y-5">

          {/* Order items */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <Package size={14} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Order #{order.order_number}</h2>
              <span className="ml-auto text-[11px] text-gray-400">
                Status: {order.status}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {items.map((item) => {
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
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
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
                        {item.brand && (
                          <span className="text-xs font-bold text-[#186737]">{item.brand}</span>
                        )}
                        <span className="text-[11px] text-gray-400">
                          SKU: <span className="font-mono text-gray-500">{item.sku}</span>
                        </span>
                        {item.warranty && (
                          <span className="text-[11px] text-gray-400">
                            Warranty:{" "}
                            <span className="font-semibold text-gray-600">{item.warranty}</span>
                          </span>
                        )}
                        {item.deliveredDate && (
                          <span className="text-[11px] text-gray-400">
                            Est. Delivery:{" "}
                            <span className="font-semibold text-gray-600">{item.deliveredDate}</span>
                          </span>
                        )}
                        <span className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          Original Qty: {item.qty}
                        </span>
                      </div>

                      {item.nonReturnableReason && (
                        <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                          <X size={10} className="shrink-0" />
                          {item.nonReturnableReason}
                        </p>
                      )}

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
                          </div>
                          <span className="text-[11px] text-gray-400">of {item.qty}</span>
                        </div>
                      )}
                    </div>

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
              <MessageSquare size={14} className={isOtherReason ? "text-[#186737]" : "text-gray-400"} />
              <h2 className="font-bold text-gray-900 text-sm">Additional Comments</h2>
              {isOtherReason ? (
                <span className="ml-1 text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                  Required
                </span>
              ) : (
                <span className="ml-1 text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  Optional
                </span>
              )}
            </div>
            <div className="p-5">
              <textarea
                rows={4}
                placeholder={isOtherReason ? "Please describe the reason for return..." : "Describe the issue or provide any additional details..."}
                value={comment}
                onChange={(e) => { setComment(e.target.value); if (commentError) setCommentError(""); }}
                maxLength={500}
                className={`w-full resize-none rounded-[7px] border text-sm text-gray-700 p-3 outline-none focus:ring-2 transition-all placeholder:text-gray-300 ${
                  commentError
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:border-[#186737] focus:ring-[#186737]/10"
                }`}
              />
              <div className="flex items-center justify-between mt-1.5">
                {commentError ? (
                  <p className="text-[11px] text-red-500">{commentError}</p>
                ) : (
                  <span />
                )}
                <p className="text-[11px] text-gray-300">{comment.length}/500</p>
              </div>

              {/* Media upload */}
              <div className="mt-4 space-y-3">
                {/* Image upload */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">
                    Upload Problem Images{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </p>
                  <label className="flex items-center gap-2 px-3 py-2.5 rounded-[7px] border border-dashed border-gray-200 cursor-pointer hover:border-[#186737] hover:bg-green-50/30 transition-all group">
                    <ImageIcon size={14} className="text-gray-400 group-hover:text-[#186737] transition-colors shrink-0" />
                    <span className="text-xs text-gray-400 group-hover:text-[#186737] transition-colors">
                      {uploadImages.length > 0
                        ? `${uploadImages.length} image${uploadImages.length > 1 ? "s" : ""} selected`
                        : "Click to upload images"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(e) =>
                        setUploadImages((prev) => [...prev, ...Array.from(e.target.files ?? [])])
                      }
                    />
                  </label>
                  {uploadImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {uploadImages.map((file, i) => (
                        <div key={i} className="relative w-14 h-14 rounded-[5px] overflow-hidden border border-gray-100 bg-gray-50">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setUploadImages((prev) => prev.filter((_, j) => j !== i))}
                            className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"
                          >
                            <X size={9} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

          {/* Action buttons */}
          <div className="space-y-2.5 md:flex  gap-2.5 items-center  md:w-xl">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`w-full m-0 flex items-center md:mb-0 mb-3 justify-center gap-2 py-3 rounded-[7px] text-sm font-bold transition-all shadow-sm ${
                canSubmit && !submitting
                  ? "bg-[#186737] text-white hover:bg-[#145c30] shadow-green-200 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {submitting ? (
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
                {/* Video upload */}
                {/* <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">
                    Upload Problem Videos{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </p>
                  <label className="flex items-center gap-2 px-3 py-2.5 rounded-[7px] border border-dashed border-gray-200 cursor-pointer hover:border-[#186737] hover:bg-green-50/30 transition-all group">
                    <Video size={14} className="text-gray-400 group-hover:text-[#186737] transition-colors shrink-0" />
                    <span className="text-xs text-gray-400 group-hover:text-[#186737] transition-colors">
                      {uploadVideos.length > 0
                        ? `${uploadVideos.length} video${uploadVideos.length > 1 ? "s" : ""} selected`
                        : "Click to upload videos"}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      className="sr-only"
                      onChange={(e) =>
                        setUploadVideos((prev) => [...prev, ...Array.from(e.target.files ?? [])])
                      }
                    />
                  </label>
                  {uploadVideos.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {uploadVideos.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-[7px] border border-gray-100">
                          <Video size={12} className="text-gray-400 shrink-0" />
                          <span className="text-xs text-gray-600 flex-1 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setUploadVideos((prev) => prev.filter((_, j) => j !== i))}
                          >
                            <X size={12} className="text-gray-400 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div> */}
              </div>
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
                value={`${items.length} item${items.length !== 1 ? "s" : ""}`}
              />
              <SummaryRow
                label="Selected for Return"
                value={selectedCount > 0 ? `${selectedCount} item${selectedCount !== 1 ? "s" : ""}` : "None"}
                highlight={selectedCount > 0}
              />
              <div className="border-t border-gray-100 pt-3">
                <SummaryRow label="Order Total" value={`$${fmt(total)}`} bold />
                {selectedCount > 0 && (
                  <SummaryRow
                    label="Return Amount"
                    value={`$${fmt(selectedReturnTotal)}`}
                    highlight
                    bold
                  />
                )}
              </div>
            </div>
          </div>

          {/* Return policy */}
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


          {!canSubmit && (
            <div className="flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-[7px] px-3 py-2.5">
              <AlertTriangle size={12} className="shrink-0 mt-0.5" />
              {selectedCount === 0
                ? "Select at least one item to return."
                : selectedReason === ""
                ? "Please select a reason for return to proceed."
                : "Additional Comments are required when 'Other reason' is selected."}
            </div>
          )}
          {submitError && (
            <div className="flex items-start gap-2 text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-[7px] px-3 py-2.5">
              <AlertTriangle size={12} className="shrink-0 mt-0.5" />
              {submitError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Loading / Error ──────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-64" />
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 flex gap-4">
        <div className="w-9 h-9 bg-gray-100 rounded-[7px]" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-40" />
          <div className="h-3 bg-gray-100 rounded w-72" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-24" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 bg-gray-100 rounded w-20" />
              <div className="h-3 bg-gray-100 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="p-4 sm:p-6 max-w-[1400px]">
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm py-20 text-center">
        <AlertCircle size={40} className="mx-auto text-red-200 mb-3" />
        <p className="text-sm font-semibold text-gray-400">Failed to load order details</p>
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
