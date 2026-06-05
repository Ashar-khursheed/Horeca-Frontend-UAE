export type CartItem = {
  id: number;
  cartItemId?: number; // API cart line item ID (used for update-quantity endpoint)
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
};

export type SavedItem = {
  id: number;
  name: string;
  brand: string;
  modelNo: string;
  image: string;
  price: number;
  originalPrice: number;
  unit: string;
  rating: number;
  reviews: number;
  deliveryDays: string;
  freeShipping: boolean;
  qty: number;
  url: string;
};

export const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const TAX_RATE = 0.0825;
