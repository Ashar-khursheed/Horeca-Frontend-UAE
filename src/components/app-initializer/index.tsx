"use client";

import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import { setLocation } from "@/store/slices/location/locationSlice";
import type { LocationData } from "@/store/slices/location/locationSlice";
import { setLoading, setProfile } from "@/store/slices/my-profile/profileSlice";
import type { CustomerProfile } from "@/store/slices/my-profile/profileSlice";
import { logoutUser } from "@/store/slices/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AUTH_MAX_MS = 24 * 60 * 60 * 1000; // 24 hours

interface Props {
  initialProfile?: CustomerProfile | null;
  locationData?: LocationData | null;
}

export default function AppInitializer({ initialProfile, locationData }: Props) {
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

  // Location: hydrate Redux from SSR data and cache in sessionStorage
  useEffect(() => {
    if (locationData) {
      dispatch(setLocation(locationData));
      sessionStorage.setItem("location", JSON.stringify(locationData));
    }
  }, [dispatch, locationData]);

  // Profile: hydrate Redux from SSR data — no client fetch, no loader
  useEffect(() => {
    if (initialProfile) {
      dispatch(setProfile(initialProfile));
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch, initialProfile]);

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
