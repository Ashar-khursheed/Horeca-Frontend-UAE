"use client";

import { AppDispatch, RootState } from "@/store/store";
import { logoutUser } from "@/store/slices/auth/authSlice";
import {
  ChevronRight,
  CreditCard,
  FileText,
  FolderCheck,
  Heart,
  HelpCircle,
  History,
  LogOut,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const menuItems = [
  { icon: Settings,        label: "My Dashboard",             href: "/dashboard" },
  { icon: User,        label: "My Profile",             href: "/dashboard/my-profile" },
  { icon: ShoppingBag, label: "My Orders",              href: "/dashboard/orders" },
  { icon: FileText,    label: "My Quotes",              href: "/dashboard/quotes" },
  { icon: History,     label: "Browsing History",       href: "/dashboard/history" },
  { icon: Heart,       label: "Saved Items",            href: "/wishlist" },
  { icon: Receipt,     label: "Net Payment Terms",      href: "/dashboard/payment-terms" },
  { icon: CreditCard,  label: "Payments & Invoices",    href: "/dashboard/invoices" },
  { icon: FolderCheck, label: "Documents & Compliance", href: "/dashboard/documents" },
  { icon: ShieldCheck, label: "Account Security",       href: "/dashboard/security" },
  { icon: HelpCircle,  label: "Help & Support",         href: "/dashboard/support" },
];

function ProfileDropdown({ show }: { show: boolean }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const customer = useSelector((s: RootState) => s.profile.customer);
  const loggingOut = useSelector((s: RootState) => s.auth.loading);
 
  if (!show) return null;

  const displayName = customer?.name ?? "Guest";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className="absolute top-full right-0 bg-white rounded-[7px] overflow-hidden z-50 mt-4 dropdown-enter"
      style={{
        width: 300,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(24,103,55,0.1)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-2 bg-transparent" />

      {/* Header */}
      <div className="header-bg p-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/75 text-xs font-medium mb-0.5">Welcome back</p>
            <p className="text-white font-bold text-[17px] tracking-tight">{displayName}</p>
          </div>
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#186737] font-black text-lg"
            style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}
          >
            {initial}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="profile-scroll overflow-y-auto" style={{ maxHeight: 420 }}>
        {menuItems.map((item, i) => {
          const isHovered    = hoveredItem === item.label;
          const Icon         = item.icon;
          const iconColor    = isHovered ? "#186737" : "#9ca3af";
          const iconBg       = isHovered ? "#f0faf4" : "#f8f9fa";
          const labelColor   = isHovered ? "#186737" : "#374151";
          const chevronColor = isHovered ? "#186737" : "#d1d5db";

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`menu-item menu-row flex items-center justify-between px-4 py-[11px] cursor-pointer transition-all duration-150 normal-row hover:bg-gray-50 border-b border-gray-50`}
              style={{ animationDelay: `${i * 35}ms` }}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 transition-all duration-150"
                  style={{ background: iconBg }}
                >
                  <Icon size={15} color={iconColor} strokeWidth={2} />
                </div>
                <span className="text-sm font-medium transition-colors duration-150" style={{ color: labelColor }}>
                  {item.label}
                </span>
              </div>
              <ChevronRight size={15} className="chevron-icon shrink-0" color={chevronColor} strokeWidth={2.5} />
            </Link>
          );
        })}

        {/* Sign Out — button (not Link) */}
        <button
          onMouseEnter={() => setHoveredItem("Sign Out")}
          onMouseLeave={() => setHoveredItem(null)}
          disabled={loggingOut}
          onClick={async () => {
            await dispatch(logoutUser());
            window.location.href = "/";
          }}
          className="w-full flex items-center justify-between px-4 py-2.75 cursor-pointer transition-all duration-150 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 transition-all duration-150"
              style={{ background: hoveredItem === "Sign Out" ? "#fff1f1" : "#f8f9fa" }}
            >
              <LogOut size={15} color={hoveredItem === "Sign Out" ? "#ef4444" : "#9ca3af"} strokeWidth={2} />
            </div>
            <span
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: hoveredItem === "Sign Out" ? "#ef4444" : "#6b7280" }}
            >
              Sign Out
            </span>
            {loggingOut && (
              <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          {!loggingOut && (
            <ChevronRight
              size={15}
              className="chevron-icon shrink-0"
              color={hoveredItem === "Sign Out" ? "#ef4444" : "#d1d5db"}
              strokeWidth={2.5}
            />
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[10px] text-gray-300 font-medium">HorecaStore</span>
        <span className="text-[10px] text-gray-300">v2.4.1</span>
      </div>
    </div>
  );
}

export default ProfileDropdown;
