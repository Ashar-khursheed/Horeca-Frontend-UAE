import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoriesPage from "@/features/category";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiCategory, ApiCategoryPage } from "@/utils/types";
import type { ApiBrand } from "@/components/brands-section";
import { cookies } from "next/headers";
import { revalidate } from "@/utils";
import { SITE_URL } from "@/utils/site-url";
import ProductJsonLd from "@/features/product-detail/json-ld-schema";


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

  const seo = res?.data?.seo;

  if (!seo) return { title: categorySlug };

  return {
    title: seo.meta_title?.en ?? seo.title_tag?.en ?? categorySlug,
    description: seo.meta_description?.en ?? undefined,
    robots: { index: seo.indexing ?? true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/${categorySlug}`,
    },
    openGraph: {
      title: seo.og_title?.en ?? seo.meta_title?.en ?? undefined,
      description: seo.og_description?.en ?? seo.meta_description?.en ?? undefined,
      url: `${SITE_URL}/${categorySlug}`,
      images:
        seo.og_image_url?.en && seo.og_image_url.en !== "null"
          ? [{ url: seo.og_image_url.en, alt: seo.banner_image_alt_text?.en ?? undefined }]
          : seo.banner_image_url?.en
            ? [{ url: seo.banner_image_url.en, alt: seo.banner_image_alt_text?.en ?? undefined }]
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
      { revalidate: revalidate },
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

  // console.log("API",{
  //   "categoryPage":categoryPage
  // })
  const schemaObj = categoryPage?.seo?.seo_schema?.en;
  const schema: string | null | undefined = typeof schemaObj === "string"
    ? schemaObj
    : schemaObj
    ? JSON.stringify(schemaObj)
    : undefined;
    

  if (!categoryPageRes?.success && categories.length === 0) notFound();

  return (
    <div>
      <ProductJsonLd schema={schema} />
      <CategoriesPage
        categories={categories}
        categorySlug={categorySlug}
        categoryPage={categoryPage}
        brands={brands}
      />
    </div>
  );
}
