"use client";

import { useState } from "react";
import type { PdfOrderDetail } from "@/components/invoice/pdf-document";

export type { PdfOrderDetail };

// WebP → JPEG via canvas (react-pdf doesn't support WebP)
function toJpegBase64(src: string): Promise<string> {
  return new Promise((resolve) => {
    if (!src) { resolve(""); return; }
    const img = new window.Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 100;
        canvas.height = img.naturalHeight || 100;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(""); return; }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      } catch {
        resolve("");
      }
    };
    img.onerror = () => resolve("");
    img.src = src;
  });
}

async function prepareImages(order: PdfOrderDetail, origin: string): Promise<PdfOrderDetail> {
  const updatedProducts = await Promise.all(
    order.order_products.map(async (item) => {
      const originalUrl = item.product.image_urls?.en?.[0] ?? "";
      if (!originalUrl) return item;

      const proxyUrl = `${origin}/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
      const jpeg = await toJpegBase64(proxyUrl);

      return {
        ...item,
        product: {
          ...item.product,
          image_urls: {
            ...item.product.image_urls,
            en: jpeg
              ? [jpeg, ...(item.product.image_urls?.en?.slice(1) ?? [])]
              : item.product.image_urls?.en ?? [],
          },
        },
      };
    })
  );

  return { ...order, order_products: updatedProducts };
}

export function useInvoiceDownload(order: PdfOrderDetail | null) {
  const [loadings, setLoadings] = useState(false);

  const handleDownload = async () => {
    if (!order) return;
    setLoadings(true);
    try {
      const [{ pdf }, { InvoicePdfDocument }, orderWithImages] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/invoice/pdf-document"),
        prepareImages(order, window.location.origin),
      ]);

      const blob = await pdf(<InvoicePdfDocument order={orderWithImages} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-INV-${order.order_number}-HorecaStore.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice PDF generation failed:", err);
    } finally {
      setLoadings(false);
    }
  };

  return { handleDownload, loadings };
}
