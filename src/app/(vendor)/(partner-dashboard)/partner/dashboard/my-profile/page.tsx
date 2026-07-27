"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useFormik } from "formik";
import {
  Banknote,
  Building2,
  CheckCircle,
  CreditCard,
  FileText,
  Globe,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Plus,
  Store,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

// ── Static option lists ─────────────────────────────────────────────────────────
const CREDIT_TERMS = ["Net 60", "Net 45", "Net 30", "Net 15", "Advance"];
const WEBSITE_MARKETS = [
  "United States",
  "United Arab Emirates",
  "Saudi Arabia",
];
const CONTACT_TYPES = [
  "Sales",
  "Account/Finance",
  "Order Processing",
  "Marketing",
  "Customer Service",
  "Ecommerce",
  "Product Specialist",
  "Administration",
  "Owner/Director",
];
const BUSINESS_TYPES = [
  "Manufacturer",
  "Distributor",
  "Wholesaler",
  "Retailer",
  "Other",
];
const DOMAINS = [
  "Hospitality & Food Service",
  "Retail",
  "Wholesale Distribution",
  "Manufacturing",
  "Other",
];
const MAX_CONTACTS = 5;

// ── Lookup types ─────────────────────────────────────────────────────────────────
interface CountryItem {
  id: number;
  name: string;
  phone_code: string;
  icon: string | null;
}
interface CountriesResponse {
  message: string;
  data: CountryItem[];
}

interface ContactEntry {
  type: string;
  name: string;
  email: string;
  mobile_number: string;
}

const EMPTY_CONTACT: ContactEntry = {
  type: "",
  name: "",
  email: "",
  mobile_number: "",
};

// ── Validation ────────────────────────────────────────────────────────────────
const contactSchema = Yup.object({
  type: Yup.string().required("Required"),
  name: Yup.string().trim().required("Required"),
  email: Yup.string().trim().email("Invalid email").required("Required"),
  mobile_number: Yup.string()
    .trim()
    .required("Required")
    .matches(/^\d+$/, "Digits only"),
});

const vendorProfileSchema = Yup.object({
  vendor_name: Yup.string().trim().required("Vendor name is required"),
  vendor_website: Yup.string()
    .trim()
    .url("Enter a valid URL (e.g. https://example.com)")
    .notRequired(),
  credit_limit: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be 0 or greater")
    .required("Credit limit is required"),
  credit_terms: Yup.string().required("Credit terms is required"),
  our_website: Yup.array().of(Yup.string()),
  contacts: Yup.array()
    .of(contactSchema)
    .min(1, "At least one contact is required")
    .max(MAX_CONTACTS, `Maximum ${MAX_CONTACTS} contacts allowed`),
  country: Yup.string().required("Country is required"),
  zip_code: Yup.string().trim().required("ZIP code is required"),
  address: Yup.string().trim().required("Address is required"),
  business_type: Yup.string().required("Type is required"),
  domain: Yup.string().required("Domain is required"),
  dropshipping: Yup.string().required("Dropshipping is required"),
  business_license_no: Yup.string()
    .trim()
    .required("Business License No. is required"),
});

const inputCls =
  "w-full h-10 px-3 rounded-[7px] border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white";
const errCls =
  "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100";

function Field({
  label,
  required,
  error,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | false | null;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-gray-400" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function FileUploadField({
  label,
  required,
  file,
  currentUrl,
  accept,
  hint,
  error,
  onFileChange,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  currentUrl?: string | null;
  accept: string;
  hint: string;
  error?: string | null;
  onFileChange: (f: File | null) => void;
}) {
  const inputId = `vendor-file-${label.replace(/\s/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        <FileText size={12} className="text-gray-400" />
        {label}
        {required && <span className="text-red-500">*</span>}
        <span className="font-normal text-gray-400">({hint})</span>
      </label>

      {file && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[7px] bg-blue-50 border border-blue-200 text-xs">
          <Paperclip size={12} className="text-blue-600 shrink-0" />
          <span className="text-blue-700 font-semibold truncate flex-1">
            {file.name}
          </span>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="text-blue-400 hover:text-red-500 transition-colors shrink-0"
          >
            <X size={13} />
          </button>
        </div>
      )}
      {!file && currentUrl && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[7px] bg-emerald-50 border border-emerald-200 text-xs">
          <Paperclip size={12} className="text-emerald-600 shrink-0" />
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-semibold truncate hover:underline flex-1"
          >
            View current file
          </a>
        </div>
      )}

      <label
        htmlFor={inputId}
        className={`flex items-center gap-2 px-3 py-2 rounded-[7px] border border-dashed text-xs font-semibold cursor-pointer transition-all ${
          error
            ? "border-red-300 text-red-500 hover:bg-red-50"
            : "border-gray-300 text-gray-500 hover:border-[#186737] hover:text-[#186737] hover:bg-[#f0f9f4]"
        }`}
      >
        <Upload size={13} />
        {file ? "Replace file" : "Choose file"}
      </label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          onFileChange(f);
          e.target.value = "";
        }}
      />
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

export default function PartnerProfilePage() {
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [taxFile, setTaxFile] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ license?: string }>({});

  useEffect(() => {
    setCountriesLoading(true);
    makeApiRequest<CountriesResponse>(apiUrls.COUNTRIES)
      .then((res) => setCountries(res.data ?? []))
      .catch(() => setCountries([]))
      .finally(() => setCountriesLoading(false));
  }, []);

  const formik = useFormik({
    initialValues: {
      vendor_name: "",
      vendor_website: "",
      credit_limit: "",
      credit_terms: "",
      our_website: [] as string[],
      contacts: [{ ...EMPTY_CONTACT }] as ContactEntry[],
      country: "",
      zip_code: "",
      address: "",
      business_type: "",
      domain: "",
      dropshipping: "",
      business_license_no: "",
    },
    validationSchema: vendorProfileSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      const errs: { license?: string } = {};
      if (!licenseFile) errs.license = "Business License file is required";
      setFileErrors(errs);
      if (Object.keys(errs).length > 0) return;

      setSubmitting(true);
      // NOTE: no vendor-profile-update API exists yet — simulated submit for UI purposes.
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitting(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const err = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field]
      ? (formik.errors[field] as string)
      : undefined;

  const contactErr = (i: number, field: keyof ContactEntry) => {
    const touched = formik.touched.contacts?.[i]?.[field];
    const errors = formik.errors.contacts;
    if (!touched || !Array.isArray(errors)) return undefined;
    const entry = errors[i];
    return typeof entry === "object" && entry
      ? (entry as Record<string, string>)[field]
      : undefined;
  };

  const contactsArrayError =
    typeof formik.errors.contacts === "string"
      ? formik.errors.contacts
      : undefined;

  const toggleMarket = (market: string) => {
    const set = new Set(formik.values.our_website);
    if (set.has(market)) set.delete(market);
    else set.add(market);
    formik.setFieldValue("our_website", Array.from(set));
  };

  const addContact = () => {
    if (formik.values.contacts.length >= MAX_CONTACTS) return;
    formik.setFieldValue("contacts", [
      ...formik.values.contacts,
      { ...EMPTY_CONTACT },
    ]);
  };

  const removeContact = (i: number) => {
    if (formik.values.contacts.length <= 1) return;
    formik.setFieldValue(
      "contacts",
      formik.values.contacts.filter((_, idx) => idx !== i),
    );
  };

  const setContactField = (
    i: number,
    field: keyof ContactEntry,
    value: string,
  ) => {
    const next = formik.values.contacts.map((c, idx) =>
      idx === i ? { ...c, [field]: value } : c,
    );
    formik.setFieldValue("contacts", next);
  };

  const touchContactField = (i: number, field: keyof ContactEntry) => {
    formik.setFieldTouched(`contacts[${i}].${field}`, true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-full">
      {/* Header */}
      <div className="flex justify-between items-center ">
         <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Store Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete your vendor onboarding details. Fields marked with{" "}
          <span className="text-red-500">*</span> are required.
        </p>
      </div>
         <div>
           <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {submitting ? "Saving…" : "Save Changes"}
          </button>
         </div>
        </div>
     

      {saved && (
        <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-[7px] text-sm text-emerald-700 font-medium">
          <CheckCircle size={16} className="shrink-0" />
          Store profile saved successfully.
        </div>
      )}

      <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
       <div className="grid grid-cols-2 gap-5">
 {/* ── Vendor Information ─────────────────────────────────────────── */}
        <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4 ">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Store size={15} className="text-[#186737]" />
            Vendor Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Vendor Name"
              required
              error={err("vendor_name")}
              icon={Building2}
            >
              <input
                name="vendor_name"
                value={formik.values.vendor_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your store/vendor name"
                className={`${inputCls} ${err("vendor_name") ? errCls : ""}`}
              />
            </Field>
            <Field
              label="Vendor Website"
              error={err("vendor_website")}
              icon={Globe}
            >
              <input
                name="vendor_website"
                value={formik.values.vendor_website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://yourstore.com"
                className={`${inputCls} ${err("vendor_website") ? errCls : ""}`}
              />
            </Field>
            <Field
              label="Credit Limit"
              required
              error={err("credit_limit")}
              icon={Banknote}
            >
              <input
                type="number"
                min={0}
                name="credit_limit"
                value={formik.values.credit_limit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="0.00"
                className={`${inputCls} ${err("credit_limit") ? errCls : ""}`}
              />
            </Field>
            <Field
              label="Credit Terms"
              required
              error={err("credit_terms")}
              icon={CreditCard}
            >
              <select
                name="credit_terms"
                value={formik.values.credit_terms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputCls} cursor-pointer ${err("credit_terms") ? errCls : ""}`}
              >
                <option value="">Select Credit Terms</option>
                {CREDIT_TERMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Our Website — markets multi-select */}
          <div className="pt-2 border-t border-gray-50">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Our Website
            </p>
            <div className="flex flex-wrap gap-4">
              {WEBSITE_MARKETS.map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formik.values.our_website.includes(m)}
                    onChange={() => toggleMarket(m)}
                    className="w-4 h-4 rounded border-gray-300 text-[#186737] focus:ring-[#186737]/30 cursor-pointer"
                  />
                  {m}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact Details ────────────────────────────────────────────── */}
        <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Users size={15} className="text-[#186737]" />
              Contact Details ({formik.values.contacts.length}/{MAX_CONTACTS})
            </h2>
            <button
              type="button"
              onClick={addContact}
              disabled={formik.values.contacts.length >= MAX_CONTACTS}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-[#186737]/10 text-[#186737] hover:bg-[#186737] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Add another contact"
            >
              <Plus size={15} />
            </button>
          </div>

          {contactsArrayError && (
            <p className="text-[11px] text-red-500">{contactsArrayError}</p>
          )}

          <div className="space-y-4">
            {formik.values.contacts.map((contact, i) => (
              <div
                key={i}
                className="border border-dashed border-gray-200 rounded-[7px] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-500">
                    Contact {i + 1}
                  </p>
                  {formik.values.contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContact(i)}
                      className="w-6 h-6 rounded-[6px] flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      title="Remove contact"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Select Type"
                    required
                    error={contactErr(i, "type")}
                  >
                    <select
                      value={contact.type}
                      onChange={(e) =>
                        setContactField(i, "type", e.target.value)
                      }
                      onBlur={() => touchContactField(i, "type")}
                      className={`${inputCls} cursor-pointer ${contactErr(i, "type") ? errCls : ""}`}
                    >
                      <option value="">Select</option>
                      {CONTACT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Name" required error={contactErr(i, "name")}>
                    <input
                      value={contact.name}
                      onChange={(e) =>
                        setContactField(i, "name", e.target.value)
                      }
                      onBlur={() => touchContactField(i, "name")}
                      placeholder="Enter Name"
                      className={`${inputCls} ${contactErr(i, "name") ? errCls : ""}`}
                    />
                  </Field>
                  <Field
                    label="Email"
                    required
                    error={contactErr(i, "email")}
                    icon={Mail}
                  >
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) =>
                        setContactField(i, "email", e.target.value)
                      }
                      onBlur={() => touchContactField(i, "email")}
                      placeholder="Enter Email"
                      className={`${inputCls} ${contactErr(i, "email") ? errCls : ""}`}
                    />
                  </Field>
                  <Field
                    label="Mobile Number"
                    required
                    error={contactErr(i, "mobile_number")}
                    icon={Phone}
                  >
                    <input
                      value={contact.mobile_number}
                      onChange={(e) =>
                        setContactField(i, "mobile_number", e.target.value)
                      }
                      onBlur={() => touchContactField(i, "mobile_number")}
                      placeholder="Enter mobile number"
                      className={`${inputCls} ${contactErr(i, "mobile_number") ? errCls : ""}`}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </section>
       </div>

       <div className="grid grid-cols-2 gap-5">
         {/* ── Business Address ───────────────────────────────────────────── */}
        <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={15} className="text-[#186737]" />
            Business Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Country" required error={err("country")}>
              <SearchableSelect
                options={countries}
                value={formik.values.country}
                onChange={(name) => {
                  formik.setFieldValue("country", name);
                  formik.setFieldTouched("country", true, false);
                }}
                placeholder="Select Country"
                searchPlaceholder="Search country…"
                loading={countriesLoading}
                error={!!err("country")}
              />
            </Field>
            <Field label="Zip Code" required error={err("zip_code")}>
              <input
                name="zip_code"
                value={formik.values.zip_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter zip code"
                className={`${inputCls} ${err("zip_code") ? errCls : ""}`}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address" required error={err("address")}>
                <input
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter business address"
                  className={`${inputCls} ${err("address") ? errCls : ""}`}
                />
              </Field>
            </div>
            <Field label="Type" required error={err("business_type")}>
              <select
                name="business_type"
                value={formik.values.business_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputCls} cursor-pointer ${err("business_type") ? errCls : ""}`}
              >
                <option value="">Select Type</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Domain" required error={err("domain")}>
              <select
                name="domain"
                value={formik.values.domain}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputCls} cursor-pointer ${err("domain") ? errCls : ""}`}
              >
                <option value="">Select Domain</option>
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Dropshipping" required error={err("dropshipping")}>
              <select
                name="dropshipping"
                value={formik.values.dropshipping}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputCls} cursor-pointer ${err("dropshipping") ? errCls : ""}`}
              >
                <option value="">Select Dropshipping</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>
            <Field
              label="Business License No. / Employer Identification No."
              required
              error={err("business_license_no")}
            >
              <input
                name="business_license_no"
                value={formik.values.business_license_no}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Business License No."
                className={`${inputCls} ${err("business_license_no") ? errCls : ""}`}
              />
            </Field>
          </div>
        </section>

        {/* ── Documents ───────────────────────────────────────────────────── */}
        <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FileText size={15} className="text-[#186737]" />
            Documents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUploadField
              label="Logo"
              file={logoFile}
              accept=".webp,.png"
              hint="webp, .png"
              onFileChange={setLogoFile}
            />
            <FileUploadField
              label="Business License"
              required
              file={licenseFile}
              accept="application/pdf"
              hint="pdf"
              error={fileErrors.license}
              onFileChange={(f) => {
                setLicenseFile(f);
                setFileErrors((p) => ({ ...p, license: undefined }));
              }}
            />
            <FileUploadField
              label="Tax Certificate"
              file={taxFile}
              accept="application/pdf"
              hint="pdf"
              onFileChange={setTaxFile}
            />
          </div>
        </section>
       </div>

        
      </form>
    </div>
  );
}
