import type { SearchSuggestions } from "@/utils/types";
import {
  searchLocalIndex,
  type LocalSuggestIndex,
} from "./local-suggest";

const INDEX_URL = "/search-suggest.json";

let cached: LocalSuggestIndex | null = null;
let inflight: Promise<LocalSuggestIndex | null> | null = null;

export function prefetchSuggestIndex() {
  void loadSuggestIndex();
}

export async function loadSuggestIndex(): Promise<LocalSuggestIndex | null> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch(INDEX_URL, { cache: "force-cache" });
      if (!res.ok) return null;
      const json = (await res.json()) as LocalSuggestIndex;
      if (!Array.isArray(json.products) || json.products.length < 50) return null;
      cached = json;
      return json;
    } catch {
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export async function searchClientSuggest(
  query: string,
  length = 8,
): Promise<SearchSuggestions | null> {
  const index = await loadSuggestIndex();
  if (!index) return null;
  return searchLocalIndex(index, query, { page: 1, length });
}
