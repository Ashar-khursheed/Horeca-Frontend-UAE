"use client";

import {
  ArrowRight,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Headphones,
  Mail,
  Package,
  Settings,
  ShoppingBag,
  TrendingUp,
  Truck,
} from "lucide-react";
import Link from "next/link";

// ── Mock data (UI only — no backend wired up yet) ──────────────────────────────
const VENDOR = {
  name: "Ahmed Al Mansoori",
  store_name: "Gulf Kitchen Equipment Co.",
  email: "ahmed@gulfkitchenequip.com",
  type: "Business",
  member_since: "Jan 2025",
};

const STATS = [
  { label: "Orders Received", value: "58",     sub: "+5 this month",     icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
  { label: "Pending Orders",  value: "4",       sub: "Needs action",      icon: Clock,       color: "bg-amber-50 text-amber-600" },
  { label: "Products Listed", value: "36",      sub: "2 out of stock",   icon: Package,     color: "bg-purple-50 text-purple-600" },
  { label: "Total Earnings",  value: "$82.4K",  sub: "Lifetime payouts", icon: TrendingUp,  color: "bg-emerald-50 text-emerald-600" },
];

const QUICK_ACTIONS = [
  { icon: ShoppingBag, label: "Orders",        desc: "View and fulfil orders placed for your products. Update shipping status.",     link: "/partner/dashboard/orders",    linkLabel: "View Orders",    iconBg: "bg-blue-50",   iconColor: "text-blue-500" },
  { icon: Package,     label: "Products",      desc: "Manage your product listings, pricing, and stock levels.",                     link: "/partner/dashboard/products",  linkLabel: "Manage Products",iconBg: "bg-purple-50", iconColor: "text-purple-500" },
  { icon: CreditCard,  label: "Payouts",       desc: "Track your earnings and view payout history from completed orders.",           link: "/partner/dashboard/payments",  linkLabel: "View Payouts",   iconBg: "bg-amber-50",  iconColor: "text-amber-500" },
  { icon: Settings,    label: "Store Profile", desc: "Update your store info, bank details, and account settings.",                  link: "/partner/dashboard/my-profile",linkLabel: "Edit Profile",   iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  { icon: Headphones,  label: "Support Center",desc: "Need help? Open a ticket or contact our vendor support team.",                 link: "/partner/dashboard/support",   linkLabel: "Get Support",    iconBg: "bg-rose-50",   iconColor: "text-rose-500" },
];

const SALES_TREND = [
  { label: "Feb", total: 32, active: 18 },
  { label: "Mar", total: 40, active: 22 },
  { label: "Apr", total: 38, active: 25 },
  { label: "May", total: 51, active: 30 },
  { label: "Jun", total: 60, active: 34 },
  { label: "Jul", total: 82, active: 45 },
];

const ORDER_MIX = [
  { label: "Delivered", value: 36, color: "#186737" },
  { label: "Shipped", value: 14, color: "#22a34e" },
  { label: "Pending", value: 4, color: "#f59e0b" },
  { label: "Cancelled", value: 4, color: "#e5e7eb" },
];

const WEEKLY_VOLUME = [
  { label: "Mon", orders: 9, returns: 1 },
  { label: "Tue", orders: 12, returns: 2 },
  { label: "Wed", orders: 8, returns: 1 },
  { label: "Thu", orders: 14, returns: 3 },
  { label: "Fri", orders: 16, returns: 2 },
  { label: "Sat", orders: 11, returns: 1 },
  { label: "Sun", orders: 7, returns: 0 },
];

const REPEAT_CUSTOMER_RATE = [
  { label: "Day 1", value: 100 },
  { label: "Day 7", value: 68 },
  { label: "Day 14", value: 52 },
  { label: "Day 30", value: 41 },
  { label: "Day 60", value: 33 },
  { label: "Day 90", value: 29 },
];

const RECENT_ORDERS = [
  { id: "#HS-11695", product: "PolarBox Series 6' x 8' Quick Ship Walk-In Cooler Box", date: "Jul 23, 2026", amount: "$6,300.00", status: "Pending",    statusIcon: Clock,       statusColor: "text-amber-600 bg-amber-50" },
  { id: "#HS-11642", product: "Turbo Air TBC-36SB-N6 36\" Bottle Cooler",              date: "Jul 18, 2026", amount: "$2,395.26", status: "Shipped",    statusIcon: Truck,       statusColor: "text-blue-600 bg-blue-50" },
  { id: "#HS-11588", product: "True TUC-27F-HC 27\" Undercounter Freezer",            date: "Jul 10, 2026", amount: "$2,099.00", status: "Delivered",  statusIcon: CheckCircle, statusColor: "text-emerald-600 bg-emerald-50" },
];

export default function PartnerDashboardPage() {
  const initials = VENDOR.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-full">
      {/* ── Welcome Banner ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[7px] bg-linear-to-br from-[#186737] via-[#1e7d42] to-[#22a34e] text-white shadow-lg">
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -right-4 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute top-6 right-24 w-16 h-16 rounded-full bg-white/5" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[7px] bg-white/20 border border-white/30 flex items-center justify-center shrink-0 backdrop-blur-sm">
                <span className="text-white font-black text-xl">{initials}</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Welcome back, {VENDOR.name}! 👋
                </h1>
                <p className="text-white/70 text-sm mt-0.5">Store: {VENDOR.store_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-[7px] px-4 py-2.5 backdrop-blur-sm">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Mail size={12} />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-medium">Email</p>
                <p className="text-xs text-white font-normal">{VENDOR.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 flex items-center gap-5 flex-wrap text-xs text-white/75">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              Account Type: <strong className="text-white ml-1">{VENDOR.type}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              Vendor Since: <strong className="text-white ml-1">{VENDOR.member_since}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, sub, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-[7px] ${color} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <TrendingUp size={14} className="text-emerald-500 mt-1" />
            </div>
            <p className="text-2xl font-black text-gray-900 leading-tight">{value}</p>
            <p className="text-xs font-semibold text-gray-600 mt-0.5">{label}</p>
            <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900 text-sm">Sales Growth</h2>
            <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#186737]" /> Total
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-300" /> Active listings
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">Total vs active orders — last 6 months</p>
          <SalesTrendChart data={SALES_TREND} />
        </div>

        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 sm:p-6">
          <h2 className="font-bold text-gray-900 text-sm">Order Status</h2>
          <p className="text-xs text-gray-400 mb-4">Breakdown by fulfilment status</p>
          <OrderMixDonut data={ORDER_MIX} />
        </div>
      </div>

      {/* ── Charts Row 2 ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900 text-sm">Weekly Order Volume</h2>
            <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#186737]" /> Orders
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-800" /> Returns
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">Orders vs returns — this week</p>
          <WeeklyVolumeChart data={WEEKLY_VOLUME} />
        </div>

        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col">
          <h2 className="font-bold text-gray-900 text-sm">Repeat Customer Rate</h2>
          <p className="text-xs text-gray-400 mb-4">% customers who reorder after first purchase</p>
          <RepeatRateChart data={REPEAT_CUSTOMER_RATE} />
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 rounded-[7px] px-3 py-2">
            <TrendingUp size={12} />
            41% still ordering at Day 30 — above the 30% category average.
          </div>
        </div>
      </div>

      {/* ── Quick Actions + Recent Orders ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#186737]" />
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_ACTIONS.map(({ icon: Icon, label, desc, link, linkLabel, iconBg, iconColor }) => (
              <div
                key={label}
                className="bg-white rounded-[7px] border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c3e6d4] transition-all duration-200 p-5 flex flex-col group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-[7px] ${iconBg} flex items-center justify-center`}>
                    <Icon size={18} className={iconColor} />
                  </div>
                  <ChevronRightIcon />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1.5">{label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{desc}</p>
                <Link
                  href={link}
                  className="mt-3.5 flex items-center gap-1 text-[#186737] text-xs font-bold hover:gap-2 transition-all duration-150"
                >
                  {linkLabel} <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ShoppingBag size={14} className="text-[#186737]" />
                Recent Orders
              </h2>
              <Link href="/partner/dashboard/orders" className="text-xs text-[#186737] font-semibold hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {RECENT_ORDERS.map((o) => (
                <div key={o.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-900">{o.id}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${o.statusColor}`}>
                      <o.statusIcon size={10} />
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{o.product}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[11px] text-gray-400">{o.date}</p>
                    <p className="text-sm font-bold text-gray-900">{o.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#186737] to-[#22a34e] rounded-[7px] p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={15} className="text-yellow-300" />
              <span className="text-xs font-bold text-yellow-300">Payout Tip</span>
            </div>
            <p className="text-sm font-bold leading-snug">Payouts are processed weekly</p>
            <p className="text-[11px] text-white/70 mt-1.5 leading-relaxed">
              Keep your bank details up to date in Store Profile to avoid payout delays.
            </p>
            <Link
              href="/partner/dashboard/my-profile"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-[7px] transition-colors"
            >
              Update Bank Details <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tiny helper ───────────────────────────────────────────────────────────────
const ChevronRightIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-gray-300 group-hover:text-[#186737] transition-colors">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Sales trend line chart (lightweight, dependency-free SVG) ──────────────────
function SalesTrendChart({ data }: { data: { label: string; total: number; active: number }[] }) {
  const width = 560;
  const height = 200;
  const padX = 8;
  const padY = 12;
  const max = Math.max(...data.map((d) => d.total)) * 1.15;

  const point = (i: number, v: number) => {
    const x = padX + (i / (data.length - 1)) * (width - padX * 2);
    const y = height - padY - (v / max) * (height - padY * 2);
    return [x, y];
  };

  const toPath = (key: "total" | "active") =>
    data.map((d, i) => point(i, d[key])).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  const totalPoints = data.map((d, i) => point(i, d.total));
  const areaPath = `${toPath("total")} L${totalPoints[totalPoints.length - 1][0]},${height - padY} L${totalPoints[0][0]},${height - padY} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48" preserveAspectRatio="none">
      <defs>
        <linearGradient id="salesArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#186737" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#186737" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={padX}
          x2={width - padX}
          y1={height - padY - f * (height - padY * 2)}
          y2={height - padY - f * (height - padY * 2)}
          stroke="#f3f4f6"
          strokeWidth="1"
        />
      ))}

      <path d={areaPath} fill="url(#salesArea)" />
      <path d={toPath("active")} fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d={toPath("total")} fill="none" stroke="#186737" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {totalPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#186737" stroke="white" strokeWidth="1.5" />
      ))}

      {data.map((d, i) => {
        const [x] = point(i, d.total);
        return (
          <text key={d.label} x={x} y={height - 1} fontSize="10" fill="#9ca3af" textAnchor="middle">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

// ── Order status donut chart (CSS conic-gradient, dependency-free) ─────────────
function OrderMixDonut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const stops = data
    .map((d) => {
      const start = (cumulative / total) * 360;
      cumulative += d.value;
      const end = (cumulative / total) * 360;
      return `${d.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-36 h-36 rounded-full flex items-center justify-center"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">
          <span className="text-xl font-black text-gray-900">{total}</span>
          <span className="text-[10px] text-gray-400 font-medium">Total Orders</span>
        </div>
      </div>

      <div className="w-full mt-5 space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              {d.label}
            </span>
            <span className="font-bold text-gray-900">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Weekly order volume bar chart (dependency-free SVG) ─────────────────────────
function WeeklyVolumeChart({ data }: { data: { label: string; orders: number; returns: number }[] }) {
  const width = 560;
  const height = 200;
  const padX = 8;
  const padY = 12;
  const max = Math.max(...data.map((d) => d.orders)) * 1.2;
  const chartH = height - padY * 2;
  const groupW = (width - padX * 2) / data.length;
  const barW = groupW * 0.28;

  const scaleY = (v: number) => (v / max) * chartH;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={padX}
          x2={width - padX}
          y1={height - padY - f * chartH}
          y2={height - padY - f * chartH}
          stroke="#f3f4f6"
          strokeWidth="1"
        />
      ))}

      {data.map((d, i) => {
        const groupX = padX + i * groupW + groupW / 2;
        const ordersH = scaleY(d.orders);
        const returnsH = scaleY(d.returns);
        return (
          <g key={d.label}>
            <rect
              x={groupX - barW - 3}
              y={height - padY - ordersH}
              width={barW}
              height={ordersH}
              rx="2"
              fill="#186737"
            />
            <rect
              x={groupX + 3}
              y={height - padY - returnsH}
              width={barW}
              height={Math.max(returnsH, 1.5)}
              rx="2"
              fill="#1f2937"
            />
            <text x={groupX} y={height - 1} fontSize="10" fill="#9ca3af" textAnchor="middle">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Repeat customer rate line chart (dependency-free SVG) ───────────────────────
function RepeatRateChart({ data }: { data: { label: string; value: number }[] }) {
  const width = 280;
  const height = 150;
  const padX = 6;
  const padY = 12;

  const point = (i: number, v: number) => {
    const x = padX + (i / (data.length - 1)) * (width - padX * 2);
    const y = height - padY - (v / 100) * (height - padY * 2);
    return [x, y];
  };

  const linePath = data.map((d, i) => point(i, d.value)).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const points = data.map((d, i) => point(i, d.value));
  const areaPath = `${linePath} L${points[points.length - 1][0]},${height - padY} L${points[0][0]},${height - padY} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="retentionArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#186737" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#186737" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#retentionArea)" />
      <path d={linePath} fill="none" stroke="#186737" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#186737" stroke="white" strokeWidth="1.5" />
      ))}
      {data.map((d, i) => {
        const [x] = point(i, d.value);
        return (
          <text key={d.label} x={x} y={height - 1} fontSize="8.5" fill="#9ca3af" textAnchor="middle">
            {d.label.replace("Day ", "D")}
          </text>
        );
      })}
    </svg>
  );
}
