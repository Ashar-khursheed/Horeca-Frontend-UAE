"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import Pagination from "@/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CurrencySymbol } from "@/components/currency-symbol";
import { buildQuotePdfFilename } from "@/utils/quote-filename";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ApiQuote {
  id: number;
  quote_number: string;
  quote_name?: string | null;
  company_name: string | null;
  total_amount: string;
  status: string;
  expired_at: string;
  created_at: string;
  total_products: number;
  currency: {
    source_title: string;
    source_symbol: string;
    target_title: string;
    target_symbol: string;
    conversion_rate: number;
  };
  customer: {
    id: number;
    name: string;
    email: string;
    type: string;
    country_code: string;
    mobile_number: string;
  };
}

interface QuotesApiResponse {
  success: boolean;
  message: string;
  data: ApiQuote[];
  total_pages?: number;
  total_records?: number;
}

const PER_PAGE = 20;

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  Pending:   { bg: "bg-amber-50",   text: "text-amber-700",   icon: Clock       },
  Accepted:  { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
  Converted: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
  Rejected:  { bg: "bg-red-50",     text: "text-red-600",     icon: X           },
  Cancelled: { bg: "bg-red-50",     text: "text-red-600",     icon: X           },
  Expired:   { bg: "bg-gray-100",   text: "text-gray-500",    icon: XCircle     },
};
const DEFAULT_STATUS = { bg: "bg-gray-100", text: "text-gray-500", icon: FileText };

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (s: string) => {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// A quote whose expiry date has passed but whose status hasn't been
// updated by the backend yet (still "Pending") should still read as expired.
const isPastExpiry = (s: string) => {
  if (!s) return false;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
};
const EXPIRED_CONFIG = { bg: "bg-red-50", text: "text-red-600", icon: XCircle };

// ── Component ─────────────────────────────────────────────────────────────────
export default function MyQuotesPage() {
  const [quotes, setQuotes]         = useState<ApiQuote[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [fromDate, setFromDate]         = useState("");
  const [toDate, setToDate]             = useState("");
  const [page, setPage]                 = useState(1);
  const [paginationKey, setPaginationKey] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchQuotes = useCallback(
    async (opts: { page: number; search: string; status: string; from: string; to: string }) => {
      setLoading(true);
      setError(false);
      try {
        const params: Record<string, string | number> = {
          page: opts.page,
          length: PER_PAGE,
          sort_dir: "desc",
        };
        if (opts.search)                    params.global = opts.search;
        if (opts.status !== "All Status")   params.status = opts.status;
        if (opts.from)                      params.from_date = opts.from;
        if (opts.to)                        params.to_date = opts.to;

        const res = await makeApiRequest<QuotesApiResponse>(apiUrls.QUOTES, { params });

        if (res.success) {
          setQuotes(res.data ?? []);
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
    },
    []
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchQuotes({ page, search, status: statusFilter, from: fromDate, to: toDate });
    }, search ? 400 : 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, fromDate, toDate]);

  const resetPagination = () => { setPage(1); setPaginationKey((k) => k + 1); };

  const hasFilters = search || statusFilter !== "All Status" || fromDate || toDate;

  const handleDownload = async (quote: ApiQuote) => {
    setDownloadingId(quote.id);
    try {
      const blob = await makeApiRequest<Blob>(apiUrls.QUOTE_DOWNLOAD_PDF(quote.id), {
        responseType: "blob",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = buildQuotePdfFilename({
        quoteName: quote.quote_name,
        businessName: quote.company_name,
        quoteNumber: quote.quote_number,
        quoteId: quote.id,
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // non-fatal — leave the row as-is
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">My Quotes</span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Quotes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate, track, and manage your quotations
          </p>
        </div>
        <Link
          href="/create-quotation"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-bold hover:bg-[#145c30] transition-all shadow-sm shadow-[#186737]/20 whitespace-nowrap"
        >
          <Plus size={15} />
          Generate New Quote
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search quotes..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPagination(); }}
              className="w-full h-9 pl-8 pr-3 rounded-[7px] border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
            />
          </div>

          {/* Status */}
          <div className="min-w-[150px]">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetPagination(); }}>
              <SelectTrigger className="h-9 w-full rounded-[7px] border-gray-200 text-sm text-gray-700 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-white cursor-pointer">
                <div className="flex items-center gap-2 min-w-0">
                  <SlidersHorizontal size={13} className="text-gray-400 shrink-0" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* From date */}
          <div className="relative min-w-[130px]">
            <CalendarDays size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); resetPagination(); }}
              className="w-full h-9 pl-8 pr-2 rounded-[7px] border border-gray-200 text-xs text-gray-700 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all bg-white cursor-pointer"
            />
          </div>

          {/* To date */}
          <div className="relative min-w-[130px]">
            <CalendarDays size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); resetPagination(); }}
              className="w-full h-9 pl-8 pr-2 rounded-[7px] border border-gray-200 text-xs text-gray-700 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all bg-white cursor-pointer"
            />
          </div>
        </div>

        {/* Active filters row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            {loading
              ? "Loading quotes…"
              : <>Showing <span className="font-semibold text-gray-700">{total}</span> quote{total !== 1 ? "s" : ""}</>
            }
          </p>
          {hasFilters && (
            <button
              onClick={() => {
                setSearch(""); setStatusFilter("All Status");
                setFromDate(""); setToDate(""); resetPagination();
              }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              <X size={12} /> Clear filters
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
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-48" />
                </div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-20 hidden md:block" />
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20 hidden md:block" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-24 hidden lg:block" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-16 hidden md:block" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="py-16 text-center">
            <AlertCircle size={36} className="mx-auto text-red-200 mb-3" />
            <p className="text-sm font-semibold text-gray-400">Failed to load quotes</p>
            <button
              onClick={() => fetchQuotes({ page, search, status: statusFilter, from: fromDate, to: toDate })}
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
                  {["Quote No.", "Company", "Total", "Created Date", "Status", "Expiry Date", "Products", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quotes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <FileText size={40} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-sm font-semibold text-gray-400">No quotes found</p>
                      <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  quotes.map((quote) => {
                    const pastExpiry = quote.status === "Pending" && isPastExpiry(quote.expired_at);
                    const displayStatus = pastExpiry ? "Expired" : quote.status;
                    const sc = pastExpiry ? EXPIRED_CONFIG : (STATUS_CONFIG[quote.status] ?? DEFAULT_STATUS);
                    const StatusIcon = sc.icon;
                    const isExpired = quote.status === "Expired" || quote.status === "Cancelled" || pastExpiry;
                    const sym = quote.currency?.target_symbol ?? "$";

                    return (
                      <tr key={quote.id} className="hover:bg-gray-50/60 transition-colors group">

                        {/* Quote No */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-[#186737]">{quote.quote_number}</span>
                        </td>

                        {/* Company / Customer */}
                        <td className="px-5 py-4 max-w-[240px]">
                          <p className="text-sm text-gray-700 font-medium truncate">
                            {quote.company_name || quote.customer?.name || "—"}
                          </p>
                          {quote.company_name && quote.customer?.name && (
                            <p className="text-[11px] text-gray-400 truncate">{quote.customer.name}</p>
                          )}
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                          <CurrencySymbol currency={quote.currency?.target_symbol} fontsize="15px"/>{fmt(Number(quote.total_amount))}
                        </td>

                        {/* Created Date */}
                        <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {fmtDate(quote.created_at)}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                            <StatusIcon size={10} />
                            {displayStatus}
                          </span>
                        </td>

                        {/* Expiry Date */}
                        <td className="px-5 py-4 text-sm whitespace-nowrap">
                          <span className={isExpired ? "text-red-500 font-semibold" : "text-gray-500"}>
                            {fmtDate(quote.expired_at)}
                          </span>
                        </td>

                        {/* Products */}
                        <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {quote.total_products} item{quote.total_products !== 1 ? "s" : ""}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/dashboard/quotes/${quote.id}`}
                              title="View"
                              className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-all border border-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >
                              <Eye size={13} />
                            </Link>
                            {quote.status === "Pending" && (
                              <Link
                                href={`/create-quotation?id=${quote.id}`}
                                title="Edit"
                                className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-all border border-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                              >
                                <Pencil size={13} />
                              </Link>
                            )}
                            <button
                              title="Download"
                              onClick={() => handleDownload(quote)}
                              disabled={downloadingId === quote.id}
                              className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-all border border-[#186737]/20 text-[#186737] hover:bg-[#186737] hover:text-white disabled:opacity-50"
                            >
                              {downloadingId === quote.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Download size={13} />
                              )}
                            </button>
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
            {quotes.length === 0 ? (
              <div className="py-16 text-center">
                <FileText size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm font-semibold text-gray-400">No quotes found</p>
              </div>
            ) : (
              quotes.map((quote) => {
                const pastExpiry = quote.status === "Pending" && isPastExpiry(quote.expired_at);
                const displayStatus = pastExpiry ? "Expired" : quote.status;
                const sc = pastExpiry ? EXPIRED_CONFIG : (STATUS_CONFIG[quote.status] ?? DEFAULT_STATUS);
                const StatusIcon = sc.icon;
                const isExpired = quote.status === "Expired" || quote.status === "Cancelled" || pastExpiry;
                const sym = quote.currency?.target_symbol ?? "$";

                return (
                  <div key={quote.id} className="px-4 py-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-sm font-bold text-[#186737]">{quote.quote_number}</span>
                        <p className="text-[11px] text-gray-400 mt-0.5">{fmtDate(quote.created_at)}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                        <StatusIcon size={10} />
                        {displayStatus}
                      </span>
                    </div>

                    {/* Company / Customer */}
                    <p className="text-[13px] text-gray-700 font-medium mb-2 line-clamp-2">
                      {quote.company_name || quote.customer?.name || "—"}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold ${isExpired ? "text-red-500" : "text-gray-500"}`}>
                        Expires {fmtDate(quote.expired_at)}
                      </span>
                      <p className="text-sm font-bold text-gray-900">
                        {sym}{fmt(Number(quote.total_amount))}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
                      <Link
                        href={`/dashboard/quotes/${quote.id}`}
                        className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-[6px] bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        <Eye size={11} />
                        View
                      </Link>
                      {quote.status === "Pending" && (
                        <Link
                          href={`/create-quotation?id=${quote.id}`}
                          className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-[6px] bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                        >
                          <Pencil size={11} />
                          Edit
                        </Link>
                      )}
                      <button
                        onClick={() => handleDownload(quote)}
                        disabled={downloadingId === quote.id}
                        className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-[6px] bg-[#186737]/10 text-[#186737] hover:bg-[#186737] hover:text-white transition-all disabled:opacity-50"
                      >
                        {downloadingId === quote.id ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <Download size={11} />
                        )}
                        Download
                      </button>
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
