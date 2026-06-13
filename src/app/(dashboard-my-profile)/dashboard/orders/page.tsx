"use client";

import Pagination from "@/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { makeApiRequest } from "@/apis/axios-instance";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  MapPin,
  Package,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiProduct {
  name: string;
  sku: string;
  brand_name: string;
  images: string[];
  image_urls: string[];
}

interface ApiOrderProduct {
  id: number;
  quantity: number;
  unit_price: string;
  shipping_charge: number;
  status: string;
  product: ApiProduct;
}

interface ApiCustomerAddress {
  address: string;
  city: string;
  state: string | null;
  country: { name: string } | null;
  related_city?: { name: string } | null;
}

interface ApiOrder {
  id: number;
  order_number: string;
  status: string;
  total_amount: string;
  is_paid: number;
  paid_amount: string;
  payment_mode: string | null;
  total_products: number;
  created_at: string;
  customer_address: ApiCustomerAddress | null;
  order_products: ApiOrderProduct[];
}

interface OrdersApiResponse {
  success: boolean;
  message: string;
  data: ApiOrder[];
  total_pages?: number;
  total_records?: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

const STATUS_CONFIG: Record<string, { bg: string; text: string; Icon: React.ElementType }> = {
  Delivered:    { bg: "bg-emerald-50", text: "text-emerald-700", Icon: CheckCircle },
  "In Transit": { bg: "bg-blue-50",   text: "text-blue-700",   Icon: Truck },
  Shipped:      { bg: "bg-blue-50",   text: "text-blue-700",   Icon: Truck },
  Processing:   { bg: "bg-amber-50",  text: "text-amber-700",  Icon: Clock },
  Pending:      { bg: "bg-amber-50",  text: "text-amber-700",  Icon: Clock },
  Cancelled:    { bg: "bg-red-50",    text: "text-red-700",    Icon: AlertCircle },
};

const DEFAULT_STATUS = { bg: "bg-gray-100", text: "text-gray-600", Icon: Package };

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-US", {
    month: "short", day: "2-digit", year: "numeric",
  });
}

function formatAddress(addr: ApiCustomerAddress | null) {
  if (!addr) return null;
  const city = addr.related_city?.name || addr.city;
  return [city, addr.country?.name].filter(Boolean).join(", ");
}

function getPaymentBadge(order: ApiOrder) {
  if (order.is_paid === 1)
    return { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-700" };
  if (order.status === "Cancelled" && Number(order.paid_amount) > 0)
    return { label: "Refunded", bg: "bg-gray-100", text: "text-gray-600" };
  return { label: "Pending", bg: "bg-amber-50", text: "text-amber-700" };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MyOrdersPage() {
  const [orders, setOrders]       = useState<ApiOrder[]>([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All Orders");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [fromDate, setFromDate]         = useState("");
  const [toDate, setToDate]             = useState("");
  const [page, setPage]                 = useState(1);
  const [paginationKey, setPaginationKey] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchOrders = useCallback(
    async (opts: {
      page: number; search: string; status: string;
      payment: string; from: string; to: string;
    }) => {
      setLoading(true);
      setError(false);
      try {
        const params: Record<string, string | number> = {
          page: opts.page,
          length: PER_PAGE,
          sort_dir: "desc",
        };
        if (opts.search)                           params.global = opts.search;
        if (opts.status !== "All Orders")          params.status = opts.status;
        if (opts.payment !== "All")                params.payment_status = opts.payment;
        if (opts.from)                             params.from_date = opts.from;
        if (opts.to)                               params.to_date = opts.to;

        const res = await makeApiRequest<OrdersApiResponse>(
          "frontend/orders",
          { params }
        );

        if (res.success) {
          setOrders(res.data ?? []);
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

  // Debounce search; immediate for other filters
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchOrders({ page, search, status: statusFilter, payment: paymentFilter, from: fromDate, to: toDate });
    }, search ? 400 : 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, paymentFilter, fromDate, toDate]);

  const resetPagination = () => {
    setPage(1);
    setPaginationKey((k) => k + 1);
  };

  const hasFilters = search || statusFilter !== "All Orders" || paymentFilter !== "All" || fromDate || toDate;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">My Orders</span>
      </nav>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your order status, view invoices, request returns, or cancel orders — all in one place.
        </p>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">

          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Order ID, Product..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPagination(); }}
              className="w-full h-9 pl-8 pr-3 rounded-[7px] border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
            />
          </div>

          <div className="min-w-[155px]">
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); resetPagination(); }}>
              <SelectTrigger className="h-9 w-full rounded-[7px] border-gray-200 text-sm text-gray-700 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-white cursor-pointer">
                <div className="flex items-center gap-2 min-w-0">
                  <SlidersHorizontal size={13} className="text-gray-400 shrink-0" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Orders">All Orders</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[145px]">
            <Select value={paymentFilter} onValueChange={(val) => { setPaymentFilter(val); resetPagination(); }}>
              <SelectTrigger className="h-9 w-full rounded-[7px] border-gray-200 text-sm text-gray-700 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-white cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Payments</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative min-w-[130px]">
            <CalendarDays size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); resetPagination(); }}
              className="w-full h-9 pl-8 pr-2 rounded-[7px] border border-gray-200 text-xs text-gray-700 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all bg-white cursor-pointer"
            />
          </div>

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

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            {loading
              ? "Loading orders…"
              : <>Showing <span className="font-semibold text-gray-700">{total}</span> order{total !== 1 ? "s" : ""}</>
            }
          </p>
          {hasFilters && (
            <button
              onClick={() => {
                setSearch(""); setStatusFilter("All Orders"); setPaymentFilter("All");
                setFromDate(""); setToDate(""); resetPagination();
              }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">

        {/* Loading skeleton rows */}
        {loading && (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-48" />
                </div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-20 hidden md:block" />
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20 hidden md:block" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-16 hidden md:block" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-28 hidden lg:block" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-24 hidden md:block" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="py-16 text-center">
            <AlertCircle size={36} className="mx-auto text-red-200 mb-3" />
            <p className="text-sm font-semibold text-gray-400">Failed to load orders</p>
            <button
              onClick={() => fetchOrders({ page, search, status: statusFilter, payment: paymentFilter, from: fromDate, to: toDate })}
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
                  {["Order ID", "Date", "Status", "Items", "Total", "Address", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <Package size={40} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-sm font-semibold text-gray-400">No orders found</p>
                      <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const sc = STATUS_CONFIG[order.status] ?? DEFAULT_STATUS;
                    const { Icon: StatusIcon } = sc;
                    const pay = getPaymentBadge(order);
                    const firstProduct = order.order_products[0]?.product?.name;
                    const addr = formatAddress(order.customer_address);

                    return (
                      <tr key={order.id} className="hover:bg-gray-50/60 transition-colors group">

                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-[#186737]">#{order.order_number}</span>
                          {firstProduct && (
                            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 max-w-40">{firstProduct}</p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1.5">
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                              <StatusIcon size={10} />
                              {order.status}
                            </span>
                            <div>
                              <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${pay.bg} ${pay.text}`}>
                                {pay.label}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {order.total_products} item{order.total_products !== 1 ? "s" : ""}
                        </td>

                        <td className="px-5 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                          ${Number(order.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        <td className="px-5 py-4">
                          {addr ? (
                            <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                              <MapPin size={11} className="text-[#186737] shrink-0" />
                              {addr}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3 text-xs font-semibold whitespace-nowrap">
                            <Link href={`/dashboard/orders/cancel-order/${order.id}`} className="text-red-400 hover:text-red-600 hover:underline transition-colors">
                              Cancel
                            </Link>
                            <Link href={`/dashboard/orders/return-order/${order.id}`} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 hover:underline transition-colors">
                              <RotateCcw size={10} /> Return
                            </Link>
                            <Link href={`/dashboard/orders/${order.id}`} className="flex items-center gap-1 text-[#186737] hover:underline">
                              <Eye size={11} /> View
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
            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <Package size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm font-semibold text-gray-400">No orders found</p>
              </div>
            ) : (
              orders.map((order) => {
                const sc = STATUS_CONFIG[order.status] ?? DEFAULT_STATUS;
                const { Icon: StatusIcon } = sc;
                const pay = getPaymentBadge(order);
                const firstProduct = order.order_products[0]?.product?.name;
                const addr = formatAddress(order.customer_address);

                return (
                  <div key={order.id} className="px-4 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-sm font-bold text-[#186737]">#{order.order_number}</span>
                        <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                          <StatusIcon size={10} />
                          {order.status}
                        </span>
                        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${pay.bg} ${pay.text}`}>
                          {pay.label}
                        </span>
                      </div>
                    </div>

                    {firstProduct && (
                      <p className="text-[13px] text-gray-700 font-medium line-clamp-1 mb-2">{firstProduct}</p>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      {addr ? (
                        <div className="flex items-center gap-1 text-xs text-[#186737] font-medium">
                          <MapPin size={11} />
                          {addr}
                        </div>
                      ) : <span />}
                      <p className="text-sm font-bold text-gray-900">
                        ${Number(order.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold border-t border-gray-50 pt-3">
                      <Link href={`/dashboard/orders/cancel-order/${order.id}`} className="text-red-400 hover:text-red-600">Cancel</Link>
                      <Link href={`/dashboard/orders/return-order/${order.id}`} className="flex items-center gap-1 text-gray-400 hover:text-gray-600">
                        <RotateCcw size={10} /> Return
                      </Link>
                      <Link href={`/dashboard/orders/${order.id}`} className="flex items-center gap-1 text-[#186737] ml-auto">
                        <Eye size={11} /> View
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────── */}
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
