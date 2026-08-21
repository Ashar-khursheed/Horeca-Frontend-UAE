"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ProductAttribute, VariantItem } from "./types";
import { VariantChips } from "./variant-chips";
import { variantHref, isChipGroup } from "./variant-utils";

interface VariantGroup {
  attribute_id: string;
  label: string;
  type: string;
  variants: VariantItem[];
}

interface ProductVariantProps {
  variants: VariantItem[];
  currency: string;
  parentId: number;
  currentAttributes?: ProductAttribute[];
}

const fmtP = (n: number) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function ProductVariant({
  variants,
  currency,
  parentId,
  currentAttributes = [],
}: ProductVariantProps) {
  const router = useRouter();
  const [groups, setGroups]     = useState<VariantGroup[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [hovered, setHovered]   = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const [compareOpenFor, setCompareOpenFor] = useState<string | null>(null);

  useEffect(() => {
    if (!variants?.length) return;
    const map: Record<string, VariantGroup> = {};
    const init: Record<string, string> = {};
    variants.forEach((v) => {
      if (!map[v.attribute_id]) {
        map[v.attribute_id] = { attribute_id: v.attribute_id, label: v.label, type: v.type, variants: [] };
      }
      map[v.attribute_id].variants.push(v);
      if (v.selected) init[v.attribute_id] = v.attribute_value;
    });
    setGroups(Object.values(map));
    setSelected(init);
  }, [variants]);

  useEffect(() => {
    groups.forEach((g) => {
      g.variants.forEach((v) => {
        const href = variantHref(v.url);
        if (href) router.prefetch(href);
      });
    });
  }, [groups, router]);

  const goToSlug = (slug: string) => {
    const path = slug.startsWith("/") ? slug : `/${slug}`;
    router.push(`${path}#product-purchase`);
  };

  const pick = async (attrId: string, value: string) => {
    const nextSelected = { ...selected, [attrId]: value };
    setSelected(nextSelected);
    const group = groups.find((g) => g.attribute_id === attrId);
    const match = group?.variants.find((v) => v.attribute_value === value);
    if (groups.length === 1 && match?.url) {
      const href = variantHref(match.url);
      if (href) {
        router.push(`${href}#product-purchase`);
        return;
      }
    }
    setLoading(true);
    try {
      const attribute = Object.entries(nextSelected).map(([id, val]) => ({
        attribute_id: id,
        attribute_value: val,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await makeApiRequest<any>("frontend/attribute-product-variants", {
        method: "POST",
        data: { parent_id: parentId, attribute },
      });
      const slug: string | undefined = res?.data?.[0]?.full_slug;
      if (slug) goToSlug(slug);
    } catch {
      // ignore — stay on current page
    } finally {
      setLoading(false);
    }
  };

  const onEnter = (attrId: string, value: string) =>
    setHovered((p) => ({ ...p, [attrId]: value }));
  const onLeave = (attrId: string) =>
    setHovered((p) => { const n = { ...p }; delete n[attrId]; return n; });

  const displayVal = (attrId: string) => hovered[attrId] || selected[attrId] || "";

  if (!groups.length) return null;

  return (
    <div className="w-full space-y-4">
      {groups.map((g) => (
        <div key={g.attribute_id}>
          {g.type !== "tile" && (
            <p className="lg:text-sm text-[12px] font-semibold text-gray-800 mb-2">
              {g.label}:{" "}
              <span className="text-[#186737] font-bold">{displayVal(g.attribute_id)}</span>
            </p>
          )}

          {(g.type === "tile" && isChipGroup(g.label, g.type)) && (
            <VariantChips
              label={g.label}
              variants={g.variants}
              selectedValue={selected[g.attribute_id] || ""}
              currency={currency}
              loading={loading}
              currentAttributes={currentAttributes}
              compareOpen={compareOpenFor === g.attribute_id}
              onCompareOpenChange={(open) =>
                setCompareOpenFor(open ? g.attribute_id : null)
              }
              onPick={(value) => pick(g.attribute_id, value)}
            />
          )}

          {/* Compact pills for other tile groups (voltage, BTU, unit type) */}
          {g.type === "tile" && !isChipGroup(g.label, g.type) && (
            <div>
              <p className="lg:text-sm text-[12px] font-semibold text-gray-800 mb-2">
                {g.label}:{" "}
                <span className="text-[#186737] font-bold">
                  {displayVal(g.attribute_id)}
                </span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {g.variants.map((v) => {
                  const active = selected[g.attribute_id] === v.attribute_value;
                  return (
                    <button
                      key={v.sku + v.attribute_value}
                      type="button"
                      disabled={loading}
                      onClick={() => pick(g.attribute_id, v.attribute_value)}
                      onMouseEnter={() => onEnter(g.attribute_id, v.attribute_value)}
                      onMouseLeave={() => onLeave(g.attribute_id)}
                      className={`px-3 py-1.5 rounded-[7px] border text-sm transition-all disabled:opacity-50 ${
                        active
                          ? "border-[#186737] bg-[#186737] text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-800 hover:border-[#186737] hover:text-[#186737]"
                      }`}
                    >
                      {v.attribute_value}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SWATCHES ─────────────────────────────────────────────────── */}
          {g.type === "swatches" && (
            <div className="flex gap-2 flex-wrap">
              {g.variants.map((v) => {
                const active = selected[g.attribute_id] === v.attribute_value;
                const img = v.images?.[0];
                return (
                  <button
                    key={v.sku + v.attribute_value}
                    type="button"
                    disabled={loading}
                    title={v.attribute_value}
                    onClick={() => pick(g.attribute_id, v.attribute_value)}
                    onMouseEnter={() => onEnter(g.attribute_id, v.attribute_value)}
                    onMouseLeave={() => onLeave(g.attribute_id)}
                    className={`w-[72px] h-[72px] rounded-[7px] border-2 overflow-hidden transition-all duration-150 hover:border-[#186737] hover:shadow-sm disabled:opacity-50 ${
                      active ? "border-[#186737] shadow-sm" : "border-gray-200"
                    }`}
                  >
                    {img ? (
                      <img src={img} alt={v.attribute_value} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-[10px] text-gray-500 text-center px-1">{v.attribute_value}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── IMAGE ────────────────────────────────────────────────────── */}
          {g.type === "image" && (
            <div className="flex gap-2 flex-wrap">
              {g.variants.map((v) => {
                const active = selected[g.attribute_id] === v.attribute_value;
                const img = v.images?.[0];
                return (
                  <button
                    key={v.sku + v.attribute_value}
                    type="button"
                    disabled={loading}
                    onClick={() => pick(g.attribute_id, v.attribute_value)}
                    onMouseEnter={() => onEnter(g.attribute_id, v.attribute_value)}
                    onMouseLeave={() => onLeave(g.attribute_id)}
                    className={`flex flex-col items-center gap-1 p-1.5 rounded-[7px] border-2 transition-all duration-150 hover:border-[#186737] hover:shadow-sm disabled:opacity-50 ${
                      active ? "border-[#186737] bg-[#f0f9f4]" : "border-gray-200"
                    }`}
                    style={{ width: "80px" }}
                  >
                    <div className="w-full h-[54px] rounded overflow-hidden bg-gray-50">
                      {img ? (
                        <img src={img} alt={v.attribute_value} className="w-full h-full object-contain p-1" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[9px] text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold text-center leading-tight line-clamp-2 ${active ? "text-[#186737]" : "text-gray-700"}`}>
                      {v.attribute_value}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── CHECKBOX ─────────────────────────────────────────────────── */}
          {g.type === "checkbox" && (
            <div className="flex flex-col gap-2">
              {g.variants.map((v) => {
                const active = selected[g.attribute_id] === v.attribute_value;
                return (
                  <button
                    key={v.sku + v.attribute_value}
                    type="button"
                    disabled={loading}
                    onClick={() => pick(g.attribute_id, v.attribute_value)}
                    onMouseEnter={() => onEnter(g.attribute_id, v.attribute_value)}
                    onMouseLeave={() => onLeave(g.attribute_id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[7px] border text-left w-full transition-all disabled:opacity-50 ${
                      active ? "border-[#186737] bg-[#f0f9f4]" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                      active ? "border-[#186737] bg-[#186737]" : "border-gray-300"
                    }`}>
                      {active && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm flex-1 ${active ? "text-[#186737] font-semibold" : "text-gray-700"}`}>
                      {v.attribute_value}
                    </span>
                    <span className="text-sm font-bold text-gray-900 shrink-0">
                      {currency}{fmtP(v.sale_price && v.sale_price < v.price ? v.sale_price : v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── DROPDOWN ─────────────────────────────────────────────────── */}
          {g.type === "dropdown" && (
            <div className=" w-full max-w-[220px]">
              <select
                value={selected[g.attribute_id] || ""}
                disabled={loading}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) pick(g.attribute_id, val);
                }}
                className="w-full appearance-none px-3 py-2.5 pr-9 rounded-[7px] border border-gray-200 bg-white text-sm text-gray-800 cursor-pointer transition-all focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 disabled:opacity-50"
              >
                <option value="">Select {g.label}</option>
                {g.variants.map((v) => (
                  <option key={v.sku + v.attribute_value} value={v.attribute_value}>
                    {v.attribute_value}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* ── RADIO ────────────────────────────────────────────────────── */}
          {g.type === "radio" && (
            <div className="flex gap-2 flex-wrap">
              {g.variants.map((v) => {
                const active = selected[g.attribute_id] === v.attribute_value;
                return (
                  <button
                    key={v.sku + v.attribute_value}
                    type="button"
                    disabled={loading}
                    onClick={() => pick(g.attribute_id, v.attribute_value)}
                    onMouseEnter={() => onEnter(g.attribute_id, v.attribute_value)}
                    onMouseLeave={() => onLeave(g.attribute_id)}
                    className={`px-4 py-1.5 rounded-[7px] border text-sm transition-all disabled:opacity-50 ${
                      active
                        ? "border-[#186737] bg-[#186737] text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-800 hover:border-[#186737] hover:text-[#186737]"
                    }`}
                  >
                    {v.attribute_value}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 size={13} className="animate-spin text-[#186737]" />
          Updating selection…
        </div>
      )}
    </div>
  );
}
