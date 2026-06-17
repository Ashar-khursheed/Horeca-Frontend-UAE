"use client";

import React, { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type FormType = "Business" | "Restaurant" | "Hotel";

interface RestaurantFormProps {
  onClose?: () => void;
  type?: FormType;
}

interface SelectOption {
  value: string;
  label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const hotelTypes: SelectOption[] = [
  { value: "", label: "Select Type" },
  { value: "Motel", label: "Motel" },
  { value: "Budget / 1-Star Hotel", label: "Budget / 1-Star Hotel" },
  { value: "Economy / 2-Star Hotel", label: "Economy / 2-Star Hotel" },
  { value: "Standard / 3-Star Hotel", label: "Standard / 3-Star Hotel" },
  { value: "Upscale / 4-Star Hotel", label: "Upscale / 4-Star Hotel" },
  { value: "Luxury / 5-Star Hotel", label: "Luxury / 5-Star Hotel" },
  {
    value: "Hotel Apartment / Serviced Apartment",
    label: "Hotel Apartment / Serviced Apartment",
  },
  { value: "Resort", label: "Resort" },
  { value: "Boutique Hotel", label: "Boutique Hotel" },
  { value: "Business Hotel", label: "Business Hotel" },
  { value: "Extended Stay", label: "Extended Stay" },
  { value: "Hostel / Guest House", label: "Hostel / Guest House" },
  { value: "Palace / Heritage Hotel", label: "Palace / Heritage Hotel" },
];

const businessTypes: SelectOption[] = [
  { value: "", label: "Select Type" },
  { value: "Hotels", label: "Hotels" },
  { value: "Restaurants", label: "Restaurants" },
  { value: "Fast Food & Takeaway", label: "Fast Food & Takeaway" },
  { value: "Cafés & Bakeries", label: "Cafés & Bakeries" },
  { value: "Breakfast/Brunch", label: "Breakfast/Brunch" },
  { value: "Food Trucks & Street Food", label: "Food Trucks & Street Food" },
  { value: "Catering Services", label: "Catering Services" },
  { value: "Ghost/Cloud Kitchen", label: "Ghost/Cloud Kitchen" },
  { value: "Reseller/Trading", label: "Reseller/Trading" },
  { value: "Others", label: "Others" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function RestaurantForm({ onClose, type }: RestaurantFormProps) {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFileName(
        Array.from(files)
          .map((file) => file.name)
          .join(", ")
      );
    } else {
      setSelectedFileName("");
    }
  };

  const getFilePlaceholder = (): string => {
    if (type === "Business") return "Attach BOQ, or RFQ if available";
    if (type === "Restaurant")
      return "Attach Restaurant Renderings, BOQ, or RFQ if available";
    return "Attach Hotel Renderings, BOQ, or RFQ if available";
  };

  const getCompanyLabel = (): string => {
    if (type === "Business") return "Business Name*";
    if (type === "Restaurant") return "Restaurant Name*";
    return "Hotel Name*";
  };

  const getCompanyPlaceholder = (): string => {
    if (type === "Business") return "Business Name";
    if (type === "Restaurant") return "Restaurant Name";
    return "Hotel Name";
  };

  const getTypeLabel = (): string => {
    if (type === "Business") return "Business Type*";
    if (type === "Restaurant") return "Restaurant Type*";
    return "Hotel Type*";
  };

  const typeOptions: SelectOption[] =
    type === "Business" ? businessTypes : hotelTypes;

  return (
    <>
      <div>
        <form
          id="contactForm"
          className="bg-[#fff] p-3 pt-0 rounded-md space-y-4"
        >
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
            >
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Jhon Smith"
              className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
            />
          </div>

          <div className="md:flex block gap-5 justify-between">
            {/* Phone Number Field */}
            <div className="w-full mb-4 md:mb-0">
              <label
                htmlFor="phone"
                className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
              >
                Phone Number<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="(234) 567-8900"
                className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
              />
            </div>

            {/* Email Field */}
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
              >
                Email Address<span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
              />
            </div>
          </div>

          <div className="md:flex block gap-5 justify-between">
            {/* Company Name Field */}
            <div className="w-full mb-4 md:mb-0">
              <label
                htmlFor="company_name"
                className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
              >
                {getCompanyLabel()}
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                placeholder={getCompanyPlaceholder()}
                className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
              />
            </div>

            {/* Type Field */}
            <div className="w-full">
              <label
                htmlFor="restaurant_type"
                className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
              >
                {getTypeLabel()}
              </label>
              <select
                id="restaurant_type"
                name="restaurant_type"
                className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Upload Field */}
          <div className="w-full">
            <label
              htmlFor="files"
              className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
            >
              Upload Files (Optional)
            </label>

            <div className="flex items-center w-full border border-gray-200 transition-all focus-within:border-[#186737] focus-within:ring-2 focus-within:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 bg-white overflow-hidden">
              {/* Hidden Input */}
              <input
                type="file"
                id="files"
                name="files"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
              />

              {/* Button */}
              <label
                htmlFor="files"
                className="cursor-pointer px-3 py-1 bg-gray-100 text-[#2D2D2D] font-medium text-sm border-r border-gray-200"
              >
                Choose Files
              </label>

              {/* Show file names */}
              <span className="px-3 text-sm text-black truncate">
                {selectedFileName || getFilePlaceholder()}
              </span>
            </div>

            <p className="text-sm text-gray-400 mt-1">
              PDF, Word, Excel — max 10MB
            </p>
          </div>

          {/* Notes Field */}
          <div>
            <label
              htmlFor="notes"
              className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Your message..."
              className="w-full border border-gray-200 outline-none transition-all focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
            ></textarea>
          </div>

          {/* Terms Checkbox */}
          <div className="flex gap-2 items-start">
            <input
              type="checkbox"
              id="check"
              name="check"
              className="mt-[4px] cursor-pointer"
              checked={isChecked}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIsChecked(e.target.checked)
              }
            />
            <p className="text-sm">
              By submitting this form, you consent to receive promotional offers
              from Horecastore at the number provided. Consent is not a
              condition of purchase. Message & data rates may apply. Message
              frequency varies. Unsubscribe by replying STOP. Reply HELP for
              help. Phone numbers aren&apos;t shared with third parties.{" "}
              <span>
                <Link
                  href="/pages/privacy-policy"
                  className="text-blue-500"
                >
                  Privacy Policy
                </Link>{" "}
                &{" "}
                <Link
                  href="/pages/return-policy"
                  className="text-blue-500"
                >
                  Terms and condition
                </Link>
              </span>
            </p>
          </div>

          {/* reCAPTCHA placeholder */}
          <div className="mt-4">
            <div className="flex items-center gap-3 border border-gray-200 rounded-md p-3 bg-white w-fit">
              <div className="w-5 h-5 border-2 border-gray-200 rounded flex-shrink-0" />
              <span className="text-sm text-gray-500">I&apos;m not a robot</span>
              <div className="ml-4 w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-[10px] text-gray-400 text-center leading-tight">
                  reCAPTCHA
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="bg-[#186737] text-white font-semibold rounded-md text-sm h-[50px] w-full hover:bg-[#155a2e] transition-colors flex items-center justify-center gap-2"
            >
              Let&apos;s Open Together
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RestaurantForm;