import type { MetadataRoute } from "next";

const SITE = (process.env.NEXT_SITE_URL ?? "https://www.thehorecastore.com").replace(/\/$/, "");

// /sitemap.xml — static pages only (individual sitemaps at /sitemap-index.xml)
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`,                      priority: 1.0, changeFrequency: "daily"   },
    { url: `${SITE}/blog`,                  priority: 0.8, changeFrequency: "daily"   },
    { url: `${SITE}/brands`,               priority: 0.7, changeFrequency: "weekly"  },
    { url: `${SITE}/faq`,                   priority: 0.6, changeFrequency: "monthly" },
    { url: `${SITE}/pages/about-us`,        priority: 0.6, changeFrequency: "monthly" },
    { url: `${SITE}/pages/contact-us`,      priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE}/starting-a-restaurant`, priority: 0.7, changeFrequency: "monthly" },
  ];
}
