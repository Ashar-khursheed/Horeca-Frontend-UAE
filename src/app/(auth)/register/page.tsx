"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import Loader from "@/components/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import type { LocationData } from "@/store/slices/location/locationSlice";
import { loginUser } from "@/store/slices/auth/authSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { registerSchema } from "@/validation/schema";
import { useFormik } from "formik";
import {
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const isUS = process.env.NEXT_PUBLIC_REGION === "US";

// Converts 2-letter ISO code → flag emoji ("AE" → "🇦🇪")
const getFlagEmoji = (isoCode: string): string =>
  isoCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  customer: Record<string, unknown>;
}

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const locationFromRedux = useSelector((s: RootState) => s.location.data);
  const country = useSelector((s: RootState) => s.country);
console.log("Location from Redux:", locationFromRedux,country);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Fetch country details (once) using sessionStorage first, then Redux fallback
  useEffect(() => {
    const cached = sessionStorage.getItem("location");
    if (cached) {
      const data = JSON.parse(cached) as LocationData;
      if (data?.country) {
        dispatch(fetchCountryByName(data.country));
        return;
      }
    }
    if (locationFromRedux?.country) {
      dispatch(fetchCountryByName(locationFromRedux.country));
    }
  }, [locationFromRedux?.country, dispatch]);

  // Derived display values from Redux country + location
  const dialCode = country.data?.phone_code ?? "";
  const isoCode =
    locationFromRedux?.countryCode ??
    (sessionStorage.getItem("location")
      ? (JSON.parse(sessionStorage.getItem("location")!) as LocationData).countryCode
      : "");
  const flagEmoji = isoCode ? getFlagEmoji(isoCode) : "🌍";
  const detectedCountry = country.data?.name ?? locationFromRedux?.country ?? "";

  const formik = useFormik({
    initialValues: {
      type: "",
      business_name: "",
      name: "",
      email: "",
      mobile_number: "",
      password: "",
      password_confirmation: "",
      consent: false,
    },
    validationSchema: registerSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError("");
      try {
        const formData = new FormData();
        formData.append("name", values.name.trim());
        formData.append("email", values.email.trim());
        formData.append("password", values.password);
        formData.append("password_confirmation", values.password_confirmation);
        formData.append("type", values.type);
        formData.append("country_code", dialCode);
        formData.append("mobile_number", values.mobile_number);
        if (values.type === "Business" && values.business_name) {
          formData.append("business_name", values.business_name.trim());
        }

        await makeApiRequest<RegisterResponse>(apiUrls.REGISTER, {
          method: "POST",
          data: formData,
        });

        // Auto-login after successful registration
        await dispatch(
          loginUser({ email: values.email.trim(), password: values.password })
        ).unwrap();
        router.push("/");
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Registration failed. Please try again.";
        setApiError(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  const err = (field: string): string | undefined => {
    const touched = formik.touched[field as keyof typeof formik.touched];
    const error = formik.errors[field as keyof typeof formik.errors];
    return touched ? (error as string | undefined) : undefined;
  };

  const inputClass = (field: string, padding = "pl-10 pr-4") =>
    `w-full h-11 ${padding} rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
      err(field)
        ? "border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
    }`;

  return (
    <div className="min-h-screens py-8 bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">

          <h1 className="text-2xl font-black text-gray-900 mb-1">Create Account</h1>
          <p className="text-sm text-gray-500 mb-6">Fill in your details to get started.</p>

          <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">

            {/* Row 1 – Type + Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Are You Buying For (type) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Are You Buying For <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formik.values.type}
                  onValueChange={(v) => {
                    formik.setFieldValue("type", v);
                    formik.setFieldTouched("type", true, false);
                    if (v !== "Business") formik.setFieldValue("business_name", "");
                  }}
                >
                  <SelectTrigger
                    className={`w-full h-11 rounded-[9px] border text-sm focus:ring-offset-0 text-gray-700 ${
                      err("type")
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                    }`}
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
                {err("type") && (
                  <p className="text-[11px] text-red-500 mt-1">{err("type")}</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your full name"
                    className={inputClass("name")}
                  />
                </div>
                {err("name") && (
                  <p className="text-[11px] text-red-500 mt-1">{err("name")}</p>
                )}
              </div>
            </div>

            {/* Business Name – only when Business is selected */}
            {formik.values.type === "Business" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="business_name"
                    value={formik.values.business_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your business name"
                    className={inputClass("business_name")}
                  />
                </div>
                {err("business_name") && (
                  <p className="text-[11px] text-red-500 mt-1">{err("business_name")}</p>
                )}
              </div>
            )}

            {/* Row 2 – Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputClass("email")}
                  />
                </div>
                {err("email") && (
                  <p className="text-[11px] text-red-500 mt-1">{err("email")}</p>
                )}
              </div>

              {/* Phone (mobile_number) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div
                  className={`flex h-11 rounded-[9px] border overflow-hidden transition-all ${
                    err("mobile_number")
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-[#186737] focus-within:ring-2 focus-within:ring-[#186737]/10"
                  }`}
                >
                  {/* Auto-detected flag + dial code from Redux */}
                  <div className="flex items-center gap-1.5 px-3 bg-gray-50 border-r border-gray-200 shrink-0">
                    {country.loading ? (
                      <span className="text-xs text-gray-400 animate-pulse">...</span>
                    ) : (
                      <>
                        <span className="text-base leading-none">{flagEmoji}</span>
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          {dialCode}
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formik.values.mobile_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="501234567"
                    inputMode="numeric"
                    className="flex-1 px-3 text-sm outline-none bg-white placeholder:text-gray-300"
                  />
                </div>
                {detectedCountry && !err("mobile_number") && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Detected: {detectedCountry}
                  </p>
                )}
                {err("mobile_number") && (
                  <p className="text-[11px] text-red-500 mt-1">{err("mobile_number")}</p>
                )}
              </div>
            </div>

            {/* Row 3 – Password + Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full h-11 pl-10 pr-11 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
                      err("password")
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {err("password") && (
                  <p className="text-[11px] text-red-500 mt-1">{err("password")}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="password_confirmation"
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full h-11 pl-10 pr-11 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
                      err("password_confirmation")
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {err("password_confirmation") && (
                  <p className="text-[11px] text-red-500 mt-1">{err("password_confirmation")}</p>
                )}
              </div>
            </div>

            {/* Consent – only shown in US region */}
            {isUS && (
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formik.values.consent}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="sr-only peer"
                    />
                    <div
                      className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
                        formik.values.consent
                          ? "border-[#186737] bg-[#186737]"
                          : err("consent")
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    >
                      {formik.values.consent && (
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <path d="M1.5 4.5l2 2L7.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500 leading-relaxed">
                    By submitting this form, you consent to receive promotional offers from Horecastore at the number provided. Consent is not a condition of purchase. Message &amp; data rates may apply. Message frequency varies. Unsubscribe by replying STOP. Reply HELP for help. Phone numbers aren&apos;t shared with third parties.{" "}
                    <Link href="/privacy-policy" className="text-[#186737] hover:underline">Privacy Policy</Link>{" "}&amp;{" "}
                    <Link href="/terms" className="text-[#186737] hover:underline">Terms and Conditions</Link>.
                  </span>
                </label>
                {err("consent") && (
                  <p className="text-[11px] text-red-500 mt-1">{err("consent")}</p>
                )}
              </div>
            )}

            {/* API Error */}
            {apiError && (
              <p className="text-[11px] text-red-500 text-center">{apiError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-[9px] bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {loading ? <Loader /> : "Create an Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">Or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google */}
          <button className="w-full h-11 rounded-[9px] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2.5 text-sm font-semibold text-gray-700 transition-all duration-200">
            <GoogleIcon />
            Sign in with Google
          </button>

          {/* Login link */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#186737] font-semibold hover:underline">
              Welcome Back – Sign In to Continue
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
