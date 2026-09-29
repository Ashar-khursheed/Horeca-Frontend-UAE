"use client";

import HeaderCountrySelect from "@/layouts/header/country-select";
import { useAppSelector } from "@/store/hooks";
import { useCartId } from "@/utils/cartId";
import { useLocationData } from "@/utils/locationStorage";
import { Globe, Heart, Home, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home, isCart: false },
  { label: "Country", href: "", icon: Globe, isCart: false, isCountry: true },
  { label: "Cart", href: "/cart", icon: ShoppingCart, isCart: true },
  { label: "Wishlist", href: "/wishlist", icon: Heart, isCart: false },
  { label: "Account", href: "/account", icon: User, isCart: false },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isLoggedIn = useAppSelector((s) => !!s.profile.customer);
  const cartId = useCartId();
  const location = useLocationData();
  const [countryOpen, setCountryOpen] = useState(false);

  const cartCount = useAppSelector((s) =>
    isLoggedIn
      ? s.customerCounts.cart_quantity_sum
      : s.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const wishlistCount = useAppSelector((s) =>
    isLoggedIn
      ? s.customerCounts.wishlist_count
      : s.wishlist.guestItems.length,
  );

  const accountHref = isLoggedIn ? "/dashboard" : "/login";
  const countryLabel = location?.country || "Country";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          className="mx-4 mb-4 rounded-[22px] flex items-stretch"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(24px) saturate(200%)",
            WebkitBackdropFilter: "blur(24px) saturate(200%)",
            border: "0.5px solid rgba(255,255,255,0.65)",
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const href =
              item.label === "Account"
                ? accountHref
                : item.isCart
                  ? (cartId ? `/cart/${cartId}` : item.href)
                  : item.href;
            const active = item.isCountry ? countryOpen : isActive(href);
            const Icon = item.icon;

            if (item.isCart) {
              return (
                <Link
                  key="cart"
                  href={href}
                  className="flex-1 flex flex-col items-center justify-end pb-2.5 gap-1"
                >
                  <div className="relative" style={{ marginTop: "-22px" }}>
                    <div
                      className="w-[54px] h-[54px] rounded-full flex items-center justify-center active:scale-95 transition-transform duration-150"
                      style={{
                        background: "#186737",
                        border: "3.5px solid rgba(255,255,255,0.95)",
                        boxShadow:
                          "0 4px 14px rgba(24,103,55,0.5), 0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <ShoppingCart size={22} color="white" strokeWidth={2} />
                    </div>
                    {cartCount > 0 && (
                      <span
                        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none"
                        style={{ border: "2px solid white", padding: "0 3px" }}
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-[#186737] leading-none">
                    Cart
                  </span>
                </Link>
              );
            }

            if (item.isCountry) {
              return (
                <button
                  key="country"
                  type="button"
                  onClick={() => setCountryOpen(true)}
                  className="flex-1 flex flex-col items-center justify-center gap-[5px] py-3 relative active:scale-95 transition-transform duration-100"
                >
                  {active && (
                    <span
                      className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
                      style={{ background: "#186737" }}
                    />
                  )}
                  <div className="relative mt-1">
                    <Icon
                      size={23}
                      strokeWidth={active ? 2.3 : 1.7}
                      color={active ? "#186737" : "#9ca3af"}
                      style={{ transition: "all 0.18s ease" }}
                    />
                  </div>
                  <span
                    className="text-[10px] leading-none truncate max-w-[58px] px-0.5"
                    style={{
                      color: active ? "#186737" : "#9ca3af",
                      fontWeight: active ? 600 : 400,
                      transition: "all 0.18s ease",
                    }}
                  >
                    {countryLabel}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center justify-center gap-[5px] py-3 relative active:scale-95 transition-transform duration-100"
              >
                {active && (
                  <span
                    className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
                    style={{ background: "#186737" }}
                  />
                )}
                <div className="relative mt-1">
                  <Icon
                    size={23}
                    strokeWidth={active ? 2.3 : 1.7}
                    color={active ? "#186737" : "#9ca3af"}
                    style={{ transition: "all 0.18s ease" }}
                  />
                  {item.label === "Wishlist" && wishlistCount > 0 && (
                    <span
                      className="absolute -top-[6px] -right-[6px] min-w-[15px] h-[15px] bg-[#186737] text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none"
                      style={{ border: "1.5px solid white", padding: "0 2px" }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] leading-none"
                  style={{
                    color: active ? "#186737" : "#9ca3af",
                    fontWeight: active ? 600 : 400,
                    transition: "all 0.18s ease",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {countryOpen && (
        <div
          className="fixed inset-0 z-60 lg:hidden"
          onClick={() => setCountryOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute left-0 right-0 bottom-0 rounded-t-2xl bg-white px-4 pt-3 pb-6"
            style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200" />
            <p className="text-sm font-semibold text-gray-900 mb-3">Select country</p>
            <HeaderCountrySelect fullWidth defaultOpen />
          </div>
        </div>
      )}
    </>
  );
}
