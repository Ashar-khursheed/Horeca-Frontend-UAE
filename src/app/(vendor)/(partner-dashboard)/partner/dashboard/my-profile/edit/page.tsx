"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { AppDispatch, RootState } from "@/store/store";
import { fetchVendorProfile } from "@/store/slices/vendor-profile/vendorProfileSlice";
import { fetchCountriesList } from "@/store/slices/customer-address/customerAddressSlice";
import { useFormik } from "formik";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  ChevronRight,
  FileText,
  Globe,
  MapPin,
  Paperclip,
  Phone,
  Save,
  Truck,
  Upload,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

// ── Lookup types ─────────────────────────────────────────────────────────────
interface LookupItem {
  id: number;
  name: string;
}
interface LookupResponse {
  success: boolean;
  data: LookupItem[];
}

// ── Validation ────────────────────────────────────────────────────────────────
const editProfileSchema = Yup.object({
  vendor_name: Yup.string().trim().required("Vendor name is required"),
  vendor_website: Yup.string()
    .trim()
    .url("Enter a valid URL (e.g. https://example.com)")
    .notRequired(),
  contact_name: Yup.string().trim().required("Contact name is required"),
  contact_phone_number: Yup.string()
    .trim()
    .required("Contact phone number is required")
    .matches(/^\d+$/, "Digits only"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  zip_code: Yup.string().trim().required("ZIP code is required"),
  address: Yup.string().trim().required("Address is required"),
  dropshipping: Yup.string().required("Dropshipping is required"),
});

const inputCls =
  "w-full h-10 px-3 rounded-[7px] border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white";
const errCls = "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100";

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
  hint,
  file,
  currentUrl,
  accept,
  onFileChange,
}: {
  label: string;
  hint: string;
  file: File | null;
  currentUrl?: string | null;
  accept: string;
  onFileChange: (f: File | null) => void;
}) {
  const inputId = `edit-profile-file-${label.replace(/\s/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        <FileText size={12} className="text-gray-400" />
        {label}
        <span className="font-normal text-gray-400">({hint})</span>
      </label>

      {file && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[7px] bg-blue-50 border border-blue-200 text-xs">
          <Paperclip size={12} className="text-blue-600 shrink-0" />
          <span className="text-blue-700 font-semibold truncate flex-1">{file.name}</span>
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
        className="flex items-center gap-2 px-3 py-2 rounded-[7px] border border-dashed border-gray-300 text-xs font-semibold text-gray-500 cursor-pointer transition-all hover:border-[#186737] hover:text-[#186737] hover:bg-[#f0f9f4]"
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
    </div>
  );
}

export default function PartnerEditProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { vendor } = useSelector((state: RootState) => state.vendorProfile);
  const { countries, countriesLoading } = useSelector(
    (state: RootState) => state.customerAddress
  );

  useEffect(() => {
    if (!vendor) dispatch(fetchVendorProfile());
    dispatch(fetchCountriesList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [cities, setCities] = useState<LookupItem[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [countryId, setCountryId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [taxFile, setTaxFile] = useState<File | null>(null);

  // Seed country/city ids once the vendor profile has loaded.
  useEffect(() => {
    if (vendor?.country?.id) setCountryId(vendor.country.id);
    if (vendor?.city?.id) setCityId(vendor.city.id);
  }, [vendor?.country?.id, vendor?.city?.id]);

  // Fetch cities directly from the country (no state step needed here).
  useEffect(() => {
    if (!countryId) { setCities([]); return; }
    setCitiesLoading(true);
    setCities([]);
    makeApiRequest<LookupResponse>("frontend/countries/lookup", {
      params: { country_id: countryId, type: "cities" },
    })
      .then((res) => setCities(res.data ?? []))
      .catch(() => setCities([]))
      .finally(() => setCitiesLoading(false));
  }, [countryId]);

  const primaryContact = vendor?.contacts?.[0];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      vendor_name: vendor?.name ?? "",
      vendor_website: vendor?.website_link ?? "",
      contact_name: primaryContact?.name ?? "",
      contact_phone_number: primaryContact?.mobile_number ?? primaryContact?.phone_number ?? "",
      country: vendor?.country?.name ?? "",
      city: vendor?.city?.name ?? "",
      zip_code: vendor?.zipcode ?? "",
      address: vendor?.address ?? "",
      dropshipping: vendor ? (vendor.dropshipping ? "Yes" : "No") : "",
    },
    validationSchema: editProfileSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setSubmitError(null);
      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("contact_name", values.contact_name);
        formData.append("contact_phone_number", values.contact_phone_number);
        formData.append("vendor_name", values.vendor_name);
        if (countryId) formData.append("country_id", String(countryId));
        if (cityId) formData.append("city_id", String(cityId));
        formData.append("address", values.address);
        formData.append("zipcode", values.zip_code);
        formData.append("website_link", values.vendor_website);
        formData.append("dropshipping", values.dropshipping === "Yes" ? "true" : "false");
        if (logoFile) formData.append("logo", logoFile);
        if (taxFile) formData.append("tax_certificate", taxFile);
        if (licenseFile) formData.append("business_licence", licenseFile);

        const res = await makeApiRequest<{ success: boolean; message?: string }>(
          apiUrls.VENDOR_PROFILE,
          { method: "POST", data: formData }
        );

        if (res.success === false) {
          setSubmitError(res.message || "Failed to save profile. Please try again.");
          return;
        }

        await dispatch(fetchVendorProfile());
        setSaved(true);
        setTimeout(() => router.push("/partner/dashboard/my-profile"), 1200);
      } catch (err: any) {
        setSubmitError(
          err?.response?.data?.message || "Failed to save profile. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const err = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field] ? (formik.errors[field] as string) : undefined;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[900px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard/my-profile" className="hover:text-[#186737] transition-colors">My Profile</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Edit</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fields marked with <span className="text-red-500">*</span> are required.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/partner/dashboard/my-profile"
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-[7px] border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={submitting}
            className="flex items-center gap-1.5 h-9 px-4 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#155c30] transition-colors disabled:opacity-70"
          >
            {submitting ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-[7px] text-sm text-emerald-700 font-medium">
          <CheckCircle size={16} className="shrink-0" />
          Profile saved successfully. Redirecting…
        </div>
      )}
      {submitError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-[7px] text-sm text-red-600 font-medium">
          <AlertCircle size={16} className="shrink-0" />
          {submitError}
        </div>
      )}

      <form id="edit-profile-form" onSubmit={formik.handleSubmit} noValidate className="space-y-5">
        {/* ── Vendor & Contact ─────────────────────────────────────────── */}
        <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Building2 size={15} className="text-[#186737]" />
            Vendor &amp; Contact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Vendor Name" required error={err("vendor_name")} icon={Building2}>
              <input
                name="vendor_name"
                value={formik.values.vendor_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your store/vendor name"
                className={`${inputCls} ${err("vendor_name") ? errCls : ""}`}
              />
            </Field>
            <Field label="Website Link" error={err("vendor_website")} icon={Globe}>
              <input
                name="vendor_website"
                value={formik.values.vendor_website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://yourstore.com"
                className={`${inputCls} ${err("vendor_website") ? errCls : ""}`}
              />
            </Field>
            <Field label="Contact Name" required error={err("contact_name")} icon={User}>
              <input
                name="contact_name"
                value={formik.values.contact_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter contact name"
                className={`${inputCls} ${err("contact_name") ? errCls : ""}`}
              />
            </Field>
            <Field
              label="Contact Phone Number"
              required
              error={err("contact_phone_number")}
              icon={Phone}
            >
              <input
                name="contact_phone_number"
                value={formik.values.contact_phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter phone number"
                className={`${inputCls} ${err("contact_phone_number") ? errCls : ""}`}
              />
            </Field>
          </div>
        </section>

        {/* ── Business Address ─────────────────────────────────────────── */}
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
                onChange={(name, id) => {
                  formik.setFieldValue("country", name);
                  formik.setFieldTouched("country", true, false);
                  formik.setFieldValue("city", "");
                  setCountryId(id);
                  setCityId(null);
                }}
                placeholder="Select Country"
                searchPlaceholder="Search country…"
                loading={countriesLoading}
                error={!!err("country")}
              />
            </Field>
            <Field label="City" required error={err("city")}>
              <SearchableSelect
                options={cities}
                value={formik.values.city}
                onChange={(name, id) => {
                  formik.setFieldValue("city", name);
                  formik.setFieldTouched("city", true, false);
                  setCityId(id);
                }}
                placeholder={!countryId ? "Select country first" : "Select City"}
                searchPlaceholder="Search city…"
                loading={citiesLoading}
                disabled={!countryId}
                error={!!err("city")}
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
            <Field label="Dropshipping" required error={err("dropshipping")} icon={Truck}>
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
          </div>
        </section>

        {/* ── Documents ─────────────────────────────────────────────────── */}
        <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FileText size={15} className="text-[#186737]" />
            Documents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FileUploadField
              label="Vendor Logo"
              hint="webp, png"
              file={logoFile}
              currentUrl={vendor?.logo_url}
              accept=".webp,.png"
              onFileChange={setLogoFile}
            />
            <FileUploadField
              label="Business Licence"
              hint="pdf"
              file={licenseFile}
              currentUrl={vendor?.business_licence_url}
              accept="application/pdf"
              onFileChange={setLicenseFile}
            />
            <FileUploadField
              label="Tax Certificate"
              hint="pdf"
              file={taxFile}
              currentUrl={vendor?.tax_certificate_url}
              accept="application/pdf"
              onFileChange={setTaxFile}
            />
          </div>
        </section>
      </form>
    </div>
  );
}
