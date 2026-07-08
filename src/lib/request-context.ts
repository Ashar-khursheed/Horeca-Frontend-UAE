import { cache } from "react";
import { cookies, headers } from "next/headers";

export const getRequestContext = cache(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return {
    countryCode:
      headerStore.get("x-country-code") ??
      cookieStore.get("hc_cc")?.value ??
      "US",

    token: cookieStore.get("token")?.value,

    pathname: headerStore.get("x-pathname") ?? "",
  };
});