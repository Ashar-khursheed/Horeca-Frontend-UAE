import dynamic from "next/dynamic";
import Image from "next/image";
import SEOMainContent from "@/seo/seo-main-content";
import HeroBanner, { SliderItem } from "./hero-banner";
import ShopByCategories from "./shop-by-category";
import type { ApiCategory, FeaturedCategory } from "@/utils/types";

const FeaturedProducts = dynamic(() => import("./feature-product"));
const FeaturedBrands = dynamic(() => import("./features-brand"));
const BlogsCard = dynamic(() =>
  import("@/components/blog-card").then((m) => ({ default: m.BlogsCard }))
);

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
      <FeaturedProducts products={featuredProducts} />
      <div className="w-full md:py-10 py-4">
        <div className="global-container">
          <div className="grid grid-cols-1">
            <Image
              src="https://www.thehorecastore.com/images/Banners/Food%20Truck/Hero%20Banner.webp"
              alt="Food Truck Banner"
              width={1200}
              height={400}
              loading="lazy"
              className="rounded-[7px] w-full h-auto"
            />
          </div>
        </div>
      </div>
      <FeaturedBrands products={featuredBrandProducts} />
      <BlogsCard showAll={false} blogs={blogs} />
    </>
  );
};

export default Home;
