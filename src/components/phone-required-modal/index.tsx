"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, Search } from "lucide-react";
import { Modal } from "@/components/modal";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { updateProfile } from "@/store/slices/my-profile/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocationData } from "@/utils/locationStorage";
import { usePhoneValidation } from "@/hooks/usePhoneValidation";

interface CountryOption {
  id: number;
  name: string;
  phone_code: string;
  icon: string | null;
}

interface PhoneRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (countryCode: string, phone: string) => void;
  defaultCountryCode?: string;
  userName?: string;
  userEmail?: string;
  userType?: string;
  userBusinessName?: string;
}

const PhoneRequiredModal = ({
  isOpen,
  onClose,
  onSuccess,
  defaultCountryCode = "",
  userName = "",
  userEmail = "",
  userType = "Private",
  userBusinessName = "",
}: PhoneRequiredModalProps) => {
  const dispatch = useAppDispatch();
  const reduxCountry = useAppSelector((s) => s.country.data);
  const locationData = useLocationData();
  const isoCode = locationData?.countryCode ?? "";
  const [phone, setPhone] = useState("");
  const { validating, isInvalid, errorMsg } = usePhoneValidation(phone, isoCode);
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    if (isOpen) {
      setCountryCode(defaultCountryCode);
      setPhone("");
      setError("");
    }
  }, [isOpen, defaultCountryCode]);

  useEffect(() => {
    makeApiRequest<{ success: boolean; data: CountryOption[] }>(apiUrls.COUNTRIES)
      .then((res) => setCountries(res.data ?? []))
      .catch(() => {});
  }, []);

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

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(codeSearch.toLowerCase()) ||
      c.phone_code.includes(codeSearch),
  );

  const selectedCountry = countries.find((c) => c.phone_code === countryCode);

  // Fall back to Redux country when the countries list hasn't loaded yet
  const displayIcon = selectedCountry?.icon ?? (reduxCountry?.icon ?? null);
  const displayCode = countryCode || (reduxCountry?.phone_code ?? "+");

  const handleSubmit = async () => {
    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (validating) return;
    if (isInvalid) return;
    setError("");
    setSubmitting(true);
    try {
      await dispatch(
        updateProfile({
          name: userName,
          country_code: displayCode,
          mobile_number: phone.trim(),
          type: userType,
          ...(userType === "Business" && { business_name: userBusinessName }),
        }),
      ).unwrap();
      onSuccess(countryCode, phone.trim());
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ?? "Failed to save phone number.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Phone Number Required" width="max-w-sm" showFooter={false}>
      <div className="px-2 py-2 space-y-4">
        <p className="text-sm text-gray-500 leading-relaxed">
          A phone number is required to complete your order. Please add one to continue.
        </p>

        {/* Country code + phone input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex h-11 rounded-[9px] border overflow-visible transition-all ${
              error ? "border-red-400" : "border-gray-200 focus-within:border-[#186737] focus-within:ring-2 focus-within:ring-[#186737]/10"
            }`}
          >
            {/* Country code picker */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                // onClick={() => setCodeOpen((p) => !p)}
                className="flex items-center gap-1.5 px-3 h-full border-r border-gray-200 bg-white text-sm text-gray-700 rounded-l-[9px] hover:bg-gray-50 transition-colors min-w-18"
              >
                {displayIcon ? (
                  <img src={displayIcon} alt="" className="w-5 h-5 rounded-sm object-cover shrink-0" />
                ) : (
                  <Phone size={13} className="text-gray-400 shrink-0" />
                )}
                <span className="text-xs font-semibold text-gray-700">{displayCode}</span>
              </button>

              {codeOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-[9px] shadow-lg z-50 overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-[6px]">
                      <Search size={12} className="text-gray-400 shrink-0" />
                      <input
                        autoFocus
                        value={codeSearch}
                        onChange={(e) => setCodeSearch(e.target.value)}
                        placeholder="Search country..."
                        className="flex-1 text-xs outline-none bg-transparent placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filtered.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { setCountryCode(c.phone_code); setCodeOpen(false); setCodeSearch(""); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                      >
                        {c.icon && <img src={c.icon} alt="" className="w-4 h-4 rounded-sm object-cover shrink-0" />}
                        <span className="text-xs text-gray-700 flex-1 truncate">{c.name}</span>
                        <span className="text-xs text-gray-400 font-medium shrink-0">{c.phone_code}</span>
                      </button>
                    ))}
                    {filtered.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-3">No results</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Phone input */}
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
              placeholder="Enter phone number"
              className="flex-1 px-3 text-sm outline-none bg-white rounded-r-[9px] placeholder:text-gray-300"
            />
          </div>
          {validating && (
            <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Validating...
            </p>
          )}
          {!validating && errorMsg && <p className="text-[11px] text-red-500 mt-1">{errorMsg}</p>}
          {!validating && !errorMsg && error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-11 rounded-[9px] bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {submitting ? (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            "Save & Continue"
          )}
        </button>
      </div>
    </Modal>
  );
};

export default PhoneRequiredModal;
