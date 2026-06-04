"use client";
import { useState, useEffect } from "react";

export interface LocationData {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

const LOCATION_KEY   = "location";
const LOCATION_EVENT = "hc_location_updated";

export function getLocationData(): LocationData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    return raw ? (JSON.parse(raw) as LocationData) : null;
  } catch { return null; }
}

export function setLocationData(data: LocationData): void {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(LOCATION_EVENT));
}

// React hook — reactive, updates when localStorage changes
export function useLocationData(): LocationData | null {
  const [data, setData] = useState<LocationData | null>(() => getLocationData());

  useEffect(() => {
    const update = () => setData(getLocationData());
    window.addEventListener(LOCATION_EVENT, update);
    window.addEventListener("storage",      update);
    return () => {
      window.removeEventListener(LOCATION_EVENT, update);
      window.removeEventListener("storage",      update);
    };
  }, []);

  return data;
}
