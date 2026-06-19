"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { Eye, History, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/pagination";
import ProductCard from "@/components/product-card";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ApiProduct {
  id: number;
  sku: string;
  name: { en: string } | string;
  images: { en: string[] } | string[];
  url: string;
  price: number;
  sale_price: number;
  currency: { symbol: string } | string;
}

interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  has_more_pages: boolean;
  visible_pages: number[];
  has_previous: boolean;
  has_next: boolean;
  previous_page: number | null;
  next_page: number | null;
}

interface ApiResponse {
  success: boolean;
  data: ApiProduct[];
  pagination?: Pagination;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const resolveName = (n: ApiProduct["name"]): string =>
  typeof n === "string" ? n : (n?.en ?? "");

const resolveImage = (imgs: ApiProduct["images"]): string => {
  if (Array.isArray(imgs)) return (imgs as string[])[0] ?? "";
  const typed = imgs as { en?: string[] };
  return typed?.en?.[0] ?? "";
};

const resolveSymbol = (c: ApiProduct["currency"]): string =>
  typeof c === "string" ? c : (c?.symbol ?? "");

const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-100" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-5 bg-gray-200 rounded w-2/5 mt-3" />
    </div>
  </div>
);

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
        <History size={36} className="text-gray-300" strokeWidth={1.5} />
      </div>
      <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#f0f9f4] border-2 border-white flex items-center justify-center shadow-sm">
        <Eye size={14} className="text-[#186737]" />
      </div>
    </div>
    <h2 className="text-lg font-bold text-gray-900 mb-2">
      No Browsing History
    </h2>
    <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-8">
      Products you view will appear here so you can quickly find them again.
    </p>
    <div className="bg-gray-50 rounded-[7px] border border-gray-100 p-4 mb-8 text-left max-w-xs w-full space-y-3">
      {[
        { step: "1", text: "Browse products on any category page" },
        { step: "2", text: "Click a product to view its details" },
        { step: "3", text: "Come back here to find it instantly" },
      ].map(({ step, text }) => (
        <div key={step} className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#186737] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            {step}
          </div>
          <span className="text-xs text-gray-600">{text}</span>
        </div>
      ))}
    </div>
    <Link
      href="/"
      className="inline-flex items-center gap-2 bg-[#186737] hover:bg-[#145c30] text-white font-semibold px-6 py-3 rounded-[7px] transition-colors text-sm"
    >
      <ShoppingBag size={16} />
      Start Browsing
    </Link>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BrowsingHistoryPage() {
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchProducts = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await makeApiRequest<ApiResponse>(
        apiUrls.GET_RECENT_PRODUCTS(pageNum),
      );
      setItems(res?.data ?? []);
      setPagination(res?.pagination ?? null);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [fetchProducts, page]);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-350">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[7px] bg-[#186737] flex items-center justify-center shadow-sm shrink-0">
          <History size={19} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            Browsing History
          </h1>
          {!loading && items.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {items.length} product{items.length !== 1 ? "s" : ""} recently
              viewed
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm min-h-100">
        {loading ? (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>

            {pagination && pagination.last_page > 1 && (
              <Pagination
                totalPages={pagination.last_page}
                initialPage={page}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
