"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronRight,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

const usd = (n: string | number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface OrderProduct {
  id: number;
  quantity: number;
  unit_price: string;
  shipping_charge: number;
  total_amount: string;
  expectedShippingDate?: string;
  product_supplier?: { delivery_days?: string };
  product: {
    name: string;
    images: string[];
    sku?: string;
    brand_name?: string;
  };
}

interface OrderData {
  id: number;
  order_number: string;
  customer_address: string;
  amount: string;
  shipping_charge: number;
  tax_percentage: string;
  tax_amount: string;
  discount: string;
  total_amount: string;
  status: string;
  payment_mode: string;
  created_at: string;
  customer: { name: string; email: string };
  order_products: OrderProduct[];
}

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("recentOrder");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7f5]">
      <div className="global-container py-10 max-w-4xl mx-auto">

        {/* Success header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-[#186737]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Order Placed Successfully!
          </h1>
          {order?.order_number && (
            <p className="text-gray-500 text-sm">
              Order{" "}
              <span className="font-semibold text-gray-800">
                #{order.order_number}
              </span>{" "}
              has been confirmed.
            </p>
          )}
          <p className="text-gray-400 text-xs mt-1">
            A confirmation will be sent to{" "}
            <span className="font-medium text-gray-600">
              {order?.customer?.email ?? "your email"}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left — Products */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Package size={16} className="text-[#186737]" />
                <h2 className="font-semibold text-gray-800">
                  {order?.order_products?.length ?? 0} item
                  {(order?.order_products?.length ?? 0) !== 1 ? "s" : ""}{" "}
                  ordered
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {order?.order_products?.map((item) => (
                  <div key={item.id} className="flex gap-4 p-5">
                    <div className="w-16 h-16 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Package size={20} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
                        {item.product?.name}
                      </p>
                      {item.product?.brand_name && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {item.product.brand_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity} &nbsp;·&nbsp; $
                        {usd(item.unit_price)} each
                      </p>
                      {item.expectedShippingDate && (
                        <div className="flex items-center gap-1 mt-1 text-[#186737]">
                          <Truck size={11} />
                          <span className="text-[11px]">
                            Est. {item.expectedShippingDate}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-800 shrink-0">
                      ${usd(item.total_amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order?.customer_address && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={15} className="text-[#186737]" />
                  <h2 className="font-semibold text-gray-800 text-sm">
                    Shipping Address
                  </h2>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                  {order.customer_address.replace(/\\n/g, "\n")}
                </p>
              </div>
            )}
          </div>

          {/* Right — Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2.5 text-sm">
                <Row label="Subtotal" value={`$${usd(order?.amount ?? 0)}`} />
                <Row
                  label="Shipping"
                  value={`$${usd(order?.shipping_charge ?? 0)}`}
                />
                {Number(order?.discount ?? 0) > 0 && (
                  <Row
                    label="Discount"
                    value={`-$${usd(order?.discount ?? 0)}`}
                    green
                  />
                )}
                {Number(order?.tax_amount ?? 0) > 0 && (
                  <Row
                    label={`Tax (${Number(order?.tax_percentage ?? 0).toFixed(2)}%)`}
                    value={`$${usd(order?.tax_amount ?? 0)}`}
                  />
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#186737] text-base">
                    ${usd(order?.total_amount ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order info */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2.5 text-sm">
              {order?.payment_mode && (
                <Row label="Payment" value={order.payment_mode} />
              )}
              {order?.status && (
                <Row label="Status" value={order.status} />
              )}
              {order?.created_at && (
                <Row
                  label="Date"
                  value={order.created_at.split(" ")[0]}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/orders"
                className="flex items-center justify-center gap-2 w-full bg-[#186737] hover:bg-[#145c30] text-white font-semibold py-3 rounded-lg text-sm transition-colors"
              >
                View My Orders <ChevronRight size={15} />
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center w-full border border-gray-200 hover:border-[#186737] text-gray-700 font-medium py-3 rounded-lg text-sm transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${green ? "text-[#186737]" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}
