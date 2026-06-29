// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type FormType = "Business" | "Restaurant" | "Hotel";

// interface RestaurantFormProps {
//   onClose?: () => void;
//   type?: FormType;
// }

// interface SelectOption {
//   value: string;
//   label: string;
// }

// // ─── Data ─────────────────────────────────────────────────────────────────────
// const hotelTypes: SelectOption[] = [
//   { value: "", label: "Select Type" },
//   { value: "Motel", label: "Motel" },
//   { value: "Budget / 1-Star Hotel", label: "Budget / 1-Star Hotel" },
//   { value: "Economy / 2-Star Hotel", label: "Economy / 2-Star Hotel" },
//   { value: "Standard / 3-Star Hotel", label: "Standard / 3-Star Hotel" },
//   { value: "Upscale / 4-Star Hotel", label: "Upscale / 4-Star Hotel" },
//   { value: "Luxury / 5-Star Hotel", label: "Luxury / 5-Star Hotel" },
//   {
//     value: "Hotel Apartment / Serviced Apartment",
//     label: "Hotel Apartment / Serviced Apartment",
//   },
//   { value: "Resort", label: "Resort" },
//   { value: "Boutique Hotel", label: "Boutique Hotel" },
//   { value: "Business Hotel", label: "Business Hotel" },
//   { value: "Extended Stay", label: "Extended Stay" },
//   { value: "Hostel / Guest House", label: "Hostel / Guest House" },
//   { value: "Palace / Heritage Hotel", label: "Palace / Heritage Hotel" },
// ];

// const businessTypes: SelectOption[] = [
//   { value: "", label: "Select Type" },
//   { value: "Hotels", label: "Hotels" },
//   { value: "Restaurants", label: "Restaurants" },
//   { value: "Fast Food & Takeaway", label: "Fast Food & Takeaway" },
//   { value: "Cafés & Bakeries", label: "Cafés & Bakeries" },
//   { value: "Breakfast/Brunch", label: "Breakfast/Brunch" },
//   { value: "Food Trucks & Street Food", label: "Food Trucks & Street Food" },
//   { value: "Catering Services", label: "Catering Services" },
//   { value: "Ghost/Cloud Kitchen", label: "Ghost/Cloud Kitchen" },
//   { value: "Reseller/Trading", label: "Reseller/Trading" },
//   { value: "Others", label: "Others" },
// ];

// // ─── Component ────────────────────────────────────────────────────────────────
// function RestaurantForm({ onClose, type }: RestaurantFormProps) {
//   const [selectedFileName, setSelectedFileName] = useState<string>("");
//   const [isChecked, setIsChecked] = useState<boolean>(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       setSelectedFileName(
//         Array.from(files)
//           .map((file) => file.name)
//           .join(", ")
//       );
//     } else {
//       setSelectedFileName("");
//     }
//   };

//   const getFilePlaceholder = (): string => {
//     if (type === "Business") return "Attach BOQ, or RFQ if available";
//     if (type === "Restaurant")
//       return "Attach Restaurant Renderings, BOQ, or RFQ if available";
//     return "Attach Hotel Renderings, BOQ, or RFQ if available";
//   };

//   const getCompanyLabel = (): string => {
//     if (type === "Business") return "Business Name*";
//     if (type === "Restaurant") return "Restaurant Name*";
//     return "Hotel Name*";
//   };

//   const getCompanyPlaceholder = (): string => {
//     if (type === "Business") return "Business Name";
//     if (type === "Restaurant") return "Restaurant Name";
//     return "Hotel Name";
//   };

//   const getTypeLabel = (): string => {
//     if (type === "Business") return "Business Type*";
//     if (type === "Restaurant") return "Restaurant Type*";
//     return "Hotel Type*";
//   };

//   const typeOptions: SelectOption[] =
//     type === "Business" ? businessTypes : hotelTypes;

//   return (
//     <>
//       <div>
//         <form
//           id="contactForm"
//           className="bg-[#fff] p-3 pt-0 rounded-md space-y-4"
//         >
//           {/* Full Name Field */}
//           <div>
//             <label
//               htmlFor="full_name"
//               className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
//             >
//               Full Name <span className="text-red-600">*</span>
//             </label>
//             <input
//               type="text"
//               id="full_name"
//               name="full_name"
//               placeholder="Jhon Smith"
//               className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
//             />
//           </div>

//           <div className="md:flex block gap-5 justify-between">
//             {/* Phone Number Field */}
//             <div className="w-full mb-4 md:mb-0">
//               <label
//                 htmlFor="phone"
//                 className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
//               >
//                 Phone Number<span className="text-red-600">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="phone"
//                 name="phone"
//                 placeholder="(234) 567-8900"
//                 className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
//               />
//             </div>

//             {/* Email Field */}
//             <div className="w-full">
//               <label
//                 htmlFor="email"
//                 className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
//               >
//                 Email Address<span className="text-red-600">*</span>
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="you@example.com"
//                 className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
//               />
//             </div>
//           </div>

//           <div className="md:flex block gap-5 justify-between">
//             {/* Company Name Field */}
//             <div className="w-full mb-4 md:mb-0">
//               <label
//                 htmlFor="company_name"
//                 className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
//               >
//                 {getCompanyLabel()}
//               </label>
//               <input
//                 type="text"
//                 id="company_name"
//                 name="company_name"
//                 placeholder={getCompanyPlaceholder()}
//                 className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
//               />
//             </div>

//             {/* Type Field */}
//             <div className="w-full">
//               <label
//                 htmlFor="restaurant_type"
//                 className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
//               >
//                 {getTypeLabel()}
//               </label>
//               <select
//                 id="restaurant_type"
//                 name="restaurant_type"
//                 className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
//               >
//                 {typeOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* File Upload Field */}
//           <div className="w-full">
//             <label
//               htmlFor="files"
//               className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
//             >
//               Upload Files (Optional)
//             </label>

//             <div className="flex items-center w-full border border-gray-200 transition-all focus-within:border-[#186737] focus-within:ring-2 focus-within:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 bg-white overflow-hidden">
//               {/* Hidden Input */}
//               <input
//                 type="file"
//                 id="files"
//                 name="files"
//                 className="hidden"
//                 multiple
//                 accept=".pdf,.doc,.docx,.xls,.xlsx"
//                 onChange={handleFileChange}
//               />

//               {/* Button */}
//               <label
//                 htmlFor="files"
//                 className="cursor-pointer px-3 py-1 bg-gray-100 text-[#2D2D2D] font-medium text-sm border-r border-gray-200"
//               >
//                 Choose Files
//               </label>

//               {/* Show file names */}
//               <span className="px-3 text-sm text-black truncate">
//                 {selectedFileName || getFilePlaceholder()}
//               </span>
//             </div>

//             <p className="text-sm text-gray-400 mt-1">
//               PDF, Word, Excel — max 10MB
//             </p>
//           </div>

//           {/* Notes Field */}
//           <div>
//             <label
//               htmlFor="notes"
//               className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
//             >
//               Notes
//             </label>
//             <textarea
//               id="notes"
//               name="notes"
//               rows={4}
//               placeholder="Your message..."
//               className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
//             ></textarea>
//           </div>

//           {/* Terms Checkbox */}
//           <div className="flex gap-2 items-start">
//             <input
//               type="checkbox"
//               id="check"
//               name="check"
//               className="mt-[4px] cursor-pointer"
//               checked={isChecked}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setIsChecked(e.target.checked)
//               }
//             />
//             <p className="text-sm">
//               By submitting this form, you consent to receive promotional offers
//               from Horecastore at the number provided. Consent is not a
//               condition of purchase. Message & data rates may apply. Message
//               frequency varies. Unsubscribe by replying STOP. Reply HELP for
//               help. Phone numbers aren&apos;t shared with third parties.{" "}
//               <span>
//                 <Link
//                   href="/pages/privacy-policy"
//                   className="text-blue-500"
//                 >
//                   Privacy Policy
//                 </Link>{" "}
//                 &{" "}
//                 <Link
//                   href="/pages/return-policy"
//                   className="text-blue-500"
//                 >
//                   Terms and condition
//                 </Link>
//               </span>
//             </p>
//           </div>

//           {/* reCAPTCHA placeholder */}
//           {/* <div className="mt-4">
//             <div className="flex items-center gap-3 border border-gray-200 rounded-md p-3 bg-white w-fit">
//               <div className="w-5 h-5 border-2 border-gray-200 rounded flex-shrink-0" />
//               <span className="text-sm text-gray-500">I&apos;m not a robot</span>
//               <div className="ml-4 w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
//                 <span className="text-[10px] text-gray-400 text-center leading-tight">
//                   reCAPTCHA
//                 </span>
//               </div>
//             </div>
//           </div> */}

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               className="bg-[#186737] text-white font-semibold rounded-md text-sm h-[50px] w-full hover:bg-[#155a2e] transition-colors flex items-center justify-center gap-2"
//             >
//               Let&apos;s Open Together
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }

// export default RestaurantForm;


"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import axiosInstance from "@/apis/axios-instance";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

// ─── Types ────────────────────────────────────────────────────────────────────
type FormType = "Business" | "Restaurant" | "Hotel";

interface RestaurantFormProps {
  onClose?: () => void;
  type?: FormType;
}

interface SelectOption {
  value: string;
  label: string;
}

interface FormValues {
  full_name: string;
  phone: string;
  email: string;
  company_name: string;
  restaurant_type: string;
  files?: FileList;
  notes?: string;
  check: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const hotelTypes: SelectOption[] = [
  { value: "", label: "Select Type" },
  { value: "Motel", label: "Motel" },
  { value: "Budget / 1-Star Hotel", label: "Budget / 1-Star Hotel" },
  { value: "Economy / 2-Star Hotel", label: "Economy / 2-Star Hotel" },
  { value: "Standard / 3-Star Hotel", label: "Standard / 3-Star Hotel" },
  { value: "Upscale / 4-Star Hotel", label: "Upscale / 4-Star Hotel" },
  { value: "Luxury / 5-Star Hotel", label: "Luxury / 5-Star Hotel" },
  {
    value: "Hotel Apartment / Serviced Apartment",
    label: "Hotel Apartment / Serviced Apartment",
  },
  { value: "Resort", label: "Resort" },
  { value: "Boutique Hotel", label: "Boutique Hotel" },
  { value: "Business Hotel", label: "Business Hotel" },
  { value: "Extended Stay", label: "Extended Stay" },
  { value: "Hostel / Guest House", label: "Hostel / Guest House" },
  { value: "Palace / Heritage Hotel", label: "Palace / Heritage Hotel" },
];

const businessTypes: SelectOption[] = [
  { value: "", label: "Select Type" },
  { value: "Hotels", label: "Hotels" },
  { value: "Restaurants", label: "Restaurants" },
  { value: "Fast Food & Takeaway", label: "Fast Food & Takeaway" },
  { value: "Cafés & Bakeries", label: "Cafés & Bakeries" },
  { value: "Breakfast/Brunch", label: "Breakfast/Brunch" },
  { value: "Food Trucks & Street Food", label: "Food Trucks & Street Food" },
  { value: "Catering Services", label: "Catering Services" },
  { value: "Ghost/Cloud Kitchen", label: "Ghost/Cloud Kitchen" },
  { value: "Reseller/Trading", label: "Reseller/Trading" },
  { value: "Others", label: "Others" },
];

// ─── Validation Schema ─────────────────────────────────────────────────────────
const validationSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full Name is required")
    .matches(
      /^[^\s].*[^\s]$|^[^\s]$/,
      "Invalid format: Remove leading/trailing spaces"
    )
    .test(
      "not-empty",
      "Full name cannot be only spaces",
      (value) => !!value && value.trim().length > 0
    ),

  phone: Yup.string()
    .required("Phone Number is required")
    .test(
      "no-whitespace-only",
      "Phone Number cannot be only spaces",
      (value) => !!value && value.trim().length > 0
    )
    .matches(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
      "Please enter a valid US phone number (e.g., +1 (234) 567-8900 or 234-567-8900)"
    ),

  email: Yup.string()
    .required("Email is required")
    .test("no-whitespace", "Email cannot contain spaces", (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    })
    .test(
      "valid-email-format",
      "Please enter a valid email address",
      (value) => {
        if (!value) return true;
        const emailRegex =
          /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
        return emailRegex.test(value);
      }
    )
    .test(
      "valid-domain",
      "Please enter a valid domain (e.g., example.com)",
      (value) => {
        if (!value) return true;
        const parts = value.split("@");
        if (parts.length !== 2) return false;
        const domain = parts[1];
        return (
          domain.includes(".") &&
          domain.split(".").every((part) => part.length > 0)
        );
      }
    )
    .test(
      "no-consecutive-dots",
      "Email cannot have consecutive dots",
      (value) => {
        if (!value) return true;
        return !/\.\./.test(value);
      }
    )
    .lowercase("Email must be in lowercase")
    .trim(),

  company_name: Yup.string()
    .required("This field is required")
    .matches(
      /^[^\s].*[^\s]$|^[^\s]$/,
      "Invalid format: Remove leading/trailing spaces"
    )
    .test(
      "not-empty",
      "Business name cannot be only spaces",
      (value) => !!value && value.trim().length > 0
    ),

  restaurant_type: Yup.string()
    .required("Type is required")
    .test(
      "no-whitespace-only",
      "Please select a valid type",
      (value) => !!value && value.trim().length > 0
    ),

  files: Yup.mixed<FileList>().test(
    "fileSize",
    "File too large (max 10MB)",
    (value) => {
      if (!value || value.length === 0) return true;
      return Array.from(value).every((file) => file.size <= 10 * 1024 * 1024);
    }
  ),

  notes: Yup.string(),

  check: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("You must agree to the terms and conditions"),
});

const RECAPTCHA_ENABLED = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";

// ─── Component ────────────────────────────────────────────────────────────────
function RestaurantForm({ onClose, type }: RestaurantFormProps) {
  const [loader, setLoader] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const country = useSelector((s: RootState) => s.country?.data);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    (window as any).__leadMeta = {
      lead_type: "Web Form",
      lead_source: utmSource || "Organic",
      landing_page: window.location.pathname,
    };
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      full_name: "",
      phone: "",
      email: "",
      company_name: "",
      restaurant_type: "",
      files: undefined,
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

      const meta = (window as any).__leadMeta || {
        lead_type: "Web Form",
        lead_source: "Organic",
        landing_page: window.location.pathname,
      };

      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("company_name", values.company_name);
      formData.append("restaurant_type", values.restaurant_type);
      formData.append("notes", values.notes || "");
      formData.append("lead_type", meta.lead_type);
      formData.append("lead_source", meta.lead_source);
      formData.append("landing_page", meta.landing_page);
      formData.append("g_recaptcha_response", recaptchaToken ?? "");

      if (values.files && values.files.length > 0) {
        Array.from(values.files).forEach((file) => {
          formData.append("files[]", file);
        });
      }

      setLoader(true);
      setFormMessage(null);
      try {
        const response = await axiosInstance.post("/frontend/inquiries", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response?.data?.success === true) {
          setFormMessage({ type: "success", text: response.data.message || "Form submitted successfully!" });
          resetForm();
          setRecaptchaToken(null);
          setSelectedFileName("");
          setTimeout(() => {
            setFormMessage(null);
            onClose?.();
          }, 3000);
        } else {
          setFormMessage({ type: "error", text: response?.data?.message || "Something went wrong, please try again." });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setFormMessage({ type: "error", text: "Something went wrong, please try again." });
      } finally {
        setLoader(false);
      }
    },
  });

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const digits = value.replace(/[^\d]/g, "");
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("phone", formatPhoneNumber(e.target.value), true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      formik.setFieldValue("files", files);
      setSelectedFileName(Array.from(files).map((f) => f.name).join(", "));
    } else {
      formik.setFieldValue("files", undefined);
      setSelectedFileName("");
    }
  };

  const getFilePlaceholder = () => {
    if (type === "Business") return "Attach BOQ, or RFQ if available";
    if (type === "Restaurant") return "Attach Restaurant Renderings, BOQ, or RFQ if available";
    return "Attach Hotel Renderings, BOQ, or RFQ if available";
  };

  const getCompanyLabel = () => {
    if (type === "Business") return "Business Name*";
    if (type === "Restaurant") return "Restaurant Name*";
    return "Hotel Name*";
  };

  const getCompanyPlaceholder = () => {
    if (type === "Business") return "Business Name";
    if (type === "Restaurant") return "Restaurant Name";
    return "Hotel Name";
  };

  const getTypeLabel = () => {
    if (type === "Business") return "Business Type*";
    if (type === "Restaurant") return "Restaurant Type*";
    return "Hotel Type*";
  };

  const typeOptions = type === "Business" ? businessTypes : hotelTypes;
  const inputClass = "w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base";

  return (
    <div>
      <form
        id="contactForm"
        className="bg-[#fff] p-3 pt-0 rounded-md space-y-4"
        onSubmit={formik.handleSubmit}
      >
        {formMessage?.type === "error" && (
          <div className="text-sm px-4 py-3 rounded-md bg-red-50 text-red-700 border border-red-200">
            {formMessage.text}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base">
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="full_name"
            placeholder="Jhon Smith"
            className={inputClass}
            {...formik.getFieldProps("full_name")}
          />
          {formik.touched.full_name && formik.errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.full_name}</p>
          )}
        </div>

        <div className="md:flex block gap-5 justify-between">
          {/* Phone */}
          <div className="w-full mb-4 md:mb-0">
            <label htmlFor="phone" className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base">
              Phone Number<span className="text-red-600">*</span>
            </label>
            <div className="relative flex items-center mt-2">
              <img
                src={country?.icon ?? ""}
                alt="India"
                className="absolute left-3 w-5 h-4 object-cover rounded-sm"
              />
              <span className="absolute left-10 text-sm text-gray-600 font-medium select-none">{country?.phone_code}</span>
              <input
                type="text"
                id="phone"
                placeholder="(234) 567-8900"
                className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 pl-18 pr-3 2xl:py-3 rounded-md placeholder:text-sm 2xl:placeholder:text-base"
                value={formik.values.phone}
                onBlur={formik.handleBlur("phone")}
                onChange={handlePhoneChange}
              />
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="w-full">
            <label htmlFor="email" className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base">
              Email Address<span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className={inputClass}
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
        </div>

        <div className="md:flex block gap-5 justify-between">
          {/* Company Name */}
          <div className="w-full mb-4 md:mb-0">
            <label htmlFor="company_name" className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base">
              {getCompanyLabel()}
            </label>
            <input
              type="text"
              id="company_name"
              placeholder={getCompanyPlaceholder()}
              className={inputClass}
              {...formik.getFieldProps("company_name")}
            />
            {formik.touched.company_name && formik.errors.company_name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.company_name}</p>
            )}
          </div>

          {/* Type */}
          <div className="w-full">
            <label htmlFor="restaurant_type" className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base">
              {getTypeLabel()}
            </label>
            <select
              id="restaurant_type"
              className={inputClass}
              {...formik.getFieldProps("restaurant_type")}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formik.touched.restaurant_type && formik.errors.restaurant_type && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.restaurant_type}</p>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div className="w-full">
          <label htmlFor="files" className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base">
            Upload Files (Optional)
          </label>
          <div className="flex items-center w-full border border-gray-200 transition-all focus-within:border-[#186737] focus-within:ring-2 focus-within:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 bg-white overflow-hidden">
            <input
              type="file"
              id="files"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileChange}
            />
            <label htmlFor="files" className="cursor-pointer px-3 py-1 bg-gray-100 text-[#2D2D2D] font-medium text-sm border-r border-gray-200">
              Choose Files
            </label>
            <span className="px-3 text-sm text-black truncate">
              {selectedFileName || getFilePlaceholder()}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">PDF, Word, Excel — max 10MB</p>
          {formik.touched.files && formik.errors.files && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.files as string}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            placeholder="Your message..."
            className={inputClass}
            {...formik.getFieldProps("notes")}
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex gap-2 items-start">
          <input
            type="checkbox"
            id="check"
            className={`mt-[4px] cursor-pointer ${formik.touched.check && formik.errors.check ? "outline outline-2 outline-red-500 rounded" : ""}`}
            checked={formik.values.check}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="check"
          />
          <p className="text-sm">
            By submitting this form, you consent to receive promotional offers from Horecastore at the number provided. Consent is not a condition of purchase. Message & data rates may apply. Message frequency varies. Unsubscribe by replying STOP. Reply HELP for help. Phone numbers aren&apos;t shared with third parties.{" "}
            <span>
              <Link href="/pages/privacy-policy" className="text-blue-500">Privacy Policy</Link>{" "}
              &{" "}
              <Link href="/pages/return-policy" className="text-blue-500">Terms and condition</Link>
            </span>
          </p>
        </div>
        {formik.touched.check && formik.errors.check && (
          <p className="text-red-500 text-sm -mt-2 ml-7">{formik.errors.check}</p>
        )}

        {/* reCAPTCHA — only in production */}
        {RECAPTCHA_ENABLED && (
          <div className="mt-4">
            <ReCAPTCHA
              sitekey="6LewWvIrAAAAAHWqkx3qesrZpYSrwDa6v8y68AVO"
              onChange={(value) => {
                setRecaptchaToken(value);
                if (value) setCaptchaError(false);
              }}
            />
            {captchaError && !recaptchaToken && (
              <p className="text-red-500 text-sm mt-2">Please verify that you are not a robot*</p>
            )}
          </div>
        )}

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loader}
            className="bg-[#186737] text-white font-semibold rounded-md text-sm h-[50px] w-full hover:bg-[#155a2e] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loader ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Loading...
              </>
            ) : (
              "Let's Open Together"
            )}
          </button>

          {formMessage?.type === "success" && (
            <div className="mt-3 text-sm px-4 py-3 rounded-md bg-green-50 text-green-700 border border-green-200 text-center">
              {formMessage.text}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default RestaurantForm;