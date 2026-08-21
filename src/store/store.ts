import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/my-profile/profileSlice";
import vendorProfileReducer from "./slices/vendor-profile/vendorProfileSlice";
import countryReducer from "./slices/country/countrySlice";
import authReducer from "./slices/auth/authSlice";
import blogInteractionReducer from "./slices/blog/blogInteractionSlice";
import cartReducer from "./slices/cart/cartSlice";
import taxReducer from "./slices/tax/taxSlice";
import wishlistReducer from "./slices/wishlist/wishlistSlice";
import saveForLaterReducer from "./slices/save-for-later/saveForLaterSlice";
import customerAddressReducer from "./slices/customer-address/customerAddressSlice";
import customerCountsReducer from "./slices/customer-counts/customerCountsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    vendorProfile: vendorProfileReducer,
    country: countryReducer,
    blogInteraction: blogInteractionReducer,
    cart: cartReducer,
    tax: taxReducer,
    wishlist: wishlistReducer,
    saveForLater: saveForLaterReducer,
    customerAddress: customerAddressReducer,
    customerCounts: customerCountsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
