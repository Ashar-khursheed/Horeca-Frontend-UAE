"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import ProductCard, { type RawApiProduct } from "@/components/product-card";
import SeoContent, { type SeoApiData } from "@/seo/seo-content";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BrandCategoryProductsResponse {
  success: boolean;
  data: RawApiProduct[];
  // This endpoint returns flat total_records/total_pages/current_page/per_page
  // fields instead of a nested `pagination` object (unlike BRAND_BY_SLUG).
  total_records?: number;
  total_pages?: number;
  current_page?: number;
  per_page?: number;
  pagination?: { total: number; per_page: number; current_page: number; last_page: number };
  message?: string;
}

// Product shape here is the same "raw" API product used across the app
// (title/image_urls/best_supplier/reviews_count/product_accessories etc);
// selling_type is the one field that arrives double-wrapped in {en, ar}.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBrandCatProduct(p: any): RawApiProduct {
  const sellingType = p.selling_type?.en ?? p.selling_type?.ar ?? p.selling_type;
  return {
    ...p,
    selling_type: sellingType,
  };
}

// Normalise BRAND_CATEGORY_PRODUCTS' flat pagination fields into the
// { total, per_page, current_page, last_page } shape used everywhere else.
function normalizeCategoryPagination(res: BrandCategoryProductsResponse): Pagination {
  return {
    total: res.total_records ?? res.pagination?.total ?? 0,
    per_page: res.per_page ?? res.pagination?.per_page ?? 20,
    current_page: res.current_page ?? res.pagination?.current_page ?? 1,
    last_page: res.total_pages ?? res.pagination?.last_page ?? 1,
  };
}

interface BrandName {
  en: string;
  ar?: string | null;
}
interface LocaleStr {
  en?: string | null;
  ar?: string | null;
}
interface PopularTag {
  popularTags: string;
  popularSlug: string;
}

interface BrandCategory {
  id: number;
  name: BrandName;
  image_url: string;
  url: string;
  product_count: number;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// The API returns the brand's fields flattened directly on `data`
// (not nested under a `brand` key), and SEO content lives under
// `seo_url` in the same shape SeoContent already expects.
export interface BrandDetailData {
  id: number;
  name: BrandName;
  thumbnail?: LocaleStr | null;
  logo_url?: string | null;
  desktop_banner?: string[];
  desktop_banner_alt_text?: string[];
  mobile_banner?: string[];
  mobile_banner_alt_text?: string[];
  website?: string | null;
  is_featured?: boolean;
  seo_url?: SeoApiData;
  categories?: BrandCategory[];
  products?: RawApiProduct[];
  total_records?: number;
  total_pages?: number;
  current_page?: number;
  per_page?: number;
}

export interface BrandDetailResponse {
  success: boolean;
  message?: string;
  data?: BrandDetailData;
}

// ── Category Card ─────────────────────────────────────────────────────────────

function CategoryCard({
  cat,
  brandSlug,
  isSelected,
}: {
  cat: BrandCategory;
  brandSlug: string;
  isSelected?: boolean;
}) {
  const name = cat.name?.en ?? "";
  return (
    <Link
      href={isSelected ? `/brands/${brandSlug}` : `/brands/${brandSlug}/${cat.url}`}
      className={`group flex flex-col items-center bg-white border rounded-[7px] overflow-hidden hover:border-[#186737] hover:shadow-md hover:-translate-y-1 transition-all duration-200 ${isSelected ? "border-[#186737] shadow-md" : "border-slate-200"}`}
    >
      <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-3">
        {cat.image_url ? (
          <img
            src={cat.image_url}
            alt={name}
            loading="lazy"
            className="w-full h-[120px] object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-3xl">📦</span>
        )}
      </div>
      <p className="text-[12px] lg:text-[13px] w-full bg-white font-semibold text-black group-hover:text-[#186737] text-center leading-snug px-2 py-2.5 transition-colors duration-200 ">
        {name}
        {/* {cat.product_count > 0 && (
          <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
            {cat.product_count} products
          </span>
        )} */}
      </p>
    </Link>
  );
}

// ── Pagination Controls ────────────────────────────────────────────────────────

function PaginationBar({
  pagination,
  onPage,
}: {
  pagination: Pagination | undefined;
  onPage: (p: number) => void;
}) {
  if (!pagination || pagination.last_page <= 1) return null;
  const { current_page, last_page } = pagination;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= last_page; i++) {
    if (i === 1 || i === last_page || Math.abs(i - current_page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
      <button
        onClick={() => onPage(current_page - 1)}
        disabled={current_page === 1}
        className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center hover:border-[#186737] hover:text-[#186737] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className={`w-9 h-9 rounded-[7px] border text-sm font-semibold transition-colors ${
              p === current_page
                ? "bg-[#186737] text-white border-[#186737]"
                : "border-gray-200 hover:border-[#186737] hover:text-[#186737]"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPage(current_page + 1)}
        disabled={current_page === last_page}
        className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center hover:border-[#186737] hover:text-[#186737] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Main Feature ──────────────────────────────────────────────────────────────

export default function BrandDetailFeature({
  data,
  brandSlug,
  selectedCategoryUrl,
  categoryProductsData,
}: {
  data: BrandDetailData;
  brandSlug: string;
  selectedCategoryUrl?: string;
  categoryProductsData?: BrandCategoryProductsResponse;
}) {
  const {
    name,
    thumbnail,
    logo_url,
    desktop_banner,
    desktop_banner_alt_text,
    mobile_banner,
    mobile_banner_alt_text,
    seo_url: seo,
    categories = [],
    products: initialProducts = [],
    total_records,
    total_pages,
    current_page,
    per_page,
  } = data;

  console.log("BrandDetailFeature data:", data);

  const initProducts = categoryProductsData
    ? (categoryProductsData.data ?? []).map(mapBrandCatProduct)
    : initialProducts;
  const initPagination: Pagination = categoryProductsData
    ? normalizeCategoryPagination(categoryProductsData)
    : {
        total: total_records ?? initProducts.length,
        per_page: per_page ?? (initProducts.length || 20),
        current_page: current_page ?? 1,
        last_page: total_pages ?? 1,
      };

  const [products, setProducts] = useState<RawApiProduct[]>(initProducts);
  const [pagination, setPagination] = useState<Pagination>(initPagination);
  const [loadingPage, setLoadingPage] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCategoryUrl && productsRef.current) {
      const offset = 100; // Offset for sticky header
      const elementPosition = productsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "auto"
      });
    }
  }, [selectedCategoryUrl]);

  const selectedCategory = selectedCategoryUrl
    ? categories.find((c) => c.url === selectedCategoryUrl)
    : null;
  const selectedCategoryName = selectedCategory?.name?.en ?? selectedCategoryUrl ?? "";

  const getFirstString = (v?: string | string[] | null) => {
    if (!v) return undefined;
    return Array.isArray(v) ? v[0] : v;
  };

  const brandName = name?.en ?? "";
  const desktopBannerUrl = getFirstString(desktop_banner) ?? getFirstString(thumbnail?.en) ?? logo_url;
  const mobileBannerUrl = getFirstString(mobile_banner) ?? getFirstString(desktop_banner) ?? getFirstString(thumbnail?.en) ?? logo_url;

  const bannerAlt = getFirstString(desktop_banner_alt_text) ?? getFirstString(mobile_banner_alt_text) ?? brandName;

  const fetchPage = async (page: number) => {
    setLoadingPage(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      if (selectedCategoryUrl) {
        const res = await makeApiRequest<BrandCategoryProductsResponse>(
          apiUrls.BRAND_CATEGORY_PRODUCTS(brandSlug, selectedCategoryUrl),
          { params: { page } },
        );
        if (res?.data) {
          setProducts(res.data.map(mapBrandCatProduct));
          setPagination(normalizeCategoryPagination(res));
        }
      } else {
        const res = await makeApiRequest<BrandDetailResponse>(
          apiUrls.BRAND_BY_SLUG(brandSlug),
          { params: { page } },
        );
        if (res?.data?.products) {
          setProducts(res.data.products);
          setPagination({
            total: res.data.total_records ?? 0,
            per_page: res.data.per_page ?? 20,
            current_page: res.data.current_page ?? page,
            last_page: res.data.total_pages ?? 1,
          });
        }
      }
    } finally {
      setLoadingPage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <div className="global-container">
          <ol className="flex items-center h-10 gap-1 text-xs flex-wrap">
            <li>
              <Link
                href="/"
                className="text-gray-400 hover:text-[#186737] flex items-center gap-1 transition-colors"
              >
                <Home size={11} /> Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <Link
                href="/brands"
                className="text-gray-400 hover:text-[#186737] transition-colors"
              >
                Brands
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              {selectedCategoryName ? (
                <Link href={`/brands/${brandSlug}`} className="text-gray-400 hover:text-[#186737] transition-colors">
                  {brandName}
                </Link>
              ) : (
                <span className="text-[#186737] font-semibold">{brandName}</span>
              )}
            </li>
            {selectedCategoryName && (
              <li className="flex items-center">
                <ChevronRight size={12} className="mx-1 text-gray-300" />
                <span className="text-[#186737] font-semibold">{selectedCategoryName}</span>
              </li>
            )}
          </ol>
        </div>
      </nav>

      {/* Banner — desktop image on md+ screens, mobile image below */}
      {desktopBannerUrl && (
        <div className="w-full hidden md:block">
          <img
            src={desktopBannerUrl}
            alt={bannerAlt }
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      {mobileBannerUrl && (
        <div className="w-full block md:hidden">
          <img
            src={mobileBannerUrl }
            alt={bannerAlt}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Brand header */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container py-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {logo_url && (
                <img
                  src={logo_url}
                  alt={brandName}
                  className="h-12 w-auto object-contain"
                />
              )}
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
                {brandName}
              </h1>
            </div>
            {/* <div className="flex items-center gap-2 flex-wrap">
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#186737] border border-[#186737] rounded-[7px] px-4 py-2 hover:bg-[#186737] hover:text-white transition-colors"
                >
                  <Globe size={14} /> Visit Website
                </a>
              )}
            </div> */}
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-white mt-3">
          <div className="global-container py-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
              Browse Categories Under {brandName}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  brandSlug={brandSlug}
                  isSelected={cat.url === selectedCategoryUrl}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section ref={productsRef} className="mt-3" id="brand-products-section">
        <div className="global-container py-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
            {selectedCategoryName
              ? `${selectedCategoryName} by ${brandName}`
              : `Explore All Products Under ${brandName}`}
            {pagination?.total > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({pagination?.total} items)
              </span>
            )}
          </h2>

          {loadingPage ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-7 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-[7px] border border-gray-100 py-16 text-center">
              <p className="text-gray-400 text-sm">
                No products found for this brand.
              </p>
            </div>
          ) : (
            <>
              <div className={" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  2xl:grid-cols-6 4xl:grid-cols-6 gap-3"}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {/* <div className="flex sm:hidden gap-3 overflow-x-auto hide-scrollbar md:px-4 pb-2">
                {products.map((product) => (
                  <div key={product.id} className="shrink-0 w-[175px]">
                    <ProductCard product={product as any} />
                  </div>
                ))}
              </div> */}
            </>
          )}

          <PaginationBar pagination={pagination} onPage={fetchPage} />
        </div>
      </section>

      {/* SEO Content */}
      <SeoContent dataAPI={seo} />
    </div>
  );
}
