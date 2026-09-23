import type { RawApiProduct } from "@/components/product-card";

export type LocalizedName = { en?: string; ar?: string } | string;

export interface SaleLandingProduct {
  id: number;
  sku?: string;
  url: string;
  title?: LocalizedName;
  name?: LocalizedName;
  image_urls?: string[] | { en?: string[]; ar?: string[] };
  images?: string[] | { en?: string[]; ar?: string[] };
  reviews_count?: number;
  avg_rating?: number | null;
  for_quotes?: number | boolean;
  currency?: { symbol?: string; title?: string };
  selling_type?: unknown;
  is_accessory_required?: boolean;
  product_accessories?: unknown[];
  best_supplier?: {
    price?: number | string;
    sale_price?: number | string;
    min_quantity?: number;
    is_fixed?: number | boolean;
    delivery_days?: string;
    free_shipping?: boolean | number;
    return_policy?: string;
    vendor_id?: number;
  };
  discount_percentage?: string | number;
}

export interface SaleLandingFilters {
  categories?: {
    id: number;
    name: LocalizedName;
    slug?: string;
  }[];
  brands?: {
    id: number;
    name: LocalizedName;
    slug?: string;
    logo_url?: string | null;
  }[];
  price_range?: {
    min?: number | string;
    max?: number | string;
    symbol?: string;
  };
}

export interface SaleLandingPagination {
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
}

export interface SaleLandingSeo {
  url?: string | null;
  primary_keyword?: string | null;
  indexing?: number | boolean | null;
  schema_rating?: number | null;
  schema_reviews_count?: number | null;
  banner_slug?: string | null;
}

export interface SaleLandingData {
  id: number;
  title: string;
  desktop_banner?: string | null;
  desktop_banner_alt?: string | null;
  mobile_banner?: string | null;
  mobile_banner_alt?: string | null;
  description?: string | null;
  status?: string;
  seo_url?: string | null;
  seo_management?: SaleLandingSeo | null;
  products?: SaleLandingProduct[];
  filters?: SaleLandingFilters;
  pagination?: SaleLandingPagination;
}

export interface SaleLandingResponse {
  success: boolean;
  message?: string;
  data?: SaleLandingData;
}

export type SaleLandingQuery = {
  category_id?: string | number | null;
  brand_id?: string | null;
  price_min?: string | number | null;
  price_max?: string | number | null;
  discount_min?: string | number | null;
  discount_max?: string | number | null;
  search?: string | null;
  sort_by?: string | null;
  sort_order?: string | null;
  page?: string | number | null;
  per_page?: string | number | null;
};

export function normalizeSaleSlug(slug: string) {
  return slug.replace(/^\/?sale\//, "").replace(/^\//, "");
}

export function saleLandingPath(slug: string) {
  return `frontend/landing-pages/sale/${encodeURIComponent(slug)}`;
}

export function titleFromSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function isUsableBanner(url?: string | null) {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.pathname.length > 1;
  } catch {
    return false;
  }
}

function toNum(v: number | string | undefined | null): number {
  if (v == null) return 0;
  return typeof v === "string" ? parseFloat(v) || 0 : v;
}

export function mapLandingProduct(p: SaleLandingProduct): RawApiProduct {
  const supplier = p.best_supplier;
  const original = toNum(supplier?.price);
  const sale = toNum(supplier?.sale_price);
  return {
    id: p.id,
    sku: p.sku,
    url: p.url,
    name: p.name ?? p.title,
    images: p.images ?? p.image_urls,
    original_price: original,
    price: original,
    sale_price: sale,
    avg_rating: p.avg_rating ?? null,
    total_reviews: p.reviews_count,
    min_quantity: supplier?.min_quantity,
    is_fixed: supplier?.is_fixed,
    quote_available: p.for_quotes,
    delivery_days: supplier?.delivery_days,
    free_shipping: supplier?.free_shipping ? 1 : 0,
    currency: p.currency,
    best_supplier: supplier,
  } as RawApiProduct;
}

export function buildSaleLandingParams(query: SaleLandingQuery) {
  const params: Record<string, string | number> = {
    page: Number(query.page) || 1,
    per_page: Number(query.per_page) || 20,
  };

  if (query.category_id) params.category_id = query.category_id;
  if (query.brand_id) params.brand_id = query.brand_id;
  if (query.price_min != null && query.price_min !== "") {
    params.price_min = query.price_min;
  }
  if (query.price_max != null && query.price_max !== "") {
    params.price_max = query.price_max;
  }
  if (query.discount_min != null && query.discount_min !== "") {
    params.discount_min = query.discount_min;
  }
  if (query.discount_max != null && query.discount_max !== "") {
    params.discount_max = query.discount_max;
  }
  if (query.search?.trim()) params.search = query.search.trim();

  if (query.sort_by === "discount_desc") {
    params.sort_by = "discount";
    params.sort_order = "desc";
  } else if (query.sort_by) {
    params.sort_by = query.sort_by;
    if (query.sort_order) params.sort_order = query.sort_order;
  }

  return params;
}

export function parseBrandIds(value?: string | null) {
  if (!value) return [] as number[];
  return value
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isFinite(id) && id > 0);
}
