// import { NextRequest, NextResponse } from "next/server";

// const PROTECTED_ROUTES = ["/dashboard", "/checkout", "/create-quotation"];
// const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
// const AUTH_MAX_MS = 24 * 60 * 60 * 1000; // 24 hours

// function clearAuthCookies(response: NextResponse): NextResponse {
//   response.cookies.set("token", "", { maxAge: 0, path: "/" });
//   response.cookies.set("login_time", "", { maxAge: 0, path: "/" });
//   return response;
// }

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("token")?.value?.trim();
//   const loginTimeStr = request.cookies.get("login_time")?.value;

//   // Token is valid only if login_time exists and is within 24 hours
//   const loginTime = loginTimeStr ? parseInt(loginTimeStr, 10) : null;
//   const isTokenValid =
//     !!token && !!loginTime && Date.now() - loginTime < AUTH_MAX_MS;

//   const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
//   const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

//   // Protected route: no valid token → redirect to login and clear stale cookies
//   if (isProtected && !isTokenValid) {
//     const url = new URL("/login", request.url);
//     url.searchParams.set("redirect", pathname);
//     return clearAuthCookies(NextResponse.redirect(url));
//   }

//   // Auth route: valid token exists → redirect to home
//   if (isAuthRoute && isTokenValid) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Stale/orphan token with no login_time → clear it so future requests are clean
//   if (token && !isTokenValid) {
//     return clearAuthCookies(NextResponse.next());
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/checkout",
//     "/create-quotation",
//     // "/login",
//     // "/register",
//     // "/forgot-password",
//   ],
//   // matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
// };

// // export const config = {
// //   matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
// // };
// // // // import createMiddleware from 'next-intl/middleware';
// // // // import { routing } from './src/i18n/routing';
// // // // import { NextRequest } from 'next/server';

// // // // const intlMiddleware = createMiddleware(routing);

// // // // export default function middleware(request: NextRequest) {
// // // //   console.log('🔥 Middleware running! Path:', request.nextUrl.pathname);
// // // //   return intlMiddleware(request);
// // // // }

// // // // export const config = {
// // // //   matcher: ['/', '/(ar|en)/:path*', '/((?!_next|api|_vercel|.*\\..*).*)'  ]
// // // // };

// // // import createMiddleware from 'next-intl/middleware';
// // // import { routing } from './src/i18n/routing';
// // // import { NextRequest } from 'next/server';

// // // const intlMiddleware = createMiddleware(routing);

// // // export default function middleware(request: NextRequest) {
// // //   const pathname = request.nextUrl.pathname;
  
// // //   // /en ko / pe redirect karo
// // //   if (pathname.startsWith('/en')) {
// // //     const newPath = pathname.replace('/en', '') || '/';
// // //     return Response.redirect(new URL(newPath, request.url));
// // //   }
  
// // //   return intlMiddleware(request);
// // // }

// // // export const config = {
// // //   matcher: ['/', '/(ar|en)/:path*', '/((?!_next|api|_vercel|.*\\..*).*)'  ]
// // // };


// // // src/middleware.ts
// // import createMiddleware from "next-intl/middleware";

// // export default createMiddleware({
// //   // Supported locales
// //   locales: ["en", "ar"],

// //   // Default locale
// //   defaultLocale: "en",

// //   // URL prefix strategy:
// //   // "always"  → /en/...  /ar/...
// //   // "as-needed" → / (default locale no prefix), /ar/...
// //   localePrefix: "as-needed" // Yeh ensure karta hai /en/ prefix rahe
// // });

// // export const config = {
// //   // Middleware sirf in paths pe chalega
// //   // API routes, static files, _next ko SKIP karo
// //   matcher: [
// //     // Match all pathnames except:
// //     "/((?!api|_next|_vercel|.*\\..*).*)",
// //   ],
// // };

// // import createMiddleware from "next-intl/middleware";
// // import { NextRequest } from "next/server";

// // const intlMiddleware = createMiddleware({
// //   locales: ["en", "ar"],
// //   defaultLocale: "en",
// //   localePrefix: "never", // Koi bhi /en/ ya /ar/ prefix nahi
// // });

// // export default function middleware(request: NextRequest) {
// //   return intlMiddleware(request);
// // }

// // export const config = {
// //   matcher: [
// //     "/((?!api|_next|_vercel|.*\\..*).*)",
// //   ],
// // };





// // import { NextRequest, NextResponse } from "next/server";

// // export default function middleware(request: NextRequest) {
// //   return NextResponse.next(); // Kuch mat karo, bas pass karo
// // }

// // export const config = {
// //   matcher: [
// //     "/((?!api|_next|_vercel|.*\\..*).*)",
// //   ],
// // };

// // import { NextRequest, NextResponse } from 'next/server';

// // export default function middleware(_request: NextRequest) {
// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
// // };




import { NextRequest, NextResponse } from "next/server";

// ─── Config ───────────────────────────────────────────────────────────────────

const PROTECTED_ROUTES = ["/dashboard", "/checkout", "/create-quotation"];
const AUTH_ROUTES      = ["/login", "/register", "/forgot-password"];
const AUTH_MAX_MS      = 24 * 60 * 60 * 1000; // 24 hours

const GEO_API        = "https://pim.thehorecastore.co/api/frontend/location";
const CC_COOKIE_KEY  = "hc_country_code";
const CC_COOKIE_MINS = 60; // 1 hour
const CC_FALLBACK    = "AE";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set("token",      "", { maxAge: 0, path: "/" });
  response.cookies.set("login_time", "", { maxAge: 0, path: "/" });
  return response;
}

async function detectCountry(request: NextRequest): Promise<string> {
  try {
    const forwarded =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip");
    const userIp = forwarded?.split(",")[0]?.trim();

    const geoHeaders: Record<string, string> = {};
    if (userIp) geoHeaders["X-Forwarded-For"] = userIp;

    const res  = await fetch(GEO_API, { cache: "no-store", headers: geoHeaders });
    const data = await res.json();

    if (data.status === "success" && data.countryCode) {
      console.log("[Middleware] Country detected:", data.countryCode, "| IP:", userIp);
      return data.countryCode;
    }
  } catch {
    // GEO API fail → fallback
  }
  return CC_FALLBACK;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Auth logic ─────────────────────────────────────────────────────────

  const token        = request.cookies.get("token")?.value?.trim();
  const loginTimeStr = request.cookies.get("login_time")?.value;
  const loginTime    = loginTimeStr ? parseInt(loginTimeStr, 10) : null;
  const isTokenValid =
    !!token && !!loginTime && Date.now() - loginTime < AUTH_MAX_MS;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Protected route: valid token nahi → login redirect + stale cookies clear
  if (isProtected && !isTokenValid) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    const redirectRes = NextResponse.redirect(url);
    return clearAuthCookies(redirectRes);
  }

  // Auth route: already logged in → home redirect
  if (isAuthRoute && isTokenValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Stale/orphan token → clear cookies, continue
  if (token && !isTokenValid) {
    const nextRes = NextResponse.next();
    return clearAuthCookies(nextRes);
  }

  // ── 2. Country cookie logic ───────────────────────────────────────────────

  const response = NextResponse.next();

  const existingCountry = request.cookies.get(CC_COOKIE_KEY)?.value;

  if (!existingCountry) {
    // Pehli visit: GEO API se detect karo aur cookie set karo
    const countryCode = await detectCountry(request);
    response.cookies.set(CC_COOKIE_KEY, countryCode, {
      maxAge:   CC_COOKIE_MINS * 60,
      path:     "/",
      sameSite: "lax",
      httpOnly: false, // client-side bhi read kar sake
    });
    console.log("[Middleware] Country cookie set:", countryCode);
  }

  return response;
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    // Protected routes — auth check zaroori
    "/dashboard/:path*",
    "/checkout",
    "/create-quotation",

    // Auth routes — logged-in user ko redirect karo
    "/login",
    "/register",
    "/forgot-password",

    // Baaki saari routes — country cookie detection ke liye
    // (static files, _next, images, fonts, etc. skip)
    "/((?!_next/static|_next/image|api|favicon|robots|sitemap|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$).*)",
  ],
};