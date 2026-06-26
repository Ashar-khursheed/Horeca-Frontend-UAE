// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, Search, ShoppingCart, Heart, User } from "lucide-react";

// const NAV_ITEMS = [
//   {
//     label: "Home",
//     href: "/",
//     icon: Home,
//   },
//   {
//     label: "Search",
//     href: "/search",
//     icon: Search,
//   },
//   {
//     label: "Cart",
//     href: "/cart",
//     icon: ShoppingCart,
//     isCart: true,
//   },
//   {
//     label: "Wishlist",
//     href: "/wishlist",
//     icon: Heart,
//   },
//   {
//     label: "Account",
//     href: "/account",
//     icon: User,
//   },
// ];

// interface BottomNavProps {
//   cartCount?: number;
//   wishlistCount?: number;
// }

// export default function BottomNav({
//   cartCount = 3,
//   wishlistCount = 4,
// }: BottomNavProps) {
//   const pathname = usePathname();

//   const isActive = (href: string) => {
//     if (href === "/") return pathname === "/";
//     return pathname.startsWith(href);
//   };
// // bottom: 32px;
// //     left: 19px;
// //     right: 21px;
// //     padding: 11px;
// //     backdrop-filter: blur(18px);
// //     background: #f7f7f7;
// //     border-radius: 50px;
//   return (
//     <>
//       {/*
//         ── Spacer — prevents page content from hiding behind nav
//         Only on mobile (lg se upar hide ho jayega)
//       */}
//       <div className="h-[72px] lg:hidden" />

//       {/*
//         ── Bottom Nav Bar
//         - Only mobile/tablet: hidden on lg+
//         - fixed bottom
//         - safe-area-inset for iPhone notch
//       */}
//       <nav
//         className="
//           fixed bottom-4 left-0 right-0 z-50
//           lg:hidden
//           bg-white border-t border-gray-200
//           flex items-stretch
//         "
//         style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
//       >
//         {NAV_ITEMS.map((item) => {
//           const active = isActive(item.href);
//           const Icon = item.icon;

//           /* ── Cart button — special elevated style ── */
//           if (item.isCart) {
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="flex-1 flex flex-col items-center justify-end pb-2 gap-1"
//               >
//                 {/* Elevated circle */}
//                 <div className="relative -mt-5">
//                   <div className="w-12 h-12 rounded-full bg-[#186737] flex items-center justify-center border-[3px] border-white shadow-lg shadow-green-800/20 active:scale-95 transition-transform">
//                     <ShoppingCart size={20} color="white" strokeWidth={2} />
//                   </div>
//                   {cartCount > 0 && (
//                     <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 border-[1.5px] border-white leading-none">
//                       {cartCount > 99 ? "99+" : cartCount}
//                     </span>
//                   )}
//                 </div>
//                 <span className="text-[10px] font-semibold text-[#186737] leading-none">
//                   Cart
//                 </span>
//               </Link>
//             );
//           }

//           /* ── Normal nav items ── */
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className="flex-1 flex flex-col items-center justify-center gap-1 pt-1 pb-2 relative"
//             >
//               {/* Active top indicator */}
//               {active && (
//                 <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#186737] rounded-b-full" />
//               )}

//               {/* Icon with wishlist badge */}
//               <div className="relative">
//                 <Icon
//                   size={22}
//                   strokeWidth={active ? 2.2 : 1.8}
//                   color={active ? "#186737" : "#9ca3af"}
//                   className="transition-colors duration-200"
//                 />
//                 {/* Wishlist badge */}
//                 {item.label === "Wishlist" && wishlistCount > 0 && (
//                   <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] bg-[#186737] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 border border-white leading-none">
//                     {wishlistCount}
//                   </span>
//                 )}
//               </div>

//               {/* Label */}
//               <span
//                 className={`text-[10px] leading-none font-medium transition-colors duration-200 ${
//                   active ? "text-[#186737] font-semibold" : "text-gray-400"
//                 }`}
//               >
//                 {item.label}
//               </span>
//             </Link>
//           );
//         })}
//       </nav>
//     </>
//   );
// }

"use client";

import { useAppSelector } from "@/store/hooks";
import { getCartId } from "@/utils/cartId";
import { Globe, Heart, Home, ShoppingCart, User, Languages,Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home",     href: "/",         icon: Home,         isCart: false },
  // { label: "Language", href: "/search",   icon: Languages,        isCart: false },
  { label: "Search", href: "/search",   icon: Search,        isCart: false },
  { label: "Cart",     href: `/cart/${getCartId()}`,     icon: ShoppingCart, isCart: true  },
  { label: "Wishlist", href: "/wishlist", icon: Heart,        isCart: false },
  { label: "Account",  href: "/account",  icon: User,         isCart: false },
];

export default function BottomNav() {
  const pathname   = usePathname();
  const isLoggedIn = useAppSelector((s) => !!s.profile.customer);

  // Cart count
  const cartCount = useAppSelector((s) =>
    isLoggedIn
      ? s.customerCounts.cart_quantity_sum
      : s.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  // Wishlist count
  const wishlistCount = useAppSelector((s) =>
    isLoggedIn
      ? s.customerCounts.wishlist_count
      : s.wishlist.guestItems.length
  );

  const accountHref = isLoggedIn ? "/dashboard" : "/login";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Spacer — content ke neeche nav overlap na ho */}
      {/* <div className="h-[88px] lg:hidden" /> */}

      {/* ── Fixed container ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* ── Frosted glass pill — iPhone style ── */}
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
            const href   = item.label === "Account" ? accountHref : item.href;
            const active = isActive(href);
            const Icon   = item.icon;

            /* ── Cart elevated bubble ── */
            if (item.isCart) {
              return (
                <Link
                  key={href}
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

                    {/* Cart badge */}
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

            /* ── Normal tab ── */
            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center justify-center gap-[5px] py-3 relative active:scale-95 transition-transform duration-100"
              >
                {/* Active dot above icon */}
                {active && (
                  <span
                    className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
                    style={{ background: "#186737" }}
                  />
                )}

                {/* Icon */}
                <div className="relative mt-1">
                  <Icon
                    size={23}
                    strokeWidth={active ? 2.3 : 1.7}
                    color={active ? "#186737" : "#9ca3af"}
                    style={{ transition: "all 0.18s ease" }}
                  />

                  {/* Wishlist count badge */}
                  {item.label === "Wishlist" && wishlistCount > 0 && (
                    <span
                      className="absolute -top-[6px] -right-[6px] min-w-[15px] h-[15px] bg-[#186737] text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none"
                      style={{ border: "1.5px solid white", padding: "0 2px" }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </div>

                {/* Label */}
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
    </>
  );
}
