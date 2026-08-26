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
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ['image/avif', 'image/webp'],
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

};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);