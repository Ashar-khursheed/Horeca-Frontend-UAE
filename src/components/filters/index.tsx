"use client";

import { Slider } from "@/components/ui/slider";
import type { FixedFilterItem, RangeFilterItem } from "@/utils/types";
import { ChevronDown, ChevronUp, Shield, SlidersHorizontal, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PriceRange {
  min: number;
  max: number;
}


function AccordionSection({
  label,
  hasActive,
  onClear,
  defaultOpen = false,
  children,
}: {
  label: string;
  hasActive?: boolean;
  onClear?: () => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-gray-100 rounded-[7px] overflow-hidden mb-2">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
      >
        <span className="text-[13px] font-semibold text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          {hasActive && onClear && (
            <span
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="text-[10px] font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Clear
            </span>
          )}
          {open ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
        </div>
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({
  priceRange,
  onPriceChange,
  selectedBrands,
  onBrandToggle,
  onClearBrands,
  onClearAll,
  mobile = false,
  brands: apiBrands,
  categories: apiCategories,
  selectedCategories = [],
  onCategoryToggle,
  onClearCategories,
  priceMin = 10,
  priceMax = 78000,
  rangeFilters,
  fixedFilters,
  selectedRangeFilters,
  onRangeFilterToggle,
  onClearRangeFilter,
  selectedFixedFilters,
  onFixedFilterToggle,
  onClearFixedFilter,
  currency,
  loading = false,
}: {
  priceRange: PriceRange;
  onPriceChange: (range: PriceRange) => void;
  selectedBrands: { id: number; name: string }[];
  onBrandToggle: (brand: { id: number; name: string }) => void;
  onClearBrands: () => void;
  onClearAll: () => void;
  mobile?: boolean;
  brands?: { id: number; name: string; thumbnail: string | null }[];
  categories?: { id: number; name: string; url: string }[];
  selectedCategories?: { id: number; name: string }[];
  onCategoryToggle?: (cat: { id: number; name: string }) => void;
  onClearCategories?: () => void;
  priceMin?: number;
  priceMax?: number;
  rangeFilters?: Record<string, RangeFilterItem> | null;
  fixedFilters?: Record<string, FixedFilterItem> | null;
  selectedRangeFilters: Record<number, { min: number; max: number }[]>;
  onRangeFilterToggle: (attrId: number, range: { min: number; max: number }) => void;
  onClearRangeFilter: (attrId: number) => void;
  selectedFixedFilters: Record<number, string[]>;
  onFixedFilterToggle: (attrId: number, val: string) => void;
  onClearFixedFilter: (attrId: number) => void;
  currency?: string;
  loading?: boolean;
}) {

  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [localPrice, setLocalPrice] = useState<PriceRange>(priceRange);

  useEffect(() => {
    setLocalPrice(priceRange);
  }, [priceRange]);

  const brandList = apiBrands ?? [];
  const visibleBrands = showAllBrands ? brandList : brandList.slice(0, 5);

  const categoryList = apiCategories ?? [];
  const visibleCategories = showAllCategories ? categoryList : categoryList.slice(0, 5);

  const rangeFilterList = Object.values(rangeFilters ?? {});
  const fixedFilterList = Object.values(fixedFilters ?? {});
  const currencySymbol = currency

  const totalActive =
    selectedBrands.length +
    Object.values(selectedRangeFilters).reduce((a, v) => a + v.length, 0) +
    Object.values(selectedFixedFilters).reduce((a, v) => a + v.length, 0);

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
      <AccordionSection
        label="Price"
        defaultOpen
        hasActive={!loading && (priceRange.min !== priceMin || priceRange.max !== priceMax)}
        onClear={() => onPriceChange({ min: priceMin, max: priceMax })}
      >
        {loading ? (
          <div className="space-y-3 pt-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-2 bg-gray-200 rounded-full w-full" />
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <p className="text-center text-[12px] font-semibold text-gray-700">
              {currencySymbol} {localPrice.min.toLocaleString()} &ndash; {currencySymbol} {localPrice.max.toLocaleString()}
            </p>
            <Slider
              min={priceMin}
              max={priceMax}
              step={1}
              value={[localPrice.min, localPrice.max]}
              onValueChange={([min, max]) => setLocalPrice({ min, max })}
              onValueCommit={([min, max]) => onPriceChange({ min, max })}
            />
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
              <span>{currencySymbol} {priceMin.toLocaleString()} (Min)</span>
              <span>{currencySymbol} {priceMax.toLocaleString()} (Max)</span>
            </div>
          </div>
        )}
      </AccordionSection>

      {/* Brand Filter */}
      {brandList.length > 0 && (
        <AccordionSection
          label="Brand"
          defaultOpen
          hasActive={selectedBrands.length > 0}
          onClear={onClearBrands}
        >
          <div className="space-y-2 pt-1">
            {visibleBrands.map((brand) => (
              <label key={brand.id || brand.name} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.some((b) => b.id === brand.id)}
                  onChange={() => onBrandToggle({ id: brand.id, name: brand.name })}
                  className="w-3.5 h-3.5 accent-[#186737] rounded flex-shrink-0"
                />
                <span className="text-[12px] text-gray-600 group-hover:text-gray-800 transition-colors flex-1 leading-tight">
                  {brand.name}
                </span>
              </label>
            ))}
            {brandList.length > 5 && (
              <button
                onClick={() => setShowAllBrands((p) => !p)}
                className="text-[11px] font-semibold text-[#186737] hover:text-[#1e5230] mt-1 transition-colors"
              >
                {showAllBrands ? "Show Less" : `See More (${brandList.length - 5})`}
              </button>
            )}
          </div>
        </AccordionSection>
      )}

      {/* Category Filter */}
      {categoryList.length > 0 && (
        <AccordionSection
          label="Category"
          defaultOpen
          hasActive={selectedCategories.length > 0}
          onClear={onClearCategories}
        >
          <div className="space-y-2 pt-1">
            {visibleCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.some((c) => c.id === cat.id)}
                  onChange={() => onCategoryToggle?.({ id: cat.id, name: cat.name })}
                  className="w-3.5 h-3.5 accent-[#186737] rounded flex-shrink-0"
                />
                <span className="text-[12px] text-gray-600 group-hover:text-gray-800 transition-colors flex-1 leading-tight">
                  {cat.name}
                </span>
              </label>
            ))}
            {categoryList.length > 5 && (
              <button
                onClick={() => setShowAllCategories((p) => !p)}
                className="text-[11px] font-semibold text-[#186737] hover:text-[#1e5230] mt-1 transition-colors"
              >
                {showAllCategories ? "Show Less" : `See More (${categoryList.length - 5})`}
              </button>
            )}
          </div>
        </AccordionSection>
      )}

      {/* Range Filters */}
      {rangeFilterList.map((filter) => {
        const selected = selectedRangeFilters[filter.attribute_id] ?? [];
        return (
          <AccordionSection
            key={filter.attribute_id}
            label={filter.attribute_name}
            hasActive={selected.length > 0}
            onClear={() => onClearRangeFilter(filter.attribute_id)}
          >
            <div className="space-y-2 pt-1">
              {filter.ranges.map((range) => {
                const isChecked = selected.some((r) => r.min === range.min && r.max === range.max);
                return (
                  <label key={`${range.min}-${range.max}`} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onRangeFilterToggle(filter.attribute_id, range)}
                      className="w-3.5 h-3.5 accent-[#186737] rounded flex-shrink-0"
                    />
                    <span className="text-[12px] text-gray-600 group-hover:text-gray-800 transition-colors flex-1 leading-tight">
                      {range.min} – {range.max} {filter.unit_symbol}
                    </span>
                  </label>
                );
              })}
            </div>
          </AccordionSection>
        );
      })}

      {/* Fixed Filters */}
      {fixedFilterList.map((filter) => {
        const selected = selectedFixedFilters[filter.attribute_id] ?? [];
        return (
          <AccordionSection
            key={filter.attribute_id}
            label={filter.attribute_name}
            hasActive={selected.length > 0}
            onClear={() => onClearFixedFilter(filter.attribute_id)}
          >
            <div className="space-y-2 pt-1">
              {filter.values.map((val) => (
                <label key={val} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selected.includes(val)}
                    onChange={() => onFixedFilterToggle(filter.attribute_id, val)}
                    className="w-3.5 h-3.5 accent-[#186737] rounded flex-shrink-0"
                  />
                  <span className="text-[12px] text-gray-600 group-hover:text-gray-800 transition-colors flex-1 leading-tight">
                    {val}
                  </span>
                </label>
              ))}
            </div>
          </AccordionSection>
        );
      })}

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
