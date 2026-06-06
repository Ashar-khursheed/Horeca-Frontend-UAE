"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, ChevronLeft, Globe } from "lucide-react";
import ProductCard, { type RawApiProduct } from "@/components/product-card";
import SeoContent, { type SeoApiData } from "@/seo/seo-content";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { generateDynamicCSSProductCard } from "@/utils/dynamic-css";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BrandName   { en: string; ar?: string | null }
interface LocaleStr   { en?: string | null; ar?: string | null }
interface PopularTag  { popularTags: string; popularSlug: string }

interface SeoTranslation {
  title_tag:            string;
  meta_title:           string;
  meta_description:     string;
  og_title:             string;
  og_description:       string;
  og_image_url:         string | null;
  banner_image_url:     string | null;
  banner_image_alt_text:string | null;
  paragraph_1:          string | null;
  paragraph_2:          string | null;
  paragraph_3:          string | null;
  paragraph_4:          string | null;
  popular_tag_details:  PopularTag[] | null;
}

interface BrandCategory {
  id:            number;
  name:          BrandName;
  image:         string;
  url:           string;
  product_count: number;
}

interface Pagination {
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

export interface BrandDetailResponse {
  success: boolean;
  brand: {
    id:                      number;
    name:                    BrandName;
    thumbnail:               LocaleStr | null;
    logo:                    string;
    desktop_banner:          string[];
    desktop_banner_alt_text: string[];
    mobile_banner:           string[];
    website:                 string | null;
    is_featured:             boolean;
    slug:                    string;
  };
  seo: SeoApiData & {
    indexing:            boolean;
    current_translation: SeoTranslation;
  };
  categories:  BrandCategory[];
  products:    RawApiProduct[];
  pagination:  Pagination;
}

// ── Category Card ─────────────────────────────────────────────────────────────

function CategoryCard({ cat, brandSlug }: { cat: BrandCategory; brandSlug: string }) {
  const name = cat.name?.en ?? "";
  return (
    <Link
      href={`/${cat.url}?brand=${brandSlug}`}
      className="group flex flex-col items-center bg-white border border-slate-200 rounded-[7px] overflow-hidden hover:border-[#186737] hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-3">
        {cat.image ? (
          <img
            src={cat.image}
            alt={name}
            loading="lazy"
            className="w-full h-[120px] object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-3xl">📦</span>
        )}
      </div>
      <p className="text-[12px] lg:text-[13px] w-full bg-white font-semibold text-black group-hover:text-[#186737] text-center leading-snug px-2 py-2.5 transition-colors duration-200 line-clamp-2">
        {name}
        {cat.product_count > 0 && (
          <span className="block text-[10px] text-gray-400 font-normal mt-0.5">{cat.product_count} products</span>
        )}
      </p>
    </Link>
  );
}

// ── Pagination Controls ────────────────────────────────────────────────────────

function PaginationBar({
  pagination,
  onPage,
}: {
  pagination: Pagination;
  onPage: (p: number) => void;
}) {
  if (pagination.last_page <= 1) return null;
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
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
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
        )
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

export default function BrandDetailFeature({ data }: { data: BrandDetailResponse }) {
  const { brand, seo, categories, products: initialProducts, pagination: initialPagination } = data;

  const [products,   setProducts]   = useState<RawApiProduct[]>(initialProducts);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [loadingPage, setLoadingPage] = useState(false);

  const brandName  = brand.name?.en ?? "";
  const bannerUrl  = brand.desktop_banner?.[0] ?? brand.thumbnail?.en ?? brand.logo;
  const bannerAlt  = brand.desktop_banner_alt_text?.[0] ?? brandName;

  const fetchPage = async (page: number) => {
    setLoadingPage(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const res = await makeApiRequest<BrandDetailResponse>(
        apiUrls.BRAND_BY_SLUG(brand.slug),
        { params: { page } }
      );
      if (res?.products) {
        setProducts(res.products);
        setPagination(res.pagination);
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
              <Link href="/" className="text-gray-400 hover:text-[#186737] flex items-center gap-1 transition-colors">
                <Home size={11} /> Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <Link href="/brands" className="text-gray-400 hover:text-[#186737] transition-colors">Brands</Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <span className="text-[#186737] font-semibold">{brandName}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Desktop Banner */}
      {bannerUrl && (
        <div className="w-full">
          <img
            src={bannerUrl}
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
              {brand.logo && (
                <img src={brand.logo} alt={brandName} className="h-12 w-auto object-contain" />
              )}
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">{brandName}</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#186737] border border-[#186737] rounded-[7px] px-4 py-2 hover:bg-[#186737] hover:text-white transition-colors"
                >
                  <Globe size={14} /> Visit Website
                </a>
              )}
            </div>
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
                <CategoryCard key={cat.id} cat={cat} brandSlug={brand.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="mt-3">
        <div className="global-container py-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
            Explore All Products Under {brandName}
            {pagination.total > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({pagination.total} items)</span>
            )}
          </h2>

          {loadingPage ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden animate-pulse">
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
              <p className="text-gray-400 text-sm">No products found for this brand.</p>
            </div>
          ) : (
            <div className={generateDynamicCSSProductCard}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <PaginationBar pagination={pagination} onPage={fetchPage} />
        </div>
      </section>

      {/* SEO Content */}
      <SeoContent dataAPI={seo} />
    </div>
  );
}
