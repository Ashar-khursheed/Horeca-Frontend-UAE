"use client";

import { Mail } from "lucide-react";

const usd = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface ShareProduct {
  name: string;
  sku: string;
  quantity: number;
  unit_price: string;
}

interface ShareButtonsProps {
  orderNumber: string;
  email: string;
  total: number;
  products: ShareProduct[];
}

export function ShareButtons({ orderNumber, email, total, products }: ShareButtonsProps) {
  const handleWhatsApp = () => {
    const message = products
      .map(
        (p) =>
          `Product: ${p.name}\nSKU: ${p.sku}\nQty: ${p.quantity}\nPrice: $${usd(Number(p.unit_price))}\n---`
      )
      .join("\n");
    const encoded = encodeURIComponent(
      `Order #${orderNumber} placed successfully!\n\n${message}`
    );
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  const handleEmail = () => {
    const body = products
      .map(
        (p) =>
          `Product: ${p.name}\nSKU: ${p.sku}\nQty: ${p.quantity}\nPrice: $${usd(Number(p.unit_price))}`
      )
      .join("\n\n---\n\n");
    const subject = encodeURIComponent(`Order #${orderNumber} — Placed Successfully`);
    const encodedBody = encodeURIComponent(
      `Hi,\n\nYour order #${orderNumber} has been placed!\n\n${body}\n\nTotal: $${usd(total)}`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${encodedBody}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-2 px-4 py-2 rounded-[7px] border border-gray-200 hover:border-[#25D366] hover:bg-green-50 transition-all text-sm font-medium text-gray-600 hover:text-[#25D366]"
      >
        <svg viewBox="0 0 32 32" className="w-5 h-5 fill-[#25D366]">
          <path d="M16.004 0C7.164 0 0 7.163 0 16.004c0 2.82.738 5.47 2.027 7.775L0 32l8.45-2.008A15.93 15.93 0 0016.004 32C24.836 32 32 24.836 32 16.004 32 7.163 24.836 0 16.004 0zm0 29.23a13.19 13.19 0 01-6.73-1.843l-.483-.288-4.997 1.188 1.21-4.867-.316-.5A13.19 13.19 0 012.77 16.004c0-7.297 5.938-13.234 13.234-13.234s13.234 5.937 13.234 13.234-5.937 13.226-13.234 13.226zm7.264-9.903c-.397-.2-2.352-1.16-2.717-1.29-.364-.132-.63-.198-.895.199-.265.397-1.028 1.29-1.26 1.555-.232.265-.464.298-.861.1-.397-.2-1.677-.618-3.194-1.97-1.18-1.053-1.977-2.353-2.21-2.75-.232-.397-.025-.61.175-.808.18-.177.397-.464.596-.695.198-.232.264-.398.397-.663.133-.265.066-.497-.033-.696-.1-.199-.895-2.155-1.226-2.95-.323-.773-.651-.668-.895-.68l-.762-.013c-.265 0-.696.1-1.06.497-.364.397-1.39 1.358-1.39 3.313s1.423 3.843 1.622 4.107c.198.265 2.8 4.275 6.784 5.996.948.41 1.688.654 2.265.838.952.303 1.819.26 2.504.158.764-.114 2.352-.961 2.684-1.889.332-.928.332-1.722.232-1.888-.1-.166-.365-.265-.763-.464z" />
        </svg>
        WhatsApp
      </button>
      <button
        onClick={handleEmail}
        className="flex items-center gap-2 px-4 py-2 rounded-[7px] border border-gray-200 hover:border-[#186737] hover:bg-green-50 transition-all text-sm font-medium text-gray-600 hover:text-[#186737]"
      >
        <Mail size={16} className="text-[#186737]" />
        Email
      </button>
    </div>
  );
}
