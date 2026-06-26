import type { ApiProductRaw, FeaturedCategory } from "@/utils/types";

const MAX_FEATURED_PRODUCTS = 12;
const MAX_BRAND_PRODUCTS_PER_TAB = 10;

export function trimFeaturedProducts(
  products: ApiProductRaw[],
): ApiProductRaw[] {
  return products.slice(0, MAX_FEATURED_PRODUCTS);
}

export function trimFeaturedBrands(
  categories: FeaturedCategory[],
): FeaturedCategory[] {
  return categories.map((category) => ({
    ...category,
    products: (category.products ?? []).slice(0, MAX_BRAND_PRODUCTS_PER_TAB),
  }));
}
