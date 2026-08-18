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
/** Amazon / WebstaurantStore: compact list, not a mega-menu */
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

function brandHref(brand: SearchSuggestions["data"]["brands"][number]) {
  if (brand.url?.startsWith("/")) return brand.url;
  if (brand.slug) return `/brands/${brand.slug}`;
  return "/brands";
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
  const rootRef = useRef<HTMLDivElement>(null);
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchFocused(false);
        inputRef.current?.blur();
      }
    };
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
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
  const showPanel =
    searchFocused && (Boolean(searchQuery.trim()) || hasResults);
  const showSkeleton = loading && !hasResults && Boolean(searchQuery.trim());

  const fetchSearch = useCallback(async (query: string) => {
    const term = query.trim();
    if (!term) {
      abortRef.current?.abort();
      abortRef.current = null;
      setLoading(false);
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
    <div ref={rootRef} className="flex-1 hidden md:block relative min-w-0">
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
          onFocus={() => {
            if (searchQuery.trim() || hasResults) setSearchFocused(true);
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

      {showPanel && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-[calc(100%+6px)] left-0 right-0 z-[80] bg-white rounded-lg shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden flex flex-col max-h-[min(70vh,540px)]"
          role="listbox"
          aria-label="Search suggestions"
        >
          {loading && (
            <div className="h-0.5 bg-gray-100 overflow-hidden">
              <div className="h-full bg-[#186737] animate-pulse w-1/2" />
            </div>
          )}

          <div className="overflow-y-auto overscroll-contain">
            {showSkeleton ? (
              <ul className="py-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-3 px-3 py-2">
                    <div className="w-11 h-11 rounded-md bg-gray-100 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-5/6" />
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-1/3" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                {categories.length > 0 && (
                  <section className="border-b border-gray-100">
                    <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Categories
                    </p>
                    <ul>
                      {categories.slice(0, 4).map((c) => (
                        <li key={c.id}>
                          <Link
                            href={categoryHref(c.super_parent_url, c.url)}
                            onClick={closeDropdown}
                            className="flex items-center gap-2 px-3 py-2 text-[13px] text-gray-800 hover:bg-[#f6faf7]"
                          >
                            <Search
                              size={13}
                              className="text-gray-400 shrink-0"
                            />
                            <span className="min-w-0">
                              <span className="text-gray-500">in </span>
                              <span className="font-medium line-clamp-1">
                                {c.name.en}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {brands.length > 0 && (
                  <section className="border-b border-gray-100">
                    <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Brands
                    </p>
                    <ul>
                      {brands.slice(0, 4).map((b) => (
                        <li key={b.id}>
                          <Link
                            href={brandHref(b)}
                            onClick={closeDropdown}
                            className="flex items-center gap-2 px-3 py-2 text-[13px] text-gray-800 hover:bg-[#f6faf7]"
                          >
                            <span className="line-clamp-1">{b.name.en}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {products.length > 0 && (
                  <section>
                    <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Products
                    </p>
                    <ul>
                      {products.slice(0, SUGGEST_LENGTH).map((p) => (
                        <li key={p.id}>
                          <Link
                            href={productHref(p)}
                            onClick={closeDropdown}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-[#f6faf7]"
                          >
                            <span className="w-11 h-11 rounded-md bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                              {p.images.en?.[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={p.images.en[0]}
                                  alt=""
                                  width={44}
                                  height={44}
                                  className="max-h-full max-w-full object-contain"
                                />
                              ) : null}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[13px] text-gray-900 leading-snug line-clamp-2">
                                {p.name.en}
                              </span>
                            </span>
                            <span className="shrink-0 text-[13px] font-semibold text-gray-900">
                              {p.quote_available
                                ? "Quote"
                                : formatPrice(p)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {searchQuery.trim() &&
                  !loading &&
                  !hasResults && (
                    <p className="px-3 py-6 text-sm text-gray-500 text-center">
                      No matches for “{searchQuery.trim()}”
                    </p>
                  )}
              </>
            )}
          </div>

          {searchQuery.trim() &&
            (totalRecords > 0 || products.length > 0) && (
              <Link
                href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                onClick={closeDropdown}
                className="shrink-0 flex items-center justify-center gap-1 w-full py-2.5 text-[13px] font-semibold text-[#186737] bg-[#f4f8f5] border-t border-gray-100 hover:bg-[#eaf3ed]"
              >
                See all{" "}
                {(totalRecords || products.length).toLocaleString("en-US")}{" "}
                results for “{searchQuery.trim()}”
              </Link>
            )}
        </div>
      )}
    </div>
  );
}
