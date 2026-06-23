"use client";
import BrandsSection, { ApiBrand } from "@/components/brands-section";
import Breadcrumb from "@/components/breadcum";
import ProductCard, { RawApiProduct } from "@/components/product-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SeoContent from "@/seo/seo-content";
import RecentlyViewedSection from "./recently-viewed-section";
import SEOMainContent from "@/seo/seo-main-content";
import { generateDynamicCSSProductCard } from "@/utils/dynamic-css";
import { ApiCategory, ApiCategoryName, ApiCategoryPage } from "@/utils/types";
import { ChevronLeft, ChevronRight, ChevronUp, MoveRight } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export type { ApiCategory, ApiCategoryName };

// ─── Types ────────────────────────────────────────────────────────────────────

const getName = (name: ApiCategoryName | string, locale: string): string => {
  if (typeof name === "string") return name;
  return locale === "ar" ? name.ar || name.en : name.en || name.ar;
};

// ─── Category Card Component ──────────────────────────────────────────────────
function CategoryCard({
  category,
  locale,
  categorySlug,
}: {
  category: ApiCategory;
  locale: string;
  categorySlug: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const LIMIT = 5;
  const hasMore = category.children.length > LIMIT;
  const visibleSubs = showAll
    ? category.children
    : category.children.slice(0, LIMIT);
  const displayName = getName(category.name, locale);

  return (
    <div className="group relative bg-white border border-gray-100 rounded-[7px] md:p-6 p-3 hover:shadow-xl hover:shadow-primary-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col md:gap-4 gap-2">
      {/* Image */}
      <div className="w-full md:h-[250px] h-[100px] bg-orange-50a rounded-[7px] flex items-center justify-center text-2xl">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={displayName}
            className="w-full md:h-[250px] h-[106px] md:h-full object-contain"
          />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </div>

      {/* Name + Badge */}
      <div>
        <h2 className="text-[12px] md:text-lg font-bold uppercase tracking-wide text-gray-900 leading-tight mb-2">
          <Link
            href={`/${categorySlug}/${category.slug}`}
            className="hover:text-[#186737] transition-colors"
          >
            {" "}
            {displayName}
          </Link>
        </h2>
        <span className="inline-block md:text-xs text-[10px] font-bold  tracking-wider uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-[7px]">
          {category.children.length} Categories
        </span>
      </div>

      {/* Subcategory list */}
      <ul className="space-y-1.5 border-t border-gray-100 pt-4">
        {visibleSubs.map((sub) => (
          <li key={sub.id}>
            <Link
              href={`/${categorySlug}/${sub.slug}?parent=${category.slug}`}
              className="flex items-center gap-2 md:text-sm text-[10px] text-gray-500 hover:text-[#1e5230] transition-colors group/sub"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover/sub:bg-[#1e5230] flex-shrink-0 transition-colors" />
              {getName(sub.name, locale)}
            </Link>
          </li>
        ))}
      </ul>

      {/* Expand / collapse button */}
      {hasMore && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-auto flex items-center gap-1.5 md:text-sm text-[10px] font-bold tracking-widest uppercase text-primary transition-colors"
        >
          {showAll ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              View all {category.children.length} <MoveRight size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

const slugToTitle = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CategoriesPage({
  categories,
  categorySlug,
  categoryPage,
  brands,
}: {
  categories: ApiCategory[];
  categorySlug: string;
  categoryPage?: ApiCategoryPage | null;
  brands?: ApiBrand[] | null;
}) {
  const locale = useLocale();
  const [bannerLoaded, setBannerLoaded] = useState(false);

  const uniqueCategories = categories.filter(
    (cat, i, arr) => arr.findIndex((c) => c.id === cat.id) === i,
  );

  // category data page

  const APIDATA = categoryPage?.category_page;
  const seoAPIDATA = APIDATA
    ? {
        title: APIDATA.title ?? undefined,
        description: APIDATA.description ?? undefined,
      }
    : undefined;
  const randomProducts = categoryPage?.random_products ?? [];
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: slugToTitle(categorySlug), href: null },
  ];


  return (
    <>
      <Breadcrumb crumbs={crumbs} />
      <main className="min-h-screens bg-gray-50">
          {APIDATA?.banner_image_detail?.image_url ? (
            <>
              {!bannerLoaded && (
                <div className="w-full h-45 md:h-80 bg-gray-200 animate-pulse" />
              )}
              <Image
                src={APIDATA.banner_image_detail.image_url}
                alt={APIDATA.banner_image_detail?.alt || "Category banner"}
                width={0}
                height={0}
                sizes="100vw"
                className={`w-full h-auto transition-opacity duration-300 ${bannerLoaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
                priority
                onLoad={() => setBannerLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-45 md:h-80 bg-gray-100" />
          )}
      
        <div className="">
          <SEOMainContent APIDATA={seoAPIDATA} categorySlug={categorySlug} />
        </div>
        {/* <section className="md:py-7 py-3">
          <div className="global-container">
            <div className="grid grid-cols-1">
              <h3 className=" md:text-[18px] text-[12px] text-[#4B5563] font-bold text-acenter  mt-2 sm:ellipsis-text">
                Find top-notch commercial kitchen equipment for restaurants. We
                offer a wide range of products from trusted brands like Beckers,
                Rational, Cambro, Empero, Coupe, Lacor, and Roller Grill.
                Whether you're outfitting a new kitchen or upgrading your
                current setup.
              </h3>
            </div>
          </div>
        </section> */}

        {/* Category Grid */}
        <section className="global-container py-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3  2xl:grid-cols-5 md:gap-5 gap-1">
            {categories.map((cat) => (
              <CategoryCard
                key={cat?.id}
                category={cat}
                locale={locale}
                categorySlug={categorySlug}
              />
            ))}
          </div>
        </section>
        <section className="md:py-7 py-3 pb-5 bg-white">
          <div className="global-container">
            <div className="grid grid-cols-1   text-center">
              <h3 className=" heading-font-size text-[#000] font-bold text-acenter  sm:ellipsis-text">
                {APIDATA?.explore_section_title ||
                  "Explore Our Extensive Range of Categories"}
              </h3>
              <p className="text-[11px] md:text-base pb-4 pt-2  font-extralight text-[#4B5563]  ">
                {APIDATA?.explore_section_description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* <div>
              <img
                src="https://www.thehorecastore.com/images/Banners/NewBanner/6%20Categories/Main%20Categories/Desktop/Restaurant%20Equipment/Banner%201.webp"
                alt=""
                className="rounded-[7px]"
              />
            </div> */}
              {APIDATA?.explore_section_image_details?.map((img, index) => (
                <div key={index}>
                  <Link href={img.url || "#"}>
                    <img
                      src={img.image_url}
                      alt={img.alt}
                      className="rounded-[7px]"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="md:py-7 py-3">
          <div className="global-container">
            {/* Header row with title + nav buttons */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="heading-font-size font-bold text-gray-900">
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
              {randomProducts.map((product: any) => (
                <SwiperSlide key={product.id} className="h-auto!">
                  <ProductCard key={product.id} product={product as any} />
                </SwiperSlide>
              ))}
              {/* {randomProducts.flatMap((category) =>
                (category.featured_products ?? []).map((product) => (
                  <SwiperSlide key={product.id} className="h-auto!">
                    <ProductCard
                      product={{
                        ...product,
                        category_url:        product.category_url_resolved,
                        parent_category_url: product.parent_category_url_resolved,
                      } as RawApiProduct}
                    />
                  </SwiperSlide>
                )),
              )} */}
            </Swiper>
            {/* 
            {randomProducts.flatMap((category) =>
              (category.featured_products ?? []).map((product) => (
                <div key={product.id} className="h-auto!">
                  <ProductCard
                    product={
                      {
                        ...product,
                        category_url: product.category_url_resolved,
                        parent_category_url:
                          product.parent_category_url_resolved,
                      } as RawApiProduct
                    }
                  />
                </div>
              )),
            )} */}

            {/* {randomProducts.map((product) => (
                <div key={product.id} className="h-auto!">
                  <ProductCard
                    product={
                      {
                        ...product,
                        category_url: product.category_url_resolved,
                        parent_category_url:
                          product.parent_category_url_resolved,
                      } as RawApiProduct
                    }
                  />
                </div>
              ))}
              */}

            {/* MOBILE — horizontal scroll */}
            {/* <div className="flex sm:hidden gap-3 overflow-x-auto hide-scrollbar md:px-4 pb-2">
                        {randomProducts.map((product:any) => (
                          <div key={product.id} className="shrink-0 w-[175px]">
                            <ProductCard product={product as any} />
                          </div>
                        ))}
                      </div> */}

            {/* TABLET + DESKTOP — grid */}
            {/* <div className={generateDynamicCSSProductCard}>
                        {randomProducts.map((product:any) => (
                          <ProductCard key={product.id} product={product as any} />
                        ))}
                      </div> */}
          </div>
        </section>
     
     {/* <div className="global-contaier"> */}
         <RecentlyViewedSection container={true} />
     {/* </div> */}

        <section className="md:py-7 py-3">
          <div className="global-container">
            <div className="mt-8">
              <Link
                href={APIDATA?.secondary_banner_image_detail?.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={APIDATA?.secondary_banner_image_detail?.image_url}
                  alt={
                    APIDATA?.secondary_banner_image_detail?.alt || "SEO Banner"
                  }
                  className="w-full rounded-[7px] object-cover"
                  loading="lazy"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section — API driven */}
        {APIDATA?.faqs && (APIDATA.faqs as any[]).length > 0 && (() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const faqs = APIDATA.faqs as any[];
          const half = Math.ceil(faqs.length / 2);
          const left = faqs.slice(0, half);
          const right = faqs.slice(half);
          const getQ = (f: any) => typeof f.question === "string" ? f.question : (f.question?.en ?? "");
          const getA = (f: any) => typeof f.answer === "string" ? f.answer : (f.answer?.en ?? "");
          return (
            <section className="py-10 md:pb-10 pb-6 bg-white">
              <div className="global-container">
                <div className="text-center mb-8">
                  <h2 className="heading-font-size font-bold text-gray-900">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
                    Everything you need to know before you buy.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 md:gap-8 max-w-5xl mx-auto">
                  <Accordion type="single" collapsible defaultValue={`faq-0`} className="space-y-2">
                    {left.map((f: any, i: number) => (
                      <AccordionItem key={f.id ?? i} value={`faq-${i}`} className="border border-gray-100 rounded-[7px] px-4 shadow-sm">
                        <AccordionTrigger className="text-sm font-semibold text-gray-900 py-4 text-left">
                          {getQ(f)}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            className="text-sm text-gray-600 leading-relaxed pb-3"
                            dangerouslySetInnerHTML={{ __html: getA(f) }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Accordion type="single" collapsible className="space-y-2">
                    {right.map((f: any, i: number) => (
                      <AccordionItem key={f.id ?? i} value={`faq-r-${i}`} className="border border-gray-100 rounded-[7px] px-4 shadow-sm">
                        <AccordionTrigger className="text-sm font-semibold text-gray-900 py-4 text-left">
                          {getQ(f)}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            className="text-sm text-gray-600 leading-relaxed pb-3"
                            dangerouslySetInnerHTML={{ __html: getA(f) }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </section>
          );
        })()}
        <div className="bg-white md:py-10 py-3 pb-0">
          <SeoContent dataAPI={categoryPage?.seo} />
        </div>
       </main>
    </>
  );
}
