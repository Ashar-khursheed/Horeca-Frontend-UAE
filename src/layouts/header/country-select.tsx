"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import { useAppDispatch } from "@/store/hooks";
import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import { persistSelectedCountry, readCountryCookie } from "@/utils/country";
import { countryNameToIso } from "@/utils/country-iso";
import { useLocationData } from "@/utils/locationStorage";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type HeaderCountry = {
  id: number;
  name: string;
  phone_code: string;
  icon: string | null;
};

const PINNED_COUNTRY = "United Arab Emirates";

function sortCountries(list: HeaderCountry[]) {
  const pinned = list.filter((c) => c.name === PINNED_COUNTRY);
  const rest = list
    .filter((c) => c.name !== PINNED_COUNTRY)
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...pinned, ...rest];
}

function CountryFlag({ icon, name }: { icon?: string | null; name: string }) {
  if (!icon) {
    return <MapPin size={12} className="text-[#186737] shrink-0" />;
  }
  return (
    <img
      src={icon}
      alt={name}
      className="h-3 w-4 rounded-[2px] object-cover shrink-0"
    />
  );
}

export default function HeaderCountrySelect({
  className = "",
  fullWidth = false,
}: {
  className?: string;
  fullWidth?: boolean;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const location = useLocationData();
  const [countries, setCountries] = useState<HeaderCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ordered = useMemo(() => sortCountries(countries), [countries]);
  const selected = ordered.find((c) => c.name === value);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ordered;
    return ordered.filter((c) => c.name.toLowerCase().includes(q));
  }, [ordered, search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    makeApiRequest<{ message?: string; data?: HeaderCountry[] }>(apiUrls.COUNTRIES)
      .then((res) => {
        if (!cancelled) setCountries(res.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setCountries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ordered.length) return;
    const currentName = location?.country ?? "";
    const currentCode = (
      location?.countryCode ||
      readCountryCookie() ||
      ""
    ).toUpperCase();
    const match = ordered.find((c) => {
      if (currentName && c.name.toLowerCase() === currentName.toLowerCase()) {
        return true;
      }
      return !!currentCode && countryNameToIso(c.name) === currentCode;
    });
    if (match) setValue(match.name);
  }, [ordered, location?.country, location?.countryCode]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      return;
    }
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    setTimeout(() => inputRef.current?.focus(), 40);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleChange = (country: HeaderCountry) => {
    const code = countryNameToIso(country.name);
    if (!code) return;
    setValue(country.name);
    setOpen(false);
    persistSelectedCountry(country.name, code);
    dispatch(fetchCountryByName(country.name));
    router.refresh();
  };

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        aria-label="Select country"
        disabled={loading}
        onClick={() => !loading && setOpen((v) => !v)}
        className={
          fullWidth
            ? "flex h-10 w-full items-center justify-between gap-2 rounded-[7px] border border-gray-200 bg-white px-3 text-sm text-gray-700 hover:border-[#186737] disabled:opacity-60"
            : "flex h-7 items-center gap-1 rounded-full border border-gray-200 bg-white px-2 text-[12px] text-gray-600 hover:border-[#186737] hover:text-[#186737] disabled:opacity-60"
        }
      >
        <CountryFlag icon={selected?.icon} name={selected?.name ?? "Country"} />
        <span className="truncate max-w-[120px]">
          {loading ? "Loading…" : (selected?.name ?? "Country")}
        </span>
        <ChevronDown
          size={12}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-60 w-64 rounded-[7px] border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-2.5 py-2 border-b border-gray-100">
            <Search size={12} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country"
              className="w-full text-[12px] text-gray-700 outline-none placeholder:text-gray-300 bg-transparent"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-center text-[11px] text-gray-400 py-5">No results found</p>
            ) : (
              filtered.map((country) => {
                const isSelected = country.name === value;
                return (
                  <button
                    key={country.id}
                    type="button"
                    onClick={() => handleChange(country)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-left ${
                      isSelected
                        ? "bg-green-50 text-[#186737] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Check
                      size={12}
                      className={isSelected ? "text-[#186737] shrink-0" : "invisible shrink-0"}
                    />
                    <CountryFlag icon={country.icon} name={country.name} />
                    <span className="truncate">{country.name}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
