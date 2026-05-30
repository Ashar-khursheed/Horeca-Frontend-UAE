import type { Metadata } from "next";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import BlogDetailClient, { ApiBlogDetail } from "./BlogDetailClient";
import type { Comment as BlogComment } from "@/components/blog-comments";
import Link from "next/link";

// ISR — revalidate every hour
export const revalidate = 3600;

// New slugs not in generateStaticParams are SSR'd on-demand, then cached
export const dynamicParams = true;

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

// ─── SSG: pre-build all blog slugs ────────────────────────────────────────────
export async function generateStaticParams() {
  const first = await makeApiCallSSR<BlogListResponse>(
    apiUrls.BLOGS,
    { per_page: 100, lang: "en", page: 1 },
    { revalidate: false }
  );

  if (!first) return [];

  const { last_page } = first;

  // Fetch remaining pages in parallel if more than 1
  const pageNums = Array.from({ length: last_page - 1 }, (_, i) => i + 2);
  const rest = await Promise.all(
    pageNums.map((page) =>
      makeApiCallSSR<BlogListResponse>(
        apiUrls.BLOGS,
        { per_page: 100, lang: "en", page },
        { revalidate: false }
      )
    )
  );

  const allBlogs = [first, ...rest].flatMap((res) => res?.data ?? []);

  return allBlogs
    .map((blog) => ({
      slug: blog.url?.replace(/^\//, "") ?? "",
    }))
    .filter((p) => p.slug);
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const blog = await makeApiCallSSR<ApiBlogDetail>(
    apiUrls.BLOG_SINGLE(slug),
    {},
    { revalidate: 3600 }
  );

  if (!blog) return { title: "Blog Not Found" };

  const seo = blog.seo;
  const title = seo?.title_tag || seo?.meta_title || blog.title;
  const description = seo?.meta_description || blog.title;
  const ogImage = seo?.og_image_url || blog.thumbnail || blog.desktop_banner;
  const canonical = seo?.url || blog.url;

  return {
    title,
    description,
    keywords: seo?.primary_keyword ?? undefined,
    robots: seo?.indexing === false ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical: `https://www.horecastore.ae${canonical}`,
    },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: `https://www.horecastore.ae${canonical}`,
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

  const [blog, commentsRes] = await Promise.all([
    makeApiCallSSR<ApiBlogDetail>(apiUrls.BLOG_SINGLE(slug), {}, { revalidate: 3600 }),
    makeApiCallSSR<CommentsResponse>(apiUrls.BLOG_COMMENTS(slug), {}, { revalidate: 60 }),
  ]);

  const initialComments = commentsRes?.data?.comments ?? [];

  if (!blog) {
    return (
      <div className="global-container py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog not found</h1>
        <p className="text-gray-500 mb-6">
          No article found for <strong>{slug}</strong>.
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
    <>
      {blog.seo?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: blog.seo.schema }}
        />
      )}
      <BlogDetailClient blog={blog} initialComments={initialComments} />
    </>
  );
}
