import { apiUrls } from "@/apis/api-endpoint";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import GlobalLayout from "@/layouts/global-layout";
import type { ApiCategory, SearchSuggestions } from "@/utils/types";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { WebVitals } from "@/components/web-vitals/web-vitals";
import "./globals.css";
import CountryDetector from "@/components/country-detector";
import GlobalPrefetch from "@/components/global-prefetch";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isRTL = locale === "ar";
  const isUS = process.env.NEXT_PUBLIC_REGION === "US";
  const [navData, searchData] = await Promise.all([
    makeApiCallSSR<{ data: ApiCategory[] }>(
      apiUrls.NavigationAPI,
      {},
      { revalidate: 0 },
    ),
    makeApiCallSSR<SearchSuggestions>(
      apiUrls.SEARCH,
      { query: "true", page: 1, length: 5 },
      { revalidate: 0 },
    ),
  ]);
  const navItemData = navData?.data ?? [];
  const searchDataRes = searchData;

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} className={inter.className}>
      <head>
        <link
          rel="preconnect"
          href="https://d2dy46c7t7z5ba.cloudfront.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://d1p9kdrbe10xzz.cloudfront.net"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://pim.thehorecastore.co" />
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </head>

      <body suppressHydrationWarning>
        <NextTopLoader
          color="#186737"
          height={4}
          speed={200}
          easing="ease"
          showSpinner={false}
        />
        <NextIntlClientProvider messages={messages}>
          <GlobalLayout navItemData={navItemData} searchData={searchDataRes}>
            <WebVitals />
            <CountryDetector />
            <GlobalPrefetch />
            {children}
          </GlobalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
