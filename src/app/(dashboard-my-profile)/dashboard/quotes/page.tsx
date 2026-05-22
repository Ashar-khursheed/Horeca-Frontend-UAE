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
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Edit2,
  Eye,
  FileText,
  Link2,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Quote {
  id: string;
  name: string;
  total: number;
  createdDate: string;
  status: "Active" | "Expired" | "Pending" | "Cancelled";
  expiryDate: string;
  source: "Online" | "Sales Rep" | "Phone" | "Email";
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_QUOTES: Quote[] = [
  { id: "QT1192", name: "Arshad Test",                      total: 2082.73,  createdDate: "Apr 10, 2026", status: "Expired",   expiryDate: "Apr 17, 2026", source: "Online"    },
  { id: "QT1177", name: "Quote for Arshad Khan - 4/2/2026", total: 2396.84,  createdDate: "Apr 1, 2026",  status: "Expired",   expiryDate: "Apr 8, 2026",  source: "Online"    },
  { id: "QT1165", name: "Quote for Arshad Khan - 4/1/2026", total: 11510.00, createdDate: "Apr 1, 2026",  status: "Expired",   expiryDate: "Apr 8, 2026",  source: "Online"    },
  { id: "QT1164", name: "Quote for Arshad Khan - 4/1/2026", total: 11510.00, createdDate: "Apr 1, 2026",  status: "Expired",   expiryDate: "Apr 8, 2026",  source: "Sales Rep" },
  { id: "QT1163", name: "Quote for Arshad Khan - 4/1/2026", total: 11510.00, createdDate: "Apr 1, 2026",  status: "Expired",   expiryDate: "Apr 8, 2026",  source: "Online"    },
  { id: "QT1159", name: "Quote for Arshad Khan - 4/1/2026", total: 11510.00, createdDate: "Apr 1, 2026",  status: "Expired",   expiryDate: "Apr 8, 2026",  source: "Online"    },
  { id: "QT1157", name: "Quote for Arshad Khan - 4/1/2026", total: 203.69,   createdDate: "Apr 1, 2026",  status: "Expired",   expiryDate: "Apr 8, 2026",  source: "Phone"     },
  { id: "QT1156", name: "Quote for Arshad Khan - 4/1/2026", total: 2396.84,  createdDate: "Apr 1, 2026",  status: "Expired",   expiryDate: "Apr 8, 2026",  source: "Online"    },
  { id: "QT1155", name: "Quote for Arshad Khan - 4/1/2026", total: 2396.84,  createdDate: "Apr 1, 2026",  status: "Expired",   expiryDate: "Apr 8, 2026",  source: "Sales Rep" },
  { id: "QT1154", name: "Quote for Arshad Khan - 4/1/2026", total: 2396.84,  createdDate: "Apr 1, 2026",  status: "Expired",   expiryDate: "Apr 8, 2026",  source: "Online"    },
  { id: "QT1148", name: "Kitchen Equipment Bundle",          total: 8750.00,  createdDate: "Mar 25, 2026", status: "Active",    expiryDate: "May 25, 2026", source: "Online"    },
  { id: "QT1140", name: "Refrigeration Units Quote",         total: 15320.50, createdDate: "Mar 20, 2026", status: "Active",    expiryDate: "May 20, 2026", source: "Sales Rep" },
  { id: "QT1132", name: "Bar Equipment Package",             total: 4200.00,  createdDate: "Mar 15, 2026", status: "Pending",   expiryDate: "Apr 15, 2026", source: "Email"     },
  { id: "QT1125", name: "Prep Table & Storage Quote",        total: 6890.00,  createdDate: "Mar 10, 2026", status: "Active",    expiryDate: "May 10, 2026", source: "Online"    },
  { id: "QT1118", name: "Ice Machine Bulk Order",            total: 3450.00,  createdDate: "Mar 5, 2026",  status: "Cancelled", expiryDate: "Apr 5, 2026",  source: "Phone"     },
  { id: "QT1110", name: "Commercial Freezer Units",          total: 22100.00, createdDate: "Feb 28, 2026", status: "Expired",   expiryDate: "Mar 28, 2026", source: "Sales Rep" },
  { id: "QT1105", name: "Quote for Arshad Khan - 2/20/2026",total: 16569.54, createdDate: "Feb 20, 2026", status: "Expired",   expiryDate: "Feb 27, 2026", source: "Online"    },
  { id: "QT1098", name: "Dishwasher & Sanitizer Package",    total: 5640.00,  createdDate: "Feb 15, 2026", status: "Active",    expiryDate: "Apr 15, 2026", source: "Email"     },
  { id: "QT1089", name: "Full Kitchen Fit-Out Quote",        total: 48200.00, createdDate: "Feb 8, 2026",  status: "Pending",   expiryDate: "Mar 8, 2026",  source: "Sales Rep" },
  { id: "QT1075", name: "Serving & Display Equipment",       total: 3120.00,  createdDate: "Jan 30, 2026", status: "Expired",   expiryDate: "Feb 28, 2026", source: "Online"    },
];

const PER_PAGE = 10;

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Quote["status"], { bg: string; text: string; icon: React.ElementType }> = {
  Active:    { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
  Expired:   { bg: "bg-gray-100",   text: "text-gray-500",    icon: XCircle     },
  Pending:   { bg: "bg-amber-50",   text: "text-amber-700",   icon: Clock       },
  Cancelled: { bg: "bg-red-50",     text: "text-red-600",     icon: X           },
};

const SOURCE_CONFIG: Record<Quote["source"], { bg: string; text: string }> = {
  Online:    { bg: "bg-blue-50",    text: "text-blue-700"    },
  "Sales Rep":{ bg: "bg-purple-50", text: "text-purple-700"  },
  Phone:     { bg: "bg-amber-50",   text: "text-amber-700"   },
  Email:     { bg: "bg-teal-50",    text: "text-teal-700"    },
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

// ── Component ─────────────────────────────────────────────────────────────────
export default function MyQuotesPage() {
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [fromDate, setFromDate]         = useState("");
  const [toDate, setToDate]             = useState("");
  const [page, setPage]                 = useState(1);
  const [paginationKey, setPaginationKey] = useState(0);

  const filtered = useMemo(() => {
    return MOCK_QUOTES.filter((q) => {
      if (
        search &&
        !q.id.toLowerCase().includes(search.toLowerCase()) &&
        !q.name.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (statusFilter !== "All Status" && q.status !== statusFilter) return false;
      if (sourceFilter !== "All Sources" && q.source !== sourceFilter) return false;
      return true;
    });
  }, [search, statusFilter, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPagination = () => { setPage(1); setPaginationKey((k) => k + 1); };

  const hasFilters = search || statusFilter !== "All Status" || sourceFilter !== "All Sources" || fromDate || toDate;

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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sources */}
          <div className="min-w-[150px]">
            <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v); resetPagination(); }}>
              <SelectTrigger className="h-9 w-full rounded-[7px] border-gray-200 text-sm text-gray-700 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-white cursor-pointer">
                <div className="flex items-center gap-2 min-w-0">
                  <Link2 size={13} className="text-gray-400 shrink-0" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Sources">All Sources</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
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
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">{filtered.length}</span> quote
            {filtered.length !== 1 ? "s" : ""}
          </p>
          {hasFilters && (
            <button
              onClick={() => {
                setSearch(""); setStatusFilter("All Status"); setSourceFilter("All Sources");
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

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Quote No.", "Quote Name", "Total", "Created Date", "Status", "Expiry Date", "Source", "Actions"].map((h) => (
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
                    <p className="text-sm font-semibold text-gray-400">No quotes found</p>
                    <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                paged.map((quote) => {
                  const sc = STATUS_CONFIG[quote.status];
                  const src = SOURCE_CONFIG[quote.source];
                  const StatusIcon = sc.icon;
                  const isExpired = quote.status === "Expired" || quote.status === "Cancelled";
                  return (
                    <tr key={quote.id} className="hover:bg-gray-50/60 transition-colors group">

                      {/* Quote No */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-[#186737]">{quote.id}</span>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4 max-w-[240px]">
                        <p className="text-sm text-gray-700 font-medium truncate">{quote.name}</p>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                        {fmt(quote.total)}
                      </td>

                      {/* Created Date */}
                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {quote.createdDate}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                          <StatusIcon size={10} />
                          {quote.status}
                        </span>
                      </td>

                      {/* Expiry Date */}
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        <span className={isExpired ? "text-red-500 font-semibold" : "text-gray-500"}>
                          {quote.expiryDate}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${src.bg} ${src.text}`}>
                          <Link2 size={9} />
                          {quote.source}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <ActionBtn title="View" icon={Eye} />
                          <ActionBtn title="Edit" icon={Edit2} />
                          <ActionBtn title="Download" icon={Download} />
                          <ActionBtn title="Add to Cart" icon={ShoppingCart} green />
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
              <p className="text-sm font-semibold text-gray-400">No quotes found</p>
            </div>
          ) : (
            paged.map((quote) => {
              const sc = STATUS_CONFIG[quote.status];
              const src = SOURCE_CONFIG[quote.source];
              const StatusIcon = sc.icon;
              const isExpired = quote.status === "Expired" || quote.status === "Cancelled";
              return (
                <div key={quote.id} className="px-4 py-4">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-[#186737]">{quote.id}</span>
                      <p className="text-[11px] text-gray-400 mt-0.5">{quote.createdDate}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                      <StatusIcon size={10} />
                      {quote.status}
                    </span>
                  </div>

                  {/* Name */}
                  <p className="text-[13px] text-gray-700 font-medium mb-2 line-clamp-2">{quote.name}</p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${src.bg} ${src.text}`}>
                        <Link2 size={9} />
                        {quote.source}
                      </span>
                      <span className={`text-xs font-semibold ${isExpired ? "text-red-500" : "text-gray-500"}`}>
                        Expires {quote.expiryDate}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{fmt(quote.total)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
                    <MobileActionBtn label="View" icon={Eye} />
                    <MobileActionBtn label="Edit" icon={Edit2} />
                    <MobileActionBtn label="Download" icon={Download} />
                    <MobileActionBtn label="Add to Cart" icon={ShoppingCart} green />
                  </div>
                </div>
              );
            })
          )}
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

function MobileActionBtn({
  label,
  icon: Icon,
  green,
}: {
  label: string;
  icon: React.ElementType;
  green?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-[6px] transition-all ${
        green
          ? "bg-[#186737]/10 text-[#186737] hover:bg-[#186737] hover:text-white"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
      }`}
    >
      <Icon size={11} />
      {label}
    </button>
  );
}
