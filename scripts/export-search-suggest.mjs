#!/usr/bin/env node
/**
 * Build public/search-suggest.json from the public PIM listing API.
 * Used by the header dropdown and /search when Meilisearch is not reachable.
 *
 * Usage: node scripts/export-search-suggest.mjs
 */

import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { resolve } from "path";

function loadEnvFile(filename) {
  try {
    const text = readFileSync(resolve(process.cwd(), filename), "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* optional */
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const API = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://apius.thehorecastore.co/api/"
).replace(/([^/])$/, "$1/");

const CONCURRENCY = 3;
const DELAY_MS = 220;
const MAX_RETRIES = 5;
const OUT = "public/search-suggest.json";

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function titleFromSlug(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function categorySlugsFromNav() {
  const text = readFileSync(resolve("src/data/index.ts"), "utf8");
  return [...new Set([...text.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]))];
}

async function fetchJson(url, options, attempt = 1) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45_000);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    if (res.status === 403 || res.status === 429 || res.status === 500) {
      if (attempt < MAX_RETRIES) {
        await sleep(DELAY_MS * attempt * 3);
        return fetchJson(url, options, attempt + 1);
      }
      throw new Error(`HTTP ${res.status}`);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchBrands() {
  const json = await fetchJson(`${API}frontend/brands`, {
    headers: { Accept: "application/json" },
  });
  const rows = json?.data ?? json ?? [];
  return rows
    .map((b) => ({
      id: Number(b.id) || 0,
      name: b.name?.en ?? b.name ?? "",
      slug: b.slug ?? "",
      image: b.image ?? b.logo ?? null,
    }))
    .filter((b) => b.name && b.slug);
}

function matchBrand(title, brands) {
  const lower = title.toLowerCase();
  let best = null;
  for (const b of brands) {
    const name = b.name.toLowerCase();
    if (!name) continue;
    if (lower.startsWith(name) || lower.includes(` ${name} `)) {
      if (!best || name.length > best.name.length) best = b;
    }
  }
  return best;
}

function toRecord(p, brands) {
  if (!p.id || !p.title || !p.url) return null;
  const urlPath = String(p.url).replace(/^\/+/, "");
  const segments = urlPath.split("/").filter(Boolean);
  const parentCategory = segments[segments.length - 2] ?? "";
  const grandparent = segments[0] ?? "";
  const brand = matchBrand(p.title, brands);
  const supplier = p.best_supplier ?? {};
  const price = num(supplier.price ?? p.best_price);
  const saleRaw = num(supplier.sale_price);
  const salePrice = saleRaw > 0 && saleRaw < price ? saleRaw : 0;
  const images = p.image_urls ?? [];
  const featured = p.is_featured === 1 || p.is_featured === true;
  const inStock = supplier.in_stock === 1 || supplier.in_stock === true;
  const quoteOnly = p.for_quotes === 1 || p.for_quotes === true;
  const reviews = p.reviews_count ?? 0;
  return {
    id: Number(p.id),
    n: String(p.title),
    s: p.sku ?? "",
    u: `/${urlPath}`,
    i: images[0] ?? "",
    p: price,
    sp: salePrice,
    c: p.currency?.symbol ?? "$",
    b: brand?.name ?? "",
    bs: brand?.slug ?? "",
    bid: brand?.id ?? 0,
    cs: parentCategory,
    ps: `${grandparent}/${parentCategory}`.replace(/^\/+/, ""),
    q: quoteOnly ? 1 : 0,
    pop: (featured ? 1000 : 0) + reviews * 10 + (inStock ? 50 : 0),
  };
}

async function fetchProductsPage(categorySlug, page) {
  return fetchJson(`${API}frontend/products/filters/get-products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      category_url: categorySlug,
      locale: "en",
      page,
      length: 500,
      sort_by: "price",
      sort_dir: "asc",
      applied_filters: {},
      applied_range_filters: [{}],
      applied_fixed_filters: [{}],
    }),
  });
}

async function fetchCategoryProducts(categorySlug, brands, recordsById) {
  await sleep(DELAY_MS);
  let page = 1;
  while (true) {
    let json;
    try {
      json = await fetchProductsPage(categorySlug, page);
    } catch (err) {
      console.warn(`  ! ${categorySlug} p${page}: ${err.message}`);
      break;
    }
    const products = json?.products ?? [];
    if (!products.length) break;
    for (const p of products) {
      const rec = toRecord(p, brands);
      if (rec) recordsById.set(rec.id, rec);
    }
    const totalPages = json?.total_pages ?? 1;
    if (page >= totalPages) break;
    page++;
  }
}

function categoriesFromProducts(records) {
  const map = new Map();
  for (const rec of records) {
    if (!rec.cs || map.has(rec.cs)) continue;
    const [parent] = rec.ps.includes("/") ? rec.ps.split("/") : [rec.ps];
    map.set(rec.cs, {
      name: titleFromSlug(rec.cs),
      slug: rec.cs,
      parent: parent || rec.cs,
      image: rec.i || "",
    });
  }
  return [...map.values()];
}

async function main() {
  console.log(`PIM API: ${API}`);
  const slugs = categorySlugsFromNav();
  console.log(`Nav slugs: ${slugs.length}`);

  const brands = await fetchBrands();
  console.log(`Brands: ${brands.length}`);

  const recordsById = new Map();
  let done = 0;
  for (let i = 0; i < slugs.length; i += CONCURRENCY) {
    const batch = slugs.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map((slug) => fetchCategoryProducts(slug, brands, recordsById)),
    );
    done += batch.length;
    process.stdout.write(
      `\r  categories ${done}/${slugs.length} — ${recordsById.size} products`,
    );
  }
  console.log();

  const products = [...recordsById.values()].sort((a, b) => b.pop - a.pop);
  if (!products.length) {
    console.error("No products exported. Check PIM API connectivity.");
    process.exit(1);
  }

  const payload = {
    updated_at: new Date().toISOString(),
    count: products.length,
    brands: brands.map(({ id, name, slug, image }) => ({
      id,
      name,
      slug,
      image,
    })),
    categories: categoriesFromProducts(products),
    products,
  };

  await writeFile(OUT, JSON.stringify(payload));
  console.log(`Wrote ${OUT} (${products.length} products, ${payload.categories.length} categories)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
