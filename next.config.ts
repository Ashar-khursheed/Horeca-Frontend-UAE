// // import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
// //   reactCompiler: true,
// // };

// // export default nextConfig;

// import { NextConfig } from 'next';
// import createNextIntlPlugin from 'next-intl/plugin';

// const nextConfig: NextConfig = {
//       output: 'standalone',
// };

// const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts'); // ← path do!
// export default withNextIntl(nextConfig);


import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      (process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_STRIPE_LIVE_PUBLISHABLE_KEY
        : process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY) ||
      "",
  },
  compress: true,
  // Bots matching this get <title>, canonical and robots inside <head>
  // instead of streamed later into <body>. Next's default list leaves out
  // Googlebot itself; this is that default list plus the main search and AI
  // crawlers.
  htmlLimitedBots:
    /Googlebot|bingbot|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|PerplexityBot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ['image/avif', 'image/webp'],
    // CloudFront/S3 serves product & category images with
    // Content-Type: binary/octet-stream instead of image/*, which makes
    // Next's Image Optimizer reject them with 400. Browsers render the
    // images fine via content-sniffing, so skip the optimizer entirely.
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // HTTPS only for this host (no includeSubDomains/preload: other
          // subdomains are not audited).
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'swiper',
      '@stripe/stripe-js',
      '@stripe/react-stripe-js',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-accordion',
      '@radix-ui/react-tabs',
      '@radix-ui/react-popover',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-sheet',
      'framer-motion',
      'date-fns',
    ],
  },
  async redirects() {
    return [
      {
        // Payment gateway sends declined payments back to /payment/decline,
        // but the actual page lives at /payment-decline. Query params
        // (order_no, message, status, etc.) are passed through automatically.
        source: '/payment/decline',
        destination: '/payment-decline',
        permanent: false,
      },
    ];
  },

};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);