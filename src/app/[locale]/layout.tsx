import type { Metadata } from "next";
import "./globals.css";
import GlobalLayout from "@/layouts/global-layout";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";


export const metadata: Metadata = {
  title: "HorecaStore",
  description: "Best Hospitality Supplies",
};

// ✅ Static params for SSG
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  // ✅ Arabic = RTL, English = LTR
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body >
        <NextIntlClientProvider messages={messages}>
          <GlobalLayout>{children}</GlobalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}