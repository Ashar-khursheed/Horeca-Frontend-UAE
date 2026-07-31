import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import { productDetailRevalidate } from "@/utils";
import { SITE_URL } from "@/utils/site-url";
import BrandDetailFeature, {
  type BrandDetailResponse,
  type BrandCategoryProductsResponse,
} from "@/features/brand-detail";

interface PageProps {
  params: Promise<{ slug: string; categorySlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, categorySlug } = await params;
  const [cookieStore, reqHeaders] = await Promise.all([cookies(), headers()]);
  const countryCode =
    reqHeaders.get("x-country-code") ?? cookieStore.get("hc_cc")?.value ?? "US";
  const [brandData, catData] = await Promise.all([
    makeApiCallSSR<BrandDetailResponse>(apiUrls.BRAND_BY_SLUG(slug), {}, { revalidate: productDetailRevalidate, countryCode }),
    makeApiCallSSR<BrandCategoryProductsResponse>(apiUrls.BRAND_CATEGORY_PRODUCTS(slug, categorySlug), {}, { revalidate: productDetailRevalidate, countryCode }),
  ]);

  const brandName = brandData?.data?.name?.en ?? slug;
  const catName = brandData?.data?.categories?.find((c) => c.url === categorySlug)?.name?.en ?? categorySlug;

  return {
    title: `${catName} - ${brandName}`,
    alternates: {
      canonical: `${SITE_URL}/brands/${slug}/${categorySlug}`,
    },
     robots: {index: true, follow: true} ,
  };
}

export default async function BrandCategoryPage({ params }: PageProps) {
  const { slug, categorySlug } = await params;
  const [cookieStore, reqHeaders] = await Promise.all([cookies(), headers()]);
  const countryCode =
    reqHeaders.get("x-country-code") ?? cookieStore.get("hc_cc")?.value ?? "US";

  const [brandData, catData] = await Promise.all([
    makeApiCallSSR<BrandDetailResponse>(apiUrls.BRAND_BY_SLUG(slug), {}, { revalidate: productDetailRevalidate, countryCode }),
    makeApiCallSSR<BrandCategoryProductsResponse>(apiUrls.BRAND_CATEGORY_PRODUCTS(slug, categorySlug), {}, { revalidate: productDetailRevalidate, countryCode }),
  ]);

  if (!brandData?.success || !brandData?.data) notFound();

  return (
    <BrandDetailFeature
      data={brandData.data}
      brandSlug={slug}
      selectedCategoryUrl={categorySlug}
      categoryProductsData={catData ?? undefined}
    />
  );
}
