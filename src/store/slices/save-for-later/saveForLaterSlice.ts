import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

// ── Guest localStorage helpers ────────────────────────────────────────────────
const SFL_KEY = "horeca_save_for_later";

export interface GuestSaveItem {
  productId: number;
  quantity: number;
  vendorId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawProduct: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SflApiEntry = any;

type FetchStatus = "idle" | "loading" | "succeeded" | "failed";

const loadGuestItems = (): GuestSaveItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SFL_KEY);
    return raw ? (JSON.parse(raw) as GuestSaveItem[]) : [];
  } catch {
    return [];
  }
};

const saveGuestItems = (items: GuestSaveItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SFL_KEY, JSON.stringify(items));
};

// ── State ─────────────────────────────────────────────────────────────────────
interface SaveForLaterState {
  ids: number[];               // product IDs saved-for-later (for button state checks)
  guestItems: GuestSaveItem[]; // full data for guest (localStorage)
  apiEntries: SflApiEntry[];   // raw server entries
  toggling: number[];          // IDs currently being processed
  hydrated: boolean;
  fetchStatus: FetchStatus;
}

const initialState: SaveForLaterState = {
  ids: [],
  guestItems: [],
  apiEntries: [],
  toggling: [],
  hydrated: false,
  fetchStatus: "idle",
};

// ── Thunk: fetch list (logged-in) ─────────────────────────────────────────────
export const fetchSaveForLater = createAsyncThunk(
  "saveForLater/fetch",
  async (_, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await makeApiRequest(apiUrls.SAVE_FOR_LATER, { method: "GET" });
      return (res?.data?.data ?? res?.data ?? []) as SflApiEntry[];
    } catch {
      return rejectWithValue([]);
    }
  },
);

// ── Thunk: add (logged-in) ────────────────────────────────────────────────────
export const addSaveForLater = createAsyncThunk(
  "saveForLater/add",
  async (
    { productId, quantity, vendorId }: { productId: number; quantity: number; vendorId: number },
    { rejectWithValue },
  ) => {
    try {
      await makeApiRequest(apiUrls.SAVE_FOR_LATER, {
        method: "POST",
        data: { product_id: productId, quantity, vendor_id: vendorId },
      });
      return { productId };
    } catch {
      return rejectWithValue({ productId });
    }
  },
);

// ── Thunk: remove (logged-in) ─────────────────────────────────────────────────
export const removeSaveForLater = createAsyncThunk(
  "saveForLater/remove",
  async ({ productId }: { productId: number }, { rejectWithValue }) => {
    try {
      await makeApiRequest(`${apiUrls.SAVE_FOR_LATER_REMOVE}/${productId}`, {
        method: "DELETE",
        // params: { product_id: productId },
      });
      return { productId };
    } catch {
      return rejectWithValue({ productId });
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const saveForLaterSlice = createSlice({
  name: "saveForLater",
  initialState,
  reducers: {
    // Load guest items from localStorage
    hydrateGuestSaveItems(state) {
      const items = loadGuestItems();
      state.guestItems = items;
      state.hydrated = true;
      for (const item of items) {
        if (!state.ids.includes(item.productId)) state.ids.push(item.productId);
      }
    },

    // Guest: add or remove item in localStorage (toggle)
    toggleGuestSaveItem(
      state,
      action: PayloadAction<{
        productId: number;
        quantity: number;
        vendorId: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawProduct: any;
      }>,
    ) {
      const { productId, quantity, vendorId, rawProduct } = action.payload;
      const idx = state.guestItems.findIndex((i) => i.productId === productId);
      if (idx >= 0) {
        state.guestItems.splice(idx, 1);
        state.ids = state.ids.filter((id) => id !== productId);
      } else {
        state.guestItems.push({ productId, quantity, vendorId, rawProduct });
        if (!state.ids.includes(productId)) state.ids.push(productId);
      }
      saveGuestItems(state.guestItems);
    },

    resetSaveForLaterFetch(state) {
      state.fetchStatus = "idle";
    },

    clearSaveForLater(state) {
      state.ids = [];
      state.guestItems = [];
      state.apiEntries = [];
      state.toggling = [];
      state.hydrated = false;
      state.fetchStatus = "idle";
      if (typeof window !== "undefined") {
        localStorage.removeItem(SFL_KEY);
      }
    },
  },

  extraReducers: (builder) => {
    // ── fetchSaveForLater ──────────────────────────────────────────────────────
    builder
      .addCase(fetchSaveForLater.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchSaveForLater.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.apiEntries = action.payload;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        state.ids = action.payload.map((e: any) => e.id as number);
      })
      .addCase(fetchSaveForLater.rejected, (state) => {
        state.fetchStatus = "failed";
      });

    // ── addSaveForLater ────────────────────────────────────────────────────────
    builder
      .addCase(addSaveForLater.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.toggling.push(productId);
        // Optimistic: mark as saved immediately
        if (!state.ids.includes(productId)) state.ids.push(productId);
      })
      .addCase(addSaveForLater.fulfilled, (state, action) => {
        state.toggling = state.toggling.filter((id) => id !== action.payload.productId);
      })
      .addCase(addSaveForLater.rejected, (state, action) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { productId } = (action.payload as any) ?? {};
        state.toggling = state.toggling.filter((id) => id !== productId);
        // Revert optimistic update
        state.ids = state.ids.filter((id) => id !== productId);
      });

    // ── removeSaveForLater ─────────────────────────────────────────────────────
    builder
      .addCase(removeSaveForLater.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.toggling.push(productId);
        // Optimistic: remove immediately
        state.ids = state.ids.filter((id) => id !== productId);
        state.apiEntries = state.apiEntries.filter((e) => e.product_id !== productId);
      })
      .addCase(removeSaveForLater.fulfilled, (state, action) => {
        state.toggling = state.toggling.filter((id) => id !== action.payload.productId);
      })
      .addCase(removeSaveForLater.rejected, (state, action) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { productId } = (action.payload as any) ?? {};
        state.toggling = state.toggling.filter((id) => id !== productId);
        // Revert: add back
        if (!state.ids.includes(productId)) state.ids.push(productId);
      });
  },
});

export const {
  hydrateGuestSaveItems,
  toggleGuestSaveItem,
  resetSaveForLaterFetch,
  clearSaveForLater,
} = saveForLaterSlice.actions;

export default saveForLaterSlice.reducer;
