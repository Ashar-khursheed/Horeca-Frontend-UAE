
import CategoryCard from "@/components/category-card";
import { CATEGORIESMAIN } from "@/data";
import { generateDynamicCSSCategoryCard } from "@/utils/dynamic-css";
import Link from "next/link";


export default function ShopByCategories() {
  return (
    <section className="w-full bg-white py-6 ">
      <div className="global-container mx-auto">

        {/* Header */}
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

        <CategoryCard />

      </div>
    </section>
  );
}