"use client";

import ProductCard from "@/components/product-card";
import { generateDynamicCSSProductCard } from "@/utils/dynamic-css";
import { FeaturedCategory, LocalizedString } from "@/utils/types";
import { useLocale } from "next-intl";
import { useState } from "react";

function str(v: LocalizedString | string | undefined, locale = "en"): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return locale === "ar" ? (v.ar ?? v.en ?? "") : (v.en ?? v.ar ?? "");
}

export const FeaturedProducts = ({ products = [] }: { products?: FeaturedCategory[] }) => {
  const locale = useLocale();
  const [activeIdx, setActiveIdx] = useState(0);

  const activeGroup = products[activeIdx];
  const featuredProducts = (activeGroup?.products ?? []).slice(0, 10);

  if (!products.length) return null;

  return (
    <section className="w-full bg-white py-5">
      <div className="global-container">
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h2 className="heading-font-size font-bold text-slate-900 shrink-0">
            Featured Products
          </h2>
          <div className="flex items-center gap-1.5 mb-4 overflow-x-auto hide-scrollbar">
            {products.map((g, i) => (
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

        <div
          className="w-full h-px bg-slate-100 mb-4 mx-4 sm:mx-0"
          style={{ width: "calc(100% - 2rem)" }}
        />

        {/* MOBILE — horizontal scroll */}
        <div className="flex sm:hidden gap-3 overflow-x-auto hide-scrollbar md:px-4 pb-2">
          {featuredProducts.map((product) => (
            <div key={product.id} className="shrink-0 w-[175px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* TABLET + DESKTOP — grid */}
        <div className={generateDynamicCSSProductCard}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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

export default FeaturedProducts;
