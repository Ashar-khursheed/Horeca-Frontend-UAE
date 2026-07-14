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


// import { NextConfig } from 'next';
// import createNextIntlPlugin from 'next-intl/plugin';

// const nextConfig: NextConfig = {
//   compress: true,
//   images: {
//     remotePatterns: [{ protocol: 'https', hostname: '**' }],
//     minimumCacheTTL: 60 * 60 * 24 * 30,
//     formats: ['image/avif', 'image/webp'],
//   },
//   experimental: {
//     optimizePackageImports: [
//       'lucide-react',
//       'swiper',
//       '@radix-ui/react-dialog',
//       '@radix-ui/react-dropdown-menu',
//       '@radix-ui/react-select',
//       '@radix-ui/react-accordion',
//       '@radix-ui/react-tabs',
//       '@radix-ui/react-popover',
//       '@radix-ui/react-tooltip',
//       '@radix-ui/react-sheet',
//       'framer-motion',
//       'date-fns',
//     ],
//   },

// };

// const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
// export default withNextIntl(nextConfig);

import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
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
  // Yeh block add kiya hai background proxy ke liye
  async rewrites() {
    return [
      {
        source: '/production/:path*',
        destination: 'https://d1p9kdrbe10xzz.cloudfront.net/production/:path*',
      },
      {
        source: '/categories/:path*',
        destination: 'https://d1p9kdrbe10xzz.cloudfront.net/categories/:path*',
      },
      // Agar brands ke logos ya blogs ke images ke koi specific paths hain, to unhe bhi yahan add kar sakte hain:
      {
        source: '/brands/logos/:path*',
        destination: 'https://d1p9kdrbe10xzz.cloudfront.net/brands/logos/:path*',
      },
    ];
  },

};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);
