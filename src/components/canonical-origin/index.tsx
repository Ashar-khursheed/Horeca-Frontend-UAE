"use client";

import { useLayoutEffect } from "react";
import {
  buildCanonicalUrl,
  isLocalHost,
} from "@/utils/canonical-origin";

/** Client fallback if middleware did not already collapse www / http. */
export default function CanonicalOrigin() {
  useLayoutEffect(() => {
    const hostname = window.location.hostname;
    if (isLocalHost(hostname)) return;

    const canonical = buildCanonicalUrl({
      href: window.location.href,
      hostname,
      protocol: window.location.protocol.replace(":", ""),
    });
    if (!canonical) return;
    if (canonical.href === window.location.href) return;
    window.location.replace(canonical.href);
  }, []);

  return null;
}
