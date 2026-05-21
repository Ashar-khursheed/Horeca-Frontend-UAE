import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

export interface CountryData {
  id: number;
  name: string;
  phone_code: string;
  icon: string | null;
  currency_id: number;
  currency_title: string;
  currency_symbol: string;
  margin: number;
}

interface CountryState {
  data: CountryData | null;
  loading: boolean;
  error: string | null;
}

const initialState: CountryState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchCountryByName = createAsyncThunk(
  "country/fetchByName",
  async (countryName: string, { rejectWithValue }) => {
    try {
      const res = await makeApiRequest<{ success: boolean; data: CountryData }>(
        `${apiUrls?.COUNTRIES}/${encodeURIComponent(countryName)}`
      );
      return res.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to fetch country data";
      return rejectWithValue(msg);
    }
  },
  {
    // Only call API if data is not already loaded or loading
    condition: (_, { getState }) => {
      const state = getState() as { country: CountryState };
      return !state.country.data && !state.country.loading;
    },
  }
);

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountryByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountryByName.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCountryByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default countrySlice.reducer;
