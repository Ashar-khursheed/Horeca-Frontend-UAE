"use client";

import ProductCard from "@/components/product-card";
import { FEATURED_DATA_TWO } from "@/data";
import { generateDynamicCSSProductCard } from "@/utils/dynamic-css";
import { useState } from "react";

// ─── FeaturedProducts Component ───────────────────────────────────────────────
export const FeaturedBrands = () => {
  const tabs = FEATURED_DATA_TWO.map((g) => g.brand_name);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const activeGroup = FEATURED_DATA_TWO.find((g) => g.brand_name === activeTab);
  const products = activeGroup?.products?.slice(0, 10) ?? [];

  return (
    <section className="w-full bg-white py-5">
      <div className="global-container">
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 mb-3 px-4 sm:px-0 flex-wrap">
          <h2 className="heading-font-size font-bold text-slate-900 shrink-0">
          Top Stories: Brand Directory
          </h2>
          <div className="flex items-center gap-1.5 mb-4 overflow-x-auto hide-scrollbar ">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  "whitespace-nowrap px-3.5 py-1.5 text-[15px] font-medium rounded-full flex-shrink-0 transition-all duration-200",
                  activeTab === tab
                    ? "bg-[#186737] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200",
                ].join(" ")}
              >
                {tab}
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

        {/* MOBILE — horizontal scroll */}
        <div className="flex sm:hidden gap-3 overflow-x-auto hide-scrollbar px-4 pb-2">
          {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[175px]">
                <ProductCard
                  product={{ ...product, images: [...product.images], alt_tags: [] }}
                  onAddToCart={(p, qty) => console.log("Cart:", p.name, qty)}
                  onWishlistToggle={(p, w) => console.log("Wishlist:", p.name, w)}
                />
              </div>
            ))}
        </div>

        {/* TABLET + DESKTOP — grid */}
          {/* <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-5 2xl:grid-cols-6  3xl:grid-cols-6 gap-3"> */}
          <div className={generateDynamicCSSProductCard}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, images: [...product.images], alt_tags: [] }}
              onAddToCart={(p, qty) => console.log("Cart:", p.name, qty)}
              onWishlistToggle={(p, w) => console.log("Wishlist:", p.name, w)}
            />
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
