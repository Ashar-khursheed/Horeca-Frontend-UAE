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
// Blogs load client-side after first paint to keep the homepage HTML smaller.

import SEOMainContent from "@/seo/seo-main-content";
import SeoContent from "@/seo/seo-content";
import FeaturedProducts from "./feature-product";
import HeroBanner, { SliderItem } from "./hero-banner";
import ShopByCategories from "./shop-by-category";
import { FeaturedBrandsDynamic } from "./features-brand/FeaturedBrandsDynamic";
import { HomeBlogsSection } from "./HomeBlogsSection";
import type { ApiProductRaw, FeaturedCategoryTab } from "@/utils/types";
import FoodTruckBanner from "@/assets/banners/Food-Truck-Banner.webp";
import Image from "next/image";

// Static popular-search chips shown below the homepage SEO block.
const HOMEPAGE_POPULAR_SEARCHES = [
  { popularTags: "Countertop Convection Oven", popularSlug: "restaurant-equipment/countertop-convection-oven" },
  { popularTags: "Commercial Bar Blender", popularSlug: "restaurant-equipment/food-drink-blenders/hamilton-beach-fury-commercial-bar-blender-3hp-64oz" },
  { popularTags: "Bar Refrigeration", popularSlug: "refrigeration/bar-refrigeration" },
  { popularTags: "Commercial Ice Water Dispenser", popularSlug: "refrigeration/commercial-ice-water-dispenser" },
  { popularTags: "Commercial Oven", popularSlug: "restaurant-equipment/commercial-oven" },
  { popularTags: "Food Prep Equipment", popularSlug: "restaurant-equipment/food-prep-equipment" },
  { popularTags: "Commercial Gas Range", popularSlug: "restaurant-equipment/commercial-range" },
  { popularTags: "Commercial Fryer", popularSlug: "restaurant-equipment/commercial-fryer" },
  { popularTags: "Commercial Toaster", popularSlug: "restaurant-equipment/commercial-toaster" },
  { popularTags: "Rice Cookers / Warmers", popularSlug: "restaurant-equipment/rice-cookers-rice-warmers" },
  { popularTags: "Commercial Blender", popularSlug: "restaurant-equipment/commercial-blender" },
  { popularTags: "Dough Processing Equipment", popularSlug: "restaurant-equipment/dough-processing-equipment" },
  { popularTags: "Espresso Grinder", popularSlug: "restaurant-equipment/espresso-grinder" },
  { popularTags: "Coffee Bean Grinder", popularSlug: "restaurant-equipment/coffee-bean-grinder" },
  { popularTags: "Coffee Urn", popularSlug: "restaurant-equipment/coffee-urn" },
  { popularTags: "Commercial Pizza Oven", popularSlug: "restaurant-equipment/commercial-pizza-oven" },
  { popularTags: "Commercial Convection Oven", popularSlug: "restaurant-equipment/commercial-convection-oven" },
  { popularTags: "Prep Table", popularSlug: "refrigeration/prep-table" },
  { popularTags: "Floral Cooler", popularSlug: "refrigeration/floral-cooler" },
  { popularTags: "Merchandiser Refrigerator", popularSlug: "refrigeration/merchandiser-refrigerator" },
  { popularTags: "Glass Door Merchandising Freezer", popularSlug: "refrigeration/glass-door-merchandising-freezer" },
  { popularTags: "Ice Cream Freezer", popularSlug: "refrigeration/ice-cream-freezer" },
  { popularTags: "Walk-In Freezer", popularSlug: "refrigeration/walk-in-freezer" },
  { popularTags: "Walk-In Cooler / Freezer Combo", popularSlug: "refrigeration/walk-in-cooler-freezer-combo" },
  { popularTags: "Walk-In Cooler Box", popularSlug: "refrigeration/walk-in-cooler-box" },
  { popularTags: "Countertop Merchandiser Freezers", popularSlug: "refrigeration/countertop-merchandiser-freezers" },
  { popularTags: "Walk-In Refrigerator", popularSlug: "refrigeration/walk-in-refrigerator" },
  { popularTags: "Glassware", popularSlug: "glassware" },
  { popularTags: "Disposables", popularSlug: "disposables" },
  { popularTags: "Hotel Refrigerator", popularSlug: "hotel-supplies/hotel-refrigerator" },
  { popularTags: "Food Warmers & Holding Equipment", popularSlug: "restaurant-equipment/food-warmers-food-holding-equipment" },
  { popularTags: "Commercial Kitchen Exhaust Hood", popularSlug: "restaurant-equipment/exhaust-hood/captiveaire-22ft-commercial-kitchen-hood-system" },
  { popularTags: "Walk-In Coolers & Refrigerators", popularSlug: "refrigeration/walk-in-coolers-refrigerators" },
  { popularTags: "Ice Merchandiser", popularSlug: "refrigeration/ice-merchandiser" },
  { popularTags: "Coffee Truck", popularSlug: "food-trailers-and-trucks/coffee-truck/urban-espresso-14ft-coffee-trailer-equipped-mobile-cafe" },
  { popularTags: "pizza trailer for sale", popularSlug: "food-trailers-and-trucks/pizza-trailer" },
  { popularTags: "Ice Cream Trailer", popularSlug: "food-trailers-and-trucks/ice-cream-truck" },
  { popularTags: "Fried Chicken Trailer", popularSlug: "food-trailers-and-trucks/fried-chicken-food-truck/crunchmaster-18ft-fried-chicken-trailer-chicken-tenders-wing" },
  { popularTags: "Juice/Smoothie Trailer", popularSlug: "food-trailers-and-trucks/smoothie-truck/vitality-bar-14ft-juice-smoothie-trailer-equipped-juice-bar" },
  { popularTags: "pizza food trailer", popularSlug: "food-trailers-and-trucks/pizza-food-truck/firestone-16ft-pizza-trailer-equipped-mobile-pizza-kitchen" },
  { popularTags: "bbq food truck for sale", popularSlug: "food-trailers-and-trucks/bbq-trailer" },
  { popularTags: "Burger Food Trailer", popularSlug: "food-trailers-and-trucks/burger-food-truck" },
  { popularTags: "Soft-Serve Ice Cream Trailer", popularSlug: "food-trailers-and-trucks/ice-cream-truck/softserve-14ft-ice-cream-trailer-soft-serve-sundae-milkshake" },
  { popularTags: "Breakfast Trailer", popularSlug: "food-trailers-and-trucks/breakfast-food-truck/sunrise-16ft-breakfast-trailer-breakfast-brunch-coffee" },
  { popularTags: "Juice Extractor", popularSlug: "restaurant-equipment/juice-extractor/omega-150w-vertical-masticating-cold-press-juicer-compact" },
  { popularTags: "Used Commercial Gas Range", popularSlug: "used-restaurant-equipment/used-commercial-gas-range" },
  { popularTags: "Used Commercial Gas Fryer", popularSlug: "used-restaurant-equipment/used-commercial-gas-fryer" },
  { popularTags: "Used Charbroiler", popularSlug: "used-restaurant-equipment/used-charbroiler" },
  { popularTags: "Used Gas Griddle", popularSlug: "used-restaurant-equipment/used-gas-griddle" },
  { popularTags: "Used Reach In Refrigerator", popularSlug: "used-restaurant-equipment/used-reach-in-refrigerator" },
  { popularTags: "Used Merchandiser Refrigerator", popularSlug: "used-restaurant-equipment/used-merchandiser-refrigerator" },
  { popularTags: "Used Reach In Freezer", popularSlug: "used-restaurant-equipment/used-reach-in-freezer" },
  { popularTags: "Used Undercounter Refrigerator", popularSlug: "used-restaurant-equipment/used-undercounter-refrigerator" },
];

export const Home = ({
  sliderItems = [],
  sliderItemsTwo = [],
  categoryTabs = [],
  initialFeaturedProducts = [],
}: {
  sliderItems?: SliderItem[];
  sliderItemsTwo?: SliderItem[];
  categoryTabs?: FeaturedCategoryTab[];
  initialFeaturedProducts?: ApiProductRaw[];
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
      <FeaturedProducts tabs={categoryTabs} initialProducts={initialFeaturedProducts} />

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

      {/* "use client" — handles country-detection + brand-tab state.
          Renders SSR-provided initialProducts immediately, updates on country change. */}
      <FeaturedBrandsDynamic />

      <div className="md:block hidden">
        <HomeBlogsSection />
      </div>

        {/* Popular search chips — reuses the SeoContent component from category/brand pages */}
      <SeoContent dataAPI={{ popular_tag_details: { en: HOMEPAGE_POPULAR_SEARCHES } }} />
    </>
  );
};

export default Home;
