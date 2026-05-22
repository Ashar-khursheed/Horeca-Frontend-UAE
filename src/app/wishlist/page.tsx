"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Share2,
  FileText,
  Truck,
  Star,
  CheckCircle,
  Package,
  ShoppingBag,
  X,
  BadgeCheck,
  RotateCcw,
} from "lucide-react";
import Breadcrumb from "@/components/breadcum";

// ── Types ─────────────────────────────────────────────────────────────────────
type WishlistItem = {
  id: number;
  name: string;
  brand: string;
  modelNo: string;
  image: string;
  price: number;
  originalPrice: number;
  warranty: string;
  deliveryDays: string;
  freeShipping: boolean;
  rating: number;
  reviews: number;
  url: string;
  inStock: boolean;
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_ITEMS: WishlistItem[] = [
  {
    id: 1,
    name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
    brand: "Turbo Air",
    modelNo: "TBC-36SB-N6",
    image:
      "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35898/79046/tbc-36sb-n6__79124.1694539695.jpg",
    price: 2395.26,
    originalPrice: 2800.0,
    warranty: "5 Years Parts & Labor, 7 Year Compressor",
    deliveryDays: "5 to 7 Days",
    freeShipping: false,
    rating: 4.5,
    reviews: 12,
    url: "/",
    inStock: true,
  },
  {
    id: 2,
    name: 'Turbo Air MSR-49NM-N 54" 2-Door Solid Swing Door Merchandiser Refrigerator',
    brand: "Turbo Air",
    modelNo: "MSR-49NM-N",
    image:
      "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/22553/44895/msr-49nm-n__95248.1644947060.jpg",
    price: 3149.0,
    originalPrice: 3149.0,
    warranty: "3 Years Parts & Labor, 5 Year Compressor",
    deliveryDays: "7 to 10 Days",
    freeShipping: true,
    rating: 4.8,
    reviews: 24,
    url: "/",
    inStock: true,
  },
  {
    id: 3,
    name: "True TUC-27F-HC 27\" Undercounter Freezer with Hydrocarbon Refrigerant",
    brand: "True",
    modelNo: "TUC-27F-HC",
    image:
      "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/24020/48316/TUC-27F-HC__90534.1618345196.jpg",
    price: 2099.0,
    originalPrice: 2450.0,
    warranty: "2 Years Parts & Labor, 5 Year Compressor",
    deliveryDays: "3 to 5 Days",
    freeShipping: false,
    rating: 0,
    reviews: 0,
    url: "/",
    inStock: false,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ── Rating Stars ──────────────────────────────────────────────────────────────
const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={12}
        className={
          s <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ))}
  </div>
);

// ── Item Card ─────────────────────────────────────────────────────────────────
const WishlistCard = ({
  item,
  onRemove,
}: {
  item: WishlistItem;
  onRemove: (id: number) => void;
}) => {
  const [added, setAdded] = useState(false);
  const [removing, setRemoving] = useState(false);

  const hasSale = item.originalPrice > item.price;
  const discountPct = hasSale
    ? ((item.originalPrice - item.price) / item.originalPrice) * 100
    : 0;
  const [priceInt, priceDec] = fmtPrice(item.price).split(".");

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 280);
  };

  return (
    <div
      className={`group bg-white rounded-[7px] border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c3e6d4] transition-all duration-300 overflow-hidden ${
        removing ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{ transition: "opacity 0.28s ease, transform 0.28s ease, box-shadow 0.3s, border-color 0.3s" }}
    >
      <div className="flex gap-3 p-3 sm:p-0 sm:gap-0">
        {/* Image */}
        <Link
          href={item.url}
          className="relative shrink-0 w-24 h-24 sm:w-40 sm:h-auto sm:min-h-40 rounded-[7px] sm:rounded-none bg-gray-50 border border-gray-100 sm:border-0 flex items-center justify-center overflow-hidden"
        >
          {hasSale && (
            <span className="absolute top-1.5 left-1.5 z-10 bg-[#FCE8EA] text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              -{Math.round(discountPct)}%
            </span>
          )}
          {!item.inStock && (
            <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10 backdrop-blur-[1px]">
              <span className="bg-gray-800/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                Out of Stock
              </span>
            </div>
          )}
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Image";
            }}
          />
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 sm:p-5">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {/* Brand + Model */}
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className="text-[11px] font-bold text-[#186737]">{item.brand}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                <span className="text-[11px] text-gray-400">Model: {item.modelNo}</span>
              </div>
              <Link href={item.url}>
                <h3 className="font-semibold text-[13px] sm:text-[15px] text-gray-900 hover:text-[#186737] transition-colors line-clamp-2 leading-snug">
                  {item.name}
                </h3>
              </Link>
              {item.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <RatingStars rating={item.rating} />
                  <span className="text-[11px] font-bold text-gray-600">{item.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400">({item.reviews})</span>
                </div>
              )}
            </div>

            {/* Remove */}
            <button
              onClick={handleRemove}
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              title="Remove from wishlist"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>

          {/* Meta — hidden on mobile to save space */}
          <div className="hidden sm:block mt-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <BadgeCheck size={13} className="text-[#186737] shrink-0" />
              <span>{item.warranty}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 flex-wrap">
              <Truck size={13} className="text-[#186737] shrink-0" />
              <span className={item.freeShipping ? "text-[#186737]" : ""}>
                {item.freeShipping ? "Free Shipping" : "Shipping Charges Apply"}
              </span>
              <span className="text-gray-400 font-normal">
                · Mostly Ships in {item.deliveryDays}
              </span>
            </div>
          </div>

          {/* Price + Action */}
          <div className="mt-auto pt-2 sm:pt-4 flex items-center justify-between gap-2 sm:gap-3">
            <div>
              <div className="flex items-baseline gap-[2px]">
                <span className="text-base sm:text-[22px] font-bold text-gray-900">${priceInt}</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">.{priceDec}</span>
              </div>
              {hasSale && (
                <p className="text-[10px] text-gray-400 line-through">
                  ${fmtPrice(item.originalPrice)}
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!item.inStock}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[7px] text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                added
                  ? "bg-emerald-600 text-white"
                  : item.inStock
                  ? "bg-[#186737] hover:bg-[#145c30] text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {added ? (
                <>
                  <CheckCircle size={13} strokeWidth={2} /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={13} strokeWidth={2} />
                  {item.inStock ? "Add to Cart" : "Unavailable"}
                </>
              )}
            </button>
          </div>

          {/* Mobile-only shipping info */}
          <div className="sm:hidden mt-2 flex items-center gap-1 text-[10px] text-gray-400">
            <Truck size={10} className="text-[#186737] shrink-0" />
            <span className={item.freeShipping ? "text-[#186737] font-medium" : ""}>
              {item.freeShipping ? "Free Shipping" : "Shipping Charges Apply"}
            </span>
            <span>· Ships in {item.deliveryDays}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-6">
    <div className="w-24 h-24 rounded-full bg-[#f0f9f4] flex items-center justify-center mb-5">
      <Heart size={38} className="text-[#186737]" strokeWidth={1.5} />
    </div>
    <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
    <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
      Save items you love by clicking the heart icon on any product. They&apos;ll show
      up here for easy access.
    </p>
    <Link
      href="/"
      className="flex items-center gap-2 bg-[#186737] hover:bg-[#145c30] text-white font-semibold px-6 py-3 rounded-[7px] transition-colors duration-200"
    >
      <ShoppingBag size={17} /> Start Shopping
    </Link>
  </div>
);

// ── Summary Card ──────────────────────────────────────────────────────────────
const SummaryCard = ({ items }: { items: WishlistItem[] }) => {
  const total = items.reduce((s, i) => s + i.price, 0);
  const savings = items.reduce(
    (s, i) => s + Math.max(0, i.originalPrice - i.price),
    0
  );
  const [allAdded, setAllAdded] = useState(false);

  return (
    <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 sticky top-24">
      <h3 className="font-bold text-gray-900 text-[15px] mb-4 flex items-center gap-2">
        <Package size={16} className="text-[#186737]" />
        Order Summary
      </h3>

      <div className="space-y-2.5 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Items ({items.length})
          </span>
          <span className="font-semibold text-gray-900">${fmtPrice(total)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[#186737] font-medium">You save</span>
            <span className="font-bold text-[#186737]">-${fmtPrice(savings)}</span>
          </div>
        )}
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="font-bold text-gray-900 text-sm">Estimated Total</span>
          <span className="font-bold text-gray-900 text-lg">${fmtPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={() => {
          setAllAdded(true);
          setTimeout(() => setAllAdded(false), 2000);
        }}
        className={`w-full py-3 rounded-[7px] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
          allAdded
            ? "bg-emerald-600 text-white"
            : "bg-[#186737] hover:bg-[#145c30] text-white"
        }`}
      >
        {allAdded ? (
          <>
            <CheckCircle size={16} /> All Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart size={16} /> Add All to Cart
          </>
        )}
      </button>

      <button className="w-full mt-2.5 py-3 rounded-[7px] font-semibold text-sm flex items-center justify-center gap-2 border border-[#A6131D] text-[#A6131D] hover:bg-red-50 transition-colors duration-200">
        <FileText size={15} /> Get Instant Quote
      </button>

      <div className="mt-5 bg-[#f0f9f4] rounded-[7px] p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <RotateCcw size={13} className="text-[#186737] shrink-0" />
          <span>Free returns within 30 days on most items</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <BadgeCheck size={13} className="text-[#186737] shrink-0" />
          <span>Authorized dealer — all brands listed</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Truck size={13} className="text-[#186737] shrink-0" />
          <span>Ships from authorized US warehouses</span>
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(MOCK_ITEMS);
  const [copied, setCopied] = useState(false);

  const handleRemove = (id: number) => {
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 300);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // clipboard not available
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Breadcrumb />
      <main className="min-h-screen bg-gray-50/70">
        <div className="global-container py-6 sm:py-8">
          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[7px] bg-[#186737] flex items-center justify-center shadow-sm">
                <Heart size={19} className="text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  My Wishlist
                </h1>
                {items.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {items.length} item{items.length !== 1 ? "s" : ""} saved
                  </p>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[7px] border text-sm font-semibold transition-all duration-200 ${
                    copied
                      ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                      : "border-gray-200 text-gray-600 hover:border-[#186737] hover:text-[#186737] bg-white"
                  }`}
                >
                  {copied ? (
                    <CheckCircle size={15} />
                  ) : (
                    <Share2 size={15} />
                  )}
                  {copied ? "Link Copied!" : "Share List"}
                </button>

                <Link href="/create-quotation"><button className="flex items-center gap-2 px-4 py-2 rounded-[7px] bg-[#A6131D] hover:bg-[#8b1018] text-white text-sm font-semibold transition-colors duration-200">
                  <FileText size={15} />
                  Get Instant Quote
                </button></Link>
              </div>
            )}
          </div>

          {/* ── Content ─────────────────────────────────────────────────── */}
          {items.length === 0 ? (
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm">
              <EmptyState />
            </div>
          ) : (
            // <div className="grid grid-cols-1  gap-6 items-start">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-start">
              {/* Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <WishlistCard key={item.id} item={item} onRemove={handleRemove} />
                ))}
              </div>

              {/* Summary */}
              <SummaryCard items={items} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
