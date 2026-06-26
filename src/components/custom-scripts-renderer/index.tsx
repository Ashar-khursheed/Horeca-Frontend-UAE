"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface CustomScript {
  id: number;
  title: string;
  script_code: string;
  placement: string;
  is_active: boolean;
}

interface CustomScriptsRendererProps {
  scripts: CustomScript[];
}

function injectScript(code: string, placement: "head" | "body") {
  const container =
    placement === "head" ? document.head : document.body;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = code.trim();

  wrapper.querySelectorAll("script").forEach((oldScript) => {
    const newScript = document.createElement("script");

    Array.from(oldScript.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value);
    });

    if (oldScript.src) {
      newScript.async = oldScript.async ?? true;
    } else {
      newScript.textContent = oldScript.textContent;
    }

    container.appendChild(newScript);
  });
}

export default function CustomScriptsRenderer({ scripts }: CustomScriptsRendererProps) {
  const pathname = usePathname();

  useEffect(() => {
    const schedule = (fn: () => void) => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(fn, { timeout: 1500 });
      } else {
        setTimeout(fn, 800);
      }
    };

    const run = () => {
      scripts.forEach((s) => {
        if (!s.is_active) return;

        const code = (s.script_code || "").toLowerCase();
        const isPaymentScript =
          code.includes("squarecdn.com") ||
          code.includes("staxpayments.com") ||
          code.includes("staxjs") ||
          code.includes("square.js");

        if (isPaymentScript) {
          const isCheckoutOrPaymentPage =
            pathname.startsWith("/checkout") ||
            pathname.startsWith("/payment");
          if (!isCheckoutOrPaymentPage) return;
        }

        const placement = s.placement?.includes("head") ? "head" : "body";
        injectScript(s.script_code, placement);
      });
    };

    if (document.readyState === "complete") {
      schedule(run);
    } else {
      window.addEventListener("load", () => schedule(run), { once: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
