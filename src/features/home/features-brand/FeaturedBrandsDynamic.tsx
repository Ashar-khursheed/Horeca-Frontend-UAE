"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { fetchCountryByName, resetCountry } from "@/store/slices/country/countrySlice";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { FeaturedBrands } from "./index";
import type { FeaturedCategory } from "@/utils/types";

const DETECT_KEY = "hc_detect_time";
const DETECT_TTL = 10 * 1000; // 10 seconds

/**
 * Thin client wrapper around FeaturedBrands that:
 * 1. Renders the SSR-fetched initial products immediately (no loading flash).
 * 2. On mount, checks whether the visitor's real country differs from the
 *    server-detected one and swaps in country-correct products if needed.
 * 3. Updates Redux country state and the hc_cc cookie for subsequent pages.
 *
 * Keeping this logic here lets the parent Home component stay a server
 * component — only these ~50 lines ship in the client bundle for this feature.
 */
export function FeaturedBrandsDynamic({
  initialProducts,
}: {
  initialProducts: FeaturedCategory[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const router   = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentCookie = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("hc_cc="))
      ?.split("=")[1];

    const lastDetect  = localStorage.getItem(DETECT_KEY);
    const isCacheValid =
      !!lastDetect && Date.now() - Number(lastDetect) < DETECT_TTL;

    if (isCacheValid && currentCookie) return;

    fetch("https://pim.thehorecastore.co/api/frontend/location")
      .then((r) => r.json())
      .then(async (data) => {
        if (data.status !== "success" || !data.countryCode) return;

        const detected = data.countryCode as string;
        const now      = Date.now().toString();

        localStorage.setItem(DETECT_KEY,             now);
        localStorage.setItem("hc_country_code",      detected);
        localStorage.setItem("hc_country_code_time", now);
        document.cookie = `hc_cc=${detected}; path=/; max-age=3600; SameSite=Lax`;

        if (detected === currentCookie) return;

        dispatch(resetCountry());
        dispatch(fetchCountryByName(data.country));

        try {
          const fbp = await makeApiRequest<{ data: FeaturedCategory[] }>(
            apiUrls.FEATURED_BRAND_PRODUCTS,
          );
          if (fbp?.data) setProducts(fbp.data);
        } catch {
          router.refresh();
        }
      })
      .catch(() => {});
  // dispatch and router are stable references — safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <FeaturedBrands products={products} />;
}
