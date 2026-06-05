"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { makeApiRequest } from "@/apis/axios-instance";

const schema = Yup.object({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address")
    .required("Email is required"),
});

export default function NewsletterForm() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setServerError("");
      try {
        await makeApiRequest("newsletters", {
          method: "POST",
          data: { email: values.email, is_active: 1 },
        });
        setSuccess(true);
        resetForm();
      } catch {
        setServerError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (success) {
    return (
      <div className="flex items-center gap-2 bg-[#f0f9f4] border border-[#c3e6d4] rounded-[7px] px-3.5 py-3">
        <CheckCircle size={16} className="text-[#186737] shrink-0" />
        <p className="text-[13px] font-semibold text-[#186737]">
          You&apos;ve successfully subscribed!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-2">
      <div>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your email address"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full border rounded-[7px] px-3.5 py-2.5 text-[13px] text-gray-700 placeholder:text-gray-300 outline-none focus:ring-2 transition-all ${
            formik.touched.email && formik.errors.email
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 focus:border-[#186737] focus:ring-[#186737]/10"
          }`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-[11px] text-red-500 mt-1">{formik.errors.email}</p>
        )}
        {serverError && (
          <p className="text-[11px] text-red-500 mt-1">{serverError}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full bg-[#186737] hover:bg-[#145a2f] disabled:bg-gray-400 text-white text-[13px] font-semibold py-2.5 rounded-[7px] transition-colors duration-200"
      >
        {formik.isSubmitting ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
