"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, Star, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";

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

// ── Success State ─────────────────────────────────────────────────────────────
const SuccessView = ({ email }: { email: string }) => (
  <div className="flex flex-col items-center text-center py-4">
    <div className="w-16 h-16 rounded-full bg-[#186737]/10 flex items-center justify-center mb-5">
      <CheckCircle2 size={32} className="text-[#186737]" />
    </div>

    <h2 className="text-xl font-black text-gray-900 mb-2">Check your inbox</h2>
    <p className="text-sm text-gray-500 leading-relaxed mb-1">
      We&apos;ve sent a password reset link to:
    </p>
    <p className="text-sm font-semibold text-[#186737] break-all mb-6">{email}</p>

    <div className="w-full bg-amber-50 border border-amber-200 rounded-[9px] px-4 py-3 mb-6 text-left">
      <p className="text-xs text-amber-700 font-semibold mb-1">Didn&apos;t receive it?</p>
      <ul className="text-[11px] text-amber-600 space-y-1 list-disc list-inside">
        <li>Check your spam or junk folder</li>
        <li>Make sure you used the right email address</li>
        <li>The link expires in 30 minutes</li>
      </ul>
    </div>

    <p className="text-xs text-gray-500 mb-4">
      Back to{" "}
      <Link href="/login" className="text-[#186737] font-semibold hover:underline">
        Sign In
      </Link>
    </p>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    if (!email) {
      setEmailError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center py-10 px-4">
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
                Reset your
                <br />
                <span className="text-white/70 text-2xl font-semibold">
                  password securely.
                </span>
              </h2>

              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Enter the email linked to your account and we&apos;ll send you a
                secure link to get back in — in seconds.
              </p>
            </div>

            {/* Steps list */}
            <div className="relative z-10 space-y-4">
              {[
                { step: "01", text: "Enter your registered email" },
                { step: "02", text: "Click the link in your inbox" },
                { step: "03", text: "Choose a new password" },
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

            {/* Footer badges */}
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

            {sent ? (
              <SuccessView email={email} />
            ) : (
              <>
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#186737]/10 flex items-center justify-center mb-5">
                  <KeyRound size={22} className="text-[#186737]" />
                </div>

                <h1 className="text-2xl font-black text-gray-900 mb-1">
                  Forgot Password?
                </h1>
                <p className="text-sm text-gray-500 mb-7">
                  No worries — enter your email and we&apos;ll send a reset link.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        placeholder="you@example.com"
                        className={`w-full h-11 pl-10 pr-4 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white ${
                          emailError
                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-[11px] text-red-500 mt-1">{emailError}</p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-[9px] bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {loading ? (
                      <svg
                        className="animate-spin"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="white"
                          strokeOpacity="0.3"
                          strokeWidth="3"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>

                {/* Back to login */}
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-500 hover:text-[#186737] transition-colors font-medium group"
                >
                  <ArrowLeft
                    size={13}
                    className="group-hover:-translate-x-0.5 transition-transform"
                  />
                  Back to Sign In
                </Link>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-100">
                  <TrustBadge icon={ShieldCheck} label="Secure Reset" />
                  <TrustBadge icon={KeyRound} label="Encrypted Link" />
                  <TrustBadge icon={Mail} label="Instant Email" />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
