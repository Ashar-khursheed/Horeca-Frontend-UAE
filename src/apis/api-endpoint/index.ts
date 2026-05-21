export const apiUrls = {
  // Authentication
  LOGIN: "/login",
  REGISTER: "/auth/register",
  LOGOUT: "/logout",
  GETMYPROFILE: "/customer/get-profile",

  // General
  COUNTRIES: "/countries",
  SLIDER: (id: number) => `/sliders/${id}`,
};
