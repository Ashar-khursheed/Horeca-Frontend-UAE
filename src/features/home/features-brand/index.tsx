"use client";

import ProductCard from "@/components/product-card";
import { useLocale } from "next-intl";
import { useState } from "react";
import { FeaturedCategory, LocalizedString } from "@/utils/types";
import { mapBrandProductToCardProduct } from "@/utils/homepage-payload";

function str(v: LocalizedString | string | undefined, locale = "en"): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return locale === "ar" ? (v.ar ?? v.en ?? "") : (v.en ?? v.ar ?? "");
}

// ─── FeaturedProducts Component ───────────────────────────────────────────────
export const FeaturedBrands = ({
  products = [],
}: {
  products?: FeaturedCategory[];
}) => {
  const locale = useLocale();
  const [activeIdx, setActiveIdx] = useState(0);

  // API can return brands with an empty featured_products list (e.g. filtered
  // out for the current country) — skip those so a tab never renders blank.
  const brandsWithProducts = products.filter(
    (g) => (g.featured_products?.length ?? 0) > 0,
  );

  const activeGroup = brandsWithProducts[activeIdx] ?? brandsWithProducts[0];
  const featuredProducts = (activeGroup?.featured_products ?? [])
    .slice(0, 12)
    .map(mapBrandProductToCardProduct);

  if (!brandsWithProducts.length) return null;

  return (
    <section className="w-full bg-white py-5">
      <div className="global-container">
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 mb-3  flex-wrap">
          <h2 className="heading-font-size font-bold text-slate-900 shrink-0">
          Featured Brands
          </h2>
          <div className="flex items-center gap-1.5 mb-4 overflow-x-auto hide-scrollbar ">
            {brandsWithProducts.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={[
                  "whitespace-nowrap px-3.5 py-1.5 md:text-[15px] text-[12px] font-medium rounded-full shrink-0 transition-all duration-200",
                  activeIdx === i
                    ? "bg-[#186737] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200",
                ].join(" ")}
              >
                {str(g.name, locale)}
              </button>
            ))}
          </div>
        </div>

        {/* ── TABS ─────────────────────────────────────────────────────── */}

        <div
          className="w-full h-px bg-slate-100 mb-4 mx-4 sm:mx-0"
          style={{ width: "calc(100% - 2rem)" }}
        />

        {/* ── PRODUCT LIST ──────────────────────────────────────────────
            Mobile  : horizontal scroll, each card 180px wide
            Tablet  : 3-col grid
            Desktop : 5-col grid
        ────────────────────────────────────────────────────────────────*/}

        <div className="flex sm:grid gap-3 overflow-x-auto sm:overflow-visible hide-scrollbar max-sm:pb-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="shrink-0 w-[175px] sm:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default FeaturedBrands;
