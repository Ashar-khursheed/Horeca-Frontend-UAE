import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import SearchFeature from "@/features/search";
import type { SearchSuggestions } from "@/utils/types";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    brands?: string;
    min?: string;
    max?: string;
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "", page: pageParam = "1", brands: brandsParam, min: minParam, max: maxParam } = await searchParams;
  const page = Math.max(1, Number(pageParam));

  // Parse brand IDs from URL: "52:True Refrigeration,53:Turbo Air"
  const brandIds = brandsParam
    ? brandsParam.split(",").map((b) => {
        const ci = b.indexOf(":");
        return ci >= 0 ? Number(b.slice(0, ci)) : Number(b);
      }).filter((id) => !isNaN(id) && id > 0)
    : [];

  // Build applied_filters JSON for API
  const appliedFilters: Record<string, unknown> = {};
  if (brandIds.length) appliedFilters.brand_ids = brandIds;
  if (minParam || maxParam) {
    appliedFilters.priceRange = {
      ...(minParam ? { min_price: Number(minParam) } : {}),
      ...(maxParam ? { max_price: Number(maxParam) } : {}),
    };
  }

  const searchResult = q.trim()
    ? await makeApiCallSSR<SearchSuggestions>(
        apiUrls.SEARCH,
        {
          query: q.trim(),
          page,
          length: 20,
          ...(Object.keys(appliedFilters).length
            ? { applied_filters: JSON.stringify(appliedFilters) }
            : {}),
        },
        { revalidate: 60 },
      )
    : null;


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
