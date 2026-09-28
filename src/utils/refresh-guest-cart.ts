import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import type { CartItem } from "@/store/slices/cart/cartSlice";

const CART_KEY = "horeca_cart";
const SFL_KEY = "horeca_save_for_later";

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
  return String(value).split("?")[0].replace(/\/+$/, "").split("/").filter(Boolean).pop() ?? "";
}

function productSlug(item: {
  url?: string;
  rawProduct?: { slug?: string; full_slug?: string; url?: string };
}): string {
  const fromProduct =
    item.rawProduct?.url ?? item.url ?? item.rawProduct?.slug ?? item.rawProduct?.full_slug ?? "";
  return lastPathSegment(fromProduct);
}

function toNum(value: number | string | undefined): number | undefined {
  if (value == null) return undefined;
  return typeof value === "string" ? parseFloat(value) : value;
}

function resolveCurrencySymbol(
  currency: string | { name?: string; symbol?: string } | undefined,
): string {
  if (!currency) return "AED";
  if (typeof currency === "string") return currency;
  return currency.symbol ?? currency.name ?? "AED";
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

async function fetchLiveProduct(slug: string, countryCode: string) {
  const res = await makeApiRequest<{ data?: Record<string, any> }>(
    apiUrls.PRODUCT_DETAIL(slug),
    { params: { force_country: countryCode } },
  );
  const product = res?.data ?? (res as unknown as Record<string, any>);
  if (!product || typeof product !== "object" || !product.id) return null;
  return product;
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

async function refreshGuestCartItems(countryCode: string): Promise<void> {
  const items = readJson<CartItem[]>(CART_KEY);
  if (!Array.isArray(items) || items.length === 0) return;

  const updated = await Promise.all(
    items.map(async (item) => {
      const slug = productSlug(item);
      if (!slug) return item;
      try {
        const product = await fetchLiveProduct(slug, countryCode);
        return product ? applyLiveCartPrice(item, product) : item;
      } catch {
        return item;
      }
    }),
  );

  localStorage.setItem(CART_KEY, JSON.stringify(updated));
}

async function refreshGuestSaveForLater(countryCode: string): Promise<void> {
  const items = readJson<GuestSaveItem[]>(SFL_KEY);
  if (!Array.isArray(items) || items.length === 0) return;

  const updated = await Promise.all(
    items.map(async (item) => {
      const slug = productSlug({ rawProduct: item.rawProduct as { slug?: string; url?: string } });
      if (!slug) return item;
      try {
        const product = await fetchLiveProduct(slug, countryCode);
        return product ? { ...item, rawProduct: product } : item;
      } catch {
        return item;
      }
    }),
  );

  localStorage.setItem(SFL_KEY, JSON.stringify(updated));
}

/** Guest cart/SFL live in localStorage — refetch product prices for the new country. */
export async function refreshGuestCartPrices(countryCode: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (isLoggedIn()) return;
  await Promise.all([
    refreshGuestCartItems(countryCode),
    refreshGuestSaveForLater(countryCode),
  ]);
}
