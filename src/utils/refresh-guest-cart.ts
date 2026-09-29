import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import type { CartItem } from "@/store/slices/cart/cartSlice";

const CART_KEY = "horeca_cart";
const SFL_KEY = "horeca_save_for_later";
const CART_CC_KEY = "horeca_cart_cc";

type GuestSaveItem = {
  productId: number;
  quantity: number;
  vendorId: number;
  rawProduct?: Record<string, unknown>;
};

function isLoggedIn(): boolean {
  try {
    const token = localStorage.getItem("token");
    return !!token?.trim().replace(/^["']|["']$/g, "");
  } catch {
    return false;
  }
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function lastPathSegment(value: string): string {
  return String(value)
    .split("?")[0]
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean)
    .pop() ?? "";
}

function slugCandidates(item: {
  url?: string;
  rawProduct?: Record<string, any>;
}): string[] {
  const raw = item.rawProduct ?? {};
  const values = [raw.seo_url, raw.slug, raw.url, item.url, raw.full_slug];
  const slugs = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    const last = lastPathSegment(String(value));
    if (last) slugs.add(decodeURIComponent(last));
  }
  return [...slugs];
}

function toNum(value: number | string | undefined): number | undefined {
  if (value == null) return undefined;
  return typeof value === "string" ? parseFloat(value) : value;
}

function resolveCurrencySymbol(
  currency: string | { name?: string; symbol?: string; title?: string } | undefined,
): string {
  if (!currency) return "AED";
  if (typeof currency === "string") return currency;
  return currency.symbol ?? currency.title ?? currency.name ?? "AED";
}

function livePrices(product: Record<string, any>) {
  const supplier0 = product.best_supplier ?? product.suppliers?.[0];
  const originalPrice =
    product.original_price ??
    product.price ??
    product.best_price ??
    toNum(supplier0?.price) ??
    0;
  const salePrice = product.sale_price ?? toNum(supplier0?.sale_price) ?? 0;
  const hasSale = salePrice > 0 && salePrice !== originalPrice;
  const price = hasSale ? salePrice : originalPrice;
  return {
    price: Number(price) || 0,
    originalPrice: Number(originalPrice) || 0,
    hasSale,
    currencySymbol: resolveCurrencySymbol(product.currency),
  };
}

function mapAccessories(
  product: Record<string, any>,
  ids: number[],
): { id: number; name: string; price: number }[] {
  const rawAcc = product.accessories ?? product.product_accessories ?? [];
  return rawAcc
    .flatMap((acc: any) => acc.accessory_item ?? acc.accessory_types ?? [])
    .filter((accItem: any) => ids.includes(accItem.id))
    .map((accItem: any) => ({
      id: accItem.id,
      name:
        typeof accItem.name === "string"
          ? accItem.name
          : (accItem.name?.en ?? accItem.name?.ar ?? ""),
      price: Number(accItem.price ?? 0) || 0,
    }));
}

function unwrapProduct(res: unknown): Record<string, any> | null {
  if (!res || typeof res !== "object") return null;
  const body = res as { data?: Record<string, any> };
  const product = body.data ?? (res as Record<string, any>);
  if (!product || typeof product !== "object") return null;
  if (product.id == null && product.price == null && !product.currency) return null;
  return product;
}

async function fetchLiveProduct(slug: string, countryCode: string) {
  const res = await makeApiRequest<unknown>(
    apiUrls.PRODUCT_DETAIL(slug),
    { params: { force_country: countryCode } },
  );
  return unwrapProduct(res);
}

async function fetchLiveProductFromItem(
  item: { url?: string; rawProduct?: Record<string, any> },
  countryCode: string,
) {
  for (const slug of slugCandidates(item)) {
    try {
      const product = await fetchLiveProduct(slug, countryCode);
      if (product) return product;
    } catch {
      // try the next slug candidate
    }
  }
  return null;
}

function applyLiveCartPrice(item: CartItem, product: Record<string, any>): CartItem {
  const { price, originalPrice, hasSale, currencySymbol } = livePrices(product);
  const accessoryIds =
    item.accessoryItemIds?.length
      ? item.accessoryItemIds
      : (item.selectedAccessories ?? []).map((acc) => acc.id);
  const mappedAccessories = mapAccessories(product, accessoryIds);
  const selectedAccessories =
    mappedAccessories.length > 0 || !item.selectedAccessories?.length
      ? mappedAccessories
      : item.selectedAccessories;
  const subTotal = price * (item.quantity || 1);
  return {
    ...item,
    price,
    originalPrice,
    hasSale,
    currencySymbol,
    subTotal,
    totalPrice: subTotal + (item.shippingCharge || 0),
    selectedAccessories,
    rawProduct: product,
  };
}

function stampGuestCartCountry(countryCode: string) {
  try {
    localStorage.setItem(CART_CC_KEY, countryCode.toUpperCase());
  } catch {
    // ignore
  }
}

export function getGuestCartCountry(): string | null {
  try {
    return localStorage.getItem(CART_CC_KEY);
  } catch {
    return null;
  }
}

async function refreshGuestCartItems(countryCode: string): Promise<boolean> {
  const items = readJson<CartItem[]>(CART_KEY);
  if (!Array.isArray(items) || items.length === 0) return false;

  let changed = false;
  const updated = await Promise.all(
    items.map(async (item) => {
      const product = await fetchLiveProductFromItem(item, countryCode);
      if (!product) return item;
      changed = true;
      return applyLiveCartPrice(item, product);
    }),
  );

  localStorage.setItem(CART_KEY, JSON.stringify(updated));
  return changed;
}

async function refreshGuestSaveForLater(countryCode: string): Promise<boolean> {
  const items = readJson<GuestSaveItem[]>(SFL_KEY);
  if (!Array.isArray(items) || items.length === 0) return false;

  let changed = false;
  const updated = await Promise.all(
    items.map(async (item) => {
      const product = await fetchLiveProductFromItem(
        { rawProduct: item.rawProduct as Record<string, any> },
        countryCode,
      );
      if (!product) return item;
      changed = true;
      return { ...item, rawProduct: product };
    }),
  );

  localStorage.setItem(SFL_KEY, JSON.stringify(updated));
  return changed;
}

function hasGuestCartData(): boolean {
  const cart = readJson<CartItem[]>(CART_KEY);
  const sfl = readJson<GuestSaveItem[]>(SFL_KEY);
  return (Array.isArray(cart) && cart.length > 0) || (Array.isArray(sfl) && sfl.length > 0);
}

/** Guest cart/SFL live in localStorage — refetch product prices for the new country. */
export async function refreshGuestCartPrices(countryCode: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (isLoggedIn()) return;
  if (!countryCode) return;
  const [cartChanged, sflChanged] = await Promise.all([
    refreshGuestCartItems(countryCode),
    refreshGuestSaveForLater(countryCode),
  ]);
  if (cartChanged || sflChanged) stampGuestCartCountry(countryCode);
}

/** After reload: update stale guest cart if it still has the previous country. */
export async function syncGuestCartPricesIfNeeded(countryCode: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (isLoggedIn() || !countryCode) return false;
  if (!hasGuestCartData()) {
    stampGuestCartCountry(countryCode);
    return false;
  }
  const stamped = getGuestCartCountry();
  if (stamped && stamped.toUpperCase() === countryCode.toUpperCase()) return false;
  await refreshGuestCartPrices(countryCode);
  return true;
}
