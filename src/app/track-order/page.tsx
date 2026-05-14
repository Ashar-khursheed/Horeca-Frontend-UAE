"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Box,
  Building2,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Search,
  Shield,
  Star,
  Truck,
  User,
  X,
} from "lucide-react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────────

type OrderStatus = "Delivered" | "In Transit" | "Processing" | "Cancelled";
type PaymentStatus = "Paid" | "Pending" | "Refunded";

interface OrderItem {
  id: number;
  name: string;
  brand: string;
  sku: string;
  warranty: string;
  deliveryDays: string;
  image: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  placedAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  transactionId: string;
  estimatedDelivery: string;
  customer: { name: string; email: string; phone: string; company: string };
  shippingAddress: { confirmed: boolean; name: string; line1: string; city: string; state: string; zip: string; country: string };
  billingAddress: { name: string; line1: string; city: string; state: string; zip: string; country: string };
  items: OrderItem[];
  subtotal: number;
  couponDiscount: number;
  memberDiscount: number;
  tax: number;
  shippingCost: number;
  total: number;
  currentStep: string;
}

// ─── Mock Orders DB ────────────────────────────────────────────────────────────

const MOCK_ORDERS: Record<string, Order> = {
  "11384": {
    id: "11384",
    date: "Apr 08, 2026",
    placedAt: "April 8, 2026 at 03:42 AM",
    status: "Delivered" as const,
    paymentStatus: "Paid" as const,
    paymentMethod: "Credit Card",
    transactionId: "TXN-20260408-ABCD1234XYZ",
    estimatedDelivery: "April 14, 2026",
    customer: {
      name: "Arshad Khan",
      email: "webdeveloper08@horecastore.ae",
      phone: "+1 (888) 888-8877",
      company: "Arshad Inc.",
    },
    shippingAddress: {
      confirmed: true,
      name: "Arshad Khan",
      line1: "1234 Business Avenue",
      city: "Houston",
      state: "Texas",
      zip: "77074",
      country: "United States",
    },
    billingAddress: {
      name: "Arshad Khan",
      line1: "5678 Commerce Street, Apt 22",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    items: [
      {
        id: 1,
        name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
        brand: "Turbo Air",
        sku: "TBC-36SB-N6",
        warranty: "5 Years Parts & Labor, 7 Year Compressor",
        deliveryDays: "5 to 7 Days",
        image:
          "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35898/79046/tbc-36sb-n6__79124.1694539695.jpg",
        qty: 1,
        price: 2395.26,
      },
      {
        id: 2,
        name: 'True TUC-27F-HC 27" Undercounter Freezer with Hydrocarbon Refrigerant',
        brand: "True",
        sku: "TUC-27F-HC",
        warranty: "2 Years Parts & Labor, 5 Year Compressor",
        deliveryDays: "7 to 10 Days",
        image:
          "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/28706/66175/tuc-27f-hc__38834.1676404023.jpg",
        qty: 2,
        price: 1850.0,
      },
    ],
    subtotal: 6095.26,
    couponDiscount: 200.0,
    memberDiscount: 0,
    tax: 488.64,
    shippingCost: 0,
    total: 6383.9,
    currentStep: "delivered",
  },
  "2785": {
    id: "2785",
    date: "May 01, 2026",
    placedAt: "May 1, 2026 at 10:15 AM",
    status: "In Transit" as const,
    paymentStatus: "Paid" as const,
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-20260501-XYZ9876QRST",
    estimatedDelivery: "May 14 – 16, 2026",
    customer: {
      name: "Mohammed Al-Rashidi",
      email: "m.rashidi@horecastore.ae",
      phone: "+971 50 123 4567",
      company: "Gulf Hospitality LLC",
    },
    shippingAddress: {
      confirmed: true,
      name: "Mohammed Al-Rashidi",
      line1: "Block 7, Warehouse District",
      city: "Dubai",
      state: "Dubai",
      zip: "00000",
      country: "United Arab Emirates",
    },
    billingAddress: {
      name: "Gulf Hospitality LLC",
      line1: "P.O Box 12345, Business Bay",
      city: "Dubai",
      state: "Dubai",
      zip: "00000",
      country: "United Arab Emirates",
    },
    items: [
      {
        id: 1,
        name: "Hoshizaki F-1501MWH 1,631 Lb Flaker Ice Machine with Water-Cooled Condenser",
        brand: "Hoshizaki",
        sku: "F-1501MWH",
        warranty: "3 Years Parts & Labor",
        deliveryDays: "10 to 14 Days",
        image:
          "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35000/78000/hoshizaki-f-1501mwh__79000.jpg",
        qty: 1,
        price: 4850.0,
      },
    ],
    subtotal: 4850.0,
    couponDiscount: 0,
    memberDiscount: 150.0,
    tax: 388.0,
    shippingCost: 0,
    total: 5088.0,
    currentStep: "shipped",
  },
  "9910": {
    id: "9910",
    date: "Apr 25, 2026",
    placedAt: "April 25, 2026 at 02:00 PM",
    status: "Processing" as const,
    paymentStatus: "Pending" as const,
    paymentMethod: "Credit Card",
    transactionId: "TXN-20260425-PROC5544LMNO",
    estimatedDelivery: "May 05 – 08, 2026",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@horecastore.ae",
      phone: "+1 (415) 987-6543",
      company: "The Grand Hotel",
    },
    shippingAddress: {
      confirmed: false,
      name: "Sarah Johnson",
      line1: "500 Market Street",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "United States",
    },
    billingAddress: {
      name: "The Grand Hotel",
      line1: "500 Market Street, Floor 20",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "United States",
    },
    items: [
      {
        id: 1,
        name: "Manitowoc UDE-0140A NEO 14 Lb Undercounter Ice Machine with Built-in Storage",
        brand: "Manitowoc",
        sku: "UDE-0140A",
        warranty: "3 Years Parts & Labor",
        deliveryDays: "5 to 7 Days",
        image:
          "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/28000/65000/manitowoc-ude-0140a__65001.jpg",
        qty: 3,
        price: 1200.0,
      },
    ],
    subtotal: 3600.0,
    couponDiscount: 0,
    memberDiscount: 0,
    tax: 297.0,
    shippingCost: 75.0,
    total: 3972.0,
    currentStep: "processings",
  },
};


// ─── Timeline Steps ────────────────────────────────────────────────────────────

const ALL_STEPS = [
  {
    key: "order_placed",
    label: "Order Placed",
    date: "Apr 08, 2026",
    time: "03:42 AM",
    desc: "Your order was placed successfully.",
  },
  {
    key: "order_confirmed",
    label: "Order Confirmed",
    date: "Apr 08, 2026",
    time: "11:15 AM",
    desc: "Your order has been reviewed and confirmed by our team.",
  },
  {
    key: "processings",
    label: "Processing",
    date: "Apr 09, 2026",
    time: "09:00 AM",
    desc: "Your order is being prepared and packed at the warehouse.",
  },
  {
    key: "ready_to_dispatch",
    label: "Ready for Dispatch",
    date: "Apr 11, 2026",
    time: "02:30 PM",
    desc: "All items are packed and ready to leave the warehouse.",
  },
  {
    key: "shipped",
    label: "Shipped",
    date: "Apr 12, 2026",
    time: "08:00 AM",
    desc: "Your order has been handed off to the courier.",
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    date: "Apr 14, 2026",
    time: "07:45 AM",
    desc: "Almost there! Your order is out for delivery today.",
  },
  {
    key: "delivered",
    label: "Delivered",
    date: "Apr 14, 2026",
    time: "01:22 PM",
    desc: "Your order was delivered and signed for successfully.",
  },
];

// ─── Config maps ───────────────────────────────────────────────────────────────

const STATUS_CFG = {
  Delivered: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle,
  },
  "In Transit": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    icon: Truck,
  },
  Processing: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: Box,
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    icon: AlertCircle,
  },
} as const;

const PAYMENT_CFG = {
  Paid: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Pending: { bg: "bg-amber-50", text: "text-amber-700" },
  Refunded: { bg: "bg-gray-100", text: "text-gray-500" },
} as const;

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TrackOrderPage() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleTrack(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    setNotFound(false);
    setOrder(null);

    setTimeout(() => {
      const found = MOCK_ORDERS[trimmed];
      setQuery(trimmed);
      if (found) {
        setOrder(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 700);
  }

  function handleReset() {
    setInput("");
    setQuery("");
    setOrder(null);
    setNotFound(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#186737] font-bold text-sm hover:opacity-80 transition-opacity">
            <ArrowLeft size={15} />
            Back to Home
          </Link>
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">Track Order</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Hero search card ────────────────────────────────────────────── */}
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-linear-to-br from-[#186737] to-[#145c30] px-6 py-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
              <Package size={24} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Track your order</h1>
            <p className="text-sm text-white/75 mt-2 max-w-md mx-auto">
              Enter your order number to see live status and delivery updates.
            </p>
          </div>

          <div className="px-6 py-7">
            <form onSubmit={handleTrack} className="max-w-xl mx-auto space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. 11384"
                  className="w-full pl-10 pr-10 py-3 rounded-[7px] border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all"
                />
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-full py-3 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-[#186737]/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    Track Order
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                You'll find your order number in your confirmation email or SMS.
              </p>
            </form>

            {/* Quick links */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-gray-100">
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#186737] hover:underline"
              >
                <User size={13} />
                View all orders
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#186737] hover:underline"
              >
                <MessageCircle size={13} />
                Contact support
              </Link>
            </div>
          </div>
        </div>

        {/* ── Not found state ─────────────────────────────────────────────── */}
        {notFound && (
          <div className="bg-white rounded-[7px] border border-red-100 shadow-sm p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Order not found</h2>
            <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto">
              We couldn't find an order with number <span className="font-mono font-bold text-gray-700">#{query}</span>.
              Please double-check and try again.
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/dashboard/orders"
                className="px-5 py-2.5 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View My Orders
              </Link>
            </div>
          </div>
        )}

        {/* ── Order detail ────────────────────────────────────────────────── */}
        {order && <OrderDetail order={order} onReset={handleReset} />}
      </div>
    </div>
  );
}

// ─── Order Detail Component ────────────────────────────────────────────────────

function OrderDetail({
  order,
  onReset,
}: {
  order: Order;
  onReset: () => void;
}) {
  const sc = STATUS_CFG[order.status];
  const pc = PAYMENT_CFG[order.paymentStatus];
  const currentIdx = ALL_STEPS.findIndex((s) => s.key === order.currentStep);

  return (
    <div className="space-y-5">
      {/* ── Order Header ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={onReset}
              className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all shrink-0 mt-0.5"
            >
              <Search size={15} />
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {order.status}
                </span>
                <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Placed on {order.placedAt}
                <span className="mx-2 text-gray-200">|</span>
                Est. Delivery:{" "}
                <span className="font-semibold text-gray-600">{order.estimatedDelivery}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
              <RotateCcw size={14} />
              Return
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-[7px] text-sm font-semibold bg-[#186737] text-white hover:bg-[#145c30] transition-all shadow-sm shadow-[#186737]/20">
              <Download size={14} />
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5 items-start">

        {/* ── LEFT ──────────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Order Items */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package size={15} className="text-[#186737]" />
              <h3 className="font-bold text-gray-900 text-sm">Order Items</h3>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="p-5 flex gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-18 h-18 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/72x72/f3f4f6/9ca3af?text=No+Img";
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                          <span className="text-xs font-bold text-[#186737]">{item.brand}</span>
                          <span className="text-[11px] text-gray-400">
                            SKU: <span className="font-mono text-gray-500">{item.sku}</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Shield size={10} className="text-[#186737] shrink-0" />
                            {item.warranty}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            Ships in {item.deliveryDays}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Qty: {item.qty}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-base font-bold text-gray-900">
                          ${fmt(item.price * item.qty)}
                        </p>
                        {item.qty > 1 && (
                          <p className="text-[11px] text-gray-400 mt-0.5">${fmt(item.price)} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Items Subtotal</span>
              <span className="text-sm font-bold text-gray-900">${fmt(order.subtotal)}</span>
            </div>
          </div>

          {/* Order Progress Timeline */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Order Progress</h3>
              </div>
              <span className="text-[11px] font-semibold text-[#186737] bg-[#f0f9f4] px-2.5 py-1 rounded-full border border-[#c3e6d4]">
                {ALL_STEPS[currentIdx]?.label ?? order.currentStep}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {ALL_STEPS.map((step, i) => {
                const isCompleted = i <= currentIdx;
                const isCurrent = i === currentIdx;
                const isLast = i === ALL_STEPS.length - 1;
                const lineCompleted = i < currentIdx;

                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isCompleted
                            ? "bg-[#186737] shadow-md shadow-[#186737]/25"
                            : "bg-white border-2 border-gray-200"
                        } ${isCurrent ? "ring-4 ring-[#186737]/15" : ""}`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={15} className="text-white" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-gray-300" />
                        )}
                      </div>
                      {!isLast && (
                        <div className="w-0.5 flex-1 min-h-7 my-1 rounded-full">
                          <div
                            className={`w-full h-full rounded-full ${
                              lineCompleted ? "bg-[#186737]" : "bg-gray-100"
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-5"}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold ${
                              isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-[#186737] bg-[#f0f9f4] px-2 py-0.5 rounded-full border border-[#c3e6d4]">
                              Current
                            </span>
                          )}
                        </div>
                        {isCompleted && (
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">
                            {step.date} · {step.time}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-0.5 leading-relaxed ${
                          isCompleted ? "text-gray-500" : "text-gray-300"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer + Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <User size={13} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Customer</h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">{order.customer.name}</p>
                  <p className="text-xs text-[#186737] font-semibold mt-0.5">{order.customer.company}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Mail size={11} className="text-gray-400 shrink-0" />
                    {order.customer.email}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Phone size={11} className="text-gray-400 shrink-0" />
                    {order.customer.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#186737]" />
                  <h3 className="font-bold text-gray-900 text-sm">Shipping Address</h3>
                </div>
                {order.shippingAddress.confirmed && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Confirmed
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  {order.shippingAddress.line1}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zip}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT ──────────────────────────────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-6">

          {/* Order Summary */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <FileText size={15} className="text-[#186737]" />
              <h3 className="font-bold text-gray-900 text-sm">Order Summary</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-2.5">
                <SummaryRow label="Subtotal" value={`$${fmt(order.subtotal)}`} />
                {order.couponDiscount > 0 && (
                  <SummaryRow
                    label="Coupon Discount"
                    value={`-$${fmt(order.couponDiscount)}`}
                    green
                  />
                )}
                {order.memberDiscount > 0 && (
                  <SummaryRow
                    label="Member Discount"
                    value={`-$${fmt(order.memberDiscount)}`}
                    green
                  />
                )}
                <SummaryRow label="Tax (8.25%)" value={`$${fmt(order.tax)}`} />
                <SummaryRow
                  label="Shipping"
                  value={order.shippingCost === 0 ? "Free" : `$${fmt(order.shippingCost)}`}
                  green={order.shippingCost === 0}
                />
              </div>
              <div className="border-t border-gray-100 pt-3.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-black text-xl text-gray-900">${fmt(order.total)}</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors shadow-sm shadow-[#186737]/20">
                <Download size={14} />
                Download Invoice
              </button>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <CreditCard size={15} className="text-[#186737]" />
              <h3 className="font-bold text-gray-900 text-sm">Payment Details</h3>
            </div>
            <div className="p-5 space-y-3">
              <DetailRow label="Method" value={order.paymentMethod} />
              <DetailRow label="Status">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pc.bg} ${pc.text}`}>
                  {order.paymentStatus}
                </span>
              </DetailRow>
              <DetailRow label="Transaction ID">
                <span className="text-[11px] font-mono text-gray-500 break-all text-right max-w-42.5">
                  {order.transactionId}
                </span>
              </DetailRow>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Building2 size={15} className="text-[#186737]" />
              <h3 className="font-bold text-gray-900 text-sm">Billing Address</h3>
            </div>
            <div className="p-5">
              <p className="text-sm font-bold text-gray-900">{order.billingAddress.name}</p>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                {order.billingAddress.line1}
                <br />
                {order.billingAddress.city}, {order.billingAddress.state}{" "}
                {order.billingAddress.zip}
                <br />
                {order.billingAddress.country}
              </p>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-[7px] bg-[#f0f9f4] border border-[#c3e6d4] flex items-center justify-center shrink-0">
                <Headphones size={17} className="text-[#186737]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Need Help?</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Our team is here to help with your order.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors">
                <MessageCircle size={13} />
                Chat Now
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors">
                <Phone size={13} />
                Call Now
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-colors">
                <Star size={13} />
                Rate Order
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-colors">
                <AlertCircle size={13} />
                Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SummaryRow({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${green ? "text-[#186737]" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}

function DetailRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-gray-400 shrink-0 mt-0.5">{label}</span>
      {children ?? (
        <span className="text-xs font-semibold text-gray-800 text-right">{value}</span>
      )}
    </div>
  );
}
