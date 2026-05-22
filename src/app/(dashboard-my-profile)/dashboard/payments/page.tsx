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
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Invoice {
  invoiceNo: string;
  invoiceDate: string;
  orderNo: string;
  poNo: string;
  dueDate: string;
  amount: number;
  paymentMethod: "Cheque" | "Credit Card" | "Bank Transfer" | "Cash";
  status: "Paid" | "Pending" | "Overdue";
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_INVOICES: Invoice[] = [
  { invoiceNo: "11431", invoiceDate: "May 22 2026", orderNo: "1436", poNo: "11431", dueDate: "May 22 2026", amount: 13487.33, paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11384", invoiceDate: "Apr 08 2026", orderNo: "1389", poNo: "11384", dueDate: "Apr 08 2026", amount: 108.25,   paymentMethod: "Credit Card",   status: "Paid"    },
  { invoiceNo: "11383", invoiceDate: "Apr 08 2026", orderNo: "1388", poNo: "11383", dueDate: "Apr 08 2026", amount: 108.25,   paymentMethod: "Credit Card",   status: "Paid"    },
  { invoiceNo: "11267", invoiceDate: "Feb 09 2026", orderNo: "1272", poNo: "11267", dueDate: "Feb 09 2026", amount: 15479.72, paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11255", invoiceDate: "Feb 04 2026", orderNo: "1260", poNo: "11255", dueDate: "Feb 04 2026", amount: 610.00,   paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11254", invoiceDate: "Feb 04 2026", orderNo: "1259", poNo: "11254", dueDate: "Feb 04 2026", amount: 42094.75, paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11253", invoiceDate: "Feb 04 2026", orderNo: "1258", poNo: "11253", dueDate: "Feb 04 2026", amount: 3335.10,  paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11252", invoiceDate: "Feb 04 2026", orderNo: "1257", poNo: "11252", dueDate: "Feb 04 2026", amount: 16173.06, paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11208", invoiceDate: "Jan 17 2026", orderNo: "1213", poNo: "11208", dueDate: "Jan 17 2026", amount: 8700.69,  paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11133", invoiceDate: "Dec 13 2025", orderNo: "1138", poNo: "11133", dueDate: "Dec 13 2025", amount: 29093.14, paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11120", invoiceDate: "Nov 28 2025", orderNo: "1120", poNo: "11120", dueDate: "Dec 05 2025", amount: 5640.00,  paymentMethod: "Bank Transfer", status: "Paid"    },
  { invoiceNo: "11115", invoiceDate: "Nov 20 2025", orderNo: "1115", poNo: "11115", dueDate: "Nov 27 2025", amount: 2396.84,  paymentMethod: "Credit Card",   status: "Paid"    },
  { invoiceNo: "11110", invoiceDate: "Nov 15 2025", orderNo: "1110", poNo: "11110", dueDate: "Nov 22 2025", amount: 7890.00,  paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11105", invoiceDate: "Nov 05 2025", orderNo: "1105", poNo: "11105", dueDate: "Nov 12 2025", amount: 1250.00,  paymentMethod: "Cash",          status: "Paid"    },
  { invoiceNo: "11098", invoiceDate: "Oct 22 2025", orderNo: "1098", poNo: "11098", dueDate: "Oct 29 2025", amount: 18430.50, paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11090", invoiceDate: "Oct 10 2025", orderNo: "1090", poNo: "11090", dueDate: "Oct 17 2025", amount: 3320.00,  paymentMethod: "Bank Transfer", status: "Paid"    },
  { invoiceNo: "11082", invoiceDate: "Sep 28 2025", orderNo: "1082", poNo: "11082", dueDate: "Oct 05 2025", amount: 9750.00,  paymentMethod: "Credit Card",   status: "Paid"    },
  { invoiceNo: "11075", invoiceDate: "Sep 15 2025", orderNo: "1075", poNo: "11075", dueDate: "Sep 22 2025", amount: 4560.00,  paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11068", invoiceDate: "Sep 02 2025", orderNo: "1068", poNo: "11068", dueDate: "Sep 09 2025", amount: 22100.00, paymentMethod: "Cheque",        status: "Paid"    },
  { invoiceNo: "11060", invoiceDate: "Aug 20 2025", orderNo: "1060", poNo: "11060", dueDate: "Aug 27 2025", amount: 6780.30,  paymentMethod: "Bank Transfer", status: "Paid"    },
  { invoiceNo: "11055", invoiceDate: "Aug 08 2025", orderNo: "1055", poNo: "11055", dueDate: "Aug 15 2025", amount: 1100.00,  paymentMethod: "Cash",          status: "Paid"    },
  { invoiceNo: "11040", invoiceDate: "Jul 25 2025", orderNo: "1040", poNo: "11040", dueDate: "Aug 01 2025", amount: 3450.00,  paymentMethod: "Cheque",        status: "Paid"    },
];

const PER_PAGE = 10;

// ── Config ────────────────────────────────────────────────────────────────────
const METHOD_CONFIG: Record<Invoice["paymentMethod"], { bg: string; text: string }> = {
  Cheque:          { bg: "bg-[#f0f9f4]", text: "text-[#186737]" },
  "Credit Card":   { bg: "bg-blue-50",   text: "text-blue-700"  },
  "Bank Transfer": { bg: "bg-purple-50", text: "text-purple-700"},
  Cash:            { bg: "bg-amber-50",  text: "text-amber-700" },
};

const STATUS_CONFIG: Record<Invoice["status"], { bg: string; text: string; icon: React.ElementType }> = {
  Paid:    { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle   },
  Pending: { bg: "bg-amber-50",  text: "text-amber-700",   icon: Clock         },
  Overdue: { bg: "bg-red-50",    text: "text-red-600",     icon: AlertTriangle },
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Derived stats ─────────────────────────────────────────────────────────────
const paidThisMonth = MOCK_INVOICES.filter(
  (i) => i.status === "Paid" && i.invoiceDate.includes("May 2026")
).reduce((s, i) => s + i.amount, 0);

const totalOutstanding = MOCK_INVOICES.filter((i) => i.status === "Pending").reduce(
  (s, i) => s + i.amount,
  0
);
const totalOverdue = MOCK_INVOICES.filter((i) => i.status === "Overdue").reduce(
  (s, i) => s + i.amount,
  0
);

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const [search, setSearch]               = useState("");
  const [methodFilter, setMethodFilter]   = useState("All Methods");
  const [statusFilter, setStatusFilter]   = useState("All Status");
  const [fromDate, setFromDate]           = useState("");
  const [toDate, setToDate]               = useState("");
  const [page, setPage]                   = useState(1);
  const [paginationKey, setPaginationKey] = useState(0);

  const filtered = useMemo(() => {
    return MOCK_INVOICES.filter((inv) => {
      if (
        search &&
        !inv.invoiceNo.includes(search) &&
        !inv.orderNo.includes(search) &&
        !inv.poNo.includes(search)
      )
        return false;
      if (methodFilter !== "All Methods" && inv.paymentMethod !== methodFilter) return false;
      if (statusFilter !== "All Status"  && inv.status !== statusFilter)         return false;
      return true;
    });
  }, [search, methodFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPagination = () => { setPage(1); setPaginationKey((k) => k + 1); };
  const hasFilters = search || methodFilter !== "All Methods" || statusFilter !== "All Status" || fromDate || toDate;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Payments &amp; Invoices</span>
      </nav>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments &amp; Invoices</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your invoices and payment history</p>
      </div>

      {/* ── Stats cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          label="Total Outstanding"
          value={`$${fmt(totalOutstanding)}`}
          valueClass="text-red-600"
          icon={AlertTriangle}
          iconBg="bg-red-50 border-red-200"
          iconColor="text-red-500"
        />
        <StatCard
          label="Paid This Month"
          value={`$${fmt(paidThisMonth)}`}
          valueClass="text-[#186737]"
          icon={CheckCircle}
          iconBg="bg-emerald-50 border-emerald-200"
          iconColor="text-emerald-500"
        />
        <StatCard
          label="Overdue"
          value={`$${fmt(totalOverdue)}`}
          valueClass="text-red-600"
          icon={Clock}
          iconBg="bg-red-50 border-red-200"
          iconColor="text-red-500"
        />
        <StatCard
          label="Total Invoices"
          value={String(MOCK_INVOICES.length)}
          valueClass="text-gray-900"
          icon={FileText}
          iconBg="bg-gray-100 border-gray-200"
          iconColor="text-gray-500"
        />
      </div>

      {/* ── Invoice History ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-gray-900">Invoice History</h2>

          {/* Inline filters */}
          <div className="flex flex-wrap gap-2">
            {/* Search */}
            <div className="relative min-w-[180px]">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Invoice / Order / PO..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPagination(); }}
                className="w-full h-8 pl-7 pr-3 rounded-[7px] border border-gray-200 text-xs text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
              />
            </div>

            {/* Method */}
            <div className="min-w-[140px]">
              <Select value={methodFilter} onValueChange={(v) => { setMethodFilter(v); resetPagination(); }}>
                <SelectTrigger className="h-8 w-full rounded-[7px] border-gray-200 text-xs text-gray-700 focus:border-[#186737] bg-white cursor-pointer">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CreditCard size={12} className="text-gray-400 shrink-0" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Methods">All Methods</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="min-w-[130px]">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetPagination(); }}>
                <SelectTrigger className="h-8 w-full rounded-[7px] border-gray-200 text-xs text-gray-700 focus:border-[#186737] bg-white cursor-pointer">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <SlidersHorizontal size={12} className="text-gray-400 shrink-0" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* From */}
            <div className="relative min-w-[120px]">
              <CalendarDays size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); resetPagination(); }}
                className="w-full h-8 pl-7 pr-2 rounded-[7px] border border-gray-200 text-[11px] text-gray-700 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-white cursor-pointer"
              />
            </div>

            {/* To */}
            <div className="relative min-w-[120px]">
              <CalendarDays size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); resetPagination(); }}
                className="w-full h-8 pl-7 pr-2 rounded-[7px] border border-gray-200 text-[11px] text-gray-700 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-white cursor-pointer"
              />
            </div>

            {hasFilters && (
              <button
                onClick={() => {
                  setSearch(""); setMethodFilter("All Methods"); setStatusFilter("All Status");
                  setFromDate(""); setToDate(""); resetPagination();
                }}
                className="h-8 px-3 flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 border border-gray-200 rounded-[7px] transition-colors"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Table container */}
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Invoice No", "Invoice Date", "Order No", "PO No", "Due Date", "Amount", "Payment Method", "Actions"].map((h) => (
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
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <FileText size={40} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-sm font-semibold text-gray-400">No invoices found</p>
                      <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  paged.map((inv) => {
                    const mc = METHOD_CONFIG[inv.paymentMethod];
                    const sc = STATUS_CONFIG[inv.status];
                    return (
                      <tr key={inv.invoiceNo} className="hover:bg-gray-50/60 transition-colors group">

                        {/* Invoice No */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-gray-800">{inv.invoiceNo}</span>
                        </td>

                        {/* Invoice Date */}
                        <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {inv.invoiceDate}
                        </td>

                        {/* Order No */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-[#186737] font-semibold">{inv.orderNo}</span>
                        </td>

                        {/* PO No */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-[#186737] font-semibold">{inv.poNo}</span>
                        </td>

                        {/* Due Date */}
                        <td className="px-5 py-4 text-sm whitespace-nowrap">
                          <span className={inv.status === "Overdue" ? "text-red-500 font-semibold" : "text-gray-500"}>
                            {inv.dueDate}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-gray-900">{fmt(inv.amount)}</span>
                        </td>

                        {/* Payment Method */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full ${mc.bg} ${mc.text}`}>
                            <CreditCard size={10} />
                            {inv.paymentMethod}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <ActionBtn title="View Invoice" icon={Eye} />
                            <ActionBtn title="Download" icon={Download} green />
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
                <FileText size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm font-semibold text-gray-400">No invoices found</p>
              </div>
            ) : (
              paged.map((inv) => {
                const mc = METHOD_CONFIG[inv.paymentMethod];
                const sc = STATUS_CONFIG[inv.status];
                const StatusIcon = sc.icon;
                return (
                  <div key={inv.invoiceNo} className="px-4 py-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-sm font-bold text-gray-800">#{inv.invoiceNo}</span>
                        <p className="text-[11px] text-gray-400 mt-0.5">{inv.invoiceDate}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                          <StatusIcon size={10} />
                          {inv.status}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${mc.bg} ${mc.text}`}>
                          {inv.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-3 gap-2 mb-3 bg-gray-50 rounded-[7px] p-3">
                      <MobileDetail label="Order No" value={inv.orderNo} accent />
                      <MobileDetail label="PO No"    value={inv.poNo}    accent />
                      <MobileDetail label="Due Date" value={inv.dueDate} />
                    </div>

                    {/* Amount + actions */}
                    <div className="flex items-center justify-between">
                      <p className="text-base font-black text-gray-900">{fmt(inv.amount)}</p>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-[6px] bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
                          <Eye size={11} /> View
                        </button>
                        <button className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-[6px] bg-[#186737]/10 text-[#186737] hover:bg-[#186737] hover:text-white transition-all">
                          <Download size={11} /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">{filtered.length}</span> invoice
              {filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <TrendingUp size={12} className="text-[#186737]" />
              Total:{" "}
              <span className="font-bold text-gray-900">
                ${fmt(filtered.reduce((s, i) => s + i.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
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

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  valueClass,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  valueClass: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className={`text-xl font-black mt-1 ${valueClass}`}>{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={17} className={iconColor} />
      </div>
    </div>
  );
}

function ActionBtn({
  title,
  icon: Icon,
  green,
}: {
  title: string;
  icon: React.ElementType;
  green?: boolean;
}) {
  return (
    <button
      title={title}
      className={`w-7 h-7 rounded-[6px] flex items-center justify-center transition-all border ${
        green
          ? "border-[#186737]/20 text-[#186737] hover:bg-[#186737] hover:text-white hover:border-[#186737]"
          : "border-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
      }`}
    >
      <Icon size={13} />
    </button>
  );
}

function MobileDetail({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 font-medium">{label}</p>
      <p className={`text-xs font-bold mt-0.5 ${accent ? "text-[#186737]" : "text-gray-700"}`}>{value}</p>
    </div>
  );
}
