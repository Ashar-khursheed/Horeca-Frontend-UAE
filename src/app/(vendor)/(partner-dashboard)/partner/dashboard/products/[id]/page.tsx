"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Loader2,
  Package,
  Pencil,
  Save,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";

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

interface VendorPriceDetailResponse {
  success: boolean;
  message: string;
  data: VendorPriceProduct;
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PartnerProductDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<VendorPriceProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const fetchProduct = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await makeApiRequest<VendorPriceDetailResponse>(
        apiUrls.VENDOR_PRICE_DETAIL(params.id)
      );
      if (res.success && res.data) {
        setProduct(res.data);
        setActiveImage(0);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    if (product && searchParams.get("edit") === "1") {
      setIsModalOpen(true);
      router.replace(`/partner/dashboard/products/${product.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const handleSaved = (updated: Pick<VendorPriceProduct, "cost_per_item" | "inventory" | "in_stock">) => {
    setProduct((prev) => (prev ? { ...prev, ...updated } : prev));
    setIsModalOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard/products" className="hover:text-[#186737] transition-colors">Products</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium truncate max-w-[220px]">
          {product ? product.product.name.en : "…"}
        </span>
      </nav>

      {saved && (
        <div className="flex items-center gap-2 rounded-[7px] border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700">
          <CheckCircle size={13} /> Price &amp; stock updated successfully.
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-5">
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-[7px] bg-gray-100 animate-pulse shrink-0" />
              <div className="w-16 h-16 rounded-[7px] bg-gray-100 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[0, 1].map((i) => (
              <div key={i} className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="h-8 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm py-16 text-center">
          <AlertCircle size={36} className="mx-auto text-red-200 mb-3" />
          <p className="text-sm font-semibold text-gray-400">Failed to load product details</p>
          <button
            onClick={fetchProduct}
            className="mt-3 text-xs text-[#186737] hover:underline font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && product && (
        <>
          {/* Header */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <Link
                  href="/partner/dashboard/products"
                  className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all shrink-0 mt-0.5"
                >
                  <ArrowLeft size={15} />
                </Link>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                    {product.product.image_urls?.en?.[0] ? (
                      <img
                        src={product.product.image_urls.en[0]}
                        alt={product.product.name.en}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <Package size={18} className="text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 leading-snug truncate">{product.product.name.en}</h1>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">{product.vendor_sku}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#155c30] transition-colors shrink-0"
              >
                <Pencil size={13} /> Edit Price &amp; Stock
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Image gallery */}
            {product.product.image_urls?.en?.length > 0 && (
              <div className="lg:col-span-5 bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
                <div className="w-full aspect-square rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.product.image_urls.en[activeImage]}
                    alt={product.product.name.en}
                    className="max-w-full max-h-full object-contain p-3"
                  />
                </div>
                {product.product.image_urls.en.length > 1 && (
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                    {product.product.image_urls.en.map((img, i) => (
                      <button
                        key={img}
                        onClick={() => setActiveImage(i)}
                        className={`w-11 h-11 rounded-[7px] border shrink-0 overflow-hidden flex items-center justify-center transition-colors ${
                          i === activeImage ? "border-[#186737] ring-2 ring-[#186737]/15" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain p-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={`${product.product.image_urls?.en?.length > 0 ? "lg:col-span-7" : "lg:col-span-12"} space-y-5`}>
              {/* Pricing & stock */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 text-sm">Pricing &amp; Stock</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[11px] font-semibold text-[#186737] hover:underline flex items-center gap-1"
                  >
                    <Pencil size={11} /> Edit
                  </button>
                </div>
                <div className="p-5 grid grid-cols-2 gap-x-4 gap-y-4">
                  <Field label="Cost per Item" prefix="$">
                    <p className="text-sm font-bold text-gray-900">${fmt(Number(product.cost_per_item))}</p>
                  </Field>
                  <Field label="Shipping Charge" prefix="$">
                    <p className="text-sm font-semibold text-gray-700">${fmt(Number(product.shipping_charge))}</p>
                  </Field>
                  <Field label="Inventory">
                    <p className={`text-sm font-semibold ${product.inventory === 0 ? "text-red-600" : "text-gray-700"}`}>
                      {product.inventory} units
                    </p>
                  </Field>
                  <Field label="Stock Status">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        product.in_stock === 1 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.in_stock === 1 ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {product.in_stock === 1 ? "In Stock" : "Out of Stock"}
                    </span>
                  </Field>
                </div>
              </div>

              {/* Delivery & vendor info */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Truck size={14} className="text-gray-400" />
                  <h2 className="font-bold text-gray-900 text-sm">Delivery &amp; Vendor</h2>
                </div>
                <div className="p-5 grid grid-cols-2 gap-x-4 gap-y-4">
                  <Field label="Delivery Days">
                    <p className="text-sm font-semibold text-gray-700">{product.delivery_days || "—"}</p>
                  </Field>
                  <Field label="Vendor">
                    <p className="text-sm font-semibold text-gray-700">{product.vendor.name}</p>
                  </Field>
                  <Field label="Product SKU">
                    <p className="text-sm font-mono text-gray-500">{product.product.sku}</p>
                  </Field>
                  <Field label="Return Policy">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{product.return_policy || "—"}</p>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {isModalOpen && (
            <EditPriceStockModal
              product={product}
              onClose={() => setIsModalOpen(false)}
              onSaved={handleSaved}
            />
          )}
        </>
      )}
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

// ── Edit modal ───────────────────────────────────────────────────────────────
function EditPriceStockModal({
  product,
  onClose,
  onSaved,
}: {
  product: VendorPriceProduct;
  onClose: () => void;
  onSaved: (updated: Pick<VendorPriceProduct, "cost_per_item" | "inventory" | "in_stock">) => void;
}) {
  const [costPerItem, setCostPerItem] = useState(product.cost_per_item);
  const [inventory, setInventory] = useState(product.inventory);
  const [inStock, setInStock] = useState(product.in_stock === 1);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await makeApiRequest<{ success: boolean; message?: string }>(
        apiUrls.VENDOR_PRICE_DETAIL(product.id),
        {
          method: "PUT",
          data: {
            cost_per_item: Number(costPerItem),
            inventory: Number(inventory),
            in_stock: inStock,
          },
        }
      );

      if (res.success === false) {
        setSaveError(res.message || "Failed to update. Please try again.");
        return;
      }

      onSaved({
        cost_per_item: String(costPerItem),
        inventory: Number(inventory),
        in_stock: inStock ? 1 : 0,
      });
    } catch {
      setSaveError("Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={() => { if (!saving) onClose(); }}
      title="Edit Price & Stock"
      width="max-w-md"
    >
        <p className="text-xs text-gray-400 -mt-1 mb-4 truncate">{product.product.name.en}</p>
        <div className="space-y-4">
          {saveError && (
            <div className="flex items-center gap-2 rounded-[7px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle size={13} className="shrink-0" /> {saveError}
            </div>
          )}

          <Field label="Cost per Item" prefix="$">
            <input
              type="number"
              step="0.01"
              min={0}
              value={costPerItem}
              onChange={(e) => setCostPerItem(e.target.value)}
              disabled={saving}
              className="w-full h-9 px-3 rounded-[7px] border border-gray-200 text-sm outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 disabled:opacity-50"
            />
          </Field>

          <Field label="Inventory">
            <input
              type="number"
              min={0}
              value={inventory}
              onChange={(e) => setInventory(Number(e.target.value))}
              disabled={saving}
              className="w-full h-9 px-3 rounded-[7px] border border-gray-200 text-sm outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 disabled:opacity-50"
            />
          </Field>

          <Field label="Stock Status">
            <button
              type="button"
              onClick={() => setInStock((v) => !v)}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 ${
                inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}
            >
              {inStock ? <CheckCircle size={10} /> : <XCircle size={10} />}
              {inStock ? "In Stock" : "Out of Stock"}
            </button>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 pt-5 mt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex items-center gap-1.5 h-9 px-3 rounded-[7px] border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-1.5 h-9 px-4 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#155c30] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
    </Modal>
  );
}
