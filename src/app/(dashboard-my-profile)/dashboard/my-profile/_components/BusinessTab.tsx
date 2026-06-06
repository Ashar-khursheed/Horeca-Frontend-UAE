"use client";

import { updateProfile } from "@/store/slices/my-profile/profileSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Building2, CheckCircle, FileText, Hash, Paperclip, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, inputCls } from "./shared";

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

export const BusinessTab = () => {
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
      fd.append("name", customer?.name ?? "");
      fd.append("country_code", customer?.country_code ?? "");
      fd.append("mobile_number", customer?.mobile_number ?? "");
      fd.append("type", customer?.type ?? "Private");
      fd.append("business_name", form.business_name);
      fd.append("trn_number", form.trn_number);
      if (licenceFile) {
        fd.append("business_licence", licenceFile);
      } else if (bd?.business_licence) {
        fd.append("business_licence_url", bd.business_licence);
      }
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
