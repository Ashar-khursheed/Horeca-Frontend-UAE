"use client";

import { CATEGORIESNAVBAR } from "@/data";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

// ── Dummy Data ─────────────────────────────────────────────────────────────────
interface CategoryName {
  en?: string;
  ar?: string;
}

interface Category {
  id: number;
  name: CategoryName | string;
  slug: string;
  parent_id: number;
  productCount: number;
  image_url: string;
  order: number;
  children: Category[];
  last_children: Category[];
}

const getName = (name: CategoryName | string, locale: string): string => {
  if (typeof name === "string") return name;
  return locale === "ar"
    ? (name?.ar ?? name?.en ?? "")
    : (name?.en ?? name?.ar ?? "");
};

// ── getCategoryPath helper ─────────────────────────────────────────────────────
const getCategoryPath = (cat: Category): string => {
  if (cat.slug === "shop-by-brands") return "/all-brands";
  if (cat.slug === "sale") return "/sale";
  return `/${cat.slug}`;
};

// ══════════════════════════════════════════════════════════════════════════════
// DropdownPanel
// ══════════════════════════════════════════════════════════════════════════════
interface DropdownPanelProps {
  category: Category;
  locale: string;
  setChildCategory?: (c: Category[]) => void;
  setGrandChildCategory?: (c: Category[]) => void;
  onClose: () => void;
  onPanelMouseEnter: () => void;
  onPanelMouseLeave: () => void;
}

function DropdownPanel({
  category,
  locale,
  setChildCategory,
  setGrandChildCategory,
  onClose,
  onPanelMouseEnter,
  onPanelMouseLeave,
}: DropdownPanelProps) {
  const [activeChild, setActiveChild] = useState<Category | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Reset to first child whenever parent category changes — same as React JS */
  useEffect(() => {
    const first = category?.children?.[0] ?? null;
    setActiveChild(first);
    setGrandChildCategory?.(first?.children ?? []);
    setChildCategory?.(category?.children ?? []);
  }, [category]);

  const handleChildHover = (child: Category) => {
    setActiveChild(child);
    setGrandChildCategory?.(child?.children ?? []);
  };

  if (!category?.children?.length) return null;

  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;
  const grandChildren = activeChild?.children ?? [];

  return (
    <>
      <style>{`
        /* ── Keyframes (same names as original global CSS) ── */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px) scaleY(0.97); }
          to   { opacity: 1; transform: translateY(0)     scaleY(1);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes scaleY {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        @keyframes ringSpin { to { transform: rotate(360deg); } }

        .animate-slideDown  { animation: slideDown  0.22s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-fadeIn     { animation: fadeIn     0.2s  ease-out              both; }
        .animate-fadeInUp   { animation: fadeInUp   0.22s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-scaleY     { animation: scaleY     0.18s ease-out              forwards; transform-origin: top; }

        /* Scrollbar */
        .custom-scrollbar::-webkit-scrollbar       { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }

        /* Mega sale pill */
        .mega-sale-pill {
          position: relative;
          background: linear-gradient(145deg, #ff3b0a, #ff0000);
          border-radius: 7px;
          overflow: hidden;
          z-index: 1;
          box-shadow: 0 10px 25px rgba(255,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.35);
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
        }
        .mega-sale-pill:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 16px 35px rgba(255,0,0,0.6), 0 0 25px rgba(255,0,0,0.45);
        }
        .confetti-ring {
          position: absolute; inset: -3px; border-radius: inherit;
          background: conic-gradient(from 0deg,#ff0,#ff3b0a,#00e5ff,#ff00c8,#22c55e,#ff0);
          z-index: 0; filter: blur(6px);
          animation: ringSpin 4s linear infinite;
        }
        .mega-sale-pill::after {
          content: ""; position: absolute; inset: 3px; border-radius: inherit;
          background: linear-gradient(145deg, #ff3b0a, #ff0000); z-index: 0;
        }
        .sale-label { position: relative; z-index: 10; }
      `}</style>

      <div
        ref={panelRef}
        className="absolute left-0 top-full bg-white shadow-xl border border-gray-200 z-50 w-full animate-slideDown"
        onMouseEnter={() => {
          onPanelMouseEnter();
          setChildCategory?.(category.children ?? []);
        }}
        onMouseLeave={onPanelMouseLeave}
      >
        <div className="global-container px-6 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* ── LEFT SIDEBAR ── */}
            <div className="col-span-3 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-1">
                {category.children!.map((child, index) => (
                  <Link
                    key={child.id}
                    href={`/${category.slug}/${child.slug}`}
                    onClick={onClose}
                    onMouseEnter={() => handleChildHover(child)}
                    className={`
                      group relative block w-full px-4 py-2 not-first: rounded-[7px]
                      transition-all duration-200 ease-in-out animate-fadeIn
                      ${
                        activeChild?.id === child.id
                          ? "bg-green-50 text-green-700  text-[12px] font-normal shadow-sm"
                          : "bg-gray-50 text-black hover:bg-green-50  text-[12px] hover:text-green-600"
                      }
                    `}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] 2xl:text-[14px] leading-tight">
                        {getName(child.name, locale)}
                      </span>

                      <ArrowIcon
                        size={16}
                        className={`transition-all duration-200 flex-shrink-0 ${
                          activeChild?.id === child.id
                            ? "opacity-100 translate-x-0"
                            : isRtl
                              ? "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                              : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                      />
                    </div>

                    {/* Active indicator bar */}
                    {activeChild?.id === child.id && (
                      <div
                        className={`absolute top-0 bottom-0 w-1 bg-green-600 animate-scaleY ${isRtl ? "right-0 rounded-l-full" : "left-0 rounded-r-full"}`}
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="col-span-9 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {grandChildren.length > 0 ? (
                <div className="grid 2xl:grid-cols-8 grid-cols-7 gap-4 pb-2">
                  {grandChildren.map((grandChild, index) => (
                    <Link
                      key={grandChild.id}
                      href={`/${category.slug}/${grandChild.slug}?parent=${activeChild?.slug}`}
                      onClick={onClose}
                      className="
                        group flex flex-col items-center text-center
                        p-4 rounded-[7px] bg-gray-50
                        hover:bg-white hover:shadow-lg hover:-translate-y-1
                        transition-all duration-300 ease-out
                        cursor-pointer border border-transparent hover:border-green-100
                        animate-fadeInUp
                      "
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      {/* Image */}
                      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-[7px] bg-white">
                        {grandChild.image_url ? (
                          <>
                            <img
                              src={grandChild.image_url}
                              alt={getName(grandChild.name, locale)}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-out"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                            <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/5 transition-colors duration-300" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🍽️
                          </div>
                        )}
                      </div>

                      {/* Label */}
                      <span className="text-xs font-medium text-gray-700 group-hover:text-green-700 leading-tight break-words line-clamp-2 transition-colors duration-200">
                        {getName(grandChild.name, locale)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <p className="text-4xl mb-3">📂</p>
                    <p className="text-sm">No subcategories available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HeaderMenu
// ══════════════════════════════════════════════════════════════════════════════
const HeaderMenu = ({ navItemData }: { navItemData: unknown[] }) => {
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [childCategory, setChildCategory] = useState<Category[]>([]);
  const [grandChildCategory, setGrandChildCategory] = useState<Category[]>([]);

  /* Scroll arrows */
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  /* Shared close timer — same as React JS closeTimeoutRef */
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Scroll arrows (same as React JS) ── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const checkScroll = () => {
      const { scrollWidth, clientWidth, scrollLeft } = el;
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
      setShowLeftArrow(scrollLeft > 0);
    };
    checkScroll();
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const doScrollRight = () =>
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  const doScrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });

  /* ── handleCloseDropdown — 150ms delay (same as React JS) ── */
  const handleCloseDropdown = useCallback(() => {
    clearTimeout(closeTimeoutRef.current!);
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
      setActiveCategory(null);
    }, 150);
  }, []);

  /* Cancel scheduled close when cursor enters panel */
  const cancelClose = useCallback(() => {
    clearTimeout(closeTimeoutRef.current!);
  }, []);

  /* ── handleMouseEnter — instant open, same as React JS ── */
  const handleMouseEnter = useCallback(
    (category: Category) => {
      clearTimeout(closeTimeoutRef.current!);

      const children =
        category.children ??
        (category as any).sub_categories ??
        (category as any).subcategories ??
        [];
      console.log(
        "[Nav] hover:",
        category.slug,
        "| children count:",
        children.length,
        "| raw:",
        category,
      );

      /* No children or brands → schedule close */
      if (!children.length || category.slug === "shop-by-brands") {
        handleCloseDropdown();
        return;
      }

      /* Instant open + set state — exactly like React JS version */
      setActiveCategory({ ...category, children });
      setChildCategory(children);
      setGrandChildCategory(children[0]?.children ?? []);
      setIsDropdownOpen(true);
    },
    [handleCloseDropdown],
  );

  /* Immediate close on link click */
  const closeNow = useCallback(() => {
    clearTimeout(closeTimeoutRef.current!);
    setIsDropdownOpen(false);
    setActiveCategory(null);
  }, []);

  /* Cleanup */
  useEffect(() => {
    return () => clearTimeout(closeTimeoutRef.current!);
  }, []);

  /* ── Click outside (same as React JS mousedown listener) ── */
  useEffect(() => {
    const handleMouseOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleMouseOutside);
    return () => document.removeEventListener("mousedown", handleMouseOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative w-full bg-green-700 py-2.5 border-b border-green-800 hidden xl:block"
      onMouseEnter={cancelClose}
      onMouseLeave={handleCloseDropdown}
    >
      <div className="global-container">
        <div className="grid grid-cols-[75%_25%]">
          {/* ── LEFT: scrollable category links ── */}
          <div className="relative flex items-center">
           

            <div
              ref={scrollRef}
              className="flex space-x-4 items-center overflow-x-aueto scrollbar-hide scroll-smooth"
            >
              {navItemData.map((category: any) => (
                <Link
                  key={category.id}
                  href={getCategoryPath(category)}
                  onMouseEnter={() => handleMouseEnter(category)}
                  onClick={closeNow}
                  className={`
                    text-white transition-colors duration-200
                    cursor-pointer relative group flex items-center gap-1
                    md:text-[15px] lg:text-[14px] text-xs whitespace-nowrap
                    ${activeCategory?.id === category.id && isDropdownOpen ? "font-normal" : "font-normal"}
                    hover:font-bold
                  `}
                >
                  {getName(category.name, locale)}
                  {category.slug !== "shop-by-brands" && (
                    <ChevronDown size={15} className="text-white opacity-80" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* ── RIGHT: phone · financing · sale ── */}
          <div>
            {" "}
            <div className="flex gap-3 items-center justify-end text-white font-normal ">
            

              {/* Financing */}
              <Link href="/mega-sale" style={{ textDecoration: "none" }}>
                <button className="mega-sale-pill  relative inline-flex items-center px-4 py-1  font-extrabold text-white  tracking-wider">
                  <span className="relative z-10">Mega Sale</span>

                  {/* animated border ring */}
                  <span className="confetti-ring"></span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {activeCategory &&
        activeCategory.slug !== "shop-by-brands" &&
        isDropdownOpen && (
          <DropdownPanel
            key={activeCategory.id}
            category={activeCategory}
            locale={locale}
            setChildCategory={setChildCategory}
            setGrandChildCategory={setGrandChildCategory}
            onClose={closeNow}
            onPanelMouseEnter={cancelClose}
            onPanelMouseLeave={handleCloseDropdown}
          />
        )}
    </div>
  );
};

export default HeaderMenu;
