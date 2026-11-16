import { SITE_URL } from "@/utils/site-url";
import { revalidate as API_REVALIDATE } from "@/utils";

export const revalidate = 3600;

const SITE = SITE_URL;

const API = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://apius.thehorecastore.co/api/"
).replace(/([^/])$/, "$1/");

// Child sitemaps served from /sitemap-files/<name> (see that route).
const CHILD_SITEMAPS = [
  "pages",
  "categories",
  "blog",
  "brand",
  ...Array.from({ length: 13 }, (_, i) => `products-${i + 1}`),
];

type Child = { loc: string; lastmod?: string };

/**
 * Reads a backend child sitemap and returns its newest <lastmod>, or null when
 * the file has no URLs. Empty child sitemaps are left out of the index: Search
 * Console reports them as errors and they waste crawl budget.
 */
async function inspectChild(name: string): Promise<Child | null> {
  try {
    const res = await fetch(`${API}frontend/${name}.xml`, {
      next: { revalidate: API_REVALIDATE },
    });
    if (!res.ok) return null;
    const xml = await res.text();
    if (!/<url>/i.test(xml)) return null;
    const dates = Array.from(xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g))
      .map((m) => Date.parse(m[1].trim()))
      .filter((n) => !Number.isNaN(n));
    const newest = dates.length ? new Date(Math.max(...dates)).toISOString() : undefined;
    return { loc: `${SITE}/sitemap-files/${name}`, lastmod: newest };
  } catch {
    // On a backend error keep the entry (without lastmod) rather than
    // silently dropping thousands of product URLs from the index.
    return { loc: `${SITE}/sitemap-files/${name}` };
  }
}

export async function GET() {
  const children = (await Promise.all(CHILD_SITEMAPS.map(inspectChild))).filter(
    (c): c is Child => c !== null,
  );

  // /sitemap.xml holds the home, blog, brands, faq and static pages; list it here
  // so the index (the sitemap declared in robots.txt) covers every URL.
  const entries: Child[] = [{ loc: `${SITE}/sitemap.xml` }, ...children];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ loc, lastmod }) =>
      `  <sitemap>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
