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

// ── Default customer address cache ─────────────────────────────────────────────
const DEFAULT_ADDR_KEY = "hc_default_address";

export interface DefaultAddressCache {
  id: number;
  customer_id: number;
  type: string | null;
  address: string;
  address2: string | null;
  city_id: number;
  state_id: number | null;
  country_id: number;
  zip_code: string | null;
  is_default: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  country: string;
  state: string | null;
  city: string;
  related_country: { id: number; name: string } | null;
  related_state: { id: number; name: string } | null;
  related_city: { id: number; name: string } | null;
}

export function getDefaultAddressCache(): DefaultAddressCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DEFAULT_ADDR_KEY);
    return raw ? (JSON.parse(raw) as DefaultAddressCache) : null;
  } catch { return null; }
}

export function setDefaultAddressCache(addr: DefaultAddressCache): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEFAULT_ADDR_KEY, JSON.stringify(addr));
}

export function clearDefaultAddressCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEFAULT_ADDR_KEY);
}

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
