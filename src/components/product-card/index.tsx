"use client";
import {
  CheckCircle,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import TickerBadge from "../ticker-badge";

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
  min_quantity: number;
  is_fixed: number;
  quote_available: number | null;
  selling_type: { attribute_value: string; attribute_value_unit: string };
  free_shipping: number;
  return_policy: string;
  isRequired: boolean;
}

interface RawApiProduct {
  id: number;
  name: LS;
  url: string;
  sku?: string;
  category_url?: string;
  parent_category_url?: string;
  price: number;
  sale_price: number;
  original_price?: number;
  avg_rating: number | null;
  total_reviews: number;
  delivery_days?: string;
  currency?: LS | { name?: string; symbol?: string };
  images: string[] | { en?: string[]; ar?: string[] };
  alt_tags?: string[];
  in_wishlist?: boolean;
  min_quantity?: number;
  is_fixed?: number | boolean;
  quote_available?: number | boolean | null;
  selling_type?: { attribute_value: LS; attribute_value_unit: LS };
  suppliers?: { delivery_days?: string; free_shipping?: boolean | number }[];
  isRequired?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const resolveStr = (v: LS | { name?: string; symbol?: string } | undefined, locale = "en"): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  const o = v as Record<string, string | undefined>;
  if (locale === "ar") return o.ar ?? o.en ?? o.name ?? o.symbol ?? "";
  return o.en ?? o.ar ?? o.name ?? o.symbol ?? "";
};

type CurrencyField = string | { name?: string; symbol?: string; display_title?: string } | undefined;
const resolveCurrencySymbol = (c: CurrencyField): string => {
  if (!c) return "AED";
  if (typeof c === "string") return c;
  return c.symbol ?? c.name ?? "AED";
};

interface ProductCardProps {
  product: ApiProduct | RawApiProduct;
  newUrl?: string;
  onAddToCart?: (product: ApiProduct | RawApiProduct, quantity: number) => void;
  onWishlistToggle?: (product: ApiProduct | RawApiProduct, inWishlist: boolean) => void;
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
      className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
    >
      <Minus size={15} className="text-[#4B5563]" strokeWidth={2} />
    </button>
    <input
      type="text"
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
        ? "bg-emerald-600 text-white"
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
  newUrl = "products",
  onAddToCart,
  onWishlistToggle,
}: ProductCardProps) => {
  const locale = useLocale();
  // ── Normalise fields that may arrive in either flat or localised form ──
  const name = resolveStr(product.name, locale);
  const rawImages = product.images;
  const images_ = Array.isArray(rawImages)
    ? (rawImages as string[])
    : (locale === "ar"
        ? ((rawImages as { ar?: string[]; en?: string[] })?.ar ?? (rawImages as { en?: string[] })?.en ?? [])
        : ((rawImages as { en?: string[] })?.en ?? (rawImages as { ar?: string[] })?.ar ?? []));
  const deliveryDays = product.delivery_days ?? ("suppliers" in product ? (product as RawApiProduct).suppliers?.[0]?.delivery_days : undefined) ?? "";
  const currencyStr = resolveCurrencySymbol(product.currency as CurrencyField);
  const sellUnitStr = resolveStr(product.selling_type?.attribute_value_unit, locale);
  const originalPrice = product.original_price ?? product.price ?? 0;
  const minQty = product.min_quantity || 1;
  const isFixed = !!product.is_fixed;
  const isQuote = !!product.quote_available;

  const [count, setCount] = useState(minQty);
  const [wishlisted, setWishlisted] = useState(product.in_wishlist ?? false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // ── Price logic (sale_price=0 means no sale) ─────────────────────────
  const hasSale =
    product.sale_price > 0 &&
    product.sale_price !== originalPrice;

  const activePrice = hasSale ? product.sale_price : originalPrice;

  const discountPct = hasSale
    ? ((originalPrice - product.sale_price) / originalPrice) * 100
    : 0;

  const [priceInt, priceDec] = fmtPrice(activePrice).split(".");

  // ── Hover image slider ───────────────────────────────────────────────
  const images = images_.length > 0 ? images_ : ["/placeholder.png"];
  const hasMultipleImages = images.length > 1;
  const [imgIndex, setImgIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSlide = useCallback(() => {
    if (!hasMultipleImages) return;
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
    []
  );

  // ── Handlers ────────────────────────────────────────────────────────
  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFixed) {
      if (count + minQty <= 99) setCount(count + minQty);
    } else if (count < 99) {
      setCount(count + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFixed) {
      if (count - minQty >= minQty) setCount(count - minQty);
    } else if (count > minQty) {
      setCount(count - 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product, count);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !wishlisted;
    setWishlisted(next);
    if (onWishlistToggle) onWishlistToggle(product, next);
  };

  const productLink = product.url?.startsWith("/")
    ? product.url
    : `/${product.parent_category_url ?? newUrl}/${product.url}`;
  const displayImages = images.slice(0, 5);

  return (
    <div
      className="bg-white rounded-[7px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer flex flex-col h-full border border-transparent hover:border-[#dceee4] hover:shadow-[0_4px_20px_rgba(0,0,0,0.11)] transition-all duration-200"
      onMouseEnter={startSlide}
      onMouseLeave={stopSlide}
    >
      {/* ── IMAGE AREA ───────────────────────────────────────────────── */}
      <div className="relative bg-white">

        {/* Discount badge */}
        {hasSale && discountPct > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#FCE8EA] text-red-500 px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap">
              {discountPct.toFixed(2)}% off
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 z-10 w-[36px] h-[36px] bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
        >
          <Heart
            size={17}
            strokeWidth={2}
            className={wishlisted ? "fill-[#186737] text-[#186737]" : "text-gray-400"}
          />
        </button>

        {/* Product images */}
        <Link href={productLink}>
          <div className="relative w-full aspect-square overflow-hidden">
            {displayImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={product.alt_tags?.[i] || name}
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-500"
                style={{ opacity: imgIndex === i ? 1 : 0 }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
            ))}
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
          <p
            className="md:font-semibold font-semibold text-[13.5px] lg:text-[14.5px] text-gray-900 line-clamp-2 hover:text-[#186737] transition-colors leading-snug"
           
          >
            {name}
          </p>
        </Link>

        {/* SKU */}
        {product.sku && (
          <p className="mt-1.5 text-xs text-[#6B7280] font-medium" title={product.sku}>
            Model No: {product.sku}
          </p>
        )}

        {/* Rating — only show if rating exists */}
        {product.avg_rating ? (
          <div className="flex items-center gap-1.5 mt-2 mb-1.5">
            <RatingStars rating={product.avg_rating} />
            <span className="text-[13px] font-bold text-[#4B5563]">
              {product.avg_rating.toFixed(1)}
            </span>
            {product.total_reviews > 0 && (
              <span className="text-[11px] text-gray-400">
                ({product.total_reviews})
              </span>
            )}
          </div>
        ) : (
          <TickerBadge />
        )}

        {/* Shipping row */}
        <p className="mt- text-[12.5px] font-semibold text-[#4B5563] hidden md:flex items-center gap-1">
          <Truck size={13} className="text-[#186737] flex-shrink-0" />
          Shipping charges apply
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
            <div >
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
                 {currencyStr || "AED"}
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
                  WAS {currencyStr} {fmtPrice(originalPrice)}
                </p>
              ) : null}
            </div>
          )}
        </div>

        {/* ── COUNTER + CTA ─────────────────────────────────────────── */}
        <div className="flex gap-2 items-center w-full mt-2">
          {!isQuote && (
            <QuantityCounter
              count={count}
              min={minQty}
              isFixed={isFixed}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onChange={setCount}
            />
          )}
          <AddToCartButton
            onClick={handleAddToCart}
            label={isQuote ? "Request a Quote" : "Add To Cart"}
            variant={isQuote ? "quote" : "cart"}
            success={addedSuccess}
          />
        </div>
      </div>
    </div>
  );
};



export default ProductCard;