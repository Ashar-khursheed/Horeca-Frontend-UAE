"use client";

import { useState } from "react";
import ReactDOM from "react-dom";
import { makeApiRequest } from "@/apis/axios-instance";
import { useAppSelector } from "@/store/hooks";

const MISTAKE_OPTIONS = [
  "Product Content",
  "Product Image",
  "Product Pricing",
  "Product Specification",
  "All the above",
];

interface ReportErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
}

export function ReportErrorModal({ isOpen, onClose, productId }: ReportErrorModalProps) {
  const customer = useAppSelector((s) => s.profile.customer);

  const [email,       setEmail]       = useState(customer?.email ?? "");
  const [mistakeIn,   setMistakeIn]   = useState("");
  const [notes,       setNotes]       = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [error,       setError]       = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!email.trim() || !mistakeIn) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await makeApiRequest("frontend/product-report", {
        method: "POST",
        data: { product_id: productId, email, mistake_in: mistakeIn, notes },
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setMistakeIn("");
    setNotes("");
    setError("");
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-[7px] shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#186737]">
          <h2 className="text-white font-bold text-lg">Found an Error? Please Report it.</h2>
          <button onClick={handleClose} className="text-white hover:opacity-80 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#186737]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-800 font-semibold text-base">Thank you for your feedback!</p>
              <p className="text-gray-500 text-sm mt-1">We&apos;ll review it and make improvements.</p>
            </div>
          ) : (
            <>
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-[7px] px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                />
              </div>

              {/* Mistake in */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  There appears to be a mistake in <span className="text-red-500">*</span>
                </label>
                <select
                  value={mistakeIn}
                  onChange={(e) => setMistakeIn(e.target.value)}
                  className="w-full border border-gray-300 rounded-[7px] px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 appearance-none bg-white"
                >
                  <option value="">Select Option</option>
                  {MISTAKE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Describe the issue (optional)…"
                  className="w-full border border-gray-300 rounded-[7px] px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={handleClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-[7px] text-sm font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-[#186737] text-white py-2.5 rounded-[7px] text-sm font-semibold hover:bg-[#145c30] transition disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.25s ease-out; }
      `}</style>
    </div>,
    document.body
  );
}
