import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiBlog } from "@/components/blog-card";
import type { BlogCategory } from "@/app/blog/page";
import CategoryPageClient from "./CategoryPageClient";
import { revalidate } from "@/utils";
import { SITE_URL } from "@/utils/site-url";

// export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export interface CategoryInfo {
  id: number;
  name: string;
  description: string | null;
  url: { id: number; url: string };
}

interface CategoryBlogsResponse {
  category: CategoryInfo;
  blogs: {
    current_page: number;
    last_page: number;
    data: ApiBlog[];
  };
}

// ─── SSG ──────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const categories = await makeApiCallSSR<BlogCategory[]>(
    apiUrls.BLOG_CATEGORIES_WITH_BLOGS,
    { lang: "en" },
    { revalidate: false }
  );
  return (categories ?? [])
    .map((cat) => ({ slug: cat.url?.url ?? "" }))
    .filter((p) => p.slug);
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const res = await makeApiCallSSR<CategoryBlogsResponse>(
    apiUrls.BLOG_CATEGORY_BLOGS(slug),
    { lang: "en", page: 1, per_page: 1 },
    { revalidate: revalidate }
  );

  const category = res?.category;
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Blogs | HorecaStore`,
    description:
      category.description ||
      `Browse all ${category.name} articles and tips on HorecaStore.`,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/blog/category/${slug}`,
    },
    openGraph: {
      title: `${category.name} Blogs | HorecaStore`,
      description: category.description || `Browse all ${category.name} articles on HorecaStore.`,
      url: `${SITE_URL}/blog/category/${slug}`,
      type: "website",
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const res = await makeApiCallSSR<CategoryBlogsResponse>(
    apiUrls.BLOG_CATEGORY_BLOGS(slug),
    { lang: "en", page, per_page: 20 },
    { revalidate: revalidate }
  );
  if (!res?.category) notFound();

  return (
    <CategoryPageClient
      category={res.category}
      blogs={res.blogs?.data ?? []}
      totalPages={res.blogs?.last_page ?? 1}
      currentPage={page}
    />
  );
}
