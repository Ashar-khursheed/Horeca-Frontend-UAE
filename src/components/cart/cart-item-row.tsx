"use client";

import { Bookmark, Calendar, Minus, Plus, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { CartItem, fmtPrice } from "./cart-types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  hydrateGuestSaveItems,
  toggleGuestSaveItem,
  addSaveForLater,
  removeSaveForLater,
} from "@/store/slices/save-for-later/saveForLaterSlice";
import { fetchCounts } from "@/store/slices/customer-counts/customerCountsSlice";

export default function CartItemRow({
  item,
  onQty,
  onRemove,
  onWishlist,
}: {
  item: CartItem;
  onQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onWishlist: (id: number) => void;
}) {
  const dispatch       = useAppDispatch();
  const isSaved        = useAppSelector((s) => s.saveForLater.ids.includes(item.id));
  const isSaving       = useAppSelector((s) => s.saveForLater.toggling.includes(item.id));

  console.log("CartItemRow render", item);

  // Hydrate guest save-for-later from localStorage on mount
  useEffect(() => {
    dispatch(hydrateGuestSaveItems());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveForLater = async () => {
    if (isSaving) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      if (isSaved) {
        await dispatch(removeSaveForLater({ productId: item.id }));
      } else {
        await dispatch(addSaveForLater({
          productId: item.id,
          quantity:  item.qty,
          vendorId:  item.vendorId ?? 1,
        }));
             dispatch(fetchCounts() as any);
      }
    } else {
      dispatch(toggleGuestSaveItem({
        productId:  item.id,
        quantity:   item.qty,
        vendorId:   item.vendorId ?? 1,
        rawProduct: item.rawProduct ?? item,
      }));
    }
    onWishlist(item.id);
  };

  const accessoriesTotal = (item.selectedAccessories ?? []).reduce((s, a) => s + a.price, 0);
  const unitPrice = item.price + accessoriesTotal;

  const hasSale = item.originalPrice > item.price;
  const discountPct = hasSale
    ? ((item.originalPrice - item.price) / item.originalPrice) * 100
    : 0;


  return (
    <div className="flex gap-3 sm:gap-4 group">
      {/* Image */}
      <Link
      href={`${item.url}`}
        className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center"
      >
        {hasSale && (
          <span className="absolute top-1 left-1 bg-[#FCE8EA] text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
            -{Math.round(discountPct)}%
          </span>
        )}
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/96x96/f3f4f6/9ca3af?text=No+Img";
          }}
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 hover:text-[#186737] transition-colors line-clamp-2 leading-snug">
              {/* {item.name} */}
              <Link href={`${item.url}`} className="text-[#186737] hover:underline">
                {item.name}
              </Link>
            </h3>
            <p className="text-xs text-[#186737] font-semibold mt-1">{item.brand}</p>
            <p className="text-xs text-gray-400 mt-0.5">Model: {item.modelNo}</p>
          </div>

          {/* Price – desktop */}
          <div className="hidden sm:block text-right shrink-0 ml-4">
            <p className="text-base font-bold text-gray-900">
              {item.currencySymbol ?? "$"}{fmtPrice(unitPrice * item.qty)}
            </p>
            {hasSale && (
              <p className="text-xs text-gray-400 line-through">
                {item.currencySymbol ?? "$"}{fmtPrice(item.originalPrice * item.qty)}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">
              {item.currencySymbol ?? "$"}{fmtPrice(item.price)} /{item.unit}
            </p>
          </div>
        </div>

        {/* Selected Accessories */}
        {item.selectedAccessories && item.selectedAccessories.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {item.selectedAccessories.map((acc) => (
              <span key={acc.id} className="text-[11px] bg-[#f0f9f4] text-[#186737] border border-[#c3e6d4] rounded-full px-2 py-0.5 font-medium">
                {acc.name} {acc.price > 0 ? `+${fmtPrice(acc.price)}` : ""}
              </span>
            ))}
          </div>
        )}

        {/* Shipping */}
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Truck size={12} className="text-[#186737]" />
            <span className="font-semibold text-gray-700">
              {item.shippingCost > 0
                ? `Shipping Charges: $${fmtPrice(item.shippingCost * item.qty)}`
                : "Shipping Charges Apply"}
            </span>
          </div>
          <span className="text-gray-300">·</span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar size={11} className="text-[#186737]" />
            <span>Ship by {item.shipBy}</span>
          </div>
        </div>

        {/* Mobile price */}
        <div className="sm:hidden mt-2">
          <p className="text-sm font-bold text-gray-900">
            {item.currencySymbol ?? "$"}{fmtPrice(unitPrice * item.qty)}
          </p>
          {hasSale && (
            <p className="text-xs text-gray-400 line-through">
              {item.currencySymbol ?? "$"}{fmtPrice(item.originalPrice * item.qty)}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          {/* Qty */}
          {(() => {
            const min    = item.minQty  ?? 1;
            const fixed  = item.isFixed ?? false;
            const decQty = fixed ? item.qty - min : item.qty - 1;
            const incQty = fixed ? item.qty + min : item.qty + 1;
            return (
              <div className="flex items-center border border-[#BCE3C9] rounded-[7px] overflow-hidden bg-white">
                <button
                  onClick={() => onQty(item.id, Math.max(min, decQty))}
                  disabled={item.qty <= min}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={13} className="text-gray-600" strokeWidth={2} />
                </button>
                <input
                  type="text"
                  value={item.qty}
                  disabled={fixed}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v) && v >= min && v <= 99) onQty(item.id, v);
                  }}
                  className="w-9 text-center text-sm font-bold text-[#186737] border-0 outline-none bg-transparent disabled:cursor-not-allowed"
                />
                <button
                  onClick={() => onQty(item.id, Math.min(99, incQty))}
                  disabled={item.qty >= 99}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={13} className="text-gray-600" strokeWidth={2} />
                </button>
              </div>
            );
          })()}

          {/* Save for Later */}
          <button
            onClick={handleSaveForLater}
            disabled={isSaving}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-[7px] border transition-all duration-200 disabled:opacity-60 ${
              isSaved
                ? "border-[#186737] text-[#186737] bg-[#f0f9f4]"
                : "border-gray-200 text-gray-500 hover:border-[#186737] hover:text-[#186737] hover:bg-[#f0f9f4]"
            }`}
          >
            <Bookmark size={13} className={isSaved ? "fill-[#186737]" : ""} />
            {isSaved ? "Saved" : "Save for Later"}
          </button>

          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 font-semibold px-2.5 py-1.5 rounded-[7px] hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-200"
          >
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
