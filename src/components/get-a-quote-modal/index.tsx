"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CheckCircle, Minus, Plus } from "lucide-react";
import { Modal } from "@/components/modal";
import type { ApiProduct, RawApiProduct } from "@/components/product-card";
import { useAppSelector } from "@/store/hooks";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { SearchableSelect } from "@/components/ui/searchable-select";

type LS = { en?: string; ar?: string } | string;

interface LookupItem { id: number; name: string; }
interface LookupResponse { success: boolean; data: LookupItem[]; }

const resolveName = (v: LS | undefined): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v.en ?? v.ar ?? "";
};

const resolveImages = (
  images: string[] | { en?: string[]; ar?: string[] } | undefined
): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  return images.en ?? images.ar ?? [];
};

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  phone: Yup.string()
    .trim()
    .matches(/^[+\d\s\-().]{7,20}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  notes: Yup.string().trim().required("Notes are required"),
  address: Yup.string(),
  zipCode: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
});

interface GetAQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ApiProduct | RawApiProduct;
  country?: string;
}

const GetAQuoteModal = ({ isOpen, onClose, product, country }: GetAQuoteModalProps) => {
  const countryData = useAppSelector((s) => s.country.data);
  const countryId   = countryData?.id;
  const countryName = country ?? countryData?.name ?? "";


  const minQty =
    (product as ApiProduct).min_quantity ??
    (product as RawApiProduct).min_quantity ??
    1;

  const [qty, setQty]                     = useState(minQty);
  const [submitted, setSubmitted]         = useState(false);
  const [states, setStates]               = useState<LookupItem[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [apiError, setApiError]           = useState<string | null>(null);
  const [countdown, setCountdown]         = useState(3);

  useEffect(() => {
    if (!submitted) return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); onClose(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, onClose]);

  const productName = resolveName(product.name as LS);
  const images      = resolveImages(
    (product as RawApiProduct).images as string[] | { en?: string[]; ar?: string[] }
  );
  const thumbnail = images[0] ?? "";
  const sku       = (product as ApiProduct).sku ?? (product as RawApiProduct).sku ?? "";

  // Fetch states whenever modal opens and countryId is known
  useEffect(() => {
    if (!isOpen || !countryId) return;
    setStatesLoading(true);
    setStates([]);
    makeApiRequest<LookupResponse>("frontend/countries/lookup", {
      params: { country_id: countryId, type: "states" },
    })
      .then((res) => setStates(res.data ?? []))
      .finally(() => setStatesLoading(false));
  }, [isOpen, countryId]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      zipCode: "",
      city: "",
      state: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      setApiError(null);
      try {
        await makeApiRequest(apiUrls.MADE_TO_ORDER, {
          method: "POST",
          data: {
            product_id:   product.id,
            quantity:     qty,
            name:         values.name.trim(),
            email:        values.email.trim(),
            phone_number: values.phone.trim(),
            address:      values.address.trim() || null,
            city:         values.city.trim() || null,
            state:        values.state || null,
            country:      countryName || null,
            zipcode:      values.zipCode.trim() || null,
            notes:        values.notes.trim(),
          },
        });
        setSubmitted(true);
        helpers.resetForm();
        setQty(minQty);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Something went wrong. Please try again.";
        setApiError(msg);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setSubmitted(false);
    setApiError(null);
    onClose();
  };

  const inputClass = (field: keyof typeof formik.values) =>
    `w-full border rounded-md py-2 px-3 text-sm outline-none transition-all placeholder:text-gray-400 ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
    }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Get a Quote"
      width="max-w-2xl"
      showFooter={false}
      zIndex={true}
    >
      {submitted ? (
        <div className="flex flex-col items-center justify-center pb-0 px-8">
          {/* Animated Success Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-105">
              <CheckCircle
                className="w-16 h-16 text-white animate-bounce"
                strokeWidth={2.5}
              />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Your Request Submitted Successfully!
            </h2>
            {/* <p className="text-xl text-black font-medium">
              Thank you for your Quotation we will get back to you shortly.
            </p> */}
            <p className="text-base text-black max-w-md mx-auto">
              We&apos;ve received your Quotation and will process it shortly. You&apos;ll
              receive a confirmation email soon.
            </p>
            <p className="text-sm text-gray-400">Closing in {countdown}s...</p>
          </div>

          {/* Decorative Elements */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse delay-150"></div>
          </div>

          {/* Auto Close Message */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-3">
            <p className="text-sm text-black flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              Closing automatically in 3 seconds...
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-2">
          {/* Product summary */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            {thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt={productName}
                className="w-16 h-16 object-contain rounded-md shrink-0 bg-white border border-gray-100"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 line-clamp-2">{productName}</p>
              {sku && <p className="text-xs text-gray-500 mt-0.5">Model No: {sku}</p>}
            </div>
            {/* Qty counter */}
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
              >
                <Minus size={13} strokeWidth={2} />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-gray-800 select-none">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
              >
                <Plus size={13} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...formik.getFieldProps("name")}
                  className={inputClass("name")}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...formik.getFieldProps("email")}
                  className={inputClass("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <input
                type="text"
                placeholder="123 Main Street"
                {...formik.getFieldProps("address")}
                className={inputClass("address")}
              />
            </div>
   {/* State / Country / Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                {/* <img src={countryData?.icon ?? null} alt="" /> */}
                 <div className="flex gap-1.5 items-center w-full border border-gray-100 rounded-md py-2 px-3 text-sm bg-gray-50 text-gray-600 cursor-default outline-none">
                          <img src={countryData?.icon ?? ""} alt="country image" className="w-4 h-4" />
                          <span>{countryName}</span>

                        </div>
                {/* <input
                  type="text"
                  value={countryName}
                  readOnly
                  className="w-full border border-gray-100 rounded-md py-2 px-3 text-sm bg-gray-50 text-gray-600 cursor-default outline-none"
                /> */}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                <SearchableSelect
                  options={states}
                  value={formik.values.state}
                  onChange={(name) => formik.setFieldValue("state", name)}
                  placeholder="Select State"
                  searchPlaceholder="Search state…"
                  loading={statesLoading}
                  disabled={!countryId || statesLoading}
                  error={!!(formik.touched.state && formik.errors.state)}
                />
                {formik.touched.state && formik.errors.state && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.state}</p>
                )}
              </div>
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="New York"
                  {...formik.getFieldProps("city")}
                  className={inputClass("city")}
                />
              </div>
             
            </div>
            {/* Zip / City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  placeholder="12345"
                  {...formik.getFieldProps("zipCode")}
                  className={inputClass("zipCode")}
                />
              </div>
          
               <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="(123) 456-7890"
                  {...formik.getFieldProps("phone")}
                  className={inputClass("phone")}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
                )}
              </div>
            </div>

         

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Enter your notes <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Your message..."
                {...formik.getFieldProps("notes")}
                className={`${inputClass("notes")} resize-none`}
              />
              {formik.touched.notes && formik.errors.notes && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.notes}</p>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 font-medium">
                {apiError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full h-11 bg-[#A6131D] hover:bg-[#8b1018] disabled:bg-gray-400 text-white text-sm font-bold rounded-md transition-colors"
            >
              {formik.isSubmitting ? "Sending..." : "Submit Quote Request"}
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default GetAQuoteModal;
