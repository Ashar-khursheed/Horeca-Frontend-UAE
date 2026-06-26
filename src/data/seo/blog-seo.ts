import { SITE_URL } from "@/utils/site-url";

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

export const BLOG_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://www.thehorecastore.com/blog#collectionpage",
      url: "https://www.thehorecastore.com/blog",
      name: "Blog – The HorecaStore",
      description:
        "Read the latest articles, tips, industry insights, and guides on commercial kitchen equipment, hospitality supplies, and restaurant operations.",
      isPartOf: { "@id": "https://www.thehorecastore.com/#website" },
      about: { "@id": "https://www.thehorecastore.com/#organization" },
    },
    {
      "@type": "WebPage",
      "@id": "https://www.thehorecastore.com/blog#webpage",
      url: "https://www.thehorecastore.com/blog",
      name: "Blog – The HorecaStore",
      description:
        "Browse articles and expert content on restaurant equipment, commercial kitchen trends, hospitality business tips, and more.",
      breadcrumb: { "@id": "https://www.thehorecastore.com/blog#breadcrumb" },
      isPartOf: { "@id": "https://www.thehorecastore.com/#website" },
      about: { "@id": "https://www.thehorecastore.com/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.thehorecastore.com/blog#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.thehorecastore.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: "https://www.thehorecastore.com/blog",
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://www.thehorecastore.com/#organization",
      name: "The HorecaStore",
      legalName: "The Horeca Store Inc",
      alternateName: "HorecaStore",
      url: "https://www.thehorecastore.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.thehorecastore.com/images/logo/11_Sep_2025_logo.png",
      },
      description:
        "Trusted U.S. supplier and B2B marketplace for commercial kitchen equipment, restaurant supplies, and hospitality solutions.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "sales@thehorecastore.com",
        availableLanguage: "English",
      },
      sameAs: [
        "https://www.facebook.com/horecastoreamerica",
        "https://www.instagram.com/horecastoreamerica",
        "https://www.linkedin.com/company/horecastoreamerica",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.thehorecastore.com/#website",
      url: "https://www.thehorecastore.com",
      name: "The HorecaStore",
      publisher: { "@id": "https://www.thehorecastore.com/#organization" },
    },
  ],
};
