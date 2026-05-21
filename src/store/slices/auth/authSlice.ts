import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeApiRequest, removeAuthToken, setAuthToken } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { setProfile, clearProfile } from "@/store/slices/my-profile/profileSlice";
import type { CustomerProfile } from "@/store/slices/my-profile/profileSlice";

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
        sessionStorage.setItem("user", JSON.stringify(res.customer));
      }
      dispatch(setProfile(res.customer));
      return res.customer;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Invalid email or password.";
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
      });
  },
});

export default authSlice.reducer;
