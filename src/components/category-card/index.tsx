"use client";

import type { ApiCategory, ApiCategoryName } from "@/utils/types";
import Link from "next/link";
import { useLocale } from "next-intl";

const getName = (name: ApiCategoryName | string, locale: string): string => {
  if (typeof name === "string") return name;
  return locale === "ar" ? (name.ar || name.en) : (name.en || name.ar);
};

// Flatten ALL nested categories into a single list.
// URL is always /{root-slug}/{own-slug} — intermediate levels are skipped.
const flattenCategories = (
  cats: ApiCategory[],
  rootPath = ""
): { cat: ApiCategory; href: string }[] =>
  cats.flatMap((cat) => {
    const href = rootPath ? `${rootPath}/${cat.slug}` : `/${cat.slug}`;
    const nextRoot = rootPath || `/${cat.slug}`;
    return [{ cat, href }, ...flattenCategories(cat.children ?? [], nextRoot)];
  });

export default function CategoryCard({ categories = [] }: { categories?: ApiCategory[] }) {
  const locale = useLocale();
  const flat = flattenCategories(categories);

  return (
    <>
      {/* MOBILE — 2-row horizontal scroll */}
      <div className="sm:hidden overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
        <div className="grid grid-rows-2 grid-flow-col gap-x-3 gap-y-3 w-max">
          {flat.map(({ cat, href }) => (
            <Link key={cat.id} href={href} className="group flex flex-col items-center w-17">
              <div className="w-16 h-16 rounded-[7px] bg-[#f5f5f5] flex items-center justify-center p-2 mb-1.5">
                <img
                  src={cat.image_url}
                  alt={getName(cat.name, locale)}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] font-medium text-slate-700 text-center leading-tight line-clamp-2 w-full">
                {getName(cat.name, locale)}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* TABLET + DESKTOP — uniform grid */}
      <div className="hidden sm:grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
        {flat.slice(0, 16).map(({ cat, href }, i) => (
          <Link
            key={cat.id}
            href={href}
            className={`group flex flex-col items-center bg-gray-50 border border-slate-200 rounded-[7px] overflow-hidden hover:border-[#186737] hover:shadow-md hover:-translate-y-1 transition-all duration-200${i >= 14 ? " hidden 2xl:flex" : i >= 12 ? " hidden xl:flex" : i >= 10 ? " hidden lg:flex" : ""}`}
          >
            <div className="w-full aspect-square flex items-center justify-center p-3">
              <img
                src={cat.image_url}
                alt={getName(cat.name, locale)}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
              />
            </div>
            <p className="w-full bg-white text-[12px] font-semibold text-gray-800 group-hover:text-[#186737] text-center leading-snug px-2 py-2.5 transition-colors duration-200 line-clamp-2">
              {getName(cat.name, locale)}
            </p>
          </Link>
        ))}
      </div>
     

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
