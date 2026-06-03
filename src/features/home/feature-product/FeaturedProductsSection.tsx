import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { FeaturedCategory } from "@/utils/types";
import FeaturedProductsClient from "./FeaturedProductsClient";

export async function FeaturedProductsSection() {
  const res = await makeApiCallSSR<{ data: FeaturedCategory[] }>(
    apiUrls.FEATURED_PRODUCTS,
    {},
    { revalidate: 3600 },
  );
  return <FeaturedProductsClient products={res?.data ?? []} />;
}
