"use client";

import Logo from "@/assets/logo.png";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Heart,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Search,
  ShoppingCart,
  User,
  User2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProfileDropdown from "../profile-dropdown";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/data";
import { clearProfile, CustomerProfile } from "@/store/slices/my-profile/profileSlice";
import { logoutUser } from "@/store/slices/auth/authSlice";
import { LocationData } from "@/store/slices/location/locationSlice";
import { apiUrls } from "@/apis/api-endpoint";
import { AppDispatch, RootState } from "@/store/store";
import type { SearchSuggestions } from "@/utils/types";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import FinancingModal from "@/components/financing-modal";
import SearchBar from "./SearchBar";

// ── Types ──────────────────────────────────────────────────────────────────────
interface CategoryName { en?: string; ar?: string; }
interface Category {
  id: number;
  name: CategoryName | string;
  slug: string;
  image_url?: string;
  children?: Category[];
}

const getName = (name: CategoryName | string): string => {
  if (typeof name === "string") return name;
  return name?.en ?? name?.ar ?? "";
};

// ══════════════════════════════════════════════════════════════════════════════
// MobileNavItem — recursive accordion row
// ══════════════════════════════════════════════════════════════════════════════
interface MobileNavItemProps {
  item: Category;
  depth?: number;
  onClose: () => void;
}

function MobileNavItem({ item, depth = 0, onClose }: MobileNavItemProps) {
  const [open, setOpen] = useState(false);
  const hasChildren = (item.children?.length ?? 0) > 0;
  const href = item.slug === "shop-by-brands" ? "/all-brands" : `/${item.slug}`;

  const rowPadLeft =
    depth === 0 ? "px-5" : depth === 1 ? "pl-7 pr-5" : "pl-10 pr-5";
  const labelSize =
    depth === 0
      ? "text-[15px] font-normal"
      : depth === 1
        ? "text-[13.5px] font-medium"
        : "text-[12.5px] font-normal";
  const labelColor = depth === 0 ? "text-gray-900" : "text-gray-700";

  if (!hasChildren) {
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`flex items-center ${rowPadLeft} py-[13px] border-b border-gray-100 transition-colors hover:bg-gray-50 active:bg-gray-100`}
      >
        <span className={`${labelSize} ${labelColor}`}>{getName(item.name)}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between ${rowPadLeft} py-[13px] border-b border-gray-100 transition-colors hover:bg-gray-50 active:bg-gray-100`}
      >
        <span className={`${labelSize} ${labelColor} text-left`}>{getName(item.name)}</span>
        {open ? (
          <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="bg-gray-50/70">
          {item.children!.map((child) => (
            <MobileNavItem key={child.id} item={child} depth={depth + 1} onClose={onClose} />
          ))}
          <Link
            href={href}
            onClick={onClose}
            className={`flex items-center ${depth === 0 ? "pl-7 pr-5" : "pl-10 pr-5"} py-[11px] border-b border-gray-100 hover:bg-gray-100`}
          >
            <span className="text-[12.5px] font-semibold text-[#186737]">
              View all {getName(item.name)}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NavigationStatic
// ══════════════════════════════════════════════════════════════════════════════
export default function NavigationStatic({
  navItemData = [],
  searchData,
}: {
  navItemData?: Category[];
  searchData?: SearchSuggestions | null;
}) {
  const reduxCustomer = useSelector((s: RootState) => s.profile.customer);
  const locationData = useSelector((s: RootState) => s.location.data);
  const profileLoading = useSelector((s: RootState) => s.profile.loading);
  const customer = reduxCustomer;
  const dispatch = useDispatch<AppDispatch>();
  const loggingOut = useSelector((s: RootState) => s.auth.loading);
  const router = useRouter();
  const pathname = usePathname();

  const [showProfile, setShowProfile] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowProfile(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (contactRef.current && !contactRef.current.contains(e.target as Node)) {
        setShowContact(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    modalOne: false,
  });

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleProfileEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowProfile(true);
  };
  const handleProfileLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setShowProfile(false), 120);
  };

 
    const handleModalOpen = () => {
      setIsModalOpen({ ...isModalOpen, modalOne: true });
    };
  
    const handleModalClose = () => {
      setIsModalOpen({ ...isModalOpen, modalOne: false });
    };


  return (
   <>
     <div className="w-full font-sans">
      {/* ── Main Nav ──────────────────────────────────────────────────────── */}
      <div className="md:bg-white bg-gray-50 nav-shadows sticky top-0 z-40">
        <div className="global-container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between gap-3 lg:gap-5 h-[68px]">

            {/* ── Logo ── */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image src={Logo} alt="HorecaStore" className="w-28" />
              </Link>
            </div>

            {/* ── Delivery Location (xl only) ── */}
            <button className="hidden xl:flex items-center gap-2 border border-gray-200 rounded-full px-3 h-10 hover:border-[#186737] transition-colors group flex-shrink-0 min-w-[170px]">
              <MapPin size={15} className="text-[#186737] flex-shrink-0" />
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-[10px] text-gray-400 leading-none">Deliver To</span>
                {locationData ? (
                  <span className="text-xs text-gray-700 font-semibold leading-tight truncate max-w-[110px]">
                    {locationData.city}, {locationData.countryCode}
                  </span>
                ) : (
                  <span className="w-20 h-3 bg-gray-200 animate-pulse rounded inline-block" />
                )}
              </div>
              <ChevronDown size={13} className="text-gray-400 flex-shrink-0 group-hover:text-[#186737] transition-colors ml-auto" />
            </button>

            {/* ── Search ── */}
            <SearchBar searchData={searchData} />

            {/* ── Phone / Contact Dropdown (xl only) ── */}
            <div className="relative hidden xl:block shrink-0" ref={contactRef}>
              <button
                onClick={() => setShowContact((v) => !v)}
                className={`flex items-center gap-2 border rounded-full px-3 h-10 transition-colors group ${showContact ? "border-[#186737]" : "border-gray-200 hover:border-[#186737]"}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#186737]/10 flex items-center justify-center shrink-0">
                  <Phone size={12} className="text-[#186737]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-gray-400 leading-none">Call Us</span>
                  <span className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-[#186737] transition-colors">+1 (866) 446-7322</span>
                </div>
                <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${showContact ? "rotate-180 text-[#186737]" : ""}`} />
              </button>

              {showContact && (
                <div className="absolute top-full right-0 mt-3 w-70 bg-white rounded-xl z-50 overflow-hidden"
                  style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.13), 0 4px 20px rgba(24,103,55,0.08)" }}
                >

                  {/* Top green bar */}
                  <div className="h-1 bg-linear-to-r from-[#186737] to-[#22a350]" />

                  {/* Specialist info */}
                  <div className="p-4 pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-200 to-gray-300 shrink-0 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        <User size={22} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-[15px] leading-tight">Need Help?</p>
                        <p className="text-[12px] text-gray-500 leading-snug mt-0.5">
                         Opening a Restaurant?
                        </p>
                        <button className="text-[11px] text-[#186737] hover:underline mt-1 text-left">
                      From kitchen equipment to financing, we’ve got you covered.
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex  border-gray-100s  w-[80%] mx-auto "   >
                    <a
                      href="tel:+18664467322"
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 hover:bg-[#f8fdf9] transition-colors group border-gray-100"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#186737]/10 flex items-center justify-center group-hover:bg-[#186737] transition-colors">
                        <Phone size={15} className="text-[#186737] group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-600 group-hover:text-[#186737] transition-colors">Call</span>
                    </a>
                    <button className="flex-1 flex flex-col items-center gap-1.5 py-3 hover:bg-[#f8fdf9] transition-colors group  border-gray-100"  onClick={handleModalOpen}>
                      <div className="w-9 h-9 rounded-full bg-[#186737]/10 flex items-center justify-center group-hover:bg-[#186737] transition-colors">
                        <MessageSquare size={15} className="text-[#186737] group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-600 group-hover:text-[#186737] transition-colors">Request a Quote</span>
                    </button>
                    {/* <button className="flex-1 flex flex-col items-center gap-1.5 py-3.5 hover:bg-[#f8fdf9] transition-colors group">
                      <div className="w-9 h-9 rounded-full bg-[#186737]/10 flex items-center justify-center group-hover:bg-[#186737] transition-colors">
                        <Clock size={15} className="text-[#186737] group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-600 group-hover:text-[#186737] transition-colors">Hours</span>
                    </button> */}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Icons (desktop) ── */}
            <div className="hidden xl:flex items-center gap-1 flex-shrink-0">
              {/* Profile / Sign In */}
              {profileLoading ? (
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                  <div className="flex flex-col gap-1">
                    <div className="w-16 h-2 rounded bg-gray-100 animate-pulse" />
                    <div className="w-20 h-2.5 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ) : customer ? (
                <div className="relative" onMouseEnter={handleProfileEnter} onMouseLeave={handleProfileLeave}>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-[7px] hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-[#186737]/10 flex items-center justify-center">
                      <User size={16} className="text-[#186737]" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] text-gray-400 leading-none">My Account</span>
                      <span className="text-xs font-semibold text-gray-800 flex items-center gap-0.5 leading-tight">
                        {customer.name}
                        <ChevronDown size={11} className="opacity-60" />
                      </span>
                    </div>
                  </button>
                  <ProfileDropdown show={showProfile} />
                </div>
              ) : (
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-[7px] hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#186737]/10 transition-colors">
                    <User size={16} className="text-gray-500 group-hover:text-[#186737] transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1 items-start">
                    <Link href="/login" className="text-[13px] text-black leading-none hover:text-[#186737] transition-colors">Sign in</Link>
                    {/* <Link href="/register" className="text-[13px] font-semibold text-gray-800 leading-tight hover:text-[#186737] transition-colors">Register</Link> */}
                  </div>
                </button>
              )}

              <div className="w-px h-6 bg-gray-200 mx-1" />

              {/* Wishlist */}
              <Link href="/wishlist" className="relative w-10 h-10 flex items-center justify-center rounded-[7px] hover:bg-gray-50 transition-colors group">
                <Heart size={20} className="text-gray-500 group-hover:text-[#186737] transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#186737] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">4</span>
              </Link>

              {/* Cart */}
              <Link href="/cart"><button className="flex items-center gap-2 bg-[#186737] hover:bg-[#145c2e] transition-colors text-white rounded-[7px] pl-3 pr-4 h-10">
                <div className="relative">
                  <ShoppingCart size={18} />
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-white text-[#186737] text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none border border-[#186737]">99+</span>
                </div>
                <span className="text-xs font-semibold">Cart</span>
              </button></Link>
            </div>

            {/* ── Mobile Right (hamburger) ── */}
            <div className="flex xl:hidden items-center gap-1">
              {/* Mobile cart icon */}
            <Link href={"/cart"}>
              <button className="relative w-9 h-9 sm:flex hidden  items-center justify-center rounded-[7px] text-gray-600 hover:bg-gray-100 transition-colors">
                <ShoppingCart size={20} />
                {/* <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-[#186737] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">99+</span> */}
              </button></Link>
              <Link href={"/wishlist"}><button className="relative w-9 h-9 sm:flex hidden  items-center justify-center rounded-[7px] text-gray-600 hover:bg-gray-100 transition-colors">
                <Heart size={20} />
                {/* <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-[#186737] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">99+</span> */}
              </button></Link>
              <button
                onClick={() => router.push("/search")}
                className="relative w-9 h-9 flex lg:hidden items-center justify-center rounded-[7px] text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Hamburger */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-[7px] text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setSheetOpen(true)}
                >
                  <Menu size={20} />
                </button>

                <SheetContent side="right" className="p-0 w-[340px] sm:w-[380px] flex flex-col">
                  {/* Header */}
                  <SheetHeader className="flex flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                    <Image src={Logo} alt="HorecaStore" className="w-28" />
                    <SheetClose asChild>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <X size={18} className="text-gray-500" />
                      </button>
                    </SheetClose>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto">
                    {/* ── Auth section ── */}
                    {profileLoading ? (
                      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="w-24 h-3 rounded bg-gray-100 animate-pulse" />
                          <div className="w-16 h-2.5 rounded bg-gray-100 animate-pulse" />
                        </div>
                      </div>
                    ) : customer ? (
                      <div className="px-5 py-4 border-b border-gray-100 bg-[#f8fdf9]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#186737]/15 flex items-center justify-center">
                              <User size={17} className="text-[#186737]" />
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-gray-800">{customer.name}</p>
                              <Link
                                href="/dashboard"
                                onClick={() => setSheetOpen(false)}
                                className="text-[11px] text-[#186737] font-medium"
                              >
                                View Profile
                              </Link>
                            </div>
                          </div>
                          <button
                            disabled={loggingOut}
                            onClick={async () => {
                              await dispatch(logoutUser());
                              window.location.href = "/";
                            }}
                            className="flex items-center gap-1.5 text-[12px] text-red-500 font-medium border border-red-100 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {loggingOut
                              ? <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                              : <LogOut size={13} />
                            }
                            Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                        <Link
                          href="/login"
                          onClick={() => setSheetOpen(false)}
                          className="flex-1 h-10 rounded-[9px] bg-[#186737] text-white text-sm font-semibold flex items-center justify-center hover:bg-[#145c2e] transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setSheetOpen(false)}
                          className="flex-1 h-10 rounded-[9px] border border-gray-200 text-gray-700 text-sm font-semibold flex items-center justify-center hover:border-[#186737] hover:text-[#186737] transition-colors"
                        >
                          Register
                        </Link>
                      </div>
                    )}

                    {/* Nav links */}
                    {NAV_LINKS.map((link) => (
                      <> {link.isModal ? (
                                        <button
                                          onClick={handleModalOpen}
                                        className={`flex items-center px-5 py-[14px] border-b border-gray-100 text-[15px] font-medium  hover:bg-gray-50 transition-colors ${link.label==="Mega Sale" ?"text-red-500" : "text-gray-900"}` }
                                        >
                                          {link.label}
                                        </button>
                                      ) : (
                                        <Link
                                          href={link.href}
                                        className={`flex items-center px-5 py-[14px] border-b border-gray-100 text-[15px] font-medium  hover:bg-gray-50 transition-colors ${link.label==="Mega Sale" ?"text-red-500" : "text-gray-900"}` }
                                        >
                                          {link.label}
                                        </Link>
                                      )}
                      </>
                    ))}
                    {/* {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setSheetOpen(false)}
                        className={`flex items-center px-5 py-[14px] border-b border-gray-100 text-[15px] font-medium  hover:bg-gray-50 transition-colors ${link.label==="Mega Sale" ?"text-red-500" : "text-gray-900"}` }
                      >
                        {link.label}
                      </Link>
                    ))} */}

                    {/* Categories label */}
                    <div className="px-5 pt-4 pb-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Categories</span>
                    </div>

                    {/* Category accordion */}
                    {navItemData.map((cat) => (
                      <MobileNavItem key={cat.id} item={cat} depth={0} onClose={() => setSheetOpen(false)} />
                    ))}

                    <div className="h-6" />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </div>
    </div>
          <FinancingModal isOpen={isModalOpen.modalOne} onClose={handleModalClose} title="Get a Financing Quote" />
   </>

  );
}
