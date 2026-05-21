import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/my-profile/profileSlice";
import locationReducer from "./slices/location/locationSlice";

const store = configureStore({
  reducer: {
    profile: profileReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
