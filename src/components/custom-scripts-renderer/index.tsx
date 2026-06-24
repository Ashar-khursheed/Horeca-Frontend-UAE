"use client";

import { useEffect, useState } from "react";
import { parseScriptHtml } from "@/utils/parse-script-html";
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

export default function CustomScriptsRenderer({ scripts }: CustomScriptsRendererProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const scheduleScriptMounting = () => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(() => {
          setMounted(true);
        }, { timeout: 1500 });
      } else {
        setTimeout(() => {
          setMounted(true);
        }, 800);
      }
    };

    if (document.readyState === "complete") {
      scheduleScriptMounting();
    } else {
      window.addEventListener("load", scheduleScriptMounting, { once: true });
      return () => window.removeEventListener("load", scheduleScriptMounting);
    }
  }, []);

  if (!mounted) return null;

  const filteredScripts = scripts.filter((s) => {
    if (!s.is_active) return false;

    const code = (s.script_code || "").toLowerCase();
    
    // Check if the script belongs to a payment gateway or billing captcha
    const isPaymentScript = 
      code.includes("squarecdn.com") || 
      code.includes("staxpayments.com") || 
      code.includes("staxjs") || 
      code.includes("square.js");

    if (isPaymentScript) {
      const isCheckoutOrPaymentPage = 
        pathname.startsWith("/checkout") || 
        pathname.startsWith("/payment");
      return isCheckoutOrPaymentPage;
    }

    return true;
  });

  return (
    <>
      {filteredScripts.map((s, i) => parseScriptHtml(s.script_code, i))}
    </>
  );
}
