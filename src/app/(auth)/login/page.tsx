"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
} from "lucide-react";
import Loader from "@/components/Loader";
import { loginSchema } from "@/validation/schema";
import { makeApiRequest, setAuthToken } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import useSessionStorage from "@/hooks/useSessionStorage";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setProfile, CustomerProfile } from "@/store/slices/my-profile/profileSlice";

// ── Google Icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

// ── Trust Badge ───────────────────────────────────────────────────────────────
const TrustBadge = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex flex-col items-center gap-1.5 text-center">
    <div className="w-9 h-9 rounded-full bg-[#186737]/10 flex items-center justify-center">
      <Icon size={16} className="text-[#186737]" />
    </div>
    <span className="text-[11px] text-gray-500 font-medium leading-tight max-w-[70px]">
      {label}
    </span>
  </div>
);

// ── Yup Validation Schema ─────────────────────────────────────────────────────

// ── Page ──────────────────────────────────────────────────────────────────────
interface BusinessDetail {
  id: number;
  business_name: string;
  approval_status: string;
  is_tax_free: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  type: string;
  is_social_login: boolean;
  country_code: string | null;
  mobile_number: string | null;
  business_detail: BusinessDetail | null;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  customer: Customer;
}

const isUS = process.env.NEXT_PUBLIC_REGION === "US";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { setItem } = useSessionStorage();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      consent: false,
    },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError("");
      try {
        const res = await makeApiRequest<LoginResponse>(apiUrls.LOGIN, {
          method: "POST",
          data: { email: values.email.trim(), password: values.password },
        });
        setAuthToken(res.token);
        setItem("user", res.customer);
        dispatch(setProfile(res.customer as CustomerProfile));
        router.push("/");
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Invalid email or password.";
        setApiError(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  const emailHasError = !!(formik.touched.email && formik.errors.email);
  const passHasError = !!(formik.touched.password && formik.errors.password);

  return (
    <div className="min-h-screens py-12 bg-gray-50 flex flex-col">

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 pt-">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">

          {/* ── LEFT – Brand Panel ─────────────────────────────────────────── */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#186737] via-[#1a7a3f] to-[#0f4d26] p-10 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              {Array.from({ length: 8 }).map((_, r) =>
                Array.from({ length: 6 }).map((_, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="absolute w-20 h-20 rounded-full border-2 border-white"
                    style={{ top: r * 90 - 20, left: c * 110 - 20 }}
                  />
                ))
              )}
            </div>

            {/* Logo area */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Star size={22} className="text-white fill-white" />
                </div>
                <div>
                  <p className="text-white font-black text-lg tracking-tight leading-none">
                    HorecaStore
                  </p>
                  <p className="text-white/60 text-[11px] font-medium mt-0.5">
                    Commercial Kitchen Equipment
                  </p>
                </div>
              </div>

              <h2 className="text-white text-3xl font-black leading-snug mb-4">
                Welcome back!
                <br />
                <span className="text-white/70 text-2xl font-semibold">
                  Sign in to continue.
                </span>
              </h2>

              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Access your orders, saved items, quotes, and personalized
                recommendations — all in one place.
              </p>
            </div>

            {/* Feature list */}
            <div className="relative z-10 space-y-3">
              {[
                "Track & manage all your orders",
                "Save items to wishlist",
                "Request custom quotations",
                "Exclusive deals for members",
              ].map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M2 5l2.5 2.5L8 3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">{text}</span>
                </div>
              ))}
            </div>

            {/* Trust badges row */}
            <div className="relative z-10 flex items-center gap-6 pt-6 border-t border-white/10">
              {["VISA", "MC", "SSL", "PCI"].map((b) => (
                <span
                  key={b}
                  className="text-[9px] font-black border border-white/25 rounded px-2 py-1 text-white/60 tracking-widest"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT – Form Panel ─────────────────────────────────────────── */}
          <div className="flex flex-col justify-center p-8 sm:p-10">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-7">
              <div className="w-8 h-8 rounded-lg bg-[#186737] flex items-center justify-center">
                <Star size={16} className="text-white fill-white" />
              </div>
              <span className="font-black text-[#186737] text-lg tracking-tight">
                HorecaStore
              </span>
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-1">
              Returning Customers
            </h1>
            <p className="text-sm text-gray-500 mb-7">
              Sign in for faster checkout.
            </p>

            <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="you@example.com"
                    className={`w-full h-11 pl-10 pr-4 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
                      emailHasError
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                    }`}
                  />
                </div>
                {emailHasError && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#186737] hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    className={`w-full h-11 pl-10 pr-11 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
                      passHasError
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passHasError && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Consent — only shown in US, required in US */}
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
                      <div className="w-4 h-4 rounded border-2 border-gray-300 peer-checked:border-[#186737] peer-checked:bg-[#186737] transition-all flex items-center justify-center">
                        {formik.values.consent && (
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <path
                              d="M1.5 4.5l2 2L7.5 2"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-500 leading-relaxed">
                    By submitting this form, you consent to receive promotional offers from Horecastore at the number provided. Consent is not a condition of purchase. Message & data rates may apply. Message frequency varies. Unsubscribe by replying STOP. Reply HELP for help. Phone numbers aren't shared with third parties.
                      <Link href="/privacy-policy" className="text-[#186737] hover:underline">
                        Privacy Policy
                      </Link>{" "}
                      &{" "}
                      <Link href="/terms" className="text-[#186737] hover:underline">
                        Terms and Conditions
                      </Link>
                      .
                    </span>
                  </label>
                  {formik.touched.consent && formik.errors.consent && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {formik.errors.consent}
                    </p>
                  )}
                </div>
              )}

              {/* API Error */}
              {apiError && (
                <p className="text-[11px] text-red-500 text-center mb-1">
                  {apiError}
                </p>
              )}

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-[9px] bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {loading ? <Loader /> : "Login"}
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

            {/* Register link */}
            <p className="text-center text-xs text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#186737] font-semibold hover:underline"
              >
                Register now
              </Link>
            </p>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-7 pt-6 border-t border-gray-100">
              <TrustBadge icon={ShieldCheck} label="Secure Login" />
              <TrustBadge icon={Truck} label="Fast Delivery" />
              <TrustBadge icon={RotateCcw} label="Easy Returns" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
