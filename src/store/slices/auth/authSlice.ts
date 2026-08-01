import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeApiRequest, removeAuthToken, setAuthToken } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { setProfile, clearProfile } from "@/store/slices/my-profile/profileSlice";
import type { CustomerProfile } from "@/store/slices/my-profile/profileSlice";
import { clearCart, clearApiEntries } from "@/store/slices/cart/cartSlice";
import { clearWishlist } from "@/store/slices/wishlist/wishlistSlice";
import { clearCounts } from "@/store/slices/customer-counts/customerCountsSlice";
import { clearSaveForLater } from "@/store/slices/save-for-later/saveForLaterSlice";

interface AuthState {
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await makeApiRequest<{
        success: boolean;
        message: string;
        token: string;
        customer: CustomerProfile;
      }>(apiUrls.LOGIN, {
        method: "POST",
        data: { email: credentials.email, password: credentials.password },
      });
      setAuthToken(res.token);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(res.customer));
      }
      dispatch(setProfile(res.customer));
      // window.location.href = "/"; 
      return res.customer;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Invalid email or password.";
      return rejectWithValue(msg);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    payload: { old_password: string; new_password: string; new_password_confirmation: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await makeApiRequest<{ success: boolean; message: string }>(
        apiUrls.CHANGE_PASSWORD,
        { method: "POST", data: payload }
      );
      return res.message;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to change password.";
      return rejectWithValue(msg);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await makeApiRequest(apiUrls.LOGOUT, { method: "POST" });
    } catch {
      // proceed with local logout even if API fails
    } finally {
      removeAuthToken();
      dispatch(clearProfile());
      dispatch(clearCart());
      dispatch(clearApiEntries());
      dispatch(clearWishlist());
      dispatch(clearCounts());
      dispatch(clearSaveForLater());
      localStorage.clear();
       if (typeof window !== "undefined") {
        window.location.href = "/login";
       }
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("hc_default_address");
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
