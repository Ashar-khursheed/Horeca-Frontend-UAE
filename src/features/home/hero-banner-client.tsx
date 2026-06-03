"use client";

import dynamic from "next/dynamic";
import type { SliderItem } from "./hero-banner";

const HeroBannerSkeleton = () => (
  <section className="global-container mt-3 sm:mt-6">
    <div className="flex flex-col lg:grid lg:grid-cols-[70%_30%] gap-3 lg:gap-4">
      <div className="w-full rounded-[7px] bg-gray-200 animate-pulse" style={{ aspectRatio: "875/380" }} />
      <div className="hidden lg:block rounded-[7px] bg-gray-100 animate-pulse" style={{ aspectRatio: "875/380" }} />
    </div>
  </section>
);

const HeroBannerDynamic = dynamic(() => import("./hero-banner"), {
  ssr: false,
  loading: () => <HeroBannerSkeleton />,
});

export default function HeroBannerClient({
  slides,
  sliderItemsTwo,
}: {
  slides: SliderItem[];
  sliderItemsTwo: SliderItem[];
}) {
  return <HeroBannerDynamic slides={slides} sliderItemsTwo={sliderItemsTwo} />;
}
