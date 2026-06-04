"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import { setTaxRate, TAX_STORAGE_KEY, type TaxRateData } from "@/store/slices/tax/taxSlice";
import type { AppDispatch } from "@/store/store";

const TAX_API_BASE = "https://pim.thehorecastore.co/api/frontend/tax/rate";

export default function TaxInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useAppSelector((s) => s.location.data);
  const fetchedZip = useRef<string | null>(null);

  useEffect(() => {
    // Only run for US locations
    if (!location || location.countryCode !== "US") return;

    const { city, zip } = location;

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
