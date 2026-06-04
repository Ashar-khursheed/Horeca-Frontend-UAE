"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocationData } from "@/utils/locationStorage";
import { addItem, hydrateCart } from "@/store/slices/cart/cartSlice";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { getShippingCharge } from "@/utils/shipping";
import type { ApiProduct, RawApiProduct } from "@/components/product-card";

// ─── Local helpers ────────────────────────────────────────────────────────────
type LS = { en?: string; ar?: string } | string;

const resolveStr = (v: LS | { name?: string; symbol?: string } | undefined, locale = "en"): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  const o = v as Record<string, string | undefined>;
  return locale === "ar"
    ? (o.ar ?? o.en ?? o.name ?? o.symbol ?? "")
    : (o.en ?? o.ar ?? o.name ?? o.symbol ?? "");
};

const resolveCurrencySymbol = (c: string | { name?: string; symbol?: string } | undefined): string => {
  if (!c) return "AED";
  if (typeof c === "string") return c;
  return c.symbol ?? c.name ?? "AED";
};

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const t = localStorage.getItem("token");
    return t ? t.trim().replace(/^["']|["']$/g, "") : null;
  } catch {
    return null;
  }
};

// ─── Props ────────────────────────────────────────────────────────────────────
export interface AddToCartWidgetProps {
  product: ApiProduct | RawApiProduct;
  /** Override the flex wrapper div class */
  wrapperClassName?: string;
  /** Override the quantity counter wrapper div class */
  counterClassName?: string;
  /**
   * Override the button base classes.
   * Success flash (!bg-emerald-600) is always applied on top.
   */
  buttonClassName?: string;
  /** Set false to hide the counter (e.g. quote-only products forced hidden) */
  showCounter?: boolean;
  /** Optional accessories to attach to the cart API call */
  accessoryItemIds?: number[];
}

// ─── Module-level hydration guard ────────────────────────────────────────────
let cartHydrated = false;

// ─── Component ───────────────────────────────────────────────────────────────
export const AddToCartWidget = ({
  product,
  wrapperClassName,
  counterClassName,
  buttonClassName,
  showCounter: showCounterProp,
  accessoryItemIds = [],
}: AddToCartWidgetProps) => {
  const dispatch = useAppDispatch();
  const locale = useLocale();

  // ── Redux selectors ──────────────────────────────────────────────────────
  const country = useAppSelector((s) => s.country.data);
  const location = useLocationData();

  // ── Normalise product fields ─────────────────────────────────────────────
  // min_quantity, is_fixed, vendor_id may live at top-level OR inside suppliers[0]
  const supplier0 = (product as RawApiProduct).suppliers?.[0];
  const minQty = product.min_quantity ?? supplier0?.min_quantity ?? 1;
  const isFixed = product.is_fixed != null ? !!product.is_fixed : !!(supplier0?.is_fixed);
  const isQuote = !!product.quote_available;
  const vendorId = supplier0?.vendor_id ?? 0;
  const showCounter = showCounterProp ?? !isQuote;

  const name = resolveStr(product.name as LS, locale);
  const currencySymbol = resolveCurrencySymbol(
    product.currency as string | { name?: string; symbol?: string } | undefined
  );
  const sellUnit = resolveStr(product.selling_type?.attribute_value_unit as LS | undefined, locale);

  const image = (() => {
    const raw = product.images;
    if (Array.isArray(raw)) return (raw as string[])[0] ?? "";
    const typed = raw as { en?: string[]; ar?: string[] };
    return locale === "ar"
      ? (typed.ar ?? typed.en ?? [])[0] ?? ""
      : (typed.en ?? typed.ar ?? [])[0] ?? "";
  })();

  const originalPrice = product.original_price ?? product.price ?? 0;
  const hasSale = product.sale_price > 0 && product.sale_price !== originalPrice;
  const activePrice = hasSale ? product.sale_price : originalPrice;

  // ── Local state ──────────────────────────────────────────────────────────
  const [count, setCount] = useState(minQty);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Hydrate cart from localStorage once per page load ────────────────────
  useEffect(() => {
    if (!cartHydrated) {
      cartHydrated = true;
      dispatch(hydrateCart());
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dispatch]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFixed) {
      if (count + minQty <= 99) setCount(count + minQty);
    } else if (count < 99) {
      setCount(count + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFixed) {
      if (count - minQty >= minQty) setCount(count - minQty);
    } else if (count > minQty) {
      setCount(count - 1);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // ── Calculate shipping + totals ────────────────────────────────────
    const shippingCharge = getShippingCharge(location?.city ?? "", location?.regionName ?? "");
    const subTotal = activePrice * count;
    const totalPrice = subTotal + shippingCharge;

    const cartItem = {
      productId: product.id,
      name,
      url: product.url ?? "",
      parentCategoryUrl: product.parent_category_url ?? "",
      image,
      price: activePrice,
      originalPrice,
      hasSale,
      currencySymbol,
      quantity: count,
      minQty,
      isFixed,
      isQuote,
      sellUnit,
      sku: product.sku ?? "",
      vendorId,
      shippingCharge,
      subTotal,
      totalPrice,
      accessoryItemIds,
    };

    const token = getToken();

    if (token) {
      // ── Logged in: hit API ───────────────────────────────────────────
      setLoading(true);
      try {
        await makeApiRequest(apiUrls.CART_ADD, {
          method: "POST",
          data: {
            
                country: country?.name ?? "",
                product_id: product.id,
                vendor_id: vendorId,
                quantity: count,
                shipping_charge: shippingCharge,
                accessory_item_ids: accessoryItemIds,
          },
          // data: {
          //   country: country?.name ?? "",
          //   products: [
          //     {
          //       product_id: product.id,
          //       vendor_id: vendorId,
          //       quantity: count,
          //       shipping_charge: shippingCharge,
          //       accessory_item_ids: accessoryItemIds,
          //     },
          //   ],
          // },
        });
      } catch {
        // API failed — still update local state so UI stays consistent
      } finally {
        setLoading(false);
      }
    }

    // ── Always update Redux + localStorage (guest: primary; logged in: cache) ──
    dispatch(addItem(cartItem));

    setAddedSuccess(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAddedSuccess(false), 1800);
  };

  const variant = isQuote ? "quote" : "cart";
  const label = isQuote ? "Request a Quote" : "Add To Cart";

  // Button class: caller can override base, but success flash always wins
  const computedButtonClass = buttonClassName
    ? `${buttonClassName} flex items-center justify-center gap-2 transition-colors duration-200${addedSuccess ? " !bg-emerald-600 !text-white" : ""}`
    : [
        "flex-1 3xl:h-[44px] 2xl:h-[36px] md:h-[34px] rounded-[4px] 3xl:text-[14px] 2xl:text-[12px] text-[10px] font-semibold",
        "flex items-center justify-center gap-2 transition-colors duration-200",
        addedSuccess
          ? "bg-emerald-600 text-white"
          : loading
          ? "bg-gray-400 text-white cursor-wait"
          : variant === "quote"
          ? "bg-[#A6131D] hover:bg-[#8b1018] text-white"
          : "bg-[#186737] hover:bg-[#145c30] text-white",
      ].join(" ");

  return (
    <div className={wrapperClassName ?? "flex gap-2 items-center w-full"}>
      {/* ── Quantity Counter ────────────────────────────────────────────── */}
      {showCounter && (
        <div
          className={
            counterClassName ??
            "flex items-center border border-[#BCE3C9] rounded-[4px] overflow-hidden bg-white flex-shrink-0 3xl:w-[90px] 3xl:h-[44px] xl:w-[85px] xl:h-[35px] w-[75px] h-[29px]"
          }
        >
          <button
            onClick={handleDecrement}
            disabled={count <= minQty || loading}
            className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
          >
            <Minus size={15} className="text-[#4B5563]" strokeWidth={2} />
          </button>
          <input
            type="text"
            value={count}
            disabled={isFixed || loading}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (!isNaN(v) && v >= 1 && v <= 99) setCount(v);
            }}
            className="w-8 text-center 3xl:text-[15px] xl:text-[12px] text-[10px] font-semibold text-[#186737] border-0 outline-none bg-transparent disabled:cursor-not-allowed"
          />
          <button
            onClick={handleIncrement}
            disabled={count >= 99 || loading}
            className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
          >
            <Plus size={15} className="text-[#4B5563]" strokeWidth={2} />
          </button>
        </div>
      )}

      {/* ── Add To Cart / Request Quote Button ─────────────────────────── */}
      <button onClick={handleAddToCart} disabled={loading} className={computedButtonClass}>
        {addedSuccess ? (
          <CheckCircle size={16} strokeWidth={2} />
        ) : variant !== "quote" ? (
          <ShoppingCart size={16} strokeWidth={2} />
        ) : null}
        {loading ? "Adding..." : addedSuccess ? "Added!" : label}
      </button>
    </div>
  );
};

export default AddToCartWidget;
