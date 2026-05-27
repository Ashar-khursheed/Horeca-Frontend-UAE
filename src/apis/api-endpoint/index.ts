export const apiUrls = {
  // Authentication
  LOGIN: "frontend/login",
  REGISTER: "frontend/customer/register",
  LOGOUT: "frontend/logout",
  GETMYPROFILE: "frontend/customer/get-profile",
  CHANGE_PASSWORD: "frontend/customer/change-password",
  UPDATE_PROFILE: "frontend/customer/update-profile",
  NavigationAPI:"frontend-categories",
  FEATURED_PRODUCTS: "frontend/featured-categories-with-products",
  FEATURED_BRAND_PRODUCTS: "frontend/featured-brands-with-products",
  BLOGS:"frontend/blogs",

  // General
  COUNTRIES: "frontend/countries",
  SLIDER: (id: number) => `frontend/sliders/${id}`,
};
