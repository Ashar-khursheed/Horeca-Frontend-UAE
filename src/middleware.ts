import { NextRequest, NextResponse } from "next/server";

const CUSTOMER_PROTECTED_ROUTES = ["/dashboard", "/checkout"];
const VENDOR_PROTECTED_ROUTES = ["/partner"];
const AUTH_ROUTES = [ "/forgot-password"];
const AUTH_MAX_MS = 259200 * 1000; // 72 hours
function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  response.cookies.set("login_time", "", { maxAge: 0, path: "/" });
  response.cookies.set("account_type", "", { maxAge: 0, path: "/" });
  return response;
}

// In-memory IP cache — avoids calling ip-api on every request
const ipCache = new Map<string, { country: string; expires: number }>();
const IP_CACHE_MS = 10 * 60 * 1000; // 10 minutes

async function resolveCountryCode(request: NextRequest): Promise<string> {
  // 1. CDN headers — zero latency, 100% accurate on production
  const geoCountry = request.headers.get("x-vercel-ip-country")
    ?? request.headers.get("cf-ipcountry");
  if (geoCountry && geoCountry !== "XX") return geoCountry;

  // 2. Cookie check — avoids slow API calls for returning visitors
  const cookieCountry = request.cookies.get("hc_cc")?.value;
  if (cookieCountry) return cookieCountry;

  // 3. Fallback to GeoIP by client IP (only when not localhost)
  const forwarded = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
  const userIp    = forwarded?.split(",")[0]?.trim();
  const isLocalhost = !userIp || userIp === "::1" || userIp === "127.0.0.1";

  if (!isLocalhost && userIp) {
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

  return "US";
}

function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

function isPaymentGatewayReturn(request: NextRequest): boolean {
  const q = request.nextUrl.searchParams;
  return (
    q.has("encResp") ||
    q.has("response") ||
    q.get("success") === "1" ||
    q.get("success") === "0" ||
    q.has("transaction_id") ||
    q.has("order_no") ||
    q.has("order_number")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname;
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto = (forwardedProto ?? request.nextUrl.protocol.replace(":", "")).split(",")[0]?.trim();

  // Payment gateways sometimes return to http:// while the session lives on https://
  // (separate cookies + localStorage). Upgrade before any auth check.
  if (
    pathname.startsWith("/checkout") &&
    proto === "http" &&
    !isLocalHost(hostname)
  ) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, 308);
  }

  const token        = request.cookies.get("token")?.value?.trim();
  const loginTimeStr = request.cookies.get("login_time")?.value;
  const accountType  = request.cookies.get("account_type")?.value;
  const isVendor     = accountType === "vendor";

  const loginTime    = loginTimeStr ? parseInt(loginTimeStr, 10) : null;
  const isTokenValid = !!token && !!loginTime && Date.now() - loginTime < AUTH_MAX_MS;
  const isCustomerProtected = CUSTOMER_PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isVendorProtected   = VENDOR_PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute  = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Vendor-only pages: require a valid vendor session. A logged-out visitor
  // or a customer session gets sent to the vendor login instead.
  if (isVendorProtected && (!isTokenValid || !isVendor)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("type", "vendor");
    url.searchParams.set("redirect", pathname);
    return isTokenValid ? NextResponse.redirect(url) : clearAuthCookies(NextResponse.redirect(url));
  }

  // Customer-only pages: require a valid, non-vendor session. A vendor token
  // is valid but belongs to a different account type — these pages read from
  // the customer profile/redux state, which is never populated for a vendor
  // session, so letting them through here just renders a broken half-empty
  // page. Send vendor sessions to their own dashboard instead.
  if (isCustomerProtected) {
    const paymentReturn =
      pathname.startsWith("/checkout") && isPaymentGatewayReturn(request);

    if (!isTokenValid && !paymentReturn) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname + request.nextUrl.search);
      // Do NOT clear cookies when none were sent — a CCAvenue/Touras return
      // often omits SameSite=Lax cookies; Set-Cookie max-age=0 would wipe
      // the real HTTPS session.
      const tokenExpired =
        !!token && !!loginTime && Date.now() - loginTime >= AUTH_MAX_MS;
      return tokenExpired
        ? clearAuthCookies(NextResponse.redirect(url))
        : NextResponse.redirect(url);
    }
    if (isTokenValid && isVendor) {
      return NextResponse.redirect(new URL("/partner/dashboard", request.url));
    }
  }

  if (isAuthRoute && isTokenValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Detect country and pass as request header so SSR reads it in the same request
  const countryCode   = await resolveCountryCode(request);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-country-code", countryCode);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Always update cookie when country changes (handles VPN switches)
  if (request.cookies.get("hc_cc")?.value !== countryCode) {
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






































///////////////////////////////////////////////////////////////




























// import { NextRequest, NextResponse } from "next/server";

// const PROTECTED_ROUTES = ["/dashboard", "/checkout", "/create-quotation"];
// const AUTH_ROUTES = [ "/forgot-password"];
// const AUTH_MAX_MS = 259200 * 1000; // 72 hours
// function clearAuthCookies(response: NextResponse): NextResponse {
//   response.cookies.set("token", "", { maxAge: 0, path: "/" });
//   response.cookies.set("login_time", "", { maxAge: 0, path: "/" });
//   return response;
// }

// // In-memory IP cache — avoids calling ip-api on every request
// const ipCache = new Map<string, { country: string; expires: number }>();
// const IP_CACHE_MS = 10 * 60 * 1000; // 10 minutes

// async function resolveCountryCode(request: NextRequest): Promise<string> {
//   // Vercel/Cloudflare inject geo header — zero latency, no API call needed
//   const geoCountry = request.headers.get("x-vercel-ip-country")
//     ?? request.headers.get("cf-ipcountry");
//   if (geoCountry && geoCountry !== "XX") return geoCountry;

//   // Cookie check — skips any network call on repeat visits
//   const cookieCountry = request.cookies.get("hc_cc")?.value;
//   if (cookieCountry) return cookieCountry;

//   const forwarded = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
//   const userIp    = forwarded?.split(",")[0]?.trim();

//   if (userIp) {
//     const cached = ipCache.get(userIp);
//     if (cached && Date.now() < cached.expires) return cached.country;

//     try {
//       // 400ms hard timeout — never block the request more than this
//       const controller = new AbortController();
//       const tid = setTimeout(() => controller.abort(), 400);
//       const res  = await fetch(`http://ip-api.com/json/${userIp}?fields=status,countryCode`, {
//         signal: controller.signal,
//       });
//       clearTimeout(tid);
//       const data = await res.json();
//       if (data.status === "success" && data.countryCode) {
//         ipCache.set(userIp, { country: data.countryCode, expires: Date.now() + IP_CACHE_MS });
//         return data.countryCode;
//       }
//     } catch {}
//   }

//   return "IN";
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token        = request.cookies.get("token")?.value?.trim();
//   const loginTimeStr = request.cookies.get("login_time")?.value;

//   const loginTime    = loginTimeStr ? parseInt(loginTimeStr, 10) : null;
//   const isTokenValid = !!token && !!loginTime && Date.now() - loginTime < AUTH_MAX_MS;
//   const isProtected  = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
//   const isAuthRoute  = AUTH_ROUTES.some((r) => pathname.startsWith(r));

//   if (isProtected && !isTokenValid) {
//     const url = new URL("/login", request.url);
//     url.searchParams.set("redirect", pathname);
//     return clearAuthCookies(NextResponse.redirect(url));
//   }

//   if (isAuthRoute && isTokenValid) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Detect country and pass as request header so SSR reads it in the same request
//   const countryCode   = await resolveCountryCode(request);
//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("x-country-code", countryCode);

//   const response = NextResponse.next({ request: { headers: requestHeaders } });

//   // Also set cookie so future requests skip the API call
//   if (!request.cookies.get("hc_cc")?.value) {
//     response.cookies.set("hc_cc", countryCode, { maxAge: 60 * 60 * 24 * 3, path: "/", sameSite: "lax" });
//   }

//   if (token && !isTokenValid) clearAuthCookies(response);

//   return response;
// }

// export const config = {
//   matcher: ["/((?!api|_next|_vercel|.*\\..*).*)",],
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

