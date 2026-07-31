"use client";

import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Package,
  Pencil,
  Save,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface VendorPriceProduct {
  id: number;
  product_id: number;
  vendor: { id: number; name: string };
  vendor_sku: string;
  cost_per_item: string;
  shipping_charge: string;
  delivery_days: string;
  return_policy: string;
  inventory: number;
  in_stock: number;
  product: {
    id: number;
    sku: string;
    name: { en: string };
    image_urls: { en: string[] };
  };
}

// Placeholder shown only if the row wasn't reached via the products list
// (e.g. a direct link or page refresh) — there's no single-record GET yet.
const FALLBACK_PRODUCT: VendorPriceProduct = {
  id: 0,
  product_id: 0,
  vendor: { id: 0, name: "—" },
  vendor_sku: "—",
  cost_per_item: "0.00",
  shipping_charge: "0.00",
  delivery_days: "—",
  return_policy: "—",
  inventory: 0,
  in_stock: 0,
  product: { id: 0, sku: "—", name: { en: "Product not found" }, image_urls: { en: [] } },
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PartnerProductDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<VendorPriceProduct | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "1");
  const [saved, setSaved] = useState(false);

  const [costPerItem, setCostPerItem] = useState("");
  const [shippingCharge, setShippingCharge] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [inventory, setInventory] = useState(0);
  const [inStock, setInStock] = useState(true);

  useEffect(() => {
    let loaded: VendorPriceProduct | null = null;
    try {
      const raw = sessionStorage.getItem(`vendor_product_${params.id}`);
      if (raw) loaded = JSON.parse(raw);
    } catch {
      // ignore
    }

    const p = loaded ?? { ...FALLBACK_PRODUCT, id: Number(params.id) };
    setNotFound(!loaded);
    setProduct(p);
    setCostPerItem(p.cost_per_item);
    setShippingCharge(p.shipping_charge);
    setDeliveryDays(p.delivery_days);
    setReturnPolicy(p.return_policy);
    setInventory(p.inventory);
    setInStock(p.in_stock === 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (!product) return null;

  const image = product.product.image_urls?.en?.[0];

  const handleSave = () => {
    // UI only — no update endpoint wired up yet.
    const updated: VendorPriceProduct = {
      ...product,
      cost_per_item: costPerItem,
      shipping_charge: shippingCharge,
      delivery_days: deliveryDays,
      return_policy: returnPolicy,
      inventory,
      in_stock: inStock ? 1 : 0,
    };
    setProduct(updated);
    try {
      sessionStorage.setItem(`vendor_product_${product.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsEditing(false);
    setSaved(true);
    router.replace(`/partner/dashboard/products/${product.id}`);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setCostPerItem(product.cost_per_item);
    setShippingCharge(product.shipping_charge);
    setDeliveryDays(product.delivery_days);
    setReturnPolicy(product.return_policy);
    setInventory(product.inventory);
    setInStock(product.in_stock === 1);
    setIsEditing(false);
    router.replace(`/partner/dashboard/products/${product.id}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1000px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard/products" className="hover:text-[#186737] transition-colors">Products</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium truncate max-w-[220px]">{product.product.name.en}</span>
      </nav>

      {notFound && (
        <div className="rounded-[7px] border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
          Opened directly, so live details couldn&apos;t be loaded — go back to Products and use View/Edit from the list.
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 rounded-[7px] border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700">
          <CheckCircle size={13} /> Changes saved (UI only — not yet sent to the server).
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/partner/dashboard/products"
              className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all shrink-0 mt-0.5"
            >
              <ArrowLeft size={15} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                {image ? (
                  <img src={image} alt={product.product.name.en} className="w-full h-full object-contain p-1" />
                ) : (
                  <Package size={18} className="text-gray-300" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-snug">{product.product.name.en}</h1>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{product.vendor_sku}</p>
              </div>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#155c30] transition-colors shrink-0"
            >
              <Pencil size={13} /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 h-9 px-3 rounded-[7px] border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <X size={13} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 h-9 px-4 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#155c30] transition-colors"
              >
                <Save size={13} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Pricing & stock */}
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Pricing &amp; Stock</h2>
          </div>
          <div className="p-5 space-y-4">
            <Field label="Cost per Item" prefix="$">
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={costPerItem}
                  onChange={(e) => setCostPerItem(e.target.value)}
                  className="w-full h-9 px-3 rounded-[7px] border border-gray-200 text-sm outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                />
              ) : (
                <p className="text-sm font-bold text-gray-900">${fmt(Number(costPerItem))}</p>
              )}
            </Field>

            <Field label="Shipping Charge" prefix="$">
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={shippingCharge}
                  onChange={(e) => setShippingCharge(e.target.value)}
                  className="w-full h-9 px-3 rounded-[7px] border border-gray-200 text-sm outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                />
              ) : (
                <p className="text-sm font-semibold text-gray-700">${fmt(Number(shippingCharge))}</p>
              )}
            </Field>

            <Field label="Inventory">
              {isEditing ? (
                <input
                  type="number"
                  min={0}
                  value={inventory}
                  onChange={(e) => setInventory(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-[7px] border border-gray-200 text-sm outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                />
              ) : (
                <p className={`text-sm font-semibold ${inventory === 0 ? "text-red-600" : "text-gray-700"}`}>{inventory} units</p>
              )}
            </Field>

            <Field label="Stock Status">
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => setInStock((v) => !v)}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                >
                  {inStock ? <CheckCircle size={10} /> : <XCircle size={10} />}
                  {inStock ? "In Stock" : "Out of Stock"}
                </button>
              ) : (
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {inStock ? <CheckCircle size={10} /> : <XCircle size={10} />}
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              )}
            </Field>
          </div>
        </div>

        {/* Shipping & vendor info */}
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Delivery &amp; Vendor</h2>
          </div>
          <div className="p-5 space-y-4">
            <Field label="Delivery Days">
              {isEditing ? (
                <input
                  type="text"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="w-full h-9 px-3 rounded-[7px] border border-gray-200 text-sm outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                />
              ) : (
                <p className="text-sm font-semibold text-gray-700">{deliveryDays}</p>
              )}
            </Field>

            <Field label="Return Policy">
              {isEditing ? (
                <textarea
                  value={returnPolicy}
                  onChange={(e) => setReturnPolicy(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-[7px] border border-gray-200 text-sm outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 resize-none"
                />
              ) : (
                <p className="text-sm text-gray-700 whitespace-pre-line">{returnPolicy}</p>
              )}
            </Field>

            <Field label="Vendor">
              <p className="text-sm font-semibold text-gray-700">{product.vendor.name}</p>
            </Field>

            <Field label="Product SKU">
              <p className="text-sm font-mono text-gray-500">{product.product.sku}</p>
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, prefix, children }: { label: string; prefix?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {prefix ? `${label} (${prefix})` : label}
      </label>
      {children}
    </div>
  );
}
