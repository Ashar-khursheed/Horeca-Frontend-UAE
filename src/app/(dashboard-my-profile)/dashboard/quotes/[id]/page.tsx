"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import CTA from "@/components/cta";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuoteAccessoryCharge {
  id: number;
  accessory_item_id: number;
  accessory_item_name: { en: string };
  accessory_item_price: string;
  product_accessory_id: number;
  product_accessory_name: { en: string };
  amount: string;
}

interface ApiQuoteProduct {
  id: number;
  quantity: number;
  unit_price: string;
  shipping_charge: string;
  accessory_item_charge?: string;
  accessory_charges?: QuoteAccessoryCharge[];
  product_supplier: { delivery_days: string; return_policy: string };
  expected_shipping_date: string;
  product: {
    id: number;
    sku: string;
    name: { en: string };
    image_urls: { en: string[] };
    brand?: { name: { en: string } };
    warranty_attribute?: { en: string };
  };
}

interface ApiQuoteDetail {
  id: number;
  quote_number: string;
  company_name: string | null;
  customer_address: string;
  shipping_charge: string;
  is_lift_gate: number;
  is_residential_address: number;
  is_inside_delivery: number;
  amount: string;
  tax_percentage: string;
  tax_amount: string;
  coupon_id: number | null;
  discount: string;
  payment_mode: string;
  additional_discount_amount: string;
  total_amount: string;
  total_products: number;
  status: string;
  expired_at: string;
  created_at: string;
  currency: {
    source_title: string;
    source_symbol: string;
    target_title: string;
    target_symbol: string;
    conversion_rate: number;
  };
  customer: {
    name: string;
    email: string;
    type: string;
    country_code: string;
    mobile_number: string;
  };
  quote_products: ApiQuoteProduct[];
  quote_emails: { id: number; email: string }[];
}

interface QuoteDetailResponse {
  success: boolean;
  data: ApiQuoteDetail;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<
  string,
  { bg: string; text: string; border: string; dot: string; icon: React.ElementType }
> = {
  Pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", icon: Clock },
  Accepted: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle },
  Converted: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle },
  Rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500", icon: X },
  Cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500", icon: X },
  Expired: { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", dot: "bg-gray-400", icon: AlertCircle },
};
const DEFAULT_SC = { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", dot: "bg-gray-400", icon: FileText };

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatDate(str: string) {
  if (!str) return "";
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return str;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function QuoteDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [quote, setQuote] = useState<ApiQuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await makeApiRequest<QuoteDetailResponse>(`${apiUrls.QUOTES}/${id}`);
        if (res.success) setQuote(res.data);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDownload = async () => {
    if (!quote) return;
    setDownloading(true);
    try {
      const blob = await makeApiRequest<Blob>(apiUrls.QUOTE_DOWNLOAD_PDF(quote.id), {
        responseType: "blob",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${quote.quote_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // non-fatal
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error || !quote) return <ErrorState />;

  const sc = STATUS_CFG[quote.status] ?? DEFAULT_SC;
  const StatusIcon = sc.icon;

  const subtotal = Number(quote.amount);
  const discount = Number(quote.discount) + Number(quote.additional_discount_amount ?? 0);
  const shipping = Number(quote.shipping_charge);
  const tax = Number(quote.tax_amount);
  const taxPercentage = Number(quote.tax_percentage);
  const total = Number(quote.total_amount);
  const liftFee = quote.is_lift_gate === 1 ? 75 : 0;
  const resFee = quote.is_residential_address === 1 ? 199 : 0;
  const insideFee = quote.is_inside_delivery === 1 ? 249 : 0;

  const addressLines = (quote.customer_address ?? "").split(/\\n|\n/).filter(Boolean);
  const sym = quote.currency?.target_symbol ?? "$";

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard/quotes" className="hover:text-[#186737] transition-colors">My Quotes</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Quote #{quote.quote_number}</span>
      </nav>

      {/* Quote Header */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard/quotes"
              className="w-9 h-9 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all shrink-0 mt-0.5"
            >
              <ArrowLeft size={15} />
            </Link>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">Quote #{quote.quote_number}</h1>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {quote.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Created on {formatDate(quote.created_at)}
                <span className="mx-2 text-gray-200">|</span>
                Expires: <span className="font-semibold text-gray-600">{formatDate(quote.expired_at)}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[7px] text-sm font-semibold bg-[#186737] text-white hover:bg-[#145c30] transition-all shadow-sm shadow-[#186737]/20 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {downloading ? (
              <><Loader2 size={14} className="animate-spin" /> Generating…</>
            ) : (
              <><Download size={14} /> Download Quote</>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5 items-start">
        {/* LEFT */}
        <div className="space-y-5">
          {/* Quote Items */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Quote Items</h2>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                {quote.quote_products.length} item{quote.quote_products.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {quote.quote_products.map((item) => {
                const name = item.product.name?.en ?? "";
                const image = item.product.image_urls?.en?.[0] ?? "";
                const brand = item.product.brand?.name?.en ?? "";
                const warranty = item.product.warranty_attribute?.en ?? "";
                const deliveryDays = item.product_supplier?.delivery_days ?? "";
                const lineTotal = Number(item.unit_price) * item.quantity;
                const accessories = item.accessory_charges ?? [];
                const accessoryTotal = Number(item.accessory_item_charge ?? 0);

                return (
                  <div key={item.id} className="p-5 flex gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="w-[72px] h-[72px] shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://placehold.co/72x72/f3f4f6/9ca3af?text=No+Img";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{name}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                            {brand && <span className="text-xs font-bold text-[#186737]">{brand}</span>}
                            <span className="text-[11px] text-gray-400">
                              SKU: <span className="font-mono text-gray-500">{item.product.sku}</span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                            {warranty && (
                              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                <Shield size={10} className="text-[#186737] shrink-0" />
                                {warranty}
                              </span>
                            )}
                            {deliveryDays && (
                              <span className="text-[11px] text-gray-400">Ships in {deliveryDays}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Qty: {item.quantity}
                            </span>
                          </div>

                          {accessories.length > 0 && (
                            <div className="mt-3 border border-gray-100 rounded-[7px] bg-gray-50/60 divide-y divide-gray-100">
                              <p className="px-3 py-1.5 text-[11px] font-bold text-gray-500">Accessories</p>
                              {accessories.map((acc) => (
                                <div key={acc.id} className="flex items-center justify-between gap-3 px-3 py-1.5">
                                  <span className="text-[11px] text-gray-600">
                                    <span className="text-gray-400">{acc.product_accessory_name?.en}:</span>{" "}
                                    {acc.accessory_item_name?.en?.replace(/^"|"$/g, "")}
                                  </span>
                                  <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">
                                    {sym}{fmt(Number(acc.amount))}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-base font-bold text-gray-900">
                            {sym}{fmt(lineTotal + accessoryTotal)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {sym}{fmt(Number(item.unit_price))} each
                            </p>
                          )}
                          {accessoryTotal > 0 && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              incl. {sym}{fmt(accessoryTotal)} accessories
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Items Subtotal</span>
              <span className="text-sm font-bold text-gray-900">{sym}{fmt(subtotal)}</span>
            </div>
          </div>

          {/* Customer + Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <User size={13} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Customer</h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">{quote.customer?.name}</p>
                  {quote.company_name && (
                    <p className="text-xs text-[#186737] font-semibold mt-0.5">{quote.company_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Mail size={11} className="text-gray-400 shrink-0" />
                    {quote.customer?.email}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Phone size={11} className="text-gray-400 shrink-0" />
                    {quote.customer?.country_code} {quote.customer?.mobile_number}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <MapPin size={13} className="text-[#186737]" />
                <h3 className="font-bold text-gray-900 text-sm">Shipping Address</h3>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {addressLines.length > 0
                    ? addressLines.map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < addressLines.length - 1 && <br />}
                        </span>
                      ))
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5 lg:sticky lg:top-6">
          {/* Quote Summary */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <FileText size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Quote Summary</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-2.5">
                <SummaryRow label="Subtotal" value={`${sym}${fmt(subtotal)}`} />
                {discount > 0 && (
                  <SummaryRow label="Discount" value={`-${sym}${fmt(discount)}`} green />
                )}
                {shipping > 0 && (
                  <SummaryRow label="Shipping" value={`${sym}${fmt(shipping)}`} />
                )}
                {quote.is_lift_gate === 1 && <SummaryRow label="Lift Gate Service" value={`${sym}${fmt(liftFee)}`} />}
                {quote.is_residential_address === 1 && <SummaryRow label="Residential Address" value={`${sym}${fmt(resFee)}`} />}
                {quote.is_inside_delivery === 1 && <SummaryRow label="Inside Delivery" value={`${sym}${fmt(insideFee)}`} />}
                {tax > 0 && (
                  <SummaryRow label={`VAT (${taxPercentage.toFixed(0)}%)`} value={`${sym}${fmt(tax)}`} />
                )}
              </div>

              <div className="border-t border-gray-100 pt-3.5 mt-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-black text-xl text-gray-900">{sym}{fmt(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Validity */}
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <CreditCard size={15} className="text-[#186737]" />
              <h2 className="font-bold text-gray-900 text-sm">Payment &amp; Validity</h2>
            </div>
            <div className="p-5 space-y-2.5">
              <DetailRow label="Payment Terms" value={quote.payment_mode} />
              <DetailRow label="Products" value={`${quote.total_products} item${quote.total_products !== 1 ? "s" : ""}`} />
              <DetailRow label="Created On" value={formatDate(quote.created_at)} />
              <DetailRow>
                <span className="text-xs text-gray-400 shrink-0 mt-0.5">Expires</span>
                <span className={`text-xs font-semibold ${quote.status === "Expired" ? "text-red-500" : "text-gray-800"}`}>
                  {formatDate(quote.expired_at)}
                </span>
              </DetailRow>
            </div>
          </div>

          <CTA />
        </div>
      </div>
    </div>
  );
}

// ── Loading Skeleton ───────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-64" />
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex gap-4">
          <div className="w-9 h-9 bg-gray-100 rounded-[7px]" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-56" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5">
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 bg-gray-100 rounded w-20" />
                <div className="h-3 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────────────────

function ErrorState() {
  return (
    <div className="p-4 sm:p-6 max-w-[1400px]">
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm py-20 text-center">
        <AlertCircle size={40} className="mx-auto text-red-200 mb-3" />
        <p className="text-sm font-semibold text-gray-400">Failed to load quote details</p>
        <Link href="/dashboard/quotes" className="mt-3 inline-block text-xs text-[#186737] hover:underline font-medium">
          Back to Quotes
        </Link>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${green ? "text-[#186737]" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

function DetailRow({ label, value, children }: { label?: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      {children ?? (
        <>
          <span className="text-xs text-gray-400 shrink-0 mt-0.5">{label}</span>
          <span className="text-xs font-semibold text-gray-800 text-right">{value}</span>
        </>
      )}
    </div>
  );
}
