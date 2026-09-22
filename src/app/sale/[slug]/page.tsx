import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import SaleLandingClient from "@/features/sale/SaleLandingClient";
import {
  buildSaleLandingParams,
  isUsableBanner,
  mapLandingProduct,
  normalizeSaleSlug,
  parseBrandIds,
  saleLandingFallbackUrl,
  saleLandingPath,
  titleFromSlug,
  type SaleLandingResponse,
} from "@/features/sale/sale-landing";
import { SITE_URL } from "@/utils/site-url";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    category_id?: string;
    brand_id?: string;
    price_min?: string;
    price_max?: string;
    discount_min?: string;
    discount_max?: string;
    search?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: string;
  }>;
}

async function getCountryCode() {
  const [cookieStore, reqHeaders] = await Promise.all([cookies(), headers()]);
  return (
    reqHeaders.get("x-country-code") ??
    cookieStore.get("hc_cc")?.value ??
    process.env.NEXT_PUBLIC_FORCE_COUNTRY ??
    "AE"
  );
}

async function fetchLanding(
  slug: string,
  params: Record<string, string | number>,
  countryCode: string,
) {
  const primary = saleLandingPath(slug);
  const first = await makeApiCallSSR<SaleLandingResponse>(primary, params, {
    revalidate: 60,
    countryCode,
  });
  if (first?.success && first.data) {
    return { res: first, endpoint: primary };
  }

  const currentBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  if (!currentBase.includes("test-us.thehorecastore.co")) {
    const fallback = saleLandingFallbackUrl(slug);
    const second = await makeApiCallSSR<SaleLandingResponse>(fallback, params, {
      revalidate: 60,
      countryCode,
    });
    if (second?.success && second.data) {
      return { res: second, endpoint: fallback };
    }
  }

  return { res: first, endpoint: primary };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normalizeSaleSlug(rawSlug);
  const countryCode = await getCountryCode();
  const { res } = await fetchLanding(slug, { page: 1, per_page: 1 }, countryCode);

  const data = res?.data;
  const path = data?.seo_url?.startsWith("/")
    ? data.seo_url
    : `/sale/${slug}`;
  const canonical = `${SITE_URL}${path}`;
  const title = data?.title || titleFromSlug(slug);
  const description = data?.description || undefined;
  const index = data?.seo_management?.indexing !== 0;
  const ogImage = isUsableBanner(data?.desktop_banner)
    ? data?.desktop_banner
    : undefined;

  return {
    title,
    description,
    robots: { index, follow: true },
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: ogImage
        ? [{ url: ogImage, alt: data?.desktop_banner_alt || title }]
        : undefined,
    },
  };
}

export default async function SaleSlugPage({ params, searchParams }: PageProps) {
  const { slug: rawSlug } = await params;
  const query = await searchParams;
  const slug = normalizeSaleSlug(rawSlug);
  const countryCode = await getCountryCode();
  const { res, endpoint } = await fetchLanding(
    slug,
    buildSaleLandingParams({
      category_id: query.category_id,
      brand_id: query.brand_id,
      price_min: query.price_min,
      price_max: query.price_max,
      discount_min: query.discount_min,
      discount_max: query.discount_max,
      search: query.search,
      sort_by: query.sort_by,
      sort_order: query.sort_order,
      page: query.page,
      per_page: query.per_page,
    }),
    countryCode,
  );

  if (!res?.success || !res.data) {
    notFound();
  }
  if (res.data.status && res.data.status.toLowerCase() !== "active") {
    notFound();
  }

  const data = res.data;
  const title = data.title || titleFromSlug(slug);

  return (
    <SaleLandingClient
      slug={slug}
      endpoint={endpoint}
      initialCategoryId={query.category_id ?? null}
      initialBrandIds={parseBrandIds(query.brand_id)}
      initialSearch={query.search ?? ""}
      initialSortBy={query.sort_by ?? ""}
      initialPriceMin={query.price_min ? Number(query.price_min) : null}
      initialPriceMax={query.price_max ? Number(query.price_max) : null}
      data={{
        title,
        description: data.description ?? "",
        desktopBanner: isUsableBanner(data.desktop_banner)
          ? data.desktop_banner!
          : null,
        desktopBannerAlt: data.desktop_banner_alt || title,
        mobileBanner: isUsableBanner(data.mobile_banner)
          ? data.mobile_banner!
          : null,
        mobileBannerAlt: data.mobile_banner_alt || title,
        products: (data.products ?? []).map(mapLandingProduct),
        filters: data.filters ?? {},
        totalProducts: data.pagination?.total ?? data.products?.length ?? 0,
        totalPages: data.pagination?.last_page ?? 1,
        currentPage: data.pagination?.current_page ?? 1,
      }}
    />
  );
}
