import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/site-url";

const privateDisallow = [
  "/admin/", "/backend/", "/dashboard/",
  "/account/", "/my-account/", "/login/", "/register/", "/wishlist/",
  "/cart/", "/carts/", "/checkout/", "/orders/", "/payment/",
  "/cgi-bin/", "/tmp/", "/private/", "/scripts/", "/test/", "/staging/",
  "/tracking/", "/cdn/shop/files/", "/meta.json",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/*.css$", "/*.js$", "/static/", "/assets/", "/images/", "/media/", "/fonts/"],
        disallow: [
          ...privateDisallow,
          "/wpm", "/wpm@",
          "/login_with_shop", "/services/login_with_shop",
          "/compare/", "/tracking/", "/*.atom",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: privateDisallow,
      },
      { userAgent: "googlebot-image", allow: "/" },
      { userAgent: "Googlebot-News", allow: "/" },
      { userAgent: "Googlebot-Video", allow: "/" },
      { userAgent: "googlebot-mobile", allow: "/" },
      { userAgent: "Googlebot-Smartphone", allow: "/" },
      { userAgent: "Google-InspectionTool", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },

      // AI crawlers — allow all
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "claude-web", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "cohere-training-data-crawler", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
      { userAgent: "DuckAssistBot", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "Meta-ExternalFetcher", allow: "/" },
      { userAgent: "MistralAI-User", allow: "/" },
      { userAgent: "Timpibot", allow: "/" },
      { userAgent: "YouBot", allow: "/" },

      // SEO tools
      { userAgent: "SemrushBot", allow: "/" },
      { userAgent: "SemrushBot-SA", allow: "/" },
      { userAgent: "Screaming Frog SEO Spider", allow: "/" },

      // Social / other major crawlers
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: privateDisallow,
      },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "LinkedInBot", allow: "/" },

      // Block legacy / low-quality bots
      { userAgent: "MSNBot", disallow: "/" },
      { userAgent: "Slurp", disallow: "/" },
      { userAgent: "Gigabot", disallow: "/" },
      { userAgent: "Robozilla", disallow: "/" },
      { userAgent: "Nutch", disallow: "/" },
      { userAgent: "ia_archiver", disallow: "/" },
      { userAgent: "baiduspider", disallow: "/" },
      { userAgent: "naverbot", disallow: "/" },
      { userAgent: "yeti", disallow: "/" },
      { userAgent: "yahoo-mmcrawler", disallow: "/" },
      { userAgent: "psbot", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap-index.xml`,
  };
}
