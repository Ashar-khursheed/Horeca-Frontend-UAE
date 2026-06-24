"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import axiosInstance from "@/apis/axios-instance";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Send, CheckCircle } from "lucide-react";

interface BlogSidebarFormProps {
  type?: string;
}

const validationSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full Name is required")
    .test(
      "not-empty",
      "Full name cannot be empty",
      (value) => !!value && value.trim().length > 0
    ),
  phone: Yup.string()
    .required("Phone Number is required")
    .test(
      "not-empty",
      "Phone Number cannot be empty",
      (value) => !!value && value.trim().length > 0
    ),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .lowercase()
    .trim(),
  notes: Yup.string().optional(),
});

const RECAPTCHA_ENABLED = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";

export default function BlogSidebarForm({ type = "Blog Form" }: BlogSidebarFormProps) {
  const [loader, setLoader] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const country = useSelector((s: RootState) => s.country?.data);
  const countryCode = country?.phone_code ?? "+971"; // Fallback to UAE

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      phone: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (RECAPTCHA_ENABLED && !recaptchaToken) {
        setCaptchaError(true);
        return;
      }

      setLoader(true);
      setFormMessage(null);

      // Extract UTM parameters from URL search
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get("utm_source") || "Organic";
      const utmMedium = urlParams.get("utm_medium") || "";
      const utmCampaign = urlParams.get("utm_campaign") || "";

      // Combine lead source details
      const leadSourceStr = [
        utmSource,
        utmMedium ? `medium: ${utmMedium}` : "",
        utmCampaign ? `campaign: ${utmCampaign}` : ""
      ].filter(Boolean).join(" | ");

      const formData = new FormData();
      formData.append("full_name", values.full_name.trim());
      // Prepend country code for sales team clarity
      const formattedPhone = values.phone.startsWith("+") 
        ? values.phone 
        : `${countryCode} ${values.phone.trim()}`;
      formData.append("phone", formattedPhone);
      formData.append("email", values.email.trim());
      formData.append("notes", values.notes?.trim() || "");
      
      // Satisfy backend required validation fields
      formData.append("company_name", "Individual (Blog Lead)");
      formData.append("restaurant_type", "Blog Inquiry");
      formData.append("lead_type", type);
      formData.append("lead_source", leadSourceStr);
      formData.append("landing_page", window.location.pathname);
      formData.append("g_recaptcha_response", recaptchaToken ?? "");

      try {
        const response = await axiosInstance.post("/frontend/inquiries", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response?.data?.success === true) {
          setFormMessage({
            type: "success",
            text: response.data.message || "Thank you! Your inquiry has been submitted.",
          });
          resetForm();
          setRecaptchaToken(null);
        } else {
          setFormMessage({
            type: "error",
            text: response?.data?.message || "Submission failed. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error submitting blog form:", error);
        setFormMessage({
          type: "error",
          text: "Something went wrong. Please check your network and try again.",
        });
      } finally {
        setLoader(false);
      }
    },
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-5">
      <div className="mb-4">
        <h3 className="text-base font-extrabold text-gray-900 leading-snug">
          Request a Consultation
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          Have questions? Fill out the form below and our kitchen experts will contact you.
        </p>
      </div>

      {formMessage?.type === "success" ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CheckCircle size={44} className="text-green-500 mb-3 animate-bounce" />
          <h4 className="text-sm font-bold text-gray-900 mb-1">Thank you!</h4>
          <p className="text-xs text-gray-600 px-4 leading-relaxed">
            {formMessage.text}
          </p>
          <button
            onClick={() => setFormMessage(null)}
            className="mt-4 text-xs font-bold text-[#186737] hover:underline"
          >
            Submit another request
          </button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-3.5">
          {formMessage?.type === "error" && (
            <div className="text-xs px-3 py-2 rounded-md bg-red-50 text-red-700 border border-red-150">
              {formMessage.text}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="blog_full_name" className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="blog_full_name"
              placeholder="e.g. John Doe"
              className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/10 py-2 px-3 text-xs rounded-lg placeholder:text-gray-300 bg-white text-gray-900"
              {...formik.getFieldProps("full_name")}
            />
            {formik.touched.full_name && formik.errors.full_name && (
              <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.full_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="blog_email" className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="blog_email"
              placeholder="e.g. you@example.com"
              className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/10 py-2 px-3 text-xs rounded-lg placeholder:text-gray-300 bg-white text-gray-900"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="blog_phone" className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center gap-1 shrink-0 select-none">
                {country?.icon && (
                  <img
                    src={country.icon}
                    alt=""
                    className="w-4 h-3 object-cover rounded-sm"
                  />
                )}
                <span className="text-xs text-gray-500 font-medium">{countryCode}</span>
              </div>
              <input
                type="tel"
                id="blog_phone"
                placeholder="50 123 4567"
                className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/10 py-2 pl-16 pr-3 text-xs rounded-lg placeholder:text-gray-300 bg-white text-gray-900"
                {...formik.getFieldProps("phone")}
              />
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.phone}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="blog_notes" className="block text-xs font-semibold text-gray-700 mb-1">
              Notes <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="blog_notes"
              rows={3}
              placeholder="Tell us about your project..."
              className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/10 py-2 px-3 text-xs rounded-lg placeholder:text-gray-300 bg-white text-gray-900 resize-none"
              {...formik.getFieldProps("notes")}
            />
          </div>

          {/* ReCAPTCHA */}
          {RECAPTCHA_ENABLED && (
            <div className="mt-2 scale-90 origin-left">
              <ReCAPTCHA
                sitekey="6LewWvIrAAAAAHWqkx3qesrZpYSrwDa6v8y68AVO"
                onChange={(token: string | null) => {
                  setRecaptchaToken(token);
                  if (token) setCaptchaError(false);
                }}
              />
              {captchaError && !recaptchaToken && (
                <p className="text-red-500 text-[10px] mt-1">Please verify you are not a robot</p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loader}
            className="w-full bg-[#186737] hover:bg-[#145c30] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed shadow-sm hover:shadow-md mt-1"
          >
            {loader ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <>
                <Send size={12} />
                Send Request
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
