import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import LocationPageClient from "@/features/location/LocationPageClient";
import type { LocationPageData } from "@/features/location/LocationPageClient";
import type { RawApiProduct } from "@/components/product-card";
import { revalidate } from "@/utils";

interface PageProps {
  params: Promise<{ state: string; city: string }>;
}

// ── API Response Types ─────────────────────────────────────────────────────────

interface HorecaPageProduct extends RawApiProduct {
  category_url_resolved?: string;
  parent_category_url_resolved?: string;
}

interface HorecaPageTranslation {
  title_tag: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  paragraph_1: string | null;
  paragraph_2: string | null;
  paragraph_3: string | null;
  paragraph_4: string | null;
  popular_tag_details: { popularTags: string; popularSlug: string }[] | null;
}

interface HorecaPageApiData {
  id: number;
  name: string;
  description: string | null;
  link_name: string | null;
  link_url: string | null;
  banner_url: string | null;
  left_para_description: string | null;
  right_para_description: string | null;
  faqs: string;
  is_active: number;
  categories: { id: number; name: string; image: string; slug: string; order: number }[];
  product_types: {
    id: number;
    type: string;
    description: string;
    order: number;
    products: HorecaPageProduct[];
  }[];
  seo_url: {
    translations: HorecaPageTranslation[];
  } | null;
}

interface HorecaPageResponse {
  success: boolean;
  data: HorecaPageApiData;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function stripHtmlTags(str: string | null | undefined): string | undefined {
  if (!str || str === "null" || str === "undefined") return undefined;
  const stripped = String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return stripped || undefined;
}

function getSeoField(seoUrl: any, fieldName: string): string | null {
  if (!seoUrl) return null;

  // 1. Check in translations array (e.g. seoUrl.translations[0].paragraph_1)
  if (Array.isArray(seoUrl.translations) && seoUrl.translations.length > 0) {
    const trans = seoUrl.translations.find((t: any) => t.locale === "en") || seoUrl.translations[0];
    if (trans && trans[fieldName] != null) {
      const val = trans[fieldName];
      if (typeof val === "string" && val.trim() !== "") return val;
      if (typeof val === "object" && val !== null) {
        const localized = val.en ?? val.ar ?? Object.values(val)[0];
        if (typeof localized === "string" && localized.trim() !== "") return localized;
      }
    }
  }

  // 2. Check direct property on seoUrl (e.g. seoUrl.paragraph_1)
  const directVal = seoUrl[fieldName];
  if (directVal != null) {
    if (typeof directVal === "string" && directVal.trim() !== "") return directVal;
    if (typeof directVal === "object" && directVal !== null) {
      const localized = directVal.en ?? directVal.ar ?? Object.values(directVal)[0];
      if (typeof localized === "string" && localized.trim() !== "") return localized;
    }
  }

  return null;
}

function getSeoPopularTags(seoUrl: any): { popularTags: string; popularSlug: string }[] {
  if (!seoUrl) return [];

  let rawTags: any = null;

  if (Array.isArray(seoUrl?.translations) && seoUrl.translations.length > 0) {
    const trans = seoUrl.translations.find((t: any) => t.locale === "en") || seoUrl.translations[0];
    if (trans && trans.popular_tag_details != null) {
      rawTags = trans.popular_tag_details;
    }
  }

  if (!rawTags && seoUrl?.popular_tag_details != null) {
    rawTags = seoUrl.popular_tag_details;
  }

  if (!rawTags) return [];

  if (typeof rawTags === "object" && !Array.isArray(rawTags) && rawTags !== null) {
    rawTags = rawTags.en ?? rawTags.ar ?? Object.values(rawTags)[0] ?? null;
  }

  if (typeof rawTags === "string") {
    try {
      rawTags = JSON.parse(rawTags);
    } catch {
      return [];
    }
  }

  if (Array.isArray(rawTags)) {
    return rawTags
      .filter((t: any) => t && (t.popularTags || t.popular_tags) && (t.popularSlug || t.popular_slug))
      .map((t: any) => ({
        popularTags: t.popularTags ?? t.popular_tags ?? "",
        popularSlug: t.popularSlug ?? t.popular_slug ?? "",
      }));
  }

  return [];
}

// ── Mapper ─────────────────────────────────────────────────────────────────────

function mapApiResponse(d: HorecaPageApiData): LocationPageData {
  let faqs: { question: string; answer: string }[] = [];
  try { faqs = JSON.parse(d.faqs || "[]"); } catch { faqs = []; }

  return {
    id: d.id,
    heroTitle: d.name,
    heroDescription: d.description ?? "",
    heroCta: d.link_name ?? "SHOP RESTAURANT SUPPLIES",
    banner_slug: d.link_url ?? "/",
    banner_image_file: d.banner_url ?? "",
    banner_image_alt_text: d.name,
    leftParaDescription: d.left_para_description ?? "",
    rightParaDescription: d.right_para_description ?? "",
    categories: (d.categories ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
    })),
    productTypes: (d.product_types ?? []).map((pt) => ({
      id: pt.id,
      type: pt.type,
      description: pt.description,
      products: pt.products.map((p) => ({
        ...p,
        // API returns resolved url fields — normalise to what ProductCard expects
        category_url: p.category_url_resolved ?? p.category_url,
        parent_category_url: p.parent_category_url_resolved ?? p.parent_category_url,
      })),
    })),
    faqs,
    paragraph_1: getSeoField(d.seo_url, "paragraph_1"),
    paragraph_2: getSeoField(d.seo_url, "paragraph_2"),
    paragraph_3: getSeoField(d.seo_url, "paragraph_3"),
    paragraph_4: getSeoField(d.seo_url, "paragraph_4"),
    popularTag_details: getSeoPopularTags(d.seo_url),
    whyChoosePoints: [],
  };
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city } = await params;
  const [cookieStore, reqHeaders] = await Promise.all([cookies(), headers()]);
  const countryCode =
    reqHeaders.get("x-country-code") ?? cookieStore.get("hc_cc")?.value ?? "US";
  const res = await makeApiCallSSR<HorecaPageResponse>(
    apiUrls.HORECA_PAGE_BY_SLUG(state, city),
    {},
    { revalidate: revalidate, countryCode },
  );

  if (!res?.success || !res?.data) return { title: "Page Not Found" };

  const rawTitle = getSeoField(res.data.seo_url, "title_tag") ?? getSeoField(res.data.seo_url, "meta_title");
  const title = stripHtmlTags(rawTitle) ?? res.data.name;
  const description = stripHtmlTags(getSeoField(res.data.seo_url, "meta_description"));

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://www.thehorecastore.com/locations/${state}/${city}`,
    },
    openGraph: {
      title: stripHtmlTags(getSeoField(res.data.seo_url, "og_title")) ?? title,
      description: stripHtmlTags(getSeoField(res.data.seo_url, "og_description")) ?? description,
      url: `https://www.thehorecastore.com/locations/${state}/${city}`,
      type: "website",
      images: res.data.banner_url
        ? [{ url: res.data.banner_url, alt: res.data.name }]
        : undefined,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LocationCityPage({ params }: PageProps) {
  const { state, city } = await params;
  const [cookieStore, reqHeaders] = await Promise.all([cookies(), headers()]);
  const countryCode =
    reqHeaders.get("x-country-code") ?? cookieStore.get("hc_cc")?.value ?? "US";
  const res = await makeApiCallSSR<HorecaPageResponse>(
    apiUrls.HORECA_PAGE_BY_SLUG(state, city),
    {},
    { revalidate: revalidate, countryCode },
  );

  if (!res?.success || !res?.data || !res.data.is_active) notFound();

  return <LocationPageClient data={mapApiResponse(res.data)} state={state} city={city} />;
}
