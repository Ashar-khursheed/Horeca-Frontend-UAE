"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/breadcum";
import ProductCard from "@/components/product-card";
import type { RawApiProduct } from "@/components/product-card";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import FaqSection from "@/components/faq-section";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface PopularTag {
  popularTags: string;
  popularSlug: string;
}

export interface LocationPageData {
  id: number;
  paragraph_1: string | null;
  paragraph_2: string | null;
  paragraph_3: string | null;
  paragraph_4: string | null;
  banner_slug: string;
  banner_image_file: string;
  banner_image_alt_text: string;
  popularTag_details: PopularTag[];
  heroTitle: string;
  heroDescription: string;
  heroCta: string;
  leftParaDescription: string;
  rightParaDescription: string;
  categories: LocationCategory[];
  productTypes: LocationProductType[];
  faqs: LocationFAQ[];
  whyChoosePoints: string[];
}

export interface LocationCategory {
  id: number;
  name: string;
  slug: string;
  parent_slug?: string;
  image: string;
}

export interface LocationProductType {
  id: number;
  type: string;
  description: string;
  products: RawApiProduct[];
}

export interface LocationFAQ {
  question: string;
  answer: string;
}

// ── Custom Arrows ─────────────────────────────────────────────────────────────
const PrevArrow = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label="Previous"
    className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10
      w-10 h-10 rounded-full bg-white border border-gray-200
      shadow-md flex items-center justify-center
      hover:bg-green-600 hover:border-green-600 hover:shadow-green-100
      disabled:opacity-30 disabled:cursor-not-allowed
      transition-all duration-200 group"
  >
    <ChevronLeft
      size={18}
      className="text-black group-hover:text-white transition-colors"
    />
  </button>
);

const NextArrow = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label="Next"
    className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10
      w-10 h-10 rounded-full bg-white border border-gray-200
      shadow-md flex items-center justify-center
      hover:bg-green-600 hover:border-green-600 hover:shadow-green-100
      disabled:opacity-30 disabled:cursor-not-allowed
      transition-all duration-200 group"
  >
    <ChevronRight
      size={18}
      className="text-black group-hover:text-white transition-colors"
    />
  </button>
);

// ── Custom Product Slider ──────────────────────────────────────────────────────
function useVisibleCount() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1920) setCount(7);
      else if (w >= 1480) setCount(6);
      else if (w >= 1024) setCount(3);
      else if (w >= 768) setCount(2);
      else setCount(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

const ProductSlider = ({ products }: { products: RawApiProduct[] }) => {
  const [index, setIndex] = useState(0);
  const visibleCount = useVisibleCount();
  const max = Math.max(0, products.length - visibleCount);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(max, i + 1)), [max]);

  const cardWidth = 100 / visibleCount;

  return (
    <div className="relative ">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-400 ease-in-out"
          style={{ transform: `translateX(-${index * cardWidth}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${cardWidth}%` }}
            >
              <ProductCard
                product={product}
                newUrl={`${product?.parent_category_url}/${product?.category_url}`}
              />
            </div>
          ))}
        </div>
      </div>
      {products.length > visibleCount && (
        <>
          <PrevArrow onClick={prev} disabled={index === 0} />
          <NextArrow onClick={next} disabled={index >= max} />
        </>
      )}
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
export const PageSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full h-[500px] bg-gray-200" />
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          {[100, 90, 95, 80, 85].map((w, i) => (
            <div
              key={i}
              style={{ width: `${w}%` }}
              className="h-4 bg-gray-200 rounded"
            />
          ))}
        </div>
        <div className="bg-gray-100 rounded-2xl h-[200px]" />
      </div>
    </div>
  </div>
);


// ── Right Para with CheckCircle icons ─────────────────────────────────────────
const RightParaContent = ({ html }: { html: string }) => {
  // const proseClasses = `
  //   prose prose-sm max-w-none text-gray-700 leading-relaxed
  //   [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-0 [&_h2]:mb-4
  //   [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-green-800 [&_h3]:mt-5 [&_h3]:mb-2
  //   [&_p]:m-0 [&_p]:mb-3 [&_p]:leading-relaxed [&_p]:text-black
  //   [&_strong]:text-black [&_br]:hidden
  //   [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_a]:font-medium
  // `;
  const proseClasses = `
  prose prose-sm max-w-none text-gray-700 leading-relaxed
  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-0 [&_h2]:mb-4
  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-green-800 [&_h3]:mt-5 [&_h3]:mb-2
  [&_p]:m-0 [&_p]:mb-3 [&_p]:leading-relaxed [&_p]:text-black
  [&_strong]:font-semibold
  [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_a]:font-medium
  [&_a_strong]:text-blue-600
  [&_a:hover_strong]:text-blue-800
  [&_br]:hidden
`;
  if (!html.includes("<li")) {
    return (
      <div
        className={proseClasses}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const beforeUL = html.replace(/<ul[\s\S]*?<\/ul>/gi, "").trim();
  const liMatches = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];

  return (
    <div className="space-y-3">
      {beforeUL && (
        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: beforeUL }}
        />
      )}
      {liMatches.length > 0 && (
        <ul className="space-y-2.5 mt-1">
          {liMatches.map((match, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="text-green-600 flex-shrink-0 mt-0.5"
              />
              <span
                className="text-sm text-black leading-relaxed [&_strong]:font-semibold [&_strong]:text-black [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_a]:font-medium"
                dangerouslySetInnerHTML={{ __html: match[1] }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function LocationPageClient({
  data,
  state,
  city,
}: {
  data: LocationPageData;
  state: string;
  city: string;
}) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    {
      label: state.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: `/locations/${state}`,
    },
    { label: data.heroTitle, href: null },
  ];
  console.log("datadatadatadatadata", data);
  const seoParas = [
    data.paragraph_1,
    data.paragraph_2,
    data.paragraph_3,
    data.paragraph_4,
  ].filter(Boolean) as string[];

  return (
    <>
      <Breadcrumb crumbs={crumbs} />
      <div className="bg-white">
        {/* ── Hero Banner ─────────────────────────────────────────────── */}
        <section className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] overflow-hidden">
          <Image
            src={data.banner_image_file}
            alt={data.banner_image_alt_text || data.heroTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10 lg:px-16 global-container mx-auto w-full">
            <h1 className="text-xl  md:text-3xl font-extrabold text-white mb-4 leading-tight max-w-3xl drop-shadow-lg">
              {data.heroTitle}
            </h1>
            {data.heroDescription && (
              <div
                className="text-gray-200 text-sm sm:text-[15px] mb-7 max-w-2xl 2xl:line-clamp-none line-clamp-5  leading-relaxed [&_p]:m-0 [&_a]:text-blue-400 [&_a]:underline [&_a]:hover:text-blue-300 [&_a]:font-medium"
                dangerouslySetInnerHTML={{ __html: data.heroDescription }}
              />
            )}
            {data.heroCta && (
              <a
                href={data.banner_slug}
                className="w-fit inline-flex items-center gap-2 bg-[#186737] hover:bg-[#186737] active:scale-95 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 text-sm uppercase tracking-wider"
              >
                {data.heroCta}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </div>
        </section>

        {/* ── Left + Right Para ────────────────────────────────────────── */}
        {(data.leftParaDescription || data.rightParaDescription) && (
          <section className="py-14 bg-white">
            <div className="global-container ">
              <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] 2xl:grid-cols-[7fr_3fr] lg:gap-12 2xl:gap-8 items-start">
                {" "}
                {data.leftParaDescription && (
                  // <div
                  //   className="prose prose-sm  text-gray-700 leading-relaxed
                  //     [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-0 [&_h2]:mb-4
                  //     [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-5 [&_h3]:mb-2
                  //     [&_p]:m-0 [&_p]:mb-3 [&_p]:leading-relaxed [&_p]:text-black
                  //     [&_strong]:text-black [&_br]:hidden
                  //     [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_a]:font-medium"
                  //   dangerouslySetInnerHTML={{ __html: data.leftParaDescription }}
                  // />
                  <div
                    className="prose prose-sm text-gray-700 leading-relaxed
    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-0 [&_h2]:mb-4
    [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-5 [&_h3]:mb-2
    [&_p]:m-0 [&_p]:mb-3 [&_p]:leading-relaxed [&_p]:text-black
    [&_strong]:font-semibold
    [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800
    [&_a_strong]:text-blue-600
    [&_a:hover_strong]:text-blue-800
    [&_br]:hidden"
                    dangerouslySetInnerHTML={{
                      __html: data.leftParaDescription,
                    }}
                  />
                )}
                {data.rightParaDescription && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-7 h-auto">
                    <RightParaContent html={data.rightParaDescription} />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Popular Categories ───────────────────────────────────────── */}
        {data.categories.length > 0 && (
          <section className="py-14 bg-gray-50">
            <div className="global-container mx-auto px-4">
              {/* <div className="text-center mb-10">
                <h2 className="heading-font-size font-extrabold text-black">
                  Popular Categories
                </h2>
                
              </div> */}

              <div className="flex items-center justify-between mb-4">
                <h2 className="heading-font-size font-bold text-gray-900">
                  Popular Categories
                </h2>
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
              <div>
                {/* <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-8 gap-4 sm:gap-8 mt-5 sm:mt-8"> */}
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    prevEl: "#prod-slider-prev",
                    nextEl: "#prod-slider-next",
                  }}
                  spaceBetween={12}
                  breakpoints={{
                    0: { slidesPerView: 3 },
                    640: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1280: { slidesPerView: 6 },
                    1536: { slidesPerView: 7 },
                    1926: { slidesPerView: 8 },
                  }}
                  className="pb-2!"
                >
                  {data.categories.map((category) => (
                    <SwiperSlide key={category.id}>
                      <Link
                        href={`/${category.parent_slug ? `${category.parent_slug}/` : ""}${category.slug}`}
                        className="group flex justify-between flex-col items-center bg-gray-50 border mt-3 border-slate-200 rounded-[7px] overflow-hidden hover:border-[#186737] hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                      >
                        <div className="w-full aspect-square relative p-3">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            loading="lazy"
                            className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm p-3"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                          />
                        </div>
                        <p className="w-full bg-white text-[12px] font-semibold text-gray-800 group-hover:text-[#186737] text-center leading-snug px-2 py-2.5 transition-colors duration-200 line-clamp-2">
                          {category.name}
                        </p>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </section>
        )}
        {/* ── Popular Categories ─────────────────────────────────────────
        {data.categories.length > 0 && (
          <section className="py-14 bg-gray-50">
            <div className="global-container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="heading-font-size font-extrabold text-black">
                  Popular Categories
                </h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-8 gap-4 sm:gap-8 mt-5 sm:mt-8">
                {data.categories.map((category, i) => (
                  <Link
                    key={category.id}
                    href={`/${category.parent_slug ? `${category.parent_slug}/` : ""}${category.slug}`}
                    className={`group flex justify-between flex-col items-center bg-gray-50 border border-slate-200 rounded-[7px] overflow-hidden hover:border-[#186737] hover:shadow-md hover:-translate-y-1 transition-all duration-200${i >= 14 ? " hidden 2xl:flex" : i >= 12 ? " hidden xl:flex" : i >= 10 ? " hidden lg:flex" : ""}`}
                  >
                    <div className="w-full aspect-square relative p-3">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        loading="lazy"
                        className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm p-3"
                        sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 12vw"
                      />
                    </div>
                    <p className="w-full bg-white text-[12px] font-semibold text-gray-800 group-hover:text-[#186737] text-center leading-snug px-2 py-2.5 transition-colors duration-200 line-clamp-2z">
                      {category.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )} */}

        {/* ── Product Type Sliders ─────────────────────────────────────── */}
        {data.productTypes.length > 0 && (
          <section className="py-14 bg-white">
            <div className="global-container mx-auto px-4">
              {data.productTypes.map((type, idx) => (
                <div
                  key={type.id}
                  className={
                    idx !== 0 ? "mt-16 pt-12 border-t border-gray-100" : ""
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2">
                    <h2 className="heading-font-size font-extrabold text-black mt-1">
                      {type.type}
                    </h2>
                  </div>
                  {type.description && (
                    <div
                      className="md:text-base text-sm text-black mb-7 leading-relaxed [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_a]:font-medium"
                      dangerouslySetInnerHTML={{ __html: type.description }}
                    />
                  )}
                  {type.products.length > 0 && (
                    <ProductSlider products={type.products} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQs ────────────────────────────────────────────────────── */}
        <FaqSection faqs={data.faqs} />

        {/* ── Bottom Banner ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <Image
            src={data.banner_image_file}
            alt={data.banner_image_alt_text}
            width={1920}
            height={400}
            className="w-full h-[300px] sm:h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-4 px-4 text-center">
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">
              BEST-IN-CLASS SOLUTIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white max-w-2xl leading-tight">
              Order online, anytime, anywhere
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-2">
              {[
                { icon: "🚚", label: "Fast Delivery" },
                { icon: "📦", label: "Easy Tracking" },
                { icon: "🎧", label: "24/7 Customer Support" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-white text-sm font-semibold"
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO Content Paragraphs ───────────────────────────────────── */}
        {seoParas.length > 0 && (
          <section className="py-14 bg-white">
            <div className="global-container mx-auto px-4 space-y-8">
              {seoParas.map((para, i) => (
                <div
                  key={i}
                  className="prose prose-sm max-w-none
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mb-3 [&_h2]:mt-0
                    [&_p]:text-black [&_p]:leading-relaxed [&_p]:m-0
                    [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Popular Tags ─────────────────────────────────────────────── */}
        {data.popularTag_details.length > 0 && (
          <section className="py-10 bg-gray-50 border-t border-gray-100">
            <div className="global-container mx-auto px-4">
              <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {data.popularTag_details.map((tag, i) => (
                  <Link
                    key={i}
                    href={`/${tag.popularSlug}`}
                    className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:border-[#186737] hover:text-[#186737] transition-colors"
                  >
                    {tag.popularTags}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
