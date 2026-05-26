"use client";

import Breadcrumb from "@/components/breadcum";
import type { ApiCategory, ApiCategoryName } from "@/utils/types";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";

const getName = (name: ApiCategoryName | string, locale: string): string => {
  if (typeof name === "string") return name;
  return locale === "ar" ? (name.ar || name.en) : (name.en || name.ar);
};

const crumbs = [
  { label: "Home", href: "/" },
  { label: "All Categories", href: null },
];

interface SubItem {
  sub: ApiCategory;
  topSlug: string;    // root-level category slug → used as first URL segment
  parentSlug: string; // immediate parent slug → used as ?parent= query param
}

function flattenToLeaves(items: ApiCategory[], topSlug: string, parentSlug: string): SubItem[] {
  return items.flatMap((item) => {
    if (item.children.length === 0) {
      return [{ sub: item, topSlug, parentSlug }];
    }
    return flattenToLeaves(item.children, topSlug, item.slug);
  });
}

function SubCategoryCard({ sub, topSlug, parentSlug, locale }: SubItem & { locale: string }) {
  const displayName = getName(sub.name, locale);
  return (
   <>

<Link
     href={`/${topSlug}/${sub.slug}?parent=${parentSlug}`}
    className="group flex flex-col items-center bg-transparent border border-slate-200 rounded-[7px] overflow-hidden hover:border-[#186737] hover:shadow-md hover:-translate-y-1 transition-all duration-200"
  >
    <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-3">
      {sub.image_url ? (
          <img
            src={sub.image_url}
            alt={displayName}
            loading="lazy"
            className="w-full h-[150px] object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-3xl">📦</span>
        )}
    </div>
    <p className="lg:text-[13px] w-full bg-white md:text-[10px] font-semibold text-black group-hover:text-[#186737] text-center leading-snug px-2 py-2.5 transition-colors duration-200 line-clamp-2 flex justify-center items-center h-full">
      {displayName}
    </p>
  </Link></>
  );
}

export default function AllCategoriesPage({ categories }: { categories: ApiCategory[] }) {
  const locale = useLocale();
  const [activeId, setActiveId] = useState<number | null>(null);

  const selectedCategory = activeId === null ? null : categories.find((c) => c.id === activeId);

  const items: SubItem[] = selectedCategory
    ? flattenToLeaves(selectedCategory.children, selectedCategory.slug, selectedCategory.slug)
    : categories.flatMap((cat) => flattenToLeaves(cat.children, cat.slug, cat.slug));
  return (
    <>
      <Breadcrumb crumbs={crumbs} />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-100">
          <img
            src="https://www.thehorecastore.com/images/Banners/NewBanner/6%20Categories/Main%20Categories/Desktop/Restaurant%20Equipment/Hero%20Banner%20-%201920%20x%20450%20copy.webp"
            alt="All Categories"
            className="w-full"
          />
        </section>

        {/* Filter Tabs */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
          <div className="global-container">
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
              <button
                onClick={() => setActiveId(null)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  activeId === null
                    ? "bg-[#186737] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveId(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    activeId === cat.id
                      ? "bg-[#186737] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {getName(cat.name, locale)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-category Grid */}
        <section className="global-container py-6">
          <p className="text-xs text-gray-400 font-medium mb-4">
            Showing <span className="text-gray-700 font-bold">{items.length}</span> categories
            {selectedCategory && (
              <> in <span className="text-[#186737] font-bold">{getName(selectedCategory.name, locale)}</span></>
            )}
          </p>

          {items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">No categories found.</p>
          ) : (
            <div className={"grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2.5 md:gap-4"}>
              {items.map(({ sub, topSlug, parentSlug }) => (
                <SubCategoryCard key={sub.id} sub={sub} topSlug={topSlug} parentSlug={parentSlug} locale={locale} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
