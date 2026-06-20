import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/checkout", "/create-quotation"];
const AUTH_ROUTES = [ "/forgot-password"];
const AUTH_MAX_MS = 24 * 60 * 60 * 1000; // 24 hours
function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  response.cookies.set("login_time", "", { maxAge: 0, path: "/" });
  return response;
}

// In-memory IP cache — avoids calling ip-api on every request
const ipCache = new Map<string, { country: string; expires: number }>();
const IP_CACHE_MS = 10 * 60 * 1000; // 10 minutes

async function resolveCountryCode(request: NextRequest): Promise<string> {
  // Vercel/Cloudflare inject geo header — zero latency, no API call needed
  const geoCountry = request.headers.get("x-vercel-ip-country")
    ?? request.headers.get("cf-ipcountry");
  if (geoCountry && geoCountry !== "XX") return geoCountry;

  // Cookie check — skips any network call on repeat visits
  const cookieCountry = request.cookies.get("hc_cc")?.value;
  if (cookieCountry) return cookieCountry;

  const forwarded = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
  const userIp    = forwarded?.split(",")[0]?.trim();

  if (userIp) {
    const cached = ipCache.get(userIp);
    if (cached && Date.now() < cached.expires) return cached.country;

    try {
      // 400ms hard timeout — never block the request more than this
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 400);
      const res  = await fetch(`http://ip-api.com/json/${userIp}?fields=status,countryCode`, {
        signal: controller.signal,
      });
      clearTimeout(tid);
      const data = await res.json();
      if (data.status === "success" && data.countryCode) {
        ipCache.set(userIp, { country: data.countryCode, expires: Date.now() + IP_CACHE_MS });
        return data.countryCode;
      }
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
    response.cookies.set("hc_cc", countryCode, { maxAge: 60 * 60 * 24 * 3, path: "/", sameSite: "lax" });
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

