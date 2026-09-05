"use client";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  seedWishlistIds,
  toggleWishlistItem,
  toggleGuestWishlistItem,
  hydrateGuestWishlist,
} from "@/store/slices/wishlist/wishlistSlice";
import {
  CheckCircle,
  FileText,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { addToQuote, useQuoteList } from "@/utils/quoteStorage";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import AddToCartWidget from "../add-to-cart";
import TickerBadge from "../ticker-badge";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCounts } from "@/store/slices/customer-counts/customerCountsSlice";
import { CurrencySymbol } from "../currency-symbol";

// ─── Types ──────────────────────────────────────────────────────────────────
type LS = { en?: string; ar?: string } | string;

export interface ApiProduct {
  id: number;
  name: string;
  url: string;
  sku: string;
  category_url: string;
  parent_category_url: string;
  price: number;
  sale_price: number;
  original_price: number;
  front_sale_price: number;
  best_price: number;
  avg_rating: number | null;
  total_reviews: number;
  delivery_days: string;
  currency: string;
  images: string[];
  alt_tags: string[];
  in_wishlist: boolean;
  in_cart?: boolean;
  min_quantity: number;
  is_fixed: number;
  quote_available: number | null;
  selling_type: { attribute_value: string; attribute_value_unit: string };
  free_shipping: number;
  return_policy: string;
  isRequired: boolean;
  suppliers?: {
    vendor_id?: number;
    delivery_days?: string;
    free_shipping?: boolean | number;
    min_quantity?: number;
    is_fixed?: boolean | number;
  }[];
  
   accessories?: {
    id: number;
    name: LS | { en?: string; ar?: string };
    is_required: number;
    accessory_item: {
      id: number;
      name: LS | { en?: string; ar?: string };
      price: number;
    }[];
  }[];
}

export interface RawApiProduct {
  id: number;
  name?: LS;
  title?: string;
  url: string;
  sku?: string;
  category_url?: string;
  parent_category_url?: string;
  price?: number;
  sale_price?: number;
  original_price?: number;
  best_price?: number;
  avg_rating: number | null;
  total_reviews?: number;
  reviews_count?: number;
  delivery_days?: string;
  currency?: {
    name?: string;
    symbol?: string;
    title?: string;
  };
  images?: string[] | { en?: string[]; ar?: string[] };
  image_urls?: string[];
  alt_tags?: string[];
  image_alt_tags?: { en?: string | null; ar?: string | null };
  in_wishlist?: boolean;
  in_cart?: boolean;
  min_quantity?: number;
  is_fixed?: number | boolean;
  quote_available?: number | boolean | null;
  for_quotes?: number | boolean;
  selling_type?: { attribute_value: LS; attribute_value_unit: LS };
  suppliers?: {
    vendor_id?: number;
    delivery_days?: string;
    free_shipping?: boolean | number;
    min_quantity?: number;
    is_fixed?: boolean | number;
    sale_price?: number | string;
    price?: number | string;
  }[];
  best_supplier?: {
    id?: number;
    vendor_id?: number;
    sale_price?: number | string;
    price?: number | string;
    min_quantity?: number;
    is_fixed?: number | boolean;
    delivery_days?: string;
    return_policy?: string;
    free_shipping?: boolean | number;
    warranty_information?: string;
  };
  isRequired?: boolean;
  is_accessory_required?: boolean;
  accessories?: {
    id: number;
    name: LS | { en?: string; ar?: string };
    is_required: number;
    accessory_item?: {
      id: number;
      name: LS | { en?: string; ar?: string };
      price: number;
    }[];
    accessory_types?: {
      id: number;
      name: LS | { en?: string; ar?: string };
      price: number;
    }[];
  }[];
  product_accessories?: {
    id: number;
    name: LS | { en?: string; ar?: string };
    is_required: number;
    accessory_item?: {
      id: number;
      name: LS | { en?: string; ar?: string };
      price: number;
    }[];
    accessory_types?: {
      id: number;
      name: LS | { en?: string; ar?: string };
      price: number;
    }[];
  }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const resolveStr = (
  v: LS | { name?: string; symbol?: string } | undefined,
  locale = "en",
): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  const o = v as Record<string, string | undefined>;
  if (locale === "ar") return o.ar ?? o.en ?? o.name ?? o.symbol ?? "";
  return o.en ?? o.ar ?? o.name ?? o.symbol ?? "";
};

type CurrencyField =
  | string
  | { name?: string; symbol?: string; display_title?: string }
  | undefined;
const resolveCurrencySymbol = (c: CurrencyField): string => {
  if (!c) return "AED";
  if (typeof c === "string") return c;
  return c.symbol ?? c.name ?? "AED";
};

interface ProductCardProps {
  product: ApiProduct | RawApiProduct;
  newUrl?: string;
  aboveFold?: boolean;
  onWishlistToggle?: (
    product: ApiProduct | RawApiProduct,
    inWishlist: boolean,
  ) => void;
  onBeforeAdd?: () => Promise<void>;
  onAddSuccess?: () => void;
  onAddedToCart?: (productId: number) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ─── Rating Stars ─────────────────────────────────────────────────────────────
const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-[2px]">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={
          s <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ))}
  </div>
);

// ─── Quantity Counter (reusable export) ──────────────────────────────────────
export const QuantityCounter = ({
  count,
  min,
  onIncrement,
  onDecrement,
  onChange,
  isFixed = false,
}: {
  count: number;
  min: number;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
  onChange: (v: number) => void;
  isFixed?: boolean;
}) => (
  <div className="flex items-center  border border-[#BCE3C9] rounded-[4px] overflow-hidden bg-white flex-shrink-0 3xl:w-[90px] 3xl:h-[44px] xl:w-[85px] xl:h-[35px]  w-[75px] h-[29px]">
    <button
      onClick={onDecrement}
      disabled={count <= min}
      aria-label="Decrease quantity"
      className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
    >
      <Minus size={15} className="text-[#4B5563]" strokeWidth={2} />
    </button>
    <input
      type="text"
      aria-label="Quantity"
      value={count}
      disabled={isFixed}
      onChange={(e) => {
        const v = parseInt(e.target.value);
        if (!isNaN(v) && v >= 1 && v <= 99) onChange(v);
      }}
      className="w-8 text-center 3xl:text-[15px] xl:text-[12px] text-[10px] font-semibold text-[#186737] border-0 outline-none bg-transparent disabled:cursor-not-allowed"
    />
    <button
      onClick={onIncrement}
      disabled={count >= 99}
      aria-label="Increase quantity"
      className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
    >
      <Plus size={15} className="text-[#4B5563]" strokeWidth={2} />
    </button>
  </div>
);

// ─── Add To Cart Button (reusable export) ────────────────────────────────────
export const AddToCartButton = ({
  onClick,
  label = "Add To Cart",
  variant = "cart",
  success = false,
}: {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
  variant?: "cart" | "quote";
  success?: boolean;
}) => (
  <button
    onClick={onClick}
    className={[
      "flex-1 3xl:h-[44px] 2xl:h-[36px] md:h-[34px] rounded-[4px]  3xl:text-[14px] 2xl:text-[12px]   text-[10px] font-semibold ",
      "flex items-center justify-center gap-2 transition-colors duration-200",
      success
        ? "bg-[#186737] hover:bg-[#145c30] text-white"
        : variant === "quote"
          ? "bg-[#A6131D] hover:bg-[#8b1018] text-white"
          : "bg-[#186737] hover:bg-[#145c30] text-white",
    ].join(" ")}
  >
    {success ? (
      <CheckCircle size={16} strokeWidth={2} />
    ) : variant !== "quote" ? (
      <ShoppingCart size={16} strokeWidth={2} />
    ) : null}
    {success ? "Added!" : label}
  </button>
);

// ─── Main ProductCard ─────────────────────────────────────────────────────────
export const ProductCard = ({
  product,
  newUrl,
  aboveFold = false,
  onWishlistToggle,
  onBeforeAdd,
  onAddSuccess,
  onAddedToCart,
}: ProductCardProps) => {
  const locale = useLocale();
  const dispatch = useAppDispatch();
  // const state = useAppSelector((s) => s?.country);
  const {country} = useAppSelector((s) => s);

  // ── Wishlist from Redux ───────────────────────────────────────────────
  const wishlistIds = useAppSelector((s) => s.wishlist.ids);
  const wishlistHydrated = useAppSelector((s) => s.wishlist.hydrated);
  const isToggling = useAppSelector((s) =>
    s.wishlist.toggling.includes(product.id),
  );
  const isLoggedIn = useAppSelector((s) => !!(s.auth as any).customer);
  // Logged-in: ISR cache ka in_wishlist unreliable hai (shared cache) — sirf Redux use karo
  // Guest: SSR in_wishlist reliable hai (no auth, sab ko same data) — flicker bachao
  const inWishlist = wishlistHydrated
    ? wishlistIds.includes(product.id)
    : isLoggedIn
      ? false
      : !!product.in_wishlist;
  // ── Normalise fields that may arrive in either flat or localised form ──
  const name = resolveStr(
    product.name ?? (product as RawApiProduct).title,
    locale,
  );
  const rawImages = product.images ?? (product as RawApiProduct).image_urls;
  const images_ = Array.isArray(rawImages)
    ? (rawImages as string[])
    : locale === "ar"
      ? ((rawImages as { ar?: string[]; en?: string[] })?.ar ??
        (rawImages as { en?: string[] })?.en ??
        [])
      : ((rawImages as { en?: string[] })?.en ??
        (rawImages as { ar?: string[] })?.ar ??
        []);
  const singleAltTag = resolveStr(
    (product as RawApiProduct).image_alt_tags as LS | undefined,
    locale,
  );
  const supplier0 =
    (product as RawApiProduct).suppliers?.[0] ??
    (product as RawApiProduct).best_supplier;
  const deliveryDays = product.delivery_days ?? supplier0?.delivery_days ?? "";

  const sellUnitStr = resolveStr(
    product.selling_type?.attribute_value_unit,
    locale,
  );
  const toNum = (v: number | string | undefined): number | undefined =>
    v == null ? undefined : typeof v === "string" ? parseFloat(v) : v;
  const originalPrice =
    product.original_price ??
    product.price ??
    product.best_price ??
    toNum(supplier0?.price) ??
    0;
  const salePrice = product.sale_price ?? toNum(supplier0?.sale_price) ?? 0;
  const totalReviews =
    product.total_reviews ?? (product as RawApiProduct).reviews_count ?? 0;
  const minQty = product.min_quantity ?? supplier0?.min_quantity ?? 1;
  const isFixed =
    product.is_fixed != null ? !!product.is_fixed : !!supplier0?.is_fixed;
  const isQuote = !!(
    product.quote_available ?? (product as RawApiProduct).for_quotes
  );
  const quoteItems = useQuoteList();
  const inQuoteList = quoteItems.some((item) => item.id === product.id);
  const [quoteAdded, setQuoteAdded] = useState(false);

  // Hydrate guest wishlist from localStorage (guarded inside reducer — runs once)
  // and seed logged-in wishlist from product's in_wishlist field
  useEffect(() => {
    dispatch(hydrateGuestWishlist());
    if (product.in_wishlist) dispatch(seedWishlistIds([product.id]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Accessories modal ────────────────────────────────────────────────
  const rawAccessories =
    (product as RawApiProduct).accessories ??
    (product as RawApiProduct).product_accessories ??
    [];
  const hasRequiredAccessories =
    rawAccessories.some((a) => a.is_required === 1) ||
    !!(product as RawApiProduct).is_accessory_required;
  const [accessoryModalOpen, setAccessoryModalOpen] = useState(false);
  const [selectedAccItems, setSelectedAccItems] = useState<
    Record<number, number | null>
  >({});
  const [accShowErrors, setAccShowErrors] = useState(false);
  const accCanAddToCart = rawAccessories.every(
    (a) => a.is_required !== 1 || selectedAccItems[a.id] != null,
  );
  const resolveAccName = (
    n: LS | { en?: string; ar?: string } | undefined,
  ): string => {
    if (!n) return "";
    if (typeof n === "string") return n;
    const o = n as Record<string, string | undefined>;
    return locale === "ar" ? (o.ar ?? o.en ?? "") : (o.en ?? o.ar ?? "");
  };
  const selectedAccessoryIds = Object.values(selectedAccItems).filter(
    (v): v is number => v != null,
  );

  // ── Price logic (sale_price=0 means no sale) ─────────────────────────
  const hasSale = salePrice > 0 && salePrice !== originalPrice;

  const activePrice = hasSale ? salePrice : originalPrice;

  const discountPct = hasSale
    ? ((originalPrice - salePrice) / originalPrice) * 100
    : 0;

  // ── Currency symbol: prefer country Redux, fallback to API field ─────
  // Price amount comes from API as-is. Client-side fetch (useEffect in
  // sub-category) re-fetches with user IP → correct local-currency prices.

  const [priceInt, priceDec] = fmtPrice(activePrice).split(".");

  // ── Hover image slider ───────────────────────────────────────────────
  const images = images_.length > 0 ? images_ : ["/placeholder.png"];
  const hasMultipleImages = images.length > 1;
  const [imgIndex, setImgIndex] = useState(0);
  const [showHoverImages, setShowHoverImages] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasHoveredRef = useRef(false);

  const startSlide = useCallback(() => {
    if (!hasMultipleImages) return;
    if (!hasHoveredRef.current) {
      hasHoveredRef.current = true;
      setShowHoverImages(true);
    }
    intervalRef.current = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % Math.min(images.length, 5));
    }, 900);
  }, [hasMultipleImages, images.length]);

  const stopSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setImgIndex(0);
  }, []);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isToggling) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      // Logged-in: call API
      dispatch(
        toggleWishlistItem({
          productId: product.id,
          currentlyInWishlist: inWishlist,
        }),
      )
        .then(() => dispatch(fetchCounts() as any))
        .catch(() => {});
    } else {
      // Guest: save full product to localStorage
      dispatch(
        toggleGuestWishlistItem({ productId: product.id, rawProduct: product }),
      );
    }
    if (onWishlistToggle) onWishlistToggle(product, !inWishlist);
  };

  const urlPrefix = product.parent_category_url ?? newUrl;
  const productLink = product.url?.startsWith("/")
    ? product.url
    : product.url?.includes("/")
      ? `/${product.url}`
      : urlPrefix
        ? `/${urlPrefix}/${product.url}`
        : `/${product.url}`;
  const displayImages = images.slice(0, 5);
  const visibleImages = showHoverImages
    ? displayImages
    : displayImages.slice(0, 1);

  return (
    <div className="bg-white rounded-[7px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer flex flex-col h-full border border-transparent hover:border-[#dceee4] hover:shadow-[0_4px_20px_rgba(0,0,0,0.11)] transition-all duration-200">
      {/* ── IMAGE AREA ───────────────────────────────────────────────── */}
      <div className="relative bg-white">
        {/* Discount badge */}
        {hasSale && discountPct > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#FCE8EA] text-red-500 px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap">
              -{Math.round(discountPct)}%
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          disabled={isToggling}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 z-10 w-[36px] h-[36px] bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-60"
        >
          <Heart
            size={17}
            strokeWidth={2}
            className={
              inWishlist ? "fill-[#186737] text-[#186737]" : "text-gray-400"
            }
          />
        </button>

        {/* Product images */}
        <Link href={productLink}>
          <div
            className="relative w-full aspect-square overflow-hidden bg-gray-50"
            onMouseEnter={startSlide}
            onMouseLeave={stopSlide}
          >
            {visibleImages.length === 0 ? (
              <Image
                src=""
                alt={name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 175px, (max-width: 1024px) 33vw, 20vw"
              />
            ) : (
              visibleImages.map((img, i) => (
                <Image
                  key={img}
                  src={img}
                  alt={product.alt_tags?.[i] || singleAltTag || name}
                  fill
                  priority={aboveFold && i === 0}
                  loading={aboveFold && i === 0 ? "eager" : "lazy"}
                  className="object-contain p-2 transition-opacity duration-500"
                  style={{ opacity: imgIndex === i ? 1 : 0 }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://placehold.co/400";
                    (e.currentTarget as HTMLImageElement).style.opacity = "1";
                  }}
                  sizes="(max-width: 640px) 175px, (max-width: 1024px) 33vw, 20vw"
                />
              ))
            )}
          </div>
        </Link>

        {/* Slider dots */}
        {hasMultipleImages ? (
          <div className="flex justify-center items-center gap-1.5 pb-2.5 pt-0.5">
            {displayImages.map((_, i) => (
              <span
                key={i}
                className="block rounded-full transition-all duration-300"
                style={{
                  width: imgIndex === i ? "18px" : "6px",
                  height: "6px",
                  background: imgIndex === i ? "#186737" : "#d1d5db",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="h-3" />
        )}
      </div>

      {/* ── CONTENT AREA ─────────────────────────────────────────────── */}
      <div className="px-3 pb-3 pt-2 md:px-4 md:pb-4 md:pt-2 flex flex-col flex-1 border-t border-gray-100">
        {/* Product name */}
        <Link href={productLink}>
          <p className="md:font-semibold font-semibold text-[13.5px] lg:text-[14.5px] text-gray-900 line-clamp-2 hover:text-[#186737] transition-colors leading-snug">
            {name}
          </p>
        </Link>

        {/* SKU */}
        {product.sku && (
          <p
            className="mt-1.5 text-xs text-[#6B7280] font-medium"
            title={product.sku}
          >
           Item No: {product.sku}
          </p>
        )}

        {/* Rating — only show if rating exists */}
        {product.avg_rating ? (
          <div className="flex items-center gap-1.5 mt-2 mb-1.5">
            <RatingStars rating={product.avg_rating} />
            <span className="text-[13px] font-bold text-[#4B5563]">
              {product.avg_rating.toFixed(1)}
            </span>
            {totalReviews > 0 && (
              <span className="text-[11px] text-gray-400">
                ({totalReviews})
              </span>
            )}
          </div>
        ) : (
          <TickerBadge />
        )}

        {/* Shipping row */}
        <p className="mt- text-[12.5px] font-semibold text-[#4B5563] hidden md:flex items-center gap-1">
          <Truck size={13} className="text-[#186737] flex-shrink-0" />
          {/* Shipping charges apply */}
          Free Delivery in {country?.data?.name}
        </p>
        <p className="mt- text-[12.5px] font-semibold text-[#4B5563] md:hidden flex items-center gap-1">
          <Truck size={13} className="text-[#186737] flex-shrink-0" />
          Shipping Fee
        </p>

        {/* Ships in X Days */}
        <p className="mt-1 text-[12.5px] text-[#4B5563]">
          {deliveryDays ? (
            <span className="font-bold text-gray-900">
              Mostly Ships in {deliveryDays}
            </span>
          ) : (
            <span className="font-semibold">Now Shipping Faster</span>
          )}
        </p>

        {/* ── PRICE — mt-auto pushes to bottom ─────────────────────── */}
        <div className="mt-auto pt-3">
          {isQuote ? (
            <div style={{ minHeight: "62px" }}>
              <h2 className="text-[#186737] text-[15px] font-normal">
                Can&apos;t See the Price?
              </h2>
              <p className="text-[#64748B] text-[12px] mt-1 leading-snug">
                Click &ldquo;Request A Quote&rdquo; to receive your best prices.
              </p>
            </div>
          ) : (
            <div>
              {/* Main price line: -11%  $19,990.26  /Each */}
              <div className="flex items-baseline gap-2 flex-wrap leading-none">
                {hasSale && (
                  <span className="text-red-600 text-[13px] font-semibold relative top-[2px]">
                    -{Math.round(discountPct)}%
                  </span>
                )}
                <div className="flex items-baseline xl:text-[22px]  lg:text-[18px] md:text-base  gap-[1px]">
                  <b
                    className={`font-bold leading-none ${
                      hasSale ? "text-[#186737]" : "text-gray-900"
                    }`}
                  >
                    {typeof product?.currency === "object"
                      ? <> <CurrencySymbol currency={product.currency?.symbol } weight="bold" fontsize={"20px"} /></>
                    : <><CurrencySymbol currency={product?.currency || "AED"} weight="bold" fontsize={"20px"} /></>}
                    {priceInt}
                  </b>
                  <span
                    className={`text-[14px] font-bold leading-none ${
                      hasSale ? "text-[#186737]" : "text-gray-900"
                    }`}
                  >
                    .{priceDec}
                  </span>
                </div>
                {sellUnitStr && (
                  <span className="text-[13px] text-[#6B7280] font-medium">
                    /{sellUnitStr}
                  </span>
                )}
              </div>

              {/* WAS price */}
              {hasSale ? (
                <p className="text-[#6B7280] font-semibold text-[13px] line-through mt-1">
                  WAS{" "}
                  {typeof product?.currency === "object"
                    ? <> <CurrencySymbol currency={product.currency?.symbol } weight="bold" fontsize={"14px"} /></>
                    : <><CurrencySymbol currency={product?.currency || "AED"} weight="bold" fontsize={"14px"} /></>}{" "}
                  {fmtPrice(originalPrice)}
                </p>
              ) : null}
              {/* {hasSale ? (
                <p className="text-[#6B7280] font-semibold text-[13px] line-through mt-1">
                  WAS{" "}
                  {typeof product?.currency === "object"
                    ? product.currency?.symbol || "AED"
                    : product?.currency || "AED"}{" "}
                  {fmtPrice(originalPrice)}
                </p>
              ) : null} */}
            </div>
          )}
        </div>

        {/* ── COUNTER + CTA ─────────────────────────────────────────── */}
        {/*
          AddToCartWidget — sirf product pass karo, baaki sab widget khud handle karta hai:
            - Quantity counter (min_quantity aur is_fixed respect karta hai)
            - Redux cart mein item add karta hai
            - Guest user ke liye localStorage mein save karta hai
            - "Added!" success flash automatically dikhata hai

          Dusri jagah use karne ke liye CSS customize karo:
            <AddToCartWidget
              product={product}
              wrapperClassName="flex gap-3 mt-4"           ← wrapper div
              counterClassName="flex border rounded-lg h-10 w-28"  ← counter size
              buttonClassName="h-10 px-6 rounded-lg font-semibold bg-[#186737] text-white"  ← button
            />
        */}
        {/* Accessories Modal */}
        <Modal
          isOpen={accessoryModalOpen}
          onClose={() => {
            setAccessoryModalOpen(false);
            setAccShowErrors(false);
            setSelectedAccItems({});
          }}
          title={`Product Accessories`}
          width="max-w-md"
          showFooter={false}
          zIndex
        >
          {/* Product mini info */}
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
            {images_.length > 0 && (
              <img
                src={images_[0]}
                alt={name}
                className="w-14 h-14 object-contain rounded-[7px] border border-gray-100 bg-gray-50"
              />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                {name}
              </p>
              {product.sku && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Model No: {product.sku}
                </p>
              )}
            </div>
          </div>

          {/* Accessory selectors */}
          {rawAccessories.map((acc) => {
            const isRequired = acc.is_required === 1;
            const hasError =
              accShowErrors && isRequired && selectedAccItems[acc.id] == null;
            return (
              <div key={acc.id} className="mb-4">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1.5">
                  <ShieldCheck
                    size={15}
                    className={
                      isRequired
                        ? "text-red-500 shrink-0"
                        : "text-[#186737] shrink-0"
                    }
                  />
                  <span className="capitalize">{resolveAccName(acc.name)}</span>
                  {isRequired && (
                    <span className="text-red-500 text-xs font-normal">*</span>
                  )}
                </p>
                <Select
                  value={selectedAccItems[acc.id]?.toString() ?? ""}
                  onValueChange={(val) => {
                    setSelectedAccItems((prev) => ({
                      ...prev,
                      [acc.id]: Number(val),
                    }));
                    if (val) setAccShowErrors(false);
                  }}
                >
                  <SelectTrigger
                    className={`w-full h-10 text-sm focus:ring-[#186737] ${hasError ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                  >
                    <SelectValue
                      placeholder={`Select ${resolveAccName(acc.name)}…`}
                    />
                  </SelectTrigger>
                  <SelectContent className="z-10000">
                    {(acc.accessory_item ?? acc.accessory_types ?? []).map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {resolveAccName(item.name)} — +
                        {Number(item.price).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasError && (
                  <p className="text-xs text-red-500 mt-1">
                    Please select {resolveAccName(acc.name)}
                  </p>
                )}
              </div>
            );
          })}

          {/* Add to Cart inside modal */}
          <div
            onClickCapture={(e) => {
              if (!accCanAddToCart) {
                e.stopPropagation();
                setAccShowErrors(true);
              }
            }}
          >
            <AddToCartWidget
              product={product}
              accessoryItemIds={selectedAccessoryIds}
              wrapperClassName="flex gap-2 items-center w-full mt-2"
              buttonClassName={`flex-1 h-11 rounded-[7px] text-sm font-bold text-white ${(product as RawApiProduct).quote_available ? "bg-[#A6131D] hover:bg-[#8b1018]" : "bg-[#186737] hover:bg-[#145c30]"}`}
              onBeforeAdd={onBeforeAdd}
              onAddSuccess={onAddSuccess}
              onAddedToCart={onAddedToCart}
            />
          </div>
        </Modal>

        {/* Add To Cart — open modal if required accessories exist */}
        <div
          onClickCapture={(e) => {
            if (hasRequiredAccessories && !accessoryModalOpen && !isQuote) {
              e.stopPropagation();
              setAccessoryModalOpen(true);
            }
          }}
        >
          <AddToCartWidget
            product={product}
            accessoryItemIds={selectedAccessoryIds}
            wrapperClassName="flex gap-2 items-center w-full mt-2"
            onBeforeAdd={onBeforeAdd}
            onAddedToCart={onAddedToCart}
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inQuoteList || quoteAdded) return;
            const supplier =
              (product as RawApiProduct).suppliers?.[0] ??
              (product as RawApiProduct).best_supplier;
            const quotePrice = salePrice > 0 ? salePrice : originalPrice;
            addToQuote({
              id: product.id,
              name,
              brand: "",
              sku: product.sku ?? "",
              image: images_[0] ?? "",
              warranty: "—",
              deliveryDays: deliveryDays,
              shippingCost: Number(
                (supplier as { shipping_charge?: number } | undefined)
                  ?.shipping_charge ?? 0,
              ),
              price: quotePrice,
              qty: minQty || 1,
              vendorId: supplier?.vendor_id,
              accessoryItemIds: selectedAccessoryIds,
              product,
            });
            setQuoteAdded(true);
          }}
          className={`w-full mt-2 3xl:h-[44px] 2xl:h-[36px] md:h-[34px] h-[29px] rounded-[4px] 3xl:text-[14px] 2xl:text-[12px] text-[10px] font-semibold flex items-center justify-center gap-1.5 text-white transition-all ${
            inQuoteList || quoteAdded
              ? "bg-[#8B1515]"
              : "hover:brightness-110 hover:shadow-md"
          }`}
          style={
            inQuoteList || quoteAdded
              ? undefined
              : {
                  background: "#FD1D1D",
                  backgroundImage:
                    "linear-gradient(220deg, rgba(253, 29, 29, 1) 9%, rgba(252, 176, 69, 1) 79%)",
                }
          }
        >
          {inQuoteList || quoteAdded ? (
            <>
              <CheckCircle size={14} strokeWidth={2} />
              Added to Quote
            </>
          ) : (
            <>
              <FileText size={14} strokeWidth={2} />
              Add to Quote
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
