"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/slices/auth/authSlice";

const AUTH_MAX_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function AutoLogout() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loginTimeStr = localStorage.getItem("login_time");
    if (!loginTimeStr) return;

    const loginTime = parseInt(loginTimeStr, 10);
    if (isNaN(loginTime)) return;

    const elapsed = Date.now() - loginTime;

    const performLogout = () => {
      dispatch(logoutUser()).finally(() => {
        window.location.href = "/login";
      });
    };

    if (elapsed >= AUTH_MAX_MS) {
      performLogout();
      return;
    }

    // Schedule logout at the exact moment the 24h window expires
    const remaining = AUTH_MAX_MS - elapsed;
    const timer = setTimeout(performLogout, remaining);
    return () => clearTimeout(timer);
  }, [dispatch]);

  return null;
}
