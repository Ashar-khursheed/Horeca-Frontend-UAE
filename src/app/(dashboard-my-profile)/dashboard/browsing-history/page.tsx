"use client";

import { Clock, History, ShoppingBag, Trash2, X, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "horeca_browsing_history";

type HistoryItem = {
  id: number;
  name: string;
  url: string;
  image: string;
  price: number;
  sale_price: number;
  currency: string;
  sku: string;
  viewedAt: string;
};

const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const timeAgo = (iso: string): string => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-100" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-5 bg-gray-200 rounded w-2/5 mt-3" />
    </div>
  </div>
);

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    {/* Icon cluster */}
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
        <History size={36} className="text-gray-300" strokeWidth={1.5} />
      </div>
      <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#f0f9f4] border-2 border-white flex items-center justify-center shadow-sm">
        <Eye size={14} className="text-[#186737]" />
      </div>
    </div>

    <h2 className="text-lg font-bold text-gray-900 mb-2">No Browsing History</h2>
    <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-8">
      Products you view will appear here so you can quickly find them again.
    </p>

    {/* Steps hint */}
    <div className="bg-gray-50 rounded-[7px] border border-gray-100 p-4 mb-8 text-left max-w-xs w-full space-y-3">
      {[
        { step: "1", text: "Browse products on any category page" },
        { step: "2", text: "Click a product to view its details" },
        { step: "3", text: "Come back here to find it instantly" },
      ].map(({ step, text }) => (
        <div key={step} className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#186737] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            {step}
          </div>
          <span className="text-xs text-gray-600">{text}</span>
        </div>
      ))}
    </div>

    <Link
      href="/"
      className="inline-flex items-center gap-2 bg-[#186737] hover:bg-[#145c30] text-white font-semibold px-6 py-3 rounded-[7px] transition-colors duration-200 text-sm"
    >
      <ShoppingBag size={16} />
      Start Browsing
    </Link>
  </div>
);

// ── History Card ──────────────────────────────────────────────────────────────
const HistoryCard = ({
  item,
  onRemove,
}: {
  item: HistoryItem;
  onRemove: (id: number) => void;
}) => {
  const [removing, setRemoving] = useState(false);
  const hasSale = item.sale_price > 0 && item.sale_price < item.price;
  const activePrice = hasSale ? item.sale_price : item.price;
  const discountPct = hasSale ? ((item.price - item.sale_price) / item.price) * 100 : 0;
  const [int, dec] = fmtPrice(activePrice).split(".");

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 260);
  };

  return (
    <div
      className={`group bg-white rounded-[7px] border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c3e6d4] transition-all duration-300 overflow-hidden flex flex-col ${
        removing ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{ transition: "opacity 0.26s ease, transform 0.26s ease, box-shadow 0.3s, border-color 0.3s" }}
    >
      {/* Image */}
      <Link href={item.url} className="relative block bg-gray-50 aspect-square overflow-hidden">
        {hasSale && (
          <span className="absolute top-2 left-2 z-10 bg-[#FCE8EA] text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{Math.round(discountPct)}%
          </span>
        )}
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
          title="Remove from history"
        >
          <X size={13} strokeWidth={2.5} />
        </button>
        <img
          src={item.image || "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image"}
          alt={item.name}
          className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image";
          }}
        />
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 border-t border-gray-100">
        {item.sku && (
          <p className="text-[10px] text-gray-400 font-medium mb-1">Model: {item.sku}</p>
        )}
        <Link href={item.url}>
          <p className="text-[13px] font-semibold text-gray-900 hover:text-[#186737] transition-colors line-clamp-2 leading-snug">
            {item.name}
          </p>
        </Link>

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[15px] font-bold text-gray-900">
                {item.currency || "AED"}&nbsp;{int}
              </span>
              <span className="text-[12px] font-bold text-gray-900">.{dec}</span>
            </div>
            {hasSale && (
              <p className="text-[10px] text-gray-400 line-through">
                {item.currency || "AED"}&nbsp;{fmtPrice(item.price)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
            <Clock size={10} />
            {timeAgo(item.viewedAt)}
          </div>
        </div>

        <Link
          href={item.url}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-[7px] bg-[#f0f9f4] hover:bg-[#186737] text-[#186737] hover:text-white text-xs font-semibold transition-all duration-200"
        >
          <Eye size={13} />
          View Product
        </Link>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BrowsingHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: HistoryItem[] = raw ? JSON.parse(raw) : [];
      setItems(parsed);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  const handleRemove = (id: number) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleClearAll = () => {
    setClearing(true);
    setTimeout(() => {
      setItems([]);
      localStorage.removeItem(STORAGE_KEY);
      setClearing(false);
    }, 300);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-350">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[7px] bg-[#186737] flex items-center justify-center shadow-sm shrink-0">
            <History size={19} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Browsing History</h1>
            {!loading && items.length > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                {items.length} product{items.length !== 1 ? "s" : ""} recently viewed
              </p>
            )}
          </div>
        </div>

        {!loading && items.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="flex items-center gap-2 px-4 py-2 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm min-h-100">
        {loading ? (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            className={`p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 transition-opacity duration-300 ${
              clearing ? "opacity-0" : "opacity-100"
            }`}
          >
            {items.map((item) => (
              <HistoryCard key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
