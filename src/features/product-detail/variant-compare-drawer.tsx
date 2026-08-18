"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ProductAttribute, ProductDetailResponse, VariantItem } from "./types";
import {
  attributesToMap,
  formatMoney,
  lookupSpec,
  pickCompareColumns,
  variantPrice,
  variantSlug,
} from "./variant-utils";

const specCache = new Map<string, Record<string, string>>();

type VariantCompareDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  optionLabel: string;
  unit: string;
  currency: string;
  variants: VariantItem[];
  selectedValue: string;
  currentAttributes: ProductAttribute[];
  onSelect: (value: string) => void;
};

export function VariantCompareDrawer({
  open,
  onOpenChange,
  title,
  optionLabel,
  unit,
  currency,
  variants,
  selectedValue,
  currentAttributes,
  onSelect,
}: VariantCompareDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [specs, setSpecs] = useState<Record<string, Record<string, string>>>(
    {},
  );
  const [loadingSpecs, setLoadingSpecs] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const selected = variants.find((v) => v.attribute_value === selectedValue);
    const next: Record<string, Record<string, string>> = {};
    if (selected) {
      const selectedMap = attributesToMap(currentAttributes);
      specCache.set(selected.sku, selectedMap);
      next[selected.sku] = selectedMap;
    }

    for (const variant of variants) {
      const cached = specCache.get(variant.sku);
      if (cached) next[variant.sku] = cached;
    }
    setSpecs({ ...next });

    const missing = variants.filter((variant) => !specCache.has(variant.sku));
    if (!missing.length) {
      setLoadingSpecs(false);
      return;
    }

    setLoadingSpecs(true);

    const loadOne = async (variant: VariantItem) => {
      if (specCache.has(variant.sku)) return;
      const slug = variantSlug(variant.url);
      if (!slug) return;
      try {
        const res = await makeApiRequest<{ data: ProductDetailResponse }>(
          apiUrls.PRODUCT_DETAIL(slug),
        );
        const map = attributesToMap(res?.data?.attributes ?? []);
        if (Object.keys(map).length) specCache.set(variant.sku, map);
        next[variant.sku] = map;
      } catch {
        next[variant.sku] = {};
      }
      if (!cancelled) setSpecs({ ...next });
    };

    const load = async () => {
      for (let i = 0; i < missing.length; i += 3) {
        if (cancelled) return;
        await Promise.all(missing.slice(i, i + 3).map(loadOne));
      }
      if (!cancelled) setLoadingSpecs(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [variants, selectedValue, currentAttributes]);

  const specColumns = useMemo(
    () => pickCompareColumns(Object.values(specs)),
    [specs],
  );

  const columns = [optionLabel || "Option", "Model", ...specColumns, "Price", ""];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        showCloseButton={false}
        className={
          isMobile
            ? "h-[88dvh] max-h-[88dvh] rounded-t-2xl sm:max-w-none gap-0 p-0"
            : "w-full sm:max-w-5xl gap-0 p-0"
        }
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-lg text-gray-900">{title}</SheetTitle>
              <SheetDescription className="text-sm text-gray-500 mt-0.5">
                {loadingSpecs && specColumns.length === 0
                  ? "Loading comparison specs…"
                  : "Only the specs that change between these options."}
              </SheetDescription>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center shrink-0"
              aria-label="Close comparison"
            >
              <X size={16} />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[720px] text-left text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 z-20 bg-white">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={`${col}-${i}`}
                    className={`px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-100 bg-white whitespace-nowrap ${
                      i === 0 ? "sticky left-0 z-30 min-w-[88px]" : "min-w-[92px]"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => {
                const active = v.attribute_value === selectedValue;
                const row = specs[v.sku];
                const loaded = row != null;
                const price = variantPrice(v);
                return (
                  <tr
                    key={v.sku + v.attribute_value}
                    className={active ? "bg-[#f3faf6]" : "bg-white"}
                  >
                    <td
                      className={`px-3 py-3 font-semibold text-gray-900 sticky left-0 z-10 border-b border-gray-100 ${
                        active ? "bg-[#f3faf6]" : "bg-white"
                      }`}
                    >
                      {v.attribute_value}
                      {unit && !v.attribute_value.toLowerCase().includes(unit.toLowerCase().replace(/\.$/, ""))
                        ? ` ${unit}`
                        : ""}
                    </td>
                    <td className="px-3 py-3 text-gray-700 border-b border-gray-100">
                      {v.sku}
                    </td>
                    {specColumns.map((col) => (
                      <td
                        key={col}
                        className="px-3 py-3 text-gray-600 border-b border-gray-100 whitespace-nowrap"
                      >
                        {loaded ? lookupSpec(row, col) || "—" : "…"}
                      </td>
                    ))}
                    <td className="px-3 py-3 font-semibold text-gray-900 border-b border-gray-100 whitespace-nowrap">
                      {currency}
                      {formatMoney(price)}
                    </td>
                    <td className="px-3 py-3 border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => onSelect(v.attribute_value)}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                          active
                            ? "bg-[#186737] text-white"
                            : "bg-white border border-gray-200 text-gray-700 hover:border-[#186737] hover:text-[#186737]"
                        }`}
                      >
                        {active ? "Selected" : "Select"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
