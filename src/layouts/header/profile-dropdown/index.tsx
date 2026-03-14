import {
  ChevronDown, Search, Heart, ShoppingCart,
  MapPin, User, Menu, X, ChevronRight,
  ShoppingBag, FileText, History, CreditCard,
  Receipt, FolderCheck, ShieldCheck, HelpCircle, LogOut,
} from "lucide-react";
import { useState } from "react";
// 
const menuItems = [
  { icon: User,        label: "My Profile" },
  { icon: ShoppingBag, label: "My Orders" },
  { icon: FileText,    label: "My Quotes" },
  { icon: History,     label: "Browsing History" },
  { icon: Heart,       label: "Saved Items (or Wishlist)" },
  { icon: Receipt,     label: "Net Payment Terms" },
  { icon: CreditCard,  label: "Payments & Invoices" },
  { icon: FolderCheck, label: "Documents & Compliance" },
  { icon: ShieldCheck, label: "Account Security" },
  { icon: HelpCircle,  label: "Help & Support" },
  { icon: LogOut,      label: "Sign Out", danger: true },
];

// ─── Profile Dropdown ────────────────────────────────────────────────────────

function ProfileDropdown({ show }: { show: boolean }) {
  // ✅ activeItem hataya
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  if (!show) return null;

  return (
    <div
      className="absolute  top-full right-0 bg-white rounded-2xl overflow-hidden z-50 mt-4 dropdown-enter"
      style={{
        width: 300,
        // ✅ mt-2 hataya, paddingTop se bridge banaya taake gap na ho
        // paddingTop: 8,
        // marginTop: -4,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(24,103,55,0.1)",
      }}
    >
      {/* Transparent bridge — gap cover karta hai */}
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
            <p className="text-white font-bold text-[17px] tracking-tight">Arshad Khan</p>
          </div>
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#186737] font-black text-lg"
            style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}
          >
            A
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="profile-scroll overflow-y-auto" style={{ maxHeight: 420 }}>
        {menuItems.map((item, i) => {
          const isHovered = hoveredItem === item.label;
          const isDanger  = item.danger === true;
          const Icon      = item.icon;

          // ✅ isActive logic hataya — sirf hover colors
          const iconColor    = isDanger ? (isHovered ? "#ef4444" : "#9ca3af") : isHovered ? "#186737" : "#9ca3af";
          const iconBg       = isDanger && isHovered ? "#fff1f1" : isHovered ? "#f0faf4" : "#f8f9fa";
          const labelColor   = isDanger ? (isHovered ? "#ef4444" : "#6b7280") : isHovered ? "#186737" : "#374151";
          const chevronColor = isDanger && isHovered ? "#ef4444" : isHovered ? "#186737" : "#d1d5db";

          return (
            <div
              key={item.label}
              className={`menu-item menu-row flex items-center justify-between px-4 py-[11px] cursor-pointer transition-all duration-150
                normal-row hover:bg-gray-50
                ${i < menuItems.length - 1 ? "border-b border-gray-50" : ""}
              `}
              style={{ animationDelay: `${i * 35}ms` }}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0 transition-all duration-150"
                  style={{ background: iconBg }}
                >
                  <Icon size={15} color={iconColor} strokeWidth={2} />
                </div>
                <span className="text-sm font-medium transition-colors duration-150" style={{ color: labelColor }}>
                  {item.label}
                </span>
              </div>
              <ChevronRight size={15} className="chevron-icon flex-shrink-0" color={chevronColor} strokeWidth={2.5} />
            </div>
          );
        })}
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