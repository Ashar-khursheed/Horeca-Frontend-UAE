import type { Metadata } from 'next'
import SubCategoryPage from '@/features/category/sub-category'
import { makeApiCallSSR } from '@/apis/ssr-fetch'
import { apiUrls } from '@/apis/api-endpoint'
import { ApiCategory, InnerCategoryPageResponse, ProductsListingResponse } from '@/utils/types'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ categorySlug: string; subCategorySlug: string }>
  searchParams: Promise<{
    parent?: string
    page?: string
    sort?: string
    show?: string
    brands?: string
    min?: string
    max?: string
    rf?: string
    ff?: string
  }>
}

const SORT_MAP: Record<string, { sort_by: string; sort_dir: string }> = {
  "Price: Low to High": { sort_by: "price",      sort_dir: "asc"  },
  "Price: High to Low": { sort_by: "price",      sort_dir: "desc" },
  // "Top Rated":          { sort_by: "avg_rating", sort_dir: "desc" },
  // "Newest First":       { sort_by: "created_at", sort_dir: "desc" },
}

const buildFilterBody = (slug: string) => ({
  category_url: slug,
  applied_filters: {},
  applied_range_filters: [{}],
  applied_fixed_filters: [{}],
  locale: "en",
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug, subCategorySlug } = await params

  const res = await makeApiCallSSR<InnerCategoryPageResponse>(
    apiUrls.INNER_CATEGORY_PAGES_WITH_FILTER,
    {},
    {
      revalidate: 3600,
      method: "POST",
      body: buildFilterBody(subCategorySlug),
    },
  )

  const seo = res?.seo
  if (!seo) return { title: subCategorySlug }

  return {
    title: seo.meta_title ?? seo.title_tag ?? subCategorySlug,
    description: seo.meta_description ?? undefined,
    robots: { index: seo.indexing ?? true, follow: true },
    alternates: {
      canonical: `https://www.horecastore.ae/${categorySlug}/${subCategorySlug}`,
    },
    openGraph: {
      title: seo.og_title ?? seo.meta_title ?? undefined,
      description: seo.og_description ?? seo.meta_description ?? undefined,
      url: `https://www.horecastore.ae/${categorySlug}/${subCategorySlug}`,
      images:
        seo.og_image_url && seo.og_image_url !== 'null'
          ? [{ url: seo.og_image_url, alt: seo.banner_image_alt_text ?? undefined }]
          : seo.banner_image_url
          ? [{ url: seo.banner_image_url, alt: seo.banner_image_alt_text ?? undefined }]
          : undefined,
      type: 'website',
    },
  }
}

export default async function SubCategorySlugPage({ params, searchParams }: PageProps) {
  const { categorySlug, subCategorySlug } = await params
  const { parent, page: pageParam, sort: sortParam, show: showParam, brands: brandsParam, min: minParam, max: maxParam, rf: rfParam, ff: ffParam } = await searchParams
  const currentPage = Math.max(1, Number(pageParam ?? 1))
  const length      = [20, 50, 100].includes(Number(showParam)) ? Number(showParam) : 20
  const { sort_by, sort_dir } = SORT_MAP[sortParam ?? ""] ?? { sort_by: "price", sort_dir: "asc" }

  // Parse brand IDs from URL: "64:BrandName,65:BrandName2"
  const brandIds = brandsParam
    ? brandsParam.split(",").map((b) => {
        const ci = b.indexOf(":");
        return ci >= 0 ? Number(b.slice(0, ci)) : Number(b);
      }).filter((id) => !isNaN(id) && id > 0)
    : [];

  // Parse range filters: "attrId-unitId:min_max,min_max|attrId2-unitId2:min_max"
  const applied_range_filters: { attribute_id: number; unit_id?: number; ranges: { min: number; max: number } }[] = [];
  if (rfParam) {
    rfParam.split("|").forEach((part) => {
      const ci = part.indexOf(":");
      if (ci < 0) return;
      const keyParts = part.slice(0, ci).split("-");
      const attrId = Number(keyParts[0]);
      const unit_id = keyParts[1] ? Number(keyParts[1]) : undefined;
      part.slice(ci + 1).split(",").forEach((r) => {
        const [min, max] = r.split("_").map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          const item: { attribute_id: number; unit_id?: number; ranges: { min: number; max: number } } = { attribute_id: attrId, ranges: { min, max } };
          if (unit_id) item.unit_id = unit_id;
          applied_range_filters.push(item);
        }
      });
    });
  }

  // Parse fixed filters: "attrId:val1,val2|attrId2:val3"
  const applied_fixed_filters: { attribute_id: number; value: string }[] = [];
  if (ffParam) {
    ffParam.split("|").forEach((part) => {
      const ci = part.indexOf(":");
      if (ci < 0) return;
      const attrId = Number(part.slice(0, ci));
      part.slice(ci + 1).split(",").forEach((v) => {
        const val = v.replace(/\+/g, " ");
        if (val) applied_fixed_filters.push({ attribute_id: attrId, value: val });
      });
    });
  }

  // console.log("[RAW PARAMS]", { minParam, maxParam, rfParam, ffParam, brandsParam });

  const priceRange: { min_price?: string; max_price?: string } = {};
  if (minParam) priceRange.min_price = minParam;
  if (maxParam) priceRange.max_price = maxParam;
  const priceFilter = Object.keys(priceRange).length ? { priceRange } : {};

  const appliedFilters = {
    ...(brandIds.length ? { brand_ids: brandIds } : {}),
    ...priceFilter,
  };

  const productsBody = {
    category_url: subCategorySlug,
    page: currentPage,
    length,
    sort_by,
    sort_dir,
    applied_filters: appliedFilters,
    applied_range_filters,
    applied_fixed_filters,
    locale: "en",
  };
  console.log("[PRODUCTS API PAYLOAD]", JSON.stringify(productsBody, null, 2));

  const [navigationRes, subCategoryPageRes, productsRes] = await Promise.all([
    makeApiCallSSR<{ success: boolean; data: ApiCategory[] }>(
      apiUrls.NavigationAPI,
      { slug: categorySlug, with_parent: false },
      { revalidate: 3600 },
    ),
    makeApiCallSSR<InnerCategoryPageResponse>(
      apiUrls.INNER_CATEGORY_PAGES_WITH_FILTER,
      {},
      {
        revalidate: 3600,
        method: "POST",
        body: buildFilterBody(subCategorySlug),
      },
    ),
    makeApiCallSSR<ProductsListingResponse>(
      apiUrls.PRODUCTS_LISTING,
      {},
      {
        revalidate: 60,
        method: "POST",
        body: productsBody,
      },
    ),
  ])

  const subCategories = navigationRes?.data ?? []
  const subCategoryPage = subCategoryPageRes ?? null

  console.log("API Payload:", productsBody)
  console.log("Products API Response:", productsRes)

  return (
    <div>
      <SubCategoryPage
        subCategories={subCategories}
        categorySlug={categorySlug}
        subCategorySlug={subCategorySlug}
        parentSlug={parent}
        subCategoryPage={subCategoryPage}
        productsData={productsRes}
        currentPage={currentPage}
        productsBody={productsBody}
      />
    </div>
  )
}
