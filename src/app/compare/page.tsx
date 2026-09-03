"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import { AddToCartWidget } from "@/components/add-to-cart";
import Breadcrumb from "@/components/breadcum";
import type { RawApiProduct } from "@/components/product-card";
import type { ProductDetailResponse } from "@/features/product-detail/types";
import { toSearchSuggestions, type NlpSearchResponse } from "@/utils/adapt-nlp-search";
import {
  addToCompare,
  MAX_COMPARE,
  removeFromCompare,
  replaceInCompare,
  useCompareList,
  type CompareProduct,
} from "@/utils/compareStorage";
import { getCountryCodeClient } from "@/utils/country";
import type { SearchProduct } from "@/utils/types";
import { Loader2, Package, Plus, Scale, Search, X } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SEARCH_API = "https://nlpuae-temp.thehorecastore.co/search";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Values from frontend/products/{slug} are typed as plain strings, but the API
// occasionally hands back a localized { en, ar } object at runtime — same
// defensive unwrap used on the product detail page itself.
const localize = (v: unknown): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") return (v as { en?: string; ar?: string }).en ?? (v as { en?: string; ar?: string }).ar ?? String(v);
  return String(v);
};

const firstImage = (images: unknown): string => {
  if (Array.isArray(images)) return images[0] ?? "";
  if (images && typeof images === "object") {
    const obj = images as { en?: string[]; ar?: string[] };
    return obj.en?.[0] ?? obj.ar?.[0] ?? "";
  }
  return "";
};

const toCompareProductFromDetail = (d: ProductDetailResponse): CompareProduct => {
  const brand = localize(
    d.attributes?.find((a) => localize(a.attribute_name) === "Manufacturer")?.attribute_value,
  );
  const specs = (d.attributes ?? []).slice(0, 16).map((a) => ({
    name: localize(a.attribute_name),
    value: a.measurement_unit ? `${localize(a.attribute_value)} ${a.measurement_unit}` : localize(a.attribute_value),
  }));
  const supplier0 = d.suppliers?.[0];

  return {
    id: d.id,
    name: localize(d.name),
    image: firstImage(d.images),
    url: d.url?.startsWith("/") ? d.url : `/${d.url ?? ""}`,
    price: d.price,
    salePrice: d.sale_price > 0 ? d.sale_price : undefined,
    currency: d.currency?.symbol,
    brand,
    sku: d.sku,
    rating: d.avg_rating ?? undefined,
    totalReviews: d.total_reviews,
    specs,
    vendorId: supplier0?.vendor_id,
    minQuantity: (supplier0 as { min_quantity?: number } | undefined)?.min_quantity,
    isFixed: !!(supplier0 as { is_fixed?: boolean | number } | undefined)?.is_fixed,
    quoteAvailable: !!(d as unknown as { quote_available?: boolean | number }).quote_available,
  };
};

export default function ComparePage() {
  const locale = useLocale();
  const list = useCompareList();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingId, setFetchingId] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const countryCode = await getCountryCodeClient();
      const res = await fetch(
        `${SEARCH_API}?query=${encodeURIComponent(q.trim())}&page=1&length=6&force_country=${countryCode}`,
      );
      if (!res.ok) throw new Error("failed");
      const raw: NlpSearchResponse = await res.json();
      const adapted = toSearchSuggestions(raw);
      setResults(adapted.data?.products ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const focusSlot = (slot: number) => {
    setActiveSlot(slot);
    setQuery("");
    setResults([]);
    setFetchError(false);
  };

  const closeSearch = () => {
    setActiveSlot(null);
    setQuery("");
    setResults([]);
    setFetchError(false);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setFetchError(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(val), 300);
  };

  const handlePick = async (slot: number, p: SearchProduct) => {
    setFetchingId(p.id);
    setFetchError(false);
    try {
      const res = await makeApiRequest<{ data: ProductDetailResponse }>(
        apiUrls.PRODUCT_DETAIL(p.url),
        { params: { lang: locale } },
      );
      if (!res?.data) throw new Error("empty product detail response");
      const compareProduct = toCompareProductFromDetail(res.data);
      const existing = list[slot];
      if (existing) {
        replaceInCompare(existing.id, compareProduct);
      } else {
        addToCompare(compareProduct);
      }
      closeSearch();
    } catch {
      setFetchError(true);
    } finally {
      setFetchingId(null);
    }
  };

  useEffect(() => {
    if (activeSlot === null) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) closeSearch();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeSlot]);

  const specRows = (() => {
    const names = new Set<string>();
    list.forEach((p) => p.specs?.forEach((s) => names.add(s.name)));
    return Array.from(names).slice(0, 16);
  })();

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Compare Products", href: null },
  ];

  return (
    <div>
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb crumbs={crumbs} />

        <div className="global-container mx-auto px-4 sm:px-6 py-6">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#186737]/10">
              <Scale size={18} className="text-[#186737]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Compare Products</h1>
              <p className="text-xs text-gray-400">
                {list.length}/{MAX_COMPARE} products selected
              </p>
            </div>
          </div>

          <div ref={wrapRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: MAX_COMPARE }).map((_, slot) => {
              const product = list[slot];
              const showDropdown = activeSlot === slot;

              return (
                <div
                  key={slot}
                  className="flex flex-col rounded-[7px] border border-gray-100 bg-white shadow-sm"
                >
                  {/* Search / replace */}
                  <div className="relative p-2 border-b border-gray-100">
                    <Search size={13} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      value={showDropdown ? query : ""}
                      onFocus={() => focusSlot(slot)}
                      onChange={(e) => handleQueryChange(e.target.value)}
                      placeholder={product ? "Replace product..." : "Search to add..."}
                      className="w-full h-9 pl-7 pr-2 rounded-[6px] border border-gray-200 text-[12px] outline-none focus:border-[#186737] transition-all placeholder:text-gray-400"
                    />

                    {showDropdown && (
                      <div className="absolute left-2 right-2 top-[calc(100%-2px)] z-30 bg-white border border-gray-100 rounded-[7px] shadow-xl max-h-64 overflow-y-auto">
                        {loading ? (
                          <div className="p-3 text-[11px] text-gray-400 text-center">Searching...</div>
                        ) : results.length === 0 ? (
                          <div className="p-3 text-[11px] text-gray-400 text-center">
                            {query.trim() ? "No products found" : "Type to search"}
                          </div>
                        ) : (
                          results.map((r) => {
                            const isFetching = fetchingId === r.id;
                            return (
                              <button
                                key={r.id}
                                onClick={() => handlePick(slot, r)}
                                disabled={fetchingId !== null}
                                className="w-full flex items-center gap-2 p-2 hover:bg-[#f8fdf9] text-left transition-colors disabled:cursor-wait disabled:opacity-60"
                              >
                                <div className="w-8 h-8 shrink-0 rounded-[5px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                                  {isFetching ? (
                                    <Loader2 size={13} className="animate-spin text-[#186737]" />
                                  ) : (
                                    r.images?.en?.[0] && (
                                      <img src={r.images.en[0]} alt="" className="w-full h-full object-contain" />
                                    )
                                  )}
                                </div>
                                <span className="text-[11px] text-gray-700 line-clamp-2">{r.name?.en}</span>
                              </button>
                            );
                          })
                        )}
                        {fetchError && (
                          <div className="p-2 text-[11px] text-red-500 text-center border-t border-gray-100">
                            Couldn&apos;t load product details. Try again.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card */}
                  {product ? (
                    <div className="relative p-4 flex flex-col items-center text-center">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        aria-label="Remove from compare"
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 flex items-center justify-center transition-colors z-10"
                      >
                        <X size={12} />
                      </button>
                      <div className="w-50 h-56 rounded-[7px] overflow-hidden flex items-center justify-center mb-3">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                        ) : (
                          <Package size={32} className="text-gray-300" />
                        )}
                      </div>
                      <Link
                        href={product.url}
                        className="text-[13px] font-semibold text-gray-900 line-clamp-2 hover:text-[#186737] transition-colors"
                      >
                        {product.name}
                      </Link>
                      {/* {product.rating ? (
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span className="text-[11px] text-gray-500">{product.rating.toFixed(1)}</span>
                        </div>
                      ) : null} */}
                      <p
                        className={`text-base font-bold mt-1.5 ${
                          product.salePrice ? "text-[#186737]" : "text-gray-900"
                        }`}
                      >
                        {product.currency ?? "$"}
                        {fmt(product.salePrice ?? product.price)}
                      </p>
                      {product.salePrice ? (
                        <p className="text-[11px] text-gray-400 line-through">
                          {product.currency}
                          {fmt(product.price)}
                        </p>
                      ) : null}

                      <AddToCartWidget
                        product={{
                          id: product.id,
                          name: product.name,
                          url: product.url,
                          sku: product.sku ?? "",
                          price: product.price,
                          sale_price: product.salePrice ?? 0,
                          avg_rating: product.rating ?? null,
                          total_reviews: product.totalReviews ?? 0,
                          currency: { symbol: product.currency ?? "AED" },
                          images: product.image ? [product.image] : [],
                          min_quantity: product.minQuantity ?? 1,
                          is_fixed: product.isFixed ?? false,
                          quote_available: product.quoteAvailable ?? false,
                          suppliers: product.vendorId ? [{ vendor_id: product.vendorId }] : [],
                        } as unknown as RawApiProduct}
                        wrapperClassName="flex gap-2 items-center w-full mt-3"
                        isSearchbar={true}
                        inDropdown={true}
                      />

                      {specRows.length > 0 && (
                        <div className="w-full mt-4 pt-4 border-t border-gray-100 text-left">
                          <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-gray-800">
                            Specifications
                          </p>
                          {specRows.map((rowName) => {
                            const spec = product.specs?.find((s) => s.name === rowName);
                            return (
                              <div
                                key={rowName}
                                className="flex items-start justify-between gap-2 border-b border-gray-100 py-2 text-[11px] last:border-b-0 lg:text-[12px]"
                              >
                                <span className="text-gray-400 shrink-0">{rowName}</span>
                                <span className="text-gray-700 font-medium text-right">{spec?.value ?? "—"}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => focusSlot(slot)}
                      className="flex-1 flex flex-col items-center justify-center gap-1.5 py-16 text-gray-300 hover:text-[#186737] transition-colors"
                    >
                      <Plus size={22} />
                      <span className="text-[11px] font-medium">Add product</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {list.length === 0 && (
            <div className="mt-8 rounded-[7px] border border-gray-100 bg-white py-16 text-center">
              <Package size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-400">No products added to compare yet</p>
              <p className="text-xs text-gray-300 mt-1">
                Use the Compare button on any product page, or search above to add one here.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block text-sm font-semibold text-[#186737] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
