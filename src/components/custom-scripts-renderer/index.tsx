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
    setMounted(true);
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
