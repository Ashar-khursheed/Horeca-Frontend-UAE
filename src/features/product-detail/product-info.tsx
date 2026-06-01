"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/store/store";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RatingStars } from "./rating-stars";
import type { Accessory, AccessoryItem, VariantItem } from "./types";

type BenefitFeature = { benefit: string; feature: string };

const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

type ProductInfoProps = {
  name: string;
  model: string;
  avgRating: number;
  totalReviews: number;
  benefitsFeatures: BenefitFeature[];
  variantGroups: Map<string, VariantItem[]>;
  selectedVariants: Record<string, VariantItem>;
  onSelectVariant: (label: string, variant: VariantItem) => void;
  activePrice: number;
  activeOriginal: number;
  unit: string;
  currency: string;
  freeShipping: boolean;
  deliveryDays: string;
  returnPolicy: string;
  accessories: Accessory[];
};

export const ProductInfo = ({
  name,
  model,
  avgRating,
  totalReviews,
  benefitsFeatures,
  variantGroups,
  selectedVariants,
  onSelectVariant,
  activePrice,
  activeOriginal,
  unit,
  currency,
  freeShipping,
  deliveryDays,
  returnPolicy,
  accessories,
}: ProductInfoProps) => {
  const [openBenefits, setOpenBenefits] = useState<Set<number>>(new Set([0]));
  const [selectedAccessory, setSelectedAccessory] =
    useState<AccessoryItem | null>(null);
  const [qty, setQty] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const locationState = useSelector((s: RootState) => s.location.data);

  const hasSale = activeOriginal > activePrice;
  const discountPct = hasSale
    ? ((activeOriginal - activePrice) / activeOriginal) * 100
    : 0;
  const [priceInt, priceDec] = fmtPrice(activePrice).split(".");

  const handleAddToCart = () => {
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  const toggleBenefit = (i: number) => {
    setOpenBenefits((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="xl:text-xl text-base 2xl:text-2xl font-bold text-gray-900 leading-snug">
        {name}
      </h1>

      {/* Model & Rating */}
      <div className="md:hidden flex flex-wrap gap-x-4 gap-y-1">
        <p className="text-sm text-gray-500">
          Model:{" "}
          <span className="font-semibold text-gray-700">{model}</span>
        </p>
        {avgRating > 0 && (
          <div className="flex items-center gap-2">
            <RatingStars rating={avgRating} size={16} />
            <span className="text-sm font-bold text-gray-700">{avgRating}</span>
            <span className="text-sm text-gray-400">({totalReviews} reviews)</span>
          </div>
        )}
      </div>

      {/* Mobile-only Price Card */}
      <div className="md:hidden block bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        {/* Price */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          {hasSale && (
            <span className="text-red-500 text-sm font-semibold">
              -{Math.round(discountPct)}%
            </span>
          )}
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-bold text-gray-900">
              {currency}{priceInt}
            </span>
            <span className="text-lg font-bold text-gray-900">.{priceDec}</span>
          </div>
          <span className="text-sm text-gray-500 font-medium">/{unit}</span>
        </div>
        {hasSale && (
          <p className="text-gray-400 text-sm line-through mt-0.5">
            Was {currency}{fmtPrice(activeOriginal)}
          </p>
        )}

        <div className="border-t border-gray-300 my-4" />

        {/* Shipping */}
        <div className="flex items-start gap-2 mb-3">
          <Truck size={16} className="text-[#186737] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {freeShipping ? "Free Shipping" : "Shipping Charges Apply"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Ships {deliveryDays}</p>
          </div>
        </div>

        {/* Delivery */}
        <div className="flex items-start gap-2 mb-3">
          <Package size={16} className="text-[#186737] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Delivering to</p>
            <p className="text-sm font-semibold text-gray-800">
              {locationState
                ? `${locationState.city}, ${locationState.country}`
                : "Select Location"}
            </p>
          </div>
        </div>

        {/* Return */}
        <div className="flex items-start gap-2 mb-3">
          <RotateCcw size={16} className="text-[#186737] shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">{returnPolicy}</span>{" "}
            return policy
          </p>
        </div>

        {/* Accessories */}
        {accessories.map((acc) => (
          <div key={acc.id} className="mb-4">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-[#186737] shrink-0 mt-0.5" />
              {acc.name}
            </p>
            <Select
              value={selectedAccessory?.id?.toString() ?? "none"}
              onValueChange={(val) => {
                if (val === "none") {
                  setSelectedAccessory(null);
                  return;
                }
                setSelectedAccessory(
                  acc.items.find((it) => it.id.toString() === val) ?? null,
                );
              }}
            >
              <SelectTrigger className="w-full h-10 text-sm border-gray-200 focus:ring-[#186737] focus:border-[#186737]">
                <SelectValue placeholder="Select warranty…" />
              </SelectTrigger>
              <SelectContent>
                {acc.items.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name} — +${item.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {/* Qty + Add to Cart */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[#BCE3C9] rounded-[7px] overflow-hidden bg-white shrink-0 h-11">
            <button
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              disabled={qty <= 1}
              className="w-10 h-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={14} className="text-gray-600" strokeWidth={2} />
            </button>
            <span className="w-9 text-center text-sm font-bold text-[#186737]">
              {qty}
            </span>
            <button
              onClick={() => setQty((v) => Math.min(99, v + 1))}
              disabled={qty >= 99}
              className="w-10 h-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={14} className="text-gray-600" strokeWidth={2} />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex-1 h-11 rounded-[7px] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
              addedSuccess
                ? "bg-emerald-600 text-white"
                : "bg-[#186737] hover:bg-[#145c30] text-white"
            }`}
          >
            {addedSuccess ? (
              <>
                <CheckCircle size={16} strokeWidth={2} /> Added!
              </>
            ) : (
              <>
                <ShoppingCart size={16} strokeWidth={2} /> Add To Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Model & Rating */}
      <div className="md:flex hidden flex-wrap gap-x-4 gap-y-1">
        <p className="text-sm text-gray-500">
          Model:{" "}
          <span className="font-semibold text-gray-700">{model}</span>
        </p>
        {avgRating > 0 && (
          <div className="flex items-center gap-2">
            <RatingStars rating={avgRating} size={16} />
            <span className="text-sm font-bold text-gray-700">{avgRating}</span>
            <span className="text-sm text-gray-400">({totalReviews} reviews)</span>
          </div>
        )}
      </div>

      {/* <div className="border-t border-gray-300" /> */}

      {/* Variant Groups */}
      {Array.from(variantGroups.entries()).map(([label, items]) => {
        const selected = selectedVariants[label];
        return (
          <div key={label}>
            <p className="lg:text-sm text-[12px] font-semibold text-gray-800 mb-2">
              {label}:{" "}
              <span className="text-[#186737] font-bold">
                {selected?.attribute_value}
              </span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {items.map((v) => {
                const isActive =
                  selected?.product_id === v.product_id &&
                  selected?.attribute_value === v.attribute_value;
                return (
                  <button
                    key={v.sku + v.attribute_value}
                    onClick={() => onSelectVariant(label, v)}
                    className={`flex lg:text-base text-[12px] flex-col items-center justify-center px-3.5 py-2 rounded-[7px] border-2 transition-all duration-150 min-w-20 ${
                      isActive
                        ? "border-[#186737] bg-[#f0f9f4] shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span
                      className={`text-[12px] font-bold leading-tight ${
                        isActive ? "text-[#186737]" : "text-gray-800"
                      }`}
                    >
                      {v.attribute_value}
                    </span>
                    <span
                      className={`text-xs mt-0.5 ${
                        isActive ? "text-[#186737]" : "text-gray-500"
                      }`}
                    >
                      {currency}
                      {v.sale_price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="border-t border-gray-300" />

      {/* Why You'll Love It */}
      <div>
        <h3 className="lg:text-base text-[13px] font-bold text-gray-800 mb-3 flex items-center gap-1.5">
          <span className="text-[#186737]">★</span> Why You&apos;ll Love It
        </h3>

        {/* Desktop */}
        <ul className="hidden lg:block space-y-2.5">
          {benefitsFeatures.map((f, i) => (
            <li key={i} className="flex gap-2.5">
              <CheckCircle
                size={16}
                className="text-[#186737] shrink-0 mt-0.5"
                strokeWidth={2.5}
              />
              <span className="text-gray-700 leading-snug">
                <span className="font-semibold text-gray-900">{f.benefit}:</span>{" "}
                {f.feature}
              </span>
            </li>
          ))}
        </ul>

        {/* Mobile accordion */}
        <div className="lg:hidden divide-y divide-gray-100 border border-gray-100 rounded-[10px] overflow-hidden shadow-sm">
          {benefitsFeatures.map((f, i) => {
            const isOpen = openBenefits.has(i);
            return (
              <div
                key={i}
                className={`transition-colors duration-150 ${isOpen ? "bg-[#f0f9f4]" : "bg-white"}`}
              >
                <button
                  onClick={() => toggleBenefit(i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                        isOpen ? "bg-[#186737]" : "bg-gray-300"
                      }`}
                    />
                    <span
                      className={`text-[13px] font-semibold leading-snug transition-colors ${
                        isOpen ? "text-[#186737]" : "text-gray-800"
                      }`}
                    >
                      {f.benefit}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={14} className="text-[#186737] shrink-0" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-[12px] text-gray-600 leading-relaxed px-4 pb-3 pl-9">
                    {f.feature}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
