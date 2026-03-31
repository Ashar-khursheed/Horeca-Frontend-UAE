// // import createMiddleware from 'next-intl/middleware';
// // import { routing } from './src/i18n/routing';
// // import { NextRequest } from 'next/server';

// // const intlMiddleware = createMiddleware(routing);

// // export default function middleware(request: NextRequest) {
// //   console.log('🔥 Middleware running! Path:', request.nextUrl.pathname);
// //   return intlMiddleware(request);
// // }

// // export const config = {
// //   matcher: ['/', '/(ar|en)/:path*', '/((?!_next|api|_vercel|.*\\..*).*)'  ]
// // };

// import createMiddleware from 'next-intl/middleware';
// import { routing } from './src/i18n/routing';
// import { NextRequest } from 'next/server';

// const intlMiddleware = createMiddleware(routing);

// export default function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;
  
//   // /en ko / pe redirect karo
//   if (pathname.startsWith('/en')) {
//     const newPath = pathname.replace('/en', '') || '/';
//     return Response.redirect(new URL(newPath, request.url));
//   }
  
//   return intlMiddleware(request);
// }

// export const config = {
//   matcher: ['/', '/(ar|en)/:path*', '/((?!_next|api|_vercel|.*\\..*).*)'  ]
// };


// src/middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // Supported locales
  locales: ["en", "ar"],

  // Default locale
  defaultLocale: "en",

  // URL prefix strategy:
  // "always"  → /en/...  /ar/...
  // "as-needed" → / (default locale no prefix), /ar/...
  localePrefix: "always", // Yeh ensure karta hai /en/ prefix rahe
});

export const config = {
  // Middleware sirf in paths pe chalega
  // API routes, static files, _next ko SKIP karo
  matcher: [
    // Match all pathnames except:
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};