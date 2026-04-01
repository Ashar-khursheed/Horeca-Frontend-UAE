// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;

import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
      output: 'export',
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts'); // ← path do!
export default withNextIntl(nextConfig);
