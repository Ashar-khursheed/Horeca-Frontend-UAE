"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck, KeyRound, CheckCircle2, Star, ArrowLeft } from "lucide-react";
import { makeApiRequest } from "@/apis/axios-instance";

const TrustBadge = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex flex-col items-center gap-1.5 text-center">
    <div className="w-9 h-9 rounded-full bg-[#186737]/10 flex items-center justify-center">
      <Icon size={16} className="text-[#186737]" />
    </div>
    <span className="text-[11px] text-gray-500 font-medium leading-tight max-w-[70px]">{label}</span>
  </div>
);

const SuccessView = () => (
  <div className="flex flex-col items-center text-center py-4">
    <div className="w-16 h-16 rounded-full bg-[#186737]/10 flex items-center justify-center mb-5">
      <CheckCircle2 size={32} className="text-[#186737]" />
    </div>
    <h2 className="text-xl font-black text-gray-900 mb-2">Password Reset!</h2>
    <p className="text-sm text-gray-500 leading-relaxed mb-6">
      Your password has been reset successfully. You can now sign in with your new password.
    </p>
    <Link
      href="/login"
      className="w-full h-11 rounded-[9px] bg-[#186737] hover:bg-[#145c30] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      Go to Sign In
    </Link>
  </div>
);

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") ?? "";
  const type = searchParams.get("type") ?? "user";

  // URLSearchParams decodes '+' as a space; read raw URL to preserve it
  const rawSearch = typeof window !== "undefined" ? window.location.search : "";
  const emailMatch = rawSearch.match(/[?&]email=([^&]*)/);
  const email = emailMatch ? decodeURIComponent(emailMatch[1]) : (searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({ password: "", passwordConfirmation: "" });
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = { password: "", passwordConfirmation: "" };
    let valid = true;

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    }

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = "Please confirm your password.";
      valid = false;
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      await makeApiRequest("auth/reset-password", {
        method: "POST",
        data: {
          email,
          password,
          password_confirmation: passwordConfirmation,
          token,
          type,
        },
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screens py-20 bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center py-10s px-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">

          {/* LEFT – Brand Panel */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#186737] via-[#1a7a3f] to-[#0f4d26] p-10 relative overflow-hidden">
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

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Star size={22} className="text-white fill-white" />
                </div>
                <div>
                  <p className="text-white font-black text-lg tracking-tight leading-none">HorecaStore</p>
                  <p className="text-white/60 text-[11px] font-medium mt-0.5">Commercial Kitchen Equipment</p>
                </div>
              </div>

              <h2 className="text-white text-3xl font-black leading-snug mb-4">
                Set a new
                <br />
                <span className="text-white/70 text-2xl font-semibold">password securely.</span>
              </h2>

              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Choose a strong password to keep your account safe. Your new password must be at least 8 characters.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              {[
                { step: "01", text: "Enter your new password" },
                { step: "02", text: "Confirm the new password" },
                { step: "03", text: "Submit to reset" },
                { step: "04", text: "Sign in and you're good to go" },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-black">{step}</span>
                  </div>
                  <span className="text-white/80 text-sm">{text}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex items-center gap-6 pt-6 border-t border-white/10">
              {["VISA", "MC", "SSL", "PCI"].map((b) => (
                <span key={b} className="text-[9px] font-black border border-white/25 rounded px-2 py-1 text-white/60 tracking-widest">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT – Form Panel */}
          <div className="flex flex-col justify-center p-8 sm:p-10">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-7">
              <div className="w-8 h-8 rounded-lg bg-[#186737] flex items-center justify-center">
                <Star size={16} className="text-white fill-white" />
              </div>
              <span className="font-black text-[#186737] text-lg tracking-tight">HorecaStore</span>
            </div>

            {success ? (
              <SuccessView />
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-[#186737]/10 flex items-center justify-center mb-5">
                  <KeyRound size={22} className="text-[#186737]" />
                </div>

                <h1 className="text-2xl font-black text-gray-900 mb-1">Reset Password</h1>
                <p className="text-sm text-gray-500 mb-7">Enter your new password below.</p>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                        placeholder="••••••••"
                        className={`w-full h-11 pl-10 pr-11 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
                          errors.password
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
                    {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={passwordConfirmation}
                        onChange={(e) => { setPasswordConfirmation(e.target.value); setErrors((p) => ({ ...p, passwordConfirmation: "" })); }}
                        placeholder="••••••••"
                        className={`w-full h-11 pl-10 pr-11 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
                          errors.passwordConfirmation
                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.passwordConfirmation && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.passwordConfirmation}</p>
                    )}
                  </div>

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
                      "Reset Password"
                    )}
                  </button>

                  {apiError && (
                    <p className="text-[12px] text-red-500 text-center mt-1">{apiError}</p>
                  )}
                </form>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-500 hover:text-[#186737] transition-colors font-medium group"
                >
                  <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                  Back to Sign In
                </Link>

                <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-100">
                  <TrustBadge icon={ShieldCheck} label="Secure Reset" />
                  <TrustBadge icon={KeyRound} label="Encrypted" />
                  <TrustBadge icon={Lock} label="Protected" />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  );
}
