import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { FeaturedCategory } from "@/utils/types";
import FeaturedProducts from ".";

export async function FeaturedProductsSection() {
  const res = await makeApiCallSSR<{ data: FeaturedCategory[] }>(
    apiUrls.FEATURED_PRODUCTS,
    {},
    { revalidate: 3600 },
  );
  return <FeaturedProducts products={res?.data ?? []} />;
}
