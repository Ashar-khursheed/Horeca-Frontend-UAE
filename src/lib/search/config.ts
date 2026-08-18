export type SearchProvider = "meilisearch" | "nlp" | "auto";

export function getSearchProvider(): SearchProvider {
  const raw = (process.env.SEARCH_PROVIDER ?? "auto").toLowerCase();
  if (raw === "meilisearch" || raw === "nlp") return raw;
  return "auto";
}

export function isMeilisearchConfigured(): boolean {
  return Boolean(process.env.MEILISEARCH_HOST);
}

export function shouldUseMeilisearch(): boolean {
  const provider = getSearchProvider();
  if (provider === "nlp") return false;
  if (provider === "meilisearch") return isMeilisearchConfigured();
  return isMeilisearchConfigured();
}

export function getSearchIndexName(): string {
  return process.env.MEILISEARCH_INDEX_NAME ?? "horeca_products";
}
