"use client";

import { useState } from "react";
import ReactDOM from "react-dom";
import { makeApiRequest } from "@/apis/axios-instance";
import { useAppSelector } from "@/store/hooks";

const TITLE_OPTIONS = [
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

  const [email,      setEmail]      = useState(customer?.email ?? "");
  const [title,      setTitle]      = useState("");
  const [problem,    setProblem]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};

    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!title) {
      errs.title = "Please select an option.";
    }

    if (!problem.trim()) {
      errs.problem = "Please describe the issue.";
    } else if (problem.trim().length < 5) {
      errs.problem = "Description must be at least 5 characters.";
    }

    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const user  = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") ?? "{}")
      : {};

    const payload: Record<string, unknown> = {
      product_id: String(productId),
      email:      email.trim(),
      title,
      problem:    problem.trim(),
    };
    if (token && user?.id) {
      payload.created_by = user.id;
    }

    try {
      await makeApiRequest("frontend/product-errors", {
        method: "POST",
        data: payload,
      });
      setSubmitted(true);
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setTitle("");
    setProblem("");
    setErrors({});
    onClose();
  };

  const fieldCls = (err?: string) =>
    `w-full border rounded-[7px] px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 transition ${
      err
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-gray-300 focus:border-[#186737] focus:ring-[#186737]/10"
    }`;

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
              <button
                onClick={handleClose}
                className="mt-5 px-6 py-2 bg-[#186737] text-white text-sm font-semibold rounded-[7px] hover:bg-[#145c30] transition"
              >
                Close
              </button>
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="your@email.com"
                  className={fieldCls(errors.email)}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  There appears to be a mistake in <span className="text-red-500">*</span>
                </label>
                <select
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((p) => ({ ...p, title: "" }));
                  }}
                  className={`${fieldCls(errors.title)} appearance-none bg-white`}
                >
                  <option value="">Select Option</option>
                  {TITLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              {/* Problem */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Describe the Issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={problem}
                  onChange={(e) => {
                    setProblem(e.target.value);
                    if (errors.problem) setErrors((p) => ({ ...p, problem: "" }));
                  }}
                  rows={3}
                  placeholder="Please describe the error in detail…"
                  className={`${fieldCls(errors.problem)} resize-none`}
                />
                {errors.problem && <p className="text-red-500 text-xs mt-1">{errors.problem}</p>}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-[7px] px-3 py-2">
                  {errors.submit}
                </p>
              )}
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
              {submitting ? "Submitting…" : "Submit Report"}
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
