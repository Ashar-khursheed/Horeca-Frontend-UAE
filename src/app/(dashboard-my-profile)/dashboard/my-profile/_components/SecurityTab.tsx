"use client";

import { changePassword, logoutUser } from "@/store/slices/auth/authSlice";
import { AppDispatch } from "@/store/store";
import { changePasswordSchema } from "@/validation/schema";
import { useFormik } from "formik";
import { CheckCircle, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Field, inputCls } from "./shared";

export const SecurityTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [show, setShow] = useState({
    old_password: false,
    new_password: false,
    new_password_confirmation: false,
  });
  const [apiStatus, setApiStatus] = useState<"idle" | "success" | "error">("idle");
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    if (apiStatus === "idle") return;
    const timer = setTimeout(() => setApiStatus("idle"), 3000);
    return () => clearTimeout(timer);
  }, [apiStatus]);

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
        await dispatch(changePassword(values)).unwrap();
        setApiStatus("success");
        setApiMessage("Password updated successfully. Please login again with your new password.");
        resetForm();
        setTimeout(() => {
          dispatch(logoutUser());
        }, 1000);
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

      {/* 2FA - hidden */}
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
