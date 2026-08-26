"use client";
import { useEffect } from "react";
import { getAuthCookieDomain } from "@/utils/canonical-origin";

// ── 24 hours ke baad band karna ho toh is line ko comment kar do ──
const CLEAR_VERSION = "2026-06-26-v1";
const COOKIE_KEY = "_hc_cleared";
const STORAGE_KEY = "_hc_cleared";

function isPaymentReturnUrl() {
  if (typeof window === "undefined") return false;
  return /encResp=|success=|transaction_id=|order_no=|order_number=|response=/.test(
    window.location.search,
  );
}

export default function ForceClear() {
  useEffect(() => {
    const getCookie = (name: string) =>
      document.cookie
        .split(";")
        .find((c) => c.trim().startsWith(name + "="))
        ?.split("=")[1];

    // localStorage marker survives gateway returns where cookies are not sent.
    if (localStorage.getItem(STORAGE_KEY) === CLEAR_VERSION) return;
    if (getCookie(COOKIE_KEY) === CLEAR_VERSION) {
      localStorage.setItem(STORAGE_KEY, CLEAR_VERSION);
      return;
    }

    // Never wipe an active session — missing _hc_cleared cookie on a CCAvenue
    // / Touras return would otherwise clear token + cart and force a reload.
    if (localStorage.getItem("token") || isPaymentReturnUrl()) {
      localStorage.setItem(STORAGE_KEY, CLEAR_VERSION);
      return;
    }

    localStorage.clear();
    sessionStorage.clear();

    const parentDomain = getAuthCookieDomain(window.location.hostname);
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      if (parentDomain) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${parentDomain};`;
      }
    });

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    const domainPart = parentDomain ? `; domain=${parentDomain}` : "";
    document.cookie = `${COOKIE_KEY}=${CLEAR_VERSION}; expires=${expires}; path=/${domainPart}`;
    localStorage.setItem(STORAGE_KEY, CLEAR_VERSION);

    window.location.reload();
  }, []);

  return null;
}
