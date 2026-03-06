import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { Locale } from "./config";
import { headers } from "next/headers";
import { cookies } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Cookie se lo — NEXT_LOCALE=ar hai!
  if (!locale) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
    if (cookieLocale && routing.locales.includes(cookieLocale as Locale)) {
      locale = cookieLocale as Locale;
    }
  }

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  console.log('✅ Final locale:', locale);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});