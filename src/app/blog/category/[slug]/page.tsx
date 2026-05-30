import type { Metadata } from "next";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiBlog } from "@/components/blog-card";
import type { BlogCategory } from "@/app/blog/page";
import Link from "next/link";
import CategoryPageClient from "./CategoryPageClient";

export const revalidate = 3600;
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
    { revalidate: 3600 }
  );

  const category = res?.category;
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Blogs | HorecaStore`,
    description:
      category.description ||
      `Browse all ${category.name} articles and tips on HorecaStore.`,
    alternates: {
      canonical: `https://www.horecastore.ae/blog/category/${slug}`,
    },
    openGraph: {
      title: `${category.name} Blogs | HorecaStore`,
      description: category.description || `Browse all ${category.name} articles on HorecaStore.`,
      url: `https://www.horecastore.ae/blog/category/${slug}`,
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
    { revalidate: 3600 }
  );

  if (!res?.category) {
    return (
      <div className="global-container py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Category not found</h1>
        <p className="text-gray-500 mb-6">
          No category found for <strong>{slug}</strong>.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#186737] text-white rounded-[7px] hover:bg-[#145c2e] transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <CategoryPageClient
      category={res.category}
      blogs={res.blogs?.data ?? []}
      totalPages={res.blogs?.last_page ?? 1}
      currentPage={page}
    />
  );
}
