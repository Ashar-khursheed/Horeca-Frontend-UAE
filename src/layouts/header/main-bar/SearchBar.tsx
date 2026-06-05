"use client";

import AddToCartWidget from "@/components/add-to-cart";
import type { RawApiProduct } from "@/components/product-card";
import type { SearchSuggestions } from "@/utils/types";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://test-us.thehorecastore.co/api/";

interface SearchBarProps {
  searchData?: SearchSuggestions | null;
}

export default function SearchBar({ searchData }: SearchBarProps) {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveData, setLiveData] = useState<SearchSuggestions["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Active data: live results if available, otherwise SSR initial data
  const d = liveData ?? searchData?.data;
  const products = d?.products ?? [];
  const categories = d?.categories ?? [];
  const brands = d?.brands ?? [];

  const fetchSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setLiveData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const url = `${API_BASE}frontend/search?query=${encodeURIComponent(query.trim())}&page=1&length=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("search failed");
      const json: SearchSuggestions = await res.json();
      setLiveData(json.data ?? null);
    } catch {
      // silently keep previous data
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSearch(val), 300);
  };

  const clearQuery = () => {
    setSearchQuery("");
    setLiveData(null);
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

  return (
    <div className="flex-1 hidden lg:block relative">
      {/* ── Input ── */}
      <div
        className={`flex items-center border rounded-full px-4 h-11 gap-2 transition-all duration-200 bg-white ${
          searchFocused ? "border-[#186737]" : "border-gray-200"
        }`}
      >
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && goToSearch()}
          placeholder="Search 100,000+ products trusted by hotels & restaurants..."
          className="flex-1 bg-white text-sm text-gray-700 outline-none placeholder:text-gray-400 min-w-0"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchQuery &&
          (loading ? (
            <span className="shrink-0 w-4 h-4 border-2 border-gray-300 border-t-[#186737] rounded-full animate-spin" />
          ) : (
            <button
              onClick={clearQuery}
              className="shrink-0 text-black hover:text-gray-600 transition-colors"
            >
              <X size={15} />
            </button>
          ))}
        <button
          onClick={() => goToSearch()}
          className="bg-[#186737] text-white rounded-full w-7 h-7 flex items-center justify-center shrink-0 hover:bg-[#145c2e] transition-colors"
        >
          <Search size={13} />
        </button>
      </div>

      {/* ── Dropdown ── */}
      {searchFocused && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-[7px] shadow-[0_12px_48px_rgba(0,0,0,0.13)] border border-gray-100 z-50 overflow-hidden"
        >
          {/* Did you mean / loading bar */}
          {loading && (
            <div className="h-0.5 bg-gray-100 overflow-hidden">
              <div className="h-full bg-[#186737] animate-pulse w-1/2" />
            </div>
          )}
          {/* {!loading && d?.did_you_mean && (
            <div className="px-4 py-2 bg-[#f0fdf4] border-b border-gray-100 text-[12px] text-[#186737]">
              {d.did_you_mean}
            </div>
          )} */}

          <div className="flex">
            {/* ── Left col ── */}
            <div className="w-full xl:w-[55%] bg-[#f8fafc] xl:border-r border-gray-100 flex flex-col">
              {/* Product Suggestions */}
              <div className="px-3.5 pt-3.5 pb-3">
                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">
                  Product Suggestions
                </p>
                {loading ? (
                  <ul className="space-y-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <li
                        key={i}
                        className="h-8 bg-gray-100 animate-pulse rounded-xl"
                      />
                    ))}
                  </ul>
                ) : products.length > 0 ? (
                  <ul className="space-y-0.5">
                    {products.slice(0, 5).map((p, i) => (
                      <li key={i}>
                        <Link
                          href={p.url}
                          // onMouseDown={() => goToSearch(p.name.en)}
                          className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                        >
                          <Search
                            size={12}
                            className="text-gray-300 shrink-0 group-hover:text-[#186737] transition-colors"
                          />
                          <span className="text-[13px] text-gray-500 line-clamp-1 group-hover:text-[#186737] transition-colors">
                            {p.name.en}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[12px] text-gray-400 px-3 py-2">
                    No suggestions
                  </p>
                )}
              </div>

              <div className="mx-5 border-t border-gray-200" />

              {/* Categories */}
              <div className="px-5 py-3">
                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">
                  Categories
                </p>
                {loading ? (
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-7 w-24 bg-gray-100 animate-pulse rounded-full"
                      />
                    ))}
                  </div>
                ) : categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 6).map((c, i) => (
                      <Link
                        key={i}
                        href={`/${c.super_parent_url}/${c.url}`}
                        onClick={() =>
                          router.push(`/${c.super_parent_url}/${c.url}`)
                        }
                        className="text-[12px] text-gray-600 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 hover:border-[#186737] hover:text-[#186737] hover:bg-[#186737]/5 transition-all"
                      >
                        {c.name.en}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-gray-400">No categories</p>
                )}
              </div>

              <div className="mx-5 border-t border-gray-200" />

              {/* Brands */}
              <div className="px-5 py-3">
                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">
                  Brands
                </p>
                {loading ? (
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-7 w-20 bg-gray-100 animate-pulse rounded-full"
                      />
                    ))}
                  </div>
                ) : brands.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {brands.slice(0, 5).map((b, i) => (
                      <Link
                        key={i}
                        href={`/brands/${b.slug}`}
                        onClick={() => router.push(`/brands/${b.slug}`)}
                        className="text-[12px] text-gray-600 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 hover:border-[#186737] hover:text-[#186737] hover:bg-[#186737]/5 transition-all"
                      >
                        {b.name.en}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-gray-400">No brands</p>
                )}
              </div>

              <div className="mx-5 border-t border-gray-200" />

              {/* View all */}
              <div className="px-3.5 py-3 mt-auto">
                <button
                  onMouseDown={() => goToSearch()}
                  className="w-full h-9 rounded-xl bg-[#186737] text-white text-[13px] font-semibold hover:bg-[#145c2e] transition-colors flex items-center justify-center gap-2"
                >
                  <Search size={13} /> View all results
                </button>
              </div>
            </div>

            {/* ── Right col — Trending Products (xl+) ── */}
            <div className="flex-1 xl:block hidden p-3.5 overflow-y-auto max-h-115">
              <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-4">
                Trending Products
              </p>
              {loading ? (
                <ul className="space-y-2.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li
                      key={i}
                      className="flex gap-3 p-3 rounded-xl border border-gray-100"
                    >
                      <div className="w-15.5 h-15.5 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 animate-pulse rounded w-full" />
                        <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                        <div className="h-7 bg-gray-100 animate-pulse rounded w-full mt-3" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2.5">
                  {products.slice(0, 4).map((p, i) => (
                    <li
                      key={i}
                      className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#186737]/25 hover:bg-[#f8fdf9] transition-all cursor-pointer group"
                    >
                      <div className="w-15.5 h-15.5 rounded-xl bg-gray-100 shrink-0 border border-gray-100 overflow-hidden">
                        {p.images.en?.[0] && (
                          <img
                            src={p.images.en[0]}
                            alt={p.name.en}
                            className="w-full h-full object-contain"
                            onClick={() => { setSearchFocused(false); router.push(p.url); }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <p
                          className="text-[12px] text-gray-600 line-clamp-2 leading-relaxed group-hover:text-gray-900 transition-colors"
                          onClick={() => { setSearchFocused(false); router.push(p.url); }}
                        >
                          {p.name.en}
                        </p>
                        <AddToCartWidget
                          product={{
                            ...p,
                            original_price: p.price,
                            parent_category_url: p.parent_category_url_resolved,
                            images: { en: p.images.en ?? [], ar: p.images.ar ?? [] },
                          } as unknown as RawApiProduct}
                          wrapperClassName="flex items-center flex-row gap-2 mt-2"
                          counterClassName="flex items-center border border-gray-200 rounded-lg h-7 overflow-hidden bg-white w-[80px] shrink-0"
                          counterButtonClassName="w-7 h-full flex items-center justify-center text-gray-400 hover:text-[#186737] hover:bg-gray-50 transition-colors"
                          buttonClassName="flex-1 h-7 rounded-lg bg-[#e8f5ee] text-[#186737] text-xs font-semibold hover:bg-[#186737] hover:text-white transition-all whitespace-nowrap"
                          iconShow={false}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
