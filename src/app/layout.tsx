import GlobalLayout from "@/layouts/global-layout";
import type { ApiCategory } from "@/utils/types";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import { WebVitals } from "@/components/web-vitals/web-vitals";

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

  const navData = await makeApiCallSSR<{ data: ApiCategory[] }>(
    apiUrls.NavigationAPI,
    {},
    { revalidate: 3600 },
  );
  const navItemData = navData?.data ?? [];

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} className={inter.className}>
      <head>
        <link rel="preconnect" href="https://d2dy46c7t7z5ba.cloudfront.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://d1p9kdrbe10xzz.cloudfront.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pim.thehorecastore.co" />
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
          <GlobalLayout navItemData={navItemData}>
             <WebVitals />
            {children}
          </GlobalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
