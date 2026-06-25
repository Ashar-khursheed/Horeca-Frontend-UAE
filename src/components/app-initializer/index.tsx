"use client";

import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import { fetchProfile, setLoading } from "@/store/slices/my-profile/profileSlice";
import { logoutUser } from "@/store/slices/auth/authSlice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { getLocationData, setLocationData } from "@/utils/locationStorage";

const AUTH_MAX_MS    = 24 * 60 * 60 * 1000;
const LOCATION_API   = "https://pim.thehorecastore.co/api/frontend/location";
const LOCATION_EVENT = "hc_location_updated";
const DETECT_KEY     = "hc_detect_time";
const DETECT_TTL     = 10 * 60 * 1000; // 10 minutes cache

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

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

  // Location: detect and cache (with a 10-minute TTL) to avoid redundant requests on every mount
  useEffect(() => {
    const isLocalhost = typeof window !== "undefined" && 
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const cached = getLocationData();
    const detectTime = localStorage.getItem(DETECT_KEY);
    const currentCookie = document.cookie
      .split(";").find(c => c.trim().startsWith("hc_cc="))?.split("=")[1];

    // Bypass cache on localhost so developers toggling VPN see changes instantly on refresh
    const cacheValid = !isLocalhost && cached && detectTime && (Date.now() - Number(detectTime) < DETECT_TTL);

    if (cacheValid && cached && currentCookie === cached.countryCode) {
      if (cached.country) {
        dispatch(fetchCountryByName(cached.country));
      }
      return;
    }

    // Cache is expired or missing. Fetch fresh location.
    fetch(LOCATION_API)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "success" && data.countryCode) {
          const hasChanged = currentCookie !== data.countryCode;

          setLocationData(data);
          localStorage.setItem(DETECT_KEY, Date.now().toString());
          localStorage.setItem("hc_country_code", data.countryCode);
          localStorage.setItem("hc_country_code_time", Date.now().toString());
          document.cookie = `hc_cc=${data.countryCode}; path=/; max-age=3600; SameSite=Lax`;
          
          if (data.country) {
            dispatch(fetchCountryByName(data.country));
          }

          if (hasChanged) {
            router.refresh();
          }
        }
      })
      .catch(() => {});
  }, [dispatch, router]);

  // Re-trigger country fetch when location updates (e.g. after manual change or VPN change)
  useEffect(() => {
    const handler = () => {
      const loc = getLocationData();
      if (loc?.country) {
        dispatch(fetchCountryByName(loc.country));
      }
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
