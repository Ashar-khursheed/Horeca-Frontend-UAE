"use client";

import { restorePaymentAuthCookies } from "@/utils/payment-auth";
import { useLayoutEffect } from "react";

/** Runs before paint so checkout APIs still have a session after CCAvenue/Touras return. */
export default function PaymentAuthRestore() {
  useLayoutEffect(() => {
    restorePaymentAuthCookies();
  }, []);
  return null;
}
