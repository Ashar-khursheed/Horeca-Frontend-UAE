"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocationData } from "@/utils/locationStorage";
import { addItem, hydrateCart, removeItem, updateQuantity } from "@/store/slices/cart/cartSlice";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { getShippingCharge } from "@/utils/shipping";
import type { ApiProduct, RawApiProduct } from "@/components/product-card";
import Loader from "../Loader";

// ─── Local helpers ────────────────────────────────────────────────────────────
type LS = { en?: string; ar?: string } | string;

const resolveStr = (
  v: LS | { name?: string; symbol?: string } | undefined,
  locale = "en",
): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  const o = v as Record<string, string | undefined>;
  return locale === "ar"
    ? (o.ar ?? o.en ?? o.name ?? o.symbol ?? "")
    : (o.en ?? o.ar ?? o.name ?? o.symbol ?? "");
};

const resolveCurrencySymbol = (
  c: string | { name?: string; symbol?: string } | undefined,
): string => {
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
  wrapperClassName?: string;
  counterClassName?: string;
  buttonClassName?: string;
  showCounter?: boolean;
  accessoryItemIds?: number[];
}

// ─── Module-level hydration guard ────────────────────────────────────────────
let cartHydrated = false;

// ─── Shared cart cache (one CART_GET call for all widget instances) ───────────
interface CachedCartItem { id: number; product_id: number; quantity: number }
let cachedCartItems: CachedCartItem[] = [];
let cartCacheFetched = false;
let cartFetchPromise: Promise<void> | null = null;

const fetchSharedCart = (countryName: string): Promise<void> => {
  if (cartCacheFetched) return Promise.resolve();
  if (cartFetchPromise) return cartFetchPromise;
  cartFetchPromise = makeApiRequest<any>( // eslint-disable-line @typescript-eslint/no-explicit-any
    apiUrls.CART_GET,
    { params: { country: countryName } },
  )
    .then((res: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      cachedCartItems = res?.data?.customer_cart_products ?? [];
      cartCacheFetched = true;
    })
    .catch(() => {})
    .finally(() => { cartFetchPromise = null; });
  return cartFetchPromise;
};

const invalidateCartCache = () => {
  cartCacheFetched = false;
  cachedCartItems = [];
};

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

  const country = useAppSelector((s) => s.country.data);
  const cartItems = useAppSelector((s) => s.cart.items);
  const location = useLocationData();

  // ── Normalise product fields ─────────────────────────────────────────────
  const supplier0 = (product as RawApiProduct).suppliers?.[0];
  const minQty = product.min_quantity ?? supplier0?.min_quantity ?? 1;
  const isFixed =
    product.is_fixed != null ? !!product.is_fixed : !!supplier0?.is_fixed;
  const isQuote = !!product.quote_available;
  const vendorId = supplier0?.vendor_id ?? 0;
  const showCounter = showCounterProp ?? !isQuote;

  const name = resolveStr(product.name as LS, locale);
  const currencySymbol = resolveCurrencySymbol(
    product.currency as string | { name?: string; symbol?: string } | undefined,
  );
  const sellUnit = resolveStr(
    product.selling_type?.attribute_value_unit as LS | undefined,
    locale,
  );

  const image = (() => {
    const raw = product.images;
    if (Array.isArray(raw)) return (raw as string[])[0] ?? "";
    const typed = raw as { en?: string[]; ar?: string[] };
    return locale === "ar"
      ? ((typed.ar ?? typed.en ?? [])[0] ?? "")
      : ((typed.en ?? typed.ar ?? [])[0] ?? "");
  })();

  const originalPrice = product.original_price ?? product.price ?? 0;
  const hasSale =
    product.sale_price > 0 && product.sale_price !== originalPrice;
  const activePrice = hasSale ? product.sale_price : originalPrice;

  // ── Desktop state ────────────────────────────────────────────────────────
  const [count, setCount] = useState(minQty);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Mobile state ─────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileInCart, setMobileInCart] = useState(false);
  const [mobileCartItemId, setMobileCartItemId] = useState<number | null>(null);
  const [mobileQty, setMobileQty] = useState(minQty);
  const [mobileLoading, setMobileLoading] = useState(false);

  // For guest users: check if item is in local cart
  const guestCartItem = cartItems.find((i) => i.productId === product.id);
  const effectiveMobileInCart = isLoggedIn ? mobileInCart : !!guestCartItem;
  const currentMobileQty = isLoggedIn ? mobileQty : (guestCartItem?.quantity ?? minQty);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!cartHydrated) {
      cartHydrated = true;
      dispatch(hydrateCart());
    }
    setIsLoggedIn(!!getToken());

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dispatch]);

  // ── Load initial cart state for logged-in users (runs once country is ready) ─
  useEffect(() => {
    if (!isLoggedIn || !country?.name) return;
    fetchSharedCart(country.name).then(() => {
      const found = cachedCartItems.find((i) => i.product_id === product.id);
      if (found) {
        setMobileInCart(true);
        setMobileCartItemId(found.id);
        setMobileQty(found.quantity);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, country?.name]);

  // ── Desktop handlers ──────────────────────────────────────────────────────
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

    const shippingCharge = getShippingCharge(
      location?.city ?? "",
      location?.regionName ?? "",
    );
    const subTotal = activePrice * count;
    const totalPrice = subTotal + shippingCharge;

    const token = getToken();

    if (token) {
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
        });
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    } else {
      const rawAcc = (product as RawApiProduct).accessories ?? [];
      const selectedAccessories = rawAcc
        .flatMap((acc) => acc.accessory_item ?? [])
        .filter((item) => accessoryItemIds.includes(item.id))
        .map((item) => ({
          id: item.id,
          name: resolveStr(item.name as LS, locale),
          price: item.price,
        }));

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
        selectedAccessories,
        rawProduct: product,
      };
      dispatch(addItem(cartItem as Parameters<typeof addItem>[0]));
    }

    setAddedSuccess(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAddedSuccess(false), 1800);
  };

  // ── Mobile handlers ───────────────────────────────────────────────────────

  // Returns cached cartItemId or fetches it on demand — used by all mobile handlers
  const resolveCartItemId = async (): Promise<number | null> => {
    if (mobileCartItemId) return mobileCartItemId;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await makeApiRequest<any>(apiUrls.CART_GET, {
        params: { country: country?.name ?? "" },
      });
      // Response: { success, data: { customer_cart_products: [{ id, product_id, ... }] } }
      const items: any[] = res?.data?.customer_cart_products ?? []; // eslint-disable-line @typescript-eslint/no-explicit-any
      // Update shared cache so other instances benefit too
      cachedCartItems = items;
      cartCacheFetched = true;
      const found = items.find((i: any) => i.product_id === product.id); // eslint-disable-line @typescript-eslint/no-explicit-any
      if (found?.id) {
        setMobileCartItemId(found.id);
        setMobileQty(found.quantity ?? minQty);
        return found.id;
      }
    } catch {}
    return null;
  };

  const handleMobileAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileLoading(true);

    const token = getToken();
    if (token) {
      const shippingCharge = getShippingCharge(
        location?.city ?? "",
        location?.regionName ?? "",
      );
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await makeApiRequest<any>(apiUrls.CART_ADD, {
          method: "POST",
          data: {
            country: country?.name ?? "",
            product_id: product.id,
            vendor_id: vendorId,
            quantity: minQty,
            shipping_charge: shippingCharge,
            accessory_item_ids: accessoryItemIds,
          },
        });

        // Show counter immediately — don't wait for cartItemId
        setMobileInCart(true);
        setMobileQty(minQty);
        invalidateCartCache();

        // Try to get cartItemId from add response first
        const itemId =
          res?.data?.id ??
          res?.data?.cart_product?.id ??
          res?.data?.cart_item?.id ??
          res?.id ??
          null;

        if (itemId) {
          setMobileCartItemId(itemId);
        } else {
          // Fallback: fetch with country param — result gets cached in mobileCartItemId
          resolveCartItemId().catch(() => {});
        }
      } catch {
        // silent
      }
    } else {
      const shippingCharge = getShippingCharge(
        location?.city ?? "",
        location?.regionName ?? "",
      );
      const subTotal = activePrice * minQty;
      const totalPrice = subTotal + shippingCharge;
      const rawAcc = (product as RawApiProduct).accessories ?? [];
      const selectedAccessories = rawAcc
        .flatMap((acc) => acc.accessory_item ?? [])
        .filter((item) => accessoryItemIds.includes(item.id))
        .map((item) => ({
          id: item.id,
          name: resolveStr(item.name as LS, locale),
          price: item.price,
        }));

      dispatch(
        addItem({
          productId: product.id,
          name,
          url: product.url ?? "",
          parentCategoryUrl: product.parent_category_url ?? "",
          image,
          price: activePrice,
          originalPrice,
          hasSale,
          currencySymbol,
          quantity: minQty,
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
          selectedAccessories,
          rawProduct: product,
        } as Parameters<typeof addItem>[0]),
      );
    }

    setMobileLoading(false);
  };

  const handleMobileIncrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newQty = isFixed ? currentMobileQty + minQty : currentMobileQty + 1;
    if (newQty > 99) return;

    const token = getToken();
    if (token) {
      setMobileLoading(true);
      try {
        const cartId = await resolveCartItemId();
        if (cartId) {
          await makeApiRequest(apiUrls.CART_UPDATE_QTY(cartId), {
            method: "PUT",
            data: { quantity: newQty },
          });
        }
        setMobileQty(newQty);
      } catch {
        // silent
      } finally {
        setMobileLoading(false);
      }
    } else {
      dispatch(updateQuantity({ productId: product.id, quantity: newQty }));
    }
  };

  const handleMobileDecrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newQty = isFixed ? currentMobileQty - minQty : currentMobileQty - 1;
    if (newQty < minQty) return;

    const token = getToken();
    if (token) {
      setMobileLoading(true);
      try {
        const cartId = await resolveCartItemId();
        if (cartId) {
          await makeApiRequest(apiUrls.CART_UPDATE_QTY(cartId), {
            method: "PUT",
            data: { quantity: newQty },
          });
        }
        setMobileQty(newQty);
      } catch {
        // silent
      } finally {
        setMobileLoading(false);
      }
    } else {
      dispatch(updateQuantity({ productId: product.id, quantity: newQty }));
    }
  };

  const handleMobileDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getToken();
    if (token) {
      setMobileLoading(true);
      try {
        const cartId = await resolveCartItemId();
        if (cartId) {
          await makeApiRequest(apiUrls.CART_REMOVE(cartId), {
            method: "DELETE",
          });
        }
        setMobileInCart(false);
        setMobileCartItemId(null);
        setMobileQty(minQty);
        invalidateCartCache();
      } catch {
        // silent
      } finally {
        setMobileLoading(false);
      }
    } else {
      dispatch(removeItem(product.id));
    }
  };

  // ── Desktop button class ──────────────────────────────────────────────────
  const variant = isQuote ? "quote" : "cart";
  const label = isQuote ? "Request a Quote" : "Add To Cart";

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

  // ── Mobile: quote products use desktop-style button ───────────────────────
  // if (isMobile && !isQuote) {
  //   return (
  //     <div className={wrapperClassName ?? "flex gap-2 items-center w-full"}>
  //       {effectiveMobileInCart ? (
  //         /* Mobile counter */
  //         <div className="flex items-center bg-[#2563EB] rounded-[6px] overflow-hidden flex-1 h-8.5">
  //           {/* Left: trash (at minQty) or minus (above minQty) */}
  //           <button
  //             onClick={
  //               currentMobileQty <= minQty
  //                 ? handleMobileDelete
  //                 : handleMobileDecrement
  //             }
  //             disabled={mobileLoading}
  //             className="w-10 h-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
  //           >
  //             {currentMobileQty <= minQty ? (
  //               <Trash2 size={14} strokeWidth={2} />
  //             ) : (
  //               <Minus size={14} strokeWidth={2} />
  //             )}
  //           </button>

  //           {/* Count */}
  //           <span className="flex-1 text-center text-white text-[13px] font-semibold select-none">
  //             {mobileLoading ? <Loader /> : currentMobileQty}
  //           </span>

  //           {/* Plus */}
  //           <button
  //             onClick={handleMobileIncrement}
  //             disabled={mobileLoading || currentMobileQty >= 99}
  //             className="w-10 h-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
  //           >
  //             <Plus size={14} strokeWidth={2} />
  //           </button>
  //         </div>
  //       ) : (
  //         /* Mobile Add To Cart button */
  //         <button
  //           onClick={handleMobileAddToCart}
  //           disabled={mobileLoading}
  //           className="flex-1 h-8.5 rounded-lg bg-[#186737] hover:bg-[#145c30] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:bg-gray-400 disabled:cursor-wait"
  //         >
  //           {mobileLoading ? (
  //             <>
  //               Adding <Loader />
  //             </>
  //           ) : (
  //             <>
  //               <ShoppingCart size={13} strokeWidth={2} />
  //               Add To Cart
  //             </>
  //           )}
  //         </button>
  //       )}
  //     </div>
  //   );
  // }

  // ── Desktop layout ────────────────────────────────────────────────────────
  return (
    <>
    <div className="hidden md:block">
      <div className={wrapperClassName ?? "flex gap-2 items-center w-full"}>
      {/* Quantity Counter */}
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

      {/* Add To Cart / Request Quote Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={computedButtonClass}
      >
        {addedSuccess ? (
          <CheckCircle size={16} strokeWidth={2} />
        ) : variant !== "quote" ? (
          <ShoppingCart size={16} strokeWidth={2} />
        ) : null}
        {loading ? (
          <>
            Adding <Loader />
          </>
        ) : addedSuccess ? (
          "Added!"
        ) : (
          label
        )}
      </button>
    </div>
    </div>

    <div className="md:hidden block">
       <div className={wrapperClassName ?? "flex gap-2 items-center w-full"}>
        {effectiveMobileInCart ? (
          /* Mobile counter */
          <div className="flex items-center bg-[#2563EB] rounded-[6px] overflow-hidden flex-1 h-8.5">
            {/* Left: trash (at minQty) or minus (above minQty) */}
            <button
              onClick={
                currentMobileQty <= minQty
                  ? handleMobileDelete
                  : handleMobileDecrement
              }
              disabled={mobileLoading}
              className="w-10 h-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {currentMobileQty <= minQty ? (
                <Trash2 size={14} strokeWidth={2} />
              ) : (
                <Minus size={14} strokeWidth={2} />
              )}
            </button>

            {/* Count */}
            <span className="flex-1 text-center text-white text-[13px] font-semibold select-none">
              {mobileLoading ? <Loader /> : currentMobileQty}
            </span>

            {/* Plus */}
            <button
              onClick={handleMobileIncrement}
              disabled={mobileLoading || currentMobileQty >= 99}
              className="w-10 h-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Plus size={14} strokeWidth={2} />
            </button>
          </div>
        ) : (
          /* Mobile Add To Cart button */
          <button
            onClick={handleMobileAddToCart}
            disabled={mobileLoading}
            className="flex-1 h-8.5 rounded-lg bg-[#186737] hover:bg-[#145c30] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:bg-gray-400 disabled:cursor-wait"
          >
            {mobileLoading ? (
              <>
                Adding <Loader />
              </>
            ) : (
              <>
                <ShoppingCart size={13} strokeWidth={2} />
                Add To Cart
              </>
            )}
          </button>
        )}
      </div>
    </div>
    </>
  );
};

export default AddToCartWidget;
