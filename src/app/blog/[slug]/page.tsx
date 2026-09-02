import { apiUrls } from "@/apis/api-endpoint";
import type { Comment as BlogComment } from "@/components/blog-comments";
import { revalidate as fetchRevalidate } from "@/utils";
import { SITE_URL } from "@/utils/site-url";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import BlogDetailClient, { ApiBlogDetail } from "./BlogDetailClient";

// ISR — revalidate every hour
export const revalidate = 3600;

// New slugs not in generateStaticParams are SSR'd on-demand, then cached
export const dynamicParams = true;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://test-us.thehorecastore.co/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface BlogListResponse {
  data: { url: string }[];
  last_page: number;
}

interface CommentsResponse {
  data: {
    post: { id: number; title: string };
    comments: BlogComment[];
  };
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

// Some CMS entries have images pasted directly into the editor as inline
// base64 data URIs instead of uploaded URLs, ballooning a single blog's
// `description` to tens of MBs. That blows past the hosting platform's
// response-size limit (raw HTTP 413) before React ever gets to render it,
// so it has to be stripped server-side, before the payload is sent to the client.
function stripInlineBase64Images(raw: string): string {
  return raw.replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi, "");
}

// ─── SSG: pre-build all blog slugs ────────────────────────────────────────────
export async function generateStaticParams() {
  const first = await fetchApi<BlogListResponse>(
    apiUrls.BLOGS,
    { per_page: 100, lang: "en", page: 1 },
    false,
  );

  if (!first) return [];

  const { last_page } = first;

  // Fetch remaining pages in parallel if more than 1
  const pageNums = Array.from({ length: last_page - 1 }, (_, i) => i + 2);
  const rest = await Promise.all(
    pageNums.map((page) =>
      fetchApi<BlogListResponse>(
        apiUrls.BLOGS,
        { per_page: 100, lang: "en", page },
        false,
      ),
    ),
  );

  const allBlogs = [first, ...rest].flatMap((res) => res?.data ?? []);

  return allBlogs
    .map((blog) => ({
      slug: blog.url?.replace(/^\//, "") ?? "",
    }))
    .filter((p) => p.slug);
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const countryCode = await getCountryCode();

  const blog = await fetchApi<ApiBlogDetail>(
    apiUrls.BLOG_SINGLE(slug),
    {},
    fetchRevalidate,
    countryCode,
  );

  if (!blog) return { title: "Blog Not Found" };

  const seo = blog.seo;
  const title = seo?.title_tag || seo?.meta_title || blog.title;
  const description = seo?.meta_description || blog.title;
  const ogImage = seo?.og_image_url || blog.thumbnail || blog.desktop_banner;
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  return {
    title,
    description,
    keywords: seo?.primary_keyword ?? undefined,
    robots: seo?.indexing === false ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: canonicalUrl,
      type: "article",
      images: ogImage ? [{ url: ogImage, alt: blog.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const countryCode = await getCountryCode();

  const blog = await fetchApi<ApiBlogDetail>(
    apiUrls.BLOG_SINGLE(slug),
    {},
    fetchRevalidate,
    countryCode,
  );

  if (!blog) notFound();

  if (typeof blog.description === "string") {
    blog.description = stripInlineBase64Images(blog.description);
  }

  const commentsRes = await fetchApi<CommentsResponse>(
    apiUrls.BLOG_COMMENTS(blog.id),
    {},
    60,
    countryCode,
  );

  const initialComments = commentsRes?.data?.comments ?? undefined;


  console.log("BlogDetailPage: blog", blog);

  return (
    <>
      {blog.seo?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              typeof blog.seo.schema === "string"
                ? blog.seo.schema
                : JSON.stringify(blog.seo.schema),
          }}
        />
      )}
      <BlogDetailClient blog={blog} initialComments={initialComments ?? []} />
    </>
  );
}
