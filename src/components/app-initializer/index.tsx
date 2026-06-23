"use client";

import { fetchCountryByName, resetCountry } from "@/store/slices/country/countrySlice";
import { fetchProfile, setLoading } from "@/store/slices/my-profile/profileSlice";
import { logoutUser } from "@/store/slices/auth/authSlice";
import { AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getLocationData, setLocationData } from "@/utils/locationStorage";
import { makeApiRequest } from "@/apis/axios-instance";
import { FeaturedCategory } from "@/utils/types";
import { apiUrls } from "@/apis/api-endpoint";
import FeaturedProducts from "@/features/home/feature-product";
import { useRouter } from "next/navigation";

const AUTH_MAX_MS    = 259200 * 1000; // 72 hours
const LOCATION_API   = "https://pim.thehorecastore.co/api/frontend/location";
const LOCATION_EVENT = "hc_location_updated";

export default function AppInitializer() {
    const router   = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [products,      setProducts]      = useState<FeaturedCategory[]>([]);
  const [brandProducts, setBrandProducts] = useState<FeaturedCategory[]>([]);

  // Auto-logout: check 24h expiry on mount and schedule timer for remainder
  useEffect(() => {
    const loginTimeStr = localStorage.getItem("login_time");
    if (!loginTimeStr) return;
    const loginTime = parseInt(loginTimeStr, 10);
    if (isNaN(loginTime)) return;
    const elapsed = Date.now() - loginTime;
    const performLogout = () => {
      dispatch(logoutUser()).finally(() => { window.location.href = "/login"; });
    };
    if (elapsed >= AUTH_MAX_MS) { performLogout(); return; }
    const timer = setTimeout(performLogout, AUTH_MAX_MS - elapsed);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Location fetch (single call) — sets localStorage, cookie, dispatches country
  useEffect(() => {
    const DETECT_KEY = "hc_detect_time";
    const DETECT_TTL = 10 * 1000;

    const currentCookie = document.cookie
      .split(";").find(c => c.trim().startsWith("hc_cc="))?.split("=")[1];
    const lastDetect = localStorage.getItem(DETECT_KEY);
    const isCacheValid = lastDetect && Date.now() - Number(lastDetect) < DETECT_TTL;

    if (isCacheValid && currentCookie) {
      const cached = getLocationData();
      if (cached?.country) dispatch(fetchCountryByName(cached.country));
      return;
    }

    fetch(LOCATION_API)
      .then((r) => r.json())
      .then(async (data) => {
        setLocationData(data);
        if (data.country) dispatch(fetchCountryByName(data.country));

        if (data.status === "success" && data.countryCode) {
          const detected = data.countryCode;
          const now = Date.now().toString();
          localStorage.setItem(DETECT_KEY, now);
          localStorage.setItem("hc_country_code", detected);
          localStorage.setItem("hc_country_code_time", now);
          document.cookie = `hc_cc=${detected}; path=/; max-age=3600; SameSite=Lax`;

          if (detected !== "US") {
            localStorage.removeItem("horeca_tax_rate");
          }

          if (detected !== currentCookie) {
            dispatch(resetCountry());
            try {
              const [fp, fbp] = await Promise.all([
                makeApiRequest<{ data: FeaturedCategory[] }>(apiUrls.FEATURED_PRODUCTS),
                makeApiRequest<{ data: FeaturedCategory[] }>(apiUrls.FEATURED_BRAND_PRODUCTS),
              ]);
              if (fp?.data) setProducts(fp.data);
              if (fbp?.data) setBrandProducts(fbp.data);
            } catch {
              router.refresh();
            }
          }
        }
      })
      .catch(() => {});
  }, [dispatch, router]);

  // Re-trigger country fetch when location updates (e.g. after VPN change)
  useEffect(() => {
    const handler = () => {
      const loc = getLocationData();
      if (loc?.country) dispatch(fetchCountryByName(loc.country));
    };
    window.addEventListener(LOCATION_EVENT, handler);
    return () => window.removeEventListener(LOCATION_EVENT, handler);
  }, [dispatch]);

  // Profile: only fetch if token exists
  useEffect(() => {
    const token = localStorage.getItem("token")?.trim();
    if (token) {
      dispatch(fetchProfile());
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);


  return null;
}
