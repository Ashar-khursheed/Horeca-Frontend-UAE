import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { toggleWishlistItem } from "@/store/slices/wishlist/wishlistSlice";

interface CustomerCountsState {
  wishlist_count: number;
  cart_count: number;
  cart_quantity_sum: number;
  orders_count: number;
  loaded: boolean;
}

const initialState: CustomerCountsState = {
  wishlist_count: 0,
  cart_count: 0,
  cart_quantity_sum: 0,
  orders_count: 0,
  loaded: false,
};

export const fetchCounts = createAsyncThunk(
  "customerCounts/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await makeApiRequest<{
        success: boolean;
        wishlist_count: number;
        cart_count: number;
        cart_quantity_sum: number;
        orders_count: number;
      }>(apiUrls.CUSTOMER_COUNTS);
      return res;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to fetch counts.";
      return rejectWithValue(msg);
    }
  }
);

const customerCountsSlice = createSlice({
  name: "customerCounts",
  initialState,
  reducers: {
    adjustCartQty(state, action: PayloadAction<number>) {
      state.cart_quantity_sum = Math.max(0, state.cart_quantity_sum + action.payload);
    },
    clearCounts() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCounts.fulfilled, (state, action) => {
        state.wishlist_count   = action.payload.wishlist_count;
        state.cart_count       = action.payload.cart_count;
        state.cart_quantity_sum = action.payload.cart_quantity_sum;
        state.orders_count     = action.payload.orders_count;
        state.loaded           = true;
      });

    // Optimistic wishlist count — no extra dispatch needed anywhere
    builder
      .addMatcher(toggleWishlistItem.pending.match, (state, action) => {
        const delta = action.meta.arg.currentlyInWishlist ? -1 : 1;
        state.wishlist_count = Math.max(0, state.wishlist_count + delta);
      })
      .addMatcher(toggleWishlistItem.rejected.match, (state, action) => {
        // Revert on failure
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arg = (action as any).meta?.arg as { currentlyInWishlist: boolean } | undefined;
        if (arg) {
          const delta = arg.currentlyInWishlist ? 1 : -1;
          state.wishlist_count = Math.max(0, state.wishlist_count + delta);
        }
      });
  },
});

export const { adjustCartQty, clearCounts } = customerCountsSlice.actions;
export default customerCountsSlice.reducer;
