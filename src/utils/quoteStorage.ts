"use client";

import { useEffect, useState } from "react";

export const QUOTE_STORAGE_KEY = "horeca_quote_products";
const QUOTE_NEWEST_FIRST_KEY = "horeca_quote_newest_first";
const EVENT_NAME = "quote-products-updated";

export interface StoredQuoteProduct {
  id: number;
  name: string;
  brand: string;
  sku: string;
  image: string;
  warranty: string;
  deliveryDays: string;
  shippingCost: number;
  price: number;
  qty: number;
  vendorId?: number;
  accessoryItemIds?: number[];
  /** Full listing / PDP payload so create-quotation can use every field. */
  product?: unknown;
}

const readList = (): StoredQuoteProduct[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeList = (list: StoredQuoteProduct[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const getQuoteList = (): StoredQuoteProduct[] => {
  const list = readList();
  if (typeof window === "undefined" || !list.length) return list;
  if (localStorage.getItem(QUOTE_NEWEST_FIRST_KEY) === "1") return list;
  const newestFirst = [...list].reverse();
  writeList(newestFirst);
  localStorage.setItem(QUOTE_NEWEST_FIRST_KEY, "1");
  return newestFirst;
};

export const isInQuote = (id: number) => readList().some((p) => p.id === id);

export type AddQuoteResult = "added" | "exists";

export const addToQuote = (item: StoredQuoteProduct): AddQuoteResult => {
  const list = readList();
  if (list.some((p) => p.id === item.id)) return "exists";
  writeList([item, ...list]);
  return "added";
};

export const removeFromQuote = (id: number) => {
  writeList(readList().filter((p) => p.id !== id));
};

export const updateQuoteQty = (id: number, qty: number) => {
  writeList(
    readList().map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)),
  );
};

export const setQuoteList = (list: StoredQuoteProduct[]) => {
  writeList(list);
};

export const clearQuoteList = () => {
  writeList([]);
};

export const useQuoteList = () => {
  const [list, setList] = useState<StoredQuoteProduct[]>([]);

  useEffect(() => {
    setList(getQuoteList());
    const sync = () => setList(getQuoteList());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return list;
};
