import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { FeaturedCategory } from "@/utils/types";
import FeaturedBrandsClient from "./FeaturedBrandsClient";
import { revalidate } from "@/utils";

export async function FeaturedBrandsSection() {
  const res = await makeApiCallSSR<{ data: FeaturedCategory[] }>(
    apiUrls.FEATURED_BRAND_PRODUCTS,
    {},
    { revalidate: revalidate },
  );
  return <FeaturedBrandsClient products={res?.data ?? []} />;
}
