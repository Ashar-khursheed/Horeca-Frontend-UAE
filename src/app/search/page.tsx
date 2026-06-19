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
    cats?: string;
    min?: string;
    max?: string;
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const {
    q = "",
    page: pageParam = "1",
    brands: brandsParam,
    cats: catsParam,
    min: minParam,
    max: maxParam,
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

    console.log("searchResult",searchResult)

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
