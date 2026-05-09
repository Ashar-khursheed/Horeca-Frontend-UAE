"use client";
import BrandsSection from "@/components/brands-section";
import Breadcrumb from "@/components/breadcum";
import ProductCard from "@/components/product-card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { categories, FEATURED_DATA, ItemsAccordion } from "@/data";
import SeoContent from "@/seo/seo-content";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// ─── Types ────────────────────────────────────────────────────────────────────
interface SubCategory {
  name: string;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
  icon: string;
  image?: string;
  subCategories: SubCategory[];
}

// ─── Mock Data (apne API/data se replace karein) ───────────────────────────


// ─── Category Card Component ──────────────────────────────────────────────────
function CategoryCard({ category }: { category: Category }) {
  const visibleSubs = category.subCategories.slice(0, 5);
  const remaining = category.subCategories.length - visibleSubs.length;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-[7px] md:p-6 p-4 hover:shadow-xl hover:shadow-primary-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
      {/* Icon */}
      <div className="w-full md:h-[250px] h-[100px] bg-orange-50a rounded-[7px] flex items-center justify-center text-2xl">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-[250px] md:h-full object-contain"
          />
        ) : (
          category.icon
        )}
      </div>

      {/* Name + Badge */}
      <div>
        <h2 className="text-[12px] md:text-xl font-bold uppercase tracking-wide text-gray-900 leading-tight mb-2">
          {category.name}
        </h2>
        <span className="inline-block md:text-xs text-[10px] font-bold  tracking-wider uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-[7px]">
          {category.subCategories.length} Categories
        </span>
      </div>

      {/* Subcategory list */}
      <ul className="space-y-1.5 border-t border-gray-100 pt-4">
        {visibleSubs.map((sub) => (
          <li key={sub.slug}>
            <Link
              href={`/${category.slug}/${sub.slug}`}
              className="flex items-center gap-2 md:text-sm text-[10px] text-gray-500 hover:text-[#1e5230] transition-colors group/sub"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover/sub:bg-[#1e5230] flex-shrink-0 transition-colors" />
              {sub.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* View all link */}
      <Link
        href={`/${category.slug}`}
        className="mt-auto flex items-center gap-1.5 md:text-sm text-[10px] font-bold  tracking-widest uppercase text-primary transition-colors"
      >
        {remaining > 0
          ? `View all ${category.subCategories.length}`
          : "View category"}
        <span className="text-base leading-none group-hover:translate-x-0.5 transition-transform">
          →
        </span>
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  return (
  <>
    <Breadcrumb/>
      <main className="min-h-screens bg-gray-50">
      {/* Hero Header */}
      <section className="bg-white border-b border-gray-100 ">
        <img
          src="https://www.thehorecastore.com/images/Banners/NewBanner/6%20Categories/Main%20Categories/Desktop/Restaurant%20Equipment/Hero%20Banner%20-%201920%20x%20450%20copy.webp"
          alt=""
        />
      </section>

      <section className="md:py-7 py-3">
        <div className="global-container">
          <div className="grid grid-cols-1">
            <h3 className=" md:text-[18px] text-[12px] text-[#4B5563] font-bold text-acenter  mt-2 sm:ellipsis-text">
              Find top-notch commercial kitchen equipment for restaurants. We
              offer a wide range of products from trusted brands like Beckers,
              Rational, Cambro, Empero, Coupe, Lacor, and Roller Grill. Whether
              you're outfitting a new kitchen or upgrading your current setup.
            </h3>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="global-container py-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3  2xl:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>
      <section className="md:py-7 py-3 bg-white">
        <div className="global-container">
          <div className="grid grid-cols-1 py-3 pb-7 text-center">
            <h3 className=" md:text-[18px] text-[12px] text-[#4B5563] font-bold text-acenter  mt-2 sm:ellipsis-text">
              Explore More. Find Exactly What You Need.
            </h3>
            <p>
              Explore categories designed for chefs, hoteliers, and
              restaurateurs. Find what you need at unbeatable value with zero
              compromise.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <img
                src="https://www.thehorecastore.com/images/Banners/NewBanner/6%20Categories/Main%20Categories/Desktop/Restaurant%20Equipment/Banner%201.webp"
                alt=""
                className="rounded-[7px]"
              />
            </div>
            <div>
              <img
                src="https://www.thehorecastore.com/images/Banners/NewBanner/6%20Categories/Main%20Categories/Desktop/Restaurant%20Equipment/Banner%201.webp"
                alt=""
                className="rounded-[7px]"
              />
            </div>
            <div>
              <img
                src="https://www.thehorecastore.com/images/Banners/NewBanner/6%20Categories/Main%20Categories/Desktop/Restaurant%20Equipment/Banner%201.webp"
                alt=""
                className="rounded-[7px]"
              />
            </div>
            <div>
              <img
                src="https://www.thehorecastore.com/images/Banners/NewBanner/6%20Categories/Main%20Categories/Desktop/Restaurant%20Equipment/Banner%201.webp"
                alt=""
                className="rounded-[7px]"
              />
            </div>
            <div>
              <img
                src="https://www.thehorecastore.com/images/Banners/NewBanner/6%20Categories/Main%20Categories/Desktop/Restaurant%20Equipment/Banner%201.webp"
                alt=""
                className="rounded-[7px]"
              />
            </div>
            <div>
              <img
                src="https://www.thehorecastore.com/images/Banners/NewBanner/6%20Categories/Main%20Categories/Desktop/Restaurant%20Equipment/Banner%201.webp"
                alt=""
                className="rounded-[7px]"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="md:py-7 py-3">
        <div className="global-container">
          {/* Header row with title + nav buttons */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[16px] md:text-[22px] font-bold text-gray-900">
              Our Customers&apos; Top Choices
            </h1>
            <div className="flex items-center gap-2">
              <button
                id="prod-slider-prev"
                className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-[#186737] hover:border-[#186737] hover:text-white text-gray-600 transition-all duration-200 disabled:opacity-30"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <button
                id="prod-slider-next"
                className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-[#186737] hover:border-[#186737] hover:text-white text-gray-600 transition-all duration-200 disabled:opacity-30"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Swiper slider */}
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: "#prod-slider-prev",
              nextEl: "#prod-slider-next",
            }}
            spaceBetween={12}
            breakpoints={{
              0: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
              1536: { slidesPerView: 6 },
            }}
            className="pb-2!"
          >
            {FEATURED_DATA.flatMap((category) =>
              category.featured_products.map((product) => (
                <SwiperSlide key={product.id} className="h-auto!">
                  <ProductCard
                    product={{
                      ...product,
                      images: [...product.images],
                      alt_tags: [...product.alt_tags],
                    }}
                    onAddToCart={(p, qty) => console.log("Cart:", p.name, qty)}
                    onWishlistToggle={(p, w) =>
                      console.log("Wishlist:", p.name, w)
                    }
                  />
                </SwiperSlide>
              )),
            )}
          </Swiper>
        </div>
      </section>
      <BrandsSection />
      <section className="bg-whiste py-10">
        <div className="global-container ">
          <div className="grid grid-cols-1">
            <h2 className="flex items-center justify-center text-center flex-col text-3xl font-bold ">
              Frequently Asked Questions
            </h2>
            <p className="hidden sm:block text-[17px] text-[#4B5563] font-inter px-16 mt-2 text-center">
              Everything you need to know before you buy.
            </p>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-10 max-w-6xl mx-auto">
            {/* Left Column */}
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="mt-4"
            >
              {ItemsAccordion.slice(0, Math.ceil(ItemsAccordion.length / 2)).map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger>{item.trigger}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Right Column */}
            <Accordion type="single" collapsible className="mt-4">
              {ItemsAccordion.slice(Math.ceil(ItemsAccordion.length / 2)).map((item, index) => (
                <AccordionItem key={`right-${index}`} value={`right-${index}`}>
                  <AccordionTrigger>{item.trigger}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      <div className="bg-white py-10 pb-0">
        <SeoContent />
      </div>
    </main>
  </>
  );
}
