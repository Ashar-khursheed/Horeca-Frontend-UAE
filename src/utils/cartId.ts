import { useEffect, useState } from "react";

const CART_ID_KEY = "cart_session_id";

function generateCartId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `cart_${timestamp}_${random}`;
}

export function getCartId(): string {
  if (typeof window === "undefined") return generateCartId();

  let id = localStorage.getItem(CART_ID_KEY);
  if (!id) {
    id = generateCartId();
    localStorage.setItem(CART_ID_KEY, id);
  }
  return id;
}

export function resetCartId(): string {
  const id = generateCartId();
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_ID_KEY, id);
  }
  return id;
}

// The cart id lives in localStorage, so it's only knowable on the client.
// Calling getCartId() directly during render produces a different value on
// the server (fresh random id) vs. the client (existing localStorage id),
// which React flags as a hydration mismatch. This hook renders "" on the
// first pass (matching SSR) and fills in the real id after mount.
export function useCartId(): string {
  const [cartId, setCartId] = useState("");
  useEffect(() => {
    setCartId(getCartId());
  }, []);
  return cartId;
}
