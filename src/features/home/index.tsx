// Server component — no "use client".
//
// Why this matters for performance:
//   When this file had "use client", React bundled the ENTIRE import graph
//   (Swiper, all section components, SEOMainContent, Image wrappers, etc.)
//   into the initial JS payload, even for parts that need zero interactivity.
//   Removing "use client" here means only explicitly-marked child components
//   (HeroBanner, FeaturedProducts, FeaturedBrandsDynamic, BlogsCard) ship
//   client-side JS. Everything else — SEOMainContent, ShopByCategories, the
//   FoodTruck banner Image — is pure static HTML, cutting TBT significantly.
//
// Country detection + brand-product state update are isolated in
// FeaturedBrandsDynamic so they don't force the whole page into a client tree.
// Blogs are now fetched SSR in page.tsx and passed as a prop, eliminating the
// useEffect waterfall that previously blocked the section until after hydration.

import { BlogsCard } from "@/components/blog-card";
import type { ApiBlog } from "@/components/blog-card";
import SEOMainContent from "@/seo/seo-main-content";
import FeaturedProducts from "./feature-product";
import HeroBanner, { SliderItem } from "./hero-banner";
import ShopByCategories from "./shop-by-category";
import { FeaturedBrandsDynamic } from "./features-brand/FeaturedBrandsDynamic";
import type { ApiCategory, ApiProductRaw, FeaturedCategory, FeaturedCategoryTab } from "@/utils/types";
import FoodTruckBanner from "@/assets/banners/Food-Truck-Banner.webp";
import Image from "next/image";

export const Home = ({
  sliderItems = [],
  sliderItemsTwo = [],
  featuredCategories = [],
  categoryTabs = [],
  initialFeaturedProducts = [],
  featuredBrandProducts = [],
  blogs = [],
}: {
  sliderItems?: SliderItem[];
  sliderItemsTwo?: SliderItem[];
  featuredCategories?: ApiCategory[];
  categoryTabs?: FeaturedCategoryTab[];
  initialFeaturedProducts?: ApiProductRaw[];
  featuredBrandProducts?: FeaturedCategory[];
  blogs?: ApiBlog[];
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
      <ShopByCategories categories={featuredCategories} />

      {/* "use client" for tab switching + client-side products fetch on tab change */}
      <FeaturedProducts tabs={categoryTabs} initialProducts={initialFeaturedProducts} />

      {/* Static banner image — server HTML */}
      <div className="w-full md:py-10 py-4">
        <div className="global-container">
          <div className="grid grid-cols-1">
            <Image
              src={FoodTruckBanner}
              alt="Food Truck Banner"
              priority
              className="rounded-[7px] w-full h-auto"
              sizes="100vw"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* "use client" — handles country-detection + brand-tab state.
          Renders SSR-provided initialProducts immediately, updates on country change. */}
      <FeaturedBrandsDynamic initialProducts={featuredBrandProducts} />

      {/* BlogsCard is "use client" for like/share interactions.
          Blogs data arrives SSR (no useEffect waterfall). */}
      <BlogsCard showAll={false} blogs={blogs} />
    </>
  );
};

export default Home;
