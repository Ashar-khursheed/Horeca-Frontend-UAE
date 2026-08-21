import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

export interface VendorContact {
  id: number;
  vendor_id?: number;
  type: string;
  name: string;
  email: string;
  phone_number?: string | null;
  mobile_number?: string | null;
  is_active: number;
}

export interface VendorProfile {
  id: number;
  name: string;
  address: string | null;
  city_id: number | null;
  country_id: number | null;
  zipcode: string | null;
  dropshipping: number;
  website_link: string | null;
  domain: string | null;
  type: string | null;
  credit_limit: string | null;
  net_terms: string | null;
  logo_url: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  state: string | null;
  contacts: VendorContact[];
  tax_certificate_url: string | null;
  business_licence_url: string | null;
  country: { id: number; name: string } | null;
  city: { id: number; name: string } | null;
}

interface VendorProfileState {
  vendor: VendorProfile | null;
  contact: VendorContact | null;
  loading: boolean;
  error: string | null;
}

const initialState: VendorProfileState = {
  vendor: null,
  contact: null,
  loading: true,
  error: null,
};

export const fetchVendorProfile = createAsyncThunk(
  "vendorProfile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await makeApiRequest<{
        success: boolean;
        message: string;
        data: { contact: VendorContact; vendor: VendorProfile };
      }>(apiUrls.VENDOR_PROFILE);
      return res.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to fetch vendor profile.";
      return rejectWithValue(msg);
    }
  }
);

const vendorProfileSlice = createSlice({
  name: "vendorProfile",
  initialState,
  reducers: {
    clearVendorProfile() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload.vendor;
        state.contact = action.payload.contact;
      })
      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearVendorProfile } = vendorProfileSlice.actions;
export default vendorProfileSlice.reducer;
