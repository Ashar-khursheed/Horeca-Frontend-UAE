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

/**
 * getCartId() reads localStorage and is non-deterministic on the server
 * (fabricates a new id every SSR pass). Calling it directly during render
 * causes a hydration mismatch on the cart href. This hook returns "" on
 * the server and on the client's first paint (matching SSR), then resolves
 * the real id post-mount — a normal post-hydration update, not a mismatch.
 */
export function useCartId(): string {
  const [id, setId] = useState("");
  useEffect(() => {
    setId(getCartId());
  }, []);
  return id;
}
