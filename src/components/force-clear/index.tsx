"use client";
import { useEffect } from "react";

// ── 24 hours ke baad band karna ho toh is line ko comment kar do ──
const CLEAR_VERSION = "2026-06-26-v1";

export default function ForceClear() {
  useEffect(() => {
    const COOKIE_KEY = "_hc_cleared";

    const getCookie = (name: string) =>
      document.cookie
        .split(";")
        .find((c) => c.trim().startsWith(name + "="))
        ?.split("=")[1];

    if (getCookie(COOKIE_KEY) === CLEAR_VERSION) return;

    // Clear localStorage + sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    });

    // Marker cookie set karo — 24 hours ke liye
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE_KEY}=${CLEAR_VERSION}; expires=${expires}; path=/;`;

    window.location.reload();
  }, []);

  return null;
}
