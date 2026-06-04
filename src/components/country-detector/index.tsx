"use client";

import { useEffect } from "react";
import { getCountryCodeClient } from "@/utils/country";

/**
 * Yeh component app mount hone par country detect karta hai
 * aur cookie + localStorage mein save karta hai.
 *
 * Middleware pehli visit pe cookie set kar deta hai,
 * lekin agar kisi wajah se miss ho jaye toh yeh backup hai.
 *
 * Usage: app/layout.tsx mein <CountryDetector /> add karo
 */
export default function CountryDetector() {
  useEffect(() => {
    getCountryCodeClient();
  }, []);

  return null;
}