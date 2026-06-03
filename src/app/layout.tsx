import GlobalLayout from "@/layouts/global-layout";
import { LocationData } from "@/store/slices/location/locationSlice";
import type { CustomerProfile } from "@/store/slices/my-profile/profileSlice";
import type { ApiCategory } from "@/utils/types";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
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

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value?.trim();

  const [locationData, profileRes, navData] = await Promise.all([
    makeApiCallSSR<LocationData>(
      "https://pim.thehorecastore.co/api/frontend/location",
      {},
      { revalidate: 3600 },
    ),
    token
      ? makeApiCallSSR<{ success: boolean; customer: CustomerProfile }>(
          apiUrls.GETMYPROFILE,
          {},
          { revalidate: 0, headers: { Authorization: `Bearer ${token}` } },
        )
      : null,
    makeApiCallSSR<{ data: ApiCategory[] }>(
      apiUrls.NavigationAPI,
      {},
      { revalidate: 3600 },
    ),
  ]);

  const initialProfile = profileRes?.customer ?? null;
  const navItemData = navData?.data ?? [];
 console.log(
  "Nav Size:",
  (JSON.stringify(navItemData).length / 1024).toFixed(2),
  "KB"
);
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
          <GlobalLayout locationData={locationData} initialProfile={initialProfile} navItemData={navItemData} >
             <WebVitals />
            {children}
          </GlobalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
