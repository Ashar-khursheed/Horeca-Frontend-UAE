"use client";

import { ChevronDown, ChevronUp, Shield, SlidersHorizontal, Truck, X } from "lucide-react";
import { useState } from "react";
import type { RangeFilterItem, FixedFilterItem } from "@/utils/types";
import { Slider } from "@/components/ui/slider";

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
}: {
  priceRange: PriceRange;
  onPriceChange: (range: PriceRange) => void;
  selectedBrands: { id: number; name: string }[];
  onBrandToggle: (brand: { id: number; name: string }) => void;
  onClearBrands: () => void;
  onClearAll: () => void;
  mobile?: boolean;
  brands?: { id: number; name: string; thumbnail: string | null }[];
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
}) {
  const [showAllBrands, setShowAllBrands] = useState(false);

  const brandList = apiBrands ?? [];
  const visibleBrands = showAllBrands ? brandList : brandList.slice(0, 5);

  const rangeFilterList = Object.values(rangeFilters ?? {});
  const fixedFilterList = Object.values(fixedFilters ?? {});

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
        hasActive={priceRange.min !== priceMin || priceRange.max !== priceMax}
        onClear={() => onPriceChange({ min: priceMin, max: priceMax })}
      >
        <div className="space-y-3 pt-2">
          {/* Current range display */}
          <p className="text-center text-[12px] font-semibold text-gray-700">
            $ {priceRange.min.toLocaleString()} &ndash; $ {priceRange.max.toLocaleString()}
          </p>

          {/* Shadcn dual range slider */}
          <Slider
            min={priceMin}
            max={priceMax}
            step={1}
            value={[priceRange.min, priceRange.max]}
            onValueChange={([min, max]) => onPriceChange({ min, max })}
          />

          {/* Min / Max labels */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
            <span>$ {priceMin.toLocaleString()} (Min)</span>
            <span>$ {priceMax.toLocaleString()} (Max)</span>
          </div>
        </div>
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
