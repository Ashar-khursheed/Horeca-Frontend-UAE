"use client";

import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import { fetchProfile, setLoading } from "@/store/slices/my-profile/profileSlice";
import { logoutUser } from "@/store/slices/auth/authSlice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getLocationData, setLocationData } from "@/utils/locationStorage";

const AUTH_MAX_MS    = 24 * 60 * 60 * 1000;
const LOCATION_API   = "https://pim.thehorecastore.co/api/frontend/location";
const LOCATION_EVENT = "hc_location_updated";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();

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

  // Location: localStorage cache first, then API fetch
  useEffect(() => {
    const cached = getLocationData();
    if (cached) {
      if (cached.country) dispatch(fetchCountryByName(cached.country));
      return;
    }
    fetch(LOCATION_API)
      .then((r) => r.json())
      .then((data) => {
        setLocationData(data);
        if (data.country) dispatch(fetchCountryByName(data.country));
      })
      .catch(() => {});
  }, [dispatch]);

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
