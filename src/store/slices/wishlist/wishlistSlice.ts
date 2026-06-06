import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

// ── Guest localStorage helpers ────────────────────────────────────────────────
const WISHLIST_KEY = "horeca_wishlist";

export interface WishlistGuestItem {
  productId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawProduct: any;
}

// Raw entry as returned by WISHLIST_GET API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WishlistApiEntry = any;

type FetchStatus = "idle" | "loading" | "succeeded" | "failed";

const loadGuestWishlist = (): WishlistGuestItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as WishlistGuestItem[]) : [];
  } catch {
    return [];
  }
};

const saveGuestWishlist = (items: WishlistGuestItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
};

// ── State ─────────────────────────────────────────────────────────────────────
interface WishlistState {
  ids: number[];                    // product IDs in wishlist (heart icon checks)
  guestItems: WishlistGuestItem[];  // full product data for guest (localStorage)
  toggling: number[];               // IDs currently being toggled
  guestHydrated: boolean;
  hydrated: boolean;                // true once ids[] is seeded — used to avoid SSR→client flicker
  apiEntries: WishlistApiEntry[];   // raw API entries for wishlist page display
  fetchStatus: FetchStatus;
}

const initialState: WishlistState = {
  ids: [],
  guestItems: [],
  toggling: [],
  guestHydrated: false,
  hydrated: false,
  apiEntries: [],
  fetchStatus: "idle",
};

// ── Async thunk: fetch wishlist (logged-in) ───────────────────────────────────
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await makeApiRequest<any>(apiUrls.WISHLIST_GET);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries: any[] = res?.wishlist ?? (Array.isArray(res) ? res : []);
    return entries;
  },
  {
    // Skip if already loading or succeeded — prevents duplicate calls
    condition: (_, { getState }) => {
      const status: FetchStatus = (getState() as any).wishlist?.fetchStatus;
      return status !== "loading" && status !== "succeeded";
    },
  },
);

// ── Async thunk: logged-in toggle (add / remove via API) ─────────────────────
export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggle",
  async (
    { productId, currentlyInWishlist }: { productId: number; currentlyInWishlist: boolean },
    { rejectWithValue },
  ) => {
    try {
      if (currentlyInWishlist) {
        await makeApiRequest(apiUrls.WISHLIST_REMOVE, {
          method: "DELETE",
          params: { product_id: productId },
        });
      } else {
        await makeApiRequest(apiUrls.WISHLIST_ADD, {
          method: "POST",
          data: { product_id: productId },
        });
      }
      return { productId, inWishlist: !currentlyInWishlist };
    } catch {
      return rejectWithValue({ productId, revert: currentlyInWishlist });
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Seed IDs from product API (in_wishlist: true) for logged-in users
    seedWishlistIds(state, action: PayloadAction<number[]>) {
      for (const id of action.payload) {
        if (!state.ids.includes(id)) state.ids.push(id);
      }
      state.hydrated = true;
    },

    // Load guest wishlist from localStorage (always fresh — toggleGuestWishlistItem keeps it in sync)
    hydrateGuestWishlist(state) {
      const items = loadGuestWishlist();
      state.guestItems = items;
      state.guestHydrated = true;
      state.hydrated = true;
      for (const item of items) {
        if (!state.ids.includes(item.productId)) state.ids.push(item.productId);
      }
    },

    // Guest: toggle product in localStorage wishlist (with full rawProduct data)
    toggleGuestWishlistItem(
      state,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      action: PayloadAction<{ productId: number; rawProduct: any }>,
    ) {
      const { productId, rawProduct } = action.payload;
      const existingIdx = state.guestItems.findIndex((i) => i.productId === productId);
      if (existingIdx >= 0) {
        state.guestItems.splice(existingIdx, 1);
        state.ids = state.ids.filter((id) => id !== productId);
      } else {
        state.guestItems.push({ productId, rawProduct });
        if (!state.ids.includes(productId)) state.ids.push(productId);
      }
      saveGuestWishlist(state.guestItems);
    },

    // Reset fetch status so next visit re-fetches (e.g. after adding a new item)
    resetWishlistFetch(state) {
      state.fetchStatus = "idle";
    },

    clearWishlist(state) {
      state.ids = [];
      state.guestItems = [];
      state.toggling = [];
      state.guestHydrated = false;
      state.hydrated = false;
      state.apiEntries = [];
      state.fetchStatus = "idle";
      if (typeof window !== "undefined") {
        localStorage.removeItem(WISHLIST_KEY);
      }
    },
  },

  extraReducers: (builder) => {
    // ── fetchWishlist ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.apiEntries = action.payload;
        state.hydrated = true;
        // Seed product IDs into ids[] so heart icons work across the app
        for (const entry of action.payload) {
          const pid = entry.product_id as number;
          if (pid && !state.ids.includes(pid)) state.ids.push(pid);
        }
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.fetchStatus = "failed";
      });

    // ── toggleWishlistItem ─────────────────────────────────────────────────────
    builder
      .addCase(toggleWishlistItem.pending, (state, action) => {
        const { productId, currentlyInWishlist } = action.meta.arg;
        state.toggling.push(productId);
        // Optimistic update
        if (currentlyInWishlist) {
          state.ids = state.ids.filter((id) => id !== productId);
          // Remove from apiEntries so wishlist page updates instantly
          state.apiEntries = state.apiEntries.filter((e) => e.product_id !== productId);
        } else {
          if (!state.ids.includes(productId)) state.ids.push(productId);
        }
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.toggling = state.toggling.filter((id) => id !== action.payload.productId);
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { productId, revert } = (action.payload as any) ?? {};
        state.toggling = state.toggling.filter((id) => id !== productId);
        // Revert optimistic update
        if (revert) {
          if (!state.ids.includes(productId)) state.ids.push(productId);
        } else {
          state.ids = state.ids.filter((id) => id !== productId);
        }
      });
  },
});

export const {
  seedWishlistIds,
  hydrateGuestWishlist,
  toggleGuestWishlistItem,
  resetWishlistFetch,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
