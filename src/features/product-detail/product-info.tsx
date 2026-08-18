"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocationData } from "@/utils/locationStorage";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Package,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { ProductVariant } from "./product-variant";
import { RatingStars } from "./rating-stars";
import type { Accessory, AccessoryItem, VariantItem } from "./types";
import AddToCartWidget from "@/components/add-to-cart";
import LeaseToOwnBox from "./lease-to-own-box";

type BenefitFeature = { benefit: string; feature: string };

const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatAccessoryName = (
  name: string | { en?: string; ar?: string } | undefined,
) => (typeof name === "string" ? name : (name?.en ?? name?.ar ?? ""));

type ProductInfoProps = {
  name: string;
  model: string;
  avgRating: number;
  totalReviews: number;
  benefitsFeatures: BenefitFeature[];
  variantGroups: Map<string, VariantItem[]>;
  selectedVariants: Record<string, VariantItem>;
  onSelectVariant: (label: string, variant: VariantItem) => void;
  variants?: VariantItem[];
  parentId: number;
  activePrice: number;
  activeOriginal: number;
  unit: string;
  currency: string;
  freeShipping: boolean;
  deliveryDays: string;
  returnPolicy: string;
  accessories: Accessory[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product?: any;
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
  variants,
  parentId,
  activePrice,
  activeOriginal,
  unit,
  currency,
  freeShipping,
  deliveryDays,
  returnPolicy,
  accessories,
  product,
}: ProductInfoProps) => {
  const isQuote = !!product?.quote_available;

  const [openBenefits, setOpenBenefits] = useState<Set<number>>(new Set([0]));
  const [selectedItems, setSelectedItems] = useState<Record<number, AccessoryItem | null>>({});
  const [showErrors, setShowErrors] = useState(false);
  const locationState = useLocationData();
  const [deliverTo, setDeliverTo] = useState<string | null>(null);

  const requiredUnmet = accessories.filter(
    (acc) => acc.is_required === 1 && !selectedItems[acc.id],
  );
  const canAddToCart = requiredUnmet.length === 0;
  const selectedItemIds = Object.values(selectedItems).filter(Boolean).map((it) => it!.id);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hc_default_address");
      if (raw) {
        const addr = JSON.parse(raw);
        if (addr?.city && addr?.country) {
          setDeliverTo(`${addr.city}, ${addr.country}`);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    if (locationState?.city && locationState?.country) {
      setDeliverTo(`${locationState.city}, ${locationState.country}`);
    }
  }, [locationState]);

  const hasSale = activeOriginal > activePrice;
  const discountPct = hasSale
    ? ((activeOriginal - activePrice) / activeOriginal) * 100
    : 0;
  const [priceInt, priceDec] = fmtPrice(activePrice).split(".");

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
          Model: <span className="font-semibold text-gray-700">{model}</span>
        </p>
        {avgRating > 0 && (
          <div className="flex items-center gap-2">
            <RatingStars rating={avgRating} size={16} />
            <span className="text-sm font-bold text-gray-700">{avgRating}</span>
            <span className="text-sm text-gray-400">
              ({totalReviews} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Mobile-only Price Card */}
      <div className="md:hidden block bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        {/* Price — hidden for quote products */}
        {!isQuote && (
          <>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {hasSale && (
                <span className="text-red-500 text-sm font-semibold">
                  -{Math.round(discountPct)}%
                </span>
              )}
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-gray-900">
                  {currency}
                  {priceInt}
                </span>
                <span className="text-lg font-bold text-gray-900">.{priceDec}</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">/{unit}</span>
            </div>
            {hasSale && (
              <p className="text-gray-400 text-sm line-through mt-0.5">
                Was {currency}
                {fmtPrice(activeOriginal)}
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
                  {deliverTo ?? "Select Location"}
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
          </>
        )}

        {/* Accessories */}
        {accessories.map((acc) => {
          const isRequired = acc.is_required === 1;
          const hasError = showErrors && isRequired && !selectedItems[acc.id];
          return (
            <div key={acc.id} className="mb-4">
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1.5">
                <ShieldCheck
                  size={16}
                  className={`shrink-0 mt-0.5 ${isRequired ? "text-red-500" : "text-[#186737]"}`}
                />
                <span className="capitalize">{acc.name}</span>
                {isRequired && (
                  <span className="text-red-500 text-xs font-normal">*</span>
                )}
              </p>
              <Select
                value={selectedItems[acc.id]?.id?.toString() ?? ""}
                onValueChange={(val) => {
                  const item = acc.accessory_item.find((it) => it.id.toString() === val) ?? null;
                  setSelectedItems((prev) => ({ ...prev, [acc.id]: item }));
                  if (val) setShowErrors(false);
                }}
              >
                <SelectTrigger className={`w-full h-10 text-sm focus:ring-[#186737] focus:border-[#186737] ${hasError ? "border-red-500 bg-red-50" : "border-gray-200"}`}>
                  <SelectValue placeholder={`Select ${acc.name}…`} />
                </SelectTrigger>
                <SelectContent>
                  {acc.accessory_item.map((item) => (
                    <SelectItem key={item?.id} value={item?.id?.toString()}>
                      {formatAccessoryName(item?.name)} — +{fmtPrice(item?.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError && (
                <p className="text-xs text-red-500 mt-1">
                  Please select {acc.name} before adding to cart
                </p>
              )}
            </div>
          );
        })}

        {/* Add to Cart / Request Quote via widget */}
        {product && (
          <div
            onClickCapture={(e) => {
              if (!canAddToCart) {
                e.stopPropagation();
                setShowErrors(true);
              }
            }}
          >
            <AddToCartWidget
              product={product}
              showCounter={true}
              iconShow={true}
              buttonClassName={`flex-1 h-11 rounded-[7px] text-sm font-bold text-white ${
                isQuote ? "bg-[#A6131D] hover:bg-[#8b1018]" : "bg-[#186737] hover:bg-[#145c30]"
              }`}
              accessoryItemIds={selectedItemIds}
            />
          </div>
        )}

        <LeaseToOwnBox
          price={activePrice}
          currency={currency}
          quoteAvailable={product?.quote_available}
        />
      </div>

      {/* Model & Rating */}
      <div className="md:flex hidden flex-wrap gap-x-4 gap-y-1">
        <p className="text-sm text-gray-500">
          Model: <span className="font-semibold text-gray-700">{model}</span>
        </p>
        {avgRating > 0 && (
          <div className="flex items-center gap-2">
            <RatingStars rating={avgRating} size={16} />
            <span className="text-sm font-bold text-gray-700">{avgRating}</span>
            <span className="text-sm text-gray-400">
              ({totalReviews} reviews)
            </span>
          </div>
        )}
      </div>

      {/* <div className="border-t border-gray-300" /> */}
      <div id="product-purchase" className="scroll-mt-24">
        <ProductVariant
          variants={variants || []}
          currency={currency}
          parentId={parentId}
          currentAttributes={product?.attributes ?? []}
        />
      </div>
      {/* Variant Groups */}
      {/* {variants && variants.length > 0 ? (
        <ProductVariant variants={variants} currency={currency} />
      ) : (
        Array.from(variantGroups.entries()).map(([label, items]) => {
          const sel = selectedVariants[label];
          return (
            <div key={label}>
              <p className="lg:text-sm text-[12px] font-semibold text-gray-800 mb-2">
                {label}:{" "}
                <span className="text-[#186737] font-bold">{sel?.attribute_value}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {items.map((v) => {
                  const isActive = sel?.product_id === v.product_id && sel?.attribute_value === v.attribute_value;
                  return (
                    <button
                      key={v.sku + v.attribute_value}
                      onClick={() => onSelectVariant(label, v)}
                      className={`flex lg:text-base text-[12px] flex-col items-center justify-center px-3.5 py-2 rounded-[7px] border-2 transition-all duration-150 min-w-20 ${
                        isActive ? "border-[#186737] bg-[#f0f9f4] shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <span className={`text-[12px] font-bold leading-tight ${isActive ? "text-[#186737]" : "text-gray-800"}`}>
                        {v.attribute_value}
                      </span>
                      <span className={`text-xs mt-0.5 ${isActive ? "text-[#186737]" : "text-gray-500"}`}>
                        {currency}{v.sale_price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })
      )} */}

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
                <span className="font-semibold text-gray-900">
                  {f.benefit}:
                </span>{" "}
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
