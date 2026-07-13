// scripts/generate-llms.mjs
// Auto-runs before build via "prebuild" in package.json
// Generates: public/llms.txt (site structure) + public/llms-products.txt (all products)

import { readdir, writeFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT       = join(__dirname, "..");
const APP_DIR    = join(ROOT, "src", "app");
const PUBLIC_DIR = join(ROOT, "public");

const SITE = "https://www.thehorecastore.com";
const API  = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://apius.thehorecastore.co/api/").replace(/([^/])$/, "$1/");
console.log(`Using API: ${API}`);


// Locale prefixes the AE backend injects — strip them so URLs are clean
const LOCALE_RE = /^\/[a-z]{2}(-[a-z]{2})?\//;

// ── Normalize: fix domain + strip locale prefix ───────────────────────────────
function normalizeUrl(raw) {
  try {
    const u = new URL(raw.trim());
    const path = u.pathname.replace(LOCALE_RE, "/");
    return `${SITE}${path}`;
  } catch {
    return raw;
  }
}

// ── Parse <loc> tags from XML ─────────────────────────────────────────────────
function parseLocs(xml) {
  const urls = [];
  const re = /<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) urls.push(normalizeUrl(m[1]));
  return urls;
}

// ── Fetch one sitemap (15s timeout) ──────────────────────────────────────────
async function fetchSitemap(path) {
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch(`${API}${path}`, { signal: ctrl.signal });
    if (!res.ok) return null;          // null = not found / failed
    const xml = await res.text();
    const urls = parseLocs(xml);
    return urls.length ? urls : null;  // null = empty file
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ── Fetch one page, with retries on timeout/network/5xx failures ─────────────
async function fetchProductsPage(categorySlug, page, attempt = 1) {
  const MAX_ATTEMPTS = 4;
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30_000);
  try {
    const res = await fetch(`${API}frontend/products/filters/get-products`, {
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
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, 500 * attempt)); // backoff: 0.5s, 1s, 1.5s
      return fetchProductsPage(categorySlug, page, attempt + 1);
    }
    console.warn(`\n  ! ${categorySlug} page ${page} failed after ${MAX_ATTEMPTS} attempts: ${err.message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ── Fetch products for one subcategory slug (paginated) ───────────────────────
async function fetchProductsForCategory(categorySlug, allUrls) {
  let page = 1;
  while (true) {
    const json = await fetchProductsPage(categorySlug, page);
    if (!json) break; // gave up after retries — already logged
    const products = json?.products ?? json?.data ?? [];
    if (!products.length) break;
    for (const p of products) {
      const raw = p.url ?? p.product_url ?? null;
      if (raw) {
        const clean = raw.startsWith("http") ? normalizeUrl(raw) : `${SITE}${raw.startsWith("/") ? raw : "/" + raw}`;
        allUrls.add(clean);
      }
    }
    const totalPages = json?.total_pages ?? json?.last_page ?? 1;
    if (page >= totalPages) break;
    page++;
  }
}

// ── Fetch ALL products by iterating every subcategory ─────────────────────────
async function fetchAllProducts(subcategorySlugs) {
  const all = new Set();
  let done  = 0;
  // Keep concurrency modest — the backend takes 5s+ per category page under
  // load, and firing too many requests at once causes timeouts that silently
  // drop products (and make totals vary between runs).
  const CONCURRENCY = 10;
  for (let i = 0; i < subcategorySlugs.length; i += CONCURRENCY) {
    const batch = subcategorySlugs.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map((slug) => fetchProductsForCategory(slug, all)));
    done += batch.length;
    process.stdout.write(`\r  subcategories: ${done}/${subcategorySlugs.length} done, ${all.size} products found`);
  }
  console.log();
  return [...all];
}

// ── Log per-file + total product counts from products-N.xml sitemaps ──────────
async function logProductSitemapCounts() {
  console.log("Product counts per sitemap file:");
  let total = 0;
  let i = 1;
  while (true) {
    const urls = await fetchSitemap(`frontend/products-${i}.xml`);
    if (!urls) break;
    total += urls.length;
    console.log(`  products-${i}: ${urls.length}`);
    i++;
    if (i > 200) break;
  }
  console.log(`  TOTAL PRODUCTS (products-1 to products-${i - 1}): ${total}`);
}

// ── Auto-detect all product sitemap files (fallback) ──────────────────────────
async function fetchAllProductSitemaps() {
  const all = [];
  let i = 1;
  while (true) {
    const urls = await fetchSitemap(`frontend/products-${i}.xml`);
    if (!urls) break;
    all.push(...urls);
    console.log(`  products-${i}.xml → ${urls.length} (total: ${all.length})`);
    i++;
    if (i > 200) break;
  }
  return all;
}

// ── Readable label from URL slug ──────────────────────────────────────────────
function urlToLabel(url) {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    const last  = parts[parts.length - 1] || "Home";
    return last.replace(/-+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return url;
  }
}

// ── Path depth classifier ─────────────────────────────────────────────────────
function classify(url) {
  try {
    const path  = new URL(url).pathname;
    const depth = path.split("/").filter(Boolean).length;
    if (path.startsWith("/blog"))       return "Blog";
    if (path.startsWith("/brands"))     return "Brands";
    if (path.startsWith("/pages"))      return "Pages";
    if (path.startsWith("/categories")) return "Categories";
    if (depth === 3) return "Products";
    if (depth === 2) return "Categories";
    if (depth === 1) return "Main";
    return "Other";
  } catch {
    return "Other";
  }
}

// ── Scan local Next.js app for auth/dashboard routes ─────────────────────────
async function findLocalRoutes(dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await findLocalRoutes(full, results);
    else if (e.name === "page.tsx") results.push(full);
  }
  return results;
}

function toRoute(filePath) {
  let rel = filePath
    .replace(APP_DIR, "")
    .replace(/\\/g, "/")
    .replace(/\/page\.tsx$/, "")
    .replace(/\/\([^)]+\)/g, "");
  return rel || "/";
}

// ── Write file helper ─────────────────────────────────────────────────────────
async function write(filename, lines) {
  await writeFile(join(PUBLIC_DIR, filename), lines.join("\n"), "utf8");
}

// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const now = new Date().toISOString().split("T")[0];

  // ── 1. Fetch non-product sitemaps ─────────────────────────────────────────
  const staticFiles = ["frontend/pages.xml", "frontend/categories.xml", "frontend/blog.xml", "frontend/brand.xml"];
  console.log("Fetching site sitemaps…");
  const staticResults = await Promise.all(staticFiles.map(fetchSitemap));
  const staticUrls = [...new Set(staticResults.flat().filter(Boolean))];
  console.log(`  ${staticUrls.length} site URLs`);

  await logProductSitemapCounts();

  // ── 2. Get subcategory slugs from categories sitemap ─────────────────────
  // depth-2 paths = subcategories (e.g. /refrigeration/reach-in-refrigerator)
  const subcategorySlugs = staticUrls
    .filter((url) => {
      try {
        const p = new URL(url).pathname;
        const depth = p.split("/").filter(Boolean).length;
        return depth === 2 && !p.startsWith("/blog") && !p.startsWith("/brands") && !p.startsWith("/pages");
      } catch { return false; }
    })
    .map((url) => {
      try { return new URL(url).pathname.split("/").filter(Boolean)[1]; }
      catch { return null; }
    })
    .filter(Boolean);

  console.log(`  Found ${subcategorySlugs.length} subcategories — fetching products…`);

  // ── 3. Fetch products via listing API (per subcategory) ───────────────────
  let productUrls = subcategorySlugs.length > 0
    ? await fetchAllProducts(subcategorySlugs)
    : [];

  // Fallback: sitemap XML files
  if (productUrls.length === 0) {
    console.log("  Listing API returned 0 — trying sitemap XML files…");
    productUrls = [...new Set(await fetchAllProductSitemaps())];
  }

  console.log(`  ${productUrls.length} product URLs total`);

  // ── 3. Classify site URLs ─────────────────────────────────────────────────
  const sections = { "Main Pages": [], "Categories": [], "Blog": [], "Brands": [], "Pages": [], "Other": [] };
  for (const url of staticUrls) {
    const s = classify(url);
    if (s === "Products") continue; // products go to separate file
    (sections[s] || sections["Other"]).push(url);
  }

  // ── 4. Add local routes (auth/dashboard/static pages) ────────────────────
  const localPages  = await findLocalRoutes(APP_DIR);
  const localRoutes = localPages.map(toRoute).sort();
  const authUrls = [], dashUrls = [];
  for (const r of localRoutes) {
    if (["/login","/register","/forgot-password","/reset-password","/loginOrder"].includes(r))
      authUrls.push(`${SITE}${r}`);
    else if (r.startsWith("/dashboard"))
      dashUrls.push(`${SITE}${r}`);
    else if (["/","/cart","/checkout","/faq","/search","/wishlist",
              "/track-order","/starting-a-restaurant","/mega-sale",
              "/create-quotation","/payment-success","/payment-decline"].includes(r)) {
      if (!sections["Main Pages"].includes(`${SITE}${r}`))
        sections["Main Pages"].push(`${SITE}${r}`);
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // FILE 1: llms.txt — site structure (no products)
  // ════════════════════════════════════════════════════════════════════════════
  const siteLines = [
    `# TheHorecaStore`,
    ``,
    `> TheHorecaStore is a B2B e-commerce platform for restaurant, hotel, and catering equipment.`,
    `> We supply commercial kitchen equipment, refrigeration, smallwares, and more across the United States.`,
    ``,
    `- Base URL: ${SITE}`,
    `- Generated: ${now}`,
    `- Products file: ${SITE}/llms-products.txt`,
    `- Language: English`,
    ``,
  ];

  for (const [section, urls] of Object.entries(sections)) {
    if (!urls.length) continue;
    siteLines.push(`## ${section} (${urls.length})`, ``);
    for (const url of urls) siteLines.push(`- [${urlToLabel(url)}](${url})`);
    siteLines.push(``);
  }

  if (authUrls.length) {
    siteLines.push(`## Authentication`, ``);
    for (const url of authUrls) siteLines.push(`- [${urlToLabel(url)}](${url})`);
    siteLines.push(``);
  }
  if (dashUrls.length) {
    siteLines.push(`## Dashboard`, ``);
    for (const url of dashUrls) siteLines.push(`- [${urlToLabel(url)}](${url})`);
    siteLines.push(``);
  }

  siteLines.push(`## Optional`, ``);
  siteLines.push(`- [All Products](${SITE}/llms-products.txt)`);
  siteLines.push(`- [Sitemap Index](${SITE}/sitemap-index.xml)`);
  siteLines.push(`- [Robots](${SITE}/robots.txt)`);
  siteLines.push(``);

  await write("llms.txt", siteLines);
  console.log(`✓ llms.txt → ${siteLines.length} lines`);

  // ════════════════════════════════════════════════════════════════════════════
  // FILE 2: llms-products.txt — full catalog (brands, categories, blog, products)
  // ════════════════════════════════════════════════════════════════════════════

  const brandUrls    = sections["Brands"]    ?? [];
  const categoryUrls = sections["Categories"] ?? [];
  const blogUrls     = sections["Blog"]       ?? [];

  const prodLines = [
    `# TheHorecaStore — Full Catalog`,
    ``,
    `> Complete catalog for TheHorecaStore.com — brands, categories, blog, and all products.`,
    ``,
    `- Base URL: ${SITE}`,
    `- Generated: ${now}`,
    `- Total Products: ${productUrls.length}`,
    `- Total Brands: ${brandUrls.length}`,
    `- Total Categories: ${categoryUrls.length}`,
    `- Total Blog Posts: ${blogUrls.length}`,
    ``,
  ];

  if (brandUrls.length) {
    prodLines.push(`## Brands (${brandUrls.length})`, ``);
    for (const url of brandUrls) prodLines.push(`- [${urlToLabel(url)}](${url})`);
    prodLines.push(``);
  }

  if (categoryUrls.length) {
    prodLines.push(`## Categories (${categoryUrls.length})`, ``);
    for (const url of categoryUrls) prodLines.push(`- [${urlToLabel(url)}](${url})`);
    prodLines.push(``);
  }

  if (blogUrls.length) {
    prodLines.push(`## Blog (${blogUrls.length})`, ``);
    for (const url of blogUrls) prodLines.push(`- [${urlToLabel(url)}](${url})`);
    prodLines.push(``);
  }

  prodLines.push(`## Products (${productUrls.length})`, ``);
  for (const url of productUrls) {
    prodLines.push(`- [${urlToLabel(url)}](${url})`);
  }
  prodLines.push(``);

  await write("llms-products.txt", prodLines);
  console.log(`✓ llms-products.txt → ${brandUrls.length} brands, ${categoryUrls.length} categories, ${blogUrls.length} blog, ${productUrls.length} products`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(0); // don't fail the build
});
