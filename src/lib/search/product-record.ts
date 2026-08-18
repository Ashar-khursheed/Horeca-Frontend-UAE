/** Flat record in our self-hosted search index (Meilisearch). */
export interface ProductSearchRecord {
  id: string;
  product_id: number;
  name: string;
  sku: string;
  url: string;
  slug: string;
  category_path: string;
  category_slug: string;
  parent_category_slug: string;
  brand_id: number | null;
  brand_name: string;
  brand_slug: string;
  image: string;
  images: string[];
  price: number;
  sale_price: number;
  effective_price: number;
  currency_symbol: string;
  quote_only: boolean;
  in_stock: boolean;
  is_featured: boolean;
  reviews_count: number;
  avg_rating: number | null;
  delivery_days: string;
  free_shipping: boolean;
  /** Higher = show earlier (featured, reviews, in-stock). */
  popularity: number;
  search_keywords: string;
}

export interface PimListingProduct {
  id: number;
  sku?: string;
  title?: string;
  url?: string;
  best_price?: string | number;
  is_featured?: number | boolean;
  for_quotes?: number | boolean;
  reviews_count?: number;
  avg_rating?: number | null;
  image_urls?: string[];
  currency?: { symbol?: string; title?: string };
  best_supplier?: {
    price?: string | number;
    sale_price?: string | number;
    in_stock?: number | boolean;
    delivery_days?: string;
    free_shipping?: number | boolean;
  };
}

export interface BrandLookup {
  id: number;
  name: string;
  slug: string;
}

function num(v: string | number | null | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Match brand from product title using known brand names (longest match wins). */
export function matchBrandFromTitle(
  title: string,
  brands: BrandLookup[],
): BrandLookup | null {
  const lower = title.toLowerCase();
  let best: BrandLookup | null = null;
  for (const b of brands) {
    const name = b.name.toLowerCase();
    if (!name) continue;
    if (lower.startsWith(name) || lower.includes(` ${name} `)) {
      if (!best || name.length > best.name.length) best = b;
    }
  }
  return best;
}

export function pimProductToSearchRecord(
  p: PimListingProduct,
  brands: BrandLookup[],
): ProductSearchRecord | null {
  if (!p.id || !p.title || !p.url) return null;

  const urlPath = p.url.replace(/^\/+/, "");
  const segments = urlPath.split("/").filter(Boolean);
  const slug = segments[segments.length - 1] ?? urlPath;
  const parentCategory = segments[segments.length - 2] ?? "";
  const grandparent = segments[0] ?? "";

  const brand = matchBrandFromTitle(p.title, brands);
  const supplier = p.best_supplier;
  const price = num(supplier?.price ?? p.best_price);
  const saleRaw = num(supplier?.sale_price);
  const salePrice = saleRaw > 0 && saleRaw < price ? saleRaw : 0;
  const effectivePrice = salePrice > 0 ? salePrice : price;
  const inStock = supplier?.in_stock === 1 || supplier?.in_stock === true;
  const featured = p.is_featured === 1 || p.is_featured === true;
  const quoteOnly = p.for_quotes === 1 || p.for_quotes === true;
  const reviews = p.reviews_count ?? 0;
  const images = p.image_urls ?? [];

  const popularity =
    (featured ? 1000 : 0) +
    reviews * 10 +
    (inStock ? 50 : 0) +
    (quoteOnly ? -200 : 0);

  return {
    id: String(p.id),
    product_id: p.id,
    name: p.title,
    sku: p.sku ?? "",
    url: `/${urlPath}`,
    slug,
    category_path: segments.slice(0, -1).join(" / ").replace(/-/g, " "),
    category_slug: parentCategory,
    parent_category_slug: `${grandparent}/${parentCategory}`.replace(/^\/+/, ""),
    brand_id: brand?.id ?? null,
    brand_name: brand?.name ?? "",
    brand_slug: brand?.slug ?? "",
    image: images[0] ?? "",
    images,
    price,
    sale_price: salePrice,
    effective_price: effectivePrice,
    currency_symbol: p.currency?.symbol ?? "$",
    quote_only: quoteOnly,
    in_stock: inStock,
    is_featured: featured,
    reviews_count: reviews,
    avg_rating: p.avg_rating ?? null,
    delivery_days: supplier?.delivery_days ?? "",
    free_shipping: supplier?.free_shipping === 1 || supplier?.free_shipping === true,
    popularity,
    search_keywords: [p.title, p.sku, brand?.name, parentCategory, grandparent]
      .filter(Boolean)
      .join(" "),
  };
}
