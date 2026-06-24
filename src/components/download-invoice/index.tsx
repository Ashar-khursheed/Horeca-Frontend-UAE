"use client";

import { useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiOrderProduct {
  id: number;
  quantity: number;
  unit_price: string;
  product: {
    sku: string;
    name: { en: string };
    image_urls: { en: string[] };
    brand?: { name: { en: string } };
  };
}

export interface ApiOrderDetail {
  id: number;
  order_number: string;
  status: string;
  total_amount: string;
  amount: string;
  tax_amount: string;
  tax_percentage: string;
  shipping_charge: number;
  discount: string;
  additional_discount_amount: string;
  is_lift_gate: number;
  is_residential_address: number;
  is_inside_delivery: number;
  is_paid: number;
  created_at: string;
  customer_address: string;
  customer: {
    name: string;
    email: string;
    country_code: string;
    mobile_number: string;
  };
  order_products: ApiOrderProduct[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatDate = (str: string) =>
  new Date(str).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useInvoiceDownload(order: ApiOrderDetail | null) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [loadings, setLoadings] = useState(false);

  const handleDownload = async () => {
    if (!invoiceRef.current || !order) return;
    setLoadings(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF }   = await import("jspdf");          // named export in v2+

      // Temporarily make the element visible for html2canvas to capture
      const el = invoiceRef.current;
      const prevStyle = el.style.cssText;
      el.style.cssText = "position:absolute;top:0;left:0;z-index:-1;visibility:visible;";

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        onclone: (clonedDoc) => {
          // Remove all external/global stylesheets so html2canvas never parses
          // Tailwind v4's oklch()/lab() color functions which it can't handle.
          // The invoice uses only inline styles so this has no visual impact.
          clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((n) => n.remove());
        },
      });

      el.style.cssText = prevStyle;   // restore hidden

      const imgData = canvas.toDataURL("image/png");
      const pdf     = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW   = pdf.internal.pageSize.getWidth();
      const pageH   = pdf.internal.pageSize.getHeight();
      const imgW    = pageW;
      const imgH    = (canvas.height * imgW) / canvas.width;

      if (imgH <= pageH) {
        pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
      } else {
        let yOffset = 0;
        while (yOffset < imgH) {
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -yOffset, imgW, imgH);
          yOffset += pageH;
        }
      }

      pdf.save(`Invoice-${order.order_number}.pdf`);
    } catch (err) {
      console.error("Invoice download failed:", err);
    } finally {
      setLoadings(false);
    }
  };

  return { handleDownload, loadings, invoiceRef };
}

// ── Invoice Hidden Template ───────────────────────────────────────────────────

export function InvoiceHiddenTemplate({
  order,
  invoiceRef,
}: {
  order: ApiOrderDetail;
  invoiceRef: React.RefObject<HTMLDivElement>;
}) {
  const subtotal  = Number(order.amount);
  const tax       = Number(order.tax_amount);
  const discount  = Number(order.discount);
  const addDisc   = Number(order.additional_discount_amount);
  const total     = Number(order.total_amount);
  const liftFee   = order.is_lift_gate           === 1 ? 75  : 0;
  const resFee    = order.is_residential_address === 1 ? 199 : 0;
  const insideFee = order.is_inside_delivery     === 1 ? 249 : 0;
  const shipping  = total - subtotal - tax + discount + addDisc - liftFee - resFee - insideFee;

  const addressLines = order.customer_address
    .split(/\\n|\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const statusColor = {
    bg:    order.status === "Delivered" ? "#ecfdf5" : order.status === "Cancelled" ? "#fef2f2" : "#fffbeb",
    text:  order.status === "Delivered" ? "#065f46"  : order.status === "Cancelled" ? "#b91c1c"  : "#92400e",
    border:order.status === "Delivered" ? "#6ee7b7"  : order.status === "Cancelled" ? "#fca5a5"  : "#fde68a",
  };

  const rows: { label: string; value: string; green?: boolean }[] = [
    { label: "Subtotal", value: `$${fmt(subtotal)}` },
    ...(discount  > 0 ? [{ label: "Coupon Discount",    value: `-$${fmt(discount)}`,  green: true }] : []),
    ...(addDisc   > 0 ? [{ label: "Additional Discount", value: `-$${fmt(addDisc)}`,  green: true }] : []),
    shipping > 0
      ? { label: "Shipping",           value: `$${fmt(shipping)}` }
      : { label: "Shipping",           value: "Free", green: true },
    ...(liftFee   > 0 ? [{ label: "Lift Gate Service",   value: `$${fmt(liftFee)}` }]   : []),
    ...(resFee    > 0 ? [{ label: "Residential Address", value: `$${fmt(resFee)}` }]    : []),
    ...(insideFee > 0 ? [{ label: "Inside Delivery",     value: `$${fmt(insideFee)}` }] : []),
    { label: `Tax (${Number(order.tax_percentage).toFixed(2)}%)`, value: `$${fmt(tax)}` },
  ];

  return (
    <div style={{ position: "absolute", top: 0, left: "-9999px", zIndex: -1, pointerEvents: "none", overflow: "hidden", height: 0 }}>
      <div
        ref={invoiceRef}
        style={{ width: "794px", backgroundColor: "#ffffff", fontFamily: "'Segoe UI', Arial, sans-serif", color: "#111827", padding: "48px" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px", borderBottom: "3px solid #186737", paddingBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#186737", letterSpacing: "-0.5px" }}>HorecaStore</div>
            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>Commercial Kitchen Equipment</div>
            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px", lineHeight: "1.6" }}>
              +1 (866) 446-7322<br />support@horecastore.com
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "32px", fontWeight: 900, color: "#111827", letterSpacing: "-1px" }}>INVOICE</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#186737", marginTop: "6px" }}>#{order.order_number}</div>
            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>Date: {formatDate(order.created_at)}</div>
            <div style={{ display: "inline-block", marginTop: "8px", padding: "3px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, backgroundColor: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
              {order.status}
            </div>
          </div>
        </div>

        {/* Bill To / Ship To */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {[
            {
              title: "Bill To",
              content: (
                <>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{order.customer.name}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>{order.customer.email}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{order.customer.country_code} {order.customer.mobile_number}</div>
                </>
              ),
            },
            {
              title: "Ship To",
              content: addressLines.map((line, i) => (
                <div key={i} style={{ fontSize: i === 0 ? "13px" : "11px", fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "#111827" : "#6b7280", marginTop: i === 0 ? 0 : "2px" }}>{line}</div>
              )),
            },
          ].map(({ title, content }) => (
            <div key={title} style={{ backgroundColor: "#f9fafb", borderRadius: "8px", padding: "16px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>{title}</div>
              {content}
            </div>
          ))}
        </div>

        {/* Items Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
          <thead>
            <tr style={{ backgroundColor: "#186737" }}>
              {["#", "Product", "SKU", "Qty", "Unit Price", "Total"].map((h, i) => (
                <th key={h} style={{ padding: "10px 12px", fontSize: "11px", fontWeight: 700, color: "#ffffff", textAlign: i === 0 || i > 2 ? "center" : "left", letterSpacing: "0.3px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.order_products.map((item, idx) => {
              const name  = item.product.name?.en ?? "";
              const brand = item.product.brand?.name?.en ?? "";
              return (
                <tr key={item.id} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                  <td style={{ padding: "10px 12px", fontSize: "11px", color: "#6b7280", textAlign: "center", borderBottom: "1px solid #f3f4f6" }}>{idx + 1}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#111827", lineHeight: "1.4" }}>{name}</div>
                    {brand && <div style={{ fontSize: "10px", color: "#186737", fontWeight: 600, marginTop: "2px" }}>{brand}</div>}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: "10px", color: "#9ca3af", fontFamily: "monospace", borderBottom: "1px solid #f3f4f6" }}>{item.product.sku}</td>
                  <td style={{ padding: "10px 12px", fontSize: "12px", fontWeight: 600, color: "#374151", textAlign: "center", borderBottom: "1px solid #f3f4f6" }}>{item.quantity}</td>
                  <td style={{ padding: "10px 12px", fontSize: "12px", color: "#374151", textAlign: "center", borderBottom: "1px solid #f3f4f6" }}>${fmt(Number(item.unit_price))}</td>
                  <td style={{ padding: "10px 12px", fontSize: "12px", fontWeight: 700, color: "#111827", textAlign: "center", borderBottom: "1px solid #f3f4f6" }}>${fmt(Number(item.unit_price) * item.quantity)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
          <div style={{ width: "280px" }}>
            {rows.map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>{row.label}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: row.green ? "#186737" : "#374151" }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", marginTop: "4px", borderTop: "2px solid #186737" }}>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>Total</span>
              <span style={{ fontSize: "16px", fontWeight: 900, color: "#186737" }}>${fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "10px", color: "#9ca3af" }}>Thank you for your business!</div>
          <div style={{ fontSize: "10px", color: "#9ca3af" }}>HorecaStore · horecastore.com · +1 (866) 446-7322</div>
        </div>
      </div>
    </div>
  );
}
