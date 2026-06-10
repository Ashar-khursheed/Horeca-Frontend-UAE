"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocationData } from "@/utils/locationStorage";
import { setTaxRate, TAX_STORAGE_KEY, type TaxRateData } from "@/store/slices/tax/taxSlice";
import type { AppDispatch } from "@/store/store";

const TAX_API_BASE = "https://pim.thehorecastore.co/api/frontend/tax/rate";
const DEFAULT_ADDRESS_KEY = "hc_default_address";

interface DefaultAddress {
  id: number;
  customer_id: number;
  type: string;
  address: string;
  city: string;
  zip_code: string;
  country: string;
  state: string;
  is_default: boolean;
  related_country?: { id: number; name: string };
}

// Returns parsed address only if all required fields are present
function getDefaultAddress(): DefaultAddress | null {
  try {
    const raw = localStorage.getItem(DEFAULT_ADDRESS_KEY);
    if (!raw) return null;
    const addr = JSON.parse(raw) as Partial<DefaultAddress>;
    if (addr.id && addr.city && addr.zip_code && addr.country && addr.state) {
      return addr as DefaultAddress;
    }
    return null;
  } catch {
    return null;
  }
}

export default function TaxInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocationData();
  const fetchedZip = useRef<string | null>(null);

  useEffect(() => {
    // Only run for US locations
    if (!location || location.countryCode !== "US") return;

    // Require hc_default_address with all required fields before calling tax API
    const defaultAddress = getDefaultAddress();
    if (!defaultAddress) return;

    const zip  = defaultAddress.zip_code;
    const city = defaultAddress.city;

    // Check localStorage — reuse if zip matches (same location, no re-fetch needed)
    const cached = localStorage.getItem(TAX_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as TaxRateData;
      if (parsed.zip === zip) {
        dispatch(setTaxRate(parsed));
        return;
      }
    }

    // Prevent duplicate calls for the same zip in a single session
    if (fetchedZip.current === zip) return;
    fetchedZip.current = zip;

    const url = `${TAX_API_BASE}?zip=${encodeURIComponent(zip)}&country=US&city=${encodeURIComponent(city)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data: TaxRateData) => {
        localStorage.setItem(TAX_STORAGE_KEY, JSON.stringify(data));
        dispatch(setTaxRate(data));
      })
      .catch(() => {
        fetchedZip.current = null; // allow retry on next mount if fetch failed
      });
  }, [location, dispatch]);

  return null;
}
