"use client";

import BannerImg from "@/assets/Desktop/True Refrigeration.webp";
import chefImge from "@/assets/static/chefImg.svg";
import FinancingModal from "@/components/financing-modal";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import NoImage from "@/assets/NoImage.jpg";

export interface SliderItem {
  id: number;
  simple_slider_id: number;
  title: string | null;
  image: string;
  link: string;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

const FALLBACK_SLIDES: SliderItem[] = [
  {
    id: 1,
    simple_slider_id: 1,
    title: "Commercial Kitchen Equipment",
    link: "/restaurant-equipment",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/main-banner-1150-x-500-b2-2.webp",
    description: null,
    order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: 2,
    simple_slider_id: 1,
    title: "Premium Refrigeration",
    link: "/refrigeration",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/Landing+page+Banner.webp",
    description: null,
    order: 2,
    created_at: "",
    updated_at: "",
  },
];

const CTACard = ({ onQuoteClick }: { onQuoteClick: () => void }) => (
  <div className="px-3">
    <div className="flex items-end justify-between">
      <div className="  relative rounded-[7px] ">
        <div>
          {/* <Link
              href="/starting-a-restaurant"
              className="no-underline cursor-pointer "
            > */}
          <div className=" grid grid-cols-[70%_30%] h-full gap-3  relative  ">
            {/* <div className="flex items-center relative 2xl:py-9 2xl:px- xl:py-6 xl:px-3 md:py-2.5 md:px-3 py-6.5 px-3  "> */}
            <div className="flex flex-col items-start justify-center">
              <h3 className="text-[#186737]  2xl:text-xl font-bold text-base">
                Opening a Restaurant?
              </h3>
              <p className="text-[#666666] 2xl:text-base text-[13px] my-3 font-medium">
                From kitchen equipment to financing,{" "}
                <span className="2xl:blocks ">we’ve got you covered.</span>
              </p>

              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-4 h-4 text-[#186737]" />
                <a
                  href="tel:+18664467322"
                  className="text-[#186737] 2xl:text-base text-[13px] underline font-bold"
                >
                  +1 (866) 446-7322
                </a>
              </div>
              <div>
                <button
                  onClick={onQuoteClick}
                  className="bg-[#186737] text-white 2xl:px-4 px-2.5 2xl:py-3 py-1.5 rounded  2xl:text-[14px] text-[12px] mt-4"
                >
                  Request a Free Quote
                </button>
              </div>
            </div>

            <div className="relative flex items-end justify-end">
              <Image
                src={chefImge}
                className="  "
                alt="chef image"
                loading="lazy"
                unoptimized
              />
            </div>
          </div>
          {/* </Link> */}
        </div>
      </div>
    </div>
  </div>
);
const BannerImage = () => (
  <div className="w-full rounded-[7px] overflow-hidden">
    <Image
      src={BannerImg}
      alt="True Refrigeration Banner"
      className="w-full h-auto block"
    />
  </div>
);

export const HeroBanner = ({
  slides = FALLBACK_SLIDES,
  sliderItemsTwo,
}: {
  slides?: SliderItem[];
  sliderItemsTwo?: SliderItem[];
}) => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const activeSlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
  const activeSlidesTwo =
    sliderItemsTwo && sliderItemsTwo.length > 0
      ? sliderItemsTwo
      : FALLBACK_SLIDES;

  return (
    <>
      <section className="global-container mt-3 sm:mt-6">
        <div className="flex flex-col lg:grid lg:grid-cols-[70%_30%] gap-3 lg:gap-4">
          {/* ── Hero Swiper (all screens) ── */}
          <div
            className="w-full rounded-[7px] overflow-hidden h-full"
            style={{ aspectRatio: "875/380" }}
          >
            <Swiper
              id="hero-main"
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              loop
              className="w-full h-full"
            >
              {activeSlides.map((banner, index) => (
                <SwiperSlide key={banner.id}>
                  <Link
                    href={banner.link}
                    className="block w-full h-full outline-none"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={banner.image}
                        alt={banner.title ?? "Banner"}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 1024px) 100vw, 70vw"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-s">
            {/* MOBILE ONLY — CTACard + activeSlidesTwo images */}
            <div className="block sm:hidden">
              {/* <Swiper
                id="hero-mobile"
                modules={[Autoplay]}
                autoplay={{
                  delay: 9000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop
                className="w-full rounded-[7px] overflow-hidden"
              >
                <SwiperSlide>
                  <CTACard onQuoteClick={() => setQuoteModalOpen(true)} />
                </SwiperSlide>

                {activeSlidesTwo.map((item) => {
                  const isValid = item.image?.startsWith("http");
                  return (
                    <SwiperSlide key={item.id}>
                      {item.link ? (
                        <Link
                          href={item.link}
                          className="block w-full outline-none"
                        >
                          <div className="relative w-full h-50">
                            <Image
                              src={isValid ? item.image : NoImage}
                              alt={item.title ?? "Banner"}
                              fill
                              className="object-covers"
                              sizes="100vw"
                              loading="lazy"
                            />
                          </div>
                        </Link>
                      ) : (
                        <div className="relative w-full h-50">
                          <Image
                            src={isValid ? item.image : NoImage}
                            alt={item.title ?? "Banner"}
                            fill
                            className="object-covers"
                            sizes="100vw"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </SwiperSlide>
                  );
                })}
              </Swiper> */}
                 <CTACard onQuoteClick={() => setQuoteModalOpen(true)} />
            </div>

            {/* TABLET (sm → lg) — 50/50 grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:hidden gap-3">
              {/* <Link href="/starting-a-restaurant" className="no-underline"> */}
              <CTACard onQuoteClick={() => setQuoteModalOpen(true)} />
              {/* </Link> */}
              <Swiper
                id="hero-tablet"
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{ clickable: true }}
                loop={activeSlidesTwo.length > 1}
                className="w-full h-full"
              >
                {activeSlidesTwo.map((item, index) => {
                  const isValid = item.image?.startsWith("http");
                  return (
                    <SwiperSlide key={item.id}>
                      {item.link ? (
                        <Link
                          href={item.link}
                          className="block w-full h-full outline-none"
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={isValid ? item.image : NoImage}
                              alt={item.title ?? "Banner"}
                              fill
                              className="object-covera"
                              sizes="50vw"
                              priority={index === 0}
                              loading={index === 0 ? "eager" : "lazy"}
                            />
                            {isValid && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                            )}
                          </div>
                        </Link>
                      ) : (
                        <div className="relative w-full h-full">
                          <Image
                            src={isValid ? item.image : NoImage}
                            alt={item.title ?? "Banner"}
                            fill
                            className="object-covera"
                            sizes="50vw"
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </div>
                      )}
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            {/* DESKTOP (lg+) — stacked layout */}
            <div className="hidden lg:grid grid-rows-[auto_auto] h-full gap-3">
              <div className="no-underline flex-11s bg-[#e2e8f033] flex justify-between items-center">
                <CTACard onQuoteClick={() => setQuoteModalOpen(true)} />
              </div>

              <div
                className="w-full rounded-[7px] overflow-hidden h-full "
                style={{ aspectRatio: "875/380" }}
              >
                <Swiper
                  id="hero-desktop"
                  modules={[Autoplay, Pagination, EffectFade]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  pagination={{ clickable: true }}
                  loop={activeSlidesTwo.length > 1}
                  className="w-full h-full"
                >
                  {activeSlidesTwo.map((item, index) => {
                    const isValid = item.image?.startsWith("http");
                    return (
                      <SwiperSlide key={item.id}>
                        {item.link ? (
                          <Link
                            href={item.link}
                            className="block w-full h-full outline-none"
                          >
                            <div className="relative w-full h-full">
                              <Image
                                src={isValid ? item.image : NoImage}
                                alt={item.title ?? "Banner"}
                                fill
                                className="object-covera"
                                sizes="30vw"
                                priority={index === 0}
                                loading={index === 0 ? "eager" : "lazy"}
                              />
                              {isValid && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                              )}
                            </div>
                          </Link>
                        ) : (
                          <div className="relative w-full h-full">
                            <Image
                              src={isValid ? item.image : NoImage}
                              alt={item.title ?? "Banner"}
                              fill
                              className="object-covera"
                              sizes="30vw"
                              priority={index === 0}
                              loading={index === 0 ? "eager" : "lazy"}
                            />
                          </div>
                        )}
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FinancingModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        title="Opening a Restaurant"
      />
    </>
  );
};

export default HeroBanner;
