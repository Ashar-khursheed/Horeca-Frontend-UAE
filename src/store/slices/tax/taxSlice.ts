import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TaxRateData {
  state: string;
  zip: string;
  city: string;
  country: string;
  freight_taxable: boolean;
  combined_rate: string;
  country_rate: string;
  state_rate: string;
  combined_district_rate: string;
  county: string;
  county_rate: string;
  city_rate: string;
}

interface TaxState {
  data: TaxRateData | null;
}

export const TAX_STORAGE_KEY = "horeca_tax_rate";

const initialState: TaxState = {
  data: null,
};

const taxSlice = createSlice({
  name: "tax",
  initialState,
  reducers: {
    setTaxRate(state, action: PayloadAction<TaxRateData>) {
      state.data = action.payload;
    },
    clearTaxRate(state) {
      state.data = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(TAX_STORAGE_KEY);
      }
    },
  },
});

export const { setTaxRate, clearTaxRate } = taxSlice.actions;
export default taxSlice.reducer;
