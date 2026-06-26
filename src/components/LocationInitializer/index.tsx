"use client";
import { useEffect } from "react";
import { setLocationData } from "@/utils/locationStorage";

export default function LocationInitializer() {
  useEffect(() => {
    // // Already cached — skip API call
    // if (getLocationData()) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}frontend/location`)
      .then((res) => res.json())
      .then((data) => { setLocationData(data); })
      .catch(() => {});
  }, []);

  return null;
}
