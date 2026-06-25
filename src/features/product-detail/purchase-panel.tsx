"use client";

import AddToCartWidget from "@/components/add-to-cart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocationData } from "@/utils/locationStorage";
import {
  ChevronRight,
  FileText,
  Package,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PriceComparisonCard } from "./price-comparison-card";
import { ReportErrorModal } from "./report-error-modal";
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
  productData: any;
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
  productData,
}: PurchasePanelProps) => {
  // Per-accessory selections: { [accessoryId]: selectedItem | null }
  const [selectedItems, setSelectedItems] = useState<
    Record<number, AccessoryItem | null>
  >({});
  const [showErrors, setShowErrors] = useState(false);
  const locationState = useLocationData();
  const [reportOpen, setReportOpen] = useState(false);
  const [deliverTo, setDeliverTo] = useState<string | null>(null);
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

  const resolveName = (n: AccessoryItem["name"]): string =>
    typeof n === "string" ? n : (n?.en ?? "");

  // All required accessories must have a selection
  const requiredUnmet = accessories.filter(
    (acc) => acc.is_required === 1 && !selectedItems[acc.id],
  );
  const canAddToCart = requiredUnmet.length === 0;
  const selectedItemIds = Object.values(selectedItems)
    .filter(Boolean)
    .map((it) => it!.id);
  const hasSale = activeOriginal > activePrice;
  const discountPct = hasSale
    ? ((activeOriginal - activePrice) / activeOriginal) * 100
    : 0;
  const [priceInt, priceDec] = fmtPrice(activePrice).split(".");

  return (
    <div className="space-y-3">
      {/* Price Card */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 md:block hidden">
        {/* Price */}

        {productData?.quote_available ? (
          <>
            {" "}
            <div style={{ minHeight: "62px" }}>
              <h2 className="text-[#186737] text-[15px] font-normal">
                Can&apos;t See the Price?
              </h2>
              <p className="text-[#64748B] text-[12px] mt-1 leading-snug">
                Click &ldquo;Request A Quote&rdquo; to receive your best prices.
              </p>
            </div>
          </>
        ) : (
          <>
            {" "}
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
                <span className="text-lg font-bold text-gray-900">
                  .{priceDec}
                </span>
              </div>
              <span className="text-sm text-gray-500 font-medium">/{unit}</span>
            </div>
            <PriceComparisonCard productData={productData} />
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
                  Shipping Charges Apply
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ships {deliveryDays}
                </p>
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
                <span className="font-semibold text-gray-800">
                  {returnPolicy}
                </span>{" "}
                return policy
              </p>
            </div>
            {/* Accessories */}
            {accessories?.map((acc) => {
              const isRequired = acc?.is_required === 1;
              const hasError =
                showErrors && isRequired && !selectedItems[acc.id];
              return (
                <div key={acc?.id} className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1.5">
                    <ShieldCheck
                      size={16}
                      className={`shrink-0 mt-0.5 ${isRequired ? "text-red-500" : "text-[#186737]"}`}
                    />
                    <span className="capitalize">{acc?.name}</span>
                    {isRequired && (
                      <span className="text-red-500 text-xs font-normal">
                        *
                      </span>
                    )}
                  </p>
                  <Select
                    value={selectedItems[acc.id]?.id?.toString() ?? ""}
                    onValueChange={(val) => {
                      const item =
                        acc?.accessory_item.find(
                          (it) => it.id.toString() === val,
                        ) ?? null;
                      setSelectedItems((prev) => ({ ...prev, [acc.id]: item }));
                      if (val) setShowErrors(false);
                    }}
                  >
                    <SelectTrigger
                      className={`w-full h-10 text-sm focus:ring-[#186737] focus:border-[#186737] ${hasError ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                    >
                      <SelectValue placeholder={`Select ${acc.name}…`} />
                    </SelectTrigger>
                    <SelectContent>
                      {acc?.accessory_item?.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {resolveName(item.name)} — +{fmtPrice(item.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      Please select {acc.name} before adding to cart
                    </p>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Qty + Add to Cart */}
        <div
          onClickCapture={(e) => {
            if (!canAddToCart) {
              e.stopPropagation();
              setShowErrors(true);
            }
          }}
        >
          <AddToCartWidget
            product={productData}
            accessoryItemIds={selectedItemIds}
            wrapperClassName="flex items-center gap-2 mb-2"
            counterClassName="flex items-center border border-[#BCE3C9] rounded-[7px] overflow-hidden bg-white shrink-0 h-11 w-[90px]"
            buttonClassName={`flex-1 h-11 rounded-[7px] text-sm font-bold text-white ${productData?.quote_available ? "bg-[#A6131D] hover:bg-[#8b1018]" : "bg-[#186737] hover:bg-[#145c30]"}`}
          />
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
              href={`tel:+18664467322`}
              className="flex items-center gap-1.5 mt-2 text-[#186737] font-bold text-sm hover:underline"
            >
              <Phone size={13} />
              +1 (866) 446-7322
            </a>
          </div>
        </div>
      </div>

      {/* Brand */}
      {brandLogo && brand && (
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
      )}

      {/* Documents */}
      {productData?.documents?.length > 0 && (
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-400 mb-2 font-medium">Documents</p>
          <div className="flex flex-col gap-2">
            {productData.documents.map(
              (doc: { title: string; path: string }, i: number) => (
                <a
                  key={i}
                  href={doc.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-[#186737] font-semibold hover:underline"
                >
                  <FileText size={14} className="flex-shrink-0 text-red-500" />
                  <span className="truncate">{doc.title}</span>
                </a>
              ),
            )}
          </div>
        </div>
      )}

      {/* <div className="mt-3 flex items-center justify-center gap-1.5 py-3">
        <span className="text-base text-gray-400">Spot something off?</span>
        <button
          onClick={() => setReportOpen(true)}
          className="text-base text-red-500 font-semibold hover:underline transition"
        >
        Spot something off? Help us improve this page.
        </button>
      </div> */}
      <p className="mt-[18px] flex"     onClick={() => setReportOpen(true)}><span className="text-[18px] px-[0px] hover:underline text-[#A6131D] cursor-pointer">Spot something off?<br /> Help us improve this page.</span></p>

      <ReportErrorModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        productId={productData.id}
      />
    </div>
  );
};
