import { makeApiCallSSR } from "@/apis/ssr-fetch";
import HomePage from "@/features/home";
import { SliderItem } from "@/features/home/hero-banner";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiCategory, FeaturedCategory } from "@/utils/types";
import { cookies } from "next/headers";
import { revalidate } from "@/utils";

// export const dynamic = "force-dynamic";
// export const revalidate = 3600;
export default async function Page() {
  const cookieStore = await cookies();
  const isLoggedIn  = !!cookieStore.get("token")?.value;

  const [slider1, slider2, categoryRes, featuredCategoriesRes, featuredProductsRes,featuredBrandProductsRes,blogsRes] = await Promise.all([
    makeApiCallSSR<{ items: SliderItem[] }>("frontend/sliders/1", {}, { revalidate: revalidate }),
    makeApiCallSSR<{ items: SliderItem[] }>("frontend/sliders/2", {}, { revalidate: revalidate }),
    makeApiCallSSR<{ data: ApiCategory[] }>(
      apiUrls.NavigationAPI,
      { with_parent: false, is_featured: true },
      { revalidate: revalidate },
    ),
    makeApiCallSSR<{ data: ApiCategory[] }>(
      apiUrls.NavigationAPI,
      { with_parent: true, is_featured: true },
      { revalidate: revalidate},
    ),
    makeApiCallSSR<{ data: FeaturedCategory[] }>(
      apiUrls.FEATURED_PRODUCTS,
      {},
      { revalidate: revalidate, withAuth: isLoggedIn },
    ),
    makeApiCallSSR<{ data: FeaturedCategory[] }>(
      apiUrls.FEATURED_BRAND_PRODUCTS,
      {},
      { revalidate: revalidate, withAuth: isLoggedIn },
    ),
    makeApiCallSSR<{ data: FeaturedCategory[] }>(
      apiUrls.BLOGS,
      { per_page: 10, lang: "en", page: 1 },
      { revalidate: revalidate },
    ),
  ]);

  const sliderItems      = slider1?.items ?? [];
  const sliderItemsTwo   = slider2?.items ?? [];
  const featuredCategories = featuredCategoriesRes?.data ?? [];
  const featuredProducts = featuredProductsRes?.data ?? [];
  const featuredBrandProducts = featuredBrandProductsRes?.data ?? [];
  const blogs = blogsRes?.data ?? [];


  console.log("Home page data:", featuredProducts);
  
  return (
    <main>
      <HomePage sliderItems={sliderItems} sliderItemsTwo={sliderItemsTwo} featuredCategories={featuredCategories} featuredProducts={featuredProducts} featuredBrandProducts={featuredBrandProducts} blogs={blogs} />
    </main>
  );
}
