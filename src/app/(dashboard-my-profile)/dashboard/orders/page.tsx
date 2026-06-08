"use client";

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
import { useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Order {
  id: string;
  date: string;
  status: "Delivered" | "In Transit" | "Processing" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  total: string;
  deliveryFrom: string;
  deliveryTo: string;
  product: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
  { id: "11384", date: "Apr 08 2026", status: "Cancelled",  paymentStatus: "Refunded", total: "$108.25",    deliveryFrom: "April 15",    deliveryTo: "April 17",    product: 'Turbo Air TBC-36SB-N6 36" Bottle Cooler' },
  { id: "11383", date: "Apr 08 2026", status: "Cancelled",  paymentStatus: "Refunded", total: "$108.25",    deliveryFrom: "April 15",    deliveryTo: "April 17",    product: 'True TUC-27F-HC 27" Undercounter Freezer' },
  { id: "11368", date: "Apr 01 2026", status: "Cancelled",  paymentStatus: "Refunded", total: "$11,510.00", deliveryFrom: "April 2",     deliveryTo: "April 10",    product: 'FrostLine 27" Reach-In Refrigerator' },
  { id: "11314", date: "Feb 20 2026", status: "Cancelled",  paymentStatus: "Refunded", total: "$16,569.54", deliveryFrom: "February 27", deliveryTo: "March 3",     product: 'Medal Equipment 54" Merchandiser Refrigerator' },
  { id: "11312", date: "Feb 20 2026", status: "Cancelled",  paymentStatus: "Refunded", total: "$16,569.54", deliveryFrom: "February 27", deliveryTo: "March 3",     product: 'Beverage Air MT49-1-W 52" Mega Top' },
  { id: "11311", date: "Feb 20 2026", status: "Cancelled",  paymentStatus: "Refunded", total: "$10,222.36", deliveryFrom: "February 27", deliveryTo: "March 3",     product: 'Atosa MBF8503GR 54" Reach-In Freezer' },
  { id: "11308", date: "Feb 20 2026", status: "Cancelled",  paymentStatus: "Refunded", total: "$241.40",    deliveryFrom: "February 27", deliveryTo: "March 3",     product: 'True TSSU-27-08 27" Sandwich/Salad Unit' },
  { id: "11271", date: "Feb 09 2026", status: "Cancelled",  paymentStatus: "Refunded", total: "$5,576.56",  deliveryFrom: "February 16", deliveryTo: "February 18", product: 'Nor-Lake NLRI74 74" Reach-In Refrigerator' },
  { id: "11267", date: "Feb 09 2026", status: "Cancelled",  paymentStatus: "Refunded", total: "$15,479.72", deliveryFrom: "February 16", deliveryTo: "February 18", product: 'Traulsen G22010 48" Reach-In Refrigerator' },
  { id: "11255", date: "Feb 04 2026", status: "Cancelled",  paymentStatus: "Refunded", total: "$610.00",    deliveryFrom: "February 11", deliveryTo: "February 13", product: 'Hoshizaki F-1501MWH 1,631 Lb Ice Machine' },
  { id: "11240", date: "Jan 28 2026", status: "Delivered",  paymentStatus: "Paid",     total: "$2,395.26",  deliveryFrom: "February 3",  deliveryTo: "February 5",  product: 'Victory VCLM-1-PT-HC 28" Merchandiser' },
  { id: "11235", date: "Jan 25 2026", status: "In Transit", paymentStatus: "Paid",     total: "$1,299.00",  deliveryFrom: "January 30",  deliveryTo: "February 1",  product: 'Manitowoc UDF0140A 26" Undercounter Ice Machine' },
  { id: "11220", date: "Jan 18 2026", status: "Processing", paymentStatus: "Pending",  total: "$4,520.00",  deliveryFrom: "January 25",  deliveryTo: "January 28",  product: 'Perlick HC24BS46L 24" Back Bar Cooler' },
  { id: "11200", date: "Jan 10 2026", status: "Delivered",  paymentStatus: "Paid",     total: "$899.00",    deliveryFrom: "January 15",  deliveryTo: "January 17",  product: 'Welbilt MD-5 Microdrum Soft-Serve Machine' },
  { id: "11185", date: "Jan 05 2026", status: "Delivered",  paymentStatus: "Paid",     total: "$3,150.00",  deliveryFrom: "January 10",  deliveryTo: "January 12",  product: 'Vollrath 40756 48" Sandwich/Salad Prep Table' },
  { id: "11170", date: "Dec 28 2025", status: "Delivered",  paymentStatus: "Paid",     total: "$6,200.00",  deliveryFrom: "January 4",   deliveryTo: "January 6",   product: 'Delfield GARR-44P 44" Refrigerated Prep Table' },
  { id: "11155", date: "Dec 20 2025", status: "In Transit", paymentStatus: "Paid",     total: "$780.00",    deliveryFrom: "December 27", deliveryTo: "December 29", product: 'Scotsman HID312A-1 Ice Dispenser' },
  { id: "11140", date: "Dec 15 2025", status: "Processing", paymentStatus: "Pending",  total: "$2,100.00",  deliveryFrom: "December 22", deliveryTo: "December 24", product: 'True TD-50-12 50" Draft Beer Cooler' },
  { id: "11125", date: "Dec 08 2025", status: "Delivered",  paymentStatus: "Paid",     total: "$4,875.00",  deliveryFrom: "December 15", deliveryTo: "December 17", product: 'Continental Refrigerator LF132SSS 132" Reach-In' },
  { id: "11110", date: "Dec 01 2025", status: "Cancelled",  paymentStatus: "Refunded", total: "$320.00",    deliveryFrom: "December 8",  deliveryTo: "December 10", product: 'Turbo Air M3F47-1-N 48" Three Section Freezer' },
  { id: "11095", date: "Nov 22 2025", status: "Delivered",  paymentStatus: "Paid",     total: "$1,640.00",  deliveryFrom: "November 29", deliveryTo: "December 1",  product: 'Beverage Air WD48HC-1-B 48" Wine Display' },
  { id: "11080", date: "Nov 15 2025", status: "Delivered",  paymentStatus: "Paid",     total: "$5,320.00",  deliveryFrom: "November 22", deliveryTo: "November 24", product: 'Hoshizaki KMD-410MAH 390 Lb Ice Machine' },
  { id: "11065", date: "Nov 08 2025", status: "Processing", paymentStatus: "Pending",  total: "$970.00",    deliveryFrom: "November 15", deliveryTo: "November 17", product: 'True TWT-27F-HC 27" Worktop Freezer' },
  { id: "11050", date: "Nov 01 2025", status: "Delivered",  paymentStatus: "Paid",     total: "$2,850.00",  deliveryFrom: "November 8",  deliveryTo: "November 10", product: 'Nor-Lake NSSF132WWG/0 132" Reach-In Freezer' },
];

const PER_PAGE = 10;

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Order["status"], { bg: string; text: string; icon: React.ElementType }> = {
  Delivered:   { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
  "In Transit":{ bg: "bg-blue-50",    text: "text-blue-700",   icon: Truck },
  Processing:  { bg: "bg-amber-50",   text: "text-amber-700",  icon: Clock },
  Cancelled:   { bg: "bg-red-50",     text: "text-red-700",    icon: AlertCircle },
};

const PAYMENT_CONFIG: Record<Order["paymentStatus"], { bg: string; text: string }> = {
  Paid:     { bg: "bg-emerald-50", text: "text-emerald-700" },
  Pending:  { bg: "bg-amber-50",   text: "text-amber-700" },
  Refunded: { bg: "bg-gray-100",   text: "text-gray-600" },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function MyOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Orders");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [paginationKey, setPaginationKey] = useState(0);

  const filtered = useMemo(() => {
    return MOCK_ORDERS.filter((o) => {
      if (
        search &&
        !o.id.includes(search) &&
        !o.product.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (statusFilter !== "All Orders" && o.status !== statusFilter) return false;
      if (paymentFilter !== "All" && o.paymentStatus !== paymentFilter) return false;
      return true;
    });
  }, [search, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPagination = () => {
    setPage(1);
    setPaginationKey((k) => k + 1);
  };

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

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Order ID, Invoice, Product..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPagination(); }}
              className="w-full h-9 pl-8 pr-3 rounded-[7px] border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
            />
          </div>

          {/* Status */}
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
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status */}
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

        {/* Active filters + count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> order{filtered.length !== 1 ? "s" : ""}
          </p>
          {(search || statusFilter !== "All Orders" || paymentFilter !== "All" || fromDate || toDate) && (
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

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Order ID", "Date", "Status", "Total", "Delivery", "Actions"].map((h) => (
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
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Package size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No orders found</p>
                    <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                paged.map((order) => {
                  const sc = STATUS_CONFIG[order.status];
                  const pc = PAYMENT_CONFIG[order.paymentStatus];
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors group">

                      {/* ID */}
                      <td className="px-5 py-4">
                        <div>
                          <span className="text-sm font-bold text-[#186737]">#{order.id}</span>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 max-w-[160px]">{order.product}</p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{order.date}</td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="space-y-1.5">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                            <StatusIcon size={10} />
                            {order.status}
                          </span>
                          {/* <div>
                            <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>
                              {order.paymentStatus}
                            </span>
                          </div> */}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">{order.total}</td>

                      {/* Delivery */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-[#186737] font-medium whitespace-nowrap">
                          <MapPin size={12} className="shrink-0" />
                          {order.deliveryFrom} – {order.deliveryTo}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 text-xs font-semibold whitespace-nowrap">
                          <button className="flex items-center gap-1 text-[#186737] hover:underline">
                            <MapPin size={11} /> Track
                          </button>
                          <Link href={`/dashboard/orders/cancel-order/${order.id}`} className="text-red-400 hover:text-red-600 hover:underline transition-colors">Cancel</Link>
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
              const pc = PAYMENT_CONFIG[order.paymentStatus];
              const StatusIcon = sc.icon;
              return (
                <div key={order.id} className="px-4 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-[#186737]">#{order.id}</span>
                      <p className="text-[11px] text-gray-400 mt-0.5">{order.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                        <StatusIcon size={10} />
                        {order.status}
                      </span>
                      <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <p className="text-[13px] text-gray-700 font-medium line-clamp-1 mb-2">{order.product}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-xs text-[#186737] font-medium">
                      <MapPin size={11} />
                      {order.deliveryFrom} – {order.deliveryTo}
                    </div>
                    <p className="text-sm font-bold text-gray-900">{order.total}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold border-t border-gray-50 pt-3">
                    <button className="flex items-center gap-1 text-[#186737]"><MapPin size={11} />Track</button>
                    <Link href={`/dashboard/orders/cancel-order/${order.id}`} className="text-red-400 hover:text-red-600">Cancel</Link>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600"><RotateCcw size={10} />Return</button>
                    <Link href={`/dashboard/orders/${order.id}`} className="flex items-center gap-1 text-[#186737] ml-auto"><Eye size={11} />View</Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="py-4">
          <Pagination
            key={paginationKey}
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
