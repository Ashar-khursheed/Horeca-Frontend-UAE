import type { SearchProduct, SearchSuggestions } from "@/utils/types";
import type { ProductSearchRecord } from "@/lib/search/product-record";
import { lookupCategoryMeta } from "@/lib/search/category-image-lookup";

export interface IndexSearchResult {
  hits: ProductSearchRecord[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  query: string;
  facets?: Record<string, Record<string, number>>;
}

function hitToSearchProduct(hit: ProductSearchRecord): SearchProduct {
  const parentPath = hit.parent_category_slug || hit.category_slug;
  return {
    id: hit.product_id,
    sku: hit.sku,
    name: { en: hit.name, ar: hit.name },
    images: {
      en: hit.images.length ? hit.images : hit.image ? [hit.image] : [],
      ar: [],
    },
    url: hit.slug,
    category_url_resolved: parentPath,
    parent_category_url_resolved: parentPath,
    price: hit.price,
    sale_price: hit.sale_price,
    currency: { symbol: hit.currency_symbol, title: "" },
    quote_available: hit.quote_only,
    avg_rating: hit.avg_rating,
    total_reviews: hit.reviews_count,
    in_wishlist: false,
    suppliers: [
      {
        price: hit.price,
        sale_price: hit.sale_price || undefined,
        delivery_days: hit.delivery_days,
        free_shipping: hit.free_shipping,
      },
    ],
  };
}

export function toSearchSuggestionsFromIndex(
  result: IndexSearchResult,
  originalQuery: string,
): SearchSuggestions {
  const products = result.hits.map(hitToSearchProduct);

  const brandFacets = result.facets?.brand_name ?? {};
  const categoryFacets = result.facets?.category_slug ?? {};

  const brands = Object.entries(brandFacets)
    .slice(0, 6)
    .map(([name], i) => {
      const sample = result.hits.find((h) => h.brand_name === name);
      const slug =
        sample?.brand_slug || name.toLowerCase().replace(/\s+/g, "-");
      return {
        id: sample?.brand_id ?? i + 1,
        name: { en: name, ar: name },
        image: null,
        slug,
        url: `/brands/${slug}`,
      };
    });

  const categories = Object.entries(categoryFacets)
    .slice(0, 6)
    .map(([slug], i) => {
      const sample = result.hits.find((h) => {
        const parent = h.parent_category_slug ?? "";
        return (
          h.category_slug === slug ||
          parent === slug ||
          parent.endsWith(`/${slug}`)
        );
      });
      const parentPath = sample?.parent_category_slug ?? slug;
      const [grandparent, child] = parentPath.includes("/")
        ? parentPath.split("/")
        : [parentPath, slug];
      const meta = lookupCategoryMeta(slug) ?? lookupCategoryMeta(child ?? "");
      const label = meta?.name ?? slug.replace(/-/g, " ");
      return {
        id: i + 1,
        name: { en: label, ar: label },
        image:
          meta?.image || sample?.image || sample?.images?.[0] || null,
        url: child ?? slug,
        super_parent_url: grandparent ?? slug,
        super_parent: {
          id: 0,
          name: { en: "", ar: "" },
          url: grandparent ?? slug,
        },
      };
    });

  const prices = result.hits.map((h) => h.effective_price).filter((p) => p > 0);

  return {
    success: true,
    data: {
      original_query: originalQuery,
      corrected_query: result.query || originalQuery,
      did_you_mean: null,
      products,
      categories,
      brands,
      total_records: result.nbHits,
      total_pages: result.nbPages,
      current_page: result.page + 1,
      length: result.hitsPerPage,
      filters: {
        priceRange: {
          min_price: prices.length ? Math.min(...prices) : 0,
          max_price: prices.length ? Math.max(...prices) : 0,
          currency: {
            symbol: result.hits[0]?.currency_symbol ?? "$",
            title: "",
          },
        },
        brands: brands.map((b) => ({
          id: b.id,
          name: b.name,
          thumbnail: null,
        })),
        ratings: [],
      },
    },
  };
}
