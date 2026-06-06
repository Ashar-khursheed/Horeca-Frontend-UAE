"use client";

import { Bell, Building2, Mail } from "lucide-react";
import { useState } from "react";

export const NotificationsTab = () => {
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    quoteStatus: true,
    promotions: false,
    newArrivals: false,
    paymentReminders: true,
    newsletterWeekly: false,
  });

  const NOTIF_GROUPS = [
    {
      title: "Order & Shipping",
      icon: Building2,
      items: [
        { key: "orderUpdates" as const, label: "Order status updates", desc: "Get notified when your order ships, is delivered, or has issues." },
        { key: "paymentReminders" as const, label: "Payment reminders", desc: "Receive reminders for upcoming or overdue payments." },
      ],
    },
    {
      title: "Quotes & Pricing",
      icon: Mail,
      items: [
        { key: "quoteStatus" as const, label: "Quote status changes", desc: "Know when your quotes are accepted, rejected, or expire." },
      ],
    },
    {
      title: "Marketing",
      icon: Bell,
      items: [
        { key: "promotions" as const, label: "Promotions & deals", desc: "Special offers, discounts, and flash sales." },
        { key: "newArrivals" as const, label: "New arrivals", desc: "Be first to know about new products in your categories." },
        { key: "newsletterWeekly" as const, label: "Weekly newsletter", desc: "Industry tips, product highlights, and company news." },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {NOTIF_GROUPS.map(({ title, items }) => (
        <div key={title} className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Bell size={14} className="text-[#186737]" />
              {title}
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map(({ key, label, desc }) => (
              <div key={key} className="px-5 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={prefs[key]}
                    onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#186737]" />
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
