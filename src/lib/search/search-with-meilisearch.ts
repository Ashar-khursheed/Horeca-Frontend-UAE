import { getMeilisearchClient, getIndexUid } from "./meilisearch-client";
import type { ProductSearchRecord } from "./product-record";
import type { IndexSearchResult } from "@/utils/adapt-index-search";

export interface SearchQueryParams {
  query: string;
  page?: number;
  length?: number;
  sort_by?: string;
  sort_dir?: string;
  /** JSON string: { brand_ids?: number[], priceRange?: {...} } */
  applied_filters?: string;
}

function buildFilter(appliedFilters?: string): string | undefined {
  if (!appliedFilters) return undefined;
  try {
    const parsed = JSON.parse(appliedFilters) as {
      brand_ids?: number[];
      priceRange?: { min_price?: number; max_price?: number };
    };
    const parts: string[] = [];
    if (parsed.brand_ids?.length) {
      parts.push(
        `(${parsed.brand_ids.map((id) => `brand_id = ${id}`).join(" OR ")})`,
      );
    }
    const range = parsed.priceRange;
    if (range?.min_price != null) {
      parts.push(`effective_price >= ${range.min_price}`);
    }
    if (range?.max_price != null) {
      parts.push(`effective_price <= ${range.max_price}`);
    }
    return parts.length ? parts.join(" AND ") : undefined;
  } catch {
    return undefined;
  }
}

function buildSort(
  sortBy?: string,
  sortDir?: string,
): string[] | undefined {
  if (sortBy === "price" && sortDir === "asc") return ["effective_price:asc"];
  if (sortBy === "price" && sortDir === "desc") return ["effective_price:desc"];
  return undefined;
}

export async function searchWithMeilisearch(
  params: SearchQueryParams,
): Promise<IndexSearchResult | null> {
  const client = getMeilisearchClient();
  const index = client.index(getIndexUid());
  const page = Math.max(1, params.page ?? 1);
  const hitsPerPage = params.length ?? 20;
  const offset = (page - 1) * hitsPerPage;

  const response = await index.search<ProductSearchRecord>(params.query, {
    limit: hitsPerPage,
    offset,
    filter: buildFilter(params.applied_filters),
    sort: buildSort(params.sort_by, params.sort_dir),
    facets: ["brand_name", "category_slug"],
  });

  const total = response.estimatedTotalHits ?? response.hits.length;
  const nbPages = Math.max(1, Math.ceil(total / hitsPerPage));

  return {
    hits: response.hits ?? [],
    nbHits: total,
    page: page - 1,
    nbPages,
    hitsPerPage,
    query: params.query,
    facets: response.facetDistribution as
      | Record<string, Record<string, number>>
      | undefined,
  };
}
