import type { Metadata } from "next";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiBlog } from "@/components/blog-card";
import BlogListClient from "./BlogListClient";
import ProductJsonLd from "@/features/product-detail/json-ld-schema";
import { BLOG_SEO, BLOG_SCHEMA } from "@/data/seo/blog-seo";

export const revalidate = 60;

export interface BlogCategory {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  url: { id: number; url: string };
  blogs: ApiBlog[];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: BLOG_SEO.title,
    description: BLOG_SEO.meta_description,
    robots: { index: BLOG_SEO.indexing, follow: true },
    alternates: { canonical: BLOG_SEO.canonical_url },
    openGraph: {
      title: BLOG_SEO.og_title,
      description: BLOG_SEO.og_description,
      url: BLOG_SEO.canonical_url,
      type: "website",
    },
  };
}

export default async function BlogPage() {
  const categories = await makeApiCallSSR<BlogCategory[]>(
    apiUrls.BLOG_CATEGORIES_WITH_BLOGS,
    { lang: "en" },
    { revalidate: 60 }
  );

  return (
    <>
      <ProductJsonLd schema={BLOG_SCHEMA} />
      <BlogListClient categories={categories ?? []} />
    </>
  );
}
