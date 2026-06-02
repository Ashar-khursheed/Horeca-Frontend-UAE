"use client";

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
  Shield,
  Star,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";

// ─── Mock Order ───────────────────────────────────────────────────────────────

const ORDER = {
  id: "11384",
  date: "Apr 08, 2026",
  placedAt: "April 8, 2026 at 03:42 AM",
  status: "Delivered" as const,
  paymentStatus: "Paid" as const,
  paymentMethod: "Credit Card",
  transactionId: "TXN-20260408-ABCD1234XYZ",
  estimatedDelivery: "April 15 – 17, 2026",

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
    {
      id: 3,
      name: "Hoshizaki F-1501MWH 1,631 Lb Flaker Ice Machine with Water-Cooled Condenser",
      brand: "Hoshizaki",
      sku: "F-1501MWH",
      warranty: "3 Years Parts & Labor",
      deliveryDays: "10 to 14 Days",
      image:
        "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35000/78000/hoshizaki-f-1501mwh__79000.jpg",
      qty: 1,
      price: 610.0,
    },
  ],

  subtotal: 6705.26,
  couponDiscount: 200.0,
  memberDiscount: 0,
  tax: 537.64,
  shippingCost: 0,
  total: 7042.9,

  currentStep: "delivered",
};

// ─── Timeline Steps ───────────────────────────────────────────────────────────

const STEPS = [
   {
    key: "reserved_order",
    label: "Reserved Order",
    date: "Apr 08, 2026",
    time: "03:42 AM",
    desc: "Your reserved order was placed successfully.",
  },
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

const STEP_KEYS = STEPS.map((s) => s.key);

// ─── Config maps ──────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const sc = STATUS_CFG[ORDER.status];
  const pc = PAYMENT_CFG[ORDER.paymentStatus];
  const currentIdx = STEP_KEYS.indexOf(ORDER.currentStep);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard/orders" className="hover:text-[#186737] transition-colors">My Orders</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Order #{ORDER.id}</span>
      </nav>

      {/* ── Order Header ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard/orders"
              className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all shrink-0 mt-0.5"
            >
              <ArrowLeft size={15} />
            </Link>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">Order #{ORDER.id}</h1>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {ORDER.status}
                </span>
                <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>
                  {ORDER.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Placed on {ORDER.placedAt}
                <span className="mx-2 text-gray-200">|</span>
                Est. Delivery: <span className="font-semibold text-gray-600">{ORDER.estimatedDelivery}</span>
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
              <h2 className="font-bold text-gray-900 text-sm">Order Items</h2>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                {ORDER.items.length} item{ORDER.items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {ORDER.items.map((item, i) => (
                <div key={item.id} className="p-5 flex gap-4 hover:bg-gray-50/50 transition-colors">
                  {/* Image */}
                  <div className="w-[72px] h-[72px] shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
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

                  {/* Details */}
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
                        <div className="flex items-center gap-2 mt-2">
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
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            ${fmt(item.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Items total row */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Items Subtotal</span>
              <span className="text-sm font-bold text-gray-900">${fmt(ORDER.subtotal)}</span>
            </div>
          </div>

          {/* Order Progress Timeline */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-[#186737]" />
                <h2 className="font-bold text-gray-900 text-sm">Order Progress</h2>
              </div>
              <span className="text-[11px] font-semibold text-[#186737] bg-[#f0f9f4] px-2.5 py-1 rounded-full border border-[#c3e6d4]">
                {STEPS[currentIdx]?.label ?? ORDER.currentStep}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {STEPS.map((step, i) => {
                const isCompleted = i <= currentIdx;
                const isCurrent = i === currentIdx;
                const isLast = i === STEPS.length - 1;
                const lineCompleted = i < currentIdx;

                return (
                  <div key={step.key} className="flex gap-4">
                    {/* Dot + connector line */}
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
                        <div className="w-0.5 flex-1 min-h-[28px] my-1 rounded-full transition-colors duration-300">
                          <div
                            className={`w-full h-full rounded-full ${
                              lineCompleted ? "bg-[#186737]" : "bg-gray-100"
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Step content */}
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

          {/* Customer + Shipping row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Customer */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <User size={13} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Customer</h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">{ORDER.customer.name}</p>
                  <p className="text-xs text-[#186737] font-semibold mt-0.5">{ORDER.customer.company}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Mail size={11} className="text-gray-400 shrink-0" />
                    {ORDER.customer.email}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Phone size={11} className="text-gray-400 shrink-0" />
                    {ORDER.customer.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#186737]" />
                  <h3 className="font-bold text-gray-900 text-sm">Shipping Address</h3>
                </div>
                {ORDER.shippingAddress.confirmed && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Confirmed
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-gray-900">{ORDER.shippingAddress.name}</p>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  {ORDER.shippingAddress.line1}
                  <br />
                  {ORDER.shippingAddress.city}, {ORDER.shippingAddress.state}{" "}
                  {ORDER.shippingAddress.zip}
                  <br />
                  {ORDER.shippingAddress.country}
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
              <h2 className="font-bold text-gray-900 text-sm">Order Summary</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-2.5">
                <SummaryRow label="Subtotal" value={`$${fmt(ORDER.subtotal)}`} />
                {ORDER.couponDiscount > 0 && (
                  <SummaryRow
                    label="Coupon Discount"
                    value={`-$${fmt(ORDER.couponDiscount)}`}
                    green
                  />
                )}
                {ORDER.memberDiscount > 0 && (
                  <SummaryRow
                    label="Member Discount"
                    value={`-$${fmt(ORDER.memberDiscount)}`}
                    green
                  />
                )}
                <SummaryRow label="Tax (8.25%)" value={`$${fmt(ORDER.tax)}`} />
                <SummaryRow
                  label="Shipping"
                  value={ORDER.shippingCost === 0 ? "Free" : `$${fmt(ORDER.shippingCost)}`}
                  green={ORDER.shippingCost === 0}
                />
              </div>

              <div className="border-t border-gray-100 pt-3.5 mt-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-black text-xl text-gray-900">${fmt(ORDER.total)}</span>
                </div>
              </div>

              <button className="w-full mt-1 flex items-center justify-center gap-2 py-3 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors shadow-sm shadow-[#186737]/20">
                <Download size={14} />
                Download Invoice
              </button>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <CreditCard size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Payment Details</h2>
            </div>
            <div className="p-5 space-y-3">
              <DetailRow label="Method" value={ORDER.paymentMethod} />
              <DetailRow label="Status">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pc.bg} ${pc.text}`}>
                  {ORDER.paymentStatus}
                </span>
              </DetailRow>
              <DetailRow label="Transaction ID">
                <span className="text-[11px] font-mono text-gray-500 break-all text-right max-w-[170px]">
                  {ORDER.transactionId}
                </span>
              </DetailRow>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Building2 size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Billing Address</h2>
            </div>
            <div className="p-5">
              <p className="text-sm font-bold text-gray-900">{ORDER.billingAddress.name}</p>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                {ORDER.billingAddress.line1}
                <br />
                {ORDER.billingAddress.city}, {ORDER.billingAddress.state}{" "}
                {ORDER.billingAddress.zip}
                <br />
                {ORDER.billingAddress.country}
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

// ─── Sub-components ───────────────────────────────────────────────────────────

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
