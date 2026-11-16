import { SITE_URL } from "@/utils/site-url";

/** Plain-text excerpt of HTML, cut on a word boundary. Used as a meta description fallback. */
export function plainTextExcerpt(html: unknown, maxLength = 155): string {
  if (typeof html !== "string" || !html) return "";
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&[a-z]+;/gi, " ")
    // Some CMS text has lost characters (usually dashes) as U+FFFD.
    .replace(/\s*�\s*/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.-]+$/, "")}…`;
}

/** Collapses doubled whitespace and dangling separators left by empty template variables. */
export function cleanTitle(
  title: string | null | undefined,
): string | undefined {
  if (!title) return undefined;
  const cleaned = title
    .replace(/\s+/g, " ")
    .replace(/\s+([-|–:])\s*([-|–:]\s*)+/g, " $1 ") // "a -  - b" -> "a - b"
    .replace(/^[\s\-|–:]+|[\s\-|–:]+$/g, "")
    .trim();
  return cleaned || undefined;
}

export type Crumb = { name: string; path: string };

/** BreadcrumbList for a page; `path` values are site-relative ("/hotel-supplies"). */
export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path === "/" ? "" : c.path}`,
    })),
  };
}

/** Turns a URL slug into a readable label when the API gives no name. */
export function labelFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type BlogPostingInput = {
  url: string;
  headline: string;
  description?: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  authorJobTitle?: string | null;
};

export function blogPosting(input: BlogPostingInput) {
  const org = { "@type": "Organization", name: "HorecaStore", url: SITE_URL };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    url: input.url,
    headline: input.headline.slice(0, 110),
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: [input.image] } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified || input.datePublished
      ? { dateModified: input.dateModified || input.datePublished }
      : {}),
    author: input.authorName
      ? {
          "@type": "Person",
          name: input.authorName,
          ...(input.authorJobTitle ? { jobTitle: input.authorJobTitle } : {}),
        }
      : org,
    publisher: {
      ...org,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo/11_Sep_2025_logo.png`,
      },
    },
  };
}
