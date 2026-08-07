import type { SearchProduct, SearchSuggestions } from "@/utils/types";

// ── Raw shape returned by the NLP search microservice (nlpus.thehorecastore.co) ──
export interface NlpSearchProduct {
  id: number;
  name: string;
  url: string;
  images: string[];
  original_price: number;
  sale_price: number | null;
  sku: string;
  free_shipping: number;
  in_wishlist: boolean;
  isRequired: boolean;
  vendor_id: number;
  selling_unit: string;
  delivery_days: string;
  return_policy: string;
  parent_category_slug: string;
  grandparent_category_slug: string;
  quote_available: number | null;
  is_fixed: number;
  min_quantity: number;
  is_accessory_required?: boolean;
  product_accessories?: {
    id: number;
    is_required: number;
    name: { en?: string; ar?: string } | string;
    accessory_types?: { id: number; name: { en?: string; ar?: string } | string; price: number }[];
  }[];
}

export interface NlpSearchCategory {
  id: number;
  name: string;
  slug: string;
  url: string | null;
  image: string | null;
  parent_id: number;
  parent_slug: string;
  grandparent_slug: string;
}

export interface NlpSearchBrand {
  id: number;
  name: string;
  slug: string;
  url: string | null;
  image: string | null;
}

export interface NlpSearchResponse {
  success: boolean;
  data: {
    original_query: string;
    corrected_query: string;
    did_you_mean: string | null;
    products: NlpSearchProduct[];
    total_records: number;
    total_pages: number;
    current_page: number;
    length: number;
    categories: NlpSearchCategory[];
    brands: NlpSearchBrand[];
    filters: {
      priceRange: { min_price: number; max_price: number; currency: { symbol: string } };
      brands: { id: number; name: string; thumbnail: string | null }[];
      ratings: number[];
    };
  };
}

// ── Adapt the flat NLP response into the nested shape the rest of the app expects ──
export function toSearchSuggestions(raw: NlpSearchResponse): SearchSuggestions {
  const currencySymbol = raw.data.filters?.priceRange?.currency?.symbol ?? "AED";

  const products: SearchProduct[] = (raw.data.products ?? []).map((p) => ({
    id: p.id,
    sku: p.sku,
    name: { en: p.name, ar: p.name },
    images: { en: p.images ?? [], ar: p.images ?? [] },
    url: p.url,
    category_url_resolved: `${p.grandparent_category_slug}/${p.parent_category_slug}`,
    parent_category_url_resolved: `${p.grandparent_category_slug}/${p.parent_category_slug}`,
    price: p.original_price ?? 0,
    sale_price: p.sale_price ?? 0,
    currency: { symbol: currencySymbol, title: "" },
    quote_available: p.quote_available == null ? null : !!p.quote_available,
    isRequired: p.isRequired,
    in_wishlist: p.in_wishlist,
    accessories: (p.product_accessories ?? []).map((acc) => ({
      id: acc.id,
      name: acc.name,
      is_required: acc.is_required,
      accessory_item: (acc.accessory_types ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
    })),
    selling_type: {
      attribute_value: { en: "", ar: "" },
      attribute_value_unit: { en: p.selling_unit ?? "", ar: p.selling_unit ?? "" },
    },
    suppliers: [
      {
        vendor_id: p.vendor_id,
        price: p.original_price,
        sale_price: p.sale_price ?? undefined,
        delivery_days: p.delivery_days,
        return_policy: p.return_policy,
        free_shipping: !!p.free_shipping,
        min_quantity: p.min_quantity,
        is_fixed: !!p.is_fixed,
      },
    ],
  }));

  return {
    success: raw.success,
    data: {
      original_query: raw.data.original_query,
      corrected_query: raw.data.corrected_query,
      did_you_mean: raw.data.did_you_mean,
      products,
      // NB: category.slug/url from the NLP service aren't reliable route slugs —
      // grandparent_slug/parent_slug mirror the product's own category fields above
      // and match real /[categorySlug]/[subCategorySlug] routes.
      categories: (raw.data.categories ?? []).map((c) => ({
        id: c.id,
        name: { en: c.name, ar: c.name },
        image: c.image,
        url: c.parent_slug ?? "",
        super_parent_url: c.grandparent_slug ?? "",
        super_parent: { id: 0, name: { en: "", ar: "" }, url: c.grandparent_slug ?? "" },
      })),
      brands: (raw.data.brands ?? []).map((b) => ({
        id: b.id,
        name: { en: b.name, ar: b.name },
        image: b.image,
        slug: b.slug,
        url: b.url,
      })),
      total_records: raw.data.total_records,
      total_pages: raw.data.total_pages,
      current_page: raw.data.current_page,
      length: raw.data.length,
      filters: {
        priceRange: {
          min_price: raw.data.filters?.priceRange?.min_price ?? 0,
          max_price: raw.data.filters?.priceRange?.max_price ?? 0,
          currency: { symbol: currencySymbol, title: "" },
        },
        brands: (raw.data.filters?.brands ?? []).map((b) => ({
          id: b.id,
          name: { en: b.name, ar: b.name },
          thumbnail: b.thumbnail,
        })),
        ratings: raw.data.filters?.ratings ?? [],
      },
    },
  };
}
