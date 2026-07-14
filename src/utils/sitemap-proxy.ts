import { revalidate } from ".";

const API = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://apius.thehorecastore.co/api/"
).replace(/([^/])$/, "$1/");

export async function proxyXml(backendPath: string): Promise<Response> {
  try {
    const res = await fetch(`${API}${backendPath}`, {
      next: { revalidate: revalidate },
    });
    if (!res.ok) {
      return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>`, {
        status: 200,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }
    const xml = await res.text();
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>`, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
