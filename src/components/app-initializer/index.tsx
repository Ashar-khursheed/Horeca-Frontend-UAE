"use client";

import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import type { LocationData } from "@/store/slices/location/locationSlice";
import { fetchProfile, setLoading } from "@/store/slices/my-profile/profileSlice";
import { logoutUser } from "@/store/slices/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AUTH_MAX_MS = 24 * 60 * 60 * 1000; // 24 hours

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
      dispatch(logoutUser()).finally(() => {
        window.location.href = "/login";
      });
    };

    if (elapsed >= AUTH_MAX_MS) {
      performLogout();
      return;
    }

    const timer = setTimeout(performLogout, AUTH_MAX_MS - elapsed);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Profile: fetch if token exists in sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(fetchProfile());
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Country: sessionStorage first, fallback to Redux location
  useEffect(() => {
    const cached = sessionStorage.getItem("location");
    if (cached) {
      const data = JSON.parse(cached) as LocationData;
      if (data?.country) {
        dispatch(fetchCountryByName(data.country));
        return;
      }
    }
    if (locationFromRedux?.country) {
      dispatch(fetchCountryByName(locationFromRedux.country));
    }
  }, [locationFromRedux?.country, dispatch]);

  return null;
}
