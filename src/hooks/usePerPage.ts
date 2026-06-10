"use client";

import { useEffect, useState } from "react";

export function usePerPage(): number {
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1536) setPerPage(5);       // big monitor (2xl+)
      else if (w >= 1280) setPerPage(4);  // laptop (xl)
      else if (w >= 1024) setPerPage(2);  // lg — matches lg:grid-cols-2
      else if (w >= 768) setPerPage(3);   // tablet (md)
      else setPerPage(2);                 // mobile
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perPage;
}
