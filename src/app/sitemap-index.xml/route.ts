export const revalidate = 3600;

const SITE = (process.env.NEXT_SITE_URL ?? "https://www.thehorecastore.com").replace(/\/$/, "");

const SITEMAPS = [
  "pages",
  "categories",
  "blog",
  "brand",
  "images",
  ...Array.from({ length: 13 }, (_, i) => `products-${i + 1}`),
];

export async function GET() {
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAPS.map(
  (name) =>
    `  <sitemap>\n    <loc>${SITE}/sitemap-files/${name}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`
).join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
