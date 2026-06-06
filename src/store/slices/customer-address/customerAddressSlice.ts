import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import {
  DefaultAddressCache,
  clearDefaultAddressCache,
  getDefaultAddressCache,
  setDefaultAddressCache,
} from "@/utils/locationStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CustomerAddress {
  id: number;
  customer_id: number;
  type: string | null;
  address: string;
  address2: string | null;
  city_id: number;
  state_id: number | null;
  country_id: number;
  zip_code: string | null;
  is_default: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  country: string;
  state: string | null;
  city: string;
  related_country: { id: number; name: string } | null;
  related_state: { id: number; name: string } | null;
  related_city: { id: number; name: string } | null;
}

export interface AddressPayload {
  type: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip_code: string;
  is_default: boolean;
}

export interface LocationItem {
  id: number;
  name: string;
}

interface CustomerAddressState {
  addresses: CustomerAddress[];
  loading: boolean;
  submitting: boolean;
  deletingId: number | null;
  error: string | null;
  cachedDefault: DefaultAddressCache | null;
  // Location dropdowns
  countries: LocationItem[];
  states: LocationItem[];
  cities: LocationItem[];
  countriesLoading: boolean;
  statesLoading: boolean;
  citiesLoading: boolean;
}

const initialState: CustomerAddressState = {
  addresses: [],
  loading: false,
  submitting: false,
  deletingId: null,
  error: null,
  cachedDefault: getDefaultAddressCache(),
  countries: [],
  states: [],
  cities: [],
  countriesLoading: false,
  statesLoading: false,
  citiesLoading: false,
};

// ── Thunks ─────────────────────────────────────────────────────────────────────

export const fetchAddresses = createAsyncThunk(
  "customerAddress/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await makeApiRequest<{ success: boolean; data: CustomerAddress[] }>(
        apiUrls.GET_CUSTOMER_ADDRESS
      );
      return res.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to fetch addresses.";
      return rejectWithValue(msg);
    }
  }
);

export const addAddress = createAsyncThunk(
  "customerAddress/add",
  async (payload: AddressPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await makeApiRequest<{ success: boolean; message: string; data: CustomerAddress }>(
        apiUrls.ADD_CUSTOMER_ADDRESS,
        { method: "POST", data: payload }
      );
      dispatch(fetchAddresses());
      return res.message;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to add address.";
      return rejectWithValue(msg);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "customerAddress/update",
  async ({ id, payload }: { id: number; payload: AddressPayload }, { dispatch, rejectWithValue }) => {
    try {
      const res = await makeApiRequest<{ success: boolean; message: string; data: CustomerAddress }>(
        apiUrls.UPDATE_CUSTOMER_ADDRESS(id),
        { method: "PUT", data: payload }
      );
      dispatch(fetchAddresses());
      return res.message;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to update address.";
      return rejectWithValue(msg);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "customerAddress/delete",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await makeApiRequest(apiUrls.DELETE_CUSTOMER_ADDRESS(id), { method: "DELETE" });
      dispatch(fetchAddresses());
      return id;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to delete address.";
      return rejectWithValue(msg);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "customerAddress/setDefault",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await makeApiRequest(apiUrls.DEFAULT_CUSTOMER_ADDRESS, {
        method: "POST",
        data: { address_id: id },
      });
      dispatch(fetchAddresses());
      return id;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to set default address.";
      return rejectWithValue(msg);
    }
  }
);

export const fetchCountriesList = createAsyncThunk(
  "customerAddress/fetchCountries",
  async (_, { rejectWithValue }) => {
    try {
      const res = await makeApiRequest<{ success: boolean; data: LocationItem[] }>(
        apiUrls.COUNTRIES
      );
      return res.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to fetch countries.";
      return rejectWithValue(msg);
    }
  }
);

export const fetchStatesByCountry = createAsyncThunk(
  "customerAddress/fetchStates",
  async (countryId: number, { rejectWithValue }) => {
    try {
      const res = await makeApiRequest<{ success: boolean; data: LocationItem[] }>(
        apiUrls.STATES,
        { params: { country_id: countryId } }
      );
      return res.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to fetch states.";
      return rejectWithValue(msg);
    }
  }
);

export const fetchCities = createAsyncThunk(
  "customerAddress/fetchCities",
  async (params: { stateId?: number; countryId?: number }, { rejectWithValue }) => {
    try {
      const queryParams = params.stateId
        ? { state_id: params.stateId }
        : { country_id: params.countryId };

      const res = await makeApiRequest<{ success: boolean; data: LocationItem[] }>(
        apiUrls.CITIES,
        { params: queryParams }
      );
      return res.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to fetch cities.";
      return rejectWithValue(msg);
    }
  }
);

// ── Slice ──────────────────────────────────────────────────────────────────────

const customerAddressSlice = createSlice({
  name: "customerAddress",
  initialState,
  reducers: {
    clearStates(state) {
      state.states = [];
      state.cities = [];
    },
    clearCities(state) {
      state.cities = [];
    },
    clearError(state) {
      state.error = null;
    },
    optimisticSetDefault(state, action: PayloadAction<number>) {
      state.addresses = state.addresses.map((a) => ({
        ...a,
        is_default: a.id === action.payload,
      }));
      const newDefault = state.addresses.find((a) => a.id === action.payload);
      if (newDefault) {
        setDefaultAddressCache(newDefault);
        state.cachedDefault = newDefault;
      }
    },
    clearAddresses(state) {
      state.addresses = [];
      state.cachedDefault = null;
      clearDefaultAddressCache();
    },
  },
  extraReducers: (builder) => {
    // fetchAddresses
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        const defaultAddr = action.payload.find((a) => a.is_default);
        if (defaultAddr) {
          setDefaultAddressCache(defaultAddr);
          state.cachedDefault = defaultAddr;
        } else {
          clearDefaultAddressCache();
          state.cachedDefault = null;
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // addAddress
    builder
      .addCase(addAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });

    // updateAddress
    builder
      .addCase(updateAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });

    // deleteAddress
    builder
      .addCase(deleteAddress.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.deletingId = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload as string;
      });

    // setDefaultAddress
    builder
      .addCase(setDefaultAddress.pending, (state) => {
        state.error = null;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // fetchCountriesList
    builder
      .addCase(fetchCountriesList.pending, (state) => {
        state.countriesLoading = true;
      })
      .addCase(fetchCountriesList.fulfilled, (state, action) => {
        state.countriesLoading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountriesList.rejected, (state) => {
        state.countriesLoading = false;
      });

    // fetchStatesByCountry
    builder
      .addCase(fetchStatesByCountry.pending, (state) => {
        state.statesLoading = true;
        state.states = [];
        state.cities = [];
      })
      .addCase(fetchStatesByCountry.fulfilled, (state, action) => {
        state.statesLoading = false;
        state.states = action.payload;
      })
      .addCase(fetchStatesByCountry.rejected, (state) => {
        state.statesLoading = false;
      });

    // fetchCities
    builder
      .addCase(fetchCities.pending, (state) => {
        state.citiesLoading = true;
        state.cities = [];
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.citiesLoading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state) => {
        state.citiesLoading = false;
      });
  },
});

export const { clearStates, clearCities, clearError, optimisticSetDefault, clearAddresses } =
  customerAddressSlice.actions;

export default customerAddressSlice.reducer;
