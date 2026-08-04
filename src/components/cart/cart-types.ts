export type CartItem = {
  id: number;
  cartItemId?: number; // API cart line item ID (used for update-quantity endpoint)
  vendorId?: number;
  minQty?: number;
  isFixed?: boolean;
  currencySymbol?: string;
  selectedAccessories?: { id: number; name: string; price: number }[];
  name: string;
  brand: string;
  modelNo: string;
  image: string;
  price: number;
  originalPrice: number;
  unit: string;
  shippingCost: number;
  deliveryDays: string;
  shipBy: string;
  qty: number;
  inWishlist: boolean;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawProduct?: any;
};

export type SavedItem = {
  id: number;
  name: string;
  brand: string;
  modelNo: string;
  image: string;
  price: number;
  salePrice?: number;
  originalPrice: number;
  unit: string;
  rating: number;
  reviews: number;
  deliveryDays: string;
  freeShipping: boolean;
  qty: number;
  url: string;
  inWishlist?: boolean;
  currencySymbol?: string;
  vendorId?: number;
  returnPolicy?: string;
  categoryUrl?: string;
  parentCategoryUrl?: string;
  minQty?: number;
  isFixed?: boolean;
  altTags?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawProduct?: any;
};

export const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Product URLs from the API sometimes arrive without a leading slash. Next.js
// <Link> resolves a relative href against the current path, so on a cart page
// (e.g. /cart/123) that turns "refrigeration/..." into "/cart/refrigeration/...".
// Always force it absolute.
export const toAbsUrl = (url: string | undefined | null): string => {
  if (!url || url === "#") return "#";
  return url.startsWith("/") ? url : `/${url}`;
};

export const TAX_RATE = 0.0825;
