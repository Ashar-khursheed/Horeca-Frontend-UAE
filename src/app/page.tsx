import { makeApiCallSSR } from "@/apis/ssr-fetch";
import HomePage from "@/features/home";
import { SliderItem } from "@/features/home/hero-banner";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiCategory } from "@/utils/types";

export const revalidate = 3600;

export default async function Page() {
  const [slider1, slider2, featuredCategoriesRes] = await Promise.all([
    makeApiCallSSR<{ items: SliderItem[] }>("frontend/sliders/1", {}, { revalidate: 3600 }),
    makeApiCallSSR<{ items: SliderItem[] }>("frontend/sliders/2", {}, { revalidate: 3600 }),
    makeApiCallSSR<{ data: ApiCategory[] }>(
      apiUrls.NavigationAPI,
      { with_parent: true, is_featured: true },
      { revalidate: 3600 },
    ),
  ]);

  const sliderItems = slider1?.items ?? [];
  const sliderItemsTwo = slider2?.items ?? [];
  const featuredCategories = featuredCategoriesRes?.data ?? [];

  return (
    <main>
      <HomePage
        sliderItems={sliderItems}
        sliderItemsTwo={sliderItemsTwo}
        featuredCategories={featuredCategories}
      />
    </main>
  );
}
