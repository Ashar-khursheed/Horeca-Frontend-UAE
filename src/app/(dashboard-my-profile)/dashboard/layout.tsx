"use client";

import { SidebarUserSkeleton } from "@/components/loading-sketlon/dashboard/skeletons";
import { useAppSelector } from "@/store/hooks";
import {
  ChevronRight,
  CreditCard,
  FileText,
  Headphones,
  Heart,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { label: "Overview",          href: "/dashboard",              icon: LayoutDashboard },
  { label: "My Orders",         href: "/dashboard/orders",       icon: ShoppingBag },
  { label: "My Quotes",         href: "/dashboard/quotes",       icon: FileText },
  { label: "Payments & Invoices", href: "/dashboard/payments",  icon: CreditCard },
  { label: "My Wishlist",       href: "/wishlist",               icon: Heart },
  { label: "Account Settings",  href: "/dashboard/my-profile",   icon: Settings },
  // { label: "Saved Docs",        href: "/dashboard/documents",    icon: FolderOpen },
  { label: "Support Center",    href: "/dashboard/support",      icon: Headphones },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const customer = useAppSelector((s) => s.profile.customer);
  const loading  = useAppSelector((s) => s.profile.loading);

  const name     = customer?.name ?? "Guest";
  const email    = customer?.email ?? "";
  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const business = customer?.business_detail?.business_name ?? null;

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`${
        mobile
          ? "flex flex-col h-full"
          : "hidden lg:flex flex-col h-screen "
      } w-64 bg-white border-r border-gray-100 shadow-sm`}
    >
      {/* Logo */}
      {/* <div className="px-5 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[7px] bg-[#186737] flex items-center justify-center">
            <span className="text-white font-black text-sm">H</span>
          </div>
          <span className="font-bold text-gray-900 text-sm">HorecaStore</span>
        </Link>
      </div> */}

      {/* User card */}
      <div className="px-4 py-4 border-b border-gray-100">
        {loading ? (
          <SidebarUserSkeleton />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#186737] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{name}</p>
              {business && (
                <p className="text-[11px] text-[#186737] font-medium truncate">{business}</p>
              )}
              <p className="text-[11px] text-gray-400 truncate">{email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
          Main Menu
        </p>
        <ul className="space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[7px] text-sm font-medium transition-all duration-150 group ${
                    active
                      ? "bg-[#186737] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={16}
                    className={active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}
                  />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={14} className="text-white/70" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      {/* <div className="px-3 py-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[7px] text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150">
          <LogOut size={16} />
          Logout
        </button>
      </div> */}
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-50/60 global-container">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
      

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
