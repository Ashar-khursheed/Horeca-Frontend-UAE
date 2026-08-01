"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import Pagination from "@/components/pagination";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Eye,
  Package,
  Pencil,
  Search,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface VendorPriceProduct {
  id: number;
  product_id: number;
  vendor: { id: number; name: string };
  vendor_sku: string;
  cost_per_item: string;
  shipping_charge: string;
  delivery_days: string;
  return_policy: string;
  inventory: number;
  in_stock: number;
  product: {
    id: number;
    sku: string;
    name: { en: string };
    image_urls: { en: string[] };
  };
}

interface VendorPriceApiResponse {
  success: boolean;
  message: string;
  data: VendorPriceProduct[];
  total_pages?: number;
  total_records?: number;
}

const PER_PAGE = 20;

const SORT_BY_OPTIONS = [
  { value: "", label: "--" },
  { value: "id", label: "ID" },
  { value: "cost_per_item", label: "Cost per Item" },
  { value: "inventory", label: "Inventory" },
  { value: "created_at", label: "Created At" },
];

const SORT_DIR_OPTIONS = [
  { value: "", label: "--" },
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Component ─────────────────────────────────────────────────────────────────
export default function PartnerProductsPage() {
  const [products, setProducts]     = useState<VendorPriceProduct[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);

  const [search, setSearch]               = useState("");
  const [sortBy, setSortBy]               = useState("");
  const [sortDir, setSortDir]             = useState("");
  const [page, setPage]                   = useState(1);
  const [paginationKey, setPaginationKey] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async (opts: { page: number; search: string; sortBy: string; sortDir: string }) => {
    setLoading(true);
    setError(false);
    try {
      const params: Record<string, string | number> = {
        page: opts.page,
        length: PER_PAGE,
      };
      if (opts.search) params.global = opts.search;
      if (opts.sortBy) params.sort_by = opts.sortBy;
      if (opts.sortDir) params.sort_dir = opts.sortDir;

      const res = await makeApiRequest<VendorPriceApiResponse>(apiUrls.VENDOR_PRICE, { params });

      if (res.success) {
        setProducts(res.data ?? []);
        setTotalPages(res.total_pages ?? 1);
        setTotal(res.total_records ?? res.data?.length ?? 0);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts({ page, search, sortBy, sortDir });
    }, search ? 400 : 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, sortBy, sortDir]);

  const resetPagination = () => { setPage(1); setPaginationKey((k) => k + 1); };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Products</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your product listings, pricing, and stock levels.</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4 max-w-xs">
        <div>
          <p className="text-xs text-gray-400 font-medium">Total Products</p>
          <p className="text-xl font-black text-gray-900 mt-1">{loading ? "…" : total}</p>
        </div>
        <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
          <Package size={17} className="text-gray-500" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by product SKU, vendor SKU, product name or vendor name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPagination(); }}
              className="w-full h-9 pl-8 pr-3 rounded-[7px] border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); if (!e.target.value) setSortDir(""); resetPagination(); }}
            className="h-9 rounded-[7px] border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all bg-white px-2 cursor-pointer sm:w-44"
          >
            {SORT_BY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.value ? `Sort by: ${o.label}` : "Sort by"}</option>
            ))}
          </select>
          <select
            value={sortDir}
            onChange={(e) => { setSortDir(e.target.value); resetPagination(); }}
            disabled={!sortBy}
            className="h-9 rounded-[7px] border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all bg-white px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed sm:w-40"
          >
            {SORT_DIR_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            {loading
              ? "Loading products…"
              : <>Showing <span className="font-semibold text-gray-700">{total}</span> product{total !== 1 ? "s" : ""}</>
            }
          </p>
          {search && (
            <button
              onClick={() => { setSearch(""); resetPagination(); }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              <XCircle size={12} /> Clear search
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">

        {/* Loading skeleton rows */}
        {loading && (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-11 h-11 rounded-[7px] bg-gray-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-56" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
                </div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-24 hidden md:block" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-20 hidden md:block" />
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20 hidden md:block" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="py-16 text-center">
            <AlertCircle size={36} className="mx-auto text-red-200 mb-3" />
            <p className="text-sm font-semibold text-gray-400">Failed to load products</p>
            <button
              onClick={() => fetchProducts({ page, search, sortBy, sortDir })}
              className="mt-3 text-xs text-[#186737] hover:underline font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Desktop table */}
        {!loading && !error && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Product", "Vendor", "Cost / Item", "Inventory", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <Package size={40} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-sm font-semibold text-gray-400">No products found</p>
                      <p className="text-xs text-gray-300 mt-1">Try adjusting your search</p>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const image = p.product.image_urls?.en?.[0];
                    const inStock = p.in_stock === 1;
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3 max-w-[340px]">
                            <div className="w-11 h-11 rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                              {image ? (
                                <img src={image} alt={p.product.name.en} className="w-full h-full object-contain p-1" />
                              ) : (
                                <Package size={16} className="text-gray-300" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{p.product.name.en}</p>
                              <p className="text-[11px] text-gray-400 font-mono">{p.vendor_sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{p.vendor.name}</td>
                        <td className="px-5 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">${fmt(Number(p.cost_per_item))}</td>
                        <td className="px-5 py-4 text-sm whitespace-nowrap">
                          <span className={p.inventory === 0 ? "text-red-600 font-semibold" : "text-gray-700"}>{p.inventory} units</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                            {inStock ? <CheckCircle size={10} /> : <XCircle size={10} />}
                            {inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/partner/dashboard/products/${p.id}`}
                              className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#186737] transition-colors"
                            >
                              <Eye size={12} /> View
                            </Link>
                            <Link
                              href={`/partner/dashboard/products/${p.id}?edit=1`}
                              className="flex items-center gap-1 text-xs font-semibold text-[#186737] hover:underline"
                            >
                              <Pencil size={12} /> Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile cards */}
        {!loading && !error && (
          <div className="md:hidden divide-y divide-gray-100">
            {products.length === 0 ? (
              <div className="py-16 text-center">
                <Package size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm font-semibold text-gray-400">No products found</p>
              </div>
            ) : (
              products.map((p) => {
                const image = p.product.image_urls?.en?.[0];
                const inStock = p.in_stock === 1;
                return (
                  <div key={p.id} className="px-4 py-4">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                        {image ? (
                          <img src={image} alt={p.product.name.en} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Package size={18} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{p.product.name.en}</p>
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">{p.vendor_sku}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                            {inStock ? <CheckCircle size={9} /> : <XCircle size={9} />}
                            {inStock ? "In Stock" : "Out of Stock"}
                          </span>
                          <span className="text-[11px] text-gray-400">{p.inventory} units</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 border-t border-gray-50 pt-3">
                      <p className="text-sm font-bold text-gray-900">${fmt(Number(p.cost_per_item))}</p>
                      <p className="text-[11px] text-gray-400">{p.vendor.name}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-3 border-t border-gray-50 pt-3">
                      <Link
                        href={`/partner/dashboard/products/${p.id}`}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-500"
                      >
                        <Eye size={12} /> View
                      </Link>
                      <Link
                        href={`/partner/dashboard/products/${p.id}?edit=1`}
                        className="flex items-center gap-1 text-xs font-semibold text-[#186737]"
                      >
                        <Pencil size={12} /> Edit
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`py-4 transition-opacity duration-200 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
          <Pagination
            key={paginationKey}
            initialPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
            showFirstLast
            showPageInfo
          />
        </div>
      )}
    </div>
  );
}
