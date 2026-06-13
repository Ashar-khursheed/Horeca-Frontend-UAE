"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface OrdersFiltersProps {
  total: number;
}

export function OrdersFilters({ total }: OrdersFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const push = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const global = searchParams.get("global") ?? "";
  const status = searchParams.get("status") ?? "All Orders";
  const payment_status = searchParams.get("payment_status") ?? "All";
  const from_date = searchParams.get("from_date") ?? "";
  const to_date = searchParams.get("to_date") ?? "";

  const hasFilters = global || status !== "All Orders" || payment_status !== "All" || from_date || to_date;

  const clearAll = () => {
    router.push(pathname);
  };

  return (
    <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
      <div className="flex flex-wrap gap-3">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Order ID, Product..."
            defaultValue={global}
            onChange={(e) => push({ global: e.target.value })}
            className="w-full h-9 pl-8 pr-3 rounded-[7px] border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
          />
        </div>

        {/* Order Status */}
        <div className="min-w-[155px]">
          <Select value={status} onValueChange={(val) => push({ status: val === "All Orders" ? "" : val })}>
            <SelectTrigger className="h-9 w-full rounded-[7px] border-gray-200 text-sm text-gray-700 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-white cursor-pointer">
              <div className="flex items-center gap-2 min-w-0">
                <SlidersHorizontal size={13} className="text-gray-400 shrink-0" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Orders">All Orders</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status */}
        <div className="min-w-[145px]">
          <Select value={payment_status} onValueChange={(val) => push({ payment_status: val === "All" ? "" : val })}>
            <SelectTrigger className="h-9 w-full rounded-[7px] border-gray-200 text-sm text-gray-700 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-white cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Payments</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* From date */}
        <div className="relative min-w-[130px]">
          <CalendarDays size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="date"
            defaultValue={from_date}
            onChange={(e) => push({ from_date: e.target.value })}
            className="w-full h-9 pl-8 pr-2 rounded-[7px] border border-gray-200 text-xs text-gray-700 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all bg-white cursor-pointer"
          />
        </div>

        {/* To date */}
        <div className="relative min-w-[130px]">
          <CalendarDays size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="date"
            defaultValue={to_date}
            onChange={(e) => push({ to_date: e.target.value })}
            className="w-full h-9 pl-8 pr-2 rounded-[7px] border border-gray-200 text-xs text-gray-700 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all bg-white cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <p className="text-xs text-gray-400">
          Showing <span className="font-semibold text-gray-700">{total}</span> order{total !== 1 ? "s" : ""}
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
