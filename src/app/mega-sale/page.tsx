"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import ProductCard, { ApiProduct } from "@/components/product-card";
import Pagination from "@/components/pagination";
import { Search, X, ArrowLeft } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import BannerMegaSale from "@/assets/banners/mega-sale/sale-horeca.48eebdaf2a1a79520430.png";
import { generateDynamicCSSProductCard } from "@/utils/dynamic-css";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { useLocale } from "next-intl";
import { ProductCardSkeleton } from "@/components/loading-sketlon";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MegaSalePage() {
  const locale = useLocale();
  const productsRef = useRef<HTMLDivElement>(null);

  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Products and pagination state
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters state
  const [activeCategoryId, setActiveCategoryId] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Helper to resolve translation string
  const resolveStr = (val: any, localeStr: string): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      return val[localeStr] ?? val.en ?? "";
    }
    return "";
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await makeApiRequest<{ success: boolean; data: any[] }>(
          apiUrls.NavigationAPI
        );
        if (res?.success) {
          setCategories(res.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page when search changes
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const params: Record<string, any> = {
          page: currentPage,
          per_page: 20,
        };

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }
        if (activeCategoryId) {
          params.category_id = activeCategoryId;
        }
        if (minPrice) {
          params.price_min = Number(minPrice);
        }
        if (maxPrice) {
          params.price_max = Number(maxPrice);
        }
        if (sortBy) {
          params.sort_by = sortBy;
        }

        const res = await makeApiRequest<{
          success: boolean;
          data: ApiProduct[];
          pagination?: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
          };
        }>("frontend/sale-categories", { params });

        if (res?.success) {
          setProducts(res.data || []);
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
  }, [currentPage, debouncedSearch, activeCategoryId, minPrice, maxPrice, sortBy]);

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) return "Horeca Sale";
    const found = categories.find(
      (c) => c.id === activeCategoryId || c.slug === activeCategoryId
    );
    return found ? resolveStr(found.name, locale) : "Horeca Sale";
  }, [activeCategoryId, categories, locale]);

  const handleCategoryClick = (id: number | string) => {
    setActiveCategoryId((prev) => (prev === id ? null : id));
    setCurrentPage(1);
    setSearchQuery("");
    setSortBy("");
    setTempMin("");
    setTempMax("");
    setMinPrice("");
    setMaxPrice("");
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleApplyPrice = () => {
    setMinPrice(tempMin);
    setMaxPrice(tempMax);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("");
    setTempMin("");
    setTempMax("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || sortBy || minPrice || maxPrice;

  return (
    <>
      <div>
        <Image src={BannerMegaSale} alt="Horeca Sale Banner" className="w-full h-auto object-cover" />
      </div>

      {/* ── Promo strip ────────────────────────────────────────────────── */}
      <div className="bg-[#E2E8F04D] border-b-2 border-[#E2E8F0] py-6">
        <div className="global-container">
          <p className="text-sm md:text-base text-black font-normal">
            Enjoy <b>up to 50%</b> OFF on your favourite kitchen and horeca essentials.
            Don&apos;t miss these exclusive deals — shop now and upgrade your kitchen before the offers are gone.
          </p>
        </div>
      </div>

      {/* ── Hero text ──────────────────────────────────────────────────── */}
      <div className="py-10 pb-4 bg-white">
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

      {/* ── Browse Categories ──────────────────────────────────────────── */}
      <div className="global-container py-4 pb-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl 2xl:text-2xl font-bold text-black">Browse Categories</h2>
          {activeCategoryId && (
            <button
              onClick={() => { setActiveCategoryId(null); setCurrentPage(1); }}
              className="flex items-center gap-2 text-sm font-semibold text-[#186737] hover:underline"
            >
              <ArrowLeft size={16} /> View All
            </button>
          )}
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          breakpoints={{
            0: { slidesPerView: 2 },
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="pb-2!"
        >
          {loadingCategories ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <SwiperSlide key={`cat-skeleton-${idx}`} className="h-auto!">
                <div className="bg-gray-100 animate-pulse flex flex-col items-center justify-center rounded-md p-3 border border-gray-200 h-55 md:h-65">
                  <div className="w-24 h-24 bg-gray-200 rounded-full" />
                  <div className="mt-4 h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </SwiperSlide>
            ))
          ) : (
            categories.map((cat) => {
              const name = resolveStr(cat.name, locale);
              const imageUrl = cat.image_url || "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_7JiqdDIooIC58z6kKhvJ.webp";
              return (
                <SwiperSlide key={cat.id} className="h-auto!">
                  <div
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`cursor-pointer bg-[#F5F5F5] flex flex-col items-center justify-center rounded-md p-3 border transition-all hover:border-[#186737] h-55 md:h-65 ${
                      activeCategoryId === cat.id
                        ? "border-2 border-[#186737] bg-[#f0faf4]"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-35 h-35 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_7JiqdDIooIC58z6kKhvJ.webp";
                      }}
                    />
                    <h3 className="mt-3 text-sm font-semibold text-[#186737] text-center leading-snug line-clamp-2">
                      {name}
                    </h3>
                  </div>
                </SwiperSlide>
              );
            })
          )}
        </Swiper>
      </div>

      {/* ── Products Section ───────────────────────────────────────────── */}
      <div className="global-container py-8" ref={productsRef}>
        {/* Back button */}
        {activeCategoryId && (
          <div className="mb-4">
            <button
              onClick={() => { setActiveCategoryId(null); setCurrentPage(1); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#186737] text-white rounded-lg hover:bg-[#145a2d] transition-colors text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              Back to Horeca Sale
            </button>
          </div>
        )}

        {/* Section heading */}
        <div className="flex items-center justify-between my-4">
          <h3 className="text-xl 2xl:text-2xl font-bold text-black">
            Explore All Products Under{" "}
            <span className="text-[#186737]">{activeCategoryName}</span>
          </h3>
          {!loadingProducts && (
            <span className="text-sm text-gray-500 hidden sm:block">
              {totalProducts} product{totalProducts !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Filters row */}
        <div className="my-5">
          <div className="flex flex-col xl:flex-row gap-3 items-start xl:items-center">
            {/* Search */}
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

            {/* Price range */}
            <div className="flex gap-2 items-center shrink-0">
              <input
                type="number"
                value={tempMin}
                onChange={(e) => setTempMin(e.target.value)}
                placeholder="From $"
                className="border border-gray-300 px-3 py-2.5 rounded-lg w-25 text-sm focus:outline-none focus:ring-2 focus:ring-[#186737] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onWheel={(e) => e.currentTarget.blur()}
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                value={tempMax}
                onChange={(e) => setTempMax(e.target.value)}
                placeholder="To $"
                className="border border-gray-300 px-3 py-2.5 rounded-lg w-25 text-sm focus:outline-none focus:ring-2 focus:ring-[#186737] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onWheel={(e) => e.currentTarget.blur()}
              />
              <button
                onClick={handleApplyPrice}
                className="px-4 py-2.5 bg-[#186737] text-white rounded-lg hover:bg-[#145a2d] transition-colors flex items-center gap-1 text-sm font-semibold shrink-0"
              >
                <Search size={16} />
              </button>
            </div>

            {/* Sort */}
            <div className="w-full xl:w-auto shrink-0">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="border border-gray-300 px-3 py-2.5 rounded-lg w-full xl:w-40 focus:outline-none focus:ring-2 focus:ring-[#186737] focus:border-transparent text-sm"
              >
                <option value="">Sort By</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="discount_desc">Highest Discount</option>
                <option value="created_at">Newest Arrivals</option>
              </select>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1.5 text-sm font-semibold shrink-0 whitespace-nowrap"
              >
                <X size={16} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Products grid */}
        {loadingProducts ? (
          <div className={generateDynamicCSSProductCard}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={`product-skeleton-${idx}`} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={generateDynamicCSSProductCard}>
            {products.map((product) => (
              <ProductCard
                key={product.id + "-" + product.sku}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-semibold text-gray-500">No products found.</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query.</p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
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
                setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
