export const apiUrls = {
  // Authentication
  LOGIN: "/login",
  REGISTER: "/customer/register",
  LOGOUT: "/logout",
  GETMYPROFILE: "/customer/get-profile",
  CHANGE_PASSWORD: "/customer/change-password",
  UPDATE_PROFILE: "/customer/update-profile",

  // General
  COUNTRIES: "/countries",
  SLIDER: (id: number) => `/sliders/${id}`,
};
