"use client";

import { CheckCircle } from "lucide-react";
import React, { useState } from "react";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const isValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid(email)) { setStatus("error"); return; }
    setStatus("loading");
    // 🔌 Replace with your API:
    // await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) });
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
  };

  return (
     <div className="global-container">
    <section className="bg-green-50 border-t-[3px] border-emerald-600 py-14 px-4">
         <div className="max-w-xl mx-auto text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-600 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
          Newsletter
        </div>

        {/* Heading */}
        <h2 className="text-[28px] sm:text-[34px] font-extrabold text-emerald-950 leading-tight mb-2.5">
       Early Access. Extra Savings. Only for Subscribers.
        </h2>

        {/* Subheading */}
        <p className="text-sm text-emerald-800/60 leading-relaxed mb-7">
         Don’t miss limited-time offers made for hotels, restaurants, and cafes


        </p>

        {/* Form / Success */}
        {status === "success" ? (
          <div className="flex items-center gap-3 max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-[7px] px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-emerald-900">You&apos;re subscribed! 🎉</p>
              <p className="text-xs text-emerald-600/70 mt-0.5">
                Welcome to the HoReCa family. Check your inbox for a special offer.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex rounded-[7px] overflow-hidden border-[1.5px] border-emerald-300 bg-white shadow-md shadow-emerald-100 mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 text-sm text-emerald-900 placeholder-emerald-300/70 outline-none bg-transparent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold whitespace-nowrap transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Please wait..." : "Subscribe →"}
              </button>
            </div>
            {status === "error" && (
              <p className="text-xs text-red-500 mb-2">Please enter a valid email address.</p>
            )}
          </form>
        )}

        {/* Perks */}
        {/* <div className="flex flex-wrap justify-center gap-4 mt-5">
          {["No spam", "Weekly only", "Unsubscribe anytime", "Exclusive member deals"].map((p) => (
            <span key={p} className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600/70">
              <span className="text-emerald-500">✓</span> {p}
            </span>
          ))}
        </div> */}

        {/* Privacy note */}
        {/* <p className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 mt-4">
          <Lock className="w-3 h-3" />
          Your information is safe with us.
        </p> */}

      </div>
    </section>
     </div>
  );
};

export default NewsletterSection;