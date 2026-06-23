"use client";

import ProductCard from "@/components/product-card";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { generateDynamicCSSProductCard } from "@/utils/dynamic-css";
import type { ApiProductRaw, FeaturedCategoryTab } from "@/utils/types";
import { useState } from "react";
import { ProductCardSkeleton } from "@/components/loading-sketlon";

export const FeaturedProducts = ({
  tabs = [],
  initialProducts = [],
}: {
  tabs?: FeaturedCategoryTab[];
  initialProducts?: ApiProductRaw[];
}) => {
  const [activeIdx, setActiveIdx]   = useState(0);
  const [products, setProducts]     = useState<ApiProductRaw[]>(initialProducts);
  const [loading, setLoading]       = useState(false);

  if (!tabs.length) return null;

  const handleTabClick = async (idx: number) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    setLoading(true);
    try {
      const res = await makeApiRequest<{ data: ApiProductRaw[] }>(
        apiUrls.FEATURED_CATEGORY_TABS,
        { params: { category_id: tabs[idx].id } },
      );
      setProducts(res?.data ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const displayProducts = products.slice(0, 12);

  return (
    <section className="w-full bg-white py-5">
      <div className="global-container">
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h2 className="heading-font-size font-bold text-slate-900 shrink-0">
           Featured Products
          </h2>
          <div className="flex items-center gap-1.5 mb-4 overflow-x-auto hide-scrollbar">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(i)}
                className={[
                  "whitespace-nowrap px-3.5 py-1.5 md:text-[15px] text-[12px] font-medium rounded-full shrink-0 transition-all duration-200",
                  activeIdx === i
                    ? "bg-[#186737] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200",
                ].join(" ")}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div
          className="w-full h-px bg-slate-100 mb-4 mx-4 sm:mx-0"
          style={{ width: "calc(100% - 2rem)" }}
        />

        {loading ? (
          <div className={generateDynamicCSSProductCard}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton/>
            ))}
          </div>
        ) : (
          <>
            {/* MOBILE — horizontal scroll */}
            <div className="flex sm:hidden gap-3 overflow-x-auto hide-scrollbar md:px-4 pb-2">
              {displayProducts.map((product) => (
                <div key={product.id} className="shrink-0 w-[175px]">
                  <ProductCard product={product as any} />
                </div>
              ))}
            </div>

            {/* TABLET + DESKTOP — grid */}
            <div className={generateDynamicCSSProductCard}>
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
