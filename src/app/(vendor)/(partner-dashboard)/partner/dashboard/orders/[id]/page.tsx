"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ── Mock data (UI only — no backend wired up yet) ──────────────────────────────
const MOCK_ORDER = {
  id: 1701,
  order_number: "11695",
  status: "Pending" as const,
  created_at: "2026-07-23T11:29:51.000000Z",
  customer: {
    name: "Sims",
    email: "sims5@yopmail.com",
    country_code: "+91",
    mobile_number: "7656800000",
  },
  customer_address: "street no 1, 32003\nPalm Coast, Florida - United States",
  product: {
    name: "PolarBox Series 6' x 8' Quick Ship Walk-In Cooler Box Only With Floor",
    sku: "PBWF6X8",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/images/CWF6X8_1_Kc639r0jyZ.webp",
  },
  quantity: 1,
  unit_price: 3965.0,
  accessory_charges: [
    { id: 474, product_accessory_name: "Select Door Hinge", accessory_item_name: "Right Hinge Door", amount: 0 },
    { id: 475, product_accessory_name: "Select Door Width", accessory_item_name: "36\" Wide Door",   amount: 0 },
    { id: 476, product_accessory_name: "Select LED Lights", accessory_item_name: "4 ft LED Light - 1 Piece", amount: 212 },
  ],
  earnings: 4177.0,
  payout_status: "Pending" as const,
};

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PartnerOrderDetailPage() {
  const [status, setStatus] = useState<string>(MOCK_ORDER.status);

  const order = MOCK_ORDER;
  const currentIdx = STATUS_STEPS.indexOf(status);
  const accessoryTotal = order.accessory_charges.reduce((s, a) => s + a.amount, 0);
  const lineTotal = order.unit_price * order.quantity;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard/orders" className="hover:text-[#186737] transition-colors">Orders</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Order #{order.order_number}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/partner/dashboard/orders"
              className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all shrink-0 mt-0.5"
            >
              <ArrowLeft size={15} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Order #{order.order_number}</h1>
              <p className="text-xs text-gray-400 mt-1.5">
                Placed on {new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Status updater */}
          <div className="min-w-[180px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 w-full rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-700 outline-none focus:border-[#186737] bg-white px-2 cursor-pointer"
            >
              {STATUS_STEPS.map((s) => <option key={s}>{s}</option>)}
              <option>Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5 items-start">
        {/* LEFT */}
        <div className="space-y-5">
          {/* Product */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Order Item</h2>
            </div>
            <div className="p-5 flex gap-4">
              <div className="w-[72px] h-[72px] shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                <img src={order.product.image} alt={order.product.name} className="w-full h-full object-contain p-2" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{order.product.name}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  SKU: <span className="font-mono text-gray-500">{order.product.sku}</span>
                </p>
                <span className="inline-block mt-2 text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Qty: {order.quantity}
                </span>

                {order.accessory_charges.length > 0 && (
                  <div className="mt-3 border border-gray-100 rounded-[7px] bg-gray-50/60 divide-y divide-gray-100">
                    <p className="px-3 py-1.5 text-[11px] font-bold text-gray-500">Accessories</p>
                    {order.accessory_charges.map((acc) => (
                      <div key={acc.id} className="flex items-center justify-between gap-3 px-3 py-1.5">
                        <span className="text-[11px] text-gray-600">
                          <span className="text-gray-400">{acc.product_accessory_name}:</span> {acc.accessory_item_name}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">
                          ${fmt(acc.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-base font-bold text-gray-900">${fmt(lineTotal + accessoryTotal)}</p>
                {order.quantity > 1 && <p className="text-[11px] text-gray-400 mt-0.5">${fmt(order.unit_price)} each</p>}
              </div>
            </div>
          </div>

          {/* Fulfillment progress */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Truck size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Fulfillment Progress</h2>
            </div>
            <div className="p-5 sm:p-6">
              {STATUS_STEPS.map((step, i) => {
                const isCompleted = i <= currentIdx;
                const isLast = i === STATUS_STEPS.length - 1;
                return (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? "bg-[#186737] shadow-md shadow-[#186737]/25" : "bg-white border-2 border-gray-200"}`}>
                        {isCompleted ? <CheckCircle size={15} className="text-white" /> : <span className="w-2 h-2 rounded-full bg-gray-300" />}
                      </div>
                      {!isLast && (
                        <div className="w-0.5 flex-1 min-h-[24px] my-1 rounded-full">
                          <div className={`w-full h-full rounded-full ${i < currentIdx ? "bg-[#186737]" : "bg-gray-100"}`} />
                        </div>
                      )}
                    </div>
                    <div className={`flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
                      <p className={`text-sm font-semibold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>{step}</p>
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
              <div className="p-4 space-y-2">
                <p className="text-sm font-bold text-gray-900">{order.customer.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Mail size={11} className="text-gray-400 shrink-0" /> {order.customer.email}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Phone size={11} className="text-gray-400 shrink-0" /> {order.customer.country_code} {order.customer.mobile_number}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <MapPin size={13} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Shipping Address</h3>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{order.customer_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5 lg:sticky lg:top-6">
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <DollarSign size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Your Earnings</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Order Total</span>
                <span className="font-black text-xl text-gray-900">${fmt(order.earnings)}</span>
              </div>
              <div className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-[7px] px-3 py-2">
                <span className="text-sm font-semibold text-amber-700 flex items-center gap-1.5">
                  <Clock size={12} /> Payout Status
                </span>
                <span className="text-sm font-black text-amber-700">{order.payout_status}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Payouts are released after the order is marked Delivered, on the next weekly payout cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
