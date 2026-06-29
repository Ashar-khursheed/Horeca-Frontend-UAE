import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { PolicyPageContent } from "./content";
import { revalidate } from "@/utils";

// ─── Shared types (imported by content.tsx) ───────────────────────────────────

export interface NavPage {
  id: number;
  title: string;
  slug: string;
}

export interface ContentSection {
  id: string;
  title: string;
  body: string;
}

export interface ParsedContent {
  introHtml: string;   // first 1-2 h2 headers + intro paragraphs → goes into SEOMainContent
  sections: ContentSection[];
}

// ─── API types ────────────────────────────────────────────────────────────────

interface SeoUrl {
  url?: string | null;
  title_tag?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  seo_schema?: string | null;
  banner_image_url?: string | null;
  banner_image_alt_text?: string | null;
}

interface StaticPageData {
  id: number;
  title: string;
  content: string;
  seo_url?: SeoUrl | null;
}

interface StaticPageResponse {
  success: boolean;
  data: StaticPageData;
}

interface StaticPageListItem {
  id: number;
  title: string;
  is_active: boolean;
  seo_url: { url?: string } | null;
}

interface StaticPageListResponse {
  success: boolean;
  data: StaticPageListItem[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip junk strings the API sometimes returns ("null", "undefined", "") */
function clean(v: string | null | undefined): string | undefined {
  return v && v !== "null" && v !== "undefined" ? v.trim() : undefined;
}

function parseContent(html: string): ParsedContent {
  const usedIds = new Set<string>();
  const h2Regex = /<h2[^>]*>[\s\S]*?<\/h2>/gi;
  const h2Tags: string[] = [];
  const h2Positions: number[] = [];

  let m: RegExpExecArray | null;
  while ((m = h2Regex.exec(html)) !== null) {
    h2Tags.push(m[0]);
    h2Positions.push(m.index);
  }

  if (h2Tags.length === 0) return { introHtml: html, sections: [] };

  // Find the first h2 that actually has body content after it
  let firstBodyIdx = -1;
  for (let i = 0; i < h2Tags.length; i++) {
    const bodyStart = h2Positions[i] + h2Tags[i].length;
    const bodyEnd =
      i + 1 < h2Positions.length ? h2Positions[i + 1] : html.length;
    if (html.slice(bodyStart, bodyEnd).trim()) {
      firstBodyIdx = i;
      break;
    }
  }

  if (firstBodyIdx === -1) return { introHtml: html, sections: [] };

  // introHtml = everything from the start up to the end of firstBodyIdx's content
  const introEnd =
    firstBodyIdx + 1 < h2Positions.length
      ? h2Positions[firstBodyIdx + 1]
      : html.length;
  const introHtml = html.slice(0, introEnd).trim();

  // Remaining h2 blocks become section cards
  const sections: ContentSection[] = [];
  for (let i = firstBodyIdx + 1; i < h2Tags.length; i++) {
    const innerHtml = h2Tags[i].replace(/<\/?h2[^>]*>/gi, "");
    const text = innerHtml.replace(/<[^>]+>/g, "").trim();
    if (!text) continue;

    const baseId = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    let id = baseId;
    let count = 1;
    while (usedIds.has(id)) id = `${baseId}-${count++}`;
    usedIds.add(id);

    const bodyStart = h2Positions[i] + h2Tags[i].length;
    const bodyEnd =
      i + 1 < h2Positions.length ? h2Positions[i + 1] : html.length;
    const body = html.slice(bodyStart, bodyEnd).trim();

    if (body) sections.push({ id, title: text, body });
  }

  return { introHtml, sections };
}

// ─── generateMetadata ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const res = await makeApiCallSSR<StaticPageResponse>(
    `frontend/static-pages/${slug}`,
    undefined,
    { revalidate: revalidate }
  );

  if (!res?.success || !res.data) {
    return { title: "Policy | HorecaStore" };
  }

  const { title, seo_url } = res.data;

  const metaTitle =
    clean(seo_url?.title_tag) ??
    clean(seo_url?.meta_title) ??
    `${title} | HorecaStore`;

  const metaDesc = clean(seo_url?.meta_description);
  const ogTitle  = clean(seo_url?.og_title) ?? metaTitle;
  const ogDesc   = clean(seo_url?.og_description) ?? metaDesc;
  const ogImage  = clean(seo_url?.og_image_url);

  return {
    title: metaTitle,
    description: metaDesc,
     robots: {index: true, follow: true} ,
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: {
      canonical: `/pages/${slug}`,
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [listRes, pageRes] = await Promise.all([
    makeApiCallSSR<StaticPageListResponse>("frontend/static-pages", undefined, {
      revalidate: revalidate,
    }),
    makeApiCallSSR<StaticPageResponse>(
      `frontend/static-pages/${slug}`,
      undefined,
      { revalidate: revalidate }
    ),
  ]);

  if (!pageRes?.success || !pageRes.data) notFound();

  const navPages: NavPage[] = (listRes?.data ?? [])
    .filter((p) => p.is_active && p.seo_url?.url)
    .map((p) => ({ id: p.id, title: p.title, slug: p.seo_url!.url! }));

  const parsedContent = parseContent(pageRes.data.content ?? "");
  const seoSchema = clean(pageRes.data.seo_url?.seo_schema);

  return (
    <>
      {seoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoSchema }}
        />
      )}
      <PolicyPageContent
        title={pageRes.data.title}
        parsedContent={parsedContent}
        navPages={navPages}
        currentSlug={slug}
      />
    </>
  );
}
