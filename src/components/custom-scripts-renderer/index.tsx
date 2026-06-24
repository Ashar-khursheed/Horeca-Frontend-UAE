"use client";

import { useEffect, useState } from "react";
import { parseScriptHtml } from "@/utils/parse-script-html";

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

  return (
    <>
      {scripts
        .filter((s) => s.is_active)
        .map((s, i) => parseScriptHtml(s.script_code, i))}
    </>
  );
}
