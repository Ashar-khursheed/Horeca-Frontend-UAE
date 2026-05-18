"use client";

import BannerImg from "@/assets/banners/category/categoryBanner.png";
import CategoryCard from "@/components/category-card";
import { ChevronRight, LayoutGrid, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
// ─── All Categories Data ──────────────────────────────────────────────────────
const ALL_CATEGORIES = [
  // ── Main Parent Categories
  {
    id: 1, group: "Main",
    name: "Restaurant Equipment",
    slug: "restaurant-equipment",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    productCount: 1200,
  },
  {
    id: 2, group: "Main",
    name: "Refrigeration",
    slug: "refrigeration",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/E7vOjF8DGLifYgWhSXTS7RG5LWDvlVVqzQrLCVpD.webp",
    productCount: 980,
  },
  {
    id: 3, group: "Main",
    name: "Tableware",
    slug: "tableware",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/tableware.webp",
    productCount: 540,
  },
  {
    id: 4, group: "Main",
    name: "Smallwares",
    slug: "smallwares",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/smallwares.webp",
    productCount: 720,
  },
  {
    id: 5, group: "Main",
    name: "Hotel Supplies",
    slug: "hotel-supplies",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/hotel-supplies.webp",
    productCount: 310,
  },
  {
    id: 6, group: "Main",
    name: "Shop By Brand",
    slug: "brands",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/shop-by-brand.webp",
    productCount: 0,
  },
  {
    id: 7, group: "Main",
    name: "Disposables",
    slug: "disposables",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/disposables.webp",
    productCount: 430,
  },
  // ── Refrigeration
  {
    id: 48, group: "Refrigeration",
    name: "Reach In Refrigerator",
    slug: "reach-in-refrigerator",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/E7vOjF8DGLifYgWhSXTS7RG5LWDvlVVqzQrLCVpD.webp",
    productCount: 346,
  },
  {
    id: 49, group: "Refrigeration",
    name: "Worktop Refrigerator",
    slug: "worktop-refrigerator",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/v9OFWJqHqdtf2jKhh7NCALOrJaVoyNBQDGUFCKzd.webp",
    productCount: 144,
  },
  {
    id: 47, group: "Refrigeration",
    name: "Chef Base Refrigerator",
    slug: "chef-base-refrigerator",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/nmPCnBh9WmsEqsny68peDdhqiCmzpp2AmkiNUD6V.webp",
    productCount: 63,
  },
  {
    id: 50, group: "Refrigeration",
    name: "Undercounter Refrigerator",
    slug: "undercounter-refrigerator",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/2BhgxEE4QMurHnllGnuF0B5OH5awT9gVbf5HHqtE.webp",
    productCount: 121,
  },
  {
    id: 55, group: "Refrigeration",
    name: "Milk Cooler",
    slug: "milk-cooler",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/jnBDPc5A34QkT4R9oOJvSUZhdD0c05WZj2Do5mPh.webp",
    productCount: 62,
  },
  {
    id: 568, group: "Refrigeration",
    name: "Pizza Prep Table",
    slug: "pizza-prep-table",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/1AnQBJPhv5vVl4BxEbWfQbD6AVJoSfYjOiCMzv6P.webp",
    productCount: 51,
  },
  {
    id: 570, group: "Refrigeration",
    name: "Beer Dispenser",
    slug: "beer-dispenser",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/a0yzXuY1UN0Jl8ViE8GwSHk7vRdo53MPcTAfQyvP.webp",
    productCount: 96,
  },
  {
    id: 569, group: "Refrigeration",
    name: "Back Bar Cooler",
    slug: "back-bar-cooler",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/LjhWMScTX358VD5d19e2TD6thDDawm28Jf97UiFY.webp",
    productCount: 184,
  },
  {
    id: 57, group: "Refrigeration",
    name: "Glass Chillers & Frosters",
    slug: "glass-chillers-glass-frosters",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/glass-chillers-and-frosters.webp",
    productCount: 22,
  },
  {
    id: 200, group: "Refrigeration",
    name: "Commercial Refrigerator",
    slug: "commercial-refrigerator",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/E7vOjF8DGLifYgWhSXTS7RG5LWDvlVVqzQrLCVpD.webp",
    productCount: 210,
  },
  {
    id: 201, group: "Refrigeration",
    name: "Ice Machine",
    slug: "ice-machine",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/ice-machine.webp",
    productCount: 95,
  },
  {
    id: 202, group: "Refrigeration",
    name: "Walk-In Refrigerator",
    slug: "walk-in-refrigerator",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/walk-in-refrigerator.webp",
    productCount: 48,
  },
  {
    id: 203, group: "Refrigeration",
    name: "Commercial Inverter",
    slug: "commercial-inverter",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/commercial-inverter.webp",
    productCount: 32,
  },
  // ── Cooking Equipment
  {
    id: 100, group: "Cooking Equipment",
    name: "Commercial Cooking Equipment",
    slug: "commercial-cooking-equipment",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    productCount: 480,
  },
  {
    id: 539, group: "Cooking Equipment",
    name: "Commercial Gas Fryer",
    slug: "commercial-gas-fryer",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/0BwGoac9ljLnRVr4zBo0R8kq3llYcMfUrqiiGgxI.webp",
    productCount: 44,
  },
  {
    id: 179, group: "Cooking Equipment",
    name: "Deck Oven",
    slug: "deck-oven",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/StyyRQoOiWMleZUno4kjCrBK25Rv0RuqJT6n9eeH.webp",
    productCount: 19,
  },
  {
    id: 101, group: "Cooking Equipment",
    name: "Commercial Oven",
    slug: "commercial-oven",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/commercial-oven.webp",
    productCount: 130,
  },
  {
    id: 102, group: "Cooking Equipment",
    name: "Commercial Coffee Machines",
    slug: "commercial-coffee-machines",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/UJBrToZNSOjLCzaCVFvRSGVMrrblB6RjLivlNFUv.webp",
    productCount: 76,
  },
  {
    id: 170, group: "Cooking Equipment",
    name: "Commercial Espresso Machine",
    slug: "commercial-espresso-machine",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/UJBrToZNSOjLCzaCVFvRSGVMrrblB6RjLivlNFUv.webp",
    productCount: 21,
  },
  // ── Food Prep
  {
    id: 139, group: "Food Prep",
    name: "Commercial Food Processors",
    slug: "commercial-food-processors",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/tmAc5pD0M6lOqTRku6dy0okCJ8dfY9cFwxZlYwiO.webp",
    productCount: 83,
  },
  {
    id: 152, group: "Food Prep",
    name: "Planetary Mixer",
    slug: "planetary-mixer",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/52uk7DiasaVgD2aaeoOFYf10I8OIMAW1kOo9CXDL.webp",
    productCount: 20,
  },
  {
    id: 300, group: "Food Prep",
    name: "Food Prep Equipment",
    slug: "food-prep-equipment",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/tmAc5pD0M6lOqTRku6dy0okCJ8dfY9cFwxZlYwiO.webp",
    productCount: 260,
  },
  // ── Warewashing
  {
    id: 400, group: "Warewashing",
    name: "Commercial Dishwasher",
    slug: "commercial-dishwasher",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/commercial-dishwasher.webp",
    productCount: 115,
  },
  {
    id: 401, group: "Warewashing",
    name: "Commercial Sink",
    slug: "commercial-sink",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/commercial-sink.webp",
    productCount: 88,
  },
  {
    id: 402, group: "Warewashing",
    name: "Commercial Work Tables",
    slug: "commercial-work-tables",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/commercial-work-tables.webp",
    productCount: 67,
  },
  {
    id: 403, group: "Warewashing",
    name: "Commercial Shelving",
    slug: "commercial-shelving",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/commercial-shelving.webp",
    productCount: 75,
  },
  // ── Tableware & Smallwares
  {
    id: 500, group: "Tableware & Smallwares",
    name: "Crockery",
    slug: "crockery",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/crockery.webp",
    productCount: 190,
  },
  {
    id: 501, group: "Tableware & Smallwares",
    name: "Serveware",
    slug: "serveware",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/serveware.webp",
    productCount: 145,
  },
  {
    id: 502, group: "Tableware & Smallwares",
    name: "Catering Accessories",
    slug: "catering-accessories",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/catering-accessories.webp",
    productCount: 110,
  },
  {
    id: 503, group: "Tableware & Smallwares",
    name: "Metalware Glassware",
    slug: "metalware-glassware",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/glassware.webp",
    productCount: 88,
  },
  {
    id: 504, group: "Tableware & Smallwares",
    name: "Dinnerware",
    slug: "dinnerware",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/dinnerware.webp",
    productCount: 220,
  },
  {
    id: 505, group: "Tableware & Smallwares",
    name: "Bar Equipment",
    slug: "bar-equipment",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/bar-equipment.webp",
    productCount: 95,
  },
  {
    id: 506, group: "Tableware & Smallwares",
    name: "Cutlery",
    slug: "cutlery",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/cutlery.webp",
    productCount: 170,
  },
  {
    id: 507, group: "Tableware & Smallwares",
    name: "Cookware",
    slug: "cookware",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/cookware.webp",
    productCount: 200,
  },
  {
    id: 508, group: "Tableware & Smallwares",
    name: "Storage And Transportation",
    slug: "storage-and-transportation",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/storage-transportation.webp",
    productCount: 130,
  },
  {
    id: 509, group: "Tableware & Smallwares",
    name: "Pizza Tools And Tableware",
    slug: "pizza-tools-tableware",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/pizza-tools.webp",
    productCount: 65,
  },
  {
    id: 510, group: "Tableware & Smallwares",
    name: "Food Pans & Accessories",
    slug: "food-pans-accessories",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/food-pans.webp",
    productCount: 120,
  },
  {
    id: 511, group: "Tableware & Smallwares",
    name: "Adjunct Knives",
    slug: "adjunct-knives",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/knives.webp",
    productCount: 88,
  },
  {
    id: 512, group: "Tableware & Smallwares",
    name: "Baking Tools & Supplies",
    slug: "baking-tools-supplies",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/baking-tools.webp",
    productCount: 95,
  },
  {
    id: 513, group: "Tableware & Smallwares",
    name: "Kitchen Supplies",
    slug: "kitchen-supplies",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/kitchen-supplies.webp",
    productCount: 310,
  },
  // ── Hotel & Beverage
  {
    id: 600, group: "Hotel & Beverage",
    name: "Beverage Equipment",
    slug: "beverage-equipment",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/beverage-equipment.webp",
    productCount: 180,
  },
  {
    id: 601, group: "Hotel & Beverage",
    name: "Food Display Case & Merchandiser",
    slug: "food-display-case-merchandiser",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/food-display.webp",
    productCount: 75,
  },
  {
    id: 602, group: "Hotel & Beverage",
    name: "Hotel & Restaurant Linen",
    slug: "hotel-restaurant-linen",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/hotel-linen.webp",
    productCount: 140,
  },
  {
    id: 603, group: "Hotel & Beverage",
    name: "Guest Room Supplies",
    slug: "guest-room-supplies",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/guest-room.webp",
    productCount: 95,
  },
  {
    id: 604, group: "Hotel & Beverage",
    name: "Heating And Cooling Systems",
    slug: "heating-cooling-systems",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/heating-cooling.webp",
    productCount: 55,
  },
  {
    id: 605, group: "Hotel & Beverage",
    name: "Janitorial Disposables",
    slug: "janitorial-disposables",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/janitorial.webp",
    productCount: 80,
  },
  {
    id: 606, group: "Hotel & Beverage",
    name: "Tabletop Disposables",
    slug: "tabletop-disposables",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/tabletop-disposables.webp",
    productCount: 120,
  },
  // ── Disposables
  {
    id: 700, group: "Disposables",
    name: "Foam Products",
    slug: "foam-products",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/foam-products.webp",
    productCount: 65,
  },
  {
    id: 701, group: "Disposables",
    name: "Food Storage Disposables",
    slug: "food-storage-disposables",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/food-storage.webp",
    productCount: 90,
  },
  {
    id: 702, group: "Disposables",
    name: "Disposable Food Packaging Supplies",
    slug: "disposable-food-packaging",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/food-packaging.webp",
    productCount: 110,
  },
  {
    id: 703, group: "Disposables",
    name: "Disposable Tableware",
    slug: "disposable-tableware",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/disposable-tableware.webp",
    productCount: 145,
  },
  {
    id: 704, group: "Disposables",
    name: "Disposable Food Containers",
    slug: "disposable-food-containers",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/food-containers.webp",
    productCount: 130,
  },
  {
    id: 705, group: "Disposables",
    name: "Disposable Cups",
    slug: "disposable-cups",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/disposable-cups.webp",
    productCount: 75,
  },
  {
    id: 706, group: "Disposables",
    name: "Aluminium Foil & Containers",
    slug: "aluminium-foil-containers",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/aluminium-foil.webp",
    productCount: 55,
  },
  {
    id: 707, group: "Disposables",
    name: "Plastic Bags & Wraps",
    slug: "plastic-bags-wraps",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/plastic-bags.webp",
    productCount: 45,
  },
  {
    id: 708, group: "Disposables",
    name: "Take-Out Containers & To-Go Boxes",
    slug: "take-out-containers-to-go-boxes",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/take-out-containers.webp",
    productCount: 90,
  },
  // ── Food Trucks & Trailers
  {
    id: 800, group: "Food Trucks & Trailers",
    name: "Food Truck",
    slug: "food-truck",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/food-truck.webp",
    productCount: 25,
  },
  {
    id: 801, group: "Food Trucks & Trailers",
    name: "Beverage Trailer",
    slug: "beverage-trailer",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/beverage-trailer.webp",
    productCount: 18,
  },
  {
    id: 802, group: "Food Trucks & Trailers",
    name: "Dessert Food Trucks",
    slug: "dessert-food-trucks",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/dessert-truck.webp",
    productCount: 12,
  },
  {
    id: 803, group: "Food Trucks & Trailers",
    name: "BBQ Trailer",
    slug: "bbq-trailer",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/bbq-trailer.webp",
    productCount: 8,
  },
  {
    id: 804, group: "Food Trucks & Trailers",
    name: "Pizza Trailer",
    slug: "pizza-trailer",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/pizza-trailer.webp",
    productCount: 10,
  },
  {
    id: 805, group: "Food Trucks & Trailers",
    name: "Custom Food Trailer",
    slug: "custom-food-trailer",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/custom-trailer.webp",
    productCount: 15,
  },
  {
    id: 806, group: "Food Trucks & Trailers",
    name: "Food Trailers & Trucks",
    slug: "food-trailers-trucks",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/food-truck.webp",
    productCount: 88,
  },
  // ── Used Equipment
  {
    id: 900, group: "Used Equipment",
    name: "Used Restaurant Equipment",
    slug: "used-restaurant-equipment",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    productCount: 155,
  },
  {
    id: 901, group: "Used Equipment",
    name: "Used Refrigerators",
    slug: "used-refrigerators",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/E7vOjF8DGLifYgWhSXTS7RG5LWDvlVVqzQrLCVpD.webp",
    productCount: 48,
  },
  {
    id: 902, group: "Used Equipment",
    name: "Used Kitchen Equipment",
    slug: "used-kitchen-equipment",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    productCount: 72,
  },
];

const GROUPS = ["All", ...Array.from(new Set(ALL_CATEGORIES.map((c) => c.group)))];

// ─── Fallback image on error ──────────────────────────────────────────────────
const FALLBACK =
  "https://d1p9kdrbe10xzz.cloudfront.net/categories/E7vOjF8DGLifYgWhSXTS7RG5LWDvlVVqzQrLCVpD.webp";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AllCategoriesPage() {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");

  const filtered = useMemo(() => {
    let list = ALL_CATEGORIES;
    if (activeGroup !== "All") list = list.filter((c) => c.group === activeGroup);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [search, activeGroup]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container py-3 flex items-center gap-1.5 text-sm overflow-x-auto whitespace-nowrap">
          <Link href="/" className="text-[#186737] hover:underline shrink-0">Home</Link>
          <ChevronRight size={13} className="text-gray-300 shrink-0" />
          <span className="font-semibold text-gray-700 shrink-0">All Categories</span>
        </div>
      </div>

      {/* ── Hero banner ────────────────────────────────────────────────────── */}
     {false  &&  <div className="bg-white border-b border-gray-100">
        <div className="global-container py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LayoutGrid size={20} className="text-[#186737]" />
                <h1 className="text-xl md:text-2xl font-extrabold text-[#186737]">
                  All Categories
                </h1>
              </div>
              <h2 className="text-sm md:text-base font-semibold text-gray-800 mb-1">
                Browse All Commercial Equipment Categories on HorecaStore
              </h2>
              <p className="text-xs md:text-sm text-gray-500 max-w-2xl leading-relaxed">
                Explore all equipment categories on HorecaStore for hotels, restaurants, and cafes.
                Our complete category directory makes it easy to find commercial kitchen essentials,
                cooking equipment, refrigeration, food prep tools, dining service items, and
                hospitality supplies in one place.
              </p>
            </div>
            {/* Search */}
            <div className="w-full md:w-72 shrink-0">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full border border-gray-200 rounded-[7px] pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#186737] focus:border-transparent"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>}

<div>
<Image src={BannerImg} alt="All Categories Banner" className="w-full h-auto object-cover" />
</div>

      {/* ── Group filter tabs ───────────────────────────────────────────────── */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <div className="global-container">
          <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-none">
            {GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  activeGroup === g
                    ? "bg-[#186737] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories grid ─────────────────────────────────────────────────── */}
      <div className="global-container py-8">

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search size={40} className="text-gray-300 mb-3" />
            <p className="text-base font-semibold text-gray-500">No categories found.</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search term or group filter.</p>
            <button
              onClick={() => { setSearch(""); setActiveGroup("All"); }}
              className="mt-4 px-5 py-2 bg-[#186737] text-white text-sm font-semibold rounded-[7px] hover:bg-[#145a2d] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-medium mb-5">
              Showing{" "}
              <span className="text-gray-700 font-bold">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "category" : "categories"}
              {activeGroup !== "All" && (
                <> in <span className="text-[#186737] font-bold">{activeGroup}</span></>
              )}
            </p>

            {/* <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2.5 md:gap-4"> */}
              {filtered.map((cat) => (
                <CategoryCard key={cat.id} />
              ))}
            {/* </div> */}
          </>
        )}
      </div>
    </div>
  );
}
