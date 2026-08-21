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
  if ((currency ?? "AED").trim().toUpperCase() === "AED") {
    return <DirhamSymbol size={size} weight={weight} aria-label="AED" fontSize={fontsize || "25px"} style={{
      marginRight:"3px"
    }} />;
  }
  return <>{currency} </>;
}
