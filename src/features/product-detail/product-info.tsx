"use client";

import { CheckCircle } from "lucide-react";
import { RatingStars } from "./rating-stars";
import type { VariantItem } from "./types";

type BenefitFeature = { benefit: string; feature: string };

type ProductInfoProps = {
  name: string;
  model: string;
  avgRating: number;
  totalReviews: number;
  benefitsFeatures: BenefitFeature[];
  variantGroups: Map<string, VariantItem[]>;
  selectedVariants: Record<string, VariantItem>;
  onSelectVariant: (label: string, variant: VariantItem) => void;
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
}: ProductInfoProps) => (
  <div className="space-y-4 ">
    {/* Title */}
    <h1 className="xl:text-xl text-base 2xl:text-2xl font-bold text-gray-900 leading-snug">
      {name}
    </h1>

    {/* Model & Rating */}
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      <p className="text-sm text-gray-500">
        Model:{" "}
        <span className="font-semibold text-gray-700">{model}</span>
      </p>
      <div className="flex items-center gap-2">
        <RatingStars rating={avgRating} size={16} />
        <span className="text-sm font-bold text-gray-700">{avgRating}</span>
        <span className="text-sm text-gray-400">({totalReviews} reviews)</span>
      </div>
    </div>

    <div className="border-t border-gray-300" />

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
                    $
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
      <ul className="space-y-2.5">
        {benefitsFeatures.map((f, i) => (
          <li key={i} className="flex gap-2.5 lg:text-base text-[13px]">
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
    </div>
  </div>
);
