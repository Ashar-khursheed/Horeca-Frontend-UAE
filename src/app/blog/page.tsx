import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiBlog } from "@/components/blog-card";
import BlogListClient from "./BlogListClient";

export const revalidate = 60;

export interface BlogCategory {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  url: { id: number; url: string };
  blogs: ApiBlog[];
}

export default async function BlogPage() {
  const categories = await makeApiCallSSR<BlogCategory[]>(
    apiUrls.BLOG_CATEGORIES_WITH_BLOGS,
    { lang: "en" },
    { revalidate: 60 }
  );

  return <BlogListClient categories={categories ?? []} />;
}
