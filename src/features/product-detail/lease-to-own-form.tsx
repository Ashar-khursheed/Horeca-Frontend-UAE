"use client";

import axiosInstance from "@/apis/axios-instance";
import { RootState } from "@/store/store";
import { useFormik } from "formik";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector } from "react-redux";
import * as Yup from "yup";

interface LeaseToOwnFormProps {
  onSuccess: () => void;
}

interface FormValues {
  full_name: string;
  phone: string;
  email: string;
  company_name: string;
  notes: string;
  check: boolean;
}

const validationSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full Name is required")
    .matches(
      /^[^\s].*[^\s]$|^[^\s]$/,
      "Invalid format: Remove leading/trailing spaces",
    )
    .test(
      "not-empty",
      "Full name cannot be only spaces",
      (value) => !!value && value.trim().length > 0,
    ),
  phone: Yup.string()
    .required("Phone Number is required")
    .test(
      "no-whitespace-only",
      "Phone Number cannot be only spaces",
      (value) => !!value && value.trim().length > 0,
    )
    .matches(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
      "Please enter a valid US phone number (e.g., +1 (234) 567-8900 or 234-567-8900)",
    ),
  email: Yup.string()
    .required("Email is required")
    .test("no-whitespace", "Email cannot contain spaces", (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    })
    .email("Please enter a valid email address")
    .lowercase("Email must be in lowercase")
    .trim(),
  company_name: Yup.string(),
  notes: Yup.string(),
  check: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("You must agree to the terms and conditions"),
});

const RECAPTCHA_ENABLED = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";

const inputClass =
  "w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 rounded-md mt-2 placeholder:text-sm";

function formatPhoneNumber(value: string) {
  if (!value) return value;
  const digits = value.replace(/[^\d]/g, "");
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export default function LeaseToOwnForm({ onSuccess }: LeaseToOwnFormProps) {
  const [loader, setLoader] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const country = useSelector((s: RootState) => s.country?.data);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    (window as Window & { __leaseToOwnLeadMeta?: Record<string, string> }).__leaseToOwnLeadMeta =
      {
        lead_type: "lease_to_own",
        lead_source: utmSource || "PDP Lease to Own",
        landing_page: window.location.pathname,
      };
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      full_name: "",
      phone: "",
      email: "",
      company_name: "",
      notes: "",
      check: false,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      if (RECAPTCHA_ENABLED && !recaptchaToken) {
        setCaptchaError(true);
        return;
      }

      const meta =
        (window as Window & { __leaseToOwnLeadMeta?: Record<string, string> })
          .__leaseToOwnLeadMeta || {
          lead_type: "lease_to_own",
          lead_source: "PDP Lease to Own",
          landing_page: window.location.pathname,
        };

      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("company_name", values.company_name || "");
      // Backend expects restaurant_type on inquiries; send a stable label for this flow
      formData.append("restaurant_type", "Lease to Own");
      formData.append("notes", values.notes || "");
      formData.append("lead_type", meta.lead_type);
      formData.append("lead_source", meta.lead_source);
      formData.append("landing_page", meta.landing_page);
      formData.append("g_recaptcha_response", recaptchaToken ?? "");

      setLoader(true);
      setFormMessage(null);
      try {
        const response = await axiosInstance.post(
          "/frontend/inquiries",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        if (response?.data?.success === true) {
          resetForm();
          setRecaptchaToken(null);
          onSuccess();
        } else {
          setFormMessage({
            type: "error",
            text:
              response?.data?.message ||
              "Something went wrong, please try again.",
          });
        }
      } catch (error) {
        console.error("Error submitting lease-to-own form:", error);
        setFormMessage({
          type: "error",
          text: "Something went wrong, please try again.",
        });
      } finally {
        setLoader(false);
      }
    },
  });

  return (
    <form className="bg-white space-y-4" onSubmit={formik.handleSubmit}>
      {formMessage?.type === "error" && (
        <div className="text-sm px-4 py-3 rounded-md bg-red-50 text-red-700 border border-red-200">
          {formMessage.text}
        </div>
      )}

      <div>
        <label
          htmlFor="lto_full_name"
          className="block text-[#2D2D2D] font-bold text-sm"
        >
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="lto_full_name"
          placeholder="Your name"
          className={inputClass}
          {...formik.getFieldProps("full_name")}
        />
        {formik.touched.full_name && formik.errors.full_name && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.full_name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="lto_phone"
          className="block text-[#2D2D2D] font-bold text-sm"
        >
          Mobile number <span className="text-red-600">*</span>
        </label>
        <div className="relative flex items-center mt-2">
          {country?.icon ? (
            <img
              src={country.icon}
              alt=""
              className="absolute left-3 w-5 h-4 object-cover rounded-sm"
            />
          ) : null}
          <span className="absolute left-10 text-sm text-gray-600 font-medium select-none">
            {country?.phone_code ?? "+1"}
          </span>
          <input
            type="text"
            id="lto_phone"
            placeholder="(866) 446-7322"
            className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 pl-18 pr-3 rounded-md placeholder:text-sm"
            value={formik.values.phone}
            onBlur={formik.handleBlur("phone")}
            onChange={(e) =>
              formik.setFieldValue(
                "phone",
                formatPhoneNumber(e.target.value),
                true,
              )
            }
          />
        </div>
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="lto_email"
          className="block text-[#2D2D2D] font-bold text-sm"
        >
          Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          id="lto_email"
          placeholder="you@restaurant.com"
          className={inputClass}
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="lto_company"
          className="block text-[#2D2D2D] font-bold text-sm"
        >
          Restaurant or cafe name{" "}
          <span className="font-medium text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          id="lto_company"
          placeholder="Your restaurant or cafe"
          className={inputClass}
          {...formik.getFieldProps("company_name")}
        />
      </div>

      <div>
        <label
          htmlFor="lto_notes"
          className="block text-[#2D2D2D] font-bold text-sm"
        >
          What are you looking to finance?{" "}
          <span className="font-medium text-gray-400">(optional)</span>
        </label>
        <textarea
          id="lto_notes"
          rows={3}
          placeholder="e.g. a new fryer, walk-in cooler, full kitchen buildout"
          className={inputClass}
          {...formik.getFieldProps("notes")}
        />
      </div>

      <div className="flex gap-2 items-start">
        <input
          type="checkbox"
          id="lto_check"
          className={`mt-[4px] cursor-pointer ${
            formik.touched.check && formik.errors.check
              ? "outline outline-2 outline-red-500 rounded"
              : ""
          }`}
          checked={formik.values.check}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="check"
        />
        <p className="text-sm text-[#2D2D2D]">
          By submitting this form, you consent to receive promotional offers
          from Horecastore at the number provided. Consent is not a condition of
          purchase. Message &amp; data rates may apply. Message frequency
          varies. Unsubscribe by replying STOP. Reply HELP for help. Phone
          numbers aren&apos;t shared with third parties.{" "}
          <Link href="/pages/privacy-policy" className="text-blue-500">
            Privacy Policy
          </Link>{" "}
          &{" "}
          <Link href="/pages/return-policy" className="text-blue-500">
            Terms and condition
          </Link>
        </p>
      </div>
      {formik.touched.check && formik.errors.check && (
        <p className="text-red-500 text-sm -mt-2 ml-7">{formik.errors.check}</p>
      )}

      <p className="text-[11.5px] text-center text-gray-400">
        We will never share your details.
      </p>

      {RECAPTCHA_ENABLED && (
        <div className="mt-2">
          <ReCAPTCHA
            sitekey="6LewWvIrAAAAAHWqkx3qesrZpYSrwDa6v8y68AVO"
            onChange={(value) => {
              setRecaptchaToken(value);
              if (value) setCaptchaError(false);
            }}
          />
          {captchaError && !recaptchaToken && (
            <p className="text-red-500 text-sm mt-2">
              Please verify that you are not a robot*
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loader}
        className="bg-[#186737] text-white font-semibold rounded-md text-sm h-[50px] w-full hover:bg-[#155a2e] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loader ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Loading...
          </>
        ) : (
          "See my offer"
        )}
      </button>
    </form>
  );
}
