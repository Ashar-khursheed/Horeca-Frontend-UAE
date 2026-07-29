"use client";

import { useEffect, useState } from "react";

export interface CompareSpec {
  name: string;
  value: string;
}

export interface CompareProduct {
  id: number;
  name: string;
  image: string;
  url: string;
  price: number;
  salePrice?: number;
  currency?: string;
  brand?: string;
  sku?: string;
  rating?: number;
  totalReviews?: number;
  specs?: CompareSpec[];
  // Cart-relevant fields — needed to drive AddToCartWidget from a compare card.
  vendorId?: number;
  minQuantity?: number;
  isFixed?: boolean;
  quoteAvailable?: boolean;
}

export const MAX_COMPARE = 4;

const STORAGE_KEY = "horeca_compare_products";
const EVENT_NAME = "compare-products-updated";

const readList = (): CompareProduct[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeList = (list: CompareProduct[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const getCompareList = readList;

export const isInCompare = (id: number) => readList().some((p) => p.id === id);

export type AddCompareResult = "added" | "exists" | "full";

export const addToCompare = (product: CompareProduct): AddCompareResult => {
  const list = readList();
  if (list.some((p) => p.id === product.id)) return "exists";
  if (list.length >= MAX_COMPARE) return "full";
  writeList([...list, product]);
  return "added";
};

export const removeFromCompare = (id: number) => {
  writeList(readList().filter((p) => p.id !== id));
};

export const replaceInCompare = (oldId: number, product: CompareProduct) => {
  writeList(readList().map((p) => (p.id === oldId ? product : p)));
};

export const useCompareList = () => {
  const [list, setList] = useState<CompareProduct[]>([]);

  useEffect(() => {
    setList(readList());
    const sync = () => setList(readList());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return list;
};
