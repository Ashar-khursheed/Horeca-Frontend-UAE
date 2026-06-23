"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { CustomerProfile, updateProfile } from "@/store/slices/my-profile/profileSlice";
import { useAppSelector } from "@/store/hooks";
import { AppDispatch, RootState } from "@/store/store";
import { updateProfileSchema } from "@/validation/schema";
import { useFormik } from "formik";
import { Building2, ArrowLeft, CheckCircle, ChevronDown, Mail, Phone, Search, Shield, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Field, inputCls } from "./shared";
import { useLocationData } from "@/utils/locationStorage";
import { usePhoneValidation } from "@/hooks/usePhoneValidation";

interface CountryOption {
  id: number;
  name: string;
  phone_code: string;
  icon: string | null;
}

export const PersonalTab = ({ customer }: { customer: CustomerProfile | null }) => {
  const dispatch      = useDispatch<AppDispatch>();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const isFromCheckout = searchParams?.get("mode") === "checkout";
  const locationData  = useLocationData();
  const isoCode       = locationData?.countryCode ?? "";
  const detectedCountry = useAppSelector((s) => s.country.data);
  const [apiStatus, setApiStatus] = useState<"idle" | "success" | "error">("idle");
  const [apiMessage, setApiMessage] = useState("");
  const country       = useSelector((s: RootState) => s.country);
  const countryId     = country?.data?.id as number | undefined;
  const countryName   = (country?.data?.name as string) ?? "";
  const countryIcon   = (country?.data?.icon as string) ?? "";
  // ── Country code dropdown state ──────────────────────────────────────────
  const [countries, setCountries]     = useState<CountryOption[]>([]);
  const [codeOpen, setCodeOpen]       = useState(false);
  const [codeSearch, setCodeSearch]   = useState("");
  const dropdownRef                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    makeApiRequest<{ success: boolean; data: CountryOption[] }>(apiUrls.COUNTRIES)
      .then((res) => setCountries(res.data ?? []))
      .catch(() => {});
  }, []);

  // Pre-set country_code from Redux detected country when customer has none saved
  useEffect(() => {
    if (!detectedCountry?.phone_code) return;
    if (formik.values.country_code) return;          // already set — don't overwrite
    formik.setFieldValue("country_code", detectedCountry.phone_code);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectedCountry]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCodeOpen(false);
        setCodeSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(codeSearch.toLowerCase()) ||
    c.phone_code.includes(codeSearch)
  );

  const initials = customer?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const formik = useFormik({
    initialValues: {
      name:          customer?.name                                ?? "",
      email:         customer?.email                              ?? "",
      country_code:  customer?.country_code                       ?? "",
      mobile_number: customer?.mobile_number                      ?? "",
      type:          customer?.type                               ?? "Private",
      business_name: customer?.business_detail?.business_name     ?? "",
    },
    validationSchema: updateProfileSchema,
    validateOnBlur: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setApiStatus("idle");
      setApiMessage("");
      try {
        const msg = await dispatch(
          updateProfile({
            name:          values.name,
            country_code:  values.country_code,
            mobile_number: values.mobile_number,
            type:          values.type,
            ...(values.type === "Business" && { business_name: values.business_name }),
          })
        ).unwrap();
        setApiStatus("success");
        setApiMessage(msg ?? "Profile updated successfully.");
        setTimeout(() => setApiStatus("idle"), 3000);
      } catch (err: unknown) {
        setApiStatus("error");
        setApiMessage(
          typeof err === "string" ? err
          : (err as { message?: string })?.message ?? "Failed to update profile."
        );
      }
    },
  });

  const phoneValidation = usePhoneValidation(formik.values.mobile_number, isoCode);

  const hasErr = (f: keyof typeof formik.values) =>
    !!(formik.touched[f] && formik.errors[f]);

  return (
    <div className="space-y-5">
      

      {/* Avatar */}
      <div className="flex items-center gap-5 p-5 bg-white rounded-[7px] border border-gray-100 shadow-sm">
        <div className="w-20 h-20 rounded-[7px] bg-[#186737] flex items-center justify-center shadow-md shrink-0">
          <span className="text-white font-black text-2xl">{initials}</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{customer?.name ?? "—"}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{customer?.email ?? "—"}</p>
          <span className={`mt-1.5 inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            customer?.type === "Business" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
          }`}>
            {customer?.type ?? "Private"}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <User size={14} className="text-[#186737]" />
            Personal Information
          </h3>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            if (phoneValidation.validating || phoneValidation.isInvalid) {
              e.preventDefault();
              return;
            }
            formik.handleSubmit(e);
          }}
        >
          <div className="p-5 space-y-4">
            {apiStatus === "success" && (
              <div className="flex items-start gap-3 p-3.5 rounded-[7px] bg-emerald-50 border border-emerald-200">
                <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-emerald-700">{apiMessage}</p>
              </div>
            )}
            {apiStatus === "error" && (
              <div className="flex items-start gap-3 p-3.5 rounded-[7px] bg-red-50 border border-red-200">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zm.75-7a.75.75 0 110 1.5.75.75 0 010-1.5z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-700">{apiMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Full Name" icon={User}>
                  <input
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Your full name"
                    className={`${inputCls} ${hasErr("name") ? "border-red-400 focus:ring-red-100" : ""}`}
                  />
                  {hasErr("name") && <p className="text-[11px] text-red-500 mt-1">{formik.errors.name}</p>}
                </Field>
              </div>

              <Field label="Email Address" icon={Mail}>
                <input
                  type="email"
                  value={formik.values.email}
                  readOnly
                  className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
                />
              </Field>

              <Field label="Account Type" icon={Shield}>
                <Select
                  value={formik.values.type}
                  onValueChange={(val) => formik.setFieldValue("type", val)}
                >
                  <SelectTrigger className={`${inputCls} cursor-not-allowed bg-gray-50 text-gray-400 opacity-100`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-black">
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
                {hasErr("type") && <p className="text-[11px] text-red-500 mt-1">{formik.errors.type}</p>}
              </Field>

              {formik.values.type === "Business" && (
                <div className="sm:col-span-2">
                  <Field label="Business Name" icon={Building2}>
                    <input
                      name="business_name"
                      value={formik.values.business_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Your business name"
                      className={`${inputCls} ${hasErr("business_name") ? "border-red-400 focus:ring-red-100" : ""}`}
                    />
                    {hasErr("business_name") && <p className="text-[11px] text-red-500 mt-1">{formik.errors.business_name}</p>}
                  </Field>
                </div>
              )}

              <Field label="Country Code" icon={Phone}>
                <div ref={dropdownRef} className="relative">
                  {/* Trigger */}
 <div className="flex gap-1.5 items-center cursor-not-allowed w-full border border-gray-100 rounded-md py-2 px-3 text-sm bg-gray-50 text-gray-600 cursor-default outline-none">
                          <img src={countryIcon ?? ""} alt="country image" className="w-4 h-4" />
                            <button
                    type="button"
                    onClick={() => { setCodeOpen((o) => !o); setCodeSearch(""); }}
                    className={` flex items-center !cursor-not-allowed justify-between gap-2 text-left ${
                      hasErr("country_code") ? "border-red-400 focus:ring-red-100s" : "cursor-not-allowed"
                    }`}
                    disabled
                  >
                    <span className={formik.values.country_code ? "text-gray-900" : "text-gray-400"}>
                      {formik.values.country_code
                        ? `${formik.values.country_code}`
                        : "Select country code"}
                    </span>
                    {/* <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${codeOpen ? "rotate-180" : ""}`} /> */}
                  </button>

                        </div>
               

                  {/* Dropdown */}
                  {codeOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-[7px] shadow-lg overflow-hidden">
                      {/* Search */}
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <Search size={13} className="text-gray-400 shrink-0" />
                        <input
                          autoFocus
                          value={codeSearch}
                          onChange={(e) => setCodeSearch(e.target.value)}
                          placeholder="Search country..."
                          className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
                        />
                      </div>
                      {/* List */}
                      <ul className="max-h-52 overflow-y-auto">
                        {filteredCountries.length === 0 ? (
                          <li className="px-3 py-2 text-xs text-gray-400 text-center">No results</li>
                        ) : (
                          filteredCountries.map((c) => (
                            <li key={c.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  formik.setFieldValue("country_code", c.phone_code);
                                  setCodeOpen(false);
                                  setCodeSearch("");
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between gap-2 ${
                                  formik.values.country_code === c.phone_code ? "bg-emerald-50 text-[#186737] font-semibold" : "text-gray-700"
                                }`}
                              >
                                <span>{c.name}</span>
                                <span className="text-xs text-gray-400 shrink-0 font-mono">{c.phone_code}</span>
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                {hasErr("country_code") && <p className="text-[11px] text-red-500 mt-1">{formik.errors.country_code}</p>}
              </Field>

              <Field label="Mobile Number" icon={Phone}>
                <input
                  name="mobile_number"
                  value={formik.values.mobile_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="501234567"
                  className={`${inputCls} ${hasErr("mobile_number") || phoneValidation.isInvalid ? "border-red-400 focus:ring-red-100" : ""}`}
                />
                {phoneValidation.validating && !hasErr("mobile_number") && (
                  <p className="text-[11px] text-gray-400 mt-1">Validating...</p>
                )}
                {hasErr("mobile_number") && <p className="text-[11px] text-red-500 mt-1">{formik.errors.mobile_number}</p>}
                {!hasErr("mobile_number") && phoneValidation.isInvalid && (
                  <p className="text-[11px] text-red-500 mt-1">{phoneValidation.errorMsg}</p>
                )}
              </Field>
            </div>
          </div>

          <div className="px-5 pb-5 flex items-center gap-3">
         <div className="">
             <button
              type="submit"
              disabled={formik.isSubmitting || phoneValidation.isInvalid || phoneValidation.validating}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[7px] text-sm font-semibold transition-all duration-200 bg-[#186737] hover:bg-[#145c30] text-white disabled:opacity-70 ${
                formik.isSubmitting || phoneValidation.isInvalid || phoneValidation.validating
                  ? "!cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {formik.isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
                
         </div>
            <button
              type="button"
              onClick={() => { formik.resetForm(); setApiStatus("idle"); }}
              className="px-5 py-2.5 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

<div className="ml-auto">
          {isFromCheckout && (
        <button
          onClick={() => router.push("/checkout")}
          className="flex items-center gap-1.5 text-sm font-semibold text-red-600 underline hover:underline"
        >
          {/* <ArrowLeft size={14} /> */}
          Return to Checkout
        </button>
      )}
</div>
          </div>
          
        </form>
      </div>
    </div>
  );
};
