"use client";

import FilterSidebar from "@/components/filters";
import Pagination from "@/components/pagination";
import ProductCard from "@/components/product-card";
import { FEATURED_DATA } from "@/data";
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
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PriceRange { min: number; max: number; }

// ─── Constants ────────────────────────────────────────────────────────────────
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

const SORT_OPTIONS = [
  "Default Sorting",
  "Price: Low to High",
  "Price: High to Low",
  "Top Rated",
  "Newest First",
];

const SHOW_OPTIONS = [20, 50, 100];

// ─── Search Feature ───────────────────────────────────────────────────────────
export default function SearchFeature() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(!!initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter state
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 10, max: 78000 });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string[]>>({});

  // Layout state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("Default Sorting");
  const [perPage, setPerPage] = useState(50);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (initialQuery) inputRef.current?.focus();
  }, [initialQuery]);

  const handleSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSubmitted(true);
    setPage(1);
    router.replace(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false });
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    setSubmitted(false);
    router.replace("/search", { scroll: false });
    inputRef.current?.focus();
  };

  const handleBrandToggle = (b: string) =>
    setSelectedBrands((p) => p.includes(b) ? p.filter((x) => x !== b) : [...p, b]);
  const handleAttrToggle = (g: string, v: string) =>
    setSelectedAttrs((p) => ({
      ...p,
      [g]: p[g]?.includes(v) ? p[g].filter((x) => x !== v) : [...(p[g] ?? []), v],
    }));
  const clearAll = () => { setSelectedBrands([]); setSelectedAttrs({}); };

  const totalActive =
    selectedBrands.length +
    Object.values(selectedAttrs).reduce((a, v) => a + v.length, 0);

  const products = FEATURED_DATA;

  // ── Mobile: Trending view (no query yet) ─────────────────────────────────
  const MobileTrending = () => (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products…"
            autoFocus
            className="w-full h-10 pl-4 pr-10 rounded-full border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-gray-50 transition-all placeholder:text-gray-400"
          />
          {query && (
            <button onClick={clearSearch} className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
          <button
            onClick={() => handleSearch(query)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#186737] transition-colors"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Trending chips */}
      <div className="flex-1 px-4 pt-6 overflow-y-auto">
        <p className="text-base font-semibold italic text-gray-700 mb-4">
          Most Searched and Brought
        </p>
        <div className="flex flex-wrap gap-2">
          {TRENDING.map((term) => (
            <button
              key={term}
              onClick={() => { setQuery(term); handleSearch(term); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:border-[#186737] hover:text-[#186737] hover:bg-[#f0f9f4] transition-all shadow-sm"
            >
              <TrendingUp size={13} className="text-gray-400" />
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Mobile: Results view ──────────────────────────────────────────────────
  const MobileResults = () => (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Search bar sticky */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button
          onClick={clearSearch}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products…"
            className="w-full h-10 pl-4 pr-10 rounded-full border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-gray-50 transition-all"
          />
          {query && (
            <button onClick={clearSearch} className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
          <button
            onClick={() => handleSearch(query)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#186737] transition-colors"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100">
        <p className="text-xs text-gray-500">
          Showing <span className="font-semibold text-gray-800">{products.length}</span> results for{" "}
          <span className="font-semibold text-[#186737]">"{initialQuery}"</span>
        </p>
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:border-[#186737] hover:text-[#186737] transition-all bg-white"
        >
          <SlidersHorizontal size={13} />
          Filters
          {totalActive > 0 && (
            <span className="bg-[#186737] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalActive}
            </span>
          )}
        </button>
      </div>

      {/* Product grid */}
      <div className="p-3 grid grid-cols-2 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="pb-6 px-4">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(products.length / perPage)}
          onPageChange={setPage}
        />
      </div>

      {/* Filter bottom sheet */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="relative bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#186737]" />
                <span className="text-sm font-bold text-gray-800">Filters</span>
                {totalActive > 0 && (
                  <span className="bg-[#186737] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalActive}
                  </span>
                )}
              </div>
              <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <FilterSidebar
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                selectedBrands={selectedBrands}
                onBrandToggle={handleBrandToggle}
                onClearBrands={() => setSelectedBrands([])}
                selectedAttrs={selectedAttrs}
                onAttrToggle={handleAttrToggle}
                onClearAttr={(g) => setSelectedAttrs((p) => ({ ...p, [g]: [] }))}
                onClearAll={clearAll}
                mobile
              />
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={clearAll}
                className="flex-1 py-2.5 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── Desktop: Full layout ──────────────────────────────────────────────────
  const DesktopLayout = () => (
    <div className="bg-gray-50 min-h-screen">
      {/* Search bar row */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container mx-auto px-4 sm:px-6 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products, brands, categories…"
              className="w-full h-11 pl-10 pr-28 rounded-[7px] border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
            />
            {query && (
              <button onClick={clearSearch} className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={15} />
              </button>
            )}
            <button
              onClick={() => handleSearch(query)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold rounded-[5px] transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="global-container mx-auto px-4 sm:px-6 py-6">
        {/* Trending — no query */}
        {!submitted ? (
          <div>
            <p className="text-base font-semibold italic text-gray-700 mb-4">Most Searched and Brought</p>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((term) => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); handleSearch(term); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:border-[#186737] hover:text-[#186737] hover:bg-[#f0f9f4] transition-all shadow-sm"
                >
                  <TrendingUp size={13} className="text-gray-400" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-5 items-start">
            {/* Sidebar */}
            <div className="w-[240px] shrink-0 hidden lg:block">
              <FilterSidebar
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                selectedBrands={selectedBrands}
                onBrandToggle={handleBrandToggle}
                onClearBrands={() => setSelectedBrands([])}
                selectedAttrs={selectedAttrs}
                onAttrToggle={handleAttrToggle}
                onClearAttr={(g) => setSelectedAttrs((p) => ({ ...p, [g]: [] }))}
                onClearAll={clearAll}
              />
            </div>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-[7px] border border-gray-100 px-4 py-2.5 shadow-sm">
                <p className="text-xs text-gray-500">
                  Showing <span className="font-semibold text-gray-800">{products.length}</span> results for{" "}
                  <span className="font-semibold text-[#186737]">"{initialQuery}"</span>
                </p>
                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="text-xs border border-gray-200 rounded-[7px] px-2.5 py-1.5 outline-none focus:border-[#186737] text-gray-700 bg-white"
                  >
                    {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  {/* Show */}
                  <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="text-xs border border-gray-200 rounded-[7px] px-2.5 py-1.5 outline-none focus:border-[#186737] text-gray-700 bg-white"
                  >
                    {SHOW_OPTIONS.map((o) => <option key={o} value={o}>{o} Items</option>)}
                  </select>
                  {/* View toggle */}
                  <div className="flex border border-gray-200 rounded-[7px] overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-[#186737] text-white" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <Grid2x2 size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-[#186737] text-white" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <Rows3 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className={viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3"
                : "flex flex-col gap-3"
              }>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <div className="mt-6">
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(products.length / perPage)}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden min-h-screen bg-white">
        {!submitted ? <MobileTrending /> : <MobileResults />}
      </div>
      {/* Desktop */}
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
    </>
  );
}
