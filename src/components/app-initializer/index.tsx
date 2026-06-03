"use client";

import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import { setLocation } from "@/store/slices/location/locationSlice";
import type { LocationData } from "@/store/slices/location/locationSlice";
import { fetchProfile } from "@/store/slices/my-profile/profileSlice";
import { logoutUser } from "@/store/slices/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AUTH_MAX_MS = 24 * 60 * 60 * 1000;
const LOCATION_API = "https://pim.thehorecastore.co/api/frontend/location";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const locationFromRedux = useSelector((s: RootState) => s.location.data);

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

  // Location: sessionStorage cache first, then API fetch
  useEffect(() => {
    const cached = sessionStorage.getItem("location");
    if (cached) {
      try {
        dispatch(setLocation(JSON.parse(cached) as LocationData));
        return;
      } catch {}
    }
    fetch(LOCATION_API)
      .then((r) => r.json())
      .then((data: LocationData) => {
        dispatch(setLocation(data));
        sessionStorage.setItem("location", JSON.stringify(data));
      })
      .catch(() => {});
  }, [dispatch]);

  // Profile: CSR fetch — token is read by axios interceptors
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Country: derive from Redux location once available
  useEffect(() => {
    if (locationFromRedux?.country) {
      dispatch(fetchCountryByName(locationFromRedux.country));
    }
  }, [locationFromRedux?.country, dispatch]);

  return null;
}
