import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/my-profile/profileSlice";
import locationReducer from "./slices/location/locationSlice";
import countryReducer from "./slices/country/countrySlice";
import authReducer from "./slices/auth/authSlice";
import blogInteractionReducer from "./slices/blog/blogInteractionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    location: locationReducer,
    country: countryReducer,
    blogInteraction: blogInteractionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
