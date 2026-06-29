import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import { productDetailRevalidate } from "@/utils";
import BrandDetailFeature, { type BrandDetailResponse } from "@/features/brand-detail";
import ProductJsonLd from "@/features/product-detail/json-ld-schema";
import { SITE_URL } from "@/utils/site-url";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await makeApiCallSSR<BrandDetailResponse>(
    apiUrls.BRAND_BY_SLUG(slug),
    {},
    { revalidate: productDetailRevalidate },
  );

  const seo   = data?.seo;
  const brand = data?.brand;

  const safe = (v?: string | null) => (!v || v === "undefined" ? undefined : v);

  const titleTag  = safe(seo?.title_tag?.en);
  const metaTitle = safe(seo?.meta_title?.en);
  const metaDesc  = safe(seo?.meta_description?.en);
  const ogTitle   = safe(seo?.og_title?.en) ?? metaTitle;
  const ogDesc    = safe(seo?.og_description?.en) ?? metaDesc;
  const bannerImg = safe(seo?.banner_image_url?.en);
  const bannerAlt = safe(seo?.banner_image_alt_text?.en);

  return {
    title:       titleTag ?? metaTitle ?? brand?.name?.en ?? slug,
    description: metaDesc ?? undefined,
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_URL}/brands/${slug}` },
    openGraph: {
      title:       ogTitle ?? undefined,
      description: ogDesc  ?? undefined,
      url:  `${SITE_URL}/brands/${slug}`,
      type: "website",
      images: bannerImg ? [{ url: bannerImg, alt: bannerAlt ?? "" }] : undefined,
    },
  };
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await makeApiCallSSR<BrandDetailResponse>(
    apiUrls.BRAND_BY_SLUG(slug),
    { page: 1 },
    { revalidate: productDetailRevalidate },
  );
    const schemaObj = data?.seo?.seo_schema?.en;
  const schema: string | null | undefined = typeof schemaObj === "string"
    ? schemaObj
    : schemaObj
    ? JSON.stringify(schemaObj)
    : undefined;

  if (!data?.success || !data?.brand) notFound();

  return (
    <>
       <ProductJsonLd schema={schema} />
    <BrandDetailFeature data={data} /></>
  )
}
