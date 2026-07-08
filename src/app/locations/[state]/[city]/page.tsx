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

// ── Mapper ─────────────────────────────────────────────────────────────────────

function mapApiResponse(d: HorecaPageApiData): LocationPageData {
  const trans = d.seo_url?.translations?.[0];

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
    paragraph_1: trans?.paragraph_1 ?? null,
    paragraph_2: trans?.paragraph_2 ?? null,
    paragraph_3: trans?.paragraph_3 ?? null,
    paragraph_4: trans?.paragraph_4 ?? null,
    popularTag_details: (trans?.popular_tag_details ?? []).filter(
      (t) => !!(t.popularTags && t.popularSlug)
    ),
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

  const trans = res.data.seo_url?.translations?.[0];
  const title = trans?.title_tag ?? trans?.meta_title ?? res.data.name;
  const description = trans?.meta_description ?? undefined;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://www.thehorecastore.com/locations/${state}/${city}`,
    },
    openGraph: {
      title: trans?.og_title ?? title ?? undefined,
      description: trans?.og_description ?? description,
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
