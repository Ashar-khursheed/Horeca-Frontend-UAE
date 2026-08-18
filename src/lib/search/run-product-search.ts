import type { SearchSuggestions } from "@/utils/types";
import {
  toSearchSuggestions,
  type NlpSearchResponse,
} from "@/utils/adapt-nlp-search";
import { toSearchSuggestionsFromIndex } from "@/utils/adapt-index-search";
import { attachBrandLogos } from "./brand-logo-lookup";
import { shouldUseMeilisearch } from "./config";
import {
  searchWithMeilisearch,
  type SearchQueryParams,
} from "./search-with-meilisearch";

const NLP_SEARCH_API = "https://nlpus.thehorecastore.co/search";

async function searchWithNlp(
  params: SearchQueryParams,
): Promise<SearchSuggestions | null> {
  const qs = new URLSearchParams();
  qs.set("query", params.query);
  qs.set("page", String(params.page ?? 1));
  qs.set("length", String(params.length ?? 20));
  if (params.sort_by) qs.set("sort_by", params.sort_by);
  if (params.sort_dir) qs.set("sort_dir", params.sort_dir);
  if (params.applied_filters) {
    qs.set("applied_filters", params.applied_filters);
  }

  const res = await fetch(`${NLP_SEARCH_API}?${qs.toString()}`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as NlpSearchResponse;
  return toSearchSuggestions(json);
}

/** Self-hosted Meilisearch when configured; otherwise NLP fallback. */
export async function runProductSearch(
  params: SearchQueryParams,
): Promise<SearchSuggestions | null> {
  const term = params.query.trim();
  if (!term) return null;

  if (shouldUseMeilisearch()) {
    try {
      const indexed = await searchWithMeilisearch(params);
      if (indexed) {
        return attachBrandLogos(toSearchSuggestionsFromIndex(indexed, term));
      }
    } catch (err) {
      console.error("[search] Meilisearch failed, falling back to NLP:", err);
    }
  }

  const nlp = await searchWithNlp(params);
  return nlp ? attachBrandLogos(nlp) : null;
}

export type { SearchQueryParams };
