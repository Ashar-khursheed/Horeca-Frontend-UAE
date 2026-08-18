"use client";

import type { SearchProduct, SearchSuggestions } from "@/utils/types";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const productHref = (p: SearchProduct) =>
  p.url?.startsWith("/")
    ? p.url
    : `/${p.parent_category_url_resolved}/${p.url}`;

const DEBOUNCE_MS = 180;
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
  const panelRef = useRef<HTMLDivElement>(null);
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
  const showTypedSkeleton = loading && !hasResults && !!searchQuery.trim();
  const showInitialSkeleton = loading && !hasResults && !searchQuery.trim();

  /** Keep the Kitchenall panel on-screen without covering the logo. */
  useLayoutEffect(() => {
    if (!showPanel) return;
    const panel = panelRef.current;
    const root = rootRef.current;
    if (!panel || !root) return;

    const place = () => {
      const rootBox = root.getBoundingClientRect();
      const margin = 16;
      if (window.innerWidth < 1024) {
        panel.style.width = "100%";
        panel.style.left = "0px";
        panel.style.right = "0px";
        return;
      }
      const maxWidth = Math.min(1100, window.innerWidth - margin * 2);
      panel.style.right = "auto";
      panel.style.width = `${maxWidth}px`;
      let left = 0;
      const overflowRight =
        rootBox.left + maxWidth - (window.innerWidth - margin);
      if (overflowRight > 0) left -= overflowRight;
      if (rootBox.left + left < margin) left = margin - rootBox.left;
      panel.style.left = `${left}px`;
    };

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [showPanel]);

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
      const url = `/api/search?query=${encodeURIComponent(term)}&page=1&length=${SUGGEST_LENGTH}`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error("search failed");
      const adapted: SearchSuggestions = await res.json();
      if (requestId !== requestIdRef.current) return;
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
        className={`flex items-center border rounded-full px-4 h-11 gap-2 transition-all duration-200 bg-white ${searchFocused ? "border-[#186737]" : "border-gray-200"
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
          ref={panelRef}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-[calc(100%+8px)] left-0 z-[80] bg-white rounded-[7px] shadow-[0_12px_48px_rgba(0,0,0,0.13)] border border-gray-100 overflow-hidden flex flex-col max-h-[min(480px,58vh)]"
          role="listbox"
          aria-label="Search suggestions"
        >
          {loading && (
            <div className="h-0.5 bg-gray-100 overflow-hidden">
              <div className="h-full bg-[#186737] animate-pulse w-1/2" />
            </div>
          )}

          <div className="flex min-h-0 flex-1 overflow-hidden">
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
                        className="h-9 bg-gray-100 animate-pulse rounded-lg"
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
                      return (
                        <li key={c.id}>
                          <Link
                            href={href}
                            onClick={closeDropdown}
                            className="flex items-center gap-2 px-1.5 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                          >
                            <span className="w-8 h-8 rounded-md bg-white border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                              {c.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={c.image}
                                  alt=""
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Search size={12} className="text-gray-300" />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[12.5px] text-gray-800 line-clamp-1 font-medium">
                                {c.name.en}
                              </span>
                              {pathLabel ? (
                                <span className="block text-[10.5px] text-gray-400 line-clamp-1 capitalize">
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

              <div className="mx-3 border-t border-gray-200" />

              <div className="px-3 py-2.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-1.5 px-1">
                  Brands
                </p>
                {showTypedSkeleton || showInitialSkeleton ? (
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-7 w-20 bg-gray-100 animate-pulse rounded-full"
                      />
                    ))}
                  </div>
                ) : brands.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {brands.slice(0, 5).map((b) => (
                      <Link
                        key={b.id}
                        href={`/brands/${b.slug}`}
                        onClick={closeDropdown}
                        className="text-[12px] text-gray-600 bg-white border border-gray-200 rounded-full px-2.5 py-1 hover:border-[#186737] hover:text-[#186737] transition-all"
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

            <div className="search-right-col flex flex-col min-w-0 min-h-0 flex-1">
              <div className="px-3.5 pt-3 pb-2 overflow-y-auto flex-1 min-h-0">
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

              {searchQuery.trim() &&
              (totalRecords > 0 || products.length > 0) ? (
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
