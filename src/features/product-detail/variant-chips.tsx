"use client";

import { Check } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import type { ProductAttribute, VariantItem } from "./types";
import { VariantCompareDrawer } from "./variant-compare-drawer";
import {
  chooseHeading,
  isCapacityGroup,
  sortVariants,
  splitChipLabel,
  unitFromLabel,
} from "./variant-utils";

type VariantChipsProps = {
  label: string;
  variants: VariantItem[];
  selectedValue: string;
  currency: string;
  loading: boolean;
  currentAttributes: ProductAttribute[];
  compareOpen: boolean;
  onCompareOpenChange: (open: boolean) => void;
  onPick: (value: string) => void;
};

export function VariantChips({
  label,
  variants,
  selectedValue,
  currency,
  loading,
  currentAttributes,
  compareOpen,
  onCompareOpenChange,
  onPick,
}: VariantChipsProps) {
  const list = sortVariants(variants);
  const unit = unitFromLabel(label);
  const heading = chooseHeading(label);
  const optionLabel = label.replace(/\s*\([^)]*\)\s*$/, "").trim() || "Option";
  const groupRef = useRef<HTMLDivElement>(null);
  const capacityGroup = isCapacityGroup(label);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = list.findIndex((v) => v.attribute_value === selectedValue);
    const next =
      event.key === "ArrowRight"
        ? list[(index + 1 + list.length) % list.length]
        : list[(index - 1 + list.length) % list.length];
    if (next) onPick(next.attribute_value);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[13px] font-semibold text-gray-900 mb-2.5">{heading}</p>
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label={heading}
          onKeyDown={onKeyDown}
          className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1 md:flex-wrap md:overflow-visible md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {list.map((v) => {
            const active = v.attribute_value === selectedValue;
            const { primary, secondary } = splitChipLabel(
              v.attribute_value,
              unit,
            );
            const compact = primary.length <= 4;
            return (
              <button
                key={v.sku + v.attribute_value}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={loading}
                onClick={() => onPick(v.attribute_value)}
                className={`relative snap-start shrink-0 min-w-[4.75rem] max-w-[8.75rem] min-h-[4.75rem] px-3 py-2.5 rounded-[13px] border flex flex-col items-center justify-center gap-0.5 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#186737]/30 disabled:opacity-50 ${
                  active
                    ? "border-[#186737] bg-[#eef8f1] shadow-sm"
                    : "border-gray-200 bg-white hover:border-[#186737]/50 hover:bg-[#f8faf9]"
                }`}
              >
                {active && (
                  <Check
                    size={12}
                    strokeWidth={2.5}
                    className="absolute top-1.5 right-1.5 text-[#186737]"
                  />
                )}
                <span
                  className={`leading-tight font-semibold break-words ${
                    compact ? "text-[20px]" : "text-[14px]"
                  } ${active ? "text-[#186737]" : "text-gray-900"}`}
                >
                  {primary}
                </span>
                {secondary ? (
                  <span className="text-[11px] leading-tight text-gray-500 line-clamp-2">
                    {secondary}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {list.length > 1 && (
        <button
          type="button"
          onClick={() => onCompareOpenChange(true)}
          className="text-[13px] font-semibold text-[#186737] underline underline-offset-4 hover:text-[#145c2e]"
        >
          Compare All Sizes
        </button>
      )}

      <VariantCompareDrawer
        open={compareOpen}
        onOpenChange={onCompareOpenChange}
        title={capacityGroup ? "Compare sizes" : `Compare ${optionLabel}`}
        optionLabel={optionLabel}
        unit={unit}
        currency={currency}
        variants={list}
        selectedValue={selectedValue}
        currentAttributes={currentAttributes}
        onSelect={(value) => {
          onCompareOpenChange(false);
          onPick(value);
        }}
      />
    </div>
  );
}
