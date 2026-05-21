"use client";

import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import { fetchProfile, setLoading } from "@/store/slices/my-profile/profileSlice";
import type { LocationData } from "@/store/slices/location/locationSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const locationFromRedux = useSelector((s: RootState) => s.location.data);

  // Auth: fetch profile if token exists
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(fetchProfile());
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Country: read from sessionStorage first (instant), then fallback to Redux location
  useEffect(() => {
    const cached = sessionStorage.getItem("location");
    if (cached) {
      const data = JSON.parse(cached) as LocationData;
      if (data?.country) {
        dispatch(fetchCountryByName(data.country));
        return;
      }
    }
    // Fallback: sessionStorage not yet populated, wait for Redux location
    if (locationFromRedux?.country) {
      dispatch(fetchCountryByName(locationFromRedux.country));
    }
  }, [locationFromRedux?.country, dispatch]);

  return null;
}
