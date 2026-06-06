// import { Suspense } from "react";
// import Image from "next/image";
// import SEOMainContent from "@/seo/seo-main-content";
// import HeroBanner, { SliderItem } from "./hero-banner";
// import ShopByCategories from "./shop-by-category";
// import type { ApiCategory } from "@/utils/types";
// import { FeaturedProductsSection } from "./feature-product/FeaturedProductsSection";
// import { FeaturedBrandsSection } from "./features-brand/FeaturedBrandsSection";
// import { BlogsSection } from "./BlogsSection";
// import FoodTruckBanner from "@/assets/banners/Food-Truck-Banner.webp";
// const ProductsSkeleton = () => (
//   <div className="animate-pulse w-full bg-white py-5">
//     <div className="global-container">
//       <div className="h-7 bg-gray-200 rounded w-48 mb-4" />
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
//         {Array.from({ length: 10 }).map((_, i) => (
//           <div key={i} className="aspect-[3/4] bg-gray-200 rounded-[7px]" />
//         ))}
//       </div>
//     </div>
//   </div>
// );

// export const Home = ({
//   sliderItems = [],
//   sliderItemsTwo = [],
//   featuredCategories = [],
// }: {
//   sliderItems?: SliderItem[];
//   sliderItemsTwo?: SliderItem[];
//   featuredCategories?: ApiCategory[];
// }) => {
//   return (
//     <>
//       <HeroBanner slides={sliderItems} sliderItemsTwo={sliderItemsTwo} />
// <SEOMainContent
//   categorySlug="horeca-store"
//   APIDATA={{
//     title:
//       "Your One-Stop Shop for Professional Kitchen & Hospitality Equipment",
//     description:
//       "HorecaStore is the UAE's leading B2B marketplace for hotels, restaurants, and cafes. Browse thousands of NSF & UL certified products — from commercial cooking equipment and refrigeration to smallwares and supplies. Get competitive pricing, fast delivery, and dedicated support for all your hospitality needs.",
//   }}
// />
//       <ShopByCategories categories={featuredCategories} />

//       {/* <Suspense fallback={<ProductsSkeleton />}> */}
//         <FeaturedProductsSection />
//       {/* </Suspense> */}

//       <div className="w-full md:py-10 py-4">
//         <div className="global-container">
//           <div className="grid grid-cols-1">
// <Image
//   src={FoodTruckBanner}
//   alt="Food Truck Banner"
//   priority
//   // loading="lazy"
//   className="rounded-[7px] w-full h-auto"
//   sizes="100vw"
//   decoding="async"
// />
//           </div>
//         </div>
//       </div>

//       {/* <Suspense fallback={<ProductsSkeleton />}> */}
//         <FeaturedBrandsSection />
//       {/* </Suspense> */}

//       {/* <Suspense fallback={<div className="h-48" />}> */}
//         <BlogsSection />
//       {/* </Suspense> */}
//     </>
//   );
// };

// export default Home;

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BlogsCard } from "@/components/blog-card";
import SEOMainContent from "@/seo/seo-main-content";
import FeaturedProducts from "./feature-product";
import FeaturedBrands from "./features-brand";
import HeroBanner, { SliderItem } from "./hero-banner";
import ShopByCategories from "./shop-by-category";
import type { ApiCategory, FeaturedCategory } from "@/utils/types";
import FoodTruckBanner from "@/assets/banners/Food-Truck-Banner.webp";
import Image from "next/image";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { useAppDispatch } from "@/store/hooks";
import { fetchCountryByName, resetCountry } from "@/store/slices/country/countrySlice";

// ── Component ──────────────────────────────────────────────────────────────────
export const Home = ({
  sliderItems = [],
  sliderItemsTwo = [],
  featuredCategories = [],
  featuredProducts = [],
  featuredBrandProducts = [],
  blogs = [],
}: {
  sliderItems?: SliderItem[];
  sliderItemsTwo?: SliderItem[];
  featuredCategories?: ApiCategory[];
  featuredProducts?: FeaturedCategory[];
  featuredBrandProducts?: FeaturedCategory[];
  blogs?: any[];
}) => {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [products,      setProducts]      = useState<FeaturedCategory[]>(featuredProducts);
  const [brandProducts, setBrandProducts] = useState<FeaturedCategory[]>(featuredBrandProducts);

  useEffect(() => {
    const DETECT_KEY = "hc_detect_time";
    const DETECT_TTL = 10 * 1000; // 10 seconds

    const currentCookie = document.cookie
      .split(";").find(c => c.trim().startsWith("hc_cc="))?.split("=")[1];

    const lastDetect  = localStorage.getItem(DETECT_KEY);
    const isCacheValid = lastDetect && Date.now() - Number(lastDetect) < DETECT_TTL;

    if (isCacheValid && currentCookie) return;

    fetch("https://pim.thehorecastore.co/api/frontend/location")
      .then(r => r.json())
      .then(async data => {
        if (data.status === "success" && data.countryCode) {
          const detected = data.countryCode;
          const now = Date.now().toString();
          localStorage.setItem(DETECT_KEY,             now);
          localStorage.setItem("hc_country_code",      detected);
          localStorage.setItem("hc_country_code_time", now);
          document.cookie = `hc_cc=${detected}; path=/; max-age=3600; SameSite=Lax`;

          if (detected !== currentCookie) {
            // Reset Redux country so it re-fetches with new force_country
            dispatch(resetCountry());
            dispatch(fetchCountryByName(data.country));

            // Client-side re-fetch products — no SSR round-trip, ~300ms
            try {
              const [fp, fbp] = await Promise.all([
                makeApiRequest<{ data: FeaturedCategory[] }>(apiUrls.FEATURED_PRODUCTS),
                makeApiRequest<{ data: FeaturedCategory[] }>(apiUrls.FEATURED_BRAND_PRODUCTS),
              ]);
              if (fp?.data)  setProducts(fp.data);
              if (fbp?.data) setBrandProducts(fbp.data);
            } catch {
              router.refresh(); // fallback
            }
          }
        }
      })
      .catch(() => {});
  }, [router]);

  return (
    <>
      <HeroBanner slides={sliderItems} sliderItemsTwo={sliderItemsTwo} />
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
      <FeaturedProducts products={products} />
      <div className="w-full md:py-10 py-4">
        <div className="global-container">
          <div className="grid grid-cols-1">
            <Image
              src={FoodTruckBanner}
              alt="Food Truck Banner"
              priority
              // loading="lazy"
              className="rounded-[7px] w-full h-auto"
              sizes="100vw"
              decoding="async"
            />
          </div>
        </div>
      </div>
      <FeaturedBrands products={brandProducts} />
      <BlogsCard showAll={false} blogs={blogs} />
      {/* <NewsletterSection/> */}
    </>
  );
};

export default Home;
