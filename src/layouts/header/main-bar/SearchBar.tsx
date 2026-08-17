"use client";

import type { SearchProduct, SearchSuggestions } from "@/utils/types";
import {
  toSearchSuggestions,
  type NlpSearchResponse,
} from "@/utils/adapt-nlp-search";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const productHref = (p: SearchProduct) =>
  p.url?.startsWith("/")
    ? p.url
    : `/${p.parent_category_url_resolved}/${p.url}`;

const API_BASE = "https://nlpus.thehorecastore.co/";
const DEBOUNCE_MS = 180;
/** Fewer, larger cards — Kitchenall-style readability over density */
const SUGGEST_LENGTH = 6;

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
      const url = `${API_BASE}search?query=${encodeURIComponent(term)}&page=1&length=${SUGGEST_LENGTH}`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error("search failed");
      const raw: NlpSearchResponse = await res.json();
      if (requestId !== requestIdRef.current) return;
      const adapted = toSearchSuggestions(raw);
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
          className="absolute top-[calc(100%+8px)] right-0 w-[min(1200px,calc(100vw-1rem))] bg-white rounded-[7px] shadow-[0_12px_48px_rgba(0,0,0,0.13)] border border-gray-100 z-50 overflow-hidden"
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
            <div className="search-left-col bg-[#f8fafc] flex flex-col min-w-0">
              <div className="px-3.5 pt-3.5 pb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2 px-1">
                  Categories
                </p>
                {showTypedSkeleton || showInitialSkeleton ? (
                  <ul className="space-y-1.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <li
                        key={i}
                        className="h-11 bg-gray-100 animate-pulse rounded-lg"
                      />
                    ))}
                  </ul>
                ) : categories.length > 0 ? (
                  <ul className="space-y-0.5">
                    {categories.slice(0, 6).map((c) => {
                      const href = categoryHref(c.super_parent_url, c.url);
                      const pathLabel = [c.super_parent_url, c.url]
                        .filter(Boolean)
                        .join(" / ")
                        .replace(/-/g, " ");
                      return (
                        <li key={c.id}>
                          <Link
                            href={href}
                            onClick={closeDropdown}
                            className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                          >
                            <span className="w-9 h-9 rounded-md bg-white border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                              {c.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={c.image}
                                  alt=""
                                  width={36}
                                  height={36}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Search size={14} className="text-gray-300" />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13px] text-gray-800 line-clamp-1 font-medium">
                                {c.name.en}
                              </span>
                              {pathLabel ? (
                                <span className="block text-[11px] text-gray-400 line-clamp-1 capitalize">
                                  {pathLabel}
                                </span>
                              ) : null}
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

              <div className="mx-4 border-t border-gray-200" />

              <div className="px-3.5 py-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2 px-1">
                  Brands
                </p>
                {showTypedSkeleton || showInitialSkeleton ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-7 w-20 bg-gray-100 animate-pulse rounded-full"
                      />
                    ))}
                  </div>
                ) : brands.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {brands.slice(0, 6).map((b) => (
                      <Link
                        key={b.id}
                        href={`/brands/${b.slug}`}
                        onClick={closeDropdown}
                        className="text-[12px] text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-[#186737] hover:text-[#186737] transition-all"
                      >
                        {b.name.en}
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim() && !loading ? (
                  <p className="text-[12px] text-gray-400 px-1">No brands</p>
                ) : null}
              </div>
            </div>

            {/* Right — large product cards (native links, no Add to Cart) */}
            <div className="search-right-col flex flex-col min-w-0 max-h-[min(36rem,70vh)]">
              <div className="p-4 overflow-y-auto flex-1 min-h-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
                  Products
                </p>
                {showTypedSkeleton || showInitialSkeleton ? (
                  <div className="search-product-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-gray-100 p-3 space-y-3"
                      >
                        <div className="aspect-[5/4] rounded-lg bg-gray-100 animate-pulse" />
                        <div className="h-3.5 bg-gray-100 animate-pulse rounded w-full" />
                        <div className="h-3.5 bg-gray-100 animate-pulse rounded w-4/5" />
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3" />
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
                        className="group block rounded-xl border border-gray-100 p-3 hover:border-[#186737]/35 hover:bg-[#f8fdf9] transition-all"
                      >
                        <div className="aspect-[4/3] rounded-lg bg-[#f8fafc] border border-gray-100 overflow-hidden mb-3 flex items-center justify-center">
                          {p.images.en?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.images.en[0]}
                              alt={p.name.en}
                              width={320}
                              height={240}
                              className="w-full h-full object-contain p-1.5"
                            />
                          ) : null}
                        </div>
                        <p className="text-[14px] text-gray-900 leading-[1.4] line-clamp-3 min-h-[4.2em] group-hover:text-black">
                          {p.name.en}
                        </p>
                        <p className="mt-2.5 text-[17px] font-extrabold text-slate-900 tracking-tight">
                          {p.quote_available ? "Request quote" : formatPrice(p)}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim() && !loading ? (
                  <p className="text-[13px] text-gray-400 py-6 text-center">
                    No products found
                  </p>
                ) : null}
              </div>

              {searchQuery.trim() && (totalRecords > 0 || products.length > 0) ? (
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={closeDropdown}
                  className="shrink-0 flex items-center justify-center gap-1.5 w-full py-3.5 text-[14px] font-bold text-[#186737] bg-[#f8fdf9] border-t border-gray-100 hover:bg-[#eef8f1] transition-colors"
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
