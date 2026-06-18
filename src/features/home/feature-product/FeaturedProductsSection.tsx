import { apiUrls } from "@/apis/api-endpoint";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import type { FeaturedCategoryTab } from "@/utils/types";
import FeaturedProducts from ".";

export async function FeaturedProductsSection() {
  const res = await makeApiCallSSR<{ data: FeaturedCategoryTab[] }>(
    apiUrls.FEATURED_PRODUCTS,
    {},
    { revalidate: 0 },
  );
  return <FeaturedProducts tabs={res?.data ?? []} />;
}
