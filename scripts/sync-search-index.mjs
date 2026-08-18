#!/usr/bin/env node
/**
 * Bulk index PIM products into self-hosted Meilisearch (free, no Algolia bill).
 *
 * Required env:
 *   MEILISEARCH_HOST, MEILISEARCH_ADMIN_API_KEY
 * Optional:
 *   MEILISEARCH_INDEX_NAME (default: horeca_products)
 *   NEXT_PUBLIC_API_BASE_URL (PIM API)
 *
 * Local: docker compose up -d meilisearch
 * Usage: npm run search:sync
 */

import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { Meilisearch } from "meilisearch";

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
    /* file optional */
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const API = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://apius.thehorecastore.co/api/"
).replace(/([^/])$/, "$1/");

const INDEX = process.env.MEILISEARCH_INDEX_NAME ?? "horeca_products";
const HOST = process.env.MEILISEARCH_HOST;
const API_KEY = process.env.MEILISEARCH_ADMIN_API_KEY;
const BATCH = 1000;
/** Slow on purpose — PIM returns 500/403 if we hit it too hard. */
const CONCURRENCY = 2;
const DELAY_MS = 400;
const MAX_RETRIES = 5;

const limitCategories = (() => {
  const i = process.argv.indexOf("--limit-categories");
  return i >= 0 ? Number(process.argv[i + 1]) : 0;
})();

if (!HOST) {
  console.error("Missing MEILISEARCH_HOST (e.g. http://127.0.0.1:7700)");
  process.exit(1);
}

const client = new Meilisearch({
  host: HOST.replace(/\/+$/, ""),
  apiKey: API_KEY,
});

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
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
  const urlPath = p.url.replace(/^\/+/, "");
  const segments = urlPath.split("/").filter(Boolean);
  const slug = segments[segments.length - 1] ?? urlPath;
  const parentCategory = segments[segments.length - 2] ?? "";
  const grandparent = segments[0] ?? "";
  const brand = matchBrand(p.title, brands);
  const supplier = p.best_supplier ?? {};
  const price = num(supplier.price ?? p.best_price);
  const saleRaw = num(supplier.sale_price);
  const salePrice = saleRaw > 0 && saleRaw < price ? saleRaw : 0;
  const effectivePrice = salePrice > 0 ? salePrice : price;
  const inStock = supplier.in_stock === 1 || supplier.in_stock === true;
  const featured = p.is_featured === 1 || p.is_featured === true;
  const quoteOnly = p.for_quotes === 1 || p.for_quotes === true;
  const reviews = p.reviews_count ?? 0;
  const images = p.image_urls ?? [];
  const popularity =
    (featured ? 1000 : 0) + reviews * 10 + (inStock ? 50 : 0) + (quoteOnly ? -200 : 0);

  return {
    id: String(p.id),
    product_id: p.id,
    name: p.title,
    sku: p.sku ?? "",
    url: `/${urlPath}`,
    slug,
    category_path: segments.slice(0, -1).join(" / ").replace(/-/g, " "),
    category_slug: parentCategory,
    parent_category_slug: `${grandparent}/${parentCategory}`.replace(/^\/+/, ""),
    brand_id: brand?.id ?? null,
    brand_name: brand?.name ?? "",
    brand_slug: brand?.slug ?? "",
    image: images[0] ?? "",
    images,
    price,
    sale_price: salePrice,
    effective_price: effectivePrice,
    currency_symbol: p.currency?.symbol ?? "$",
    quote_only: quoteOnly,
    in_stock: inStock,
    is_featured: featured,
    reviews_count: reviews,
    avg_rating: p.avg_rating ?? null,
    delivery_days: supplier.delivery_days ?? "",
    free_shipping: supplier.free_shipping === 1 || supplier.free_shipping === true,
    popularity,
    search_keywords: [p.title, p.sku, brand?.name, parentCategory, grandparent]
      .filter(Boolean)
      .join(" "),
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, options, attempt = 1) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45_000);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    if (res.status === 403 || res.status === 429 || res.status === 500) {
      if (attempt < MAX_RETRIES) {
        const wait = DELAY_MS * attempt * 3;
        await sleep(wait);
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
  return rows.map((b) => ({
    id: b.id,
    name: b.name?.en ?? b.name ?? "",
    slug: b.slug ?? "",
  }));
}

async function discoverSubcategorySlugs() {
  const slugs = new Set();
  let i = 1;
  while (true) {
    const res = await fetch(`${API}frontend/categories-${i}.xml`);
    if (!res.ok) break;
    const xml = await res.text();
    const re = /<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi;
    let m;
    while ((m = re.exec(xml)) !== null) {
      try {
        const parts = new URL(m[1]).pathname.split("/").filter(Boolean);
        if (parts.length >= 2) slugs.add(parts[parts.length - 1]);
      } catch {
        /* skip */
      }
    }
    i++;
    if (i > 50) break;
  }
  if (!slugs.size) {
    let j = 1;
    while (true) {
      const res = await fetch(`${API}frontend/products-${j}.xml`);
      if (!res.ok) break;
      const xml = await res.text();
      const re = /<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi;
      let m;
      while ((m = re.exec(xml)) !== null) {
        try {
          const parts = new URL(m[1]).pathname.split("/").filter(Boolean);
          if (parts.length >= 3) slugs.add(parts[parts.length - 2]);
        } catch {
          /* skip */
        }
      }
      j++;
      if (j > 200) break;
    }
  }
  return [...slugs];
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
      if (rec) recordsById.set(rec.product_id, rec);
    }
    const totalPages = json?.total_pages ?? 1;
    if (page >= totalPages) break;
    page++;
  }
}

async function applyIndexSettings(index) {
  const task = await index.updateSettings({
    searchableAttributes: [
      "name",
      "brand_name",
      "sku",
      "category_path",
      "search_keywords",
    ],
    filterableAttributes: [
      "brand_id",
      "brand_name",
      "category_slug",
      "quote_only",
      "in_stock",
      "effective_price",
    ],
    sortableAttributes: ["effective_price", "popularity", "reviews_count"],
    rankingRules: [
      "words",
      "typo",
      "proximity",
      "attribute",
      "sort",
      "exactness",
      "popularity:desc",
      "effective_price:asc",
    ],
  });
  await client.tasks.waitForTask(task.taskUid);
}

async function uploadRecords(index, records) {
  const list = [...records.values()];
  console.log(`Uploading ${list.length} records to Meilisearch "${INDEX}"…`);
  for (let i = 0; i < list.length; i += BATCH) {
    const chunk = list.slice(i, i + BATCH);
    const task = await index.addDocuments(chunk, { primaryKey: "id" });
    await client.tasks.waitForTask(task.taskUid);
    process.stdout.write(
      `\r  uploaded ${Math.min(i + BATCH, list.length)}/${list.length}`,
    );
  }
  console.log();
}

async function main() {
  console.log(`PIM API: ${API}`);
  console.log(`Meilisearch: ${HOST} / index "${INDEX}"`);

  const index = client.index(INDEX);

  console.log("Loading brands…");
  const brands = await fetchBrands();
  console.log(`  ${brands.length} brands`);

  console.log("Discovering subcategories…");
  let subcategories = await discoverSubcategorySlugs();
  if (limitCategories > 0) {
    subcategories = subcategories.slice(0, limitCategories);
    console.log(`  (limited to ${limitCategories} for smoke test)`);
  }
  console.log(`  ${subcategories.length} subcategories`);

  const recordsById = new Map();
  let done = 0;
  for (let i = 0; i < subcategories.length; i += CONCURRENCY) {
    const batch = subcategories.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map((slug) => fetchCategoryProducts(slug, brands, recordsById)),
    );
    done += batch.length;
    process.stdout.write(
      `\r  categories ${done}/${subcategories.length} — ${recordsById.size} unique products`,
    );
  }
  console.log();

  if (!recordsById.size) {
    console.error("No products indexed. Check PIM API connectivity.");
    process.exit(1);
  }

  await applyIndexSettings(index);
  await uploadRecords(index, recordsById);

  const manifest = {
    indexed_at: new Date().toISOString(),
    engine: "meilisearch",
    index: INDEX,
    count: recordsById.size,
    categories_scanned: subcategories.length,
  };
  await writeFile(
    "public/search-index-manifest.json",
    JSON.stringify(manifest, null, 2),
  );
  console.log("Done.", manifest);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
