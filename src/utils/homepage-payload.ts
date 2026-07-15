import type { ApiBrandProduct, FeaturedCategory } from "@/utils/types";
import type { RawApiProduct } from "@/components/product-card";

const MAX_BRAND_PRODUCTS_PER_TAB = 12;

export function trimFeaturedBrands(
  categories: FeaturedCategory[],
): FeaturedCategory[] {
  return categories.map((category) => ({
    ...category,
    featured_products: (category.featured_products ?? []).slice(
      0,
      MAX_BRAND_PRODUCTS_PER_TAB,
    ),
  }));
}

// ─── Brand product → ProductCard shape ───────────────────────────────────────
// The brands/featured-products endpoint nests price/delivery under
// `best_supplier` and uses different field names (title, image_urls, …).
// This maps it to the RawApiProduct shape ProductCard already understands.
export function mapBrandProductToCardProduct(
  product: ApiBrandProduct,
): RawApiProduct {
  const supplier = product.best_supplier;
  const sellingType = product.selling_type?.en ?? product.selling_type?.ar;

  return {
    id: product.id,
    name: product.title,
    url: product.url,
    sku: product.sku,
    price: Number(supplier?.price ?? 0),
    sale_price: Number(supplier?.sale_price ?? 0),
    avg_rating: product.avg_rating,
    total_reviews: product.reviews_count,
    delivery_days: supplier?.delivery_days,
    currency: product.currency,
    images: product.image_urls,
    alt_tags: product.image_alt_tags?.en ?? undefined,
    in_wishlist: product.in_wishlist,
    in_cart: product.in_cart,
    min_quantity: supplier?.min_quantity,
    is_fixed: supplier?.is_fixed,
    quote_available: product.for_quotes,
    selling_type: sellingType
      ? {
          attribute_value: sellingType.attribute_value,
          attribute_value_unit: sellingType.attribute_value_unit,
        }
      : undefined,
    suppliers: supplier
      ? [
          {
            vendor_id: supplier.vendor_id,
            delivery_days: supplier.delivery_days,
            free_shipping: supplier.free_shipping,
            min_quantity: supplier.min_quantity,
            is_fixed: supplier.is_fixed,
          },
        ]
      : undefined,
    isRequired: product.is_accessory_required,
    accessories: (product.product_accessories ?? []).map((acc) => ({
      id: acc.id,
      name: acc.name,
      is_required: acc.is_required,
      accessory_item: acc.accessory_types.map((type) => ({
        id: type.id,
        name: type.name,
        price: type.price,
      })),
    })),
  };
}
