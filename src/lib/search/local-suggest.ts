import type { SearchSuggestions } from "@/utils/types";

export type LocalSuggestProduct = {
  id: number;
  n: string;
  s: string;
  u: string;
  i: string;
  p: number;
  sp: number;
  c: string;
  b: string;
  bs: string;
  bid: number;
  cs: string;
  ps: string;
  q: number;
  pop: number;
};

export type LocalSuggestBrand = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
};

export type LocalSuggestCategory = {
  name: string;
  slug: string;
  parent: string;
  image: string;
};

export type LocalSuggestIndex = {
  updated_at: string;
  count: number;
  brands: LocalSuggestBrand[];
  categories: LocalSuggestCategory[];
  products: LocalSuggestProduct[];
};

const SYNONYMS: Record<string, string[]> = {
  fridge: ["fridge", "refrigerator", "cooler"],
  fridges: ["fridge", "refrigerator", "cooler"],
  refrigerator: ["refrigerator", "fridge", "cooler"],
  refrigerators: ["refrigerator", "fridge", "cooler"],
  freezer: ["freezer"],
  sink: ["sink"],
  sinks: ["sink"],
  mixer: ["mixer"],
  mixers: ["mixer"],
  fryer: ["fryer"],
  fryers: ["fryer"],
  oven: ["oven"],
  ovens: ["oven"],
};

export function tokenize(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s./-]/g, " ")
    .split(/[\s./-]+/)
    .filter((t) => t.length > 0);
}

function wordsOf(text: string) {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function tokenAlts(token: string) {
  return SYNONYMS[token] ?? [token];
}

function tokenMatchesWords(words: string[], token: string) {
  return tokenAlts(token).some((alt) =>
    words.some((word) => {
      if (word === alt || word.startsWith(alt)) return true;
      return alt.length >= 4 && word.includes(alt);
    }),
  );
}

export function scoreProduct(p: LocalSuggestProduct, tokens: string[], raw: string) {
  const words = wordsOf(`${p.n} ${p.s} ${p.b} ${p.cs} ${p.ps}`);
  if (!tokens.every((t) => tokenMatchesWords(words, t))) return 0;
  const name = p.n.toLowerCase();
  const nameWords = wordsOf(p.n);
  let score = 8 + Math.min(p.pop, 400) / 40;
  if (name.startsWith(raw)) score += 90;
  else if (name.includes(raw)) score += 45;
  for (const t of tokens) {
    if (tokenMatchesWords(nameWords, t)) score += 16;
    if (tokenMatchesWords(wordsOf(p.b), t)) score += 10;
    if (tokenMatchesWords(wordsOf(p.cs), t)) score += 6;
  }
  return score;
}

export function searchLocalIndex(
  index: LocalSuggestIndex,
  query: string,
  options?: { page?: number; length?: number },
): SearchSuggestions {
  const raw = query.trim().toLowerCase();
  const tokens = tokenize(raw);
  const page = Math.max(1, options?.page ?? 1);
  const length = Math.min(50, Math.max(1, options?.length ?? 20));

  const empty: SearchSuggestions = {
    success: true,
    data: {
      original_query: query,
      corrected_query: query,
      did_you_mean: null,
      products: [],
      categories: [],
      brands: [],
      total_records: 0,
      total_pages: 1,
      current_page: page,
      length,
    },
  };
  if (!tokens.length) return empty;

  const ranked = index.products
    .map((p) => ({ p, score: scoreProduct(p, tokens, raw) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || b.p.pop - a.p.pop);

  const total = ranked.length;
  const slice = ranked.slice((page - 1) * length, page * length).map((row) => row.p);

  const catHits = index.categories
    .filter((c) => {
      const words = wordsOf(`${c.name} ${c.slug} ${c.parent}`);
      return tokens.every((t) => tokenMatchesWords(words, t));
    })
    .slice(0, 6);

  const brandHits = index.brands
    .filter((b) => {
      const words = wordsOf(`${b.name} ${b.slug}`);
      return (
        tokens.every((t) => tokenMatchesWords(words, t)) ||
        tokens.some((t) => t.length >= 3 && tokenMatchesWords(words, t))
      );
    })
    .slice(0, 6);

  if (!brandHits.length) {
    const fromProducts = new Map<string, LocalSuggestBrand>();
    for (const row of ranked) {
      if (!row.p.b || fromProducts.has(row.p.bs || row.p.b)) continue;
      fromProducts.set(row.p.bs || row.p.b, {
        id: row.p.bid || fromProducts.size + 1,
        name: row.p.b,
        slug: row.p.bs || row.p.b.toLowerCase().replace(/\s+/g, "-"),
      });
      if (fromProducts.size >= 6) break;
    }
    brandHits.push(...fromProducts.values());
  }

  const prices = ranked
    .slice(0, 200)
    .map((row) => (row.p.sp > 0 ? row.p.sp : row.p.p))
    .filter((n) => n > 0);

  return {
    success: true,
    data: {
      original_query: query,
      corrected_query: query,
      did_you_mean: null,
      products: slice.map((p) => {
        const path = p.u.replace(/^\/+/, "");
        const slug = path.split("/").filter(Boolean).pop() ?? path;
        return {
          id: p.id,
          sku: p.s,
          name: { en: p.n, ar: p.n },
          images: { en: p.i ? [p.i] : [], ar: [] },
          url: slug,
          category_url_resolved: p.ps || p.cs,
          parent_category_url_resolved: p.ps || p.cs,
          price: p.p,
          sale_price: p.sp,
          currency: { symbol: p.c || "$", title: "" },
          quote_available: p.q === 1,
        };
      }),
      categories: catHits.map((c, i) => ({
        id: i + 1,
        name: { en: c.name, ar: c.name },
        image: c.image || null,
        url: c.slug,
        super_parent_url: c.parent,
        super_parent: {
          id: 0,
          name: { en: "", ar: "" },
          url: c.parent,
        },
      })),
      brands: brandHits.map((b) => ({
        id: b.id,
        name: { en: b.name, ar: b.name },
        image: b.image ?? null,
        slug: b.slug,
        url: `/brands/${b.slug}`,
      })),
      total_records: total,
      total_pages: Math.max(1, Math.ceil(total / length)),
      current_page: page,
      length,
      filters: {
        priceRange: {
          min_price: prices.length ? Math.min(...prices) : 0,
          max_price: prices.length ? Math.max(...prices) : 0,
          currency: {
            symbol: slice[0]?.c ?? "$",
            title: "",
          },
        },
        brands: brandHits.map((b) => ({
          id: b.id,
          name: { en: b.name, ar: b.name },
          thumbnail: b.image ?? null,
        })),
        ratings: [],
      },
    },
  };
}
