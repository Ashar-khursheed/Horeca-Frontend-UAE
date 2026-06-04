import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/checkout", "/create-quotation"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const AUTH_MAX_MS = 24 * 60 * 60 * 1000; // 24 hours
function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  response.cookies.set("login_time", "", { maxAge: 0, path: "/" });
  return response;
}

async function resolveCountryCode(request: NextRequest): Promise<string> {
  // Cookie already set by client-side — fastest path, no API call
  const fromCookie = request.cookies.get("hc_cc")?.value;
  if (fromCookie) return fromCookie;

  // Get user's real IP from proxy headers
  const forwarded = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
  const userIp    = forwarded?.split(",")[0]?.trim();

  if (userIp) {
    try {
      // ip-api.com supports IP in URL path — works correctly from server
      const res  = await fetch(`http://ip-api.com/json/${userIp}?fields=status,countryCode`);
      const data = await res.json();
      if (data.status === "success" && data.countryCode) return data.countryCode;
    } catch {}
  }

  return "IN";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token        = request.cookies.get("token")?.value?.trim();
  const loginTimeStr = request.cookies.get("login_time")?.value;

  const loginTime    = loginTimeStr ? parseInt(loginTimeStr, 10) : null;
  const isTokenValid = !!token && !!loginTime && Date.now() - loginTime < AUTH_MAX_MS;
  const isProtected  = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute  = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected && !isTokenValid) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return clearAuthCookies(NextResponse.redirect(url));
  }

  if (isAuthRoute && isTokenValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Detect country and pass as request header so SSR reads it in the same request
  const countryCode   = await resolveCountryCode(request);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-country-code", countryCode);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Also set cookie so future requests skip the API call
  if (!request.cookies.get("hc_cc")?.value) {
    response.cookies.set("hc_cc", countryCode, { maxAge: 3600, path: "/", sameSite: "lax" });
  }

  if (token && !isTokenValid) clearAuthCookies(response);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)",],
};

// export const config = {
//   matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
// };
// // // import createMiddleware from 'next-intl/middleware';
// // // import { routing } from './src/i18n/routing';
// // // import { NextRequest } from 'next/server';

// // // const intlMiddleware = createMiddleware(routing);

// // // export default function middleware(request: NextRequest) {
// // //   console.log('🔥 Middleware running! Path:', request.nextUrl.pathname);
// // //   return intlMiddleware(request);
// // // }

// // // export const config = {
// // //   matcher: ['/', '/(ar|en)/:path*', '/((?!_next|api|_vercel|.*\\..*).*)'  ]
// // // };

// // import createMiddleware from 'next-intl/middleware';
// // import { routing } from './src/i18n/routing';
// // import { NextRequest } from 'next/server';

// // const intlMiddleware = createMiddleware(routing);

// // export default function middleware(request: NextRequest) {
// //   const pathname = request.nextUrl.pathname;
  
// //   // /en ko / pe redirect karo
// //   if (pathname.startsWith('/en')) {
// //     const newPath = pathname.replace('/en', '') || '/';
// //     return Response.redirect(new URL(newPath, request.url));
// //   }
  
// //   return intlMiddleware(request);
// // }

// // export const config = {
// //   matcher: ['/', '/(ar|en)/:path*', '/((?!_next|api|_vercel|.*\\..*).*)'  ]
// // };


// // src/middleware.ts
// import createMiddleware from "next-intl/middleware";

// export default createMiddleware({
//   // Supported locales
//   locales: ["en", "ar"],

//   // Default locale
//   defaultLocale: "en",

//   // URL prefix strategy:
//   // "always"  → /en/...  /ar/...
//   // "as-needed" → / (default locale no prefix), /ar/...
//   localePrefix: "as-needed" // Yeh ensure karta hai /en/ prefix rahe
// });

// export const config = {
//   // Middleware sirf in paths pe chalega
//   // API routes, static files, _next ko SKIP karo
//   matcher: [
//     // Match all pathnames except:
//     "/((?!api|_next|_vercel|.*\\..*).*)",
//   ],
// };

// import createMiddleware from "next-intl/middleware";
// import { NextRequest } from "next/server";

// const intlMiddleware = createMiddleware({
//   locales: ["en", "ar"],
//   defaultLocale: "en",
//   localePrefix: "never", // Koi bhi /en/ ya /ar/ prefix nahi
// });

// export default function middleware(request: NextRequest) {
//   return intlMiddleware(request);
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next|_vercel|.*\\..*).*)",
//   ],
// };





// import { NextRequest, NextResponse } from "next/server";

// export default function middleware(request: NextRequest) {
//   return NextResponse.next(); // Kuch mat karo, bas pass karo
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next|_vercel|.*\\..*).*)",
//   ],
// };

// import { NextRequest, NextResponse } from 'next/server';

// export default function middleware(_request: NextRequest) {
//   return NextResponse.next();
// }

// export const config = {
//   matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
// };

