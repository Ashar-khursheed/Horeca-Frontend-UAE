"use client";

import NoImage from "@/assets/NoImage.jpg";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PromotionsSlider, {
  type MarketingPromotion,
} from "./promotions-slider";

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

const bannerAlt = (title: string | null) =>
  title && title !== "null"
    ? title
    : "Commercial Kitchen Equipment & Restaurant Supplies - HorecaStore";

function SideBannerSlider({
  slides,
  sizes,
}: {
  slides: SliderItem[];
  sizes: string;
}) {
  return (
    <Swiper
      id="hero-side"
      modules={[Autoplay, Pagination, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      pagination={{ clickable: true }}
      loop={slides.length > 1}
      className="w-full h-full"
    >
      {slides.map((item, index) => {
        const isValid = item.image?.startsWith("http");
        const img = (
          <div className="relative w-full h-full">
            <Image
              src={isValid ? item.image : NoImage}
              alt={bannerAlt(item.title)}
              fill
              // className="object-cover"
              sizes={sizes}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
            />
            {isValid && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            )}
          </div>
        );

        return (
          <SwiperSlide key={item.id}>
            {item.link ? (
              <Link href={item.link} className="block w-full h-full outline-none">
                {img}
              </Link>
            ) : (
              img
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

export const HeroBanner = ({
  slides = FALLBACK_SLIDES,
  sliderItemsTwo,
  promotions = [],
}: {
  slides?: SliderItem[];
  sliderItemsTwo?: SliderItem[];
  promotions?: MarketingPromotion[];
}) => {
  const activeSlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
  const activeSlidesTwo =
    sliderItemsTwo && sliderItemsTwo.length > 0
      ? sliderItemsTwo
      : FALLBACK_SLIDES;

  return (
    <section className="global-container mt-3 sm:mt-6">
      <div className="flex flex-col lg:grid lg:grid-cols-[70%_30%] gap-3 lg:gap-4">
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
            {activeSlides.map((banner, index) => {
              const img = (
                <div className="relative w-full h-full">
                  <Image
                    src={banner.image}
                    alt={bannerAlt(banner.title)}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : undefined}
                    sizes="(max-width: 1024px) 100vw, 70vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              );

              return (
                <SwiperSlide key={banner.id}>
                  {banner.link ? (
                    <Link
                      href={banner.link}
                      className="block w-full h-full outline-none"
                    >
                      {img}
                    </Link>
                  ) : (
                    img
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-1 gap-3 h-full">
          <div className="w-full rounded-[7px] overflow-hidden h-full min-h-[220px] lg:min-h-[240px] bg-white">
            <PromotionsSlider promotions={promotions} />
          </div>
          <div
            className="hidden sm:block w-full rounded-[7px] overflow-hidden h-full"
            style={{ aspectRatio: "875/380" }}
          >
            <SideBannerSlider
              slides={activeSlidesTwo}
              sizes="(max-width: 1024px) 50vw, 30vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
