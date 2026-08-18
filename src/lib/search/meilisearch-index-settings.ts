/** Index tuning — instant search + commercial ranking (featured, popular, affordable). */
export const MEILISEARCH_INDEX_SETTINGS = {
  searchableAttributes: [
    "name",
    "brand_name",
    "sku",
    "category_path",
    "search_keywords",
  ],
  filterableAttributes: [
    "brand_id",
    "brand_name",
    "category_slug",
    "quote_only",
    "in_stock",
    "effective_price",
  ],
  sortableAttributes: ["effective_price", "popularity", "reviews_count"],
  rankingRules: [
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness",
    "popularity:desc",
    "effective_price:asc",
  ],
  typoTolerance: { enabled: true },
};
