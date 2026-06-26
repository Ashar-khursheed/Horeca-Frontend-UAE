import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import { BlogsCard } from "@/components/blog-card";
import { revalidate } from "@/utils";

export async function BlogsSection() {
  const res = await makeApiCallSSR<{ data: any[] }>(
    apiUrls.BLOGS,
    { per_page: 10, lang: "en", page: 1 },
    { revalidate: revalidate },
  );
  return <BlogsCard showAll={false} blogs={res?.data ?? []} />;
}
