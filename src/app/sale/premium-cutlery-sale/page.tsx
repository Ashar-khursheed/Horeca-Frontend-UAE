// "use client";

// import { makeApiRequest } from "@/apis/axios-instance";
// import { apiUrls } from "@/apis/api-endpoint";
// import FilterSidebar from "@/components/filters";
// import { ProductCardSkeleton } from "@/components/loading-sketlon";
// import Pagination from "@/components/pagination";
// import ProductCard, { RawApiProduct } from "@/components/product-card";
// import { Search, SlidersHorizontal, X } from "lucide-react";
// import { useLocale } from "next-intl";
// import Image from "next/image";
// import { useEffect, useMemo, useRef, useState } from "react";

// const SALE_TITLE = "Premium Cutlery Sale";
// const ROOT_CATEGORY_URL = "cutlery";

// type ListingProduct = RawApiProduct & {
//   title?: string;
//   image_urls?: string[];
//   reviews_count?: number;
//   for_quotes?: number | boolean;
//   best_supplier?: {
//     price?: number | string;
//     sale_price?: number | string;
//     min_quantity?: number;
//     is_fixed?: number | boolean;
//     delivery_days?: string;
//     free_shipping?: boolean | number;
//   };
// };

// function resolveStr(val: unknown, localeStr: string): string {
//   if (!val) return "";
//   if (typeof val === "string") return val;
//   if (typeof val === "object") {
//     const o = val as Record<string, string | undefined>;
//     return o[localeStr] ?? o.en ?? "";
//   }
//   return "";
// }

// function toNum(v: number | string | undefined | null): number {
//   if (v == null) return 0;
//   return typeof v === "string" ? parseFloat(v) || 0 : v;
// }

// function mapListingProduct(p: ListingProduct): RawApiProduct {
//   const supplier = p.best_supplier;
//   const original = toNum(supplier?.price ?? p.price ?? p.best_price);
//   const sale = toNum(supplier?.sale_price ?? p.sale_price);
//   return {
//     ...p,
//     name: p.name ?? p.title,
//     images: p.images ?? p.image_urls,
//     original_price: original,
//     price: original,
//     sale_price: sale,
//     total_reviews: p.total_reviews ?? p.reviews_count,
//     min_quantity: p.min_quantity ?? supplier?.min_quantity,
//     is_fixed: p.is_fixed ?? supplier?.is_fixed,
//     quote_available: p.quote_available ?? p.for_quotes,
//     delivery_days: p.delivery_days ?? supplier?.delivery_days,
//     free_shipping: p.free_shipping ?? (supplier?.free_shipping ? 1 : 0),
//   };
// }

// export default function PremiumCutlerySalePage() {
//   const locale = useLocale();
//   const productsRef = useRef<HTMLDivElement>(null);

//   const [filtersData, setFiltersData] = useState<any>(null);
//   const [bannerUrl, setBannerUrl] = useState<string | null>(null);
//   const [bannerAlt, setBannerAlt] = useState(SALE_TITLE);
//   const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
//   const [priceDirty, setPriceDirty] = useState(false);

//   const [products, setProducts] = useState<RawApiProduct[]>([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalProducts, setTotalProducts] = useState(0);

//   const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
//   const [selectedBrands, setSelectedBrands] = useState<{ id: number; name: string }[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [sortBy, setSortBy] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filterOpen, setFilterOpen] = useState(false);

//   const sidebarCategories = useMemo(() => {
//     if (!filtersData?.categories) return [];
//     return filtersData.categories.map((c: any) => ({
//       id: c.id,
//       name: resolveStr(c.name, locale),
//       url: c.url || c.slug || "",
//     }));
//   }, [filtersData, locale]);

//   const sidebarBrands = useMemo(() => {
//     if (!filtersData?.filters?.brands && !filtersData?.brands) return [];
//     const brands = filtersData?.filters?.brands ?? filtersData?.brands ?? [];
//     return brands.map((b: any) => ({
//       id: b.id,
//       name: resolveStr(b.name, locale),
//       thumbnail: b.thumbnail || b.logo_url || null,
//     }));
//   }, [filtersData, locale]);

//   const selectedCategoriesList = useMemo(() => {
//     if (!activeCategoryId) return [];
//     const found = sidebarCategories.find((c: { id: number }) => c.id === activeCategoryId);
//     if (!found) return [];
//     return [{ id: found.id, name: found.name }];
//   }, [activeCategoryId, sidebarCategories]);

//   const activeCategoryUrl = useMemo(() => {
//     if (!activeCategoryId) return ROOT_CATEGORY_URL;
//     const found = sidebarCategories.find((c: { id: number }) => c.id === activeCategoryId);
//     return found?.url || ROOT_CATEGORY_URL;
//   }, [activeCategoryId, sidebarCategories]);

//   const activeCategoryName = useMemo(() => {
//     if (!activeCategoryId) return SALE_TITLE;
//     const found = sidebarCategories.find((c: { id: number }) => c.id === activeCategoryId);
//     return found?.name || SALE_TITLE;
//   }, [activeCategoryId, sidebarCategories]);

//   const apiPriceMin = filtersData?.filters?.priceRange
//     ? Math.floor(Number(filtersData.filters.priceRange.min_price ?? 0))
//     : 0;
//   const apiPriceMax = filtersData?.filters?.priceRange
//     ? Math.ceil(Number(filtersData.filters.priceRange.max_price ?? 100000))
//     : 100000;
//   const currency =
//     filtersData?.filters?.priceRange?.currency?.symbol ??
//     filtersData?.price_range?.symbol ??
//     "AED";

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//       setCurrentPage(1);
//     }, 400);
//     return () => clearTimeout(handler);
//   }, [searchQuery]);

//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         const res = await makeApiRequest<any>(apiUrls.INNER_CATEGORY_PAGES_WITH_FILTER, {
//           method: "POST",
//           data: {
//             category_url: ROOT_CATEGORY_URL,
//             applied_filters: {},
//             applied_range_filters: [{}],
//             applied_fixed_filters: [{}],
//             locale,
//           },
//         });

//         if (res?.success) {
//           setFiltersData(res);
//           const min = Math.floor(Number(res.filters?.priceRange?.min_price ?? 0));
//           const max = Math.ceil(Number(res.filters?.priceRange?.max_price ?? 100000));
//           setPriceRange({ min, max });
//           if (res.seo?.banner_image_url) {
//             setBannerUrl(res.seo.banner_image_url);
//             setBannerAlt(res.seo.banner_image_alt_text || SALE_TITLE);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching cutlery filters:", error);
//       }
//     };

//     fetchFilters();
//   }, [locale]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoadingProducts(true);
//       try {
//         const sortMap: Record<string, { sort_by: string; sort_dir: string }> = {
//           price_asc: { sort_by: "price", sort_dir: "asc" },
//           price_desc: { sort_by: "price", sort_dir: "desc" },
//           created_at: { sort_by: "created_at", sort_dir: "desc" },
//           discount_desc: { sort_by: "price", sort_dir: "asc" },
//         };
//         const { sort_by, sort_dir } = sortMap[sortBy] ?? {
//           sort_by: "price",
//           sort_dir: "asc",
//         };

//         const appliedFilters: Record<string, unknown> = {};
//         if (selectedBrands.length > 0) {
//           appliedFilters.brand_ids = selectedBrands.map((b) => b.id);
//         }
//         if (priceDirty) {
//           appliedFilters.priceRange = {
//             min_price: String(priceRange.min),
//             max_price: String(priceRange.max),
//           };
//         }

//         const body: Record<string, unknown> = {
//           category_url: activeCategoryUrl,
//           page: currentPage,
//           length: 20,
//           sort_by,
//           sort_dir,
//           applied_filters: appliedFilters,
//           applied_range_filters: [{}],
//           applied_fixed_filters: [{}],
//           locale,
//         };

//         if (debouncedSearch.trim()) {
//           body.search = debouncedSearch.trim();
//         }

//         const res = await makeApiRequest<{
//           success: boolean;
//           products?: ListingProduct[];
//           total_records?: number;
//           total_pages?: number;
//         }>(apiUrls.PRODUCTS_LISTING, { method: "POST", data: body });

//         if (res?.success) {
//           setProducts((res.products ?? []).map(mapListingProduct));
//           setTotalPages(res.total_pages || 1);
//           setTotalProducts(res.total_records || 0);
//         } else {
//           setProducts([]);
//           setTotalPages(1);
//           setTotalProducts(0);
//         }
//       } catch (error) {
//         console.error("Error fetching cutlery products:", error);
//         setProducts([]);
//         setTotalPages(1);
//         setTotalProducts(0);
//       } finally {
//         setLoadingProducts(false);
//       }
//     };

//     fetchProducts();
//   }, [
//     currentPage,
//     debouncedSearch,
//     activeCategoryUrl,
//     selectedBrands,
//     priceRange,
//     priceDirty,
//     sortBy,
//     locale,
//   ]);

//   const handleCategoryToggle = (cat: { id: number; name: string }) => {
//     setActiveCategoryId((prev) => (prev === cat.id ? null : cat.id));
//     setCurrentPage(1);
//   };

//   const handleClearAll = () => {
//     setSelectedBrands([]);
//     setActiveCategoryId(null);
//     setPriceRange({ min: apiPriceMin, max: apiPriceMax });
//     setPriceDirty(false);
//     setSearchQuery("");
//     setSortBy("");
//     setCurrentPage(1);
//   };

//   const totalActiveFilters =
//     selectedBrands.length +
//     (activeCategoryId ? 1 : 0) +
//     (priceDirty && (priceRange.min !== apiPriceMin || priceRange.max !== apiPriceMax) ? 1 : 0);

//   const filterSidebarProps = {
//     priceRange,
//     onPriceChange: (range: { min: number; max: number }) => {
//       setPriceRange(range);
//       setPriceDirty(true);
//       setCurrentPage(1);
//     },
//     selectedBrands,
//     onBrandToggle: (brand: { id: number; name: string }) => {
//       setSelectedBrands((prev) =>
//         prev.some((b) => b.id === brand.id)
//           ? prev.filter((b) => b.id !== brand.id)
//           : [...prev, brand],
//       );
//       setCurrentPage(1);
//     },
//     onClearBrands: () => {
//       setSelectedBrands([]);
//       setCurrentPage(1);
//     },
//     onClearAll: handleClearAll,
//     brands: sidebarBrands,
//     categories: sidebarCategories,
//     selectedCategories: selectedCategoriesList,
//     onCategoryToggle: handleCategoryToggle,
//     onClearCategories: () => {
//       setActiveCategoryId(null);
//       setCurrentPage(1);
//     },
//     priceMin: apiPriceMin,
//     priceMax: apiPriceMax,
//     selectedRangeFilters: {} as Record<number, { min: number; max: number }[]>,
//     onRangeFilterToggle: () => {},
//     onClearRangeFilter: () => {},
//     selectedFixedFilters: {} as Record<number, string[]>,
//     onFixedFilterToggle: () => {},
//     onClearFixedFilter: () => {},
//     currency,
//   };

//   return (
//     <>
//       {bannerUrl && (
//         <div className="w-full">
//           <Image
//             className="w-full h-auto object-cover"
//             src={bannerUrl}
//             width={1920}
//             height={400}
//             loading="lazy"
//             alt={bannerAlt}
//           />
//         </div>
//       )}

//       <div className="bg-[#E2E8F04D] border-b-2 border-[#E2E8F0] py-6">
//         <div className="global-container">
//           <p className="text-sm md:text-base text-black font-normal">
//             Set a premium table for less. Shop our{" "}
//             <b>Premium Cutlery Sale</b> on gold, silver, black and copper
//             collections for hotels, restaurants and catering. Limited-time
//             prices — shop now while stock lasts.
//           </p>
//         </div>
//       </div>

//       <div className="py-10 pb-4 bg-white hidden">
//         <div className="global-container text-center">
//           <h1 className="text-base md:text-lg lg:text-2xl font-extrabold text-[#186737] mb-3 leading-tight">
//             {SALE_TITLE}
//           </h1>
//           <h2 className="text-sm md:text-[18px] font-bold text-gray-900 mb-3">
//             Shop Discounted Premium Cutlery for Hotels, Restaurants &amp; Catering
//           </h2>
//           <p className="text-sm md:text-base text-black leading-relaxed hidden md:block max-w-4xl mx-auto">
//             Discover exclusive deals on commercial-grade cutlery from trusted
//             brands. Choose from silver, gold, black and copper collections
//             designed for high-volume hospitality service — without compromising
//             on finish or durability.
//           </p>
//         </div>
//       </div>

//       <div className="global-container py-8" ref={productsRef}>
//         <div className="flex gap-5 items-start">
//           <div className="hidden lg:block w-55 lg:w-60 shrink-0">
//             {filtersData && <FilterSidebar {...filterSidebarProps} />}
//           </div>

//           <div className="flex-1 min-w-0">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//               <div>
//                 <h3 className="text-xl font-bold text-black">
//                   Explore All Products Under{" "}
//                   <span className="text-[#186737]">{activeCategoryName}</span>
//                 </h3>
//                 {!loadingProducts && (
//                   <span className="text-xs text-gray-500 mt-1 block">
//                     Showing {products.length} of {totalProducts} results
//                   </span>
//                 )}
//               </div>
//               <div className="flex items-center gap-3 self-end md:self-auto">
//                 <button
//                   onClick={() => setFilterOpen(true)}
//                   className="flex lg:hidden items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:border-[#186737] hover:text-[#186737] transition-all"
//                 >
//                   <SlidersHorizontal size={14} /> Filters
//                   {totalActiveFilters > 0 && (
//                     <span className="bg-[#186737] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
//                       {totalActiveFilters}
//                     </span>
//                   )}
//                 </button>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => {
//                     setSortBy(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="text-xs border border-gray-200 rounded-[7px] px-2.5 py-2 outline-none focus:border-[#186737] text-gray-700 bg-white"
//                 >
//                   <option value="">Sort By</option>
//                   <option value="price_asc">Price: Low → High</option>
//                   <option value="price_desc">Price: High → Low</option>
//                   <option value="created_at">Newest Arrivals</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex flex-col gap-3 my-5">
//               <div className="w-full relative">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search cutlery..."
//                   className="border border-gray-300 pl-4 pr-10 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#186737] focus:border-transparent text-sm"
//                 />
//                 <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//               </div>
//             </div>

//             {loadingProducts ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
//                 {Array.from({ length: 8 }).map((_, idx) => (
//                   <ProductCardSkeleton key={`product-skeleton-${idx}`} />
//                 ))}
//               </div>
//             ) : products.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
//                 {products.map((product) => (
//                   <ProductCard
//                     key={`${product.id}-${product.sku ?? product.url}`}
//                     product={product}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg border border-gray-100 shadow-sm">
//                 <p className="text-lg font-semibold text-gray-500">No products found.</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   Try adjusting your filters or search query.
//                 </p>
//                 {totalActiveFilters > 0 && (
//                   <button
//                     onClick={handleClearAll}
//                     className="mt-4 px-5 py-2 bg-[#186737] text-white rounded-lg text-sm font-semibold hover:bg-[#145a2d] transition-colors"
//                   >
//                     Clear Filters
//                   </button>
//                 )}
//               </div>
//             )}

//             {totalPages > 1 && (
//               <div className="mt-10 flex justify-center">
//                 <Pagination
//                   key={`${currentPage}-${totalPages}`}
//                   totalPages={totalPages}
//                   initialPage={currentPage}
//                   onPageChange={(page) => {
//                     setCurrentPage(page);
//                     setTimeout(() => {
//                       productsRef.current?.scrollIntoView({
//                         behavior: "smooth",
//                         block: "start",
//                       });
//                     }, 100);
//                   }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
//           filterOpen ? "opacity-100 animate-in fade-in" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={() => setFilterOpen(false)}
//       />
//       <div
//         className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out lg:hidden ${
//           filterOpen ? "translate-y-0" : "translate-y-full"
//         }`}
//         style={{ maxHeight: "88vh" }}
//       >
//         <div className="flex justify-center pt-3 pb-1 shrink-0">
//           <div className="w-10 h-1 bg-gray-200 rounded-full" />
//         </div>
//         <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
//           <div className="flex items-center gap-2">
//             <SlidersHorizontal size={16} className="text-[#186737]" />
//             <span className="text-[15px] font-bold text-gray-900">Filters</span>
//           </div>
//           <button
//             onClick={() => setFilterOpen(false)}
//             className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
//           >
//             <X size={18} />
//           </button>
//         </div>
//         <div className="overflow-y-auto flex-1 px-4 py-3">
//           {filtersData && <FilterSidebar {...filterSidebarProps} mobile />}
//         </div>
//         <div className="shrink-0 px-4 py-4 border-t border-gray-100 bg-white flex gap-3">
//           {totalActiveFilters > 0 && (
//             <button
//               onClick={handleClearAll}
//               className="flex-1 py-3 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors"
//             >
//               Clear All
//             </button>
//           )}
//           <button
//             onClick={() => setFilterOpen(false)}
//             className="flex-1 py-3 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold transition-colors"
//           >
//             {totalActiveFilters > 0 ? `Apply Filters (${totalActiveFilters})` : "Apply Filters"}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }


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
import Imag13 from "@/assets/banners/cuttely/Untitled design (19) (1).jpg";
// import Imag12 from "../../Asset/opporitnytu/main desktop-Picsart-AiImageEnhancer.jpg";
import Imag12 from "@/assets/banners/cuttely/Untitled design (19) (1).jpg";
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
    if (!activeCategoryId) return " Premium Cutlery Sale";
    const found = filtersData?.categories?.find(
      (c: any) => c.id === activeCategoryId || c.slug === activeCategoryId
    );
    return found ? resolveStr(found.name, locale) : " Premium Cutlery Sale";
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
          : "frontend/sku-sale-products";

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
        <Image src={BannerMegaSale} alt=" Premium Cutlery Sale Banner" className="w-full h-auto object-cover" />
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
          Upgrade your table with premium, restaurant-grade cutlery at prices we rarely touch. Whether you're plating at home or running a full service, these deals are too good to let slide! <b className="text-red-500 font-bold">🍴</b>
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
                  Explore Products Under{" "}
                  {/* Explore All Products Under{" "} */}
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
