import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ProductDetailResponse } from "./types";

interface Props {
  productData: ProductDetailResponse;
}

export function PriceComparisonCard({ productData }: Props) {
  const compare = (productData as any).compare_product;
  const attributes: any[] = (productData as any).attributes ?? [];

  const ourPrice: number =
    (productData as any).front_sale_price || productData.price || 0;
  const compareOriginalPrice: number = compare?.price || 0;
  const compareDisplayPrice: number =
    compare?.sale_price > 0 ? compare.sale_price : compareOriginalPrice;

  if (!compare || compareOriginalPrice <= 0 || ourPrice >= compareOriginalPrice)
    return null;

  const youSave = Math.abs(compareDisplayPrice - ourPrice);
  const savePct = Math.abs(
    Math.round(((compareDisplayPrice - ourPrice) / compareDisplayPrice) * 100),
  );
  const refPrice = Math.max(ourPrice, compareDisplayPrice);
  const ourBarWidth = Math.min((ourPrice / refPrice) * 100, 100);
  const compareBarWidth = Math.min((compareDisplayPrice / refPrice) * 100, 100);

  const warrantyAttr = attributes.find(
    (a) =>
      a.attribute_name === "Warranty" && a.attribute_value !== "No Warranty",
  );
  const warranty: string | null = warrantyAttr?.attribute_value ?? null;

  const currencySymbol = (productData as any).currency?.symbol ?? "$";

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white mt-3 border border-gray-200 rounded-[7px] p-4 shadow-sm ">
      {/* Header */}
      <p className="text-xs font-bold text-black tracking-widest uppercase mb-3">
        Price Comparison
      </p>

      {/* This Item */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm text-black w-16 shrink-0">This item</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-[#186737]"
            style={{ width: `${ourBarWidth}%` }}
          />
        </div>
        <span className="text-base font-bold text-black w-28 text-right shrink-0">
          {currencySymbol}{fmt(ourPrice)}
        </span>
      </div>

      {/* Compare Product */}
      <Link
        href={compare.url ?? compare.full_slug ?? "#"}
        target="_blank"
        className="block no-underline"
      >
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm text-black w-16 shrink-0 underline text-blue-600">
            New Item
          </span>
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-rose-500"
              style={{ width: `${compareBarWidth}%` }}
            />
          </div>
          <span className="text-base font-bold text-black w-28 text-right shrink-0">
            {currencySymbol}{fmt(compareDisplayPrice)}
          </span>
        </div>
      </Link>

      {/* You Save */}
      <div className="flex items-center gap-2 mt-3 mb-4">
        <span className="text-sm text-black">You save</span>
        <span className="text-lg font-bold text-green-600">
          {currencySymbol}{fmt(youSave)}
        </span>
        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {savePct}%
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-200 mb-4" />

      {/* Warranty */}
      {warranty && (
        <div className="flex items-center gap-3 border border-pink-200 rounded-[7px] p-3 bg-pink-50">
          <ShieldCheck className="w-5 h-5 text-pink-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-pink-700">Warranty Included</p>
            <p className="text-xs text-pink-500">{warranty}</p>
          </div>
        </div>
      )}
    </div>
  );
}
