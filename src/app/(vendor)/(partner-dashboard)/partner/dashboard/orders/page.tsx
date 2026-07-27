"use client";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  Package,
  Search,
  SlidersHorizontal,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface VendorOrder {
  id: number;
  order_number: string;
  product: string;
  customer: string;
  date: string;
  amount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

// ── Mock data (UI only — no backend wired up yet) ──────────────────────────────
const MOCK_ORDERS: VendorOrder[] = [
  { id: 1701, order_number: "11695", product: "PolarBox Series 6' x 8' Quick Ship Walk-In Cooler Box", customer: "Sims",         date: "Jul 23, 2026", amount: 6300.00, status: "Pending"    },
  { id: 1688, order_number: "11642", product: "Turbo Air TBC-36SB-N6 36\" Bottle Cooler",              customer: "David Cole",   date: "Jul 18, 2026", amount: 2395.26, status: "Shipped"    },
  { id: 1674, order_number: "11588", product: "True TUC-27F-HC 27\" Undercounter Freezer",             customer: "Maria Alonso", date: "Jul 10, 2026", amount: 2099.00, status: "Delivered"  },
  { id: 1660, order_number: "11540", product: "FrostLine 27\" Reach-In Refrigerator",                  customer: "James Otieno", date: "Jul 02, 2026", amount: 1529.00, status: "Processing" },
  { id: 1652, order_number: "11498", product: "Medal Equipment 54\" Merchandiser Refrigerator",         customer: "Lena Fischer", date: "Jun 26, 2026", amount: 1799.00, status: "Cancelled"  },
  { id: 1641, order_number: "11460", product: "PolarBox Series 6' x 8' Quick Ship Walk-In Cooler Box", customer: "Omar Saleh",   date: "Jun 20, 2026", amount: 6300.00, status: "Delivered"  },
];

const PER_PAGE = 10;

const STATUS_CONFIG: Record<VendorOrder["status"], { bg: string; text: string; Icon: React.ElementType }> = {
  Delivered:  { bg: "bg-emerald-50", text: "text-emerald-700", Icon: CheckCircle },
  Shipped:    { bg: "bg-blue-50",    text: "text-blue-700",    Icon: Truck },
  Processing: { bg: "bg-amber-50",   text: "text-amber-700",   Icon: Clock },
  Pending:    { bg: "bg-amber-50",   text: "text-amber-700",   Icon: Clock },
  Cancelled:  { bg: "bg-red-50",     text: "text-red-700",     Icon: AlertCircle },
};

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PartnerOrdersPage() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All Orders");
  const [fromDate, setFromDate]       = useState("");
  const [toDate, setToDate]           = useState("");
  const [page, setPage]               = useState(1);

  const filtered = useMemo(() => {
    return MOCK_ORDERS.filter((o) => {
      if (search && !o.order_number.includes(search) && !o.product.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "All Orders" && o.status !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilters = search || statusFilter !== "All Orders" || fromDate || toDate;

  const resetPagination = () => setPage(1);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Orders</span>
      </nav>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Orders placed by customers for your products. Update status as you fulfil each one.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Order ID, Product, Customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPagination(); }}
              className="w-full h-9 pl-8 pr-3 rounded-[7px] border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
            />
          </div>

          <div className="min-w-[155px]">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); resetPagination(); }}
              className="h-9 w-full rounded-[7px] border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#186737] bg-white px-2 cursor-pointer"
            >
              <option>All Orders</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
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
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> order{filtered.length !== 1 ? "s" : ""}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setStatusFilter("All Orders"); setFromDate(""); setToDate(""); resetPagination(); }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Order ID", "Product", "Customer", "Date", "Status", "Total", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Package size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No orders found</p>
                    <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                paged.map((order) => {
                  const sc = STATUS_CONFIG[order.status];
                  const { Icon: StatusIcon } = sc;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-[#186737]">#{order.order_number}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 max-w-[260px]">
                        <p className="truncate">{order.product}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{order.customer}</td>
                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{order.date}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                          <StatusIcon size={10} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                        ${fmt(order.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/partner/dashboard/orders/${order.id}`} className="flex items-center gap-1 text-xs font-semibold text-[#186737] hover:underline">
                          <Eye size={11} /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {paged.length === 0 ? (
            <div className="py-16 text-center">
              <Package size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-400">No orders found</p>
            </div>
          ) : (
            paged.map((order) => {
              const sc = STATUS_CONFIG[order.status];
              const { Icon: StatusIcon } = sc;
              return (
                <div key={order.id} className="px-4 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-[#186737]">#{order.order_number}</span>
                      <p className="text-[11px] text-gray-400 mt-0.5">{order.date}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                      <StatusIcon size={10} />
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1 line-clamp-1">{order.product}</p>
                  <p className="text-[11px] text-gray-400 mb-3">Customer: {order.customer}</p>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <p className="text-sm font-bold text-gray-900">${fmt(order.amount)}</p>
                    <Link href={`/partner/dashboard/orders/${order.id}`} className="flex items-center gap-1 text-xs font-semibold text-[#186737]">
                      <Eye size={11} /> View
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
