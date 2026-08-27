"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { Modal } from "@/components/ui/modal";
import { fetchCountryByName } from "@/store/slices/country/countrySlice";
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
import { useLocationData, DEFAULT_ADDRESS_EVENT } from "@/utils/locationStorage";
import { isGccAddressCountry, isGccCountryName, isUaeAddressCountry } from "@/utils/uae-address";
import { useFormik } from "formik";
import { ArrowLeft, CheckCircle, Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import * as Yup from "yup";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Field, inputCls } from "./shared";

// ── Validation schema ──────────────────────────────────────────────────────────
const getAddressSchema = (hideState: boolean, hideZip: boolean) =>
  Yup.object({
    address: Yup.string().trim().required("Address is required"),
    country: Yup.string().required("Country is required"),
    state: hideState
      ? Yup.string().trim()
      : Yup.string().trim().required("State is required"),
    city: Yup.string().trim().required("City is required"),
    zip_code: hideZip
      ? Yup.string().trim()
      : Yup.string()
          .trim()
          .required("ZIP code is required")
          .matches(/^\d+$/, "ZIP code must contain numbers only")
          .min(3, "ZIP code must be at least 3 digits")
          .max(10, "ZIP code must be at most 10 digits"),
    is_default: Yup.boolean(),
  });

const getAddressEditSchema = (hideState: boolean, hideZip: boolean) =>
  getAddressSchema(hideState, hideZip).shape({
    is_default: Yup.boolean().oneOf(
      [true],
      "You must set this as your default address",
    ),
  });

// ── Lookup types ───────────────────────────────────────────────────────────────
interface LookupItem { id: number; name: string; }
interface LookupResponse { success: boolean; data: LookupItem[]; }

// ── Add / Edit Form (inside Modal) ─────────────────────────────────────────────
const AddressForm = ({
  editAddress,
  onClose,
}: {
  editAddress: CustomerAddress | null;
  onClose: () => void;
}) => {
  const dispatch      = useDispatch<AppDispatch>();
  const locationData  = useLocationData();
  const { submitting, error } = useSelector((s: RootState) => s.customerAddress);
  const country       = useSelector((s: RootState) => s.country);
  const countryId     = country?.data?.id as number | undefined;
  const countryName   = (country?.data?.name as string) ?? "";
  const countryIcon   = (country?.data?.icon as string) ?? "";
  const isUAE         = isUaeAddressCountry(countryName);
  const hideState     = isGccAddressCountry(countryName);

  const [states, setStates]               = useState<LookupItem[]>([]);
  const [cities, setCities]               = useState<LookupItem[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [apiMsg, setApiMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const formik = useFormik({
    initialValues: {
      type:       editAddress?.type       ?? "",
      address:    editAddress?.address    ?? "",
      country:    editAddress?.country    ?? countryName,
      state:      editAddress?.state      ?? "",
      city:       editAddress?.city       ?? "",
      zip_code:   editAddress?.zip_code   ?? "",
      is_default: editAddress?.is_default ?? true,
    },
    validationSchema: editAddress ? getAddressEditSchema(hideState, isUAE) : getAddressSchema(hideState, isUAE),
    validateOnBlur:   true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setApiMsg(null);
      const payload: AddressPayload = {
        type:       values.type.trim(),
        address:    values.address.trim(),
        country:    countryName || values.country,
        state:      hideState ? "" : (values.state?.trim() ?? ""),
        city:       values.city.trim(),
        zip_code:   isUAE ? "" : values.zip_code.trim(),
    is_default: values.is_default, // ✅ Add mode mein bhi user ki value use karo
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

  // Dispatch fetchCountryByName so s.country gets populated from locationData
  useEffect(() => {
    if (locationData?.country) {
      dispatch(fetchCountryByName(locationData.country));
    }
  }, [locationData?.country, dispatch]);

  // Sync countryName into formik (add mode)
  useEffect(() => {
    if (countryName && !editAddress) {
      formik.setFieldValue("country", countryName);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryName]);

  // Fetch states (non-GCC) or cities (GCC) when countryId is known
  useEffect(() => {
    if (!countryId) return;
    setStates([]);
    setCities([]);
    setSelectedStateId(null);
    if (hideState) {
      setCitiesLoading(true);
      makeApiRequest<LookupResponse>("frontend/countries/lookup", {
        params: { country_id: countryId, type: "cities" },
      })
        .then((res) => setCities(res.data ?? []))
        .finally(() => setCitiesLoading(false));
      return;
    }
    setStatesLoading(true);
    makeApiRequest<LookupResponse>("frontend/countries/lookup", {
      params: { country_id: countryId, type: "states" },
    })
      .then((res) => setStates(res.data ?? []))
      .finally(() => setStatesLoading(false));
  }, [countryId, hideState]);

  // In edit mode: once states load, auto-select the matching state ID
  useEffect(() => {
    if (hideState) return;
    const editState = editAddress?.state;
    if (!editState || states.length === 0) return;
    const match = states.find(
      (s) => s.name.toLowerCase() === editState.toLowerCase()
    );
    if (match) setSelectedStateId(match.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states, hideState]);

  // Fetch cities when selectedStateId changes (non-GCC)
  useEffect(() => {
    if (hideState) return;
    if (!selectedStateId) { setCities([]); return; }
    setCitiesLoading(true);
    setCities([]);
    makeApiRequest<LookupResponse>("frontend/countries/lookup", {
      params: { state_id: selectedStateId, type: "cities" },
    })
      .then((res) => setCities(res.data ?? []))
      .finally(() => setCitiesLoading(false));
  }, [selectedStateId, hideState]);

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

      {/* Street Address — full width */}
      <div className="mb-4">
        <Field label="Street Address *">
          <input
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Business/House No., Street"
            className={`${inputCls} ${errCls("address")}`}
          />
          {err("address") && <p className="text-[11px] text-red-500 mt-1">{err("address")}</p>}
        </Field>
      </div>

      {/* Country | State | City */}
      <div className={`grid grid-cols-1 gap-4 mb-4 ${hideState ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>

        {/* Country — read-only */}
        <div>
          <Field label="Country *">
           <div>
             {/* <img src={countryIcon} className="w-5 h-5" alt="" /> */}
              <div className="flex gap-1.5 items-center w-full border border-gray-100 rounded-md py-2 px-3 text-sm bg-gray-50 text-gray-600 cursor-default outline-none">
                          <img src={countryIcon ?? ""} alt="country image" className="w-4 h-4" />
                          <span>{countryName}</span>

                        </div>
           </div>
          </Field>
        </div>

        {!hideState && (
        <div>
          <Field label="State *">
            <SearchableSelect
              options={states}
              value={formik.values.state}
              onChange={(name, id) => {
                formik.setFieldValue("state", name);
                formik.setFieldValue("city", "");
                setSelectedStateId(id);
              }}
              placeholder="Select State"
              searchPlaceholder="Search state…"
              loading={statesLoading}
              disabled={!countryId}
              error={!!err("state")}
            />
            {err("state") && <p className="text-[11px] text-red-500 mt-1">{err("state")}</p>}
          </Field>
        </div>
        )}

        <div>
          <Field label="City *">
            <SearchableSelect
              options={cities}
              value={formik.values.city}
              onChange={(name) => {
                formik.setFieldValue("city", name);
                formik.setFieldTouched("city", true, false);
                if (hideState) formik.setFieldValue("state", "");
                if (isUAE) {
                  formik.setFieldValue("zip_code", "");
                  if (formik.values.address.trim()) {
                    void formik.setFieldValue("city", name).then(() => formik.submitForm());
                  }
                }
              }}
              placeholder={
                hideState
                  ? "Select City"
                  : !selectedStateId
                    ? "Select State first"
                    : "Select City"
              }
              searchPlaceholder="Search city…"
              loading={citiesLoading}
              disabled={hideState ? !countryId : !selectedStateId}
              error={!!err("city")}
            />
            {err("city") && <p className="text-[11px] text-red-500 mt-1">{err("city")}</p>}
          </Field>
        </div>
      </div>

      {!isUAE && (
      <div className="mb-6">
        <Field label="Zip Code *">
          <input
            name="zip_code"
            value={formik.values.zip_code}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
              formik.setFieldValue("zip_code", val);
              formik.setFieldTouched("zip_code", true, false);
            }}
            onBlur={formik.handleBlur}
            placeholder="12345"
            inputMode="numeric"
            maxLength={10}
            className={`${inputCls} ${errCls("zip_code")} sm:max-w-50`}
          />
          {err("zip_code") && <p className="text-[11px] text-red-500 mt-1">{err("zip_code")}</p>}
        </Field>
      </div>
      )}

      {/* Set as Default — only in edit mode */}
      {editAddress && (
        <div className="mb-6">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-[7px] border bg-gray-50 ${
            formik.touched.is_default && formik.errors.is_default ? "border-red-400" : "border-gray-200"
          }`}>
            <input
              id="is_default"
              type="checkbox"
              checked={formik.values.is_default}
              onChange={(e) => formik.setFieldValue("is_default", e.target.checked, true)}
              onBlur={() => formik.setFieldTouched("is_default", true)}
              className="w-4 h-4 rounded accent-[#186737] cursor-pointer"
            />
            <label htmlFor="is_default" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
              Set as Default Address <span className="text-red-500">*</span>
            </label>
          </div>
          {formik.touched.is_default && formik.errors.is_default && (
            <p className="text-[11px] text-red-500 mt-1">{formik.errors.is_default}</p>
          )}
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
            <><Loader2 size={14} className="animate-spin" /> Saving...</>
          ) : editAddress ? "Update Address" : "Save Address"}
        </button>
      </div>
    </form>
  );
};

// ── Addresses Tab ──────────────────────────────────────────────────────────────
export const AddressesTab = ({ checkoutMode = false }: { checkoutMode?: boolean }) => {
  const dispatch     = useDispatch<AppDispatch>();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const isFromCheckout = searchParams?.get("mode") === "checkout";

  const { addresses, loading, deletingId } = useSelector(
    (s: RootState) => s.customerAddress
  );

  const visibleAddresses = checkoutMode
    ? addresses.filter((a) => a.is_default)
    : addresses;

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
    // if (checkoutMode) {
    //   router.push("/dashboard/my-profile?tab=addresses&mode=checkout#addresses");
    //   return;
    // }
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
    window.dispatchEvent(new CustomEvent(DEFAULT_ADDRESS_EVENT));
  };

  return (
    <>
    
      <div className="space-y-5">
        {/* Back to Checkout button — shown on my-profile when navigated from checkout */}
      <div className="ml-austo">
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

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {checkoutMode ? "Shipping address" : "Address Management"}
            </h2>
            {!checkoutMode && (
              <p className="text-xs text-[#186737] mt-0.5">Manage your saved addresses</p>
            )}
          </div>

          {checkoutMode ? "": <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors shrink-0 shadow-sm shadow-[#186737]/20"
          >
            <Plus size={14} />
            Add Address
          </button>}
         
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
              {checkoutMode ? "Default address" : "Saved Addresses"}
              {!loading && !checkoutMode && (
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
          ) : visibleAddresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <MapPin size={32} className="mb-2 opacity-30" />
              <p className="text-sm font-medium">
                {checkoutMode ? "No default address set" : "No addresses saved yet"}
              </p>
              <button
                onClick={handleOpenAdd}
                className="mt-3 text-xs font-semibold text-[#186737] hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add your first address
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {visibleAddresses.map((addr) => (
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
                      {[
                        addr.city,
                        isGccCountryName(addr.country) ? null : addr.state,
                        addr.country,
                        addr.zip_code,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!addr.is_default && !checkoutMode && (
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
                    {!checkoutMode && (
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
                    )}
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
