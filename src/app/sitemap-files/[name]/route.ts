import { proxyXml } from "@/utils/sitemap-proxy";

export const revalidate = 3600;

const VALID_SITEMAPS: Record<string, string> = {
  pages:         "frontend/pages.xml",
  categories:    "frontend/categories.xml",
  blog:          "frontend/blog.xml",
  brand:         "frontend/brand.xml",
  "products-1":  "frontend/products-1.xml",
  "products-2":  "frontend/products-2.xml",
  "products-3":  "frontend/products-3.xml",
  "products-4":  "frontend/products-4.xml",
  "products-5":  "frontend/products-5.xml",
  "products-6":  "frontend/products-6.xml",
  "products-7":  "frontend/products-7.xml",
  "products-8":  "frontend/products-8.xml",
  "products-9":  "frontend/products-9.xml",
  "products-10": "frontend/products-10.xml",
  "products-11": "frontend/products-11.xml",
  "products-12": "frontend/products-12.xml",
  "products-13": "frontend/products-13.xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const backendPath = VALID_SITEMAPS[name];

  if (!backendPath) {
    return new Response("Not Found", { status: 404 });
  }

  return proxyXml(backendPath);
}
