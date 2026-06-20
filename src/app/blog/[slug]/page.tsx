import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import BlogDetailClient, { ApiBlogDetail } from "./BlogDetailClient";
import type { Comment as BlogComment } from "@/components/blog-comments";

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
    { revalidate: false },
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
        { revalidate: false },
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

  const blog = await makeApiCallSSR<ApiBlogDetail>(
    apiUrls.BLOG_SINGLE(slug),
    {},
    { revalidate: 3600 },
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
      canonical: `${process.env.NEXT_SITE_URL}${canonical}`,
    },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: `${process.env.NEXT_SITE_URL}${canonical}`,
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
    makeApiCallSSR<ApiBlogDetail>(
      apiUrls.BLOG_SINGLE(slug),
      {},
      { revalidate: 0 },
    ),
    makeApiCallSSR<CommentsResponse>(
      apiUrls.BLOG_COMMENTS(slug),
      {},
      { revalidate: 60 },
    ),
  ]);

  const initialComments = commentsRes?.data?.comments ?? [];

  console.log("blogblogblog",blog)

  if (!blog) notFound();

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
