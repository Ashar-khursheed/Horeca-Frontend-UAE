import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: number;
  name: string;
  url: string;
  parentCategoryUrl: string;
  image: string;
  price: number;
  originalPrice: number;
  hasSale: boolean;
  currencySymbol: string;
  quantity: number;
  minQty: number;
  isFixed: boolean;
  isQuote: boolean;
  sellUnit: string;
  sku: string;
  vendorId: number;
  shippingCharge: number;
  subTotal: number;       // price × quantity
  totalPrice: number;     // subTotal + shippingCharge
  accessoryItemIds: number[];
  selectedAccessories?: { id: number; name: string; price: number }[];
  // Full raw product — stored for guest cart, used to sync to API on login
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawProduct?: any;
}

interface CartState {
  items: CartItem[];
}

const CART_KEY = "horeca_cart";

const loadFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state) {
      state.items = loadFromStorage();
    },

    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveToStorage(state.items);
    },

    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveToStorage(state.items);
    },

    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
        saveToStorage(state.items);
      }
    },

    clearCart(state) {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem(CART_KEY);
      }
    },
  },
});

export const { hydrateCart, addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
