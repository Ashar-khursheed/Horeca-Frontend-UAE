"use client";

import {
    ChevronDown,
    ChevronUp,
    Shield,
    SlidersHorizontal,
    Truck,
    X
} from "lucide-react";
import { useState } from "react";

const BRANDS: Brand[] = [
  { name: "Atosa", count: 124 },
  { name: "Serv-ware", count: 89 },
  { name: "Prepmaster Series", count: 56 },
  { name: "Kitchencore Series", count: 43 },
  { name: "Vulcan", count: 38 },
  { name: "Rational", count: 31 },
  { name: "Beckers", count: 27 },
];

// Each key = filter group name, value = list of options
const ATTRIBUTE_FILTERS: { label: string; options: string[] }[] = [
  {
    label: "Nominal Height",
    options: ["84 - 85 in", "86 - 87 in", "90 - 91 in"],
  },
  {
    label: "Nominal Width",
    options: ["72 - 73 in", "96 - 97 in", "120 - 121 in"],
  },
  {
    label: "Capacity",
    options: [
      "258 - 352 cb3",
      "353 - 447 cb3",
      "448 - 542 cb3",
      "543 - 637 cb3",
      "638 - 728 cb3",
    ],
  },
  {
    label: "Voltage",
    options: ["115V / 60Hz / 1Ph", "208-230V / 60Hz / 1Ph", "460V / 60Hz / 3Ph"],
  },
  {
    label: "Nominal Depth",
    options: ["24 - 25 in", "26 - 27 in", "30 - 31 in", "32 - 33 in"],
  },
  {
    label: "Floor",
    options: ["Yes", "No"],
  },
  {
    label: "Refrigeration Type",
    options: ["Air Cooled", "Water Cooled", "Remote Condensing"],
  },
  {
    label: "Usage",
    options: ["Indoor", "Outdoor", "Indoor / Outdoor"],
  },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Winco FB-PS Fry Basket Press with 11\" Handle for FB-10 FB-20",
    modelNo: "FB-PS",
    price: 10.5,
    rating: 4.5,
    reviewCount: 28,
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    shipping: "Mostly Ships in 1 to 2 Days",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: 2,
    name: "Thunder Group SLTB01BR Taco Fryer Basket with 1 Bowl Capacity",
    modelNo: "SLTB01BR",
    price: 11.91,
    rating: 4.8,
    reviewCount: 15,
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    shipping: "Mostly Ships in 1 to 2 Days",
    inStock: true,
  },
  {
    id: 3,
    name: "Thunder Group SLTB01BT Taco Fryer Basket with 1 Bowl Capacity",
    modelNo: "SLTB01BT",
    price: 12.64,
    originalPrice: 15.0,
    rating: 4.3,
    reviewCount: 22,
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    shipping: "Mostly Ships in 1 to 2 Days",
    badge: "Sale",
    inStock: true,
  },
  {
    id: 4,
    name: "CAC China FBM-8 8\" Fry Basket, Nickel-Plated Commercial Grade",
    modelNo: "FBM-8",
    price: 13.37,
    rating: 4.1,
    reviewCount: 9,
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    shipping: "Mostly Ships in 5 to 7 Days",
    inStock: true,
  },
  {
    id: 5,
    name: "Atosa Commercial Heavy Duty 6-Burner Gas Range with Oven",
    modelNo: "ATO-6B",
    price: 1249.0,
    originalPrice: 1599.0,
    rating: 4.7,
    reviewCount: 64,
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    shipping: "Mostly Ships in 3 to 5 Days",
    badge: "Sale",
    inStock: true,
  },
  {
    id: 6,
    name: "Vulcan Endurance 36\" Heavy Duty Gas Griddle Countertop",
    modelNo: "VG36",
    price: 2199.0,
    rating: 4.9,
    reviewCount: 41,
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    shipping: "Mostly Ships in 5 to 7 Days",
    badge: "New",
    inStock: true,
  },
  {
    id: 7,
    name: "Beckers Commercial Deep Fryer Dual Basket 40lb Oil Capacity",
    modelNo: "BCK-DF40",
    price: 879.5,
    rating: 4.4,
    reviewCount: 18,
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    shipping: "Mostly Ships in 1 to 2 Days",
    inStock: true,
  },
  {
    id: 8,
    name: "Rational SCC WE 61 Self-Cooking Center Combi Oven 6-1/1",
    modelNo: "SCC-WE61",
    price: 7850.0,
    rating: 5.0,
    reviewCount: 12,
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/cooking-equipment-1.png",
    shipping: "Mostly Ships in 7 to 10 Days",
    badge: "Best Seller",
    inStock: false,
  },
];
function CheckboxSection({
  label,
  options,
  selected,
  onToggle,
  onClear,
  defaultOpen = false,
  showCount,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  onClear: () => void;
  defaultOpen?: boolean;
  showCount?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);
  const limit = showCount ?? 5;
  const visible = showAll ? options : options.slice(0, limit);
  const hasSelected = selected.length > 0;

  return (
    <div className="bg-white border border-gray-100 rounded-[7px] overflow-hidden mb-2">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
      >
        <span className="text-[13px] font-semibold text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          {hasSelected && (
            <span
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="text-[10px] font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Clear
            </span>
          )}
          {open ? (
            <ChevronUp size={13} className="text-gray-400" />
          ) : (
            <ChevronDown size={13} className="text-gray-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-3 space-y-2">
          {visible.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
                className="w-3.5 h-3.5 accent-[#186737] rounded flex-shrink-0"
              />
              <span className="text-[12px] text-gray-600 group-hover:text-gray-800 transition-colors leading-tight">
                {opt}
              </span>
            </label>
          ))}
          {options.length > limit && (
            <button
              onClick={() => setShowAll((p) => !p)}
              className="text-[11px] font-semibold text-[#186737] hover:text-[#1e5230] transition-colors mt-0.5"
            >
              {showAll ? "Show Less" : `See More (${options.length - limit})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}interface SubCategory {
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

export default function FilterSidebar({
  priceRange,
  onPriceChange,
  selectedBrands,
  onBrandToggle,
  onClearBrands,
  selectedAttrs,
  onAttrToggle,
  onClearAttr,
  onClearAll,
  mobile = false,
}: {
  priceRange: PriceRange;
  onPriceChange: (range: PriceRange) => void;
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  onClearBrands: () => void;
  selectedAttrs: Record<string, string[]>;
  onAttrToggle: (group: string, val: string) => void;
  onClearAttr: (group: string) => void;
  onClearAll: () => void;
  mobile?: boolean;
}) {
  const [priceOpen, setPriceOpen] = useState(true);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const visibleBrands = showAllBrands ? BRANDS : BRANDS.slice(0, 5);

  const totalActive =
    selectedBrands.length +
    Object.values(selectedAttrs).reduce((acc, v) => acc + v.length, 0);

  return (
    <aside className={mobile ? "w-full" : "w-full bg-gray-50 p-3 rounded-[7px] border border-[#186737] sticky top-4 self-start"}>
      {/* Header — desktop only */}
      {!mobile && (
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-[#186737]" />
          <span className="text-[14px] font-bold text-gray-800">Filters</span>
          {totalActive > 0 && (
            <span className="bg-[#186737] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] font-semibold text-red-500 hover:text-red-600 flex items-center gap-0.5 transition-colors"
          >
            <X size={11} />
            Clear All
          </button>
        )}
      </div>
      )}

      {/* Price Filter */}
      <div className="bg-white border border-gray-100 rounded-[7px] mb-2 overflow-hidden">
        <button
          onClick={() => setPriceOpen((p) => !p)}
          className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        >
          <span className="text-[13px] font-semibold text-gray-700">Price</span>
          {priceOpen ? (
            <ChevronUp size={13} className="text-gray-400" />
          ) : (
            <ChevronDown size={13} className="text-gray-400" />
          )}
        </button>
        {priceOpen && (
          <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span>$ {priceRange.min.toLocaleString()} (Min)</span>
              <span>$ {priceRange.max.toLocaleString()} (Max)</span>
            </div>
            <input
              type="range"
              min={10}
              max={78000}
              step={10}
              value={priceRange.max}
              onChange={(e) =>
                onPriceChange({ ...priceRange, max: Number(e.target.value) })
              }
              className="w-full accent-[#186737]"
            />
            <div className="flex gap-2">
              <div className="flex-1 border border-gray-200 rounded-[7px] px-2 py-1.5 flex items-center gap-1">
                <span className="text-[10px] text-gray-400">$</span>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    onPriceChange({ ...priceRange, min: Number(e.target.value) })
                  }
                  className="w-full text-[12px] text-gray-700 outline-none bg-transparent"
                  placeholder="Min"
                />
              </div>
              <div className="flex-1 border border-gray-200 rounded-[7px] px-2 py-1.5 flex items-center gap-1">
                <span className="text-[10px] text-gray-400">$</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    onPriceChange({ ...priceRange, max: Number(e.target.value) })
                  }
                  className="w-full text-[12px] text-gray-700 outline-none bg-transparent"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="bg-white border border-gray-100 rounded-[7px] overflow-hidden mb-2">
        <button
          onClick={() => {}}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="text-[13px] font-semibold text-gray-700">Brand</span>
          <div className="flex items-center gap-2">
            {selectedBrands.length > 0 && (
              <span
                onClick={(e) => { e.stopPropagation(); onClearBrands(); }}
                className="text-[10px] font-semibold text-red-500 hover:text-red-600 cursor-pointer transition-colors"
              >
                Clear
              </span>
            )}
            <ChevronUp size={13} className="text-gray-400" />
          </div>
        </button>
        <div className="px-4 pb-3 space-y-2">
          {visibleBrands.map((brand) => (
            <label key={brand.name} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.name)}
                onChange={() => onBrandToggle(brand.name)}
                className="w-3.5 h-3.5 accent-[#186737] rounded"
              />
              <span className="text-[12px] text-gray-600 group-hover:text-gray-800 transition-colors flex-1">
                {brand.name}
              </span>
              <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">
                {brand.count}
              </span>
            </label>
          ))}
          {BRANDS.length > 5 && (
            <button
              onClick={() => setShowAllBrands((p) => !p)}
              className="text-[11px] font-semibold text-[#186737] hover:text-[#1e5230] mt-1 transition-colors"
            >
              {showAllBrands ? "Show Less" : `See More (${BRANDS.length - 5})`}
            </button>
          )}
        </div>
      </div>

      {/* Dynamic attribute filters */}
      {ATTRIBUTE_FILTERS.map((group) => (
        <CheckboxSection
          key={group.label}
          label={group.label}
          options={group.options}
          selected={selectedAttrs[group.label] ?? []}
          onToggle={(val) => onAttrToggle(group.label, val)}
          onClear={() => onClearAttr(group.label)}
          defaultOpen={["Nominal Height", "Nominal Width", "Capacity"].includes(group.label)}
        />
      ))}

      {/* Trust badges — desktop only */}
      {!mobile && (
        <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-[7px] space-y-2">
          <div className="flex items-center gap-2">
            <Truck size={13} className="text-[#186737]" />
            <span className="text-[11px] font-medium text-[#186737]">Fast & Reliable Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={13} className="text-[#186737]" />
            <span className="text-[11px] font-medium text-[#186737]">NSF & UL Certified Products</span>
          </div>
        </div>
      )}
    </aside>
  );
}

