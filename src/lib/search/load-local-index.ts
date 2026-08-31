import { readFile } from "fs/promises";
import { join } from "path";
import {
  searchLocalIndex,
  type LocalSuggestIndex,
} from "./local-suggest";
import type { SearchQueryParams } from "./search-with-meilisearch";
import type { SearchSuggestions } from "@/utils/types";
import { SITE_URL } from "@/utils/site-url";

let cached: LocalSuggestIndex | null = null;
let inflight: Promise<LocalSuggestIndex | null> | null = null;

function parseIndex(text: string): LocalSuggestIndex | null {
  const json = JSON.parse(text) as LocalSuggestIndex;
  if (!Array.isArray(json.products) || json.products.length < 50) return null;
  return json;
}

async function readIndex(): Promise<LocalSuggestIndex | null> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      try {
        const file = join(process.cwd(), "public/search-suggest.json");
        const json = parseIndex(await readFile(file, "utf8"));
        if (json) {
          cached = json;
          return json;
        }
      } catch {
        /* Amplify lambdas may not have public/ on disk */
      }

      const res = await fetch(`${SITE_URL}/search-suggest.json`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) return null;
      const json = parseIndex(await res.text());
      if (json) cached = json;
      return json;
    } catch {
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export async function hasLocalSuggestIndex() {
  const index = await readIndex();
  return Boolean(index);
}

export async function searchWithLocalIndex(
  params: SearchQueryParams,
): Promise<SearchSuggestions | null> {
  const index = await readIndex();
  if (!index) return null;
  return searchLocalIndex(index, params.query, {
    page: params.page,
    length: params.length,
  });
}
