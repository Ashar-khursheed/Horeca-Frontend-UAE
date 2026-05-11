"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  ChevronRight,
  Home,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

const TrustBadge = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex flex-col items-center gap-1.5 text-center">
    <div className="w-9 h-9 rounded-full bg-[#186737]/10 flex items-center justify-center">
      <Icon size={16} className="text-[#186737]" />
    </div>
    <span className="text-[11px] text-gray-500 font-medium leading-tight max-w-17.5">{label}</span>
  </div>
);

const countryCodes = [
  { code: "+1",   flag: "🇺🇸" },
  { code: "+971", flag: "🇦🇪" },
  { code: "+44",  flag: "🇬🇧" },
  { code: "+91",  flag: "🇮🇳" },
  { code: "+92",  flag: "🇵🇰" },
  { code: "+966", flag: "🇸🇦" },
];

export default function RegisterPage() {
  const [buyingFor, setBuyingFor] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clr = (key: string) => setErrors((p) => ({ ...p, [key]: "" }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (buyingFor === "Business" && !businessName.trim()) e.businessName = "Business name is required.";
    if (!name.trim()) e.name = "Name is required.";
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!phone.trim()) e.phone = "Phone number is required.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Minimum 6 characters.";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  const inputBase = (key: string) =>
    `w-full h-11 pl-10 pr-4 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
      errors[key]
        ? "border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Breadcrumb */}
      {/* <nav className="bg-white border-b border-gray-100">
        <div className="global-container">
          <ol className="flex items-center h-10 gap-1 text-xs">
            <li>
              <Link href="/" className="text-gray-400 hover:text-[#186737] flex items-center gap-1 transition-colors">
                <Home size={11} /> Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <span className="text-[#186737] font-semibold">Register</span>
            </li>
          </ol>
        </div>
      </nav> */}

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 pt-0">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">

          <h1 className="text-2xl font-black text-gray-900 mb-1">Create Account</h1>
          <p className="text-sm text-gray-500 mb-6">Fill in your details to get started.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Row 1 – Buying For + Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Are You Buying For */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Are You Buying For <span className="text-red-500">*</span>
                </label>
                <Select value={buyingFor} onValueChange={setBuyingFor}>
                  <SelectTrigger className="w-full h-11 rounded-[9px] border-gray-200 text-sm focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 focus:ring-offset-0 text-gray-700">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clr("name"); }}
                    placeholder="Enter your name"
                    className={inputBase("name")}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>
            </div>

            {/* Business Name – shown only when Business is selected */}
            {buyingFor === "Business" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); clr("businessName"); }}
                    placeholder="Enter your business name"
                    className={inputBase("businessName")}
                  />
                </div>
                {errors.businessName && <p className="text-[11px] text-red-500 mt-1">{errors.businessName}</p>}
              </div>
            )}

            {/* Row 2 – Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clr("email"); }}
                    placeholder="you@example.com"
                    className={inputBase("email")}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <div className={`flex h-11 rounded-[9px] border overflow-hidden transition-all ${
                  errors.phone ? "border-red-400" : "border-gray-200 focus-within:border-[#186737] focus-within:ring-2 focus-within:ring-[#186737]/10"
                }`}>
                  <div className="flex items-center px-3 bg-white border-r border-gray-200 shrink-0">
                    <Phone size={14} className="text-gray-400 mr-1.5" />
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="text-sm outline-none bg-transparent cursor-pointer text-gray-700"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); clr("phone"); }}
                    placeholder="(866) 446-7322"
                    className="flex-1 px-3 text-sm outline-none bg-white placeholder:text-gray-300"
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Row 3 – Password + Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clr("password"); }}
                    placeholder="••••••••"
                    className={`w-full h-11 pl-10 pr-11 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
                      errors.password ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                    }`}
                  />
                  <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clr("confirmPassword"); }}
                    placeholder="••••••••"
                    className={`w-full h-11 pl-10 pr-11 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
                      errors.confirmPassword ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirmPass((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Consent */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="sr-only peer" />
                <div className="w-4 h-4 rounded border-2 border-gray-300 peer-checked:border-[#186737] peer-checked:bg-[#186737] transition-all flex items-center justify-center">
                  {consent && (
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-[9px] bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                "Create an Account"
              )}
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

          {/* Trust badges */}
          {/* <div className="flex items-center justify-center gap-6 mt-7 pt-6 border-t border-gray-100">
            <TrustBadge icon={ShieldCheck} label="Secure Signup" />
            <TrustBadge icon={Truck} label="Fast Delivery" />
            <TrustBadge icon={RotateCcw} label="Easy Returns" />
          </div> */}
        </div>
      </main>
    </div>
  );
}
