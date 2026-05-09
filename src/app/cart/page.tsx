"use client";

import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Heart,
  Home,
  Lock,
  MessageCircle,
  Minus,
  Package,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type CartItem = {
  id: number;
  name: string;
  brand: string;
  modelNo: string;
  image: string;
  price: number;
  originalPrice: number;
  unit: string;
  shippingCost: number;
  deliveryDays: string;
  shipBy: string;
  qty: number;
  inWishlist: boolean;
};

type SavedItem = {
  id: number;
  name: string;
  brand: string;
  modelNo: string;
  image: string;
  price: number;
  originalPrice: number;
  unit: string;
  rating: number;
  reviews: number;
  deliveryDays: string;
  freeShipping: boolean;
  qty: number;
  url: string;
};

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

const TAX_RATE = 0.0825;

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={11}
        className={
          s <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ))}
  </div>
);

// ── Breadcrumb ────────────────────────────────────────────────────────────────
const CartBreadcrumb = () => (
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

// ── Cart Item Row ─────────────────────────────────────────────────────────────
const CartItemRow = ({
  item,
  onQty,
  onRemove,
  onWishlist,
}: {
  item: CartItem;
  onQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onWishlist: (id: number) => void;
}) => {
  const hasSale = item.originalPrice > item.price;
  const discountPct = hasSale
    ? ((item.originalPrice - item.price) / item.originalPrice) * 100
    : 0;

  return (
    <div className="flex gap-3 sm:gap-4 group">
      {/* Image */}
      <Link href="/" className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
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
            <Link href="/">
              <h3 className="text-sm font-semibold text-gray-900 hover:text-[#186737] transition-colors line-clamp-2 leading-snug">
                {item.name}
              </h3>
            </Link>
            <p className="text-xs text-[#186737] font-semibold mt-1">{item.brand}</p>
            <p className="text-xs text-gray-400 mt-0.5">Model: {item.modelNo}</p>
          </div>

          {/* Price – desktop right */}
          <div className="hidden sm:block text-right shrink-0 ml-4">
            <p className="text-base font-bold text-gray-900">
              ${fmtPrice(item.price * item.qty)}
            </p>
            {hasSale && (
              <p className="text-xs text-gray-400 line-through">${fmtPrice(item.originalPrice * item.qty)}</p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">
              ${fmtPrice(item.price)} /{item.unit}
            </p>
          </div>
        </div>

        {/* Shipping row */}
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Truck size={12} className="text-[#186737]" />
            <span className="font-semibold text-gray-700">
              Shipping: ${fmtPrice(item.shippingCost)}
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
            ${fmtPrice(item.price * item.qty)}
          </p>
          {hasSale && (
            <p className="text-xs text-gray-400 line-through">${fmtPrice(item.originalPrice * item.qty)}</p>
          )}
        </div>

        {/* Actions row */}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          {/* Qty */}
          <div className="flex items-center border border-[#BCE3C9] rounded-[7px] overflow-hidden bg-white">
            <button
              onClick={() => onQty(item.id, Math.max(1, item.qty - 1))}
              disabled={item.qty <= 1}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={13} className="text-gray-600" strokeWidth={2} />
            </button>
            <span className="w-8 text-center text-sm font-bold text-[#186737]">
              {item.qty}
            </span>
            <button
              onClick={() => onQty(item.id, Math.min(99, item.qty + 1))}
              disabled={item.qty >= 99}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={13} className="text-gray-600" strokeWidth={2} />
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={() => onWishlist(item.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-[7px] border transition-all duration-200 ${
              item.inWishlist
                ? "border-[#186737] text-[#186737] bg-[#f0f9f4]"
                : "border-gray-200 text-gray-500 hover:border-[#186737] hover:text-[#186737] hover:bg-[#f0f9f4]"
            }`}
          >
            <Heart
              size={13}
              className={item.inWishlist ? "fill-[#186737]" : ""}
            />
            {item.inWishlist ? "Wishlisted" : "Save for Later"}
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
};

// ── Saved Item Card ───────────────────────────────────────────────────────────
const SavedCard = ({
  item,
  onAddToCart,
  onRemove,
}: {
  item: SavedItem;
  onAddToCart: (id: number) => void;
  onRemove: (id: number) => void;
}) => {
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
    <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c3e6d4] transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* Image */}
      <Link href={item.url} className="relative block bg-gray-50 overflow-hidden aspect-square">
        {hasSale && (
          <span className="absolute top-2 left-2 z-10 bg-[#FCE8EA] text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{Math.round(discountPct)}%
          </span>
        )}
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Img";
          }}
        />
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={item.url}>
          <p className="text-xs font-semibold text-gray-900 hover:text-[#186737] transition-colors line-clamp-2 leading-snug">
            {item.name}
          </p>
        </Link>
        <p className="text-[11px] text-[#186737] font-semibold mt-1">{item.brand}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Model No: {item.modelNo}</p>

        {item.rating > 0 ? (
          <div className="flex items-center gap-1 mt-1.5">
            <RatingStars rating={item.rating} />
            <span className="text-[11px] font-bold text-gray-500">
              {item.rating.toFixed(1)}
            </span>
            {item.reviews > 0 && (
              <span className="text-[10px] text-gray-400">({item.reviews})</span>
            )}
          </div>
        ) : (
          <div className="h-5 mt-1.5" />
        )}

        <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-500">
          <Truck size={11} className="text-[#186737]" />
          <span className={item.freeShipping ? "text-[#186737] font-semibold" : ""}>
            {item.freeShipping ? "Free Shipping" : "Shipping charges apply"}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Mostly Ships in {item.deliveryDays}
        </p>

        {/* Price */}
        <div className="mt-auto pt-2">
          <p className="text-base font-bold text-gray-900">
            ${fmtPrice(item.price)}
            <span className="text-xs text-gray-400 font-medium ml-1">/{item.unit}</span>
          </p>
          {hasSale && (
            <p className="text-xs text-gray-400 line-through">${fmtPrice(item.originalPrice)}</p>
          )}
        </div>

        {/* Qty + Add */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex items-center border border-[#BCE3C9] rounded-[7px] overflow-hidden bg-white shrink-0">
            <button
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              disabled={qty <= 1}
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={12} className="text-gray-600" strokeWidth={2} />
            </button>
            <span className="w-7 text-center text-xs font-bold text-[#186737]">
              {qty}
            </span>
            <button
              onClick={() => setQty((v) => Math.min(99, v + 1))}
              disabled={qty >= 99}
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={12} className="text-gray-600" strokeWidth={2} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className={`flex-1 h-7 rounded-[7px] text-[11px] font-semibold flex items-center justify-center gap-1 transition-all duration-200 ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[#186737] hover:bg-[#145c30] text-white"
            }`}
          >
            {added ? (
              <><CheckCircle size={12} /> Added!</>
            ) : (
              <><ShoppingCart size={12} /> Add To Cart</>
            )}
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="mt-2 text-[11px] text-gray-400 hover:text-red-500 hover:underline font-medium transition-colors text-left"
        >
          Remove From Saved
        </button>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [savedItems, setSavedItems] = useState<SavedItem[]>(INITIAL_SAVED);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [shipmentOpen, setShipmentOpen] = useState(true);

  const handleQty = (id: number, qty: number) =>
    setCartItems((prev) => prev.map((c) => (c.id === id ? { ...c, qty } : c)));

  const handleRemoveCart = (id: number) =>
    setCartItems((prev) => prev.filter((c) => c.id !== id));

  const handleWishlist = (id: number) =>
    setCartItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, inWishlist: !c.inWishlist } : c))
    );

  const handleRemoveSaved = (id: number) =>
    setSavedItems((prev) => prev.filter((s) => s.id !== id));

  const handleAddSavedToCart = (id: number) => {
    const item = savedItems.find((s) => s.id === id);
    if (!item) return;
    const newCartItem: CartItem = {
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
    };
    setCartItems((prev) => [...prev, newCartItem]);
    setSavedItems((prev) => prev.filter((s) => s.id !== id));
  };

  const handlePromo = () => {
    if (promoCode.toUpperCase() === "HORECA10") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  // Totals
  const subtotal = cartItems.reduce((s, c) => s + c.price * c.qty, 0);
  const shippingTotal = cartItems.reduce((s, c) => s + c.shippingCost * c.qty, 0);
  const promoDiscount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - promoDiscount) * TAX_RATE;
  const grandTotal = subtotal + shippingTotal - promoDiscount + tax;
  const totalItems = cartItems.reduce((s, c) => s + c.qty, 0);

  return (
    <>
      <CartBreadcrumb />
      <main className="min-h-screen bg-gray-50/60">
        <div className="global-container py-6 sm:py-8">
          {/* ── Header ──────────────────────────────────────────────────── */}
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

          {cartItems.length === 0 && savedItems.length === 0 ? (
            /* ── Empty ──────────────────────────────────────────────── */
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
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px] xl:grid-cols-[1fr_328px] gap-6 items-start">
              {/* ── LEFT COLUMN ───────────────────────────────────────── */}
              <div className="space-y-5">
                {/* Cart items */}
                {cartItems.length > 0 && (
                  <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                    {/* Section header */}
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package size={15} className="text-[#186737]" />
                        <h2 className="font-bold text-gray-900 text-sm">
                          Shipment{" "}
                          <span className="text-[#186737]">1</span>
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

                    {/* Subtotal row */}
                    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Truck size={13} className="text-[#186737]" />
                        Estimated delivery: <span className="font-semibold text-gray-700">Wed, May 13 – Fri, May 15</span>
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        Subtotal: ${fmtPrice(subtotal)}
                      </p>
                    </div>
                  </section>
                )}

                {/* Saved for Later */}
                {savedItems.length > 0 && (
                  <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                      <Heart size={15} className="text-[#186737]" />
                      <h2 className="font-bold text-gray-900 text-sm">
                        Saved for Later{" "}
                        <span className="text-gray-400 font-normal">
                          ({savedItems.length} item{savedItems.length !== 1 ? "s" : ""})
                        </span>
                      </h2>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {savedItems.map((item) => (
                          <SavedCard
                            key={item.id}
                            item={item}
                            onAddToCart={handleAddSavedToCart}
                            onRemove={handleRemoveSaved}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* ── RIGHT SIDEBAR ─────────────────────────────────────── */}
              <div className="sticky top-24 space-y-4">
                {/* Summary */}
                <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-sm">Summary Cart</h2>
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Line items */}
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
                        </span>
                        <span className="font-semibold text-gray-900">
                          ${fmtPrice(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Shipping & Handling ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
                        </span>
                        <span className={`font-semibold ${shippingTotal === 0 ? "text-[#186737]" : "text-gray-900"}`}>
                          {shippingTotal === 0 ? "Free" : `$${fmtPrice(shippingTotal)}`}
                        </span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-[#186737]">
                          <span className="flex items-center gap-1">
                            <Tag size={12} /> Promo (HORECA10)
                          </span>
                          <span className="font-bold">-${fmtPrice(promoDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tax (8.25%)</span>
                        <span className="font-semibold text-gray-900">
                          ${fmtPrice(tax)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Amount</span>
                      <span className="font-bold text-gray-900 text-xl">
                        ${fmtPrice(grandTotal)}
                      </span>
                    </div>

                    {/* Promo code */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                        <Tag size={12} className="text-[#186737]" /> Promo Code
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value);
                            setPromoError(false);
                          }}
                          placeholder="Enter code"
                          className="flex-1 h-9 px-3 rounded-[7px] border border-gray-200 text-xs outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
                        />
                        <button
                          onClick={handlePromo}
                          disabled={promoApplied}
                          className="h-9 px-3 rounded-[7px] bg-[#186737] hover:bg-[#145c30] disabled:bg-emerald-600 text-white text-xs font-semibold transition-colors shrink-0"
                        >
                          {promoApplied ? <CheckCircle size={14} /> : "Apply"}
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[11px] text-red-500 mt-1">
                          Invalid promo code. Try <strong>HORECA10</strong>.
                        </p>
                      )}
                      {promoApplied && (
                        <p className="text-[11px] text-[#186737] font-semibold mt-1 flex items-center gap-1">
                          <CheckCircle size={11} /> 10% discount applied!
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <Link
                      href="/checkout"
                      className="w-full py-3 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors duration-200"
                    >
                      Confirm & Pay <ArrowRight size={16} />
                    </Link>

                    <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                      By placing your order, you agree to HorecaStore&apos;s{" "}
                      <Link href="/" className="underline hover:text-[#186737]">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/" className="underline hover:text-[#186737]">
                        Conditions of Use
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#f0f9f4] flex items-center justify-center shrink-0">
                      <Lock size={13} className="text-[#186737]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Secure Payment</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Every transaction is secured and encrypted.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#f0f9f4] flex items-center justify-center shrink-0">
                      <RotateCcw size={13} className="text-[#186737]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Returns & Refunds</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Return items within 14 days for a refund or exchange.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#f0f9f4] flex items-center justify-center shrink-0">
                      <ShieldCheck size={13} className="text-[#186737]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Data Protection</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Your personal data is secure and never shared.
                      </p>
                    </div>
                  </div>

                  {/* Payment icons */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {["VISA", "MC", "PCI", "SSL"].map((badge) => (
                      <span
                        key={badge}
                        className="text-[9px] font-black border border-gray-200 rounded px-1.5 py-0.5 text-gray-500 tracking-wider"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Need Help */}
                <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start gap-3 mb-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#f0f9f4] border-2 border-[#c3e6d4] flex items-center justify-center shrink-0">
                      <MessageCircle size={15} className="text-[#186737]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Need Help Placing Order</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        Our Customer Success Team will guide you with every step.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors">
                      <MessageCircle size={13} /> Chat Now
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors">
                      <Phone size={13} /> Call Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
