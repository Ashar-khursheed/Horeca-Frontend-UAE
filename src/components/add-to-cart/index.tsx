"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocationData } from "@/utils/locationStorage";
import {
  addItem,
  hydrateCart,
  removeItem,
  updateQuantity,
  fetchCart,
  addApiEntry,
  updateApiEntryQty,
  removeApiEntry,
} from "@/store/slices/cart/cartSlice";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import {
  toggleWishlistItem,
  toggleGuestWishlistItem,
} from "@/store/slices/wishlist/wishlistSlice";
import { fetchCounts } from "@/store/slices/customer-counts/customerCountsSlice";
import { getShippingCharge } from "@/utils/shipping";
import type { ApiProduct, RawApiProduct } from "@/components/product-card";
import Loader from "../Loader";
import { AddToCartWidgetProps } from "@/features/product-detail/types";

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

// ─── Module-level hydration guard ────────────────────────────────────────────
let cartHydrated = false;

// ─── Component ───────────────────────────────────────────────────────────────
export const AddToCartWidget = ({
  product,
  wrapperClassName,
  counterClassName,
  counterButtonClassName,
  buttonClassName,
  showCounter: showCounterProp,
  accessoryItemIds = [],
  isWishlist = false,
  isSearchbar = true,
  onBeforeAdd,
  onAddSuccess,
  onAddedToCart,
  iconShow = true,
}: AddToCartWidgetProps) => {
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const country = useAppSelector((s) => s.country.data);
  const cartItems = useAppSelector((s) => s.cart.items);
  const apiEntries = useAppSelector((s) => s.cart.apiEntries);
  const apiStatus = useAppSelector((s) => s.cart.apiStatus);
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
      ? ((typed?.ar ?? typed?.en ?? [])[0] ?? "")
      : ((typed?.en ?? typed?.ar ?? [])[0] ?? "");
  })();

  const originalPrice = product.original_price ?? product.price ?? 0;
  const hasSale =
    product.sale_price > 0 && product.sale_price !== originalPrice;
  const activePrice = hasSale ? product.sale_price : originalPrice;

  // ── Redux-derived cart state ──────────────────────────────────────────────
  // For logged-in: read from Redux apiEntries
  const myApiEntry = apiEntries.find((e) => e.productId === product.id);
  // cartItemId > 0 means it's a confirmed server ID; 0 = optimistic placeholder
  const apiCartItemId =
    myApiEntry && myApiEntry.cartItemId > 0 ? myApiEntry.cartItemId : null;
  const apiInCart = !!myApiEntry;
  const apiQty = myApiEntry?.quantity ?? minQty;

  // For guest: read from local Redux items
  const guestCartItem = cartItems.find((i) => i.productId === product.id);

  // ── Local UI state ────────────────────────────────────────────────────────
  const [count, setCount] = useState(minQty); // desktop qty selector
  const [addedSuccess, setAddedSuccess] = useState(false); // desktop flash
  const [loading, setLoading] = useState(false); // desktop button
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived mobile display values
  const effectiveMobileInCart = isLoggedIn ? apiInCart : !!guestCartItem;
  const currentMobileQty = isLoggedIn
    ? apiQty
    : (guestCartItem?.quantity ?? minQty);

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

  // ── Fetch cart from API once (shared across all widget instances) ─────────
  useEffect(() => {
    if (!isLoggedIn || !country?.name) return;
    // Only fetch if not already loading or succeeded
    if (apiStatus === "idle" || apiStatus === "failed") {
      dispatch(fetchCart(country.name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, country?.name]);

  // ── Resolve cartItemId (uses Redux first, falls back to CART_GET) ─────────
  const resolveCartItemId = async (): Promise<number | null> => {
    if (apiCartItemId) return apiCartItemId;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await makeApiRequest<any>(apiUrls.CART_GET, {
        params: { country: country?.name ?? "" },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const products: any[] = res?.data?.customer_cart_products ?? [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const found = products.find((cp: any) => cp.product_id === product.id);
      if (found?.id) {
        dispatch(
          addApiEntry({
            cartItemId: found.id,
            productId: product.id,
            quantity: found.quantity,
          }),
        );
        return found.id;
      }
    } catch {}
    return null;
  };

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
      location?.countryCode ?? location?.country ?? "",
    );
    const subTotal = activePrice * count;
    const totalPrice = subTotal + (shippingCharge ?? 0);
    const token = getToken();

    if (token) {
      setLoading(true);
      try {
        await onBeforeAdd?.();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await makeApiRequest<any>(apiUrls.CART_ADD, {
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
        const itemId: number =
          res?.data?.id ??
          res?.data?.cart_product?.id ??
          res?.data?.cart_item?.id ??
          res?.id ??
          0;
        // Update apiEntries (header count) and bump lastAddedAt (triggers cart page re-fetch)
        dispatch(addApiEntry({ cartItemId: itemId, productId: product.id, quantity: count }));
        dispatch(fetchCounts() as any);
        if (!itemId) resolveCartItemId().catch(() => {});
        // Notify parent immediately after successful add (before flash)
        onAddSuccess?.();
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    } else {
      await onBeforeAdd?.();
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
        } as Parameters<typeof addItem>[0]),
      );
      onAddSuccess?.();
    }

    setAddedSuccess(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAddedSuccess(false), 1800);

    // If used inside wishlist: remove the item from wishlist after add
    if (isWishlist) {
      const token = getToken();
      if (token) {
        dispatch(
          toggleWishlistItem({
            productId: product.id,
            currentlyInWishlist: true,
          }),
        );
      } else {
        dispatch(
          toggleGuestWishlistItem({
            productId: product.id,
            rawProduct: product,
          }),
        );
      }
    }
    // Always notify parent after successful add (after "Added!" flash)
    setTimeout(() => onAddedToCart?.(product.id), 900);
  };

  // ── Mobile handlers ───────────────────────────────────────────────────────

  const handleMobileAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileLoading(true);

    const token = getToken();
    if (token) {
      const shippingCharge = getShippingCharge(
        location?.city ?? "",
        location?.regionName ?? "",
        location?.countryCode ?? location?.country ?? "",
      );
      try {
        await onBeforeAdd?.();
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

        // Try to get cartItemId from CART_ADD response
        const itemId: number =
          res?.data?.id ??
          res?.data?.cart_product?.id ??
          res?.data?.cart_item?.id ??
          res?.id ??
          0; // 0 = placeholder, resolveCartItemId will fix it

        // Optimistically add to Redux → shows counter immediately
        dispatch(
          addApiEntry({
            cartItemId: itemId,
            productId: product.id,
            quantity: minQty,
          }),
        );
        dispatch(fetchCounts() as any);

        // If no real ID yet, resolve in background
        if (!itemId) resolveCartItemId().catch(() => {});
      } catch {
        // silent
      }
    } else {
      await onBeforeAdd?.();
      const shippingCharge = getShippingCharge(
        location?.city ?? "",
        location?.regionName ?? "",
        location?.countryCode ?? location?.country ?? "",
      );
      const subTotal = activePrice * minQty;
      const totalPrice = subTotal + (shippingCharge ?? 0);
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
      onAddSuccess?.();
    }

    setMobileLoading(false);
    setTimeout(() => onAddedToCart?.(product.id), 900);
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
          dispatch(updateApiEntryQty({ cartItemId: cartId, quantity: newQty }));
          dispatch(fetchCounts() as any);
        }
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
          dispatch(updateApiEntryQty({ cartItemId: cartId, quantity: newQty }));
          dispatch(fetchCounts() as any);
        }
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
          dispatch(removeApiEntry(cartId));
          dispatch(fetchCounts() as any);
        } else {
          // No valid cartId — remove by productId from Redux
          dispatch(removeApiEntry(myApiEntry?.cartItemId ?? 0));
        }
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

  // ── Mobile layout (non-quote only) ───────────────────────────────────────
  // if (isMobile && !isQuote) {
  //   return (
  //     <div className={wrapperClassName ?? "flex gap-2 items-center w-full"}>
  //       {effectiveMobileInCart ? (
  //         /* Mobile counter */
  //         <div className="flex items-center bg-[#2563EB] rounded-[6px] overflow-hidden flex-1 h-8.5">
  //           {/* Left: trash (at minQty) or minus (above minQty) */}
  //           <button
  //             onClick={currentMobileQty <= minQty ? handleMobileDelete : handleMobileDecrement}
  //             disabled={mobileLoading}
  //             className="w-10 h-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
  //           >
  //             {currentMobileQty <= minQty
  //               ? <Trash2 size={14} strokeWidth={2} />
  //               : <Minus size={14} strokeWidth={2} />
  //             }
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
  //             <>Adding <Loader /></>
  //           ) : (
  //             <><ShoppingCart size={13} strokeWidth={2} /> Add To Cart</>
  //           )}
  //         </button>
  //       )}
  //     </div>
  //   );
  // }

  // ── Desktop layout ────────────────────────────────────────────────────────
  return (
    <>
      <div className="md:block hidden">
        {" "}
        <div className={wrapperClassName ?? "flex gap-2 items-center w-full"}>
          {/* Quantity Counter */}
          {showCounter && isSearchbar && (
          <>
          <div className="">
              <div
              className={
                counterClassName ??
                "flex items-center border border-[#BCE3C9] rounded-[4px] overflow-hidden bg-white flex-shrink-0 3xl:w-[90px] 3xl:h-[44px] xl:w-[85px] xl:h-[35px] w-[75px] h-[29px]  "
              }
            >
              <button
                onClick={handleDecrement}
                disabled={count <= minQty || loading}
                className={
                  counterButtonClassName ??
                  "w-8 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
                }
              >
                <Minus
                  size={counterButtonClassName ? 10 : 15}
                  className="text-[#4B5563]"
                  strokeWidth={2}
                />
              </button>
              <input
                type="text"
                value={count}
                disabled={isFixed || loading}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1 && v <= 99) setCount(v);
                }}
                className="flex-1 min-w-0 text-center text-[10px] font-semibold text-[#186737] border-0 outline-none bg-transparent disabled:cursor-not-allowed "
              />
              <button
                onClick={handleIncrement}
                disabled={count >= 99 || loading}
                className={
                  counterButtonClassName ??
                  "w-8 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
                }
              >
                <Plus
                  size={counterButtonClassName ? 10 : 15}
                  className="text-[#4B5563]"
                  strokeWidth={2}
                />
              </button>
            </div>
            </div></>
          )}

          {/* Add To Cart / Request Quote Button */}
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className={computedButtonClass}
          >
            {addedSuccess ? (
              <> {iconShow && <CheckCircle size={16} strokeWidth={2} />}</>
            ) : variant !== "quote" ? (
              <>{iconShow && <ShoppingCart size={13} strokeWidth={2} />}</>
            ) : null}
            {loading ? (
              <>
                {" "}
                <Loader />
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
        {" "}
        <div className={wrapperClassName ?? "flex gap-2 items-center w-full"}>
          {effectiveMobileInCart && !isQuote && showCounter ? (
            /* Mobile counter */
            <div className="flex items-center bg-green-800 rounded-[6px] overflow-hidden flex-1 h-8.5">
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
          ) : isQuote ? (
            /* Mobile Request a Quote button */
            <button
              // onClick={handleAddToCart}
              disabled={loading}
              className="flex-1 h-8.5 rounded-lg bg-[#A6131D] hover:bg-[#8b1018] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Request a Quote
            </button>
          ) : (
            /* Mobile Add To Cart button */
            <button
              onClick={handleMobileAddToCart}
              disabled={mobileLoading}
              className={`flex-1  rounded-lg bg-[#186737] hover:bg-[#145c30] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:bg-gray-400 disabled:cursor-wait ${isWishlist ? "h-10 px-3" : "h-8.5"} `}
            >
              {mobileLoading ? (
                <>
                  <Loader />
                </>
              ) : (
                <>
                  {iconShow && !isWishlist && (
                    <ShoppingCart size={13} strokeWidth={2} />
                  )}{" "}
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
