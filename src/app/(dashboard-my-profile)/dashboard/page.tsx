"use client";

import {
  MobileStatsSkeleton,
  MobileUserInfoSkeleton,
  RecentQuotesSkeleton,
  StatCardSkeleton,
  WelcomeBannerSkeleton,
} from "@/components/loading-sketlon/dashboard/skeletons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/slices/auth/authSlice";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Headphones,
  Heart,
  LogOut,
  Mail,
  Package,
  Settings,
  ShoppingBag,
  Star,
  TrendingUp,
  Truck,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Shared mock ───────────────────────────────────────────────────────────────

// ── Desktop data ──────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Orders",  value: "24",    sub: "+3 this month",   icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
  { label: "Active Quotes", value: "6",     sub: "2 pending reply", icon: FileText,    color: "bg-purple-50 text-purple-600" },
  { label: "Saved Items",   value: "12",    sub: "View wishlist",   icon: Heart,       color: "bg-pink-50 text-pink-600" },
  { label: "Total Spent",   value: "$48.2K",sub: "Lifetime value",  icon: TrendingUp,  color: "bg-emerald-50 text-emerald-600" },
];

const QUICK_ACTIONS = [
  { icon: ShoppingBag, label: "My Orders",             desc: "Track, manage, or reorder past purchases. View delivery status and history.",                   link: "/dashboard/orders",   linkLabel: "View Orders",      iconBg: "bg-blue-50",   iconColor: "text-blue-500" },
  // { icon: FileText,    label: "My Quotes",              desc: "Create or download self-generated quotations. Request custom pricing.",                         link: "/dashboard/quotes",   linkLabel: "View Quotes",      iconBg: "bg-purple-50", iconColor: "text-purple-500" },
  { icon: CreditCard,  label: "Payments & Invoices",    desc: "View invoices, credit terms, and make payments. Manage billing history.",                       link: "/dashboard/payments", linkLabel: "Payment Center",   iconBg: "bg-amber-50",  iconColor: "text-amber-500" },
  { icon: Settings,    label: "Account Settings",       desc: "Update business info, contacts, preferences and notification settings.",                        link: "/dashboard/my-profile",linkLabel: "Edit Profile",    iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  { icon: FolderOpen,  label: "Saved Docs & Compliance",desc: "Upload VAT/Trade Licenses, W9 or certificates. Manage business documents.",                    link: "/dashboard/documents",linkLabel: "Manage Documents", iconBg: "bg-teal-50",   iconColor: "text-teal-500" },
  { icon: Headphones,  label: "Support Center",         desc: "Need help? Open a ticket or contact support. Access our knowledge base.",                       link: "/dashboard/support",  linkLabel: "Get Support",      iconBg: "bg-rose-50",   iconColor: "text-rose-500" },
];

const RECENT_ORDERS = [
  { id: "#HS-10482", product: 'Turbo Air TBC-36SB-N6 36" Bottle Cooler',             date: "May 5, 2026",  amount: "$2,395.26", status: "Delivered",  statusIcon: CheckCircle, statusColor: "text-emerald-600 bg-emerald-50" },
  { id: "#HS-10441", product: 'True TUC-27F-HC 27" Undercounter Freezer',            date: "Apr 28, 2026", amount: "$2,099.00", status: "In Transit", statusIcon: Truck,       statusColor: "text-blue-600 bg-blue-50" },
  { id: "#HS-10398", product: 'FrostLine 27" Reach-In Refrigerator',                 date: "Apr 12, 2026", amount: "$1,529.00", status: "Processing", statusIcon: Clock,       statusColor: "text-amber-600 bg-amber-50" },
  { id: "#HS-10355", product: 'Medal Equipment 54" Merchandiser Refrigerator',        date: "Mar 30, 2026", amount: "$1,799.00", status: "Cancelled",  statusIcon: AlertCircle, statusColor: "text-red-600 bg-red-50" },
];

const RECENT_QUOTES = [
  { id: "Q-2841", items: 3, total: "$7,184.52", date: "May 6, 2026",  status: "Pending" },
  { id: "Q-2790", items: 1, total: "$2,395.26", date: "Apr 22, 2026", status: "Accepted" },
];

// ── Mobile nav items (ProfileDrawer style) ────────────────────────────────────
const MOBILE_NAV_ITEMS = [
  { name: "My Profile",          href: "/dashboard/my-profile", Icon: Settings },
  { name: "My Orders",           href: "/dashboard/orders",     Icon: ShoppingBag },
  { name: "My Quotes",           href: "/dashboard/quotes",     Icon: FileText },
  { name: "Payments & Invoices", href: "/dashboard/payments",   Icon: CreditCard },
  { name: "My Wishlist",         href: "/wishlist",             Icon: Heart },
  { name: "Saved Docs",          href: "/dashboard/documents",  Icon: FolderOpen },
  { name: "Support Center",      href: "/dashboard/support",    Icon: Headphones },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const pathname = usePathname();
  const dispatch    = useAppDispatch();
  const customer    = useAppSelector((s) => s.profile.customer);
  const loading     = useAppSelector((s) => s.profile.loading);
  const loggingOut  = useAppSelector((s) => s.auth.loading);
  const isMenuItemActive = (href: string) => {
    if (href === "/dashboard" || href === "/wishlist") return pathname === href;
    if (pathname.startsWith(href + "/")) return true;
    return pathname === href;
  };
  const initials = customer?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      {/* ══════════════════ MOBILE DESIGN (hidden on lg+) ══════════════════ */}
      <div className="lg:hidden min-h-screen bg-gray-50 overflow-y-auto">

        {/* ── Green gradient header ─────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#186737] via-green-600 to-green-700 px-6 pt-6 pb-8 rounded-b-[2rem] shadow-xl">

          {/* Avatar + user info */}
          {loading ? (
            <MobileUserInfoSkeleton />
          ) : (
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-[3px] border-white/40 flex items-center justify-center overflow-hidden shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white text-xl font-bold leading-tight">{customer?.name || "Guest"}</h2>
                <p className="text-white/90 text-sm mt-1 truncate">{customer?.email || ""}</p>
                <p className="text-white/80 text-xs mt-0.5">{customer?.country_code} {customer?.mobile_number || ""}</p>
              </div>
            </div>
          )}

          {/* Stats cards */}
          {loading ? (
            <MobileStatsSkeleton />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-[7px] p-3 text-center border border-white/20">
                <Package className="w-5 h-5 text-white mx-auto mb-1" />
                <p className="text-white text-lg font-bold">41</p>
                <p className="text-white/80 text-xs">Orders</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-[7px] p-3 text-center border border-white/20">
                <Heart className="w-5 h-5 text-white mx-auto mb-1" />
                <p className="text-white text-lg font-bold">1</p>
                <p className="text-white/80 text-xs">Wishlist</p>
              </div>
              {/* <div className="bg-white/10 backdrop-blur-sm rounded-[7px] p-3 text-center border border-white/20">
                <DollarSign className="w-5 h-5 text-white mx-auto mb-1" />
                <p className="text-white text-lg font-bold">$0.00</p>
                <p className="text-white/80 text-[10px] leading-tight">Net Terms Credit</p>
              </div> */}
            </div>
          )}
        </div>

        {/* ── Content cards (overlap header) ───────────────────────────── */}
        <div className="p-4 -mt-4 space-y-4">

          {/* Quick Actions */}
          <div className="bg-white rounded-[7px] p-4 shadow-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { Icon: ShoppingBag, label: "Orders",  href: "/dashboard/orders",  bg: "bg-blue-100",   color: "text-blue-600" },
                // { Icon: Tag,         label: "Coupons", href: "/dashboard/coupons", bg: "bg-orange-100", color: "text-orange-600" },
                { Icon: Heart,       label: "Wishlist",href: "/wishlist",           bg: "bg-red-100",    color: "text-red-600" },
              ].map(({ Icon, label, href, bg, color }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-2 p-3 rounded-[7px] hover:bg-gray-50 transition-all active:scale-95"
                >
                  <div className={`w-12 h-12 rounded-full ${bg} ${color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation menu */}
          <div className="bg-white rounded-[7px] shadow-md overflow-hidden">
            <div className="divide-y divide-gray-100">
              {MOBILE_NAV_ITEMS.map(({ name, href, Icon }) => {
                const active = isMenuItemActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`w-full flex items-center justify-between p-4 transition-all duration-200 ${
                      active ? "bg-green-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        className={active ? "text-[#186737]" : "text-gray-600"}
                      />
                      <span className={`text-sm font-medium ${active ? "text-[#186737]" : "text-gray-700"}`}>
                        {name}
                      </span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={active ? "text-[#186737]" : "text-gray-400"}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sign Out */}
          <button
            disabled={loggingOut}
            onClick={async () => {
              await dispatch(logoutUser());
              window.location.href = "/";
            }}
            className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-[7px] transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loggingOut
              ? <span className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              : <LogOut className="w-5 h-5" />
            }
            <span className="text-sm font-semibold">Sign Out</span>
          </button>

          {/* Footer */}
          <div className="text-center pb-2">
            <p className="text-xs text-gray-400">HorecaStore © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* ══════════════════ DESKTOP DESIGN (hidden on mobile) ══════════════════ */}
      <div className="hidden lg:block">
        <div className="p-4 sm:p-6 space-y-6 max-w-[1400px]">

          {/* ── Welcome Banner ────────────────────────────────────────────── */}
          {loading ? (
            <WelcomeBannerSkeleton />
          ) : (
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
                        Welcome back, {customer?.name}! 👋
                      </h1>
                      {customer?.business_detail?.business_name &&                       <p className="text-white/70 text-sm mt-0.5">Business Name: {customer?.business_detail?.business_name}</p>}

                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-[7px] px-4 py-2.5 backdrop-blur-sm">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      {/* <span className="text-white text-[10px] font-bold">@</span> */}
                      <Mail />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/60 font-medium">Email</p>
                      <p className="text-xs text-white font-normal ">{customer?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/15 flex items-center gap-5 flex-wrap text-xs text-white/75">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    Account Type: <strong className="text-white ml-1">{customer?.type}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    Member Since: <strong className="text-white ml-1">{customer?.updated_at}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    Phone No.: <strong className="text-white ml-1">{customer?.country_code} {customer?.mobile_number}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Stats Row ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
              : STATS.map(({ label, value, sub, icon: Icon, color }) => (
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

          {/* ── Quick Actions + Recent Quotes ─────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px]s gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#186737]" />
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">
                      {desc.split(". ").map((part, i, arr) => (
                        <span key={i}>
                          {part.includes("or") || part.includes("and") ? (
                            <>
                              {part.split(/(or|and)/g).map((word, j) => (
                                <span key={j} className={word === "or" || word === "and" ? "text-[#186737] font-medium" : ""}>
                                  {word}
                                </span>
                              ))}
                            </>
                          ) : (
                            part
                          )}
                          {i < arr.length - 1 ? ". " : ""}
                        </span>
                      ))}
                    </p>
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

            <div className="space-y-4 hidden">
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <FileText size={14} className="text-[#186737]" />
                    Recent Quotes
                  </h2>
                  <Link href="/dashboard/quotes" className="text-xs text-[#186737] font-semibold hover:underline">
                    View all
                  </Link>
                </div>
                {loading ? (
                  <RecentQuotesSkeleton />
                ) : (
                  <div className="divide-y divide-gray-50">
                    {RECENT_QUOTES.map((q) => (
                      <div key={q.id} className="px-5 py-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-900">{q.id}</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            q.status === "Accepted" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          }`}>
                            {q.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{q.items} item{q.items !== 1 ? "s" : ""} · {q.date}</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{q.total}</p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <button className="flex items-center gap-1 text-[11px] text-[#186737] font-semibold hover:underline">
                            <Eye size={11} /> View
                          </button>
                          <button className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 font-semibold hover:underline">
                            <Download size={11} /> Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-[#186737] to-[#22a34e] rounded-[7px] p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={15} className="fill-yellow-300 text-yellow-300" />
                  <span className="text-xs font-bold text-yellow-300">Business Tip</span>
                </div>
                <p className="text-sm font-bold leading-snug">Save 10% on bulk orders over $5,000</p>
                <p className="text-[11px] text-white/70 mt-1.5 leading-relaxed">
                  Contact our team to set up a business credit account and unlock better pricing.
                </p>
                <Link
                  href="/dashboard/quotes"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-[7px] transition-colors"
                >
                  Request Quote <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

       

        </div>
      </div>
    </>
  );
}

// ── Tiny helper ───────────────────────────────────────────────────────────────
const ChevronRightIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-gray-300 group-hover:text-[#186737] transition-colors">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
