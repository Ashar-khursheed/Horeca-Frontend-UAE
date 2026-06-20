import type { MetadataRoute } from "next";

// Fetches a backend XML sitemap and converts it to Next.js MetadataRoute.Sitemap format
export async function parseBackendSitemap(
  xmlUrl: string
): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(xmlUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();

    const urls: MetadataRoute.Sitemap = [];

    // Extract all <url> blocks
    const urlBlocks = xml.match(/<url>([\s\S]*?)<\/url>/g) ?? [];

    for (const block of urlBlocks) {
      const loc      = block.match(/<loc>(.*?)<\/loc>/)?.[1]?.trim();
      const lastmod  = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1]?.trim();
      const freq     = block.match(/<changefreq>(.*?)<\/changefreq>/)?.[1]?.trim();
      const priority = block.match(/<priority>(.*?)<\/priority>/)?.[1]?.trim();

      if (!loc) continue;

      urls.push({
        url: loc,
        ...(lastmod  ? { lastModified: new Date(lastmod) } : {}),
        ...(freq     ? { changeFrequency: freq as MetadataRoute.Sitemap[0]["changeFrequency"] } : {}),
        ...(priority ? { priority: parseFloat(priority) } : {}),
      });
    }

    return urls;
  } catch {
    return [];
  }
}
