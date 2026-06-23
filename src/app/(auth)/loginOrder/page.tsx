"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { setAuthToken } from "@/apis/axios-instance";
import { CustomerProfile, setProfile } from "@/store/slices/my-profile/profileSlice";
import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import Loader from "@/components/Loader";
import { loginUser } from "@/store/slices/auth/authSlice";
import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import { AppDispatch, RootState } from "@/store/store";
import { syncGuestCartAfterLogin } from "@/utils/syncGuestCart";
import { useLocationData, setDefaultAddressCache, DefaultAddressCache } from "@/utils/locationStorage";
import { syncGuestWishlistAfterLogin } from "@/utils/syncGuestWishlist";
import { guestCheckoutSchema, loginSchema } from "@/validation/schema";
import { useFormik } from "formik";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCounts } from "@/store/slices/customer-counts/customerCountsSlice";
import { usePhoneValidation } from "@/hooks/usePhoneValidation";

const isUS = process.env.NEXT_PUBLIC_REGION === "US";

// Converts 2-letter ISO code → flag emoji ("AE" → "🇦🇪")
const getFlagEmoji = (isoCode: string): string =>
  isoCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");

// Auto-generate a secure random password for guest registration
const generateGuestPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 16 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

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

// ── Consent Checkbox ──────────────────────────────────────────────────────────
function ConsentCheckbox({
  name,
  checked,
  onChange,
  onBlur,
  error,
}: {
  name: string;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  error?: string;
}) {
  return (
    <div>
      <label className="flex items-start gap-2.5 cursor-pointer">
        <div className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
            className="sr-only peer"
          />
          <div className="w-4 h-4 rounded border-2 border-gray-300 peer-checked:border-[#186737] peer-checked:bg-[#186737] transition-all flex items-center justify-center">
            {checked && (
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
          By submitting this form, you consent to receive promotional offers
          from Horecastore at the number provided. Consent is not a condition of
          purchase. Message &amp; data rates may apply. Message frequency
          varies. Unsubscribe by replying STOP. Reply HELP for help. Phone
          numbers aren&apos;t shared with third parties.{" "}
          <Link
            href="/privacy-policy"
            className="text-[#186737] hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          &amp;{" "}
          <Link href="/terms" className="text-[#186737] hover:underline">
            Terms and condition
          </Link>
        </span>
      </label>
      {error && <p className="text-xs font-semibold text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Field Error ───────────────────────────────────────────────────────────────
const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-xs font-semibold text-red-500 mt-1">{msg}</p> : null;

// ── Input class helper ────────────────────────────────────────────────────────
const inputCls = (hasError: boolean) =>
  `w-full h-11 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-400 bg-white ${hasError
    ? "border-red-400 focus:ring-2 focus:ring-red-100"
    : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
  }`;

// ── Helper to clear Google State Cookie ──────────────────────────────────────
const clearGoogleStateCookie = () => {
  try {
    document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    const parts = window.location.hostname.split('.');
    if (parts.length > 2) {
      const parentDomain = parts.slice(1).join('.');
      document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + parentDomain;
    }
  } catch (e) {
    console.error("Failed to clear Google state cookie", e);
  }
};

// ── Login Panel ───────────────────────────────────────────────────────────────
async function cacheDefaultAddress() {
  try {
    const res = await makeApiRequest<{ success: boolean; data: DefaultAddressCache[] }>(
      apiUrls.GET_CUSTOMER_ADDRESS
    );
    const defaultAddr = res.data?.find((a) => a.is_default);
    if (defaultAddr) setDefaultAddressCache(defaultAddr);
  } catch {
    // non-critical
  }
}

function LoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleKey, setGoogleKey] = useState(0);
  const [apiError, setApiError] = useState("");
  const country = useSelector((s: RootState) => s.country?.data);
  console.log("qqqqqqqqqqqqq",country)
  useEffect(() => {
    clearGoogleStateCookie();
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setApiError("Google login failed. No credential received.");
      return;
    }
    setGoogleLoading(true);
    setApiError("");
    try {
      const res = await makeApiRequest<{
        success: boolean;
        token: string;
        customer: CustomerProfile;
      }>(apiUrls.GOOGLE_AUTH, {
        method: "POST",
        data: { credential: credentialResponse.credential },
      });
     setAuthToken(res.token);
      const profileRes = await makeApiRequest<{ success: boolean; customer: CustomerProfile }>(
        apiUrls.GETMYPROFILE
      );
      localStorage.setItem("user", JSON.stringify(profileRes.customer));
      dispatch(setProfile(profileRes.customer));

      // Sync guest wishlist & cart in parallel for maximum speed
      const syncPromises = [];
      const guestWishlist = localStorage.getItem("horeca_wishlist");
      if (guestWishlist && JSON.parse(guestWishlist)?.length > 0) {
        syncPromises.push(syncGuestWishlistAfterLogin());
      }
      const guestCart = localStorage.getItem("horeca_cart");
      if (guestCart && JSON.parse(guestCart)?.length > 0) {
        syncPromises.push(syncGuestCartAfterLogin());
      }
      if (syncPromises.length > 0) {
        await Promise.all(syncPromises);
      }
      await dispatch(fetchCounts());
      await cacheDefaultAddress();
      // const redirect = searchParams.get("redirect") ?? "/checkout";
      // router.push(redirect);
       const redirect = searchParams.get("redirect") ?? "/cart";
      window.location.href = redirect;
    } catch {
      setApiError("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "", consent: false },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError("");
      try {
        await dispatch(
          loginUser({ email: values.email.trim(), password: values.password }),
        ).unwrap();
        const guestWishlist = localStorage.getItem("horeca_wishlist");
        if (guestWishlist && JSON.parse(guestWishlist)?.length > 0) {
          await syncGuestWishlistAfterLogin();
        }
        const guestCart = localStorage.getItem("horeca_cart");
        if (guestCart && JSON.parse(guestCart)?.length > 0) {
          await syncGuestCartAfterLogin();
        }
        await dispatch(fetchCounts());
        await cacheDefaultAddress();
        // const redirect = searchParams.get("redirect") ?? "/cart";
        // router.push(redirect);
         const redirect = searchParams.get("redirect") ?? "/cart";
      window.location.href = redirect;
      } catch (err: unknown) {
        setApiError(
          typeof err === "string"
            ? err
            : ((err as { message?: string })?.message ??
              "Invalid email or password."),
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const emailErr = !!(formik.touched.email && formik.errors.email);
  const passErr = !!(formik.touched.password && formik.errors.password);

  return (
    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 h-full">
      <h2 className="text-xl font-black text-gray-900 mb-1">
        Welcome Back – Sign In to Continue
      </h2>
      <p className="text-sm text-gray-500 mb-6">Sign in to your Account.</p>

      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        {/* Email */}
        <div>
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
              placeholder="Email address"
              className={`${inputCls(emailErr)} pl-10 pr-4`}
            />
          </div>
          <FieldError msg={emailErr ? formik.errors.email : undefined} />
        </div>

        {/* Password */}
        <div>
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
              className={`${inputCls(passErr)} pl-10 pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="flex justify-end mt-1">
            <Link
              href="/forgot-password"
              className="text-[11px] text-[#186737] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <FieldError msg={passErr ? formik.errors.password : undefined} />
        </div>

        {/* Consent (US only) */}
        {isUS && (
          <ConsentCheckbox
            name="consent"
            checked={formik.values.consent}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.consent && formik.errors.consent
                ? String(formik.errors.consent)
                : undefined
            }
          />
        )}

        {apiError && (
          <p className="text-sm font-bold text-red-500 text-center">{apiError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-[9px] bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center transition-all"
        >
          {loading ? <Loader /> : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">Or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Google */}
      <div className="w-full flex justify-center min-h-[40px]">
        {googleLoading ? (
          <div className="w-full h-10 border border-gray-200 rounded-[9px] flex items-center justify-center bg-gray-50">
            <Loader />
          </div>
        ) : (
          // <div className="w-full flex justify-center [&>div]:!w-full [&_iframe]:!w-full [&_iframe]:!min-w-full">
          <div className="google-auth-btn w-full">
            <GoogleLogin
              key={googleKey}
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setApiError("Google login failed. Please try again.");
                clearGoogleStateCookie();
                setGoogleKey((v) => v + 1);
              }}
              theme="outline"
              size="large"
              shape="rectangular"
              width="100%"
            />
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-gray-500 mt-5 leading-relaxed">
        By registering you agree to the user{" "}
        <Link href="/terms" className="text-[#186737] hover:underline">
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="text-[#186737] hover:underline">
          Privacy Policy
        </Link>
      </p>
      <p className="text-center text-[11px] text-gray-500 mt-1.5">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#186737] font-semibold hover:underline"
        >
          Sign up now and join us!
        </Link>
      </p>
    </div>
  );
}

// ── Guest Panel ───────────────────────────────────────────────────────────────
function GuestPanel({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const locationFromRedux = useLocationData();
  const country = useSelector((s: RootState) => s.country);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Auto-detect dial code from location (same as register page)
  useEffect(() => {
    if (locationFromRedux?.country) {
      dispatch(fetchCountryByName(locationFromRedux.country));
    }
  }, [locationFromRedux?.country, dispatch]);

  const dialCode = country.data?.phone_code ?? "";
  const isoCode = locationFromRedux?.countryCode ?? "";
  const flagEmoji = isoCode ? getFlagEmoji(isoCode) : "🌍";
  const detectedCountry = country.data?.name ?? locationFromRedux?.country ?? "";
  const isUSPhone = dialCode === "+1" || isoCode === "US";

  const formatUSPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits.length ? `(${digits}` : "";
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", consent: false },
    validationSchema: guestCheckoutSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError("");
      try {
        const guestPassword = generateGuestPassword();
        const formData = new FormData();
        formData.append("name", values.name.trim());
        formData.append("email", values.email.trim());
        formData.append("password", guestPassword);
        formData.append("password_confirmation", guestPassword);
        formData.append("type", "Private");
        formData.append("country_code", dialCode);
        formData.append("mobile_number", values.phone.replace(/\D/g, ""));

        await makeApiRequest(apiUrls.REGISTER, {
          method: "POST",
          data: formData,
        });

        // Auto-login after registration
        await dispatch(
          loginUser({ email: values.email.trim(), password: guestPassword })
        ).unwrap();

        // Sync guest wishlist & cart
        const guestWishlist = localStorage.getItem("horeca_wishlist");
        if (guestWishlist && JSON.parse(guestWishlist)?.length > 0) {
          await syncGuestWishlistAfterLogin();
        }
        const guestCart = localStorage.getItem("horeca_cart");
        if (guestCart && JSON.parse(guestCart)?.length > 0) {
          await syncGuestCartAfterLogin();
        }
        await dispatch(fetchCounts())
        onSuccess();
        router.push("/cart");
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ??
          (typeof err === "string" ? err : "Registration failed. Please try again.");
        setApiError(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  const phoneValidation = usePhoneValidation(formik.values.phone.replace(/\D/g, ""), isoCode);

  const nameErr = !!(formik.touched.name && formik.errors.name);
  const emailErr = !!(formik.touched.email && formik.errors.email);
  const phoneErr = !!(formik.touched.phone && formik.errors.phone) || phoneValidation.isInvalid;

  if (!showForm) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8 lg:p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-[#186737]/10 flex items-center justify-center mb-4">
          <User size={24} className="text-[#186737]" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">
          Continue As Guest
        </h2>
        <p className="text-sm text-gray-500 mb-8 max-w-xs">
          Checkout quickly without creating an account.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="w-full max-w-[280px] h-12 rounded-[9px] bg-[#186737] hover:bg-[#145c30] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md"
        >
          Continue as a guest
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 h-full">
      <h2 className="text-xl font-black text-gray-900 mb-1">
        Enter Contact Details For Delivery
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        We&apos;ll use this to confirm your order.
      </p>

      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        {/* Name */}
        <div>
          <div className="relative">
            <User
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your name"
              className={`${inputCls(nameErr)} pl-10 pr-4`}
            />
          </div>
          <FieldError msg={nameErr ? formik.errors.name : undefined} />
        </div>

        {/* Email */}
        <div>
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
              placeholder="Enter your email"
              className={`${inputCls(emailErr)} pl-10 pr-4`}
            />
          </div>
          <FieldError msg={emailErr ? formik.errors.email : undefined} />
        </div>

        {/* Phone — auto-detected country code (no dropdown) */}
        <div>
          <div
            className={`flex h-11 rounded-[9px] border overflow-hidden transition-all ${phoneErr
              ? "border-red-400 ring-2 ring-red-100"
              : "border-gray-200 focus-within:border-[#186737] focus-within:ring-2 focus-within:ring-[#186737]/10"
              }`}
          >
            {/* Auto-detected flag + dial code */}
            <div className="flex items-center gap-1.5 px-3 bg-gray-50 border-r border-gray-200 shrink-0">
              {country.loading ? (
                <span className="text-xs text-gray-400 animate-pulse">...</span>
              ) : (
                <>
                  <img src={country.data?.icon ?? ""} className="w-5 h-5" alt="" />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {dialCode}
                  </span>
                </>
              )}
            </div>
            <input
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={(e) => {
                const val = isUSPhone
                  ? formatUSPhone(e.target.value)
                  : e.target.value.replace(/\D/g, "");
                formik.setFieldValue("phone", val);
              }}
              onBlur={formik.handleBlur}
              placeholder={isUSPhone ? "(432) 423-4234" : "501234567"}
              inputMode="numeric"
              maxLength={isUSPhone ? 14 : 15}
              className="flex-1 h-full px-3 text-sm outline-none bg-transparent placeholder:text-gray-400"
            />
          </div>
          {detectedCountry && !phoneErr && !phoneValidation.validating && (
            <p className="text-[11px] text-gray-400 mt-1">
              Detected: {detectedCountry}
            </p>
          )}
          {phoneValidation.validating && !formik.errors.phone && (
            <p className="text-[11px] text-gray-400 mt-1">Validating...</p>
          )}
          <FieldError msg={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined} />
          {!formik.errors.phone && phoneValidation.isInvalid && (
            <FieldError msg={phoneValidation.errorMsg} />
          )}
        </div>

        {/* Consent */}
        <ConsentCheckbox
          name="consent"
          checked={formik.values.consent}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.consent && formik.errors.consent
              ? String(formik.errors.consent)
              : undefined
          }
        />

        {apiError && (
          <p className="text-sm font-bold text-red-500 text-center">{apiError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-[9px] bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center transition-all"
        >
          {loading ? <Loader /> : "Save & Next"}
        </button>

        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="w-full text-center text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back to guest options
        </button>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LoginOrderPage() {
  const router = useRouter();

  return (
    <GoogleOAuthProvider clientId="96165540519-5abr44463l214dog6teceibk8nmqlfm1.apps.googleusercontent.com">
      <div className="min-h-screens bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-4xl">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
              {/* ── Left: Login ── */}
              <div className="border-b lg:border-b-0 lg:border-r border-gray-100">
                <LoginPanel />
              </div>

              {/* ── Divider (mobile) ── */}
              <div className="flex lg:hidden items-center gap-3 px-6 py-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium bg-white px-2">
                  Or
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* ── Right: Guest ── */}
              <div className="relative">
                {/* Desktop vertical "Or" label */}
                <div className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10">
                  <span className="bg-white border border-gray-100 rounded-full w-9 h-9 flex items-center justify-center text-xs font-semibold text-gray-400 shadow-sm">
                    Or
                  </span>
                </div>
                <GuestPanel onSuccess={() => router.push("/checkout")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
