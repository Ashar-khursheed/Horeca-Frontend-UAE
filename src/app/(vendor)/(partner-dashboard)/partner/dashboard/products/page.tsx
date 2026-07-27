"use client";

import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Edit,
  Package,
  Plus,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface VendorProduct {
  id: number;
  name: string;
  sku: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Out of Stock";
}

// ── Mock data (UI only — no backend wired up yet) ──────────────────────────────
const MOCK_PRODUCTS: VendorProduct[] = [
  { id: 47026, name: "PolarBox Series 6' x 8' Quick Ship Walk-In Cooler Box Only With Floor", sku: "PBWF6X8",  image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/images/CWF6X8_1_Kc639r0jyZ.webp", category: "Walk-In Cooler Box", price: 3965.00, stock: 12, status: "Active" },
  { id: 47031, name: "Turbo Air TBC-36SB-N6 36\" Bottle Cooler",                               sku: "TBC36SBN6", image: "https://placehold.co/72x72/f3f4f6/9ca3af?text=Img",   category: "Bottle Coolers",     price: 2395.26, stock: 0,  status: "Out of Stock" },
  { id: 47040, name: "True TUC-27F-HC 27\" Undercounter Freezer",                              sku: "TUC27FHC",  image: "https://placehold.co/72x72/f3f4f6/9ca3af?text=Img",   category: "Undercounter Units",  price: 2099.00, stock: 6,  status: "Active" },
  { id: 47052, name: "FrostLine 27\" Reach-In Refrigerator",                                    sku: "FL27RIR",   image: "https://placehold.co/72x72/f3f4f6/9ca3af?text=Img",   category: "Reach-In Units",      price: 1529.00, stock: 3,  status: "Draft" },
];

const STATUS_CONFIG: Record<VendorProduct["status"], { bg: string; text: string; Icon: React.ElementType }> = {
  Active:        { bg: "bg-emerald-50", text: "text-emerald-700", Icon: CheckCircle },
  Draft:         { bg: "bg-gray-100",   text: "text-gray-600",    Icon: Edit },
  "Out of Stock":{ bg: "bg-red-50",     text: "text-red-700",     Icon: XCircle },
};

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PartnerProductsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [deleteTarget, setDeleteTarget] = useState<VendorProduct | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "All Status" && p.status !== statusFilter) return false;
      return true;
    });
  }, [products, search, statusFilter]);

  const activeCount = products.filter((p) => p.status === "Active").length;
  const outOfStockCount = products.filter((p) => p.status === "Out of Stock").length;

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setProducts((p) => p.filter((x) => x.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Products</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product listings, pricing, and stock levels.</p>
        </div>
        <button className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold rounded-[7px] transition-colors shadow-sm">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Products</p>
            <p className="text-xl font-black text-gray-900 mt-1">{products.length}</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
            <Package size={17} className="text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium">Active Listings</p>
            <p className="text-xl font-black text-[#186737] mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle size={17} className="text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium">Out of Stock</p>
            <p className="text-xl font-black text-red-600 mt-1">{outOfStockCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-red-200 bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={17} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-[7px] border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 min-w-[150px] rounded-[7px] border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#186737] bg-white px-2 cursor-pointer"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Package size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No products found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const sc = STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 max-w-[320px]">
                          <div className="w-11 h-11 rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                            <p className="text-[11px] text-gray-400 font-mono">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{p.category}</td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">${fmt(p.price)}</td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        <span className={p.stock === 0 ? "text-red-600 font-semibold" : "text-gray-700"}>{p.stock} units</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                          <sc.Icon size={10} />
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button title="Edit" className="w-7 h-7 rounded-[6px] flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
                            <Edit size={13} />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => setDeleteTarget(p)}
                            className="w-7 h-7 rounded-[6px] flex items-center justify-center border border-red-100 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Package size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-400">No products found</p>
            </div>
          ) : (
            filtered.map((p) => {
              const sc = STATUS_CONFIG[p.status];
              return (
                <div key={p.id} className="px-4 py-4">
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-[7px] border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{p.name}</p>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">{p.sku}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                          <sc.Icon size={9} />
                          {p.status}
                        </span>
                        <span className="text-[11px] text-gray-400">{p.stock} units</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 border-t border-gray-50 pt-3">
                    <p className="text-sm font-bold text-gray-900">${fmt(p.price)}</p>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-[6px] bg-gray-100 text-gray-600">
                        <Edit size={11} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-[6px] bg-red-50 text-red-500"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[10px] shadow-xl w-full max-w-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Delete Product</h3>
              <button onClick={() => setDeleteTarget(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to remove <span className="font-semibold text-gray-700">{deleteTarget.name}</span> from your listings? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-[7px] bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
