import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { FeaturedCategory } from "@/utils/types";
import FeaturedBrands from ".";

export async function FeaturedBrandsSection() {
  const res = await makeApiCallSSR<{ data: FeaturedCategory[] }>(
    apiUrls.FEATURED_BRAND_PRODUCTS,
    {},
    { revalidate: 3600 },
  );
  return <FeaturedBrands products={res?.data ?? []} />;
}
