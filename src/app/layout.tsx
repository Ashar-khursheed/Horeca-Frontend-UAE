import GlobalLayout from "@/layouts/global-layout";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
// opens sans font 
import "./globals.css";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <GlobalLayout> {children}</GlobalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
