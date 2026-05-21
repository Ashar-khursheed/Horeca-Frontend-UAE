import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeApiRequest, removeAuthToken } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

export interface BusinessDetail {
  id: number;
  customer_id: number;
  business_name: string;
  business_licence: string | null;
  trn_number: string | null;
  vat_certificate: string | null;
  is_tax_free: number;
  approval_status: string;
  approval_action_by: string | null;
  approval_action_notes: string | null;
  approval_action_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  apple_id: string | null;
  is_social_login: boolean;
  country_code: string | null;
  mobile_number: string | null;
  type: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  business_detail: BusinessDetail | null;
}

interface ProfileState {
  customer: CustomerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  customer: null,
  loading: true,
  error: null,
};

export const logoutUser = createAsyncThunk(
  "profile/logout",
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

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await makeApiRequest<{ success: boolean; customer: CustomerProfile }>(
        apiUrls.GETMYPROFILE
      );
      return res.customer;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to fetch profile";
      return rejectWithValue(msg);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<CustomerProfile>) {
      state.customer = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearProfile(state) {
      state.customer = null;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProfile, clearProfile, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
