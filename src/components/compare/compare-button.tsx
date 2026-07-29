"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Scale, Check } from "lucide-react";
import { addToCompare, removeFromCompare, useCompareList, type CompareProduct } from "@/utils/compareStorage";

interface Props {
  product: CompareProduct;
  className?: string;
  variant?: "icon" | "button";
}

export function CompareToggleButton({ product, className = "", variant = "icon" }: Props) {
  const list = useCompareList();
  const inCompare = list.some((p) => p.id === product.id);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timeout);
  }, [toast]);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
      return;
    }
    const result = addToCompare(product);
    if (result === "full") setToast("You can compare up to 4 products only");
  };

  if (variant === "button") {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={handleClick}
          className={`w-[182px] ml-auto h-10 flex items-center justify-center gap-2 rounded-[7px] border text-sm font-bold transition-all ${
            inCompare
              ? "bg-[#186737]/5 border-[#186737] text-[#186737]"
              : "bg-white border-gray-200 text-gray-700 hover:border-[#186737] hover:text-[#186737]"
          }`}
        >
          {inCompare ? (
            <>
              <Check size={15} /> Added to Compare
            </>
          ) : (
            <>
              <Scale size={15} /> Compare Product
            </>
          )}
        </button>

        {toast && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+6px)] w-max max-w-[220px] bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-[6px] shadow-lg z-20 text-center">
            {toast}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        aria-label={inCompare ? "Remove from compare" : "Add to compare"}
        title={inCompare ? "Remove from compare" : "Add to compare"}
        className={`w-9 h-9 rounded-full border shadow-sm flex items-center justify-center transition-all ${
          inCompare ? "bg-[#186737] border-[#186737]" : "bg-white border-gray-200 hover:bg-gray-50"
        }`}
      >
        {inCompare ? (
          <Check size={16} className="text-white" />
        ) : (
          <Scale size={15} className="text-gray-400" />
        )}
      </button>

      {toast && (
        <div className="absolute top-11 right-0 w-max max-w-[190px] bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-[6px] shadow-lg z-20">
          {toast}
        </div>
      )}
    </div>
  );
}
