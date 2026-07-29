"use client";

import Link from "next/link";
import { Scale, X } from "lucide-react";
import { useCompareList, removeFromCompare, MAX_COMPARE } from "@/utils/compareStorage";

export function CompareTray() {
  const list = useCompareList();

  if (list.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-white border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.15)] rounded-full pl-2 pr-2 py-2 max-w-[92vw]">
      <div className="flex -space-x-2 shrink-0">
        {list.map((p) => (
          <div
            key={p.id}
            className="relative w-9 h-9 rounded-full border-2 border-white bg-gray-50 overflow-hidden shrink-0"
          >
            {p.image && <img src={p.image} alt="" className="w-full h-full object-contain p-1" />}
            <button
              onClick={() => removeFromCompare(p.id)}
              aria-label="Remove from compare"
              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gray-700 text-white flex items-center justify-center"
            >
              <X size={8} />
            </button>
          </div>
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-500 whitespace-nowrap hidden sm:inline">
        {list.length}/{MAX_COMPARE} selected
      </span>
      <Link
        href="/compare"
        className="flex items-center gap-1.5 bg-[#186737] hover:bg-[#145c30] text-white text-xs font-bold px-3.5 py-2 rounded-full transition-colors whitespace-nowrap shrink-0"
      >
        <Scale size={13} /> Compare Now
      </Link>
    </div>
  );
}
