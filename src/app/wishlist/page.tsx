"use client";

import AddToCartWidget from "@/components/add-to-cart";
import Breadcrumb from "@/components/breadcum";
import { type RawApiProduct } from "@/components/product-card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCounts } from "@/store/slices/customer-counts/customerCountsSlice";
import {
  fetchWishlist,
  hydrateGuestWishlist,
  resetWishlistFetch,
  toggleGuestWishlistItem,
  toggleWishlistItem,
} from "@/store/slices/wishlist/wishlistSlice";
import {
  BadgeCheck,
  CheckCircle,
  Heart,
  Package,
  RotateCcw,
  Share2,
  ShoppingBag,
  Star,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// ── Types ─────────────────────────────────────────────────────────────────────
type WishlistItem = {
  id: number;         // product_id — matches Redux wishlist.ids
  name: string;
  brand: string;
  modelNo: string;
  image: string;
  price: number;
  originalPrice: number;
  currencySymbol: string;
  warranty: string;
  deliveryDays: string;
  freeShipping: boolean;
  rating: number;
  reviews: number;
  url: string;
  inStock: boolean;
  minQuantity: number;
  isFixed: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawProduct?: any;   // kept for guest re-dispatch
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const resolveStr = (v: unknown): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  const o = v as Record<string, string | undefined>;
  return o.en ?? o.ar ?? "";
};

// Transform wishlist API entry → WishlistItem
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiEntryToWishlistItem = (entry: any, currencySymbol: string): WishlistItem => {
  const p = entry.product ?? {};
  const supplier = p.product_suppliers?.[0];
  const price = parseFloat(supplier?.price ?? p.price ?? 0);
  const salePrice = parseFloat(supplier?.sale_price ?? 0);
  const hasSale = salePrice > 0 && salePrice < price;
  const activePrice = hasSale ? salePrice : price;
  const category = p.categories?.[0];
  const catUrl = category?.seo_url?.url ?? "";
  const prodUrl = p.seo_url?.url ?? String(p.id);
  const min_quantity = p?.min_quantity
  const url = catUrl ? `/${catUrl}/${prodUrl}` : `/${prodUrl}`;

  return {
    id: entry.product_id,
    name: resolveStr(p.name) || p.name || "",
    brand: p.brand?.name ?? resolveStr(p.brand?.translations?.[0]?.name) ?? "",
    modelNo: p.sku ?? "",
    image: Array.isArray(p.images)
      ? (p.images[0] ?? "")
      : (p.images?.en?.[0] ?? p.images?.ar?.[0] ?? ""),
    price: activePrice,
    originalPrice: price,
    currencySymbol: p.currency?.symbol ?? currencySymbol,
    warranty: "",
    deliveryDays: supplier?.delivery_days ?? "",
    freeShipping: !!supplier?.free_shipping,
    rating: 0,
    reviews: 0,
    url,
    inStock: supplier ? !!supplier.in_stock : true,
    minQuantity:min_quantity,
    isFixed: !!supplier?.is_fixed,
    rawProduct: p,
  };
};

// Transform guest localStorage item → WishlistItem
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const guestItemToWishlistItem = (gi: { productId: number; rawProduct: any }, currencySymbol: string): WishlistItem => {
  const p = gi.rawProduct ?? {};
  const supplier = p.suppliers?.[0];
  const price = p.original_price ?? p.price ?? 0;
  const salePrice = p.sale_price ?? 0;
  const hasSale = salePrice > 0 && salePrice < price;
  const activePrice = hasSale ? salePrice : price;
  const raw = Array.isArray(p.images) ? p.images : (p.images?.en ?? p.images?.ar ?? []);
  const productUrl = p.url ?? String(gi.productId);
  const url = productUrl.startsWith("/") ? productUrl : `/${p.parent_category_url ?? ""}/${productUrl}`;

  return {
    id: gi.productId,
    name: resolveStr(p.name) || String(p.name ?? ""),
    brand: resolveStr(p.brand) ?? "",
    modelNo: p.sku ?? "",
    image: raw[0] ?? "",
    price: activePrice,
    originalPrice: price,
    currencySymbol: typeof p.currency === "string" ? p.currency : (p.currency?.symbol ?? currencySymbol),
    warranty: "",
    deliveryDays: p.delivery_days ?? supplier?.delivery_days ?? "",
    freeShipping: !!(supplier?.free_shipping ?? p.free_shipping),
    rating: p.avg_rating ?? 0,
    reviews: p.total_reviews ?? 0,
    url: url || "/",
    inStock: true,
    minQuantity: p.min_quantity ?? supplier?.min_quantity ?? 1,
    isFixed: !!(p.is_fixed ?? supplier?.is_fixed),
    rawProduct: p,
  };
};

// ── Rating Stars ──────────────────────────────────────────────────────────────
const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={12}
        className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
      />
    ))}
  </div>
);

// ── Loading skeleton ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex gap-0 p-0">
      <div className="w-40 h-40 bg-gray-200 animate-pulse shrink-0" />
      <div className="flex-1 p-5 space-y-3">
        <div className="w-24 h-3 bg-gray-200 animate-pulse rounded" />
        <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded" />
        <div className="w-1/2 h-3 bg-gray-100 animate-pulse rounded" />
        <div className="w-1/3 h-3 bg-gray-100 animate-pulse rounded" />
        <div className="flex justify-between items-center pt-3">
          <div className="w-24 h-7 bg-gray-200 animate-pulse rounded" />
          <div className="w-28 h-9 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  </div>
);

// ── Normalise WishlistItem → RawApiProduct for AddToCartWidget ───────────────
const toRawApiProduct = (item: WishlistItem): RawApiProduct => {
  const raw      = item.rawProduct ?? {};
  const supplier = raw.product_suppliers?.[0] ?? raw.suppliers?.[0] ?? {};
  const urlParts = item.url.split("/").filter(Boolean);
  const slug     = urlParts[urlParts.length - 1] ?? String(item.id);
  const parentUrl = urlParts.slice(0, -1).join("/");
  return {
    id: item.id,
    name: item.name,
    url: slug,
    parent_category_url: parentUrl,
    sku: item.modelNo,
    price: item.price,
    sale_price: item.originalPrice > item.price ? item.price : 0,
    original_price: item.originalPrice,
    avg_rating: item.rating,
    total_reviews: item.reviews,
    delivery_days: item.deliveryDays,
    currency: { symbol: item.currencySymbol },
    images: item.image ? [item.image] : [],
    in_wishlist: true,
    min_quantity: item.minQuantity,
    is_fixed: item.isFixed ? 1 : 0,
    quote_available: raw.for_quotes ?? 0,
    selling_type: {
      attribute_value: raw.selling_unit_attribute?.attribute_value ?? "1/Each",
      attribute_value_unit: raw.selling_unit_attribute?.attribute_value ?? "Each",
    },
    suppliers: [{
      vendor_id: supplier.vendor_id,
      delivery_days: item.deliveryDays,
      free_shipping: item.freeShipping,
      min_quantity: item.minQuantity,
      is_fixed: item.isFixed,
    }],
    accessories: raw.accessories ?? [],
  };
};

// ── Item Card ─────────────────────────────────────────────────────────────────
const WishlistCard = ({
  item,
  onRemove,
  onAddedToCart,
}: {
  item: WishlistItem;
  onRemove: (id: number) => void;
  onAddedToCart: (id: number) => void;
}) => {
  const [removing, setRemoving] = useState(false);
  const hasSale = item.originalPrice > item.price;
  const discountPct = hasSale ? ((item.originalPrice - item.price) / item.originalPrice) * 100 : 0;
  const [priceInt, priceDec] = fmtPrice(item.price).split(".");
  const dispatch = useDispatch()
  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => {
      onRemove(item.id);
      dispatch(fetchCounts() as any);
    }, 280);
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
            <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
              <span className="bg-gray-800/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Image";
            }}
          />
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                {item.brand && <span className="text-[11px] font-bold text-[#186737]">{item.brand}</span>}
                {item.brand && item.modelNo && <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />}
                {item.modelNo && <span className="text-[11px] text-gray-400">Model: {item.modelNo}</span>}
              </div>
              <Link href={item.url}>
                <h3 className="font-semibold text-[13px] sm:text-[15px] text-gray-900 hover:text-[#186737] transition-colors line-clamp-2 leading-snug">
                  {/* {item.name} */}
                  <Link href={item.rawProduct?.url} className="text-[#186737] hover:underline">
                    {item.name}
                  </Link>
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

            <button
              onClick={handleRemove}
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              title="Remove from wishlist"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>

          <div className="hidden sm:block mt-3 space-y-1.5">
            {item.warranty && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <BadgeCheck size={13} className="text-[#186737] shrink-0" />
                <span>{item.warranty}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 flex-wrap">
              <Truck size={13} className="text-[#186737] shrink-0" />
              <span className={item.freeShipping ? "text-[#186737]" : ""}>
                Shipping Charges Apply
                {/* {item.freeShipping ? "Free Shipping" : "Shipping Charges Apply"} */}
              </span>
              {item.deliveryDays && (
                <span className="text-gray-400 font-normal">· Mostly Ships in {item.deliveryDays}</span>
              )}
            </div>
          </div>

          {/* Price + Action */}
          <div className="mt-auto pt-2 sm:pt-4 flex items-center justify-between gap-2 sm:gap-3">
            <div>
              <div className="flex items-baseline gap-[2px]">
                <span className="text-base sm:text-[22px] font-bold text-gray-900">
                  {item.currencySymbol}{priceInt}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">.{priceDec}</span>
              </div>
              {hasSale && (
                <p className="text-[10px] text-gray-400 line-through">
                  {item.currencySymbol}{fmtPrice(item.originalPrice)}
                </p>
              )}
            </div>

            <AddToCartWidget
              product={toRawApiProduct(item)}
              showCounter={false}
              isWishlist={true}
              onAddedToCart={onAddedToCart}
              wrapperClassName="flex gap-2 items-center justify-end"
              buttonClassName="flex items-center gap-1 px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-[7px] text-[10px] sm:text-sm font-semibold bg-[#186737] hover:bg-[#145c30] text-white transition-colors whitespace-nowrap"
            />
          </div>

          <div className="sm:hidden mt-2 flex items-center  gap-1 text-[10px] text-gray-400">
            <Truck size={10} className="text-[#186737] shrink-0" />
            <span className={item.freeShipping ? "text-[#186737] font-medium" : ""}>
             Shipping Charges Apply
              {/* {item.freeShipping ? "Free Shipping" : "Shipping Charges Apply"} */}
            </span>
            {item.deliveryDays && <span>· Ships in {item.deliveryDays}</span>}
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
      Save items you love by clicking the heart icon on any product.
    </p>
    <Link
      href="/"
      className="bg-[#186737] relative top-2.5 p-2.5 text-white 2xl:px-4 px-2.5 2xl:py-3 py-1.5 rounded  2xl:text-[14px] text-[12px] flex items-center gap-2"
    >
      <ShoppingBag size={15} /> Start Shopping
    </Link>
  </div>
);

// ── Summary Card ──────────────────────────────────────────────────────────────
const SummaryCard = ({ items }: { items: WishlistItem[] }) => {
  const total   = items.reduce((s, i) => s + i.price, 0);
  const savings = items.reduce((s, i) => s + Math.max(0, i.originalPrice - i.price), 0);
  const sym     = items[0]?.currencySymbol ?? "$";

  return (
    <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 sticky top-24">
      <h3 className="font-bold text-gray-900 text-[15px] mb-4 flex items-center gap-2">
        <Package size={16} className="text-[#186737]" />
        Order Summary
      </h3>

      <div className="space-y-2.5 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Items ({items.length})</span>
          <span className="font-semibold text-gray-900">{sym}{fmtPrice(total)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[#186737] font-medium">You save</span>
            <span className="font-bold text-[#186737]">-{sym}{fmtPrice(savings)}</span>
          </div>
        )}
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="font-bold text-gray-900 text-sm">Estimated Total</span>
          <span className="font-bold text-gray-900 text-lg">{sym}{fmtPrice(total)}</span>
        </div>
      </div>

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
          <span>Shipped from authorized warehouses</span>
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WishlistPage() {
  const dispatch       = useAppDispatch();
  const apiEntries     = useAppSelector((s) => s.wishlist.apiEntries);
  const fetchStatus    = useAppSelector((s) => s.wishlist.fetchStatus);
  const guestItems     = useAppSelector((s) => s.wishlist.guestItems);
  const country        = useAppSelector((s) => s.country.data);
  const currencySymbol = (country as { symbol?: string } | null)?.symbol ?? "$";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [copied,     setCopied]     = useState(false);
  useEffect(() => {
    dispatch(hydrateGuestWishlist());
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
    if (token) {
      dispatch(resetWishlistFetch());
      dispatch(fetchWishlist());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Items derived from Redux — no local state needed
  const items: WishlistItem[] = isLoggedIn
    ? apiEntries.map((e) => apiEntryToWishlistItem(e, currencySymbol))
    : guestItems.map((gi) => guestItemToWishlistItem(gi, currencySymbol));


    console.log("itemsitemsitemsitemsitemsitems",items)

  const loading = isLoggedIn
    ? fetchStatus === "idle" || fetchStatus === "loading"
    : false;

  const handleRemove = (productId: number) => {
    if (isLoggedIn) {
      // toggleWishlistItem.pending removes from apiEntries optimistically
      dispatch(toggleWishlistItem({ productId, currentlyInWishlist: true }));
    } else {
      const gi = guestItems.find((g) => g.productId === productId);
      dispatch(toggleGuestWishlistItem({ productId, rawProduct: gi?.rawProduct ?? {} }));
    }
  };

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "My Wishlist", href: null },
  ];

  return (
    <>
      <Breadcrumb crumbs={crumbs} />
      <main className="min-h-screen bg-gray-50/70">
        <div className="global-container py-6 sm:py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[7px] bg-[#186737] flex items-center justify-center shadow-sm">
                <Heart size={19} className="text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">My Wishlist</h1>
                {!loading && items.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {items.length} item{items.length !== 1 ? "s" : ""} saved
                  </p>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <button
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2 rounded-[7px] border text-sm font-semibold transition-all duration-200 ${
                  copied
                    ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                    : "border-gray-200 text-gray-600 hover:border-[#186737] hover:text-[#186737] bg-white"
                }`}
              >
                {copied ? <CheckCircle size={15} /> : <Share2 size={15} />}
                {copied ? "Link Copied!" : "Share List"}
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-start">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
              <div className="hidden lg:block bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 h-64 animate-pulse" />
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm">
              <EmptyState />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-start">
              <div className="space-y-4">
                {items.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    onAddedToCart={() => {}}
                  />
                ))}
              </div>
              <SummaryCard items={items} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
