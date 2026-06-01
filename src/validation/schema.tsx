import * as Yup from "yup";

const isUS = process.env.NEXT_PUBLIC_REGION === "US";

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Email is required.")
    .email("Enter a valid email address."),
  password: Yup.string()
    .trim()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
  ...(isUS && {
    consent: Yup.boolean().oneOf([true], "You must accept the terms to continue."),
  }),
});

export const registerSchema = Yup.object({
  type: Yup.string().required("Please select who you are buying for."),
  business_name: Yup.string().when("type", {
    is: "Business",
    then: (s) =>
      s
        .required("Business name is required.")
        .test("no-blank", "Business name cannot be blank spaces.", (v) => !!v && v.trim().length > 0)
        .min(2, "Minimum 2 characters."),
    otherwise: (s) => s.optional(),
  }),
  name: Yup.string()
    .required("Full name is required.")
    .test("no-blank", "Name cannot be blank spaces.", (v) => !!v && v.trim().length > 0)
    .min(2, "Minimum 2 characters.")
    .max(60, "Maximum 60 characters."),
  email: Yup.string()
    .trim()
    .required("Email address is required.")
    .test("no-space", "Email cannot contain spaces.", (v) => !v || !v.includes(" "))
    .email("Enter a valid email address (e.g. you@example.com)."),
  mobile_number: Yup.string()
    .required("Phone number is required.")
    .matches(/^[0-9]{7,15}$/, "Enter a valid phone number (7–15 digits, numbers only)."),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Minimum 8 characters required.")
    .matches(/[A-Z]/, "Must include at least one uppercase letter.")
    .matches(/[0-9]/, "Must include at least one number.")
    .matches(/[^A-Za-z0-9]/, "Must include at least one special character."),
  password_confirmation: Yup.string()
    .required("Please confirm your password.")
    .oneOf([Yup.ref("password")], "Passwords do not match."),
  ...(isUS && {
    consent: Yup.boolean().oneOf([true], "You must accept the terms to continue."),
  }),
});

export const updateProfileSchema = Yup.object({
  name: Yup.string()
    .required("Full name is required.")
    .test("no-blank", "Name cannot be blank spaces.", (v) => !!v && v.trim().length > 0)
    .min(2, "Minimum 2 characters.")
    .max(60, "Maximum 60 characters."),
  country_code: Yup.string()
    .required("Country code is required.")
    .matches(/^\+?[0-9]{1,5}$/, "Enter a valid country code (e.g. +971)."),
  mobile_number: Yup.string()
    .required("Mobile number is required.")
    .matches(/^[0-9]{7,15}$/, "Enter a valid mobile number (7–15 digits)."),
  type: Yup.string().required("Account type is required."),
  business_name: Yup.string().when("type", {
    is: "Business",
    then: (s) =>
      s
        .required("Business name is required.")
        .test("no-blank", "Business name cannot be blank spaces.", (v) => !!v && v.trim().length > 0)
        .min(2, "Minimum 2 characters."),
    otherwise: (s) => s.optional(),
  }),
});

export const guestCheckoutSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required.")
    .test("no-blank", "Name cannot be blank.", (v) => !!v && v.trim().length > 0)
    .min(2, "Minimum 2 characters.")
    .max(60, "Maximum 60 characters."),
  email: Yup.string()
    .trim()
    .required("Email is required.")
    .email("Enter a valid email address."),
  phone: Yup.string()
    .required("Phone number is required.")
    .matches(/^[0-9]{7,15}$/, "Enter a valid phone number (7–15 digits, numbers only)."),
  consent: Yup.boolean().oneOf([true], "You must accept the terms to continue."),
});

export const changePasswordSchema = Yup.object({
  old_password: Yup.string()
    .required("Current password is required.")
    .test("no-blank", "Current password cannot be blank.", (v) => !!v && v.trim().length > 0),
  new_password: Yup.string()
    .required("New password is required.")
    .min(8, "Minimum 8 characters required.")
    .matches(/[A-Z]/, "Must include at least one uppercase letter.")
    .matches(/[0-9]/, "Must include at least one number.")
    .matches(/[^A-Za-z0-9]/, "Must include at least one special character."),
  new_password_confirmation: Yup.string()
    .required("Please confirm your new password.")
    .oneOf([Yup.ref("new_password")], "Passwords does not match."),
});
