import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

// ─── Guest cart item (localStorage) ──────────────────────────────────────────
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
  subTotal: number;
  totalPrice: number;
  accessoryItemIds: number[];
  selectedAccessories?: { id: number; name: string; price: number }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawProduct?: any;
}

// ─── Logged-in cart entry (from server) ──────────────────────────────────────
export interface ApiCartEntry {
  cartItemId: number; // server line-item ID — used for CART_UPDATE_QTY / CART_REMOVE
  productId: number;  // product ID — used to match with product cards
  quantity: number;
}

type ApiStatus = "idle" | "loading" | "succeeded" | "failed";

interface CartState {
  items: CartItem[];          // guest cart (localStorage)
  apiEntries: ApiCartEntry[]; // logged-in cart (server)
  apiStatus: ApiStatus;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
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

// ─── Async thunk ──────────────────────────────────────────────────────────────
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (countryName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await makeApiRequest<any>(apiUrls.CART_GET, {
      params: { country: countryName },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products: any[] = res?.data?.customer_cart_products ?? [];
    return products.map((cp) => ({
      cartItemId: cp.id as number,
      productId: cp.product_id as number,
      quantity: cp.quantity as number,
    })) as ApiCartEntry[];
  },
  {
    // Skip dispatch if already loading or succeeded — prevents N calls from N widgets
    condition: (_, { getState }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status: ApiStatus = (getState() as any).cart?.apiStatus;
      return status !== "loading" && status !== "succeeded";
    },
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const initialState: CartState = {
  items: [],
  apiEntries: [],
  apiStatus: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ── Guest cart ────────────────────────────────────────────────────────────
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

    // ── API cart (logged-in) ──────────────────────────────────────────────────

    // Add or update an entry after CART_ADD
    addApiEntry(state, action: PayloadAction<ApiCartEntry>) {
      const existing = state.apiEntries.find((e) => e.productId === action.payload.productId);
      if (existing) {
        existing.cartItemId = action.payload.cartItemId;
        existing.quantity = action.payload.quantity;
      } else {
        state.apiEntries.push(action.payload);
      }
    },

    // Optimistic update after CART_UPDATE_QTY
    updateApiEntryQty(
      state,
      action: PayloadAction<{ cartItemId: number; quantity: number }>,
    ) {
      const entry = state.apiEntries.find((e) => e.cartItemId === action.payload.cartItemId);
      if (entry) entry.quantity = action.payload.quantity;
    },

    // Optimistic remove after CART_REMOVE
    removeApiEntry(state, action: PayloadAction<number>) {
      state.apiEntries = state.apiEntries.filter((e) => e.cartItemId !== action.payload);
    },

    // Reset on logout
    clearApiEntries(state) {
      state.apiEntries = [];
      state.apiStatus = "idle";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.apiStatus = "succeeded";
        state.apiEntries = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.apiStatus = "failed";
      });
  },
});

export const {
  hydrateCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  addApiEntry,
  updateApiEntryQty,
  removeApiEntry,
  clearApiEntries,
} = cartSlice.actions;

export default cartSlice.reducer;
