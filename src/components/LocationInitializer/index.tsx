"use client";
import { useEffect } from "react";
import { getLocationData, setLocationData } from "@/utils/locationStorage";

export default function LocationInitializer() {
  useEffect(() => {
    // Already cached — skip API call
    if (getLocationData()) return;

    fetch("https://pim.thehorecastore.co/api/frontend/location")
      .then((res) => res.json())
      .then((data) => { setLocationData(data); })
      .catch(() => {});
  }, []);

  return null;
}
