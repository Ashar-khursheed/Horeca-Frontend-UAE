export const apiUrls = {
  // Authentication
  LOGIN: "/login",
  REGISTER: "/customer/register",
  LOGOUT: "/logout",
  GETMYPROFILE: "/customer/get-profile",

  // General
  COUNTRIES: "/countries",
  SLIDER: (id: number) => `/sliders/${id}`,
};
