"use client";

import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option { id: number; name: string; }

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (name: string, id: number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  disabled = false,
  loading = false,
  error = false,
}: SearchableSelectProps) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const containerRef        = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    if (!open) { setSearch(""); return; }
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = (opt: Option) => {
    onChange(opt.name, opt.id);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => !disabled && !loading && setOpen((p) => !p)}
        className={`flex h-9 w-full items-center justify-between rounded-[7px] border px-3 py-2 text-sm transition-all outline-none ${
          error
            ? "border-red-400 ring-2 ring-red-100"
            : open
            ? "border-[#186737] ring-2 ring-[#186737]/10"
            : "border-gray-200 hover:border-gray-300"
        } ${
          disabled || loading
            ? "bg-gray-50 text-gray-400 cursor-not-allowed"
            : "bg-white cursor-pointer"
        }`}
      >
        <span className={`truncate ${value ? "text-gray-800" : "text-gray-400"}`}>
          {loading ? "Loading…" : (value || placeholder)}
        </span>
        {loading ? (
          <Loader2 size={14} className="text-gray-400 animate-spin shrink-0 ml-2" />
        ) : (
          <ChevronDown
            size={14}
            className={`text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-[7px] border border-gray-200 bg-white shadow-lg overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search size={13} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full text-sm text-gray-700 outline-none placeholder:text-gray-300 bg-transparent"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
              >
                ×
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-5">No results found</p>
            ) : (
              filtered.map((opt) => {
                const isSelected = opt.name === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                      isSelected
                        ? "bg-green-50 text-[#186737] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Check
                      size={13}
                      className={isSelected ? "text-[#186737] shrink-0" : "invisible shrink-0"}
                    />
                    {opt.name}
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
