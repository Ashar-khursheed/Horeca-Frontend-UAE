// "use client";

// import { makeApiRequest } from "@/apis/axios-instance";
// import { SearchableSelect } from "@/components/ui/searchable-select";
// import { fetchCountryByName } from "@/store/slices/country/countrySlice";
// import {
//   AddressPayload,
//   CustomerAddress,
//   addAddress,
//   fetchAddresses,
//   fetchCountriesList,
//   updateAddress,
// } from "@/store/slices/customer-address/customerAddressSlice";
// import { AppDispatch, RootState } from "@/store/store";
// import { useLocationData } from "@/utils/locationStorage";
// import { useFormik } from "formik";
// import { useEffect, useImperativeHandle, forwardRef, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import * as Yup from "yup";

// interface LookupItem {
//   id: number;
//   name: string;
// }
// interface LookupResponse {
//   success: boolean;
//   data: LookupItem[];
// }

// export interface AddressCheckoutHandle {
//   validate: () => Promise<boolean>;
//   save: () => Promise<boolean>;
// }

// const addressSchema = Yup.object({
//   address: Yup.string().trim().required("Address is required"),
//   country: Yup.string().required("Country is required"),
//   state: Yup.string().trim().required("State is required"),
//   city: Yup.string().trim().required("City is required"),
//   zip_code: Yup.string()
//     .trim()
//     .required("ZIP code is required")
//     .matches(/^\d+$/, "ZIP code must contain numbers only")
//     .min(3, "ZIP code must be at least 3 digits")
//     .max(10, "ZIP code must be at most 10 digits"),
// });

// const inputCls =
//   "w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white placeholder:text-gray-400 transition-all";

// function FormField({
//   label,
//   children,
// }: {
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <label className="block text-xs font-semibold text-gray-600 mb-1">
//         {label}
//       </label>
//       {children}
//     </div>
//   );
// }

// const InlineAddressForm = forwardRef<
//   AddressCheckoutHandle,
//   { editAddress: CustomerAddress | null; onSaved?: () => void; onFormChange?: () => void }
// >(function InlineAddressForm({ editAddress, onSaved, onFormChange }, ref) {
//   const dispatch = useDispatch<AppDispatch>();
//   const locationData = useLocationData();
//   const { error } = useSelector((s: RootState) => s.customerAddress);
//   const country = useSelector((s: RootState) => s.country);
//   const countryId = country?.data?.id as number | undefined;
//   const countryName = (country?.data?.name as string) ?? "";
//   const countryIcon = (country?.data?.icon as string) ?? "";

//   const [states, setStates] = useState<LookupItem[]>([]);
//   const [cities, setCities] = useState<LookupItem[]>([]);
//   const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
//   const [statesLoading, setStatesLoading] = useState(false);
//   const [citiesLoading, setCitiesLoading] = useState(false);
//   const [apiError, setApiError] = useState<string | null>(null);
//   const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
//   const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const formik = useFormik({
//     initialValues: {
//       address: editAddress?.address ?? "",
//       country: editAddress?.country ?? countryName,
//       state: editAddress?.state ?? "",
//       city: editAddress?.city ?? "",
//       zip_code: editAddress?.zip_code ?? "",
//     },
//     validationSchema: addressSchema,
//     validateOnBlur: true,
//     validateOnChange: true,
//     onSubmit: async (values) => {
//       setApiError(null);
//       setSaveStatus("saving");
//       const payload: AddressPayload = {
//         type: "",
//         address: values.address.trim(),
//         country: countryName || values.country,
//         state: values.state?.trim() ?? "",
//         city: values.city.trim(),
//         zip_code: values.zip_code.trim(),
//         is_default: true,
//       };
//       if (editAddress) {
//         await dispatch(updateAddress({ id: editAddress.id, payload })).unwrap();
//       } else {
//         await dispatch(addAddress(payload)).unwrap();
//       }
//       setSaveStatus("saved");
//       onSaved?.();
//       setTimeout(() => setSaveStatus("idle"), 3000);
//     },
//   });

//   useImperativeHandle(ref, () => ({
//     // Only validates — no API call
//     validate: async (): Promise<boolean> => {
//       const errors = await formik.validateForm();
//       if (Object.keys(errors).length > 0) {
//         formik.setTouched(
//           Object.fromEntries(Object.keys(errors).map((k) => [k, true]))
//         );
//         return false;
//       }
//       return true;
//     },
//     // Validates + saves to API
//     save: async (): Promise<boolean> => {
//       setApiError(null);
//       const errors = await formik.validateForm();
//       if (Object.keys(errors).length > 0) {
//         formik.setTouched(
//           Object.fromEntries(Object.keys(errors).map((k) => [k, true]))
//         );
//         return false;
//       }
//       try {
//         await formik.submitForm();
//         return true;
//       } catch {
//         setApiError(error ?? "Could not save address. Please try again.");
//         return false;
//       }
//     },
//   }));

//   // Clear parent error on any field change
//   useEffect(() => {
//     if (formik.dirty) onFormChange?.();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [formik.values]);

//   // Auto-save jab pura form valid ho
//   useEffect(() => {
//     if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
//     if (formik.isValid && formik.dirty && saveStatus === "idle") {
//       autoSaveTimer.current = setTimeout(() => {
//         formik.submitForm();
//       }, 1000);
//     }
//     return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [formik.values, formik.isValid, formik.dirty]);

//   useEffect(() => {
//     if (locationData?.country) {
//       dispatch(fetchCountryByName(locationData.country));
//     }
//   }, [locationData?.country, dispatch]);

//   useEffect(() => {
//     if (countryName && !editAddress) {
//       formik.setFieldValue("country", countryName);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [countryName]);

//   useEffect(() => {
//     if (!countryId) return;
//     setStatesLoading(true);
//     setStates([]);
//     setCities([]);
//     setSelectedStateId(null);
//     makeApiRequest<LookupResponse>("frontend/countries/lookup", {
//       params: { country_id: countryId, type: "states" },
//     })
//       .then((res) => setStates(res.data ?? []))
//       .finally(() => setStatesLoading(false));
//   }, [countryId]);

//   useEffect(() => {
//     const editState = editAddress?.state;
//     if (!editState || states.length === 0) return;
//     const match = states.find(
//       (s) => s.name.toLowerCase() === editState.toLowerCase()
//     );
//     if (match) setSelectedStateId(match.id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [states]);

//   useEffect(() => {
//     if (!selectedStateId) {
//       setCities([]);
//       return;
//     }
//     setCitiesLoading(true);
//     setCities([]);
//     makeApiRequest<LookupResponse>("frontend/countries/lookup", {
//       params: { state_id: selectedStateId, type: "cities" },
//     })
//       .then((res) => setCities(res.data ?? []))
//       .finally(() => setCitiesLoading(false));
//   }, [selectedStateId]);

//   const err = (field: keyof typeof formik.values) =>
//     formik.touched[field] && formik.errors[field]
//       ? formik.errors[field]
//       : null;
//   const errCls = (field: keyof typeof formik.values) =>
//     err(field) ? "border-red-400 focus:ring-red-100" : "";

//   if (saveStatus === "saving") {
//     return (
//       <div className="space-y-4 animate-pulse">
//         {/* Street Address skeleton */}
//         <div>
//           <div className="h-3 w-28 bg-gray-200 rounded mb-1.5" />
//           <div className="h-9 bg-gray-200 rounded-md w-full" />
//         </div>
//         {/* Country | State | City skeleton */}
//         <div className="grid grid-cols-3 gap-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i}>
//               <div className="h-3 w-16 bg-gray-200 rounded mb-1.5" />
//               <div className="h-9 bg-gray-200 rounded-md" />
//             </div>
//           ))}
//         </div>
//         {/* ZIP skeleton */}
//         <div>
//           <div className="h-3 w-20 bg-gray-200 rounded mb-1.5" />
//           <div className="h-9 bg-gray-200 rounded-md w-40" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={formik.handleSubmit} noValidate>
//       {/* Save status */}
//       <div className="flex items-center gap-1.5 h-5 mb-2">
//         {saveStatus === "saved" && (
//           <span className="text-[11px] text-emerald-600 flex items-center gap-1">
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
//             </svg>
//             Address saved
//           </span>
//         )}
//       </div>
//       {apiError && (
//         <div className="text-xs text-red-500 mb-3">{apiError}</div>
//       )}

//       {/* Street Address */}
//       <div className="mb-4">
//         <FormField label="Street Address *">
//           <input
//             id="address-street-input"
//             name="address"
//             value={formik.values.address}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             placeholder="Business/House No., Street"
//             className={`${inputCls} ${errCls("address")}`}
//           />
//           {err("address") && (
//             <p className="text-[11px] text-red-500 mt-1">{err("address")}</p>
//           )}
//         </FormField>
//       </div>

//       {/* Country | State | City */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <div>
//           <FormField label="Country *">
//             <div className="flex gap-1.5 items-center w-full border border-gray-100 rounded-md py-2 px-3 text-sm bg-white text-gray-600 cursor-default outline-none h-[38px]">
//               {countryIcon && (
//                 <img src={countryIcon} alt="" className="w-4 h-4 rounded-sm" />
//               )}
//               <span>{countryName || formik.values.country}</span>
//             </div>
//           </FormField>
//         </div>

//         <div>
//           <FormField label="State *">
//             <SearchableSelect
//               options={states}
//               value={formik.values.state}
//               onChange={(name, id) => {
//                 formik.setFieldValue("state", name);
//                 formik.setFieldValue("city", "");
//                 setSelectedStateId(id);
//               }}
//               placeholder="Select State"
//               searchPlaceholder="Search state…"
//               loading={statesLoading}
//               disabled={!countryId}
//               error={!!err("state")}
//             />
//             {err("state") && (
//               <p className="text-[11px] text-red-500 mt-1">{err("state")}</p>
//             )}
//           </FormField>
//         </div>

//         <div>
//           <FormField label="City *">
//             <SearchableSelect
//               options={cities}
//               value={formik.values.city}
//               onChange={(name) => formik.setFieldValue("city", name)}
//               placeholder={!selectedStateId ? "Select State first" : "Select City"}
//               searchPlaceholder="Search city…"
//               loading={citiesLoading}
//               disabled={!selectedStateId}
//               error={!!err("city")}
//             />
//             {err("city") && (
//               <p className="text-[11px] text-red-500 mt-1">{err("city")}</p>
//             )}
//           </FormField>
//         </div>
//       </div>

//       {/* Zip Code */}
//       <div>
//         <FormField label="ZIP Code *">
//           <input
//             name="zip_code"
//             value={formik.values.zip_code}
//             onChange={(e) => {
//               const val = e.target.value.replace(/\D/g, "").slice(0, 10);
//               formik.setFieldValue("zip_code", val);
//               formik.setFieldTouched("zip_code", true, false);
//             }}
//             onBlur={formik.handleBlur}
//             placeholder="12345"
//             inputMode="numeric"
//             maxLength={10}
//             className={`${inputCls} ${errCls("zip_code")} sm:max-w-[200px]`}
//           />
//           {err("zip_code") && (
//             <p className="text-[11px] text-red-500 mt-1">{err("zip_code")}</p>
//           )}
//         </FormField>
//       </div>
//     </form>
//   );
// });

// export const AddressCheckout = forwardRef<AddressCheckoutHandle, { onFormChange?: () => void }>(
//   function AddressCheckout({ onFormChange }, ref) {
//     const dispatch = useDispatch<AppDispatch>();
//     const { addresses, loading } = useSelector(
//       (s: RootState) => s.customerAddress
//     );

//     const defaultAddress = addresses.find((a) => a.is_default) ?? null;
//     const formRef = useRef<AddressCheckoutHandle>(null);

//     // Forward parent ref to the inner form
//     useImperativeHandle(ref, () => ({
//       validate: () => formRef.current?.validate() ?? Promise.resolve(false),
//       save: () => formRef.current?.save() ?? Promise.resolve(false),
//     }));

//     useEffect(() => {
//       dispatch(fetchAddresses());
//       dispatch(fetchCountriesList());
//     }, [dispatch]);

//     return (
//       <div className="mb-8" id="shipping-address-section">
//         <h2 className="text-base font-semibold text-gray-900 mb-4">
//           Shipping address
//         </h2>

//         {loading ? (
//           <div className="border  border-gray-100 rounded-[7px] p-4 animate-pulse space-y-2">
//           <div className="space-y-4 animate-pulse">
//         {/* Street Address skeleton */}
//         <div>
//           <div className="h-3 w-28 bg-gray-200 rounded mb-1.5" />
//           <div className="h-9 bg-gray-200 rounded-md w-full" />
//         </div>
//         {/* Country | State | City skeleton */}
//         <div className="grid grid-cols-3 gap-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i}>
//               <div className="h-3 w-16 bg-gray-200 rounded mb-1.5" />
//               <div className="h-9 bg-gray-200 rounded-md" />
//             </div>
//           ))}
//         </div>
//         {/* ZIP skeleton */}
//         <div>
//           <div className="h-3 w-20 bg-gray-200 rounded mb-1.5" />
//           <div className="h-9 bg-gray-200 rounded-md w-40" />
//         </div>
//       </div>
//           </div>
//         ) : (
//           <div className="border border-gray-200 rounded-[7px] p-4 bg-gray-50">
//             <InlineAddressForm
//               ref={formRef}
//               editAddress={defaultAddress}
//               onSaved={() => dispatch(fetchAddresses())}
//               onFormChange={onFormChange}
//             />
//           </div>
//         )}
//       </div>
//     );
//   }
// );


"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import {
  AddressPayload,
  CustomerAddress,
  addAddress,
  fetchAddresses,
  fetchCountriesList,
  updateAddress,
} from "@/store/slices/customer-address/customerAddressSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useLocationData } from "@/utils/locationStorage";
import { useFormik } from "formik";
import { useEffect, useImperativeHandle, forwardRef, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

interface LookupItem {
  id: number;
  name: string;
}
interface LookupResponse {
  success: boolean;
  data: LookupItem[];
}

export interface AddressCheckoutHandle {
  validate: () => Promise<boolean>;
  save: () => Promise<boolean>;
}

const addressSchema = Yup.object({
  address: Yup.string().trim().required("Address is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().trim().required("State is required"),
  city: Yup.string().trim().required("City is required"),
  zip_code: Yup.string()
    .trim()
    .required("ZIP code is required")
    .matches(/^\d+$/, "ZIP code must contain numbers only")
    .min(3, "ZIP code must be at least 3 digits")
    .max(10, "ZIP code must be at most 10 digits"),
});

const inputCls =
  "w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white placeholder:text-gray-400 transition-all";

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const InlineAddressForm = forwardRef<
  AddressCheckoutHandle,
  { editAddress: CustomerAddress | null; onSaved?: () => void; onFormChange?: () => void }
>(function InlineAddressForm({ editAddress, onSaved, onFormChange }, ref) {
  const dispatch = useDispatch<AppDispatch>();
  const locationData = useLocationData();
  const { error } = useSelector((s: RootState) => s.customerAddress);
  const country = useSelector((s: RootState) => s.country);
  const countryId = country?.data?.id as number | undefined;
  const countryName = (country?.data?.name as string) ?? "";
  const countryIcon = (country?.data?.icon as string) ?? "";

  const [states, setStates] = useState<LookupItem[]>([]);
  const [cities, setCities] = useState<LookupItem[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formik = useFormik({
    initialValues: {
      address: editAddress?.address ?? "",
      country: editAddress?.country ?? countryName,
      state: editAddress?.state ?? "",
      city: editAddress?.city ?? "",
      zip_code: editAddress?.zip_code ?? "",
    },
    validationSchema: addressSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setApiError(null);
      setSaveStatus("saving");
      const payload: AddressPayload = {
        type: "",
        address: values.address.trim(),
        country: countryName || values.country,
        state: values.state?.trim() ?? "",
        city: values.city.trim(),
        zip_code: values.zip_code.trim(),
        is_default: true,
      };
      if (editAddress) {
        await dispatch(updateAddress({ id: editAddress.id, payload })).unwrap();
      } else {
        await dispatch(addAddress(payload)).unwrap();
      }
      setSaveStatus("saved");
      onSaved?.();
      setTimeout(() => setSaveStatus("idle"), 3000);
    },
  });

  useImperativeHandle(ref, () => ({
    // Only validates — no API call
    validate: async (): Promise<boolean> => {
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        formik.setTouched(
          Object.fromEntries(Object.keys(errors).map((k) => [k, true]))
        );
        return false;
      }
      return true;
    },
    // Validates + saves to API
    save: async (): Promise<boolean> => {
      setApiError(null);
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        formik.setTouched(
          Object.fromEntries(Object.keys(errors).map((k) => [k, true]))
        );
        return false;
      }
      try {
        await formik.submitForm();
        return true;
      } catch {
        setApiError(error ?? "Could not save address. Please try again.");
        return false;
      }
    },
  }));

  // Clear parent error on any field change
  useEffect(() => {
    if (formik.dirty) onFormChange?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  // Auto-save jab pura form valid ho
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    if (formik.isValid && formik.dirty && saveStatus === "idle") {
      autoSaveTimer.current = setTimeout(() => {
        formik.submitForm();
      }, 1000);
    }
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values, formik.isValid, formik.dirty]);

  useEffect(() => {
    if (locationData?.country) {
      dispatch(fetchCountryByName(locationData.country));
    }
  }, [locationData?.country, dispatch]);

  useEffect(() => {
    if (countryName && !editAddress) {
      formik.setFieldValue("country", countryName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryName]);

  useEffect(() => {
    if (!countryId) return;
    setStatesLoading(true);
    setStates([]);
    setCities([]);
    setSelectedStateId(null);
    makeApiRequest<LookupResponse>("frontend/countries/lookup", {
      params: { country_id: countryId, type: "states" },
    })
      .then((res) => setStates(res.data ?? []))
      .finally(() => setStatesLoading(false));
  }, [countryId]);

  useEffect(() => {
    const editState = editAddress?.state;
    if (!editState || states.length === 0) return;
    const match = states.find(
      (s) => s.name.toLowerCase() === editState.toLowerCase()
    );
    if (match) setSelectedStateId(match.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states]);

  useEffect(() => {
    if (!selectedStateId) {
      setCities([]);
      return;
    }
    setCitiesLoading(true);
    setCities([]);
    makeApiRequest<LookupResponse>("frontend/countries/lookup", {
      params: { state_id: selectedStateId, type: "cities" },
    })
      .then((res) => setCities(res.data ?? []))
      .finally(() => setCitiesLoading(false));
  }, [selectedStateId]);

  const err = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : null;
  const errCls = (field: keyof typeof formik.values) =>
    err(field) ? "border-red-400 focus:ring-red-100" : "";

  if (saveStatus === "saving") {
    return (
      <div className="space-y-4 animate-pulse">
        {/* Street Address skeleton */}
        <div>
          <div className="h-3 w-28 bg-gray-200 rounded mb-1.5" />
          <div className="h-9 bg-gray-200 rounded-md w-full" />
        </div>
        {/* Country | State | City skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-gray-200 rounded mb-1.5" />
              <div className="h-9 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
        {/* ZIP skeleton */}
        <div>
          <div className="h-3 w-20 bg-gray-200 rounded mb-1.5" />
          <div className="h-9 bg-gray-200 rounded-md w-40" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      {/* Save status */}
      <div className="flex items-center gap-1.5 h-5 mb-2">
        {saveStatus === "saved" && (
          <span className="text-[11px] text-emerald-600 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
            Address saved
          </span>
        )}
      </div>
      {apiError && (
        <div className="text-xs text-red-500 mb-3">{apiError}</div>
      )}

      {/* Street Address */}
      <div className="mb-4">
        <FormField label="Street Address *">
          <input
            id="address-street-input"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Business/House No., Street"
            className={`${inputCls} ${errCls("address")}`}
          />
          {err("address") && (
            <p className="text-[11px] text-red-500 mt-1">{err("address")}</p>
          )}
        </FormField>
      </div>

      {/* Country | State | City */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <FormField label="Country *">
            <div className="flex gap-1.5 items-center w-full border border-gray-100 rounded-md py-2 px-3 text-sm bg-white text-gray-600 cursor-default outline-none h-[38px]">
              {countryIcon && (
                <img src={countryIcon} alt="" className="w-4 h-4 rounded-sm" />
              )}
              <span>{countryName || formik.values.country}</span>
            </div>
          </FormField>
        </div>

        <div>
          <FormField label="State *">
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
            {err("state") && (
              <p className="text-[11px] text-red-500 mt-1">{err("state")}</p>
            )}
          </FormField>
        </div>

        <div>
          <FormField label="City *">
            <SearchableSelect
              options={cities}
              value={formik.values.city}
              onChange={(name) => {
                formik.setFieldValue("city", name);
                formik.setFieldValue("zip_code", "");
              }}
              placeholder={!selectedStateId ? "Select State first" : "Select City"}
              searchPlaceholder="Search city…"
              loading={citiesLoading}
              disabled={!selectedStateId}
              error={!!err("city")}
            />
            {err("city") && (
              <p className="text-[11px] text-red-500 mt-1">{err("city")}</p>
            )}
          </FormField>
        </div>
      </div>

      {/* Zip Code */}
      <div>
        <FormField label="ZIP Code *">
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
            className={`${inputCls} ${errCls("zip_code")} sm:max-w-[200px]`}
          />
          {err("zip_code") && (
            <p className="text-[11px] text-red-500 mt-1">{err("zip_code")}</p>
          )}
        </FormField>
      </div>
    </form>
  );
});

export const AddressCheckout = forwardRef<AddressCheckoutHandle, { onFormChange?: () => void }>(
  function AddressCheckout({ onFormChange }, ref) {
    const dispatch = useDispatch<AppDispatch>();
    const { addresses, loading } = useSelector(
      (s: RootState) => s.customerAddress
    );

    const defaultAddress = addresses.find((a) => a.is_default) ?? null;
    const formRef = useRef<AddressCheckoutHandle>(null);

    // Forward parent ref to the inner form
    useImperativeHandle(ref, () => ({
      validate: () => formRef.current?.validate() ?? Promise.resolve(false),
      save: () => formRef.current?.save() ?? Promise.resolve(false),
    }));

    useEffect(() => {
      dispatch(fetchAddresses());
      dispatch(fetchCountriesList());
    }, [dispatch]);

    return (
      <div className="mb-8" id="shipping-address-section">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Shipping address
        </h2>

        {loading ? (
          <div className="border  border-gray-100 rounded-[7px] p-4 animate-pulse space-y-2">
          <div className="space-y-4 animate-pulse">
        {/* Street Address skeleton */}
        <div>
          <div className="h-3 w-28 bg-gray-200 rounded mb-1.5" />
          <div className="h-9 bg-gray-200 rounded-md w-full" />
        </div>
        {/* Country | State | City skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-gray-200 rounded mb-1.5" />
              <div className="h-9 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
        {/* ZIP skeleton */}
        <div>
          <div className="h-3 w-20 bg-gray-200 rounded mb-1.5" />
          <div className="h-9 bg-gray-200 rounded-md w-40" />
        </div>
      </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-[7px] p-4 bg-gray-50">
            <InlineAddressForm
              ref={formRef}
              editAddress={defaultAddress}
              onSaved={() => dispatch(fetchAddresses())}
              onFormChange={onFormChange}
            />
          </div>
        )}
      </div>
    );
  }
);