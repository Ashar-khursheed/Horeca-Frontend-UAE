import { Suspense } from "react";
import Image from "next/image";
import SEOMainContent from "@/seo/seo-main-content";
import { SliderItem } from "./hero-banner";
import HeroBannerClient from "./hero-banner-client";
import ShopByCategories from "./shop-by-category";
import type { ApiCategory } from "@/utils/types";
import { FeaturedProductsSection } from "./feature-product/FeaturedProductsSection";
import { FeaturedBrandsSection } from "./features-brand/FeaturedBrandsSection";
import { BlogsSection } from "./BlogsSection";
import FoodTruckBanner from "@/assets/banners/Food-Truck-Banner.webp";
const ProductsSkeleton = () => (
  <div className="animate-pulse w-full bg-white py-5">
    <div className="global-container">
      <div className="h-7 bg-gray-200 rounded w-48 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-gray-200 rounded-[7px]" />
        ))}
      </div>
    </div>
  </div>
);

export const Home = ({
  sliderItems = [],
  sliderItemsTwo = [],
  featuredCategories = [],
}: {
  sliderItems?: SliderItem[];
  sliderItemsTwo?: SliderItem[];
  featuredCategories?: ApiCategory[];
}) => {
  return (
    <>
      <HeroBannerClient slides={sliderItems} sliderItemsTwo={sliderItemsTwo} />
      <SEOMainContent
        categorySlug="horeca-store"
        APIDATA={{
          title:
            "Your One-Stop Shop for Professional Kitchen & Hospitality Equipment",
          description:
            "HorecaStore is the UAE's leading B2B marketplace for hotels, restaurants, and cafes. Browse thousands of NSF & UL certified products — from commercial cooking equipment and refrigeration to smallwares and supplies. Get competitive pricing, fast delivery, and dedicated support for all your hospitality needs.",
        }}
      />
      <ShopByCategories categories={featuredCategories} />

      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>

      <div className="w-full md:py-10 py-4">
        <div className="global-container">
          <div className="grid grid-cols-1">
            <Image
              src={FoodTruckBanner}
              alt="Food Truck Banner"
              loading="lazy"
              className="rounded-[7px] w-full h-auto"
              sizes="100vw"
            />
          </div>
        </div>
      </div>

      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedBrandsSection />
      </Suspense>

      <Suspense fallback={<div className="h-48" />}>
        <BlogsSection />
      </Suspense>
    </>
  );
};

export default Home;
