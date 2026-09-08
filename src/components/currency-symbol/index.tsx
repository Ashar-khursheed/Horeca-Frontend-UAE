"use client";

import { DirhamSymbol } from "dirham/react";

type DirhamWeight =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

type CurrencySymbolProps = {
  currency?: string | null;
  size?: number | string;
  weight?: DirhamWeight;
  fontsize?: string;
};

export function CurrencySymbol({
  currency,
  size = "1em",
  weight = "regular",
  fontsize
}: CurrencySymbolProps) {
  const raw = (currency ?? "").trim();
  const upper = raw.toUpperCase();
  if (upper === "INR" || upper === "RS" || upper === "RS." || raw === "₹") {
    return <span aria-label="INR" style={{ marginRight: "3px" }}>₹</span>;
  }
  if (!raw || upper === "AED") {
    return <DirhamSymbol size={size} weight={weight} aria-label="AED" fontSize={fontsize || "25px"} style={{
      marginRight:"3px"
    }} />;
  }
  return <>{currency} </>;
}
