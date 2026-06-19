import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoriesPage from "@/features/category";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiCategory, ApiCategoryPage } from "@/utils/types";
import type { ApiBrand } from "@/components/brands-section";
import { cookies } from "next/headers";
import { revalidate } from "@/utils";


interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;

  const res = await makeApiCallSSR<{ success: boolean; data: ApiCategoryPage }>(
    apiUrls.MAIN_CATEGPRY_PAGES(categorySlug),
    {},
    { revalidate: revalidate },
  );

  const seo = res?.data?.seo?.current_translation;

  if (!seo) return { title: categorySlug };

  return {
    title: seo.meta_title ?? seo.title_tag ?? categorySlug,
    description: seo.meta_description ?? undefined,
    robots: { index: res?.data?.seo?.indexing ?? true, follow: true },
    alternates: {
      canonical: `https://www.horecastore.ae/${categorySlug}`,
    },
    openGraph: {
      title: seo.og_title ?? seo.meta_title ?? undefined,
      description: seo.og_description ?? seo.meta_description ?? undefined,
      url: `https://www.horecastore.ae/${categorySlug}`,
      images:
        seo.og_image_url && seo.og_image_url !== "null"
          ? [
              {
                url: seo.og_image_url,
                alt: seo.banner_image_alt_text ?? undefined,
              },
            ]
          : seo.banner_image_url
            ? [
                {
                  url: seo.banner_image_url,
                  alt: seo.banner_image_alt_text ?? undefined,
                },
              ]
            : undefined,
      type: "website",
    },
  };
}

export default async function CategorySlugPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const cookieStore = await cookies();
  const isLoggedIn  = !!cookieStore.get("token")?.value;
  const [navigationRes, categoryPageRes, brandsRes] = await Promise.all([
    makeApiCallSSR<{ success: boolean; data: ApiCategory[] }>(
      apiUrls.NavigationAPI,
      { slug: categorySlug, with_parent: false },
      { revalidate: 3600 },
    ),
    makeApiCallSSR<{ success: boolean; data: ApiCategoryPage }>(
      apiUrls.MAIN_CATEGPRY_PAGES(categorySlug),
      {},
      { revalidate: revalidate, withAuth: isLoggedIn },
    ),
    makeApiCallSSR<{ success: boolean; data: ApiBrand[] }>(
      apiUrls.BRANDS,
      { category_id: categorySlug },
      { revalidate: revalidate },
    ),
  ]);

  const categories = navigationRes?.data ?? [];
  const categoryPage = categoryPageRes?.data ?? null;
  const brands = brandsRes?.data ?? null;

  console.log("API",{
    "categoryPage":categoryPage
  })

  if (!categoryPageRes?.success && categories.length === 0) notFound();

  return (
    <div>
      <CategoriesPage
        categories={categories}
        categorySlug={categorySlug}
        categoryPage={categoryPage}
        brands={brands}
      />
    </div>
  );
}
