import { apiUrls } from "@/apis/api-endpoint";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import type { FeaturedCategory } from "@/utils/types";
import FeaturedProducts from ".";

export async function FeaturedProductsSection() {
  const res = await makeApiCallSSR<{ data: FeaturedCategory[] }>(
    apiUrls.FEATURED_PRODUCTS,
    { products_limit: 12, limit: 5, min_products: 12 },
    { revalidate: 0 },
  );
  return <FeaturedProducts categories={res?.data ?? []} />;
}
