import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/site-url";

export default function robots(): MetadataRoute.Robots {
  // Staging pe sab bots block karo
  // if (process.env.NEXT_PUBLIC_IS_STAGING === "true") {
  //   return { rules: { userAgent: "*", disallow: "/" } };
  // }

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/*.css$", "/*.js$", "/static/", "/assets/", "/images/", "/media/", "/fonts/"],
        disallow: [
          "/admin/", "/backend/", "/dashboard/", "/wpm", "/wpm@",
          "/login_with_shop", "/services/login_with_shop",
          "/account/", "/my-account/", "/login/", "/register/", "/wishlist/",
          "/cart/", "/carts", "/checkout/", "/orders/", "/payment/",
          "/cgi-bin/", "/tmp/", "/private/", "/scripts/", "/test/", "/staging/",
          "/compare/", "/tracking/", "/*.atom",
          "/cdn/shop/files/", "/meta.json",
        ],
      },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "googlebot-image", allow: "/" },
      { userAgent: "Googlebot-News", allow: "/" },
      { userAgent: "Googlebot-Video", allow: "/" },
      { userAgent: "googlebot-mobile", allow: "/" },
      { userAgent: "Googlebot-Smartphone", allow: "/" },
      { userAgent: "Google-InspectionTool", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ChatGPT-User/2.0", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "claude-web", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "LinkedInBot", allow: "/" },
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
      { userAgent: "yahoo-blogs/v3.9", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap-index.xml`,
  };
}
