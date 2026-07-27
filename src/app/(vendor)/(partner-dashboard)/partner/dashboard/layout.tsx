"use client";

import Logo from "@/assets/logo.png";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Globe,
  Headphones,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ── Mock vendor (no backend yet — UI only) ─────────────────────────────────────
const MOCK_VENDOR = {
  name: "Arshad Khan",
  store_name: "Gulf Kitchen Equipment Co.",
  email: "arshad@arshad.com",
};

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  {
    label: "Overview",
    href: "/partner/dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    subtitle: "Vendor overview & performance",
  },
  {
    label: "Orders",
    href: "/partner/dashboard/orders",
    icon: ShoppingBag,
    title: "Orders",
    subtitle: "Manage and fulfil your orders",
  },
  {
    label: "Products",
    href: "/partner/dashboard/products",
    icon: Package,
    title: "Products",
    subtitle: "Manage your product listings & stock",
  },
  {
    label: "Payouts",
    href: "/partner/dashboard/payments",
    icon: CreditCard,
    title: "Payouts",
    subtitle: "Track earnings & payout history",
  },
  {
    label: "Store Profile",
    href: "/partner/dashboard/my-profile",
    icon: Settings,
    title: "Store Profile",
    subtitle: "Update your store info & settings",
  },
  {
    label: "Support Center",
    href: "/partner/dashboard/support",
    icon: Headphones,
    title: "Support Center",
    subtitle: "Get help from our vendor support team",
  },
];

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-500">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="font-semibold text-emerald-600">Live</span>
      <span className="text-gray-300">|</span>
      <span className="tabular-nums">
        {now ? now.toLocaleTimeString("en-US") : "--:--:--"}
      </span>
    </span>
  );
}

function VisitWebsiteButton({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className={`relative flex items-center gap-1.5 rounded-full bg-[#186737] text-white font-bold shadow-sm hover:bg-[#155c2f] transition-colors ${
        compact ? "w-9 h-9 justify-center" : "pl-3.5 pr-4 py-2 text-xs"
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-[#186737] animate-ping opacity-40 pointer-events-none" />
      <Globe size={compact ? 15 : 14} className="relative z-10" />
      {!compact && <span className="relative z-10">Visit Website</span>}
    </Link>
  );
}

export default function PartnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = MOCK_VENDOR.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const isActive = (href: string) =>
    href === "/partner/dashboard" ? pathname === "/partner/dashboard" : pathname.startsWith(href);

  const activeNav = NAV.find((n) => isActive(n.href)) ?? NAV[0];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`${mobile ? "flex flex-col h-full w-64" : `hidden lg:flex flex-col h-full shrink-0 transition-all duration-300 ${collapsed ? "w-19" : "w-64"}`
      } bg-white border-r border-gray-100 shadow-sm`}
    >
      {/* Logo */}
      <div className="px-4 h-16 flex items-center justify-between border-b border-gray-100 shrink-0">
        {(mobile || !collapsed) ? (
          <Link href="/partner/dashboard">
            <Image src={Logo} alt="HorecaStore" className="w-28" priority />
          </Link>
        ) : (
          <Link
            href="/partner/dashboard"
            className="w-8 h-8 rounded-[7px] bg-[#186737] flex items-center justify-center mx-auto"
          >
            <span className="text-white font-black text-xs">H</span>
          </Link>
        )}
        {!mobile && !collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors shrink-0"
          >
            <ChevronLeft size={13} />
          </button>
        )}
      </div>

      {!mobile && collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors shrink-0"
        >
          <ChevronRight size={13} />
        </button>
      )}

      {/* Quick search */}
      {(mobile || !collapsed) && (
        <div className="px-4 pt-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Quick search..."
              autoComplete="off"
              className="w-full pl-8 pr-10 py-2 text-xs rounded-[7px] border border-gray-200 bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-[#186737]/20 focus:border-[#186737] transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-gray-400 bg-white border border-gray-200 rounded px-1 py-0.5">
              ⌘K
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {(mobile || !collapsed) && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
            Overview
          </p>
        )}
        <ul className="space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  title={!mobile && collapsed ? label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[7px] text-sm font-medium transition-all duration-150 group ${
                    !mobile && collapsed ? "justify-center" : ""
                  } ${
                    active
                      ? "bg-[#186737] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={16}
                    className={active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}
                  />
                  {(mobile || !collapsed) && <span className="flex-1">{label}</span>}
                  {(mobile || !collapsed) && active && <ChevronRight size={14} className="text-white/70" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Vendor card — pinned to bottom */}
      <div className="px-3 py-3 border-t border-gray-100 shrink-0">
        <div className={`flex items-center gap-2.5 rounded-[7px] px-2 py-2 ${!mobile && collapsed ? "justify-center" : "bg-gray-50/60"}`}>
          <div className="w-8 h-8 rounded-full bg-[#186737] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">{initials}</span>
          </div>
          {(mobile || !collapsed) && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">{MOCK_VENDOR.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{MOCK_VENDOR.email}</p>
              </div>
              <Link
                href="/"
                title="Sign out"
                className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors shrink-0"
              >
                <LogOut size={13} />
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/60 ">
      <Sidebar />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 lg:hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={15} />
          </button>
          <Sidebar mobile />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Mobile top bar */}
        <div className="lg:hidden h-14 flex items-center justify-between px-4 bg-white border-b border-gray-100 shrink-0">
          <Link href="/partner/dashboard">
            <Image src={Logo} alt="HorecaStore" className="w-24" priority />
          </Link>
          <div className="flex items-center gap-2">
            <VisitWebsiteButton compact />
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-between gap-4 h-16 px-6 bg-white border-b border-gray-100 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{activeNav.title}</h1>
            <p className="text-xs text-gray-400 leading-tight mt-0.5">{activeNav.subtitle}</p>
          </div>

          <div className="flex items-center gap-4">
            <VisitWebsiteButton />

            <LiveClock />

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                autoComplete="off"
                className="w-48 pl-8 pr-3 py-2 text-xs rounded-[7px] border border-gray-200 bg-gray-50/60 focus:outline-none focus:ring-2 focus:ring-[#186737]/20 focus:border-[#186737] transition-colors"
              />
            </div>

            <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
              <Bell size={16} />
              <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </button>

            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
              <HelpCircle size={16} />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#186737] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-[10px]">{initials}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700">{MOCK_VENDOR.name.split(" ")[0]}</span>
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-11 z-20 w-48 bg-white rounded-[7px] border border-gray-100 shadow-lg py-1.5">
                    <p className="px-3 py-1.5 text-[11px] text-gray-400 truncate border-b border-gray-50 mb-1">
                      {MOCK_VENDOR.email}
                    </p>
                    <Link
                      href="/partner/dashboard/my-profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      <Settings size={13} /> Store Profile
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={13} /> Sign out
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
