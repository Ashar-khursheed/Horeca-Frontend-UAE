"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import FilterSidebar from "@/components/filters";
import { ProductCardSkeleton } from "@/components/loading-sketlon";
import Pagination from "@/components/pagination";
import ProductCard, { ApiProduct } from "@/components/product-card";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
// import Imag13 from "../../Asset/opporitnytu/landing page-Picsart-AiImageEnhancer.jpg"
import Imag13 from "@/assets/banners/opporitnytu/landing page-Picsart-AiImageEnhancer.jpg";
// import Imag12 from "../../Asset/opporitnytu/main desktop-Picsart-AiImageEnhancer.jpg";
import Imag12 from "@/assets/banners/opporitnytu/main desktop-Picsart-AiImageEnhancer.jpg";
// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MegaSalePage() {
  const locale = useLocale();
  const productsRef = useRef<HTMLDivElement>(null);

  // Filters state from API
  const [filtersData, setFiltersData] = useState<any>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [priceInitialized, setPriceInitialized] = useState(false);

  // Products and pagination state
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Applied Filter states
  const [activeCategoryId, setActiveCategoryId] = useState<number | string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<{ id: number; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  // Helper to resolve translation string
  const resolveStr = (val: any, localeStr: string): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      return val[localeStr] ?? val.en ?? "";
    }
    return "";
  };

  // Map API filter categories to FilterSidebar format
  const sidebarCategories = useMemo(() => {
    if (!filtersData?.categories) return [];
    return filtersData.categories.map((c: any) => ({
      id: c.id,
      name: resolveStr(c.name, locale),
      url: c.slug || "",
    }));
  }, [filtersData, locale]);

  // Map API filter brands to FilterSidebar format
  const sidebarBrands = useMemo(() => {
    if (!filtersData?.brands) return [];
    return filtersData.brands.map((b: any) => ({
      id: b.id,
      name: resolveStr(b.name, locale),
      thumbnail: b.logo_url || null,
    }));
  }, [filtersData, locale]);

  const selectedCategoriesList = useMemo(() => {
    if (!activeCategoryId) return [];
    const found = filtersData?.categories?.find(
      (c: any) => c.id === activeCategoryId || c.slug === activeCategoryId
    );
    if (!found) return [];
    return [{ id: found.id, name: resolveStr(found.name, locale) }];
  }, [activeCategoryId, filtersData, locale]);

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) return " Dubai Summer Sale";
    const found = filtersData?.categories?.find(
      (c: any) => c.id === activeCategoryId || c.slug === activeCategoryId
    );
    return found ? resolveStr(found.name, locale) : " Dubai Summer Sale";
  }, [activeCategoryId, filtersData, locale]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page when search changes
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch products and filters when selection changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const endpoint = activeCategoryId
          ? `frontend/sale-categories/${activeCategoryId}`
          : "frontend/sale-categories";

        const params: Record<string, any> = {
          page: currentPage,
          per_page: 20,
        };

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }
        if (selectedBrands.length > 0) {
          params.brand_id = selectedBrands.map((b) => b.id).join(",");
        }
        if (priceInitialized) {
          params.price_min = priceRange.min;
          params.price_max = priceRange.max;
        }
        if (sortBy) {
          params.sort_by = sortBy;
        }

        const res = await makeApiRequest<{
          success: boolean;
          data: ApiProduct[];
          filters?: any;
          pagination?: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
          };
        }>(endpoint, { params });

        if (res?.success) {
          setProducts(res.data || []);
          if (res.filters) {
            setFiltersData(res.filters);
            if (!priceInitialized && res.filters.price_range) {
              const min = Math.floor(Number(res.filters.price_range.min ?? 0));
              const max = Math.ceil(Number(res.filters.price_range.max ?? 100000));
              setPriceRange({ min, max });
              setPriceInitialized(true);
            }
          }
          if (res.pagination) {
            setTotalPages(res.pagination.last_page || 1);
            setTotalProducts(res.pagination.total || 0);
          }
        } else {
          setProducts([]);
          setTotalPages(1);
          setTotalProducts(0);
        }
      } catch (error) {
        console.error("Error fetching sale products:", error);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [currentPage, debouncedSearch, activeCategoryId, selectedBrands, priceRange, sortBy]);

  const handleCategoryToggle = (cat: { id: number; name: string }) => {
    setActiveCategoryId((prev) => (prev === cat.id ? null : cat.id));
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedBrands([]);
    setActiveCategoryId(null);
    if (filtersData?.price_range) {
      const min = Math.floor(Number(filtersData.price_range.min ?? 0));
      const max = Math.ceil(Number(filtersData.price_range.max ?? 100000));
      setPriceRange({ min, max });
    }
    setSearchQuery("");
    setSortBy("");
    setCurrentPage(1);
  };

  const totalActiveFilters =
    selectedBrands.length +
    (activeCategoryId ? 1 : 0) +
    (filtersData?.price_range &&
    (priceRange.min !== Math.floor(Number(filtersData.price_range.min)) ||
      priceRange.max !== Math.ceil(Number(filtersData.price_range.max)))
      ? 1
      : 0);

  const filterSidebarProps = {
    priceRange,
    onPriceChange: (range: { min: number; max: number }) => {
      setPriceRange(range);
      setCurrentPage(1);
    },
    selectedBrands,
    onBrandToggle: (brand: { id: number; name: string }) => {
      setSelectedBrands((prev) =>
        prev.some((b) => b.id === brand.id)
          ? prev.filter((b) => b.id !== brand.id)
          : [...prev, brand]
      );
      setCurrentPage(1);
    },
    onClearBrands: () => {
      setSelectedBrands([]);
      setCurrentPage(1);
    },
    onClearAll: handleClearAll,
    brands: sidebarBrands,
    categories: sidebarCategories,
    selectedCategories: selectedCategoriesList,
    onCategoryToggle: handleCategoryToggle,
    onClearCategories: () => {
      setActiveCategoryId(null);
      setCurrentPage(1);
    },
    priceMin: filtersData?.price_range ? Math.floor(Number(filtersData.price_range.min)) : 0,
    priceMax: filtersData?.price_range ? Math.ceil(Number(filtersData.price_range.max)) : 100000,
    selectedRangeFilters: {} as Record<number, { min: number; max: number }[]>,
    onRangeFilterToggle: () => {},
    onClearRangeFilter: () => {},
    selectedFixedFilters: {} as Record<number, string[]>,
    onFixedFilterToggle: () => {},
    onClearFixedFilter: () => {},
    currency: filtersData?.price_range?.symbol ?? "$",
  };

  return (
    <>
      {/* <div>
        <Image src={BannerMegaSale} alt=" Dubai Summer Sale Banner" className="w-full h-auto object-cover" />
      </div> */}
 <div className="w-full">
        <Image
          className="w-full md:block hidden"
          src={Imag13}
          loading="lazy"
          alt="Essential hotel supplies including black and red mini fridges, microwave, coffee maker, showcasing convenience and style for modern guest rooms."
        />
        <Image
          className="w-full md:hidden block"
          src={Imag12}
          loading="lazy"
          alt="Essential hotel supplies including black and red mini fridges, microwave, coffee maker, showcasing convenience and style for modern guest rooms."
        />
      </div>
      {/* ── Promo strip ────────────────────────────────────────────────── */}
      <div className="bg-[#E2E8F04D] border-b-2 border-[#E2E8F0] py-6">
        <div className="global-container">
          <p className="text-sm md:text-base text-black font-normal">
          The heat is on, and so are the deals! Enjoy up to <b>60% OFF</b> during our Dubai Summer Sale on your favorite picks. Limited-time offers, limited stock—shop now before they're gone!
          </p>
        </div>
      </div>

      {/* ── Hero text ──────────────────────────────────────────────────── */}
      <div className="py-10 pb-4 bg-white hidden">
        <div className="global-container text-center">
          <h1 className="text-base md:text-lg lg:text-2xl font-extrabold text-[#186737] mb-3 leading-tight">
            Restaurant Equipment Sale
          </h1>
          <h2 className="text-sm md:text-[18px] font-bold text-gray-900 mb-3">
            Shop Discounted Restaurant Equipment &amp; Commercial Kitchen Equipment &amp; Supplies
          </h2>
          <p className="text-sm md:text-base text-black leading-relaxed hidden md:block max-w-4xl mx-auto">
            Take advantage of exclusive deals on commercial kitchen equipment and restaurant supplies
            with the Horeca Store sale. Discover discounted pricing on cooking equipment, refrigeration
            systems, food preparation tools, and essential kitchen supplies designed for restaurants,
            cafés, hotels, and catering businesses. Whether you&apos;re starting a new venture or
            upgrading your existing setup, enjoy cost savings without compromising on quality or
            performance.
          </p>
        </div>
      </div>

      {/* ── Main content section ───────────────────────────────────────── */}
      <div className="global-container py-8" ref={productsRef}>
        <div className="flex gap-5 items-start">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block w-55 lg:w-60 shrink-0">
            {filtersData && <FilterSidebar {...filterSidebarProps} />}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar and heading */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-black">
                  Explore All Products Under{" "}
                  <span className="text-[#186737]">{activeCategoryName}</span>
                </h3>
                {!loadingProducts && (
                  <span className="text-xs text-gray-500 mt-1 block">
                    Showing {products.length} of {totalProducts} results
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 self-end md:self-auto">
                {/* Mobile filters button */}
                <button
                  onClick={() => setFilterOpen(true)}
                  className="flex lg:hidden items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:border-[#186737] hover:text-[#186737] transition-all"
                >
                  <SlidersHorizontal size={14} /> Filters
                  {totalActiveFilters > 0 && (
                    <span className="bg-[#186737] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {totalActiveFilters}
                    </span>
                  )}
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs border border-gray-200 rounded-[7px] px-2.5 py-2 outline-none focus:border-[#186737] text-gray-700 bg-white"
                >
                  <option value="">Sort By</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="discount_desc">Highest Discount</option>
                  <option value="created_at">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex flex-col gap-3 my-5">
              <div className="w-full relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="border border-gray-300 pl-4 pr-10 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#186737] focus:border-transparent text-sm"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Products grid */}
            {loadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <ProductCardSkeleton key={`product-skeleton-${idx}`} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id + "-" + product.sku}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg border border-gray-100 shadow-sm">
                <p className="text-lg font-semibold text-gray-500">No products found.</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query.</p>
                {totalActiveFilters > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="mt-4 px-5 py-2 bg-[#186737] text-white rounded-lg text-sm font-semibold hover:bg-[#145a2d] transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  key={`${currentPage}-${totalPages}`}
                  totalPages={totalPages}
                  initialPage={currentPage}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    setTimeout(() => {
                      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          filterOpen ? "opacity-100 animate-in fade-in" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setFilterOpen(false)}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out lg:hidden ${
          filterOpen ? "translate-y-0" : "translate-y-full"
        }`}
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
          <button
            onClick={() => setFilterOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-4 py-3">
          {filtersData && <FilterSidebar {...filterSidebarProps} mobile />}
        </div>
        <div className="shrink-0 px-4 py-4 border-t border-gray-100 bg-white flex gap-3">
          {totalActiveFilters > 0 && (
            <button
              onClick={handleClearAll}
              className="flex-1 py-3 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setFilterOpen(false)}
            className="flex-1 py-3 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold transition-colors"
          >
            {totalActiveFilters > 0 ? `Apply Filters (${totalActiveFilters})` : "Apply Filters"}
          </button>
        </div>
      </div>
    </>
  );
}
