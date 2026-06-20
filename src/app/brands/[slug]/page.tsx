import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import { productDetailRevalidate } from "@/utils";
import BrandDetailFeature, { type BrandDetailResponse } from "@/features/brand-detail";

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

  const seo   = data?.seo?.current_translation;
  const brand = data?.brand;

  return {
    title:       seo?.title_tag ?? seo?.meta_title ?? brand?.name?.en ?? slug,
    description: seo?.meta_description ?? undefined,
    robots: { index: data?.seo?.indexing ?? true, follow: true },
    alternates: { canonical: `${process.env.NEXT_SITE_URL}/brands/${slug}` },
    openGraph: {
      title:       seo?.og_title && seo.og_title !== "undefined" ? seo.og_title : (seo?.meta_title ?? undefined),
      description: seo?.og_description && seo.og_description !== "undefined" ? seo.og_description : (seo?.meta_description ?? undefined),
      url:  `${process.env.NEXT_SITE_URL}/brands/${slug}`,
      type: "website",
      images: seo?.banner_image_url ? [{ url: seo.banner_image_url, alt: seo.banner_image_alt_text ?? "" }] : undefined,
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

  if (!data?.success || !data?.brand) notFound();

  return <BrandDetailFeature data={data} />;
}
