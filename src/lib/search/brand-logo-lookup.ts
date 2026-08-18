import type { SearchSuggestions } from "@/utils/types";

export type BrandMeta = {
  id: number;
  name: string;
  slug: string;
  logo: string;
};

type BrandIndex = {
  byName: Map<string, BrandMeta>;
  bySlug: Map<string, BrandMeta>;
  byNorm: Map<string, BrandMeta>;
};

const TTL_MS = 60 * 60 * 1000;
let cached: BrandIndex | null = null;
let cachedAt = 0;
let inflight: Promise<BrandIndex> | null = null;

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function apiBase() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://apius.thehorecastore.co/api/"
  ).replace(/([^/])$/, "$1/");
}

function emptyIndex(): BrandIndex {
  return {
    byName: new Map(),
    bySlug: new Map(),
    byNorm: new Map(),
  };
}

function indexBrands(rows: BrandMeta[]): BrandIndex {
  const index = emptyIndex();
  for (const brand of rows) {
    if (brand.name) index.byName.set(brand.name.toLowerCase(), brand);
    if (brand.slug) index.bySlug.set(brand.slug.toLowerCase(), brand);
    const key = normalize(brand.name || brand.slug);
    if (key) index.byNorm.set(key, brand);
  }
  return index;
}

async function fetchBrandIndex(): Promise<BrandIndex> {
  try {
    const res = await fetch(`${apiBase()}frontend/brands`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return emptyIndex();
    const json = (await res.json()) as {
      data?: Array<{
        id: number;
        name?: { en?: string } | string;
        slug?: string | null;
        logo?: string | null;
        thumbnail?: { en?: string } | null;
      }>;
    };
    const rows = (json.data ?? [])
      .map((row) => {
        const name =
          typeof row.name === "string" ? row.name : (row.name?.en ?? "");
        const logo = row.logo || row.thumbnail?.en || "";
        return {
          id: row.id,
          name,
          slug: row.slug ?? "",
          logo,
        };
      })
      .filter((row) => row.name && row.slug);
    return indexBrands(rows);
  } catch {
    return emptyIndex();
  }
}

export async function loadBrandIndex(): Promise<BrandIndex> {
  if (cached && Date.now() - cachedAt < TTL_MS) return cached;
  if (!inflight) {
    inflight = fetchBrandIndex()
      .then((index) => {
        cached = index;
        cachedAt = Date.now();
        return index;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function lookupBrand(
  index: BrandIndex,
  name: string,
  slug?: string,
) {
  if (slug) {
    const bySlug = index.bySlug.get(slug.toLowerCase());
    if (bySlug) return bySlug;
  }
  if (name) {
    const byName = index.byName.get(name.toLowerCase());
    if (byName) return byName;
    const byNorm = index.byNorm.get(normalize(name));
    if (byNorm) return byNorm;
  }
  return null;
}

export async function attachBrandLogos(
  result: SearchSuggestions,
): Promise<SearchSuggestions> {
  const brands = result.data?.brands ?? [];
  if (!brands.length) return result;

  const index = await loadBrandIndex();
  return {
    ...result,
    data: {
      ...result.data,
      brands: brands.map((brand) => {
        const meta = lookupBrand(index, brand.name.en, brand.slug);
        const slug = meta?.slug || brand.slug;
        return {
          ...brand,
          id: meta?.id || brand.id,
          image: brand.image || meta?.logo || null,
          slug,
          url: slug ? `/brands/${slug}` : brand.url,
        };
      }),
    },
  };
}
