import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeApiRequest } from "@/apis/axios-instance";
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

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (
    payload: FormData | { name: string; country_code: string; mobile_number: string; type: string; business_name?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await makeApiRequest<{ success: boolean; message: string; customer: CustomerProfile }>(
        apiUrls.UPDATE_PROFILE,
        { method: "POST", data: payload }
      );
      dispatch(setProfile(res.customer));
      return res.message;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update profile.";
      return rejectWithValue(msg);
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
      })
      .addCase(updateProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setProfile, clearProfile, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
