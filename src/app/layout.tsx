import GlobalLayout from "@/layouts/global-layout";
import { LocationData } from "@/store/slices/location/locationSlice";
import type { CustomerProfile } from "@/store/slices/my-profile/profileSlice";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

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

  const [locationData, profileRes] = await Promise.all([
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
  ]);

  const initialProfile = profileRes?.customer ?? null;

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} className={inter.className}>
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        precedence="default"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        precedence="default"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />

      <body suppressHydrationWarning>
        <NextTopLoader
          color="#186737"
          height={4}
          speed={200}
          easing="ease"
          showSpinner={false}
        />
        <NextIntlClientProvider messages={messages}>
          <GlobalLayout locationData={locationData} initialProfile={initialProfile}>
            {children}
          </GlobalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
