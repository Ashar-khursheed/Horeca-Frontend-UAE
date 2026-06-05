import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { getLocationData } from "@/utils/locationStorage";

const CART_KEY = "horeca_cart";

/**
 * After login/register: push guest cart items to server, then clear localStorage.
 * Call this right after a successful auth response (token already set).
 */
export async function syncGuestCartAfterLogin(): Promise<void> {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return;

  let items: {
    productId: number;
    vendorId: number;
    quantity: number;
    shippingCharge: number;
    accessoryItemIds: number[];
  }[] = [];

  try {
    items = JSON.parse(raw);
  } catch {
    localStorage.removeItem(CART_KEY);
    return;
  }

  if (!items?.length) {
    localStorage.removeItem(CART_KEY);
    return;
  }

  const location = getLocationData();
  const country  = location?.country ?? "";

  const products = items.map((item) => ({
    product_id:         item.productId,
    vendor_id:          item.vendorId,
    quantity:           item.quantity,
    shipping_charge:    item.shippingCharge ?? 0,
    accessory_item_ids: item.accessoryItemIds ?? [],
  }));

  try {
    await makeApiRequest(apiUrls.CART_ADD_MULTIPLE, {
      method: "POST",
      data: { country, products },
    });
  } catch {
    // Silently ignore — user is logged in, server cart is source of truth
  }

  // Always clear guest localStorage cart after login
  localStorage.removeItem(CART_KEY);
}
