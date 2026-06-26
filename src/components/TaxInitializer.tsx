"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setTaxRate, TAX_STORAGE_KEY } from "@/store/slices/tax/taxSlice";
import { getLocationData, getDefaultAddressCache } from "@/utils/locationStorage";

// Fetches tax rate based on user zip (default address → location IP fallback)
// and hydrates Redux + localStorage — same logic as checkout page tax calculation.
export default function TaxInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1. Try to load cached tax from localStorage first (instant)
    try {
      const cached = localStorage.getItem(TAX_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.combined_rate) {
          dispatch(setTaxRate(parsed));
          // Still check if zip changed vs default address below
        }
      }
    } catch {
      /* ignore */
    }

    // 2. Resolve zip + city from default address or IP location
    const defaultAddr = getDefaultAddressCache();
    const location    = getLocationData();

    const isUS =
      defaultAddr?.country?.toLowerCase().includes("united states") ||
      defaultAddr?.related_country?.name?.toLowerCase().includes("united states") ||
      location?.countryCode === "US" ||
      location?.country?.toLowerCase().includes("united states");

    if (!isUS) return; // Tax only applies for US

    const zip  = defaultAddr?.zip_code ?? location?.zip ?? "";
    const city = encodeURIComponent(defaultAddr?.city ?? location?.city ?? "");

    if (!zip) return;

    // 3. If cached zip matches current zip — no need to re-fetch
    try {
      const cached = localStorage.getItem(TAX_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.zip === zip) return;
      }
    } catch {
      /* ignore */
    }

    // 4. Fetch fresh tax rate from API
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/frontend/tax/rate?zip=${zip}&country=US&city=${city}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data?.combined_rate) return;
        localStorage.setItem(TAX_STORAGE_KEY, JSON.stringify(data));
        dispatch(setTaxRate(data));
      })
      .catch(() => {/* silently ignore */});
  }, [dispatch]);

  return null;
}
