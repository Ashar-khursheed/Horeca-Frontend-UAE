"use client";

import {
  CheckCircle,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Trash2,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SavedItem, fmtPrice, toAbsUrl } from "./cart-types";

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={10}
        className={
          s <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ))}
  </div>
);

export default function SavedItemRow({
  item,
  onAddToCart,
  onRemove,
}: {
  item: SavedItem;
  onAddToCart: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const [qty, setQty] = useState(item.qty);
  const [added, setAdded] = useState(false);

  const hasSale = item.originalPrice > item.price;
  const discountPct = hasSale
    ? ((item.originalPrice - item.price) / item.originalPrice) * 100
    : 0;

  const handleAdd = () => {
    onAddToCart(item.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex gap-3 sm:gap-4 group hover:bg-gray-50/50 transition-colors rounded-[7px] p-3 -mx-3">

      {/* Image */}
      <Link
        href={toAbsUrl(item.url)}
        className="relative shrink-0 w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center"
      >
        {hasSale && (
          <span className="absolute top-1 left-1 bg-[#FCE8EA] text-red-500 text-[9px] font-bold px-1 py-0.5 rounded-full z-10">
            -{Math.round(discountPct)}%
          </span>
        )}
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/80x80/f3f4f6/9ca3af?text=No+Img";
          }}
        />
      </Link>

      {/* Middle — name + meta */}
      <div className="flex-1 min-w-0">
        <Link href={toAbsUrl(item.url)}>
          <p className="text-sm font-semibold text-gray-900 hover:text-[#186737] transition-colors line-clamp-2 leading-snug">
            {item.name}
          </p>
        </Link>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
          <span className="text-xs text-[#186737] font-semibold">{item.brand}</span>
          <span className="text-gray-200 text-xs">|</span>
          <span className="text-[11px] text-gray-400">Model: {item.modelNo}</span>
        </div>

        {item.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <RatingStars rating={item.rating} />
            <span className="text-[11px] font-bold text-gray-500">{item.rating.toFixed(1)}</span>
            {item.reviews > 0 && (
              <span className="text-[10px] text-gray-400">({item.reviews})</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-500">
          <Truck size={11} className="text-[#186737] shrink-0" />
          <span className={item.freeShipping ? "text-[#186737] font-semibold" : ""}>
            {item.freeShipping ? "Free Shipping" : "Shipping charges apply"}
          </span>
          <span className="text-gray-300">·</span>
          <span>Ships in {item.deliveryDays}</span>
        </div>

        {/* Price — visible on mobile below meta */}
        <div className="sm:hidden mt-2 flex items-baseline gap-2">
          <p className="text-sm font-bold text-gray-900">${fmtPrice(item.price)}</p>
          {hasSale && (
            <p className="text-xs text-gray-400 line-through">${fmtPrice(item.originalPrice)}</p>
          )}
          <span className="text-[11px] text-gray-400">/{item.unit}</span>
        </div>

        {/* Mobile actions */}
        <div className="sm:hidden mt-2.5 flex items-center gap-2 flex-wrap">
          <QtyControl qty={qty} setQty={setQty} />
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-[7px] transition-all ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[#186737] hover:bg-[#145c30] text-white"
            }`}
          >
            {added ? <><CheckCircle size={12} /> Added!</> : <><ShoppingCart size={12} /> Add to Cart</>}
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 font-semibold transition-colors"
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      </div>

      {/* Right — price + actions (desktop) */}
      <div className="hidden sm:flex flex-col items-end justify-between shrink-0 min-w-[140px]">
        {/* Price */}
        <div className="text-right">
          <p className="text-base font-bold text-gray-900">${fmtPrice(item.price)}</p>
          {hasSale && (
            <p className="text-xs text-gray-400 line-through">${fmtPrice(item.originalPrice)}</p>
          )}
          <p className="text-[11px] text-gray-400 mt-0.5">/{item.unit}</p>
        </div>

        {/* Qty + Add to Cart */}
        <div className="flex flex-col items-end gap-2 mt-2">
          <QtyControl qty={qty} setQty={setQty} />
          <button
            onClick={handleAdd}
            className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-[7px] transition-all ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[#186737] hover:bg-[#145c30] text-white"
            }`}
          >
            {added ? (
              <><CheckCircle size={12} /> Added!</>
            ) : (
              <><ShoppingCart size={12} /> Add to Cart</>
            )}
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 font-medium transition-colors"
          >
            <Trash2 size={11} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function QtyControl({
  qty,
  setQty,
}: {
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="flex items-center border border-[#BCE3C9] rounded-[7px] overflow-hidden bg-white">
      <button
        onClick={() => setQty((v) => Math.max(1, v - 1))}
        disabled={qty <= 1}
        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus size={12} className="text-gray-600" strokeWidth={2} />
      </button>
      <span className="w-7 text-center text-xs font-bold text-[#186737]">{qty}</span>
      <button
        onClick={() => setQty((v) => Math.min(99, v + 1))}
        disabled={qty >= 99}
        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus size={12} className="text-gray-600" strokeWidth={2} />
      </button>
    </div>
  );
}
