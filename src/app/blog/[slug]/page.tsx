import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiUrls } from "@/apis/api-endpoint";
import BlogDetailClient, { ApiBlogDetail } from "./BlogDetailClient";
import type { Comment as BlogComment } from "@/components/blog-comments";
import { revalidate as fetchRevalidate } from "@/utils";
import { SITE_URL } from "@/utils/site-url";

// Must stay dynamic. Pairing generateStaticParams/ISR with cookies()/headers()
// (or leftover static shells) made Next.js 16 serve HTTP 500 on every slug.
export const dynamic = "force-dynamic";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.horecastore.ae/api"
).replace(/\/?$/, "/");

// This UAE storefront always queries the AE catalogue. Do not read
// headers()/cookies() here — that pair with generateStaticParams makes
// Next.js 16 serve a 500 for every prerendered /blog/[slug] route.
const COUNTRY_CODE = process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? "AE";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface CommentsResponse {
  data: {
    post: { id: number; title: string };
    comments: BlogComment[];
  };
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

function unwrapBlog(payload: unknown): ApiBlogDetail | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if ("title" in obj || "description" in obj || typeof obj.id === "number") {
    return obj as unknown as ApiBlogDetail;
  }
  if (obj.data && typeof obj.data === "object") {
    return unwrapBlog(obj.data);
  }
  return null;
}

function stripInlineBase64Images(raw: string): string {
  return raw.replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi, "");
}

function sanitizeDescription(description: ApiBlogDetail["description"]) {
  if (typeof description === "string") {
    return stripInlineBase64Images(description);
  }
  if (Array.isArray(description)) {
    return description.map((item) =>
      item && typeof item === "object"
        ? {
            ...item,
            value:
              typeof item.value === "string"
                ? stripInlineBase64Images(item.value)
                : item.value,
          }
        : item,
    );
  }
  return description;
}

function jsonLdHtml(schema: unknown): string | null {
  if (!schema) return null;
  try {
    const raw =
      typeof schema === "string" ? schema.trim() : JSON.stringify(schema);
    if (!raw || raw === "null" || raw === "{}") return null;
    return raw.replace(/</g, "\\u003c");
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const blog = unwrapBlog(
    await fetchApi<unknown>(
      apiUrls.BLOG_SINGLE(slug),
      {},
      fetchRevalidate,
    ),
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

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const blog = unwrapBlog(
    await fetchApi<unknown>(
      apiUrls.BLOG_SINGLE(slug),
      {},
      fetchRevalidate,
    ),
  );

  if (!blog) notFound();

  blog.description = sanitizeDescription(blog.description);

  const commentsRes = await fetchApi<CommentsResponse>(
    apiUrls.BLOG_COMMENTS(blog.id),
    {},
    60,
  );

  const initialComments = commentsRes?.data?.comments ?? [];
  const jsonLd = jsonLdHtml(blog.seo?.schema);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <BlogDetailClient blog={blog} initialComments={initialComments} />
    </>
  );
}
