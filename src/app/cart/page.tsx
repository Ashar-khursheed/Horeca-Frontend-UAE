"use client";

import CartItemRow from "@/components/cart/cart-item-row";
import CartSummary from "@/components/cart/cart-summary";
import SavedProductCard from "@/components/cart/saved-product-card";
import { CartItem, SavedItem, TAX_RATE } from "@/components/cart/cart-types";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Package,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const INITIAL_CART: CartItem[] = [
  {
    id: 1,
    name: 'Turbo Air TBC-24SB-N6 24" Super Deluxe Bottle Cooler, 3.6 cu. Ft.',
    brand: "Turbo Air",
    modelNo: "TBC-24SB-N6",
    image:
      "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35898/79046/tbc-36sb-n6__79124.1694539695.jpg",
    price: 2426.63,
    originalPrice: 2800.0,
    unit: "Each",
    shippingCost: 99.0,
    deliveryDays: "5 to 7 Days",
    shipBy: "Wed, May 13 – Fri, May 15",
    qty: 1,
    inWishlist: false,
  },
];

const INITIAL_SAVED: SavedItem[] = [
  {
    id: 101,
    name: 'FrostLine Series 27" Reach-In Refrigerator, 1 Door, 23 Cu. Ft.',
    brand: "FrostLine",
    modelNo: "FLRR27",
    image:
      "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/22553/44895/msr-49nm-n__95248.1644947060.jpg",
    price: 1529.0,
    originalPrice: 1529.0,
    unit: "Each",
    rating: 0,
    reviews: 0,
    deliveryDays: "5 to 7 Days",
    freeShipping: false,
    qty: 1,
    url: "/",
  },
  {
    id: 102,
    name: '54" Reach-In Merchandiser Refrigerator, 2 Glass Door',
    brand: "Medal Equipment",
    modelNo: "MRBL248",
    image:
      "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/24020/48316/TUC-27F-HC__90534.1618345196.jpg",
    price: 1799.0,
    originalPrice: 2100.0,
    unit: "Each",
    rating: 0,
    reviews: 0,
    deliveryDays: "5 to 7 Days",
    freeShipping: false,
    qty: 1,
    url: "/",
  },
  {
    id: 103,
    name: "PolarBox Series 6' x 6' Quick Ship Walk-In Cooler With Floor",
    brand: "PolarBox",
    modelNo: "PBWF6X6-RM",
    image:
      "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35898/79046/tbc-36sb-n6__79124.1694539695.jpg",
    price: 7294.0,
    originalPrice: 7294.0,
    unit: "Each",
    rating: 4.4,
    reviews: 8,
    deliveryDays: "5 to 7 Days",
    freeShipping: false,
    qty: 1,
    url: "/",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const [cartItems, setCartItems]       = useState<CartItem[]>(INITIAL_CART);
  const [savedItems, setSavedItems]     = useState<SavedItem[]>(INITIAL_SAVED);
  const [shipmentOpen, setShipmentOpen] = useState(true);

  // ── Saved slider ─────────────────────────────────────────────────────────
  const [savedPage, setSavedPage]       = useState(0);
  const [perView, setPerView]           = useState(3);

  useEffect(() => {
    const calc = () =>
      setPerView(window.innerWidth >= 1024 ? 4 : 2);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // clamp page when items are removed
  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(savedItems.length / perView) - 1);
    if (savedPage > maxPage) setSavedPage(maxPage);
  }, [savedItems.length, perView, savedPage]);

  const savedTotalPages = Math.ceil(savedItems.length / perView);
  const savedVisible    = savedItems.slice(savedPage * perView, savedPage * perView + perView);

  const totalItems = cartItems.reduce((s, c) => s + c.qty, 0);
  const subtotal   = cartItems.reduce((s, c) => s + c.price * c.qty, 0);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleQty = (id: number, qty: number) =>
    setCartItems((p) => p.map((c) => (c.id === id ? { ...c, qty } : c)));

  const handleRemoveCart = (id: number) =>
    setCartItems((p) => p.filter((c) => c.id !== id));

  const handleWishlist = (id: number) =>
    setCartItems((p) => p.map((c) => (c.id === id ? { ...c, inWishlist: !c.inWishlist } : c)));

  const handleRemoveSaved = (id: number) =>
    setSavedItems((p) => p.filter((s) => s.id !== id));

  const handleAddSavedToCart = (id: number) => {
    const item = savedItems.find((s) => s.id === id);
    if (!item) return;
    setCartItems((p) => [
      ...p,
      {
        id: item.id,
        name: item.name,
        brand: item.brand,
        modelNo: item.modelNo,
        image: item.image,
        price: item.price,
        originalPrice: item.originalPrice,
        unit: item.unit,
        shippingCost: item.freeShipping ? 0 : 99,
        deliveryDays: item.deliveryDays,
        shipBy: "TBD",
        qty: item.qty,
        inWishlist: false,
      },
    ]);
    setSavedItems((p) => p.filter((s) => s.id !== id));
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <>
        <CartBreadcrumb />
        <main className="min-h-screen bg-gray-50/60">
          <div className="global-container py-6 sm:py-8">
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm py-24 text-center px-6">
              <div className="w-20 h-20 rounded-full bg-[#f0f9f4] flex items-center justify-center mx-auto mb-5">
                <ShoppingCart size={34} className="text-[#186737]" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed mb-8">
                Add items to your cart to see them here. Browse our wide range of commercial kitchen equipment.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#186737] hover:bg-[#145c30] text-white font-semibold px-6 py-3 rounded-[7px] transition-colors duration-200"
              >
                Start Shopping <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <CartBreadcrumb />
      <main className="min-h-screen bg-gray-50/60">
        <div className="global-container py-6 sm:py-8">

          {/* Page header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[7px] bg-[#186737] flex items-center justify-center shadow-sm">
                <ShoppingCart size={19} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  Shopping Cart
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
                </p>
              </div>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={() => setCartItems([])}
                className="text-xs text-gray-400 hover:text-red-500 font-semibold hover:underline transition-colors"
              >
                Remove All Items
              </button>
            )}
          </div>

          {/* ── Main grid ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px] xl:grid-cols-[1fr_328px] gap-6 items-start">

            {/* LEFT */}
            <div className="space-y-5">

              {/* ── Cart Items ─────────────────────────────────────────── */}
              {cartItems.length > 0 && (
                <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={15} className="text-[#186737]" />
                      <h2 className="font-bold text-gray-900 text-sm">
                        Shipment <span className="text-[#186737]">1</span>
                      </h2>
                      <span className="text-xs text-gray-400 font-medium">
                        ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
                      </span>
                    </div>
                    <button
                      onClick={() => setShipmentOpen((o) => !o)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {shipmentOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {shipmentOpen && (
                    <div className="divide-y divide-gray-50">
                      {cartItems.map((item) => (
                        <div key={item.id} className="px-5 py-5">
                          <CartItemRow
                            item={item}
                            onQty={handleQty}
                            onRemove={handleRemoveCart}
                            onWishlist={handleWishlist}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Truck size={13} className="text-[#186737]" />
                      Estimated delivery:{" "}
                      <span className="font-semibold text-gray-700">Wed, May 13 – Fri, May 15</span>
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      Subtotal: ${fmtPrice(subtotal)}
                    </p>
                  </div>
                </section>
              )}

              {/* ── Saved for Later ────────────────────────────────────── */}
              {savedItems.length > 0 && (
                <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">

                  {/* Header */}
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart size={15} className="text-[#186737]" />
                      <h2 className="font-bold text-gray-900 text-sm">
                        Saved for Later{" "}
                        <span className="text-gray-400 font-normal text-xs">
                          ({savedItems.length} item{savedItems.length !== 1 ? "s" : ""})
                        </span>
                      </h2>
                    </div>

                    {/* Arrow controls */}
                    {savedTotalPages > 1 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSavedPage((p) => Math.max(0, p - 1))}
                          disabled={savedPage === 0}
                          className="w-7 h-7 rounded-[6px] border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#186737] hover:text-[#186737] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-[11px] font-semibold text-gray-400 min-w-[36px] text-center">
                          {savedPage + 1} / {savedTotalPages}
                        </span>
                        <button
                          onClick={() => setSavedPage((p) => Math.min(savedTotalPages - 1, p + 1))}
                          disabled={savedPage >= savedTotalPages - 1}
                          className="w-7 h-7 rounded-[6px] border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#186737] hover:text-[#186737] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Slider track */}
                  <div className="p-4 overflow-hidden">
                    <div
                      className="flex gap-4 transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${savedPage * (100 / savedTotalPages)}%)`,
                        width: `${savedTotalPages * 100}%`,
                      }}
                    >
                      {Array.from({ length: savedTotalPages }).map((_, pageIdx) => (
                        <div
                          key={pageIdx}
                          className="grid gap-4 shrink-0"
                          style={{
                            width: `${100 / savedTotalPages}%`,
                            gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))`,
                          }}
                        >
                          {savedItems
                            .slice(pageIdx * perView, pageIdx * perView + perView)
                            .map((item) => (
                              <SavedProductCard
                                key={item.id}
                                item={item}
                                onAddToCart={handleAddSavedToCart}
                                onRemove={handleRemoveSaved}
                              />
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dot indicators */}
                  {savedTotalPages > 1 && (
                    <div className="flex justify-center items-center gap-1.5 pb-4">
                      {Array.from({ length: savedTotalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSavedPage(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === savedPage ? "w-5 bg-[#186737]" : "w-1.5 bg-gray-200 hover:bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* RIGHT */}
            <CartSummary cartItems={cartItems} />
          </div>
        </div>
      </main>
    </>
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
