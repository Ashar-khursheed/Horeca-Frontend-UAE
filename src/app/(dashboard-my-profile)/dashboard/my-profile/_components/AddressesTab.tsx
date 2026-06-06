"use client";

import { Modal } from "@/components/ui/modal";
import {
  AddressPayload,
  CustomerAddress,
  addAddress,
  deleteAddress,
  fetchAddresses,
  fetchCountriesList,
  optimisticSetDefault,
  setDefaultAddress,
  updateAddress,
} from "@/store/slices/customer-address/customerAddressSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useLocationData } from "@/utils/locationStorage";
import { useFormik } from "formik";
import { CheckCircle, Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Field, inputCls } from "./shared";

// ── Validation schema ──────────────────────────────────────────────────────────
const addressSchema = Yup.object({
  type:       Yup.string().trim().required("Address label is required"),
  address:    Yup.string().trim().required("Address is required"),
  country:    Yup.string().required("Country is required"),
  state:      Yup.string().trim().required("State is required"),
  city:       Yup.string().trim().required("City is required"),
  zip_code:   Yup.string().trim().required("ZIP code is required"),
  is_default: Yup.boolean(),
});

// ── Add / Edit Form (inside Modal) ─────────────────────────────────────────────
const AddressForm = ({
  editAddress,
  onClose,
}: {
  editAddress: CustomerAddress | null;
  onClose: () => void;
}) => {
  const dispatch   = useDispatch<AppDispatch>();
  const locationData = useLocationData();
  const { submitting, error } = useSelector((s: RootState) => s.customerAddress);

  const [apiMsg, setApiMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Country from localStorage location, or from the address being edited
  const detectedCountry = locationData?.country ?? "";

  const formik = useFormik({
    initialValues: {
      type:       editAddress?.type       ?? "",
      address:    editAddress?.address    ?? "",
      country:    editAddress?.country    ?? detectedCountry,
      state:      editAddress?.state      ?? "",
      city:       editAddress?.city       ?? "",
      zip_code:   editAddress?.zip_code   ?? "",
      is_default: editAddress?.is_default ?? true,
    },
    validationSchema: addressSchema,
    validateOnBlur:   true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setApiMsg(null);
      const payload: AddressPayload = {
        type:       values.type.trim(),
        address:    values.address.trim(),
        country:    values.country,
        state:      values.state?.trim() ?? "",
        city:       values.city.trim(),
        zip_code:   values.zip_code.trim(),
        is_default: editAddress ? values.is_default : true,
      };

      try {
        if (editAddress) {
          const msg = await dispatch(updateAddress({ id: editAddress.id, payload })).unwrap();
          setApiMsg({ type: "success", text: msg ?? "Address updated." });
        } else {
          const msg = await dispatch(addAddress(payload)).unwrap();
          setApiMsg({ type: "success", text: msg ?? "Address added." });
        }
        setTimeout(onClose, 1200);
      } catch {
        setApiMsg({ type: "error", text: error ?? "Something went wrong." });
      }
    },
  });

  const err = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : null;

  const errCls = (field: keyof typeof formik.values) =>
    err(field) ? "border-red-400 focus:ring-red-100" : "";

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      {/* API banner */}
      {apiMsg && (
        <div className={`flex items-center gap-2 p-3 rounded-[7px] border text-sm font-medium mb-4 ${
          apiMsg.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {apiMsg.type === "success" && <CheckCircle size={15} className="shrink-0" />}
          {apiMsg.text}
        </div>
      )}

      {/* Row 1: Street Address | Zip Code | City */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="sm:col-span-1">
          <Field label="Street Address *">
            <input
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Business/House"
              className={`${inputCls} ${errCls("address")}`}
            />
            {err("address") && <p className="text-[11px] text-red-500 mt-1">{err("address")}</p>}
          </Field>
        </div>

        <div>
          <Field label="Zip Code *">
            <input
              name="zip_code"
              value={formik.values.zip_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="12345"
              className={`${inputCls} ${errCls("zip_code")}`}
            />
            {err("zip_code") && <p className="text-[11px] text-red-500 mt-1">{err("zip_code")}</p>}
          </Field>
        </div>

        <div>
          <Field label="City *">
            <input
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="City"
              className={`${inputCls} ${errCls("city")}`}
            />
            {err("city") && <p className="text-[11px] text-red-500 mt-1">{err("city")}</p>}
          </Field>
        </div>
      </div>

      {/* Row 2: State | Country (disabled) | Address Label */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <Field label="State *">
            <input
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="State"
              className={`${inputCls} ${errCls("state")}`}
            />
            {err("state") && <p className="text-[11px] text-red-500 mt-1">{err("state")}</p>}
          </Field>
        </div>

        <div>
          <Field label="Country *">
            <input
              name="country"
              value={formik.values.country}
              readOnly
              disabled
              className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
            />
          </Field>
        </div>

        <div>
          <Field label="Address Label *">
            <input
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="eg: Home, Office"
              className={`${inputCls} ${errCls("type")}`}
            />
            {err("type") && <p className="text-[11px] text-red-500 mt-1">{err("type")}</p>}
          </Field>
        </div>
      </div>

      {/* Set as Default — only in edit mode */}
      {editAddress && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-[7px] border border-gray-200 bg-gray-50 mb-6">
          <input
            id="is_default"
            type="checkbox"
            checked={formik.values.is_default}
            onChange={(e) => formik.setFieldValue("is_default", e.target.checked)}
            className="w-4 h-4 rounded accent-[#186737] cursor-pointer"
          />
          <label htmlFor="is_default" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
            Set as Default Address
          </label>
        </div>
      )}

      {/* Footer buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-[7px] text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={formik.isSubmitting || submitting}
          className="flex-1 flex items-center justify-center gap-2 bg-[#186737] hover:bg-[#145c30] text-white px-4 py-2.5 rounded-[7px] text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {(formik.isSubmitting || submitting) ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving...
            </>
          ) : editAddress ? "Update Address" : "Save Address"}
        </button>
      </div>
    </form>
  );
};

// ── Addresses Tab ──────────────────────────────────────────────────────────────
export const AddressesTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, loading, deletingId } = useSelector(
    (s: RootState) => s.customerAddress
  );

  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState<CustomerAddress | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerAddress | null>(null);
  const [defaultErrVisible, setDefaultErrVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCountriesList());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (addr: CustomerAddress) => {
    setEditTarget(addr);
    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);

  const handleDelete = (addr: CustomerAddress) => {
    if (addr.is_default) {
      setDefaultErrVisible(true);
      setTimeout(() => setDefaultErrVisible(false), 5000);
      return;
    }
    setDeleteTarget(addr);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteAddress(deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleSetDefault = (addr: CustomerAddress) => {
    dispatch(optimisticSetDefault(addr.id));
    dispatch(setDefaultAddress(addr.id));
  };

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Address Management</h2>
            <p className="text-xs text-[#186737] mt-0.5">Manage your saved addresses</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors shrink-0 shadow-sm shadow-[#186737]/20"
          >
            <Plus size={14} />
            Add Address
          </button>
        </div>

        {/* Default address delete error banner */}
        {defaultErrVisible && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-[7px] bg-red-500 text-white text-sm font-medium">
            <span className="shrink-0 mt-0.5">&#9888;</span>
            You cannot delete the Shipping address. Please set another Shipping address .
          </div>
        )}

        {/* Address list */}
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <MapPin size={14} className="text-[#186737]" />
              Saved Addresses
              {!loading && (
                <span className="text-xs font-normal text-gray-400">({addresses.length})</span>
              )}
            </h3>
          </div>

          {loading ? (
            <div className="divide-y divide-gray-50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <div className="h-4 w-14 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-4 w-10 rounded-full bg-gray-100 animate-pulse" />
                    </div>
                    <div className="h-3.5 w-3/4 rounded bg-gray-200 animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="h-7 w-7 rounded-[7px] bg-gray-100 animate-pulse" />
                    <div className="h-7 w-7 rounded-[7px] bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <MapPin size={32} className="mb-2 opacity-30" />
              <p className="text-sm font-medium">No addresses saved yet</p>
              <button
                onClick={handleOpenAdd}
                className="mt-3 text-xs font-semibold text-[#186737] hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add your first address
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {addr.is_default && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-white bg-[#186737] px-2 py-0.5 rounded-full">
                          <CheckCircle size={9} />
                          Shipping Address
                        </span>
                      )}
                      {addr.type && (
                        <span className="text-[10px] font-bold capitalize tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {addr.type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 leading-snug">{addr.address}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {[addr.city, addr.state, addr.country, addr.zip_code]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!addr.is_default && (
                      <button
                        onClick={() => handleSetDefault(addr)}
                        className="text-[11px] font-semibold text-gray-400 hover:text-[#186737] transition-colors whitespace-nowrap hidden sm:block"
                      >
                        Set as Shipping Address
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEdit(addr)}
                      className="p-1.5 rounded-[7px] bg-[#f0f9f4] text-[#186737] hover:bg-[#186737] hover:text-white transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr)}
                      disabled={deletingId === addr.id}
                      className="p-1.5 rounded-[7px] border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-50"
                    >
                      {deletingId === addr.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editTarget ? "Edit Address" : "Add New Address"}
        width="max-w-4xl"
        showFooter={false}
      >
        <AddressForm editAddress={editTarget} onClose={handleClose} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Address"
        width="max-w-sm"
        showFooter={false}
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Are you sure?</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                This will permanently delete
                {deleteTarget?.type ? (
                  <span className="font-semibold text-gray-700"> &quot;{deleteTarget.type}&quot;</span>
                ) : " this address"}
                . This action cannot be undone.
              </p>
              {deleteTarget && (
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                  {deleteTarget.address}, {deleteTarget.city}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-[7px] text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={deletingId === deleteTarget?.id}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-[7px] text-sm font-semibold transition-colors disabled:opacity-70"
            >
              {deletingId === deleteTarget?.id ? (
                <><Loader2 size={13} className="animate-spin" /> Deleting...</>
              ) : (
                <><Trash2 size={13} /> Delete</>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
