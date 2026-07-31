"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import AddToCartWidget from "@/components/add-to-cart";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  currencySymbol: string;
  unit: string;
  url: string;
  hasSale: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawProduct?: any;
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const toNum = (v: number | string | undefined | null): number | undefined =>
  v == null ? undefined : typeof v === "string" ? parseFloat(v) : v;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveLS = (v: any): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v.en ?? v.ar ?? "";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveImages = (raw: any): string[] =>
  Array.isArray(raw) ? raw : (raw?.en ?? raw?.ar ?? []);

// ── Map API similar product to internal Product type ──────────────────────────
// Product fields (title/image_urls/image_alt_tags/selling_type) commonly arrive
// wrapped in {en, ar}, and price/supplier info lives under best_supplier.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapApiProduct = (p: any): Product => {
  const name = resolveLS(p.title) || resolveLS(p.name) || String(p.id ?? "");
  const images = resolveImages(p.image_urls ?? p.images);
  const image = images[0] ?? "";

  const supplier = p.best_supplier ?? p.suppliers?.[0] ?? {};
  const original =
    p.original_price ?? p.price ?? p.best_price ?? toNum(supplier.price) ?? 0;
  const sale = p.sale_price ?? toNum(supplier.sale_price) ?? 0;
  const hasSale = sale > 0 && sale < original;
  const price = hasSale ? sale : original;

  const currency =
    typeof p.currency === "string" ? p.currency : (p.currency?.symbol ?? "$");

  // selling_type sometimes arrives as { en: { attribute_value, attribute_value_unit } }
  const sellingType = p.selling_type?.en ?? p.selling_type?.ar ?? p.selling_type;
  const unit = resolveLS(sellingType?.attribute_value_unit) || "Each";

  const productUrl = p.url ?? p.seo?.url ?? "";
  const url = !productUrl
    ? "#"
    : productUrl.startsWith("/")
      ? productUrl
      : `/${productUrl}`;

  return {
    id: p.id,
    name,
    image,
    price,
    originalPrice: original,
    currencySymbol: currency,
    unit,
    url,
    hasSale,
    rawProduct: { ...p, selling_type: sellingType },
  };
};

// ── Mini Product Card ─────────────────────────────────────────────────────────
const ProductCard = ({ product }: { product: Product }) => {
  const fmtPrice = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="shrink-0 w-36 border border-gray-200 rounded-[7px] bg-white overflow-hidden">
      {/* Image */}
      <Link href={product.url}>
        <div className="bg-gray-50 h-24 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="h-20 w-full object-contain px-2"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/80x80/f3f4f6/9ca3af?text=No+Img";
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-2">
        <Link href={product.url}>
          <p className="text-[10px] text-gray-700 leading-tight line-clamp-2  hover:text-[#186737] transition-colors">
            {product.name}
          </p>
        </Link>

        <div className="mt-1">
          <p
            className={`font-bold text-xs ${product.hasSale ? "text-[#186737]" : "text-[#145c30]"}`}
          >
            {product.currencySymbol}
            {fmtPrice(product.price)}
            <span className="text-gray-400 font-normal text-[9px]">
              /{product.unit}
            </span>
          </p>
          {product.hasSale && (
            <p className="text-[9px] text-gray-400 line-through">
              {product.currencySymbol}
              {fmtPrice(product.originalPrice)}
            </p>
          )}
        </div>

        {/* Add To Cart Widget */}
        {product.rawProduct ? (
          <AddToCartWidget
            product={product.rawProduct}
            wrapperClassName="flex gap-1 items-center w-full mt-1.5"
            counterClassName="flex items-center border border-[#BCE3C9] rounded overflow-hidden h-6 shrink-0 w-[60px]"
            counterButtonClassName="w-5 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
            buttonClassName="flex-1 h-6 text-[9px] font-bold rounded flex items-center justify-center bg-[#186737] hover:bg-[#145c30] text-white"
            iconShow={false}
          />
        ) : (
          <button className="w-full mt-1.5 h-6 text-[9px] font-bold rounded bg-[#186737] hover:bg-[#145c30] text-white transition-colors">
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

// ── Scrollable Row ────────────────────────────────────────────────────────────
const ProductRow = ({ products }: { products: Product[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const slide = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  const showArrows = products.length > 4;

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {showArrows && (
        <button
          onClick={() => slide("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-7 h-7 bg-white border border-gray-200 shadow rounded-full flex items-center justify-center hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={14} className="text-gray-600" />
        </button>
      )}

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Right Arrow */}
      {showArrows && (
        <button
          onClick={() => slide("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-7 h-7 bg-white border border-gray-200 shadow rounded-full flex items-center justify-center hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={14} className="text-gray-600" />
        </button>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AlternateAiProducts = ({
  similarProductsGuest = [],
  alternateProducts = [],
}: {
  similarProductsGuest?: any[];
  alternateProducts?: any[];
}) => {
  const similar = similarProductsGuest.map(mapApiProduct);
  const AI_PRODUCTS = alternateProducts.map(mapApiProduct);

  const hasAI = AI_PRODUCTS.length > 0;
  const hasSimilar = similar.length > 0;
  if (!hasAI && !hasSimilar) return null;



  return (
    <div className="mt-8 hidden md:grid grid-cols-2  gap-4">
      {hasAI && (
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="lg:text-lg xl:text-2xl md:text-base font-bold text-gray-800">
              AI-Recommended Alternatives
            </h2>
          </div>
          <div className="px-4 py-3">
            <ProductRow products={AI_PRODUCTS} />
          </div>
        </div>
      )}

      {hasSimilar && (
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="lg:text-lg xl:text-2xl md:text-base font-bold text-gray-800">
              Similar Products
            </h2>
          </div>
          <div className="px-4 py-3">
            <ProductRow products={similar} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AlternateAiProducts;
