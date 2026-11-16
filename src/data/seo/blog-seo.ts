import { SITE_URL } from "@/utils/site-url";
import { HOME_SCHEMA } from "@/data/seo/home-schema";

export const BLOG_SEO = {
  title: "Commercial Kitchen Equipment Tips & Guides | HorecaStore",
  meta_description:
    "Explore the HorecaStore blog for expert hospitality tips, industry insights, and practical advice to help hotels and restaurants improve daily operations.",
  indexing: true,
  og_title: "Expert Commercial Kitchen Equipment Tips – HorecaStore Guide",
  og_description:
    "Discover expert Commercial Kitchen Equipment Tips & Guides from HorecaStore. Learn how to choose, maintain, and optimize your kitchen tools—read now and improve your foodservice operations today.",
  canonical_url: `${SITE_URL}/blog`,
};

// Built from SITE_URL so the UAE build no longer describes the US site; the
// Organization/WebSite nodes are shared with the homepage schema.
const ORG_NODES = HOME_SCHEMA["@graph"].filter((n) =>
  ["Organization", "WebSite"].includes(String(n["@type"])),
);
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const BLOG_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/blog#collectionpage`,
      url: `${SITE_URL}/blog`,
      name: "Blog – HorecaStore",
      description:
        "Read the latest articles, tips, industry insights, and guides on commercial kitchen equipment, hospitality supplies, and restaurant operations.",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      breadcrumb: { "@id": `${SITE_URL}/blog#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/blog#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      ],
    },
    ...ORG_NODES,
  ],
};
