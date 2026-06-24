import { makeApiCallSSR } from "@/apis/ssr-fetch";
import Image from "next/image";
import Link from "next/link";

type HomeCategoryItem = {
  id: number;
  name: { en: string } | string;
  image_url: string;
  slug: string;
  parent_slug: string;
  super_parent_slug: string;
  products_count: number;
};

export default async function ShopByCategories() {
  const res = await makeApiCallSSR<{ data: HomeCategoryItem[] }>(
    "frontend-categories",
    { category_type: "home" },
    { revalidate: 60 },
  );
  const categories = res?.data ?? [];

  return (
    <section className="w-full bg-white py-6 md:pb-6 pb-1">
      <div className="global-container mx-auto">

        <div className="flex items-center justify-between mb-5">
          <h2 className="heading-font-size font-bold text-slate-900 tracking-tight">
            Shop by Categories
          </h2>
          <Link
            href="/categories"
            className="sub-heading-font-size font-semibold text-[#186737] hover:underline underline-offset-2"
          >
            All Categories
          </Link>
        </div>

        {/* Mobile — 2-row horizontal scroll */}
        <div className="sm:hidden overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
          <div className="grid grid-rows-2 grid-flow-col gap-x-3 gap-y-3 w-max">
            {categories.map((cat) => {
              const href = `/${cat.super_parent_slug}/${cat.slug}`;
              const name = typeof cat.name === "string" ? cat.name : cat.name.en;
              return (
                <Link key={cat.id} href={href} className="group flex flex-col items-center w-17">
                  <div className="w-16 h-16 rounded-[7px] bg-[#f5f5f5] flex items-center justify-center p-2 mb-1.5">
                    <Image
                      src={cat.image_url}
                      alt={name}
                      width={64}
                      height={64}
                      loading="lazy"
                      className="w-full h-full object-contain"
                      sizes="64px"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-slate-700 text-center leading-tight line-clamp-2 w-full">
                    {name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop — uniform grid */}
        <div className="hidden sm:grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
          {categories.map((cat, i) => {
            const href = `/${cat.super_parent_slug}/${cat.slug}`;
            const name = typeof cat.name === "string" ? cat.name : cat.name.en;
            return (
              <Link
                key={cat.id}
                href={href}
                className={`group flex flex-col justify-between items-center bg-gray-50 border border-slate-200 rounded-[7px] overflow-hidden hover:border-[#186737] hover:shadow-md hover:-translate-y-1 transition-all duration-200${i >= 14 ? " hidden 2xl:flex" : i >= 12 ? " hidden xl:flex" : i >= 10 ? " hidden lg:flex" : ""}`}
              >
                <div className="w-full aspect-square relative p-3">
                  <Image
                    src={cat.image_url}
                    alt={name}
                    fill
                    loading="lazy"
                    className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm p-3"
                    sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 12vw"
                  />
                </div>
                <p className="w-full bg-white text-[12px] font-semibold text-gray-800 group-hover:text-[#186737] text-center leading-snug px-2 py-2.5 transition-colors duration-200 line-clamp-2">
                  {name}
                </p>
              </Link>
            );
          })}
        </div>

        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

      </div>
    </section>
  );
}
