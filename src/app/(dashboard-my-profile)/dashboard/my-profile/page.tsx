"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Building2,
  Camera,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Hash,
  Lock,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Plus,
  Shield,
  Upload,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { changePassword } from "@/store/slices/auth/authSlice";
import { updateProfile } from "@/store/slices/my-profile/profileSlice";
import { changePasswordSchema, updateProfileSchema } from "@/validation/schema";
import { CustomerProfile } from "@/store/slices/my-profile/profileSlice";

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = "personal" | "business" | "security" | "notifications" | "addresses";

// ── Shared input class ────────────────────────────────────────────────────────
const inputCls =
  "w-full h-10 px-3 rounded-[7px] border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white";

const Field = ({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-gray-400" />}
      {label}
    </label>
    {children}
  </div>
);

// ── Personal Info Tab ─────────────────────────────────────────────────────────
const PersonalTab = ({ customer }: { customer: CustomerProfile | null }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [apiStatus, setApiStatus] = useState<"idle" | "success" | "error">("idle");
  const [apiMessage, setApiMessage] = useState("");

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

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="p-5 space-y-4">
            {/* API banners */}
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

              <Field label="Account Type"  icon={Shield}>
                <Select
                  value={formik.values.type}
                  onValueChange={(val) => formik.setFieldValue("type", val)}
                  disabled
                  
                  
                >
                  <SelectTrigger className={`${inputCls} cursor-not-allowed bg-gray-50 text-gray-400 opacity-100`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-black">
                    <SelectItem value="Business" >Business</SelectItem>
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
                <input
                  name="country_code"
                  value={formik.values.country_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={formik.values.country_code ? undefined : "+971"}
                  disabled
                  className={`${inputCls} cursor-not-allowed ${hasErr("country_code") ? "border-red-400 focus:ring-red-100" : ""}`}
                />
                {hasErr("country_code") && <p className="text-[11px] text-red-500 mt-1">{formik.errors.country_code}</p>}
              </Field>

              <Field label="Mobile Number" icon={Phone}>
                <input
                  name="mobile_number"
                  value={formik.values.mobile_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="501234567"
                  className={`${inputCls} ${hasErr("mobile_number") ? "border-red-400 focus:ring-red-100" : ""}`}
                />
                {hasErr("mobile_number") && <p className="text-[11px] text-red-500 mt-1">{formik.errors.mobile_number}</p>}
              </Field>
            </div>
          </div>

          <div className="px-5 pb-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[7px] text-sm font-semibold transition-all duration-200 bg-[#186737] hover:bg-[#145c30] text-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => { formik.resetForm(); setApiStatus("idle"); }}
              className="px-5 py-2.5 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── File Upload Field ─────────────────────────────────────────────────────────
const FileUploadField = ({
  label,
  currentUrl,
  file,
  onFileChange,
  onClear,
}: {
  label: string;
  currentUrl?: string | null;
  file: File | null;
  onFileChange: (f: File | null) => void;
  onClear: () => void;
}) => {
  const inputId = `file-${label.replace(/\s/g, "-").toLowerCase()}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      alert("File too large. Max 2 MB.");
      e.target.value = "";
      return;
    }
    if (f.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }
    onFileChange(f);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        <FileText size={12} className="text-gray-400" />
        {label}
        <span className="font-normal text-gray-400">(PDF, max 2 MB)</span>
      </label>

      {/* Current file */}
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

      {/* New file chosen */}
      {file && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[7px] bg-blue-50 border border-blue-200 text-xs">
          <FileText size={12} className="text-blue-600 shrink-0" />
          <span className="text-blue-700 font-semibold truncate flex-1">{file.name}</span>
          <button
            type="button"
            onClick={() => { onClear(); }}
            className="text-blue-400 hover:text-red-500 transition-colors shrink-0"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Upload button */}
      <label
        htmlFor={inputId}
        className="flex items-center gap-2 px-3 py-2 rounded-[7px] border border-dashed border-gray-300 text-xs font-semibold text-gray-500 cursor-pointer hover:border-[#186737] hover:text-[#186737] hover:bg-[#f0f9f4] transition-all"
      >
        <Upload size={13} />
        {file ? "Replace file" : "Choose file"}
      </label>
      <input
        id={inputId}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

// ── Business Tab ──────────────────────────────────────────────────────────────
const BusinessTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customer = useSelector((s: RootState) => s.profile.customer);
  const bd = customer?.business_detail;

  const [apiStatus, setApiStatus] = useState<"idle" | "success" | "error">("idle");
  const [apiMessage, setApiMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    business_name: bd?.business_name ?? "",
    trn_number: (bd?.trn_number === "null" ? "" : bd?.trn_number) ?? "",
  });

  const [licenceFile, setLicenceFile] = useState<File | null>(null);
  const [vatFile, setVatFile] = useState<File | null>(null);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    if (bd) {
      setForm({
        business_name: bd.business_name ?? "",
        trn_number: (bd.trn_number === "null" ? "" : bd.trn_number) ?? "",
      });
    }
  }, [bd]);

  const handleReset = () => {
    setForm({
      business_name: bd?.business_name ?? "",
      trn_number: (bd?.trn_number === "null" ? "" : bd?.trn_number) ?? "",
    });
    setLicenceFile(null);
    setVatFile(null);
    setApiStatus("idle");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setApiStatus("idle");
    setApiMessage("");
    try {
      const fd = new FormData();
      // Required base fields (always send from current profile)
      fd.append("name", customer?.name ?? "");
      fd.append("country_code", customer?.country_code ?? "");
      fd.append("mobile_number", customer?.mobile_number ?? "");
      fd.append("type", customer?.type ?? "Private");
      // Business fields
      fd.append("business_name", form.business_name);
      fd.append("trn_number", form.trn_number);
      // Business licence: new file OR preserve existing URL
      if (licenceFile) {
        fd.append("business_licence", licenceFile);
      } else if (bd?.business_licence) {
        fd.append("business_licence_url", bd.business_licence);
      }
      // VAT certificate: new file OR preserve existing URL
      if (vatFile) {
        fd.append("vat_certificate", vatFile);
      } else if (bd?.vat_certificate) {
        fd.append("vat_certificate_url", bd.vat_certificate);
      }

      const msg = await dispatch(updateProfile(fd)).unwrap();
      setApiStatus("success");
      setApiMessage(msg ?? "Business info updated.");
      setLicenceFile(null);
      setVatFile(null);
      setTimeout(() => setApiStatus("idle"), 3000);
    } catch (err: unknown) {
      setApiStatus("error");
      setApiMessage(
        typeof err === "string" ? err
        : (err as { message?: string })?.message ?? "Failed to update."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColor =
    bd?.approval_status === "approved"
      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
      : bd?.approval_status === "rejected"
      ? "bg-red-50 text-red-600 border-red-200"
      : "bg-amber-50 text-amber-600 border-amber-200";

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Building2 size={14} className="text-[#186737]" />
            Business Information
          </h3>
        </div>

        <div className="p-5 space-y-4">
          {/* API banners */}
          {apiStatus === "success" && (
            <div className="flex items-start gap-3 p-3.5 rounded-[7px] bg-emerald-50 border border-emerald-200">
              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-emerald-700">{apiMessage}</p>
            </div>
          )}
          {apiStatus === "error" && (
            <div className="flex items-start gap-3 p-3.5 rounded-[7px] bg-red-50 border border-red-200">
              <X size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-700">{apiMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Business Name" icon={Building2}>
              <input
                className={inputCls}
                value={form.business_name}
                onChange={set("business_name")}
                placeholder="Your business name"
              />
            </Field>

            <Field label="TRN Number" icon={Hash}>
              <input
                className={inputCls}
                value={form.trn_number}
                onChange={set("trn_number")}
                placeholder="Tax registration number"
              />
            </Field>

            <FileUploadField
              label="Business Licence"
              currentUrl={bd?.business_licence}
              file={licenceFile}
              onFileChange={setLicenceFile}
              onClear={() => setLicenceFile(null)}
            />

            <FileUploadField
              label="VAT Certificate"
              currentUrl={bd?.vat_certificate}
              file={vatFile}
              onFileChange={setVatFile}
              onClear={() => setVatFile(null)}
            />

            <Field label="Approval Status">
              <div className={`h-10 px-3 rounded-[7px] border text-sm font-semibold flex items-center capitalize ${statusColor}`}>
                {bd?.approval_status ?? "—"}
              </div>
            </Field>
          </div>
        </div>

        <div className="px-5 pb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[7px] text-sm font-semibold transition-all duration-200 bg-[#186737] hover:bg-[#145c30] text-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Security Tab ──────────────────────────────────────────────────────────────
const SecurityTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [show, setShow] = useState({
    old_password: false,
    new_password: false,
    new_password_confirmation: false,
  });
  const [apiStatus, setApiStatus] = useState<"idle" | "success" | "error">("idle");
  const [apiMessage, setApiMessage] = useState("");

  const strengthOf = (pw: string) =>
    pw.length === 0 ? 0
    : pw.length < 6 ? 1
    : pw.length < 10 ? 2
    : /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw) ? 4
    : 3;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthBarColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-500"];
  const strengthTextColor = ["", "text-red-500", "text-amber-500", "text-blue-500", "text-emerald-600"];

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    validationSchema: changePasswordSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setApiStatus("idle");
      setApiMessage("");
      try {
        const msg = await dispatch(changePassword(values)).unwrap();
        setApiStatus("success");
        setApiMessage(msg ?? "Password updated successfully.");
        resetForm();
      } catch (err: unknown) {
        setApiStatus("error");
        setApiMessage(
          typeof err === "string" ? err
          : (err as { message?: string })?.message ?? "Failed to change password."
        );
      }
    },
  });

  const hasErr = (f: keyof typeof formik.values) =>
    !!(formik.touched[f] && formik.errors[f]);

  const EyeBtn = ({ field }: { field: keyof typeof show }) => (
    <button
      type="button"
      onClick={() => setShow((p) => ({ ...p, [field]: !p[field] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
    >
      {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  const strength = strengthOf(formik.values.new_password);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Lock size={14} className="text-[#186737]" />
            Change Password
          </h3>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="p-5 space-y-4 max-w-md">
            {/* API Banner */}
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

            {/* Current Password */}
            <Field label="Current Password" icon={Lock}>
              <div className="relative">
                <input
                  type={show.old_password ? "text" : "password"}
                  name="old_password"
                  value={formik.values.old_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className={`${inputCls} pr-10 ${hasErr("old_password") ? "border-red-400 focus:ring-red-100" : ""}`}
                />
                <EyeBtn field="old_password" />
              </div>
              {hasErr("old_password") && <p className="text-[11px] text-red-500 mt-1">{formik.errors.old_password}</p>}
            </Field>

            {/* New Password */}
            <Field label="New Password" icon={Lock}>
              <div className="relative">
                <input
                  type={show.new_password ? "text" : "password"}
                  name="new_password"
                  value={formik.values.new_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className={`${inputCls} pr-10 ${hasErr("new_password") ? "border-red-400 focus:ring-red-100" : ""}`}
                />
                <EyeBtn field="new_password" />
              </div>
              {hasErr("new_password") && <p className="text-[11px] text-red-500 mt-1">{formik.errors.new_password}</p>}
              {!hasErr("new_password") && formik.values.new_password.length > 0 && (
                <div className="mt-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= strength ? strengthBarColor[strength] : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className={`text-[11px] font-semibold mt-1 ${strengthTextColor[strength]}`}>
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
            </Field>

            {/* Confirm New Password */}
            <Field label="Confirm New Password" icon={Lock}>
              <div className="relative">
                <input
                  type={show.new_password_confirmation ? "text" : "password"}
                  name="new_password_confirmation"
                  value={formik.values.new_password_confirmation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className={`${inputCls} pr-10 ${hasErr("new_password_confirmation") ? "border-red-400 focus:ring-red-100" : ""}`}
                />
                <EyeBtn field="new_password_confirmation" />
              </div>
              {hasErr("new_password_confirmation") && <p className="text-[11px] text-red-500 mt-1">{formik.errors.new_password_confirmation}</p>}
            </Field>
          </div>

          <div className="px-5 pb-5">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[7px] text-sm font-semibold transition-all duration-200 bg-[#186737] hover:bg-[#145c30] text-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[7px] bg-[#f0f9f4] flex items-center justify-center shrink-0">
              <Shield size={17} className="text-[#186737]" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Two-Factor Authentication</h4>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed max-w-sm">
                Add an extra layer of security to your account by requiring a verification code.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#186737]" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Notifications Tab ─────────────────────────────────────────────────────────
const NotificationsTab = () => {
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    quoteStatus: true,
    promotions: false,
    newArrivals: false,
    paymentReminders: true,
    newsletterWeekly: false,
  });

  const NOTIF_GROUPS = [
    {
      title: "Order & Shipping",
      icon: Building2,
      items: [
        { key: "orderUpdates" as const, label: "Order status updates", desc: "Get notified when your order ships, is delivered, or has issues." },
        { key: "paymentReminders" as const, label: "Payment reminders", desc: "Receive reminders for upcoming or overdue payments." },
      ],
    },
    {
      title: "Quotes & Pricing",
      icon: Mail,
      items: [
        { key: "quoteStatus" as const, label: "Quote status changes", desc: "Know when your quotes are accepted, rejected, or expire." },
      ],
    },
    {
      title: "Marketing",
      icon: Bell,
      items: [
        { key: "promotions" as const, label: "Promotions & deals", desc: "Special offers, discounts, and flash sales." },
        { key: "newArrivals" as const, label: "New arrivals", desc: "Be first to know about new products in your categories." },
        { key: "newsletterWeekly" as const, label: "Weekly newsletter", desc: "Industry tips, product highlights, and company news." },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {NOTIF_GROUPS.map(({ title, items }) => (
        <div key={title} className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Bell size={14} className="text-[#186737]" />
              {title}
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map(({ key, label, desc }) => (
              <div key={key} className="px-5 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={prefs[key]}
                    onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#186737]" />
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Addresses Tab ─────────────────────────────────────────────────────────────
const AddressesTab = () => {
  const [billingForm, setBillingForm] = useState({
    street: "Hoston",
    city: "Houston",
    state: "Texas",
    zip: "77074",
    country: "United States",
    label: "Office1",
  });
  const [billingSaved, setBillingSaved] = useState(false);

  const [shippingList, setShippingList] = useState([
    { id: 1, name: "Amsterdam",      full: "usa, 90001, Los Angeles Mannat Lands & End, United States",                                              isDefault: false },
    { id: 2, name: "",               full: "Monterey, CA, USA, 59101, Billings, United States",                                                       isDefault: false },
    { id: 3, name: "",               full: "Apple Valley Fair, Stevens Creek Boulevard, Santa Clara, CA, USA, 95050, Santa Clara, United States",     isDefault: false },
    { id: 4, name: "Hollister Smog 2", full: "North 13th Street, San Jose, CA, USA, 95023, Hollister, United States",                               isDefault: false },
    { id: 5, name: "Office1",        full: "Hoston, 77074, Houston, United States",                                                                   isDefault: true  },
    { id: 6, name: "Business",       full: "708 E. 47th St. Chicago Il, 60653, 60653, Chicago, United States",                                        isDefault: false },
  ]);

  const handleDelete = (id: number) =>
    setShippingList((p) => p.filter((a) => a.id !== id));
  const handleSetDefault = (id: number) =>
    setShippingList((p) => p.map((a) => ({ ...a, isDefault: a.id === id })));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Address Management</h2>
          <p className="text-xs text-[#186737] mt-0.5">Manage your billing and shipping addresses</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors shrink-0 shadow-sm shadow-[#186737]/20">
          <Plus size={14} />
          Add Address
        </button>
      </div>

      {/* Billing Address */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <MapPin size={14} className="text-[#186737]" />
            Billing Address
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Street">
            <input
              className={inputCls}
              value={billingForm.street}
              onChange={(e) => setBillingForm((p) => ({ ...p, street: e.target.value }))}
              placeholder="Street address"
            />
          </Field>
          <Field label="City">
            <input
              className={inputCls}
              value={billingForm.city}
              onChange={(e) => setBillingForm((p) => ({ ...p, city: e.target.value }))}
              placeholder="City"
            />
          </Field>
          <Field label="State / Province">
            <input
              className={inputCls}
              value={billingForm.state}
              onChange={(e) => setBillingForm((p) => ({ ...p, state: e.target.value }))}
              placeholder="State"
            />
          </Field>
          <Field label="ZIP / Postal Code">
            <input
              className={inputCls}
              value={billingForm.zip}
              onChange={(e) => setBillingForm((p) => ({ ...p, zip: e.target.value }))}
              placeholder="ZIP"
            />
          </Field>
          <Field label="Country" icon={Globe}>
            <Select
              value={billingForm.country}
              onValueChange={(val) => setBillingForm((p) => ({ ...p, country: val }))}
            >
              <SelectTrigger className={`${inputCls} cursor-pointer`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Address Label">
            <input
              className={inputCls}
              value={billingForm.label}
              onChange={(e) => setBillingForm((p) => ({ ...p, label: e.target.value }))}
              placeholder="e.g. Office, Home"
            />
          </Field>
        </div>
        <div className="px-5 pb-5 flex items-center gap-3">
          <button
            onClick={() => {
              setBillingSaved(true);
              setTimeout(() => setBillingSaved(false), 2500);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[7px] text-sm font-semibold transition-all duration-200 ${
              billingSaved
                ? "bg-emerald-600 text-white"
                : "bg-[#186737] hover:bg-[#145c30] text-white"
            }`}
          >
            {billingSaved ? <><CheckCircle size={15} /> Saved!</> : "Save Changes"}
          </button>
          <button className="px-5 py-2.5 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>

      {/* Shipping Addresses */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <MapPin size={14} className="text-[#186737]" />
            Shipping Addresses
            <span className="text-xs font-normal text-gray-400">({shippingList.length})</span>
          </h3>
          <button className="flex items-center gap-1 text-xs font-semibold text-[#186737] hover:underline">
            <Plus size={12} />
            Add New
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {shippingList.map((addr) => (
            <div key={addr.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-white bg-[#186737] px-2 py-0.5 rounded-full">
                      <CheckCircle size={9} />
                      Default
                    </span>
                  )}
                  {addr.name && (
                    <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-1">{addr.full}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[11px] font-semibold text-gray-400 hover:text-[#186737] transition-colors whitespace-nowrap hidden sm:block"
                  >
                    Set Default
                  </button>
                )}
                <button className="px-3 py-1.5 rounded-[7px] bg-[#186737] text-white text-xs font-semibold hover:bg-[#145c30] transition-colors">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="px-3 py-1.5 rounded-[7px] border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "personal",      label: "Personal Info",    icon: User },
  { id: "business",      label: "Business",         icon: Building2 },
  { id: "security",      label: "Security",         icon: Lock },
  { id: "notifications", label: "Notifications",    icon: Bell },
  { id: "addresses",     label: "Addresses",        icon: MapPin },
];

export default function MyProfilePage() {
  const [tab, setTab] = useState<Tab>("personal");
  const customer = useSelector((s: RootState) => s.profile.customer);
  return (
    <div className="p-4 sm:p-6 max-w-[900px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account information, security, and preferences.
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-[7px] mb-6 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-[7px] text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-1 justify-center ${
              tab === id
                ? "bg-white text-[#186737] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "personal"      && <PersonalTab customer={customer} />}
      {tab === "business"      && <BusinessTab />}
      {tab === "security"      && <SecurityTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "addresses"     && <AddressesTab />}
    </div>
  );
}
