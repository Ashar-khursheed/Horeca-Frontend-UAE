"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import { Modal } from "@/components/ui/modal";
import { useFormik } from "formik";
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

const changePasswordSchema = Yup.object({
  current_password: Yup.string()
    .required("Current password is required.")
    .test("no-blank", "Current password cannot be blank.", (v) => !!v && v.trim().length > 0),
  password: Yup.string()
    .required("New password is required.")
    .min(8, "Minimum 8 characters required.")
    .matches(/[A-Z]/, "Must include at least one uppercase letter.")
    .matches(/[0-9]/, "Must include at least one number.")
    .matches(/[^A-Za-z0-9]/, "Must include at least one special character."),
  password_confirmation: Yup.string()
    .required("Please confirm your new password.")
    .oneOf([Yup.ref("password")], "Passwords do not match."),
});

const inputCls =
  "w-full h-10 pl-3 pr-10 rounded-[7px] border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white";
const errCls = "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100";

export function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [show, setShow] = useState({
    current_password: false,
    password: false,
    password_confirmation: false,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: changePasswordSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setSubmitError(null);
      try {
        const res = await makeApiRequest<{ success: boolean; message?: string }>(
          apiUrls.VENDOR_CHANGE_PASSWORD,
          { method: "POST", data: values }
        );

        if (res.success === false) {
          setSubmitError(res.message || "Failed to change password. Please try again.");
          return;
        }

        setSuccess(true);
        resetForm();
        setTimeout(onClose, 1500);
      } catch (err: any) {
        setSubmitError(
          err?.response?.data?.message || "Failed to change password. Please try again."
        );
      }
    },
  });

  const err = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : undefined;

  const EyeBtn = ({ field }: { field: keyof typeof show }) => (
    <button
      type="button"
      onClick={() => setShow((p) => ({ ...p, [field]: !p[field] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
    >
      {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <Modal
      isOpen
      onClose={() => { if (!formik.isSubmitting) onClose(); }}
      title="Change Password"
      width="max-w-md"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="space-y-4">
          {success && (
            <div className="flex items-center gap-2 rounded-[7px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <CheckCircle size={13} className="shrink-0" /> Password changed successfully.
            </div>
          )}
          {submitError && (
            <div className="flex items-center gap-2 rounded-[7px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle size={13} className="shrink-0" /> {submitError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Current Password</label>
            <div className="relative">
              <input
                type={show.current_password ? "text" : "password"}
                name="current_password"
                value={formik.values.current_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                disabled={formik.isSubmitting}
                className={`${inputCls} ${err("current_password") ? errCls : ""}`}
              />
              <EyeBtn field="current_password" />
            </div>
            {err("current_password") && (
              <p className="text-[11px] text-red-500">{err("current_password")}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={show.password ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                disabled={formik.isSubmitting}
                className={`${inputCls} ${err("password") ? errCls : ""}`}
              />
              <EyeBtn field="password" />
            </div>
            {err("password") && <p className="text-[11px] text-red-500">{err("password")}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={show.password_confirmation ? "text" : "password"}
                name="password_confirmation"
                value={formik.values.password_confirmation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                disabled={formik.isSubmitting}
                className={`${inputCls} ${err("password_confirmation") ? errCls : ""}`}
              />
              <EyeBtn field="password_confirmation" />
            </div>
            {err("password_confirmation") && (
              <p className="text-[11px] text-red-500">{err("password_confirmation")}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-5 mt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={formik.isSubmitting}
            className="flex items-center gap-1.5 h-9 px-3 rounded-[7px] border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex items-center gap-1.5 h-9 px-4 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#155c30] transition-colors disabled:opacity-60"
          >
            {formik.isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
            {formik.isSubmitting ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
