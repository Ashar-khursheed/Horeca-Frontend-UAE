import GlobalLayout from "@/layouts/global-layout";
import { LocationData } from "@/store/slices/location/locationSlice";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
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

  let locationData: LocationData | null = null;
  try {
    const res = await fetch("https://pim.thehorecastore.co/api/frontend/location", {
      next: { revalidate: 3600 },
    });
    if (res.ok) locationData = await res.json();
  } catch {
    // non-critical
  }

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
          <GlobalLayout locationData={locationData}>
            {children}
          </GlobalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
