"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import FilterSidebar from "@/components/filters";
import { ProductCardSkeleton } from "@/components/loading-sketlon";
import Pagination from "@/components/pagination";
import ProductCard, { RawApiProduct } from "@/components/product-card";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildSaleLandingParams,
  isUsableBanner,
  mapLandingProduct,
  type SaleLandingFilters,
  type SaleLandingResponse,
} from "./sale-landing";

export type SaleLandingClientData = {
  title: string;
  description: string;
  desktopBanner: string | null;
  desktopBannerAlt: string;
  mobileBanner: string | null;
  mobileBannerAlt: string;
  products: RawApiProduct[];
  filters: SaleLandingFilters;
  totalProducts: number;
  totalPages: number;
  currentPage: number;
};

type Props = {
  slug: string;
  endpoint: string;
  data: SaleLandingClientData;
  initialCategoryId?: string | number | null;
  initialBrandIds?: number[];
  initialSearch?: string;
  initialSortBy?: string;
  initialPriceMin?: number | null;
  initialPriceMax?: number | null;
};

function resolveStr(val: unknown, localeStr: string): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    const o = val as Record<string, string | undefined>;
    return o[localeStr] ?? o.en ?? "";
  }
  return "";
}

export default function SaleLandingClient({
  slug,
  endpoint,
  data,
  initialCategoryId = null,
  initialBrandIds = [],
  initialSearch = "",
  initialSortBy = "",
  initialPriceMin = null,
  initialPriceMax = null,
}: Props) {
  const locale = useLocale();
  const productsRef = useRef<HTMLDivElement>(null);
  const skipFirstFetch = useRef(true);

  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [desktopBanner, setDesktopBanner] = useState(data.desktopBanner);
  const [desktopBannerAlt, setDesktopBannerAlt] = useState(data.desktopBannerAlt);
  const [mobileBanner, setMobileBanner] = useState(data.mobileBanner);
  const [mobileBannerAlt, setMobileBannerAlt] = useState(data.mobileBannerAlt);

  const [filtersData, setFiltersData] = useState<SaleLandingFilters>(data.filters);
  const [products, setProducts] = useState<RawApiProduct[]>(data.products);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [totalPages, setTotalPages] = useState(data.totalPages);
  const [totalProducts, setTotalProducts] = useState(data.totalProducts);

  const [activeCategoryId, setActiveCategoryId] = useState<number | string | null>(
    initialCategoryId,
  );
  const [selectedBrands, setSelectedBrands] = useState<{ id: number; name: string }[]>(
    () => {
      const brands = data.filters.brands ?? [];
      return brands
        .filter((b) => initialBrandIds.includes(b.id))
        .map((b) => ({ id: b.id, name: resolveStr(b.name, locale) }));
    },
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [currentPage, setCurrentPage] = useState(data.currentPage || 1);
  const [filterOpen, setFilterOpen] = useState(false);

  const apiPriceMin = Math.floor(Number(filtersData.price_range?.min ?? 0));
  const apiPriceMax = Math.ceil(Number(filtersData.price_range?.max ?? 0));
  const sliderMax = apiPriceMax > apiPriceMin ? apiPriceMax : 100000;
  const sliderMin = apiPriceMin;

  const [priceRange, setPriceRange] = useState({
    min: initialPriceMin ?? sliderMin,
    max: initialPriceMax ?? sliderMax,
  });
  const [priceDirty, setPriceDirty] = useState(
    initialPriceMin != null || initialPriceMax != null,
  );

  const sidebarCategories = useMemo(
    () =>
      (filtersData.categories ?? []).map((c) => ({
        id: c.id,
        name: resolveStr(c.name, locale),
        url: c.slug || "",
      })),
    [filtersData, locale],
  );

  const sidebarBrands = useMemo(
    () =>
      (filtersData.brands ?? []).map((b) => ({
        id: b.id,
        name: resolveStr(b.name, locale),
        thumbnail: b.logo_url || null,
      })),
    [filtersData, locale],
  );

  const selectedCategoriesList = useMemo(() => {
    if (!activeCategoryId) return [];
    const found = sidebarCategories.find(
      (c) => c.id === activeCategoryId || c.url === activeCategoryId,
    );
    return found ? [{ id: found.id, name: found.name }] : [];
  }, [activeCategoryId, sidebarCategories]);

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) return title;
    const found = sidebarCategories.find(
      (c) => c.id === activeCategoryId || c.url === activeCategoryId,
    );
    return found?.name || title;
  }, [activeCategoryId, sidebarCategories, title]);

  const currency = filtersData.price_range?.symbol ?? "$";

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery === debouncedSearch) return;
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const params = buildSaleLandingParams({
          category_id: activeCategoryId,
          brand_id:
            selectedBrands.length > 0
              ? selectedBrands.map((b) => b.id).join(",")
              : null,
          price_min: priceDirty ? priceRange.min : null,
          price_max: priceDirty ? priceRange.max : null,
          search: debouncedSearch,
          sort_by: sortBy,
          page: currentPage,
          per_page: 20,
        });

        const qs = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (key !== "per_page" || Number(value) !== 20) {
            qs.set(key, String(value));
          }
        });
        const next = qs.toString();
        window.history.replaceState(
          null,
          "",
          next ? `?${next}` : window.location.pathname,
        );

        const res = await makeApiRequest<SaleLandingResponse>(endpoint, {
          params,
        });

        const payload = res?.data;
        if (res?.success && payload) {
          setTitle((prev) => payload.title || prev);
          setDescription((prev) => payload.description ?? prev);
          if (isUsableBanner(payload.desktop_banner)) {
            setDesktopBanner(payload.desktop_banner ?? null);
            setDesktopBannerAlt(payload.desktop_banner_alt || payload.title);
          }
          if (isUsableBanner(payload.mobile_banner)) {
            setMobileBanner(payload.mobile_banner ?? null);
            setMobileBannerAlt(payload.mobile_banner_alt || payload.title);
          }
          setProducts((payload.products ?? []).map(mapLandingProduct));
          if (payload.filters) setFiltersData(payload.filters);
          setTotalPages(payload.pagination?.last_page || 1);
          setTotalProducts(payload.pagination?.total || 0);
        } else {
          setProducts([]);
          setTotalPages(1);
          setTotalProducts(0);
        }
      } catch (error) {
        console.error("Error fetching sale landing products:", error);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [
    slug,
    endpoint,
    currentPage,
    debouncedSearch,
    activeCategoryId,
    selectedBrands,
    priceRange,
    priceDirty,
    sortBy,
  ]);

  const handleCategoryToggle = (cat: { id: number; name: string }) => {
    setActiveCategoryId((prev) => (prev === cat.id ? null : cat.id));
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedBrands([]);
    setActiveCategoryId(null);
    setPriceRange({ min: sliderMin, max: sliderMax });
    setPriceDirty(false);
    setSearchQuery("");
    setDebouncedSearch("");
    setSortBy("");
    setCurrentPage(1);
  };

  const totalActiveFilters =
    selectedBrands.length +
    (activeCategoryId ? 1 : 0) +
    (priceDirty &&
    (priceRange.min !== sliderMin || priceRange.max !== sliderMax)
      ? 1
      : 0);

  const filterSidebarProps = {
    priceRange,
    onPriceChange: (range: { min: number; max: number }) => {
      setPriceRange(range);
      setPriceDirty(true);
      setCurrentPage(1);
    },
    selectedBrands,
    onBrandToggle: (brand: { id: number; name: string }) => {
      setSelectedBrands((prev) =>
        prev.some((b) => b.id === brand.id)
          ? prev.filter((b) => b.id !== brand.id)
          : [...prev, brand],
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
    priceMin: sliderMin,
    priceMax: sliderMax,
    selectedRangeFilters: {} as Record<number, { min: number; max: number }[]>,
    onRangeFilterToggle: () => {},
    onClearRangeFilter: () => {},
    selectedFixedFilters: {} as Record<number, string[]>,
    onFixedFilterToggle: () => {},
    onClearFixedFilter: () => {},
    currency,
  };

  const showDesktopBanner = isUsableBanner(desktopBanner);
  const showMobileBanner = isUsableBanner(mobileBanner) || showDesktopBanner;
  const mobileSrc = isUsableBanner(mobileBanner) ? mobileBanner : desktopBanner;

  return (
    <>
      {(showDesktopBanner || showMobileBanner) && (
        <div className="w-full">
          {showDesktopBanner && (
            <Image
              className="w-full md:block hidden h-auto object-cover"
              src={desktopBanner!}
              width={1920}
              height={400}
              loading="lazy"
              alt={desktopBannerAlt}
            />
          )}
          {showMobileBanner && mobileSrc && (
            <Image
              className="w-full md:hidden block h-auto object-cover"
              src={mobileSrc}
              width={800}
              height={400}
              loading="lazy"
              alt={mobileBannerAlt || desktopBannerAlt}
            />
          )}
        </div>
      )}

      {description && (
        <div className="bg-[#E2E8F04D] border-b-2 border-[#E2E8F0] py-6">
          <div className="global-container">
            <p className="text-sm md:text-base text-black font-normal">
              {description}
            </p>
          </div>
        </div>
      )}

      <div className="global-container py-8" ref={productsRef}>
        <div className="flex gap-5 items-start">
          <div className="hidden lg:block w-55 lg:w-60 shrink-0">
            <FilterSidebar {...filterSidebarProps} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-black">
                  Explore Products Under{" "}
                  <span className="text-[#186737]">{activeCategoryName}</span>
                </h3>
                {!loadingProducts && (
                  <span className="text-xs text-gray-500 mt-1 block">
                    Showing {products.length} of {totalProducts} results
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 self-end md:self-auto">
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
                    key={`${product.id}-${product.sku ?? product.url}`}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg border border-gray-100 shadow-sm">
                <p className="text-lg font-semibold text-gray-500">No products found.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your filters or search query.
                </p>
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

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  key={`${currentPage}-${totalPages}`}
                  totalPages={totalPages}
                  initialPage={currentPage}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    setTimeout(() => {
                      productsRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 100);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

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
          <FilterSidebar {...filterSidebarProps} mobile />
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
            {totalActiveFilters > 0
              ? `Apply Filters (${totalActiveFilters})`
              : "Apply Filters"}
          </button>
        </div>
      </div>
    </>
  );
}
