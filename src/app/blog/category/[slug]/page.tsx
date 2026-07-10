import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers, cookies } from "next/headers";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiBlog } from "@/components/blog-card";
import type { BlogCategory } from "@/app/blog/page";
import CategoryPageClient from "./CategoryPageClient";
import { revalidate } from "@/utils";
import { SITE_URL } from "@/utils/site-url";

// export const revalidate = 3600;
export const dynamicParams = true;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://test-us.thehorecastore.co/api";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// ─── Direct fetch helper (no headers()/cookies() at build time) ──────────────
async function fetchApi<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
  revalidateOpt: number | false = 60,
  countryCode?: string,
): Promise<T | null> {
  try {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    qs.set("force_country", countryCode ?? "US");

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

// Reads the request-scoped country cookie/header — only callable where a
// request context exists (generateMetadata / page render), never at build time.
async function getCountryCode(): Promise<string> {
  const [reqHeaders, cookieStore] = await Promise.all([headers(), cookies()]);
  return reqHeaders.get("x-country-code") ?? cookieStore.get("hc_cc")?.value ?? "US";
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
  const categories = await fetchApi<BlogCategory[]>(
    apiUrls.BLOG_CATEGORIES_WITH_BLOGS,
    { lang: "en" },
    false,
  );
  return (categories ?? [])
    .map((cat: BlogCategory) => ({ slug: cat.url?.url ?? "" }))
    .filter((p: { slug: string }) => p.slug);
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const countryCode = await getCountryCode();

  const res = await fetchApi<CategoryBlogsResponse>(
    apiUrls.BLOG_CATEGORY_BLOGS(slug),
    { lang: "en", page: 1, per_page: 1 },
    0,
    countryCode,
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
  const countryCode = await getCountryCode();

  const res = await fetchApi<CategoryBlogsResponse>(
    apiUrls.BLOG_CATEGORY_BLOGS(slug),
    { lang: "en", page, per_page: 20 },
    0,
    countryCode,
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
