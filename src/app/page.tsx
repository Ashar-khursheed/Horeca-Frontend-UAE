import type { Metadata } from "next";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import HomePage from "@/features/home";
import { SliderItem } from "@/features/home/hero-banner";
import { apiUrls } from "@/apis/api-endpoint";
import type { FeaturedCategory } from "@/utils/types";
import type { MarketingPromotion } from "@/features/home/hero-banner/promotions-slider";
import { cookies, headers } from "next/headers";
import { revalidate } from "@/utils";
import { SITE_URL } from "@/utils/site-url";
import { HOME_SCHEMA } from "@/data/seo/home-schema";

export const metadata: Metadata = {
  // UAE-specific title/description: the US site (thehorecastore.com) used the
  // identical text, so search engines saw two sites competing for one query.
  title: "Restaurant Equipment & Supplies in Dubai, UAE | HorecaStore",
  description:
    "Shop commercial kitchen equipment, refrigeration, tableware and hotel supplies for restaurants, hotels and cafés across the UAE. Prices in AED.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: "Restaurant Equipment & Kitchen Supplies in the UAE – HorecaStore",
    description:
      "Commercial kitchen equipment, refrigeration, tableware and hotel supplies for restaurants, hotels and cafés across the UAE. Prices in AED.",
    url: `${SITE_URL}/`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/logo/11_Sep_2025_logo.png`,
        alt: "HorecaStore",
      },
    ],
  },
};

export default async function Page() {
  // ── Single dynamic read for the entire page ──────────────────────────────────
  // Reading cookies() and headers() here (once) is enough to opt this page into
  // dynamic rendering. Passing these dasdasda values explicitly to makeApiCallSSR means
  // those helpers never call cookies()/headers() themselves — no redundant reads.
  const [cookieStore, reqHeaders] = await Promise.all([cookies(), headers()]);
  const token       = cookieStore.get("token")?.value?.trim() ?? null;
  const isLoggedIn  = !!token;
  const countryCode =
    reqHeaders.get("x-country-code") ??
    cookieStore.get("hc_cc")?.value ??
    "US";

  const [
    slider1,
    slider2,
    featuredCategoriesRes,
    promotionsRes,
  ] = await Promise.all([
    makeApiCallSSR<{ items: SliderItem[] }>(
      "frontend/sliders/1",
      {},
      { revalidate: revalidate, countryCode },
    ),
    makeApiCallSSR<{ items: SliderItem[] }>(
      "frontend/sliders/2",
      {},
      { revalidate: revalidate, countryCode },
    ),
    makeApiCallSSR<{ data: FeaturedCategory[] }>(
      apiUrls.FEATURED_PRODUCTS,
      { products_limit: 12, limit: 5, min_products: 12 },
      { revalidate: isLoggedIn ? 0 : revalidate, countryCode },
    ),
    makeApiCallSSR<{ success: boolean; data: MarketingPromotion[] }>(
      apiUrls.MARKETING_PROMOTIONS_ACTIVE,
      {},
      { revalidate: revalidate, countryCode },
    ),
  ]);

  const sliderItems      = slider1?.items ?? [];
  const sliderItemsTwo   = slider2?.items ?? [];
  const featuredCategories = featuredCategoriesRes?.data ?? [];
  const promotions = promotionsRes?.data ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_SCHEMA) }}
      />
      <main>
        <HomePage
          sliderItems={sliderItems}
          sliderItemsTwo={sliderItemsTwo}
          featuredCategories={featuredCategories}
          promotions={promotions}
        />
      </main>
    </>
  );
}
