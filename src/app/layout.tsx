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
import { parseScriptHtml } from "@/utils/parse-script-html";

interface CustomScript {
  id: number;
  title: string;
  script_code: string;
  placement: string;
  is_active: boolean;
}

interface CustomScriptsResponse {
  success: boolean;
  data: {
    head_top: CustomScript[];
    head_bottom: CustomScript[];
    body_top: CustomScript[];
    body_bottom: CustomScript[];
  };
}

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
  const [navData, searchData, customScriptsData] = await Promise.all([
    makeApiCallSSR<{ data: ApiCategory[] }>(
      apiUrls.NavigationAPI,
      {},
      { revalidate: 3600 },
    ),
    makeApiCallSSR<SearchSuggestions>(
      apiUrls.SEARCH,
      { query: "true", page: 1, length: 5 },
      { revalidate: 3600 },
    ),
    makeApiCallSSR<CustomScriptsResponse>(
      apiUrls.CUSTOM_SCRIPTS,
      {},
      { revalidate: 3600 },
    ),
  ]);
  const navItemData = navData?.data ?? [];
  const searchDataRes = searchData;
  const scripts = customScriptsData?.data;

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} className={inter.className}>
      <head>
        {scripts?.head_top.filter((s) => s.is_active).map((s, i) => parseScriptHtml(s.script_code, i))}
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
        {scripts?.head_bottom.filter((s) => s.is_active).map((s, i) => parseScriptHtml(s.script_code, i))}
      </head>

      <body suppressHydrationWarning>
        {scripts?.body_top.filter((s) => s.is_active).map((s, i) => parseScriptHtml(s.script_code, i))}
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
        {scripts?.body_bottom.filter((s) => s.is_active).map((s, i) => parseScriptHtml(s.script_code, i))}
      </body>
    </html>
  );
}
