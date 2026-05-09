"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Building2,
    ChevronDown,
    ChevronRight,
    FileText,
    Hash,
    Home,
    Info,
    Mail,
    MapPin,
    MessageCircle,
    Minus,
    Phone,
    Plus,
    ShoppingCart,
    Tag,
    Trash2,
    User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type QuoteProduct = {
  id: number;
  name: string;
  brand: string;
  sku: string;
  image: string;
  warranty: string;
  deliveryDays: string;
  shippingCost: number;
  price: number;
  qty: number;
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS: QuoteProduct[] = [
  {
    id: 1,
    name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
    brand: "Turbo Air",
    sku: "TBC-36SB-N6",
    image:
      "https://cdn11.bigcommerce.com/s-tpvfvvvlnl/images/stencil/1280x1280/products/35898/79046/tbc-36sb-n6__79124.1694539695.jpg",
    warranty: "5 Years Parts & Labor, 7 Year Compressor",
    deliveryDays: "5 to 7 Days",
    shippingCost: 0,
    price: 2395.26,
    qty: 1,
  },
];

const TAX_RATE = 0.0825;

const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ── Small Breadcrumb ──────────────────────────────────────────────────────────
const QuoteBreadcrumb = () => (
  <nav className="bg-white border-b border-gray-100">
    <div className="global-container">
      <ol className="flex items-center flex-wrap gap-y-1 h-10 text-xs">
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-[#186737] transition-colors flex items-center gap-1"
          >
            <Home size={11} />
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight size={12} className="mx-1.5 text-gray-300" />
          <span className="text-[#186737] font-semibold">Create Quotation</span>
        </li>
      </ol>
    </div>
  </nav>
);

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full h-10 px-3 rounded-[7px] border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white";

// ── Product Row ───────────────────────────────────────────────────────────────
const ProductRow = ({
  product,
  onQtyChange,
  onRemove,
}: {
  product: QuoteProduct;
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) => {
  const lineTotal = product.price * product.qty;

  return (
    <tr className="border-t border-gray-100 align-top group">
      {/* Product Details */}
      <td className="py-4 pr-4">
        <div className="flex gap-3">
          <div className="w-16 h-16 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-1.5"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://placehold.co/64x64/f3f4f6/9ca3af?text=No+Img";
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
              {product.name}
            </p>
            <p className="text-xs text-[#186737] font-semibold mt-0.5">
              Brand: {product.brand}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              SKU #:{" "}
              <span className="text-[#186737] font-medium">{product.sku}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Warranty:{" "}
              <span className="font-medium text-gray-700">{product.warranty}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Shipping Charge:{" "}
              <span className="font-medium text-gray-700">
                ${fmtPrice(product.shippingCost)}
              </span>{" "}
              Mostly ships in {product.deliveryDays}
            </p>
            <button
              onClick={() => onRemove(product.id)}
              className="mt-1.5 text-[11px] text-red-500 hover:text-red-700 hover:underline font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 size={11} />
              Delete
            </button>
          </div>
        </div>
      </td>

      {/* Limit Price */}
      <td className="py-4 pr-4 whitespace-nowrap">
        <span className="text-sm font-semibold text-gray-800">
          ${fmtPrice(product.price)}
        </span>
      </td>

      {/* Quantity */}
      <td className="py-4 pr-4">
        <div className="flex items-center border border-[#BCE3C9] rounded-[5px] overflow-hidden bg-white w-fit">
          <button
            onClick={() => onQtyChange(product.id, Math.max(1, product.qty - 1))}
            disabled={product.qty <= 1}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={13} className="text-gray-600" strokeWidth={2} />
          </button>
          <span className="w-8 text-center text-sm font-bold text-[#186737]">
            {product.qty}
          </span>
          <button
            onClick={() => onQtyChange(product.id, Math.min(99, product.qty + 1))}
            disabled={product.qty >= 99}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={13} className="text-gray-600" strokeWidth={2} />
          </button>
        </div>
      </td>

      {/* Total */}
      <td className="py-4 whitespace-nowrap">
        <span className="text-sm font-bold text-gray-900">
          ${fmtPrice(lineTotal)}
        </span>
      </td>
    </tr>
  );
};

// ── Mobile Product Card ───────────────────────────────────────────────────────
const MobileProductCard = ({
  product,
  onQtyChange,
  onRemove,
}: {
  product: QuoteProduct;
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) => {
  const lineTotal = product.price * product.qty;

  return (
    <div className="border border-gray-100 rounded-[7px] p-4 bg-white">
      <div className="flex gap-3">
        <div className="w-16 h-16 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1.5"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/64x64/f3f4f6/9ca3af?text=No+Img";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
            {product.name}
          </p>
          <p className="text-xs text-[#186737] font-semibold mt-0.5">
            {product.brand}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500">
          Warranty:{" "}
          <span className="font-medium text-gray-700">{product.warranty}</span>
        </p>
        <p className="text-xs text-gray-500">
          Ships in {product.deliveryDays} · Shipping: ${fmtPrice(product.shippingCost)}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center border border-[#BCE3C9] rounded-[5px] overflow-hidden bg-white">
          <button
            onClick={() => onQtyChange(product.id, Math.max(1, product.qty - 1))}
            disabled={product.qty <= 1}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <Minus size={13} className="text-gray-600" strokeWidth={2} />
          </button>
          <span className="w-8 text-center text-sm font-bold text-[#186737]">
            {product.qty}
          </span>
          <button
            onClick={() => onQtyChange(product.id, Math.min(99, product.qty + 1))}
            disabled={product.qty >= 99}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <Plus size={13} className="text-gray-600" strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900">
            ${fmtPrice(lineTotal)}
          </span>
          <button
            onClick={() => onRemove(product.id)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CreateQuotationPage() {
  const [products, setProducts] = useState<QuoteProduct[]>(INITIAL_PRODUCTS);
  const [submitted, setSubmitted] = useState(false);

  // form state
  const [form, setForm] = useState({
    businessName: "Arshad Inc.",
    businessAddress: "Houston, Houston, Texas, United States",
    contactName: "Arshad Khan",
    email: "webdeveloper08@horecastore.ae",
    shippingAddress: "Houston, Houston, Texas, United States",
    zipCode: "77074",
    mobile: "(555) 555-5577",
    paymentTerms: "Credit Card",
    quoteName: "",
    notes: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleQtyChange = (id: number, qty: number) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty } : p))
    );

  const handleRemove = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  // Totals
  const subtotal = products.reduce((s, p) => s + p.price * p.qty, 0);
  const shipping = products.reduce((s, p) => s + p.shippingCost * p.qty, 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + shipping + tax;

  const handleGenerate = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <>
      <QuoteBreadcrumb />
      <main className="min-h-screen bg-gray-50/60">
        <div className="global-container py-6 sm:py-8">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#186737]">
              Your Customized Quotation
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Based on your selection, this quotation has been prepared for you.
              Please review before confirming.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-start">
            {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
            <div className="space-y-5">
              {/* Customer Information */}
              <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                  <User size={15} className="text-[#186737]" />
                  <h2 className="font-bold text-gray-900 text-sm">
                    Customer Information
                  </h2>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Business Name">
                    <div className="relative">
                      <Building2
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        className={`${inputCls} pl-9`}
                        value={form.businessName}
                        onChange={set("businessName")}
                        placeholder="Your business name"
                      />
                    </div>
                  </Field>

                  <Field label="Business Address">
                    <div className="relative">
                      <MapPin
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        className={`${inputCls} pl-9`}
                        value={form.businessAddress}
                        onChange={set("businessAddress")}
                        placeholder="City, State, Country"
                      />
                    </div>
                  </Field>

                  <Field label="Contact Name">
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        className={`${inputCls} pl-9`}
                        value={form.contactName}
                        onChange={set("contactName")}
                        placeholder="Full name"
                      />
                    </div>
                  </Field>

                  <Field label="Email Address">
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        className={`${inputCls} pl-9`}
                        value={form.email}
                        onChange={set("email")}
                        placeholder="you@company.com"
                      />
                    </div>
                  </Field>

                  <Field label="Shipping Address" required>
                    <div className="relative">
                      <MapPin
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        className={`${inputCls} pl-9 pr-28`}
                        value={form.shippingAddress}
                        onChange={set("shippingAddress")}
                        placeholder="Full shipping address"
                      />
                      <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#186737] font-semibold hover:underline whitespace-nowrap">
                        Manage Addresses
                      </button>
                    </div>
                  </Field>

                  <Field label="Zip Code" required>
                    <div className="relative">
                      <Hash
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        className={`${inputCls} pl-9`}
                        value={form.zipCode}
                        onChange={set("zipCode")}
                        placeholder="00000"
                      />
                    </div>
                  </Field>

                  <Field label="Mobile Number">
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 px-3 h-10 rounded-[7px] border border-gray-200 bg-white text-sm text-gray-700 shrink-0 cursor-pointer hover:border-[#186737] transition-colors">
                        <span>🇺🇸</span>
                        <ChevronDown size={13} className="text-gray-400" />
                      </div>
                      <input
                        className={inputCls}
                        value={form.mobile}
                        onChange={set("mobile")}
                        placeholder="(555) 000-0000"
                      />
                    </div>
                  </Field>

                  <Field label="Payment Terms">
                    <Select value={form.paymentTerms} onValueChange={(val) => setForm((prev) => ({ ...prev, paymentTerms: val }))}>
                      <SelectTrigger className={`${inputCls} cursor-pointer`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                        <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Quote Name">
                    <div className="relative">
                      <Tag
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        className={`${inputCls} pl-9`}
                        value={form.quoteName}
                        onChange={set("quoteName")}
                        placeholder="Enter your quote name"
                      />
                    </div>
                  </Field>
                </div>
              </section>

              {/* Quotation Details */}
              <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                  <FileText size={15} className="text-[#186737]" />
                  <h2 className="font-bold text-gray-900 text-sm">
                    Quotation Details
                  </h2>
                  <span className="ml-auto text-xs text-gray-400 font-medium">
                    {products.length} product{products.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {products.length === 0 ? (
                  <div className="p-10 text-center">
                    <FileText size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No products added yet.</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                              Product Details
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                              Limit Price
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                              Quantity
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="px-5">
                          {products.map((p) => (
                            <tr key={p.id} className="border-t border-gray-100 align-top group">
                              <td className="py-4 pl-5 pr-4">
                                <div className="flex gap-3">
                                  <div className="w-16 h-16 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="w-full h-full object-contain p-1.5"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                          "https://placehold.co/64x64/f3f4f6/9ca3af?text=No+Img";
                                      }}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                                      {p.name}
                                    </p>
                                    <p className="text-xs text-[#186737] font-semibold mt-0.5">
                                      Brand: {p.brand}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      SKU #:{" "}
                                      <span className="text-[#186737] font-medium">
                                        {p.sku}
                                      </span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      Warranty:{" "}
                                      <span className="font-medium text-gray-700">
                                        {p.warranty}
                                      </span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      Shipping Charge:{" "}
                                      <span className="font-medium text-gray-700">
                                        ${fmtPrice(p.shippingCost)}
                                      </span>{" "}
                                      Mostly ships in {p.deliveryDays}
                                    </p>
                                    <button
                                      onClick={() => handleRemove(p.id)}
                                      className="mt-1.5 text-[11px] text-red-500 hover:text-red-700 hover:underline font-semibold flex items-center gap-1 transition-colors"
                                    >
                                      <Trash2 size={11} />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 pr-4 whitespace-nowrap">
                                <span className="text-sm font-semibold text-gray-800">
                                  ${fmtPrice(p.price)}
                                </span>
                              </td>
                              <td className="py-4 pr-4">
                                <div className="flex items-center border border-[#BCE3C9] rounded-[5px] overflow-hidden bg-white w-fit">
                                  <button
                                    onClick={() => handleQtyChange(p.id, Math.max(1, p.qty - 1))}
                                    disabled={p.qty <= 1}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Minus size={13} className="text-gray-600" strokeWidth={2} />
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold text-[#186737]">
                                    {p.qty}
                                  </span>
                                  <button
                                    onClick={() => handleQtyChange(p.id, Math.min(99, p.qty + 1))}
                                    disabled={p.qty >= 99}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Plus size={13} className="text-gray-600" strokeWidth={2} />
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 whitespace-nowrap">
                                <span className="text-sm font-bold text-gray-900">
                                  ${fmtPrice(p.price * p.qty)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden p-4 space-y-3">
                      {products.map((p) => (
                        <div key={p.id} className="border border-gray-100 rounded-[7px] p-4">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 flex items-center justify-center">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-contain p-1.5"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "https://placehold.co/64x64/f3f4f6/9ca3af?text=No+Img";
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                                {p.name}
                              </p>
                              <p className="text-xs text-[#186737] font-semibold mt-0.5">
                                {p.brand}
                              </p>
                              <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                            </div>
                          </div>
                          <div className="mt-2.5 space-y-1">
                            <p className="text-xs text-gray-500">
                              Warranty:{" "}
                              <span className="font-medium text-gray-700">{p.warranty}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Ships in {p.deliveryDays} · Shipping: ${fmtPrice(p.shippingCost)}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center border border-[#BCE3C9] rounded-[5px] overflow-hidden bg-white">
                              <button
                                onClick={() => handleQtyChange(p.id, Math.max(1, p.qty - 1))}
                                disabled={p.qty <= 1}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                              >
                                <Minus size={13} className="text-gray-600" strokeWidth={2} />
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-[#186737]">
                                {p.qty}
                              </span>
                              <button
                                onClick={() => handleQtyChange(p.id, Math.min(99, p.qty + 1))}
                                disabled={p.qty >= 99}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                              >
                                <Plus size={13} className="text-gray-600" strokeWidth={2} />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-gray-900">
                                ${fmtPrice(p.price * p.qty)}
                              </span>
                              <button
                                onClick={() => handleRemove(p.id)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Add More Products */}
                <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold px-4 py-2 rounded-[7px] transition-colors duration-200"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    Add More Products
                  </Link>
                </div>
              </section>

              {/* Notes */}
              <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-sm">
                    Add notes to horecastore{" "}
                    <span className="text-gray-400 font-normal text-xs">(optional)</span>
                  </h2>
                </div>
                <div className="p-5">
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-[7px] border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 resize-none bg-white"
                    placeholder="Add special instruction or notes for our team..."
                    value={form.notes}
                    onChange={set("notes")}
                  />
                </div>
              </section>
            </div>

            {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
            <div className="sticky top-24 space-y-4">
              {/* Quote Summary */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-sm">
                    Quote Summary
                  </h2>
                </div>

                <div className="p-5 space-y-3">
                  {/* Line items */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        $ {fmtPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-semibold text-gray-900">
                        $ {fmtPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-500 flex items-center gap-1">
                        Tax ({(TAX_RATE * 100).toFixed(2)}%)
                        <Info size={12} className="text-gray-300" />
                      </span>
                      <span className="font-semibold text-gray-900">
                        $ {fmtPrice(tax)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-sm">
                      Grand Total
                    </span>
                    <span className="font-bold text-gray-900 text-xl">
                      $ {fmtPrice(grandTotal)}
                    </span>
                  </div>

                  {/* Quote validity note */}
                  <div className="flex items-start gap-1.5 bg-gray-50 rounded-[7px] p-2.5">
                    <Info size={12} className="text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      This quote is valid for{" "}
                      <span className="font-semibold text-gray-700">7 days</span>{" "}
                      from the date of creation.
                    </p>
                  </div>

                  {/* CTAs */}
                  <button
                    onClick={handleGenerate}
                    className={`w-full py-3 rounded-[7px] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                      submitted
                        ? "bg-emerald-600 text-white"
                        : "bg-[#186737] hover:bg-[#145c30] text-white"
                    }`}
                  >
                    <FileText size={15} />
                    {submitted ? "Quotation Sent!" : "Generate & Email Quotation"}
                  </button>

                  <button className="w-full py-3 rounded-[7px] font-semibold text-sm flex items-center justify-center gap-2 border border-[#186737] text-[#186737] hover:bg-[#f0f9f4] transition-colors duration-200">
                    <ShoppingCart size={15} />
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0f9f4] border-2 border-[#c3e6d4] flex items-center justify-center shrink-0">
                      <MessageCircle size={16} className="text-[#186737]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Need Help Placing Order
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Our Customer Success Team will guide you with every step.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors duration-200">
                      <MessageCircle size={13} />
                      Chat Now
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors duration-200">
                      <Phone size={13} />
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
