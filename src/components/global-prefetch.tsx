"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GlobalPrefetch() {
  const router = useRouter();

  useEffect(() => {
    const prefetched = new Set<string>();

    const handleMouseOver = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      try {
        const url = new URL(anchor.href, window.location.origin);
        if (
          url.origin !== window.location.origin ||
          url.pathname === window.location.pathname ||
          prefetched.has(url.pathname)
        ) return;

        prefetched.add(url.pathname);
        router.prefetch(url.pathname);
      } catch {
        // ignore
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    return () => document.removeEventListener("mouseover", handleMouseOver);
  }, [router]);

  return null;
}
