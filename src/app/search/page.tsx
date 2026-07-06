import SearchFeature from "@/features/search";
import type { SearchSuggestions } from "@/utils/types";
import { toSearchSuggestions, type NlpSearchResponse } from "@/utils/adapt-nlp-search";
import { Suspense } from "react";
import { SITE_URL } from "@/utils/site-url";
import { Metadata } from "next";

const NLP_SEARCH_API = "https://nlpus.thehorecastore.co/search";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    brands?: string;
    cats?: string;
    min?: string;
    max?: string;
    sort_by?: string;
    sort_dir?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Search | HorecaStore",
  description: "Search commercial kitchen equipment and restaurant supplies at HorecaStore.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/search` },
};

async function fetchSearchResults(
  params: Record<string, string | number | undefined>,
): Promise<SearchSuggestions | null> {
  try {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    }
    const res = await fetch(`${NLP_SEARCH_API}?${qs.toString()}`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as NlpSearchResponse;
    return toSearchSuggestions(json);
  } catch {
    return null;
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const {
    q = "",
    page: pageParam = "1",
    brands: brandsParam,
    cats: catsParam,
    min: minParam,
    max: maxParam,
    sort_by: sortBy,
    sort_dir: sortDir,
  } = await searchParams;
  const page = Math.max(1, Number(pageParam));

  // Parse brand IDs from URL: "52:True Refrigeration,53:Turbo Air"
  const brandIds = brandsParam
    ? brandsParam
        .split(",")
        .map((b) => {
          const ci = b.indexOf(":");
          return ci >= 0 ? Number(b.slice(0, ci)) : Number(b);
        })
        .filter((id) => !isNaN(id) && id > 0)
    : [];

  // Parse category IDs from URL: "1:Kitchen Equipments,76:Kitchen Supplies"
  const categoryIds = catsParam
    ? catsParam
        .split(",")
        .map((c) => {
          const ci = c.indexOf(":");
          return ci >= 0 ? Number(c.slice(0, ci)) : Number(c);
        })
        .filter((id) => !isNaN(id) && id > 0)
    : [];

  // Build applied_filters JSON for API
  const appliedFilters: Record<string, unknown> = {};
  if (brandIds.length) appliedFilters.brand_ids = brandIds;
  if (categoryIds.length) appliedFilters.category_ids = categoryIds;
  if (minParam || maxParam) {
    appliedFilters.priceRange = {
      ...(minParam ? { min_price: Number(minParam) } : {}),
      ...(maxParam ? { max_price: Number(maxParam) } : {}),
    };
  }

  const searchResult = q.trim()
    ? await fetchSearchResults({
        query: q.trim(),
        page,
        length: 20,
        ...(Object.keys(appliedFilters).length
          ? { applied_filters: JSON.stringify(appliedFilters) }
          : {}),
        ...(sortBy ? { sort_by: sortBy } : {}),
        ...(sortDir ? { sort_dir: sortDir } : {}),
      })
    : null;

    console.log("SearchPage searchResult:", searchResult);

  return (
    <Suspense>
      <SearchFeature
        initialData={searchResult}
        initialQuery={q}
        initialPage={page}
      />
    </Suspense>
  );
}
