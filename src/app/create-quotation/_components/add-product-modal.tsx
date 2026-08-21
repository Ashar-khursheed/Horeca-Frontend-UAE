"use client";

import { Modal } from "@/components/ui/modal";
import { CurrencySymbol } from "@/components/currency-symbol";
import type { ApiBrandProduct, SearchProduct } from "@/utils/types";
import { Check, Package, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const SEARCH_API = "https://test-us.thehorecastore.co/api/frontend/search";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export type { SearchProduct };

// ── Raw shape returned by frontend/search (the real backend, not the NLP microservice) ──
interface BackendSearchResponse {
  success: boolean;
  data: {
    products: ApiBrandProduct[];
  };
}

// Adapts frontend/search's product shape (title/image_urls/best_supplier) into the
// SearchProduct shape this modal renders. Kept local to this file — the shared
// toSearchSuggestions() adapter in @/utils/adapt-nlp-search is for the separate NLP
// microservice response shape still used by the main search bar/page/compare.
function adaptBackendSearchProducts(raw: BackendSearchResponse): SearchProduct[] {
  return (raw.data?.products ?? []).map((p) => {
    const supplier = p.best_supplier;
    const salePrice = supplier?.sale_price != null ? Number(supplier.sale_price) : 0;
    return {
      id: p.id,
      sku: p.sku,
      name: { en: p.title?.en ?? "", ar: p.title?.ar ?? null },
      images: { en: p.image_urls?.en ?? [], ar: p.image_urls?.ar ?? [] },
      url: p.url,
      category_url_resolved: "",
      parent_category_url_resolved: "",
      price: supplier?.price ?? 0,
      sale_price: salePrice,
      currency: { symbol: p.currency?.symbol ?? "AED", title: p.currency?.title ?? "" },
      quote_available: !!p.for_quotes,
      isRequired: false,
      in_wishlist: p.in_wishlist,
      suppliers: supplier
        ? [
            {
              vendor_id: supplier.vendor_id,
              price: supplier.price,
              sale_price: salePrice || undefined,
              shipping_charge: Number(supplier.shipping_charge) || 0,
              delivery_days: supplier.delivery_days,
              return_policy: supplier.return_policy,
              free_shipping: !!supplier.free_shipping,
              min_quantity: supplier.min_quantity,
              is_fixed: !!supplier.is_fixed,
            },
          ]
        : [],
    };
  });
}

const VAT_RATE = 0.05;

export function AddProductModal({
  isOpen,
  onClose,
  onAdd,
  addedIds,
  isUAE = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: SearchProduct) => void;
  addedIds: number[];
  /** Show 5% VAT + total per product — only applies within the UAE. */
  isUAE?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async (q: string) => {
    setLoading(true);
    setError(false);
    try {
      const url = `${SEARCH_API}?query=${encodeURIComponent(q.trim() || "hoshizaki")}&page=1&length=10`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("search failed");
      const raw: BackendSearchResponse = await res.json();
      setProducts(adaptBackendSearchProducts(raw));
    } catch {
      setError(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch default/trending products once, when the modal first opens
  useEffect(() => {
    if (isOpen) fetchProducts("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchProducts(val), 350);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Products" width="max-w-2xl" zIndex>
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search products by name, SKU, or category..."
            className="w-full h-11 pl-9 pr-4 rounded-[7px] border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
          />
        </div>

        {/* Results */}
        <div className="min-h-[320px] max-h-[55vh] overflow-y-auto -mx-1 px-1">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-[7px] border border-gray-100 animate-pulse">
                  <div className="w-16 h-16 rounded-[7px] bg-gray-100 shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <Package size={36} className="mx-auto text-red-200 mb-3" />
              <p className="text-sm font-semibold text-gray-400">Failed to load products</p>
              <button
                onClick={() => fetchProducts(query)}
                className="mt-3 text-xs text-[#186737] hover:underline font-medium"
              >
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <Package size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-400">No products found</p>
              <p className="text-xs text-gray-300 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {products.map((p) => {
                const image = p.images?.en?.[0] ?? "";
                const price = p.sale_price > 0 ? p.sale_price : p.price;
                const vatAmount = isUAE ? price * VAT_RATE : 0;
                const totalWithVat = price + vatAmount;
                const supplier = p.suppliers?.[0];
                const alreadyAdded = addedIds.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-[7px] border border-gray-100 hover:border-[#c3e6d4] hover:bg-[#f8fdf9] transition-all"
                  >
                    <div className="w-16 h-16 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                      {image && (
                        <img
                          src={image}
                          alt={p.name?.en ?? ""}
                          className="w-full h-full object-contain p-1.5"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://placehold.co/64x64/f3f4f6/9ca3af?text=No+Img";
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                        {p.name?.en}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        SKU: <span className="text-gray-600 font-medium">{p.sku}</span>
                      </p>
                      <p className="text-sm font-bold text-[#186737] mt-1">
                        <CurrencySymbol currency={p.currency?.symbol} fontsize="15px" />
                        {fmt(price)}
                      </p>
                      {isUAE && (
                        <>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            VAT (5%): <CurrencySymbol currency={p.currency?.symbol} fontsize="11px" />
                            {fmt(vatAmount)}
                          </p>
                          <p className="text-xs font-semibold text-gray-700 mt-0.5">
                            Total: <CurrencySymbol currency={p.currency?.symbol} fontsize="12px" />
                            {fmt(totalWithVat)}
                          </p>
                        </>
                      )}
                      {supplier?.delivery_days && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Ships in {supplier.delivery_days}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onAdd(p)}
                      disabled={alreadyAdded}
                      className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-[7px] transition-colors ${
                        alreadyAdded
                          ? "bg-emerald-50 text-emerald-600 cursor-default"
                          : "bg-[#186737] hover:bg-[#145c30] text-white"
                      }`}
                    >
                      {alreadyAdded ? (
                        <>
                          <Check size={13} /> Added
                        </>
                      ) : (
                        <>
                          <Plus size={13} /> Add
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
