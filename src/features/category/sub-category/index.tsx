"use client";

import FilterSidebar from "@/components/filters";
import Pagination from "@/components/pagination";
import ProductCard from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FEATURED_DATA } from "@/data";
import {
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  Home,
  Rows3,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import Breadcrumb from "@/components/breadcum";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubCategory {
  name: string;
  slug: string;
  image: string;
}

interface Brand {
  name: string;
  count: number;
}

interface Product {
  id: number;
  name: string;
  modelNo: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  shipping: string;
  badge?: "New" | "Sale" | "Best Seller";
  inStock: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const SUBCATEGORIES: SubCategory[] = [
  {
    name: "Commercial Range",
    slug: "commercial-range",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
  {
    name: "Commercial Grill & Griddle",
    slug: "commercial-grill-griddle",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
  {
    name: "Commercial Fryer",
    slug: "commercial-fryer",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
  {
    name: "Salamander Broiler",
    slug: "salamander-broiler",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
  {
    name: "Commercial Toaster",
    slug: "commercial-toaster",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
  {
    name: "Cheese Melters",
    slug: "cheese-melters",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
  {
    name: "Rice Cookers / Warmers",
    slug: "rice-cookers-warmers",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
  {
    name: "Waffle Maker",
    slug: "waffle-maker",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
  {
    name: "Exhaust Hood",
    slug: "exhaust-hood",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
  {
    name: "Air Curtain",
    slug: "air-curtain",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
  {
    name: "Gyro Machine",
    slug: "gyro-machine",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
  },
];

const SORT_OPTIONS = [
  "Default Sorting",
  "Price: Low to High",
  "Price: High to Low",
  "Top Rated",
  "Newest First",
];

const SHOW_OPTIONS = [20, 50, 100];

// ─── Sub-components ───────────────────────────────────────────────────────────

// function Breadcrumb() {
//   const crumbs = [
//     { label: "Home", href: "/" },
//     { label: "Categories", href: "/categories" },
//     { label: "Restaurant Equipment", href: "/restaurant-equipment" },
//     { label: "Commercial Cooking Equipment", href: null },
//   ];

//   return (
//     <nav className="bg-white border-b border-gray-100">
//       <div className="global-container mx-auto px-4 sm:px-6">
//         <ol className="flex items-center flex-wrap gap-y-1 h-10 text-xs">
//           {crumbs.map((crumb, i) => (
//             <li key={i} className="flex items-center">
//               {i > 0 && (
//                 <ChevronRight size={12} className="mx-1.5 text-gray-300" />
//               )}
//               {crumb.href ? (
//                 <Link
//                   href={crumb.href}
//                   className="text-gray-400 hover:text-[#186737] transition-colors flex items-center gap-1"
//                 >
//                   {i === 0 && <Home size={11} />}
//                   {crumb.label}
//                 </Link>
//               ) : (
//                 <span className="text-[#186737] font-semibold">
//                   {crumb.label}
//                 </span>
//               )}
//             </li>
//           ))}
//         </ol>
//       </div>
//       {/* <div className="h-[2px] bg-gray-100">
//         <div className="h-full w-full bg-[#186737] rounded-r-full" />
//       </div> */}
//     </nav>
//   );
// }

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={11}
          className={
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

function BadgePill({ badge }: { badge: Product["badge"] }) {
  if (!badge) return null;
  const styles: Record<string, string> = {
    "Best Seller": "bg-amber-50 text-amber-700 border border-amber-200",
    Sale: "bg-red-50 text-red-600 border border-red-200",
    New: "bg-green-50 text-[#186737] border border-green-200",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[badge]}`}
    >
      {badge}
    </span>
  );
}

// function ProductCard({ product }: { product: Product }) {
//   const [wishlisted, setWishlisted] = useState(false);
//   const [qty, setQty] = useState(1);

//   return (
//     <div className="group bg-white border border-gray-100 rounded-[7px] overflow-hidden hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
//       {/* Image */}
//       <div className="relative bg-white aspect-square overflow-hidden">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
//         />
//         {/* Wishlist */}
//         <button
//           onClick={() => setWishlisted((p) => !p)}
//           className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:border-red-200 transition-colors"
//         >
//           <Heart
//             size={13}
//             className={
//               wishlisted
//                 ? "fill-red-500 text-red-500"
//                 : "text-gray-300 group-hover:text-gray-400"
//             }
//           />
//         </button>
//         {/* Badge */}
//         {product.badge && (
//           <div className="absolute top-2.5 left-2.5">
//             <BadgePill badge={product.badge} />
//           </div>
//         )}
//         {!product.inStock && (
//           <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
//             <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
//               Out of Stock
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="flex flex-col flex-1 p-3.5 gap-2">
//         <p className="text-[10px] text-gray-400 font-mono">
//           Model No: {product.modelNo}
//         </p>
//         <p className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2 flex-1">
//           {product.name}
//         </p>

//         <div className="flex items-center gap-1.5">
//           <StarRating rating={product.rating} />
//           <span className="text-[10px] text-gray-400">
//             ({product.reviewCount})
//           </span>
//         </div>

//         <div className="flex items-center gap-1.5">
//           <Truck size={11} className="text-[#186737]" />
//           <p className="text-[10px] text-gray-400">{product.shipping}</p>
//         </div>

//         {/* Price + Add to Cart */}
//         <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-auto">
//           <div>
//             <p className="text-[16px] font-bold text-gray-900">
//               ${product.price.toFixed(2)}
//               <span className="text-[10px] font-normal text-gray-400 ml-0.5">
//                 /Each
//               </span>
//             </p>
//             {product.originalPrice && (
//               <p className="text-[11px] text-gray-400 line-through">
//                 ${product.originalPrice.toFixed(2)}
//               </p>
//             )}
//           </div>

//           {/* Qty stepper */}
//           <div className="flex items-center border border-gray-200 rounded-[7px] overflow-hidden">
//             <button
//               onClick={() => setQty((q) => Math.max(1, q - 1))}
//               className="w-6 h-7 text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors"
//             >
//               −
//             </button>
//             <span className="w-6 text-center text-[12px] font-medium text-gray-700">
//               {qty}
//             </span>
//             <button
//               onClick={() => setQty((q) => q + 1)}
//               className="w-6 h-7 text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors"
//             >
//               +
//             </button>
//           </div>
//         </div>

//         <button
//           disabled={!product.inStock}
//           className="w-full flex items-center justify-center gap-1.5 bg-[#186737] hover:bg-[#1e5230] disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-[12px] font-semibold py-2 rounded-[7px] transition-colors duration-200"
//         >
//           <ShoppingCart size={13} />
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// }

// ─── Reusable Checkbox Filter Section ────────────────────────────────────────

// ─── Sidebar Filter ───────────────────────────────────────────────────────────

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SubCategoryPage() {
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 10,
    max: 78000,
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string[]>>(
    {},
  );
  const [sortBy, setSortBy] = useState("Default Sorting");
  const [showCount, setShowCount] = useState(50);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const swiperRef = useRef<SwiperType | null>(null);

  const handleBrandToggle = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  }, []);

  const handleAttrToggle = useCallback((group: string, val: string) => {
    setSelectedAttrs((prev) => {
      const current = prev[group] ?? [];
      return {
        ...prev,
        [group]: current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val],
      };
    });
  }, []);

  const handleClearAttr = useCallback((group: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [group]: [] }));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedBrands([]);
    setSelectedAttrs({});
    setPriceRange({ min: 10, max: 78000 });
  }, []);

  return (
    <main className="min-h-screen bg-gray-5p0">
      <Breadcrumb />

      <div className="global-container mx-auto px-4 sm:px-6 py-5">
        {/* Page Header */}
        <div className="mb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Commercial Cooking Equipment
          </h1>
          <p className="text-[13px] text-gray-500 max-w-2xl">
            Power up your kitchen with reliable cooking equipment for
            restaurants and catering services. Trusted brands, fast shipping,
            unbeatable prices.
          </p>
        </div>

        {/* Subcategory Slider */}
        <div className="mb-6 bg-white border border-gray-100 rounded-[7px] p-4 md:p-5 relative">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#186737] hover:text-[#186737] transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#186737] hover:text-[#186737] transition-colors"
          >
            <ChevronRight size={14} />
          </button>
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            spaceBetween={8}
            breakpoints={{
              0:    { slidesPerView: 3 },
              480:  { slidesPerView: 4 },
              640:  { slidesPerView: 5 },
              768:  { slidesPerView: 6 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 9 },
              1536: { slidesPerView: 11 },
            }}
            className="px-6"
          >
            {SUBCATEGORIES.map((sub) => (
              <SwiperSlide key={sub.slug}>
                <Link
                  href={`/restaurant-equipment/commercial-cooking-equipment/${sub.slug}`}
                  className="group flex flex-col items-center gap-1.5 rounded-[7px] border border-transparent hover:border-green-100 hover:bg-green-50 transition-all duration-200 p-1"
                >
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full aspect-square object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-[9px] md:text-[13px] font-light text-gray-500 group-hover:text-[#186737] text-center leading-tight transition-colors duration-200 line-clamp-2">
                    {sub.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile Filter + Sort Bar */}
        <div className="md:hidden mb-3 flex items-center justify-between bg-white border border-gray-100 rounded-[7px] px-3 py-2.5">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 text-[13px] font-semibold text-gray-700"
          >
            <SlidersHorizontal size={14} className="text-[#186737]" />
            Filters
            {(selectedBrands.length + Object.values(selectedAttrs).reduce((a, v) => a + v.length, 0)) > 0 && (
              <span className="bg-[#186737] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {selectedBrands.length + Object.values(selectedAttrs).reduce((a, v) => a + v.length, 0)}
              </span>
            )}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400">Sort:</span>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
              <SelectTrigger className="h-7 text-[12px] border-gray-200 px-2 bg-white cursor-pointer min-w-35">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Sidebar — desktop only */}
          <div className="hidden md:block w-55 lg:w-60 shrink-0">
            <FilterSidebar
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              onClearBrands={() => setSelectedBrands([])}
              selectedAttrs={selectedAttrs}
              onAttrToggle={handleAttrToggle}
              onClearAttr={handleClearAttr}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search + Sort Bar */}
            <div className="bg-white border border-gray-100 rounded-[7px] px-4 py-3 mb-4  gap-3">
            {/* <div className="bg-white border border-gray-100 rounded-[7px] px-4 py-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"> */}
              {/* Search */}
              <div className="relative hidden flex-1 max-w-xs">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in results..."
                  className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-[7px] outline-none focus:border-[#186737] transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 justify-between">
                <span className="text-[12px] text-gray-400 hidden sm:block">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">308</span>{" "}
                  results
                </span>
                <div className="hidden md:flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-400">Sort:</span>
                  <Select
                    value={sortBy}
                    onValueChange={(val) => setSortBy(val)}
                  >
                    <SelectTrigger className="h-7 text-[12px] border-gray-200 px-2 bg-white cursor-pointer min-w-35">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-400">Show:</span>
                  <Select
                    value={String(showCount)}
                    onValueChange={(val) => setShowCount(Number(val))}
                  >
                    <SelectTrigger className="h-7 text-[12px] border-gray-200 px-2 bg-white cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SHOW_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={String(opt)}>
                          {opt} Items
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:flex hidden items-center gap-1.5">
                  <span className="text-[11px] text-gray-400">Grid Type:</span>
                  <div className="flex items-center gap-1.5">
                    <Grid2x2 className="text-gray-600" size={17} />
                    <Rows3 className="text-gray-600" size={17} />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {selectedBrands.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="flex items-center gap-1 text-[11px] font-medium bg-green-50 text-[#186737] border border-green-200 px-2.5 py-1 rounded-full"
                  >
                    {brand}
                    <button onClick={() => handleBrandToggle(brand)}>
                      <X
                        size={10}
                        className="hover:text-red-500 transition-colors"
                      />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 gap-3">
              {FEATURED_DATA.flatMap((category) =>
                category.featured_products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      images: [...product.images],
                      alt_tags: [...product.alt_tags],
                    }}
                    onAddToCart={(p, qty) => console.log("Cart:", p.name, qty)}
                    onWishlistToggle={(p, w) =>
                      console.log("Wishlist:", p.name, w)
                    }
                  />
                )),
              )}
            </div>

            {/* Pagination stub */}
            <Pagination
              totalPages={24}
              initialPage={1}
              onPageChange={(page) => console.log("Page:", page)}
              showFirstLast={true}
              showPageInfo={true}
            />
            {/* <div className="flex items-center justify-center gap-2 mt-8">
              {[1, 2, 3, "...", 7].map((page, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 text-[12px] font-medium rounded-[7px] transition-colors ${
                    page === 1
                      ? "bg-[#186737] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#186737] hover:text-[#186737]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div> */}
          </div>
        </div>
      </div>
      {/* ── Mobile Filter Drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-black/50 transition-opacity duration-300 ${
          mobileFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileFilterOpen(false)}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          mobileFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "88vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#186737]" />
            <span className="text-[15px] font-bold text-gray-900">Filters</span>
            {(selectedBrands.length + Object.values(selectedAttrs).reduce((a, v) => a + v.length, 0)) > 0 && (
              <span className="bg-[#186737] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {selectedBrands.length + Object.values(selectedAttrs).reduce((a, v) => a + v.length, 0)}
              </span>
            )}
          </div>
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Filter Body */}
        <div className="overflow-y-auto flex-1 px-4 py-3">
          <FilterSidebar
            mobile
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedBrands={selectedBrands}
            onBrandToggle={handleBrandToggle}
            onClearBrands={() => setSelectedBrands([])}
            selectedAttrs={selectedAttrs}
            onAttrToggle={handleAttrToggle}
            onClearAttr={handleClearAttr}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Footer Buttons */}
        <div className="shrink-0 px-4 py-4 border-t border-gray-100 bg-white flex gap-3">
          {(selectedBrands.length + Object.values(selectedAttrs).reduce((a, v) => a + v.length, 0)) > 0 && (
            <button
              onClick={handleClearAll}
              className="flex-1 py-3 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="flex-1 py-3 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold transition-colors duration-200"
          >
            {(selectedBrands.length + Object.values(selectedAttrs).reduce((a, v) => a + v.length, 0)) > 0
              ? `Apply Filters (${selectedBrands.length + Object.values(selectedAttrs).reduce((a, v) => a + v.length, 0)})`
              : "Apply Filters"}
          </button>
        </div>
      </div>
    </main>
  );
}
