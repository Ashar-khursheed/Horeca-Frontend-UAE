import type { Metadata } from "next";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import HomePage from "@/features/home";
import { SliderItem } from "@/features/home/hero-banner";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiCategory, FeaturedCategory, FeaturedCategoryTab, ApiProductRaw } from "@/utils/types";
import { cookies } from "next/headers";
import { revalidate } from "@/utils";

export const metadata: Metadata = {
  title: "Restaurant Supply Store & Commercial Equipment | HorecaStore",
  description:
    "HorecaStore is a reliable restaurant supply store providing commercial equipment, restaurant supplies, cookware, refrigeration, and foodservice essentials.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://www.horecastore.ae/",
  },
  openGraph: {
    title: "Buy Restaurant Supplies & Commercial Equipment – HorecaStore",
    description:
      "HorecaStore is your trusted Restaurant Supply Store & Commercial Equipment destination. Discover durable commercial kitchen tools, shop with confidence, and buy now to equip your business efficiently.",
    url: "https://www.horecastore.ae/",
    type: "website",
  },
};

// export const dynamic = "force-dynamic";
// export const revalidate = 3600;
export default async function Page() {
  const cookieStore = await cookies();
  const isLoggedIn  = !!cookieStore.get("token")?.value;

  const [slider1, slider2, categoryRes, featuredCategoriesRes, categoryTabsRes, featuredBrandProductsRes] = await Promise.all([
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
    makeApiCallSSR<{ data: FeaturedCategoryTab[] }>(
      apiUrls.FEATURED_CATEGORY_TABS,
      {},
      { revalidate: revalidate },
    ),
    makeApiCallSSR<{ data: FeaturedCategory[] }>(
      apiUrls.FEATURED_BRAND_PRODUCTS,
      {},
      { revalidate: revalidate, withAuth: isLoggedIn },
    ),
  ]);

  const categoryTabs = categoryTabsRes?.data ?? [];

  // Fetch initial products for the first tab SSR
  const firstTabId = categoryTabs[0]?.id;
  const initialProductsRes = firstTabId
    ? await makeApiCallSSR<{ data: ApiProductRaw[] }>(
        apiUrls.FEATURED_CATEGORY_TABS,
        { category_id: firstTabId },
        { revalidate: revalidate, withAuth: isLoggedIn },
      )
    : null;

  const sliderItems        = slider1?.items ?? [];
  const sliderItemsTwo     = slider2?.items ?? [];
  const featuredCategories = featuredCategoriesRes?.data ?? [];
  const initialFeaturedProducts: ApiProductRaw[] = initialProductsRes?.data ?? [];
  const featuredBrandProducts  = featuredBrandProductsRes?.data ?? [];

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.thehorecastore.com/#organization",
        "name": "The HorecaStore",
        "legalName": "The Horeca Store Inc",
        "alternateName": "The HorecaStore",
        "url": "https://www.thehorecastore.com",
        "logo": "https://www.thehorecastore.com/images/logo/11_Sep_2025_logo.png",
        "description": "Trusted U.S. supplier providing high-quality commercial kitchen equipment and professional hotel, restaurant, and café supplies.",
        "foundingDate": "2020",
        "founder": { "@type": "Person", "name": "Noman Peera" },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-866-446-7322",
          "contactType": "Sales",
          "areaServed": "US",
        },
        "knowsAbout": [
          "Restaurant Equipment",
          "Commercial Kitchen Equipment",
          "Hotel Supplies",
          "Restaurant Supplies",
        ],
        "sameAs": [
          "https://www.facebook.com/horecastoreamerica",
          "https://www.instagram.com/horecastoreamerica",
          "https://www.linkedin.com/company/horecastoreamerica",
          "https://www.youtube.com/@horecastoreinternational",
          "https://www.yelp.com/biz/the-horeca-store-houston",
          "https://share.google/lB0ZElNyy7Vd7KbTV",
          "https://www.crunchbase.com/organization/the-horeca-store",
          "https://www.pinterest.com/thehorecastoreamerica",
          "https://x.com/HorecastoreUSA",
          "https://www.tiktok.com/@thehorecastoreusa",
          "https://www.trustpilot.com/review/thehorecastore.com",
          "https://www.chamberofcommerce.com/business-directory/texas/houston/kitchen-supply-store/2033926095-the-horeca-store",
          "https://www.merchantcircle.com/the-horecastore-houston-tx",
          "https://www.manta.com/c/m1wng4g/the-horeca-store",
          "https://citysquares.com/b/the-horecastore-26689496?updated=true",
          "https://www.brownbook.net/business/54269743/the-horecastore",
          "https://www.cylex.us.com/company/the-horeca-store-37695046.html",
          "https://www.hotfrog.com/company/5e187734dfc7b90b0e3033963cdb8c9c/the-horecastore/houston/services-supplies",
          "https://www.n49.com/biz/6093837/the-horeca-store-tx-houston-8800-bissonnet-st-suite-a",
          "https://www.f6s.com/company/the-horeca-store",
          "https://www.showmelocal.com/39108720-the-horecastore-houston",
          "https://patch.com/texas/houston/business/listing/548472/the-horecastore",
          "https://www.superpages.com/houston-tx/bpp/the-horeca-store-579639691",
          "https://www.dexknows.com/houston-tx/bp/the-horeca-store-579639691",
          "https://www.2findlocal.com/b/15282963/the-horecastore-houston-tx",
          "https://www.cybo.com/US-biz/the-horeca-store",
          "https://www.find-us-here.com/businesses/The-Horecastore-Houston-Texas-USA/34367392",
          "https://www.bunity.com/the-horecastore#",
          "https://linktr.ee/thehorecastore",
          "https://addyp.com/listing/tx/houston/find-top-best-b2b-services-near-me/the-horecastore",
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.thehorecastore.com/#localbusiness",
        "name": "The HorecaStore",
        "image": "https://www.thehorecastore.com/images/logo/11_Sep_2025_logo.png",
        "url": "https://www.thehorecastore.com",
        "telephone": "+1-866-446-7322",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "8800 Bissonnet St Suite A",
          "addressLocality": "Houston",
          "addressRegion": "TX",
          "postalCode": "77074",
          "addressCountry": "US",
        },
        "areaServed": { "@type": "Country", "name": "United States" },
        "parentOrganization": { "@id": "https://www.thehorecastore.com/#organization" },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <main>
        <HomePage sliderItems={sliderItems} sliderItemsTwo={sliderItemsTwo} featuredCategories={featuredCategories} categoryTabs={categoryTabs} initialFeaturedProducts={initialFeaturedProducts} featuredBrandProducts={featuredBrandProducts} />
      </main>
    </>
  );
}
