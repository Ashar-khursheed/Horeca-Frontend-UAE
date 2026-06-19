"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import CartItemRow from "@/components/cart/cart-item-row";
import CartSummary from "@/components/cart/cart-summary";
import { CartItem, SavedItem } from "@/components/cart/cart-types";
import SavedProductCard from "@/components/cart/saved-product-card";
import { Modal } from "@/components/ui/modal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCart,
  fetchCart,
  hydrateCart,
  removeApiEntry,
  removeItem,
  resetApiStatus,
  updateApiEntryQty,
  updateQuantity,
} from "@/store/slices/cart/cartSlice";
import {
  fetchSaveForLater,
  hydrateGuestSaveItems,
  removeSaveForLater,
  toggleGuestSaveItem,
} from "@/store/slices/save-for-later/saveForLaterSlice";
import { fetchCounts } from "@/store/slices/customer-counts/customerCountsSlice";
import {
  getDefaultAddressCache,
  getLocationData,
} from "@/utils/locationStorage";
import { getShippingCharge } from "@/utils/shipping";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Home,
  Package,
  ShoppingCart,
} from "lucide-react";
import { usePerPage } from "@/hooks/usePerPage";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TaxInitializer from "@/components/TaxInitializer";
// ── Helpers ───────────────────────────────────────────────────────────────────
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const t = localStorage.getItem("token");
    return t ? t.trim().replace(/^["']|["']$/g, "") : null;
  } catch {
    return null;
  }
};

const resolveStr = (
  v: { en?: string; ar?: string } | string | null | undefined,
): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v.en ?? v.ar ?? "";
};

// ── Transform API cart product → CartItem ─────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiProductToCartItem = (cp: any): CartItem => ({
  id: cp.product_id ?? cp.id,
  cartItemId: cp.id,
  vendorId: cp.vendor_id ?? cp.product?.vendor_id ?? 1,
  name: resolveStr(cp.product?.name),
  brand: "",
  modelNo: cp.product?.sku ?? "",
  image: cp.product?.images?.en?.[0] ?? cp.product?.images?.ar?.[0] ?? "",
  price: parseFloat(cp.unit_price ?? cp.product?.price ?? 0),
  originalPrice: parseFloat(cp.unit_price ?? cp.product?.price ?? 0),
  currencySymbol: cp.product?.currency?.symbol ?? "$",
  unit: resolveStr(cp.product?.selling_type?.attribute_value_unit) || "Each",
  shippingCost: parseFloat(cp.shipping_charge ?? 0),
  deliveryDays: cp.delivery_days ?? "",
  shipBy: cp.delivery_days ?? "",
  qty: cp.quantity ?? 1,
  minQty: cp.product?.suppliers?.[0]?.min_quantity ?? 1,
  isFixed: !!cp.product?.suppliers?.[0]?.is_fixed,
  inWishlist: false,
  selectedAccessories: (cp.accessory_charges ?? []).map((acc: any) => ({
    id: acc.accessory_item_id,
    name: acc.accessory_item_name,
    price: parseFloat(acc.accessory_item_price ?? 0),
  })),
  url: cp.product?.url ?? "#",
});

// ── Transform localStorage Redux CartItem → display CartItem ──────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const localItemToCartItem = (item: any): CartItem => ({
  id: item.productId,
  vendorId: item.vendorId ?? 1,
  name: item.name ?? "",
  brand: "",
  modelNo: item.sku ?? "",
  image: item.image ?? "",
  price: item.price ?? 0,
  url: item.url ?? "#",
  originalPrice: item.originalPrice ?? item.price ?? 0,
  unit: item.sellUnit ?? "Each",
  shippingCost: item.shippingCharge ?? 0,
  deliveryDays:
    item.rawProduct?.delivery_days ??
    item.rawProduct?.suppliers?.[0]?.delivery_days ??
    "",
  shipBy:
    item.rawProduct?.suppliers?.[0]?.delivery_days ??
    item.rawProduct?.delivery_days ??
    "",
  qty: item.quantity ?? 1,
  minQty: item.minQty ?? 1,
  isFixed: item.isFixed ?? false,
  currencySymbol:
    item.currencySymbol ?? item.rawProduct?.currency?.symbol ?? "$",
  selectedAccessories: item.selectedAccessories ?? [],
  inWishlist: false,
});

// ── Map API save-for-later product → SavedItem ────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiToSavedItem = (p: any): SavedItem => {
  const listPrice = parseFloat(p.price ?? 0);
  const salePrice = parseFloat(p.sale_price ?? 0);
  return {
    id: p.id,
    name: resolveStr(p.name),
    brand: "",
    modelNo: p.sku ?? "",
    image: p.images?.en?.[0] ?? p.images?.ar?.[0] ?? p.image ?? "",
    price: salePrice > 0 ? salePrice : listPrice,
    salePrice: salePrice > 0 ? salePrice : undefined,
    originalPrice: listPrice,
    unit: resolveStr(p.selling_type?.attribute_value_unit) || "Each",
    rating: p.avg_rating ?? 0,
    reviews: p.total_reviews ?? 0,
    deliveryDays: p.suppliers?.[0]?.delivery_days ?? "",
    freeShipping: !!p.suppliers?.[0]?.free_shipping,
    qty: p.quantity ?? 1,
    url: p.url ?? "#",
    inWishlist: p.in_wishlist ?? false,
    currencySymbol: p.currency?.symbol ?? p.currencySymbol ?? "$",
    vendorId: p.suppliers?.[0]?.vendor_id,
    returnPolicy: p.suppliers?.[0]?.return_policy ?? "",
    categoryUrl: p.category_url_resolved ?? "",
    parentCategoryUrl: p.parent_category_url_resolved ?? "",
    minQty: p.suppliers?.[0]?.min_quantity ?? 1,
    isFixed: !!p.suppliers?.[0]?.is_fixed,
    altTags:
      Array.isArray(p.alt_tags) && p.alt_tags.length > 0
        ? p.alt_tags
        : undefined,
  };
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const dispatch = useAppDispatch();
  const rawProducts = useAppSelector((s) => s.cart.rawProducts);
  const reduxGuestItems = useAppSelector((s) => s.cart.items);
  const apiStatus = useAppSelector((s) => s.cart.apiStatus);
  const lastAddedAt = useAppSelector((s) => s.cart.lastAddedAt);
  const sflApiEntries = useAppSelector((s) => s.saveForLater.apiEntries);
  const sflGuestItems = useAppSelector((s) => s.saveForLater.guestItems);

  const cartShippingCharge = useAppSelector((s) => s.cart.cartShippingCharge);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [shipmentOpen, setShipmentOpen] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [sflKey, setSflKey] = useState(0);
  const fetchedRef = useRef(false);
  const refetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load cart on mount ────────────────────────────────────────────────────
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const token = getToken();
    const location = getLocationData();

    if (token) {
      setIsLoggedIn(true);
      const countryName = location?.country ?? "";
      dispatch(resetApiStatus());
      dispatch(fetchCart(countryName));
      dispatch(fetchSaveForLater());
    } else {
      setIsLoggedIn(false);
      dispatch(hydrateCart());
      dispatch(hydrateGuestSaveItems());
    }
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when items are added — debounced so rapid adds collapse into one call
  useEffect(() => {
    if (!initialized || !isLoggedIn || lastAddedAt === 0) return;
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      const location = getLocationData();
      dispatch(fetchCart(location?.country ?? ""));
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAddedAt]);

  // Derive display items from Redux (logged-in) or local state (guest)
  const defaultAddr = getDefaultAddressCache();
  const location = getLocationData();
  const locationShipping = getShippingCharge(
    defaultAddr?.city ?? location?.city ?? "",
    defaultAddr?.state ?? location?.regionName ?? "",
    defaultAddr?.country ?? location?.countryCode ?? location?.country ?? "",
  );
  const cartItems: CartItem[] = isLoggedIn
    ? rawProducts.map((cp) => {
        const apiItemShipping = parseFloat(cp.shipping_charge ?? 0);
        // If no per-item charge from API, fall back to location tier (0 for non-US)
        return {
          ...apiProductToCartItem(cp),
          shippingCost:
            apiItemShipping > 0 ? apiItemShipping : (locationShipping ?? 0),
        };
      })
    : reduxGuestItems.map((item) => ({
        ...localItemToCartItem(item),
      }));

  const loading =
    !initialized ||
    (isLoggedIn && (apiStatus === "idle" || apiStatus === "loading"));
  const totalItems = cartItems.reduce((s, c) => s + c.qty, 0);
  const subtotal = cartItems.reduce((s, c) => s + c.price * c.qty, 0);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleQty = (id: number, qty: number) => {
    if (isLoggedIn) {
      const item = cartItems.find((c) => c.id === id);
      if (item?.cartItemId) {
        makeApiRequest(apiUrls.CART_UPDATE_QTY(item.cartItemId), {
          method: "PUT",
          data: { quantity: qty },
        })
          .then(() => dispatch(fetchCounts() as any))
          .catch(() => {});
        dispatch(
          updateApiEntryQty({ cartItemId: item.cartItemId, quantity: qty }),
        );
      }
    } else {
      dispatch(updateQuantity({ productId: id, quantity: qty }));
    }
  };

  const handleRemove = (id: number) => {
    if (isLoggedIn) {
      const item = cartItems.find((c) => c.id === id);
      if (item?.cartItemId) {
        makeApiRequest(apiUrls.CART_REMOVE(item.cartItemId), {
          method: "DELETE",
        })
          .then(() => dispatch(fetchCounts() as any))
          .catch(() => {});
        dispatch(removeApiEntry(item.cartItemId));
      }
    } else {
      dispatch(removeItem(id));
    }
  };

  // Called after save-for-later POST succeeds.
  // Backend already removes the item from cart — no DELETE needed.
  const handleWishlist = (id: number) => {
    if (isLoggedIn) {
      // Remove from Redux cart state immediately (no DELETE API call)
      const item = cartItems.find((c) => c.id === id);
      if (item?.cartItemId) dispatch(removeApiEntry(item.cartItemId));
      // Refresh both lists from server
      dispatch(fetchSaveForLater());
      dispatch(fetchCart(location?.country ?? ""));
    } else {
      // Guest: remove from local state only
      handleRemove(id);
    }
  };

  // ── Saved-for-later items ─────────────────────────────────────────────────
  const savedItems: SavedItem[] = isLoggedIn
    ? sflApiEntries.map(apiToSavedItem)
    : sflGuestItems.map((g) => apiToSavedItem(g.rawProduct));

  const handleAddSavedToCart = (_id: number) => {
    // TODO: wire to add-to-cart flow
  };

  const handleRemoveSaved = async (id: number) => {
    if (isLoggedIn) {
      await dispatch(removeSaveForLater({ productId: id }));
      await dispatch(fetchSaveForLater());
      setSflKey((k) => k + 1);
    } else {
      dispatch(
        toggleGuestSaveItem({
          productId: id,
          quantity: 1,
          vendorId: 1,
          rawProduct: null,
        }),
      );
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <CartBreadcrumb />
        <main className="min-h-screen bg-gray-50/60">
          <div className="global-container py-6 sm:py-8">
            {/* Header skeleton */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[7px] bg-gray-200 animate-pulse" />
              <div className="space-y-2">
                <div className="w-36 h-5 bg-gray-200 animate-pulse rounded" />
                <div className="w-24 h-3 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px] xl:grid-cols-[1fr_328px] gap-6 items-start">
              {/* Left — cart items skeleton */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                {/* Section header */}
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-20 h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="w-12 h-3 bg-gray-100 animate-pulse rounded" />
                </div>

                {/* 3 item rows */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="px-5 py-5 border-b border-gray-50 flex gap-4"
                  >
                    <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-[7px] shrink-0" />
                    <div className="flex-1 space-y-2.5">
                      <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded" />
                      <div className="w-1/3 h-3 bg-gray-100 animate-pulse rounded" />
                      <div className="w-1/4 h-3 bg-gray-100 animate-pulse rounded" />
                      <div className="flex items-center gap-3 mt-3">
                        <div className="w-24 h-8 bg-gray-200 animate-pulse rounded" />
                        <div className="w-28 h-8 bg-gray-200 animate-pulse rounded" />
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 animate-pulse rounded shrink-0" />
                  </div>
                ))}

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="w-40 h-3 bg-gray-200 animate-pulse rounded" />
                  <div className="w-28 h-4 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>

              {/* Right — summary skeleton */}
              <div className="hidden md:block bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="w-28 h-5 bg-gray-200 animate-pulse rounded" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="w-24 h-3 bg-gray-100 animate-pulse rounded" />
                    <div className="w-16 h-3 bg-gray-100 animate-pulse rounded" />
                  </div>
                ))}
                <div className="w-full h-px bg-gray-100" />
                <div className="flex justify-between">
                  <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="w-20 h-4 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-[7px]" />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <>
        <CartBreadcrumb />
        <main className="min-h-screen bg-gray-50/60">
          <div className="global-container py-6 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px] xl:grid-cols-[1fr_400px] gap-6 items-start">
              <div className="space-y-5">
                {/* Empty cart card */}
                <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm py-20 text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-[#f0f9f4] flex items-center justify-center mx-auto mb-5">
                    <ShoppingCart
                      size={34}
                      className="text-[#186737]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed mb-8">
                    Add items to your cart to see them here.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-[#186737] hover:bg-[#145c30] text-white font-semibold px-6 py-3 rounded-[7px] transition-colors duration-200"
                  >
                    Start Shopping <ArrowRight size={16} />
                  </Link>
                </div>

                {/* Saved for Later — still show even when cart is empty */}
                <SavedForLaterSection
                  key={sflKey}
                  items={savedItems}
                  onAddToCart={handleAddSavedToCart}
                  onRemove={handleRemoveSaved}
                  isLoggedIn={isLoggedIn}
                  onAfterAddToCart={() => {
                    if (isLoggedIn)
                      dispatch(fetchCart(location?.country ?? ""));
                    setSflKey((k) => k + 1);
                  }}
                />
              </div>

              {/* RIGHT — summary (hidden when cart empty) */}
              <div className="hidden md:block">
                <CartSummary cartItems={[]} />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Modal
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Remove All Items"
        width="max-w-sm"
        showFooter
        footerBtnText="Yes, Remove All"
        onConfirm={() => {
          if (getToken()) {
            dispatch(resetApiStatus());
            makeApiRequest(apiUrls.CART_EMPTY, { method: "DELETE" })
              .then(() => dispatch(fetchCart(location?.country ?? "")))
              .catch(() => {})
              .then(() => dispatch(fetchCounts() as any))
              .catch(() => {});
          } else {
            dispatch(clearCart());
          }
        }}
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to remove all items from your cart? This action
          cannot be undone.
        </p>
      </Modal>
      {/* <TaxInitializer /> */}
      <CartBreadcrumb />
      <main className="min-h-screen bg-gray-50/60">
        <div className="global-container py-6 sm:py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[7px] bg-[#186737] flex items-center justify-center shadow-sm">
                <ShoppingCart size={19} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    Shopping Cart
                  </h1>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isLoggedIn
                        ? "bg-[#186737] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isLoggedIn ? "My Account" : "Guest"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
                </p>
              </div>
            </div>
            <button
              onClick={() => setConfirmClear(true)}
              className="text-xs md:text-base  text-red-500  font-semibold hover:underline transition-colors"
            >
              Remove All Items
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px] xl:grid-cols-[1fr_400px] gap-6 items-start">
            {/* LEFT */}
            <div className="space-y-5">
              <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={15} className="text-[#186737]" />
                    <h2 className="font-bold text-gray-900 text-sm">
                      Cart <span className="text-[#186737] hidden">1</span>
                    </h2>
                    <span className="text-xs text-gray-400 font-medium">
                      ({cartItems.length} item
                      {cartItems.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <button
                    onClick={() => setShipmentOpen((o) => !o)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {shipmentOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>

                {shipmentOpen && (
                  <div className="divide-y divide-gray-50">
                    {cartItems.map((item) => (
                      <div key={item.id} className="px-5 py-5">
                        <CartItemRow
                          item={item}
                          onQty={handleQty}
                          onRemove={handleRemove}
                          onWishlist={handleWishlist}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Truck size={13} className="text-[#186737]" />
                    Estimated delivery:{" "}
                    <span className="font-semibold text-gray-700">
                      {cartItems[0]?.deliveryDays || "2 to 3 Days"}
                    </span>
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    Subtotal: ${fmtPrice(subtotal)}
                  </p>
                </div> */}
              </section>
              <div className="md:hidden block">
                <CartSummary cartItems={cartItems} />
              </div>
              {/* Saved for Later */}
              <SavedForLaterSection
                key={sflKey}
                items={savedItems}
                onAddToCart={handleAddSavedToCart}
                onRemove={handleRemoveSaved}
                isLoggedIn={isLoggedIn}
                onAfterAddToCart={() => {
                  if (isLoggedIn) dispatch(fetchCart(location?.country ?? ""));
                  setSflKey((k) => k + 1);
                }}
              />

              {/* <div className="md:hidden block">
                  <CartSummary cartItems={cartItems} />
                </div> */}
            </div>

            {/* RIGHT */}

            <div className="md:block hidden">
              <CartSummary cartItems={cartItems} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// ── Saved for Later visible count hook ───────────────────────────────────────
function useSflVisibleCount() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1920) setCount(5);
      else if (w >= 1536) setCount(4);
      else if (w >= 1280) setCount(3);
      else if (w >= 768) setCount(2);
      else setCount(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

// ── Saved for Later section (slider) ─────────────────────────────────────────
function SavedForLaterSection({
  items,
  onAddToCart,
  onRemove,
  onAfterAddToCart,
  isLoggedIn = true,
}: {
  items: SavedItem[];
  onAddToCart: (id: number) => void;
  onRemove: (id: number) => Promise<void>;
  onAfterAddToCart?: () => void;
  isLoggedIn?: boolean;
}) {
  const visibleCount = useSflVisibleCount();
  const [index, setIndex] = useState(0);
  const max = Math.max(0, items.length - visibleCount);

  useEffect(() => {
    setIndex(0);
  }, [visibleCount]);

  if (items.length === 0) return null;

  const visibleItems = items.slice(index, index + visibleCount);

  return (
    <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
        <span className="inline-block text-sm font-semibold text-gray-900 border-b-2 border-[#186737] pb-1">
          Saved for Later{" "}
          <span className="text-gray-500 font-normal">
            ({items.length} Item{items.length !== 1 ? "s" : ""})
          </span>
        </span>
        {items.length > visibleCount && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setIndex((i) => Math.min(max, i + 1))}
              disabled={index >= max}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="px-0 py-5">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${visibleCount}, 1fr)` }}
        >
          {visibleItems.map((item) => (
            <SavedProductCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              onRemove={onRemove}
              onAfterAddToCart={onAfterAddToCart}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
function CartBreadcrumb() {
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="global-container">
        <ol className="flex items-center flex-wrap gap-y-1 h-10 text-xs">
          <li className="flex items-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-[#186737] transition-colors flex items-center gap-1"
            >
              <Home size={11} /> Home
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight size={12} className="mx-1.5 text-gray-300" />
            <span className="text-[#186737] font-semibold">Shopping Cart</span>
          </li>
        </ol>
      </div>
    </nav>
  );
}
