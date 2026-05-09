"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CheckCircle,
    ChevronRight,
    Minus,
    Package,
    Phone,
    Plus,
    RotateCcw,
    ShieldCheck,
    ShoppingCart,
    Truck,
    UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import type { Accessory, AccessoryItem } from "./types";

const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

type PurchasePanelProps = {
  activePrice: number;
  activeOriginal: number;
  unit: string;
  currency: string;
  freeShipping: boolean;
  deliveryDays: string;
  shipTo: string;
  returnPolicy: string;
  accessories: Accessory[];
  phone: string;
  brand: string;
  brandLogo: string;
  brandUrl: string;
};

export const PurchasePanel = ({
  activePrice,
  activeOriginal,
  unit,
  currency,
  freeShipping,
  deliveryDays,
  shipTo,
  returnPolicy,
  accessories,
  phone,
  brand,
  brandLogo,
  brandUrl,
}: PurchasePanelProps) => {
  const [selectedAccessory, setSelectedAccessory] =
    useState<AccessoryItem | null>(null);
  const [qty, setQty] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const hasSale = activeOriginal > activePrice;
  const discountPct = hasSale
    ? ((activeOriginal - activePrice) / activeOriginal) * 100
    : 0;
  const [priceInt, priceDec] = fmtPrice(activePrice).split(".");

  const handleAddToCart = () => {
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  return (
    <div className="space-y-3">
      {/* Price Card */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        {/* Price */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          {hasSale && (
            <span className="text-red-500 text-sm font-semibold">
              -{Math.round(discountPct)}%
            </span>
          )}
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-bold text-gray-900">${priceInt}</span>
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
            <p className="text-sm font-semibold text-gray-800">{shipTo}</p>
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
        <div className="flex items-center gap-2 mb-2">
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

      {/* Opening a Restaurant? */}
      <div className="bg-[#f0f9f4] border border-[#c3e6d4] rounded-[7px] p-4">
        <div className="flex items-start gap-3">
          <div className="bg-[#186737] rounded-[7px] p-2 shrink-0">
            <UtensilsCrossed size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              Opening a Restaurant?
            </p>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              Kitchen equipment from start to finish — we&apos;ve got you
              covered.
            </p>
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 mt-2 text-[#186737] font-bold text-sm hover:underline"
            >
              <Phone size={13} />
              {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Brand */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={brandLogo}
            alt={brand}
            className="w-8 h-8 object-contain rounded"
          />
          <div>
            <p className="text-xs text-gray-400">Sold by</p>
            <p className="text-sm font-bold text-gray-800">{brand}</p>
          </div>
        </div>
        <a
          href={`/${brandUrl}`}
          className="text-xs text-[#186737] font-semibold hover:underline flex items-center gap-1"
        >
          Visit Store <ChevronRight size={12} />
        </a>
      </div>
    </div>
  );
};
