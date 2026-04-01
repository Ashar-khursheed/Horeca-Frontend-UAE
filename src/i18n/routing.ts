// import { defineRouting } from "next-intl/routing";
// import { locales, defaultLocale } from "./config";

// export const routing = defineRouting({
//   locales,
//   defaultLocale,
//   localePrefix: "as-needed", // ← "always" se "as-needed" karo
// });

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "never",
});