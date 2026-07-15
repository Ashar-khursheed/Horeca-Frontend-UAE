// Server component — no "use client".
//
// Why this matters for performance:
//   When this file had "use client", React bundled the ENTIRE import graph
//   (Swiper, all section components, SEOMainContent, Image wrappers, etc.)
//   into the initial JS payload, even for parts that need zero interactivity.
//   Removing "use client" here means only explicitly-marked child components
//   (HeroBanner, FeaturedProducts, BlogsCard) ship client-side JS. Everything
//   else — SEOMainContent, ShopByCategories, FeaturedBrandsSection, the
//   FoodTruck banner Image — is pure static HTML, cutting TBT significantly.
//
// Blogs load client-side after first paint to keep the homepage HTML smaller.

import SEOMainContent from "@/seo/seo-main-content";
import FeaturedProducts from "./feature-product";
import HeroBanner, { SliderItem } from "./hero-banner";
import ShopByCategories from "./shop-by-category";
import { FeaturedBrandsSection } from "./features-brand/FeaturedBrandsSection";
import { HomeBlogsSection } from "./HomeBlogsSection";
import type { FeaturedCategory } from "@/utils/types";
import FoodTruckBanner from "@/assets/banners/Food-Truck-Banner.webp";
import Image from "next/image";

export const Home = ({
  sliderItems = [],
  sliderItemsTwo = [],
  featuredCategories = [],
}: {
  sliderItems?: SliderItem[];
  sliderItemsTwo?: SliderItem[];
  featuredCategories?: FeaturedCategory[];
}) => {
  return (
    <>
      {/* HeroBanner is "use client" for Swiper + financing modal state */}
      <HeroBanner slides={sliderItems} sliderItemsTwo={sliderItemsTwo} />

      {/* Pure server HTML — no interactivity needed */}
      <SEOMainContent
        categorySlug="Restaurant Supply Store for Commercial Kitchen Equipment & Supplies"
        APIDATA={{
          title:
            "Shop Professional Restaurant Equipment, Foodservice Supplies, and Refrigeration Solutions",
          description:
            "HorecaStore is a leading restaurant supply store offering commercial kitchen equipment and foodservice supplies for restaurants, hotels, cafes, and catering businesses. Our extensive product range includes commercial refrigeration, cooking equipment, prep tables, cookware, cleaning supplies, and essential restaurant tools built for daily professional use. We focus on quality, performance, and long-term reliability to meet the demands of modern commercial kitchens. Whether you're launching a new restaurant or upgrading existing operations, HorecaStore provides cost-effective solutions backed by trusted brands and dependable delivery. Shop with confidence and equip your foodservice business with durable, industry-approved equipment designed to improve efficiency and productivity.",
        }}
      />

      {/* Pure server HTML — links/images, no client JS */}
      <ShopByCategories />

      {/* "use client" for tab switching + client-side products fetch on tab change */}
      <FeaturedProducts categories={featuredCategories} />

      {/* Static banner image — server HTML */}
      <div className="w-full md:py-10 py-4">
        <div className="global-container">
          <div className="grid grid-cols-1">
            <Image
              src={FoodTruckBanner}
              alt="Food Truck Banner"
              loading="lazy"
              className="rounded-[7px] w-full h-auto"
              sizes="100vw"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Pure server HTML — SSR-fetched, no client-side refetch */}
      <FeaturedBrandsSection />

      <div className="md:block hidden">
        <HomeBlogsSection />
      </div>
    </>
  );
};

export default Home;
