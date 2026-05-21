import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LocationData {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

interface LocationState {
  data: LocationData | null;
}

const initialState: LocationState = {
  data: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<LocationData>) {
      state.data = action.payload;
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
