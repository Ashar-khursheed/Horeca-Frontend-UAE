import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiBlog } from "@/components/blog-card";
import CategoryPageClient from "./CategoryPageClient";
import { SITE_URL } from "@/utils/site-url";

export const dynamic = "force-dynamic";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.horecastore.ae/api"
).replace(/\/?$/, "/");

// UAE storefront — never read headers()/cookies() on this prerendered route.
const COUNTRY_CODE = process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? "AE";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function fetchApi<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
  revalidateOpt: number | false = 60,
): Promise<T | null> {
  try {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    qs.set("force_country", COUNTRY_CODE);

    const base = path.startsWith("http") ? path : `${API_BASE}${path}`;
    const url = qs.toString() ? `${base}?${qs}` : base;

    const res = await fetch(url, {
      next: { revalidate: revalidateOpt },
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error(err);
    return null;
  }
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const res = await fetchApi<CategoryBlogsResponse>(
    apiUrls.BLOG_CATEGORY_BLOGS(slug),
    { lang: "en", page: 1, per_page: 1 },
    3600,
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

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const res = await fetchApi<CategoryBlogsResponse>(
    apiUrls.BLOG_CATEGORY_BLOGS(slug),
    { lang: "en", page, per_page: 20 },
    3600,
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
