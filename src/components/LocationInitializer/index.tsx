"use client";

import { setLocation, LocationData } from "@/store/slices/location/locationSlice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export type { LocationData };

export default function LocationInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const cached = sessionStorage.getItem("location");
    if (cached) {
      dispatch(setLocation(JSON.parse(cached) as LocationData));
      return;
    }

    fetch("https://pim.thehorecastore.co/api/frontend/location")
      .then((res) => res.json())
      .then((data: LocationData) => {
        sessionStorage.setItem("location", JSON.stringify(data));
        dispatch(setLocation(data));
      })
      .catch(() => {});
  }, [dispatch]);

  return null;
}
