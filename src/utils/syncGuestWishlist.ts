import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

const WISHLIST_KEY = "horeca_wishlist";

/**
 * After login/register: push guest wishlist items to server, then clear localStorage.
 * Call this right after a successful auth API response (token already set in cookie/localStorage).
 */
export async function syncGuestWishlistAfterLogin(): Promise<void> {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem(WISHLIST_KEY);
  if (!raw) return;

  let items: { productId: number }[] = [];
  try {
    items = JSON.parse(raw);
  } catch {
    localStorage.removeItem(WISHLIST_KEY);
    return;
  }

  if (!items?.length) {
    localStorage.removeItem(WISHLIST_KEY);
    return;
  }

  const products = items.map((item) => ({ product_id: item.productId }));

  try {
    await makeApiRequest(apiUrls.WISHLIST_ADD_MULTIPLE, {
      method: "POST",
      data: { products },
    });
  } catch {
    // Silently ignore — user is now logged in, server wishlist is source of truth
  }

  // Always clear guest localStorage after login regardless of API result
  localStorage.removeItem(WISHLIST_KEY);
}
