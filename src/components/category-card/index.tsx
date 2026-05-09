import { CATEGORIESMAIN } from "@/data";
import Link from "next/link";

type Cat = (typeof CATEGORIESMAIN)[number];

const CatGridItem = ({ cat }: { cat: Cat }) => (
  <Link
    href={`/categories/${cat.slug}`}
    className="group flex flex-col items-center bg-transparent border border-slate-200 rounded-[7px] overflow-hidden hover:border-[#186737] hover:shadow-md hover:-translate-y-1 transition-all duration-200"
  >
    <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-3">
      <img
        src={cat.image}
        alt={cat.name}
        loading="lazy"
        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
      />
    </div>
    <p className="lg:text-[13px] md:text-[10px] font-semibold text-black group-hover:text-[#186737] text-center leading-snug px-2 py-2.5 transition-colors duration-200 line-clamp-2 flex justify-center items-center h-full">
      {cat.name}
    </p>
  </Link>
);

export default function CategoryCard() {
  return (
    <>


        {/* MOBILE — 2-row horizontal scroll */}
        <div className="sm:hidden overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
          <div className="grid grid-rows-2 grid-flow-col gap-x-3 gap-y-3 w-max">
            {CATEGORIESMAIN.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center w-17"
              >
                <div className="w-16 h-16 rounded-[7px] bg-[#f5f5f5] flex items-center justify-center p-2 mb-1.5">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[11px] font-medium text-slate-700 text-center leading-tight line-clamp-2 w-full">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* TABLET (sm→lg): 5 cols × 2 rows = 10 cards */}
        <div className="hidden sm:grid lg:hidden grid-cols-5 gap-3">
          {CATEGORIESMAIN.slice(0, 10).map((cat) => (
            <CatGridItem key={cat.id} cat={cat} />
          ))}
        </div>

        {/* LAPTOP (lg→2xl): 6 cols × 2 rows = 12 cards */}
        <div className="hidden lg:grid 2xl:hidden grid-cols-6 lg:gap-6 xl:gap-8 gap-3">
          {CATEGORIESMAIN.slice(0, 12).map((cat) => (
            <CatGridItem key={cat.id} cat={cat} />
          ))}
        </div>

        {/* DESKTOP (2xl+): 7 cols × 2 rows = 14 cards */}
        <div className="hidden 2xl:grid grid-cols-7 gap-10">
          {CATEGORIESMAIN.slice(0, 14).map((cat) => (
            <CatGridItem key={cat.id} cat={cat} />
          ))}
        </div>

    
    </>
  );
}