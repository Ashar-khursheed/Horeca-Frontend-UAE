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
