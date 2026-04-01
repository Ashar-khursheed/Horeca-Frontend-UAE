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
  // ❌ output: 'export'  ← Bilkul hata do
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);