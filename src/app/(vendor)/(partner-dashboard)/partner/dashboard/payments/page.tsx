"use client";

import {
  AlertTriangle,
  Banknote,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Search,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Payout {
  payoutNo: string;
  date: string;
  ordersCount: number;
  amount: number;
  method: "Bank Transfer" | "Cheque";
  status: "Paid" | "Pending" | "Failed";
}

// ── Mock data (UI only — no backend wired up yet) ──────────────────────────────
const MOCK_PAYOUTS: Payout[] = [
  { payoutNo: "PO-2041", date: "Jul 21, 2026", ordersCount: 6, amount: 13487.33, method: "Bank Transfer", status: "Paid"    },
  { payoutNo: "PO-2036", date: "Jul 14, 2026", ordersCount: 3, amount: 4108.25,  method: "Bank Transfer", status: "Paid"    },
  { payoutNo: "PO-2029", date: "Jul 07, 2026", ordersCount: 4, amount: 6479.72,  method: "Bank Transfer", status: "Paid"    },
  { payoutNo: "PO-2022", date: "Jun 30, 2026", ordersCount: 1, amount: 6300.00,  method: "Bank Transfer", status: "Pending" },
  { payoutNo: "PO-2015", date: "Jun 23, 2026", ordersCount: 2, amount: 2094.75,  method: "Cheque",        status: "Paid"    },
  { payoutNo: "PO-2008", date: "Jun 16, 2026", ordersCount: 5, amount: 9335.10,  method: "Bank Transfer", status: "Paid"    },
];

const METHOD_CONFIG: Record<Payout["method"], { bg: string; text: string }> = {
  "Bank Transfer": { bg: "bg-purple-50", text: "text-purple-700" },
  Cheque:          { bg: "bg-[#f0f9f4]", text: "text-[#186737]" },
};

const STATUS_CONFIG: Record<Payout["status"], { bg: string; text: string; icon: React.ElementType }> = {
  Paid:    { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle   },
  Pending: { bg: "bg-amber-50",   text: "text-amber-700",   icon: Clock         },
  Failed:  { bg: "bg-red-50",     text: "text-red-600",     icon: AlertTriangle },
};

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const totalPaid    = MOCK_PAYOUTS.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
const totalPending = MOCK_PAYOUTS.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);

export default function PartnerPayoutsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const filtered = useMemo(() => {
    return MOCK_PAYOUTS.filter((p) => {
      if (search && !p.payoutNo.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "All Status" && p.status !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter]);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Payouts</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
        <p className="text-sm text-gray-500 mt-1">Track your earnings and payout history from completed orders.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Paid Out" value={`$${fmt(totalPaid)}`} valueClass="text-[#186737]" icon={CheckCircle} iconBg="bg-emerald-50 border-emerald-200" iconColor="text-emerald-500" />
        <StatCard label="Pending Payout" value={`$${fmt(totalPending)}`} valueClass="text-amber-600" icon={Clock} iconBg="bg-amber-50 border-amber-200" iconColor="text-amber-500" />
        <StatCard label="Bank Account" value="•••• 4821" valueClass="text-gray-900" icon={Banknote} iconBg="bg-gray-100 border-gray-200" iconColor="text-gray-500" />
        <StatCard label="Total Payouts" value={String(MOCK_PAYOUTS.length)} valueClass="text-gray-900" icon={FileText} iconBg="bg-gray-100 border-gray-200" iconColor="text-gray-500" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-900">Payout History</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[180px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Payout No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-7 pr-3 rounded-[7px] border border-gray-200 text-xs text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 min-w-[130px] rounded-[7px] border border-gray-200 text-xs text-gray-700 outline-none focus:border-[#186737] bg-white px-2 cursor-pointer"
          >
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Payout No", "Date", "Orders", "Amount", "Method", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <FileText size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No payouts found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const mc = METHOD_CONFIG[p.method];
                  const sc = STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.payoutNo} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-5 py-4"><span className="text-sm font-bold text-gray-800">{p.payoutNo}</span></td>
                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{p.date}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{p.ordersCount} order{p.ordersCount !== 1 ? "s" : ""}</td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">${fmt(p.amount)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full ${mc.bg} ${mc.text}`}>
                          <Banknote size={10} />
                          {p.method}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                          <sc.icon size={10} />
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <ActionBtn title="View" icon={Eye} />
                          <ActionBtn title="Download Statement" icon={Download} green />
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
          {filtered.map((p) => {
            const mc = METHOD_CONFIG[p.method];
            const sc = STATUS_CONFIG[p.status];
            return (
              <div key={p.payoutNo} className="px-4 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-bold text-gray-800">{p.payoutNo}</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">{p.date} · {p.ordersCount} orders</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                    <sc.icon size={10} />
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${mc.bg} ${mc.text}`}>{p.method}</span>
                  <p className="text-sm font-black text-gray-900">${fmt(p.amount)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> payout{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <TrendingUp size={12} className="text-[#186737]" />
            Total: <span className="font-bold text-gray-900">${fmt(filtered.reduce((s, p) => s + p.amount, 0))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, value, valueClass, icon: Icon, iconBg, iconColor }: {
  label: string; value: string; valueClass: string; icon: React.ElementType; iconBg: string; iconColor: string;
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

function ActionBtn({ title, icon: Icon, green }: { title: string; icon: React.ElementType; green?: boolean }) {
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
