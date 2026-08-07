"use client";

import FilterSidebar from "@/components/filters";
import { ProductCardSkeleton } from "@/components/loading-sketlon";
import Pagination from "@/components/pagination";
import ProductCard, { ApiProduct } from "@/components/product-card";
import type { SearchProduct, SearchSuggestions } from "@/utils/types";
import Link from "next/link";
import {
  ArrowLeft,
  Grid2x2,
  Rows3,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

const TRENDING = [
  "Commercial Refrigerator",
  "Gas Range",
  "Deep Fryer",
  "Ice Machine",
  "Prep Table",
  "Dishwasher",
  "Mixer",
  "Oven",
  "Grill",
  "Freezer",
];

const SORT_OPTIONS = ["Default Sorting", "Price: Low to High", "Price: High to Low"];

function getSortLabel(sortBy: string | null, sortDir: string | null): string {
  if (sortBy === "price" && sortDir === "asc") return "Price: Low to High";
  if (sortBy === "price" && sortDir === "desc") return "Price: High to Low";
  return "Default Sorting";
}

function getSortParams(label: string): { sort_by?: string; sort_dir?: string } {
  if (label === "Price: Low to High") return { sort_by: "price", sort_dir: "asc" };
  if (label === "Price: High to Low") return { sort_by: "price", sort_dir: "desc" };
  return {};
}
const SHOW_OPTIONS = [20, 50, 100];

function mapProduct(p: SearchProduct): ApiProduct {
  const s0 = p.suppliers?.[0];
  return {
    id: p.id,
    name: p.name.en,
    url: p.url,
    sku: p.sku,
    category_url: p.category_url_resolved,
    parent_category_url: p.parent_category_url_resolved,
    price: s0?.price ?? p.price,
    sale_price: s0?.sale_price ?? p.sale_price,
    original_price: s0?.price ?? p.price,
    front_sale_price: s0?.sale_price ?? p.sale_price,
    best_price: s0?.sale_price || s0?.price || p.sale_price || p.price,
    avg_rating: p.avg_rating ?? null,
    total_reviews: p.total_reviews ?? 0,
    delivery_days: s0?.delivery_days ?? "",
    currency: p.currency?.symbol ?? "$",
    images: p.images?.en ?? [],
    alt_tags: p.alt_tags ?? [],
    in_wishlist: p.in_wishlist ?? false,
    min_quantity: s0?.min_quantity ?? 1,
    is_fixed: s0?.is_fixed ? 1 : 0,
    quote_available: p.quote_available == null ? null : p.quote_available ? 1 : 0,
    for_quotes: p.quote_available ? 1 : 0,
    selling_type: {
      attribute_value: typeof p.selling_type?.attribute_value === "object"
        ? (p.selling_type.attribute_value?.en ?? "")
        : (p.selling_type?.attribute_value ?? ""),
      attribute_value_unit: typeof p.selling_type?.attribute_value_unit === "object"
        ? (p.selling_type.attribute_value_unit?.en ?? "")
        : (p.selling_type?.attribute_value_unit ?? ""),
    },
    free_shipping: s0?.free_shipping ? 1 : 0,
    return_policy: s0?.return_policy ?? "",
    isRequired: p.isRequired ?? false,
    suppliers: p.suppliers ?? [],
    accessories: (p.accessories ?? []).map((acc) => ({
      ...acc,
      accessory_item: acc.accessory_item.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    })),
  };
}

interface SearchFeatureProps {
  initialData?: SearchSuggestions | null;
  initialQuery?: string;
  initialPage?: number;
}

export default function SearchFeature({
  initialData,
  initialQuery = "",
  initialPage = 1,
}: SearchFeatureProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
console.log("SearchFeature initialData:", initialData);
  const query = searchParams.get("q") ?? initialQuery;
  const submitted = !!query;

  const [inputValue, setInputValue] = useState(query);
  const [sort, setSort] = useState(getSortLabel(searchParams.get("sort_by"), searchParams.get("sort_dir")));
  const [perPage, setPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setInputValue(query); }, [query]);
  useEffect(() => { if (!query) mobileInputRef.current?.focus(); }, [query]);

  // ── Filter data from API ────────────────────────────────────────────────────
  const d = initialData?.data;
  const allProducts = (d?.products ?? []).map(mapProduct);
  const totalPages = d?.total_pages ?? 1;
  const totalRecords = d?.total_records ?? allProducts.length;
  const didYouMean = d?.did_you_mean;
  const correctedQuery = d?.corrected_query;

  const apiFilters = d?.filters;
  const apiPriceMin = Math.floor(Number(apiFilters?.priceRange?.min_price ?? 0));
  const apiPriceMax = Math.ceil(Number(apiFilters?.priceRange?.max_price ?? 999999));
  const currencySymbol = apiFilters?.priceRange?.currency?.symbol;

  // Map API filter brands to FilterSidebar format
  const filterBrands = (apiFilters?.brands ?? []).map((b) => ({
    id: b.id,
    name: b.name.en,
    thumbnail: b.thumbnail,
  }));

  // Map API filter categories to FilterSidebar format
  const filterCategories = (d?.categories ?? []).map((c: any) => ({
    id: c.id,
    name: typeof c.name === "string" ? c.name : (c.name?.en ?? ""),
    url: c.url ?? "",
  }));

  // ── Read initial filter state from URL ──────────────────────────────────────
  const initBrands = (searchParams.get("brands")?.split(",").filter(Boolean) ?? []).map((entry) => {
    const ci = entry.indexOf(":");
    return { id: Number(entry.slice(0, ci)), name: entry.slice(ci + 1) };
  });
  const initCategories = (searchParams.get("cats")?.split(",").filter(Boolean) ?? []).map((entry) => {
    const ci = entry.indexOf(":");
    return { id: Number(entry.slice(0, ci)), name: entry.slice(ci + 1) };
  });
  const initMin = searchParams.get("min") ? Number(searchParams.get("min")) : apiPriceMin;
  const initMax = searchParams.get("max") ? Number(searchParams.get("max")) : apiPriceMax;

  const [priceRange, setPriceRange] = useState({ min: initMin, max: initMax });
  const [selectedBrands, setSelectedBrands] = useState<{ id: number; name: string }[]>(initBrands);
  const [selectedCategories, setSelectedCategories] = useState<{ id: number; name: string }[]>(initCategories);

  // Re-sync filter state with the URL whenever it changes (new search, pagination,
  // back/forward nav) — without this, filters from a previous query/result set stick
  // around since useState above only seeds the initial value on mount.
  const searchParamsKey = searchParams.toString();
  useEffect(() => {
    setPriceRange({ min: initMin, max: initMax });
    setSelectedBrands(initBrands);
    setSelectedCategories(initCategories);
    setSort(getSortLabel(searchParams.get("sort_by"), searchParams.get("sort_dir")));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsKey, apiPriceMin, apiPriceMax]);

  // ── URL push (SSR re-fetch) ─────────────────────────────────────────────────
  const pushURL = useCallback((overrides: {
    brands?: { id: number; name: string }[];
    cats?: { id: number; name: string }[];
    min?: number;
    max?: number;
    page?: number;
    q?: string;
    sort?: string;
  }) => {
    const brands    = overrides.brands ?? selectedBrands;
    const cats      = overrides.cats   ?? selectedCategories;
    const min       = overrides.min    ?? priceRange.min;
    const max       = overrides.max    ?? priceRange.max;
    const q2        = overrides.q      ?? query;
    const pg        = overrides.page   ?? 1;
    const sortLabel = overrides.sort   ?? sort;

    const parts: string[] = [`q=${encodeURIComponent(q2)}`];
    if (brands.length)
      parts.push("brands=" + brands.map((b) => `${b.id}:${b.name.replace(/ /g, "+")}`).join(","));
    if (cats.length)
      parts.push("cats=" + cats.map((c) => `${c.id}:${c.name.replace(/ /g, "+")}`).join(","));
    const priceActive = min !== apiPriceMin || max !== apiPriceMax;
    if (priceActive) { parts.push(`min=${min}`); parts.push(`max=${max}`); }
    if (pg > 1) parts.push(`page=${pg}`);
    const sortParams = getSortParams(sortLabel);
    if (sortParams.sort_by) { parts.push(`sort_by=${sortParams.sort_by}`); parts.push(`sort_dir=${sortParams.sort_dir}`); }

    window.scrollTo({ top: 0, behavior: "smooth" });
    startTransition(() => {
      router.replace(`/search?${parts.join("&")}`, { scroll: false });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrands, selectedCategories, priceRange, query, sort, apiPriceMin, apiPriceMax]);


  // ── Handlers ────────────────────────────────────────────────────────────────
  const goToSearch = (q: string, page = 1) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    startTransition(() => {
      router.replace(
        `/search?q=${encodeURIComponent(trimmed)}${page > 1 ? `&page=${page}` : ""}`,
        { scroll: false },
      );
    });
  };

  const clearSearch = () => {
    setInputValue("");
    router.replace("/search", { scroll: false });
    setTimeout(() => mobileInputRef.current?.focus(), 0);
  };

  const handleBrandToggle = useCallback((brand: { id: number; name: string }) => {
    const next = selectedBrands.some((b) => b.id === brand.id)
      ? selectedBrands.filter((b) => b.id !== brand.id)
      : [...selectedBrands, brand];
    setSelectedBrands(next);
    setPriceRange({ min: apiPriceMin, max: apiPriceMax });
    pushURL({ brands: next, min: apiPriceMin, max: apiPriceMax, page: 1 });
  }, [selectedBrands, pushURL, apiPriceMin, apiPriceMax]);

  const handleCategoryToggle = useCallback((cat: { id: number; name: string }) => {
    const next = selectedCategories.some((c) => c.id === cat.id)
      ? selectedCategories.filter((c) => c.id !== cat.id)
      : [...selectedCategories, cat];
    setSelectedCategories(next);
    setPriceRange({ min: apiPriceMin, max: apiPriceMax });
    pushURL({ cats: next, min: apiPriceMin, max: apiPriceMax, page: 1 });
  }, [selectedCategories, pushURL, apiPriceMin, apiPriceMax]);

  const handlePriceChange = useCallback((range: { min: number; max: number }) => {
    setPriceRange(range);
    pushURL({ min: range.min, max: range.max, page: 1 });
  }, [pushURL]);

  const handleClearAll = useCallback(() => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange({ min: apiPriceMin, max: apiPriceMax });
    pushURL({ brands: [], cats: [], min: apiPriceMin, max: apiPriceMax, page: 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPriceMin, apiPriceMax, pushURL]);

  const totalActiveFilters =
    selectedBrands.length +
    selectedCategories.length +
    (priceRange.min !== apiPriceMin || priceRange.max !== apiPriceMax ? 1 : 0);

  // ── JSX ─────────────────────────────────────────────────────────────────────
  const filterSidebarProps = {
    priceRange,
    onPriceChange: handlePriceChange,
    selectedBrands,
    onBrandToggle: handleBrandToggle,
    onClearBrands: () => { setSelectedBrands([]); setPriceRange({ min: apiPriceMin, max: apiPriceMax }); pushURL({ brands: [], min: apiPriceMin, max: apiPriceMax, page: 1 }); },
    onClearAll: handleClearAll,
    brands: filterBrands,
    categories: filterCategories,
    selectedCategories,
    onCategoryToggle: handleCategoryToggle,
    onClearCategories: () => { setSelectedCategories([]); setPriceRange({ min: apiPriceMin, max: apiPriceMax }); pushURL({ cats: [], min: apiPriceMin, max: apiPriceMax, page: 1 }); },
    priceMin: apiPriceMin,
    priceMax: apiPriceMax,
    selectedRangeFilters: {} as Record<number, { min: number; max: number }[]>,
    onRangeFilterToggle: () => {},
    onClearRangeFilter: () => {},
    selectedFixedFilters: {} as Record<number, string[]>,
    onFixedFilterToggle: () => {},
    onClearFixedFilter: () => {},
    currency: currencySymbol,
  };

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="lg:hidden min-h-screen bg-white">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
          <button
            onClick={submitted ? clearSearch : () => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex-1 relative">
            <input
              ref={mobileInputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToSearch(inputValue)}
              placeholder="Search products…"
              className="w-full h-10 pl-4 pr-10 rounded-full border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] bg-gray-50 transition-all placeholder:text-gray-400"
            />
            {inputValue && (
              <button onClick={clearSearch} className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            )}
            <button onClick={() => goToSearch(inputValue)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#186737] transition-colors">
              <Search size={16} />
            </button>
          </div>
        </div>

        {!submitted ? (
          <div className="px-4 pt-6">
            <p className="text-base font-semibold italic text-gray-700 mb-4">Most Searched and Brought</p>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((term) => (
                <button key={term} onClick={() => { setInputValue(term); goToSearch(term); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:border-[#186737] hover:text-[#186737] hover:bg-[#f0f9f4] transition-all shadow-sm"
                >
                  <TrendingUp size={13} className="text-gray-400" /> {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-800">{allProducts.length}</span> results for{" "}
                <span className="font-semibold text-[#186737]">&ldquo;{query}&rdquo;</span>
              </p>
              <button
                onClick={() => setFilterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:border-[#186737] hover:text-[#186737] transition-all bg-white"
              >
                <SlidersHorizontal size={13} /> Filters
                {totalActiveFilters > 0 && (
                  <span className="bg-[#186737] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalActiveFilters}
                  </span>
                )}
              </button>
            </div>

            {isPending ? (
              <div className="p-3 grid grid-cols-2 gap-3">
                {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : allProducts.length > 0 ? (
              <div className="p-3 grid grid-cols-2 gap-3">
                {allProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <Search size={48} className="text-gray-200 mb-4" />
                <p className="text-[15px] font-semibold text-gray-600">No results found</p>
                <p className="text-[13px] text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}

            <div className="pb-6 px-4">
              <Pagination
                key={initialPage}
                initialPage={initialPage}
                totalPages={totalPages}
                onPageChange={(p) => pushURL({ page: p })}
                showFirstLast
                showPageInfo
              />
            </div>
          </div>
        )}

        {/* Mobile Filter Drawer */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${filterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setFilterOpen(false)}
        />
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${filterOpen ? "translate-y-0" : "translate-y-full"}`}
          style={{ maxHeight: "88vh" }}
        >
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#186737]" />
              <span className="text-[15px] font-bold text-gray-900">Filters</span>
            </div>
            <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 px-4 py-3">
            <FilterSidebar {...filterSidebarProps} mobile />
          </div>
          <div className="shrink-0 px-4 py-4 border-t border-gray-100 bg-white flex gap-3">
            {totalActiveFilters > 0 && (
              <button onClick={handleClearAll} className="flex-1 py-3 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors">
                Clear All
              </button>
            )}
            <button onClick={() => setFilterOpen(false)} className="flex-1 py-3 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold transition-colors">
              {totalActiveFilters > 0 ? `Apply Filters (${totalActiveFilters})` : "Apply Filters"}
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:block bg-gray-50 min-h-screen">
        <div className="global-container mx-auto px-4 sm:px-6 py-6">
          {!submitted ? (
            <div>
              <p className="text-base font-semibold italic text-gray-700 mb-4">Most Searched and Brought</p>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((term) => (
                  <button key={term} onClick={() => { setInputValue(term); goToSearch(term); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:border-[#186737] hover:text-[#186737] hover:bg-[#f0f9f4] transition-all shadow-sm"
                  >
                    <TrendingUp size={13} className="text-gray-400" /> {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-5 items-start">
              {/* Sidebar */}
              <div className="hidden md:block w-55 lg:w-60 shrink-0">
                <FilterSidebar {...filterSidebarProps} />
              </div>

              {/* Main */}
              <div className="flex-1 min-w-0">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 bg-white rounded-[7px] border border-gray-100 px-4 py-2.5 shadow-sm">
                  <div>
                    <p className="text-xs text-gray-500">
                      Showing{" "}
                      <span className="font-semibold text-gray-800">{allProducts.length}</span> of{" "}
                      <span className="font-semibold text-gray-800">{totalRecords}</span> results for{" "}
                      <span className="font-semibold text-[#186737]">&ldquo;{query}&rdquo;</span>
                    </p>
                    {didYouMean && correctedQuery && (
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {(() => {
                          const idx = didYouMean.indexOf(correctedQuery);
                          if (idx < 0) return didYouMean;
                          return (
                            <>
                              {didYouMean.slice(0, idx)}
                              <Link
                                href={`/search?q=${encodeURIComponent(correctedQuery)}`}
                                className="text-[#186737] underline font-semibold hover:text-[#145c2e] transition-colors"
                              >
                                {correctedQuery}
                              </Link>
                              {didYouMean.slice(idx + correctedQuery.length)}
                            </>
                          );
                        })()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <select value={sort} onChange={(e) => { setSort(e.target.value); pushURL({ sort: e.target.value, page: 1 }); }}
                      className="text-xs border border-gray-200 rounded-[7px] px-2.5 py-1.5 outline-none focus:border-[#186737] text-gray-700 bg-white"
                    >
                      {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}
                      className="text-xs border border-gray-200 rounded-[7px] px-2.5 py-1.5 outline-none focus:border-[#186737] text-gray-700 bg-white"
                    >
                      {SHOW_OPTIONS.map((o) => <option key={o} value={o}>{o} Items</option>)}
                    </select>
                    {/* <div className="flex border border-gray-200 rounded-[7px] overflow-hidden">
                      <button onClick={() => setViewMode("grid")}
                        className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-[#186737] text-white" : "text-gray-400 hover:text-gray-600"}`}
                      ><Grid2x2 size={14} /></button>
                      <button onClick={() => setViewMode("list")}
                        className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-[#186737] text-white" : "text-gray-400 hover:text-gray-600"}`}
                      ><Rows3 size={14} /></button>
                    </div> */}
                  </div>
                </div>

                {isPending ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                    {Array.from({ length: 20 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                  </div>
                ) : allProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                    {allProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[7px] border border-gray-100">
                    <Search size={52} className="text-gray-200 mb-5" />
                    <p className="text-[17px] font-semibold text-gray-700 mb-2">No Results Found</p>
                    <p className="text-[13px] text-gray-400 text-center max-w-xs">
                      We couldn&apos;t find anything for &ldquo;{query}&rdquo;. Try adjusting your filters.
                    </p>
                    <button onClick={handleClearAll} className="mt-5 px-5 py-2 rounded-[7px] bg-[#186737] text-white text-[13px] font-semibold hover:bg-[#145c30] transition-colors">
                      Clear Filters
                    </button>
                  </div>
                )}

                <div className="mt-6">
                  <Pagination
                    key={initialPage}
                    initialPage={initialPage}
                    totalPages={totalPages}
                    onPageChange={(p) => pushURL({ page: p })}
                    showFirstLast
                    showPageInfo
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
