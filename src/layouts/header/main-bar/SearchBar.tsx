"use client";

import type { SearchProduct, SearchSuggestions } from "@/utils/types";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const productHref = (p: SearchProduct) =>
  p.url?.startsWith("/")
    ? p.url
    : `/${p.parent_category_url_resolved}/${p.url}`;

const DEBOUNCE_MS = 180;
/** Kitchenall: 4 across × 2 rows, kept shallow via compact cards */
const SUGGEST_LENGTH = 8;

function formatPrice(p: SearchProduct): string {
  const sale = Number(p.sale_price);
  const base = Number(p.price);
  const amount =
    Number.isFinite(sale) && sale > 0 && sale < base
      ? sale
      : Number.isFinite(base)
        ? base
        : 0;
  const symbol = p.currency?.symbol?.trim() || "$";
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function categoryHref(superParent: string, url: string) {
  if (!superParent || !url) return "#";
  return `/${superParent}/${url}`;
}

function brandHref(brand: SearchSuggestions["data"]["brands"][number]) {
  if (brand.url?.startsWith("/")) return brand.url;
  if (brand.slug) return `/brands/${brand.slug}`;
  return "/brands";
}

function categoryThumb(
  category: SearchSuggestions["data"]["categories"][number],
  products: SearchProduct[],
) {
  if (category.image) return category.image;
  const match = products.find((product) => {
    const path =
      product.category_url_resolved ||
      product.parent_category_url_resolved ||
      "";
    return (
      path === category.url ||
      path.endsWith(`/${category.url}`) ||
      path.includes(category.url)
    );
  });
  return match?.images?.en?.[0] || null;
}

export default function SearchBar() {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveData, setLiveData] = useState<SearchSuggestions["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const close = () => {
      setSearchFocused(false);
      inputRef.current?.blur();
    };
    document.addEventListener("nav-hover", close);
    return () => document.removeEventListener("nav-hover", close);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const products = liveData?.products ?? [];
  const categories = liveData?.categories ?? [];
  const brands = liveData?.brands ?? [];
  const totalRecords = liveData?.total_records ?? 0;
  const hasResults =
    products.length > 0 || categories.length > 0 || brands.length > 0;
  const showInitialSkeleton = loading && !hasResults && !searchQuery.trim();
  const showTypedSkeleton = loading && !hasResults && !!searchQuery.trim();

  const fetchSearch = useCallback(async (query: string) => {
    const term = query.trim();
    if (!term) {
      abortRef.current?.abort();
      abortRef.current = null;
      setLoading(false);
      // Keep last results until the user clears or types again — avoid blank flash.
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;

    setLoading(true);
    try {
      const url = `/api/search?query=${encodeURIComponent(term)}&page=1&length=${SUGGEST_LENGTH}`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error("search failed");
      const adapted: SearchSuggestions = await res.json();
      if (requestId !== requestIdRef.current) return;
      setLiveData(adapted.data ?? null);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      // Keep previous results on failure — no blank wipe.
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) setSearchFocused(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      abortRef.current?.abort();
      setLiveData(null);
      setLoading(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSearch(val), DEBOUNCE_MS);
  };

  const clearQuery = () => {
    setSearchQuery("");
    setLiveData(null);
    setLoading(false);
    abortRef.current?.abort();
    inputRef.current?.focus();
  };

  const goToSearch = (q?: string) => {
    const term = (q ?? searchQuery).trim();
    setSearchFocused(false);
    if (term) {
      router.push(`/search?q=${encodeURIComponent(term)}`);
    } else {
      router.push("/search");
    }
  };

  const closeDropdown = () => setSearchFocused(false);

  return (
    <div className="flex-1 hidden lg:block relative">
      <div
        className={`flex items-center border rounded-full px-4 h-11 gap-2 transition-all duration-200 bg-white ${
          searchFocused ? "border-[#186737]" : "border-gray-200"
        }`}
      >
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          aria-label="Search products"
          value={searchQuery}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && goToSearch()}
          placeholder="Search 100,000+ products trusted by hotels & restaurants..."
          className="flex-1 bg-white text-sm text-gray-700 outline-none placeholder:text-gray-400 min-w-0"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => {
            // Delay so link mousedown/click inside the dropdown can run first.
            window.setTimeout(() => {
              if (document.activeElement !== inputRef.current) {
                setSearchFocused(false);
              }
            }, 120);
          }}
          autoComplete="off"
        />
        {searchQuery &&
          (loading ? (
            <span className="shrink-0 w-4 h-4 border-2 border-gray-300 border-t-[#186737] rounded-full animate-spin" />
          ) : (
            <button
              type="button"
              onClick={clearQuery}
              aria-label="Clear search query"
              className="shrink-0 text-black hover:text-gray-600 transition-colors"
            >
              <X size={15} />
            </button>
          ))}
        <button
          type="button"
          onClick={() => goToSearch()}
          aria-label="Submit search"
          className="bg-[#186737] text-white rounded-full w-7 h-7 flex items-center justify-center shrink-0 hover:bg-[#145c2e] transition-colors disabled:opacity-50"
          disabled={!searchQuery.trim()}
        >
          <Search size={13} />
        </button>
      </div>

      {searchFocused && (searchQuery.trim() || hasResults) && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-[calc(100%+8px)] right-0 w-[min(1180px,calc(100vw-1rem))] bg-white rounded-[7px] shadow-[0_12px_48px_rgba(0,0,0,0.13)] border border-gray-100 z-50 overflow-hidden flex flex-col"
          role="listbox"
          aria-label="Search suggestions"
        >
          {loading && (
            <div className="h-0.5 bg-gray-100 overflow-hidden">
              <div className="h-full bg-[#186737] animate-pulse w-1/2" />
            </div>
          )}

          <div className="flex">
            {/* Left — categories & brands (native links) */}
            <div className="search-left-col bg-[#f8fafc] flex flex-col min-w-0 overflow-y-auto">
              <div className="px-3 pt-3 pb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-1.5 px-1">
                  Categories
                </p>
                {showTypedSkeleton || showInitialSkeleton ? (
                  <ul className="space-y-1">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <li
                        key={i}
                        className="h-12 bg-gray-100 animate-pulse rounded-lg"
                      />
                    ))}
                  </ul>
                ) : categories.length > 0 ? (
                  <ul className="space-y-0.5">
                    {categories.slice(0, 4).map((c) => {
                      const href = categoryHref(c.super_parent_url, c.url);
                      const pathLabel = [c.super_parent_url, c.url]
                        .filter(Boolean)
                        .join(" / ")
                        .replace(/-/g, " ");
                      const thumb = categoryThumb(c, products);
                      return (
                        <li key={c.id}>
                          <Link
                            href={href}
                            onClick={closeDropdown}
                            className="flex items-center gap-2.5 px-1 py-1.5 rounded-md hover:bg-white hover:underline transition-colors"
                          >
                            <span className="w-11 h-11 rounded-md bg-[#f3f4f6] overflow-hidden shrink-0">
                              {thumb ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={thumb}
                                  alt=""
                                  width={44}
                                  height={44}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="w-full h-full flex items-center justify-center">
                                  <Search size={14} className="text-gray-300" />
                                </span>
                              )}
                            </span>
                            <span className="min-w-0 text-[13px] text-gray-900 leading-[1.35] line-clamp-2 capitalize">
                              {pathLabel || c.name.en}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : searchQuery.trim() && !loading ? (
                  <p className="text-[12px] text-gray-400 px-2 py-1">
                    No categories
                  </p>
                ) : null}
              </div>

              <div className="mx-3 border-t border-gray-200" />

              <div className="px-3 py-2.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-1.5 px-1">
                  Brands
                </p>
                {showTypedSkeleton || showInitialSkeleton ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-gray-100 animate-pulse rounded-md"
                      />
                    ))}
                  </div>
                ) : brands.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {brands.slice(0, 4).map((b) => (
                      <Link
                        key={b.id}
                        href={brandHref(b)}
                        onClick={closeDropdown}
                        title={b.name.en}
                        className="h-12 px-2 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-[#186737] hover:shadow-sm transition-all"
                      >
                        {b.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={b.image}
                            alt={b.name.en}
                            className="max-h-8 max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-[11px] font-medium text-gray-600 text-center line-clamp-2">
                            {b.name.en}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim() && !loading ? (
                  <p className="text-[12px] text-gray-400 px-1">No brands</p>
                ) : null}
              </div>
            </div>

            {/* Right — wide shallow product row (Kitchenall proportions) */}
            <div className="search-right-col flex flex-col min-w-0 flex-1">
              <div className="px-3.5 pt-3 pb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">
                  Products
                </p>
                {showTypedSkeleton || showInitialSkeleton ? (
                  <div className="search-product-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-100 p-2 space-y-2"
                      >
                        <div className="search-product-image h-[100px] lg:h-[110px] xl:h-[118px] bg-gray-100 animate-pulse rounded-md" />
                        <div className="h-3 bg-gray-100 animate-pulse rounded w-full" />
                        <div className="h-3 bg-gray-100 animate-pulse rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="search-product-grid">
                    {products.slice(0, SUGGEST_LENGTH).map((p) => (
                      <Link
                        key={p.id}
                        href={productHref(p)}
                        onClick={closeDropdown}
                        className="group block rounded-lg border border-gray-100 bg-[#fafbfc] p-2 hover:border-[#186737]/35 hover:bg-[#f8fdf9] transition-all"
                      >
                        <div className="search-product-image h-[100px] lg:h-[110px] xl:h-[118px] rounded-md bg-white border border-gray-100 overflow-hidden mb-2 flex items-center justify-center">
                          {p.images.en?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.images.en[0]}
                              alt={p.name.en}
                              width={180}
                              height={118}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : null}
                        </div>
                        <p className="text-[12.5px] text-gray-900 leading-[1.35] line-clamp-2 min-h-[2.7em] group-hover:text-black">
                          {p.name.en}
                        </p>
                        <p className="mt-1.5 text-[15px] font-extrabold text-slate-900 tracking-tight">
                          {p.quote_available ? "Request quote" : formatPrice(p)}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim() && !loading ? (
                  <p className="text-[13px] text-gray-400 py-4 text-center">
                    No products found
                  </p>
                ) : null}
              </div>

              {searchQuery.trim() && (totalRecords > 0 || products.length > 0) ? (
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={closeDropdown}
                  className="shrink-0 flex items-center justify-center gap-1.5 w-full py-2.5 text-[13px] font-bold text-[#186737] bg-[#f0f7f3] border-t border-gray-100 hover:bg-[#e7f3eb] transition-colors"
                >
                  See all{" "}
                  {(totalRecords || products.length).toLocaleString("en-US")}{" "}
                  results for &ldquo;{searchQuery.trim()}&rdquo;
                  <span aria-hidden>→</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
