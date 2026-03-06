// import createMiddleware from 'next-intl/middleware';
// import { routing } from './src/i18n/routing';
// import { NextRequest } from 'next/server';

// const intlMiddleware = createMiddleware(routing);

// export default function middleware(request: NextRequest) {
//   console.log('🔥 Middleware running! Path:', request.nextUrl.pathname);
//   return intlMiddleware(request);
// }

// export const config = {
//   matcher: ['/', '/(ar|en)/:path*', '/((?!_next|api|_vercel|.*\\..*).*)'  ]
// };

import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // /en ko / pe redirect karo
  if (pathname.startsWith('/en')) {
    const newPath = pathname.replace('/en', '') || '/';
    return Response.redirect(new URL(newPath, request.url));
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!_next|api|_vercel|.*\\..*).*)'  ]
};