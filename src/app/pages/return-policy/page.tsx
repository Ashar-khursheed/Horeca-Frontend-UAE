"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Gavel,
  HelpCircle,
  MessageCircle,
  Package,
  RefreshCw,
  RotateCcw,
  Shield,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";

// ─── Section config ────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "eligibility", label: "Return Eligibility", icon: CheckCircle },
  { id: "fees", label: "Fees & Freight", icon: Truck },
  { id: "non-returnable", label: "Non-Returnable Items", icon: Ban },
  { id: "process", label: "Return Process", icon: RefreshCw },
  { id: "damaged", label: "Damaged Shipments", icon: AlertTriangle },
  { id: "refunds", label: "Refunds", icon: RotateCcw },
  { id: "freight", label: "Freight Deliveries", icon: Package },
  { id: "cancellations", label: "Cancellations", icon: XCircle },
  { id: "legal", label: "Legal Disclaimer", icon: Gavel },
  { id: "sms", label: "SMS Terms", icon: MessageCircle },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ReturnPolicyPage() {
  const [active, setActive] = useState("eligibility");

  function handleNav(id: string) {
    setActive(id);
    scrollTo(id);
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#186737] font-bold text-sm hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">Return Policy</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="bg-linear-to-br from-[#186737] to-[#0f4523] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-[7px] bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <RotateCcw size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                HorecaStore Policy
              </p>
              <h1 className="text-2xl sm:text-3xl font-black mt-0.5">Easy Return Policy Guide</h1>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed max-w-3xl">
            HorecaStore's Return Policy explains how customers can return restaurant supplies, commercial kitchen equipment,
            and foodservice products that don't meet expectations. This policy covers what items are eligible for return,
            required conditions, and standard timeframes for submitting return requests.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { label: "Return Window", value: "Per Product", sub: "shown on product page" },
              { label: "0% Restocking Fee", value: "Within 7 Days", sub: "of delivery" },
              { label: "Refund Timeline", value: "7–10 Days", sub: "after inspection" },
              { label: "Damage Report", value: "Within 48 hrs", sub: "of delivery" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/15 rounded-[7px] px-4 py-3">
                <p className="text-white font-black text-base leading-none">{s.value}</p>
                <p className="text-white/80 text-xs font-semibold mt-1">{s.label}</p>
                <p className="text-white/50 text-[11px] mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body grid ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-7 items-start">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-6">
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <FileText size={13} className="text-[#186737]" />
                <span className="text-xs font-bold text-gray-900">Jump to Section</span>
              </div>
              <nav className="p-2">
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[7px] text-left text-sm transition-all group ${
                      active === id
                        ? "bg-[#f0f9f4] text-[#186737] font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      size={13}
                      className={`shrink-0 ${active === id ? "text-[#186737]" : "text-gray-400 group-hover:text-gray-600"}`}
                    />
                    {label}
                    {active === id && (
                      <ChevronRight size={12} className="ml-auto text-[#186737]" />
                    )}
                  </button>
                ))}
              </nav>

              {/* Contact CTA */}
              <div className="mx-3 mb-3 p-3 bg-[#f0f9f4] border border-[#c3e6d4] rounded-[7px]">
                <p className="text-xs font-bold text-gray-900">Questions?</p>
                <p className="text-[11px] text-gray-500 mt-0.5 mb-2">Our support team is ready to help.</p>
                <Link
                  href="/pages/contact-us"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-[7px] bg-[#186737] text-white text-xs font-semibold hover:bg-[#145c30] transition-colors"
                >
                  <HelpCircle size={11} />
                  Contact Support
                </Link>
              </div>
            </div>
          </aside>

          {/* ── Content ──────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Intro banner */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[7px] bg-[#f0f9f4] border border-[#c3e6d4] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield size={16} className="text-[#186737]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">How to Initiate a Return or Exchange</h2>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1.5">
                    At HorecaStore, we aim to ensure every product reaches you in excellent condition. We understand that
                    returns may occasionally be necessary. This policy applies to{" "}
                    <strong className="text-gray-800">all HorecaStore customers</strong> — including restaurants, hotels,
                    catering businesses, and individual buyers — and is designed to provide clarity, fairness, and
                    protection.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mt-2">
                    Because we specialize in{" "}
                    <strong className="text-gray-800">commercial-grade products</strong>, our return terms reflect
                    standard practices in the B2B food service supply industry.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Section 1: Return Eligibility ────────────────────────── */}
            <PolicyCard
              id="eligibility"
              icon={CheckCircle}
              title="Return Eligibility by Product"
              color="green"
              onVisible={setActive}
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                Each product has its own <strong className="text-gray-800">return window</strong>, which is clearly
                displayed on the product page. Products may have different return periods based on category (e.g.,
                perishables, equipment, made-to-order, custom-made, or disposables).
              </p>

              <InfoBox color="green" className="mt-4">
                To qualify for a return, the request must be{" "}
                <strong>initiated before the return period expires</strong> and can be requested{" "}
                <strong>directly from your HorecaStore account or profile page</strong>.
              </InfoBox>

              <p className="text-sm font-semibold text-gray-900 mt-4 mb-3">Returned items must be:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: Package, text: "Unused and uninstalled" },
                  { icon: ShoppingBag, text: "In original packaging with all parts, manuals & accessories" },
                  { icon: CheckCircle, text: "In resalable condition" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-[7px] border border-gray-100">
                    <Icon size={14} className="text-[#186737] shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </PolicyCard>

            {/* ── Section 2: Fees & Freight ─────────────────────────────── */}
            <PolicyCard
              id="fees"
              icon={Truck}
              title="Return Fees & Freight Responsibility"
              color="blue"
              onVisible={setActive}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Within 7 days */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-[7px] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={14} className="text-emerald-600 shrink-0" />
                    <p className="text-xs font-bold text-emerald-800">Returns within 7 days of delivery</p>
                  </div>
                  <ul className="space-y-2">
                    <FeeRow icon="check" text={<><strong>0% restocking fee</strong></>} />
                    <FeeRow icon="info" text="Freight charges may still apply if HorecaStore did not make an error" />
                  </ul>
                </div>

                {/* After 7 days */}
                <div className="bg-amber-50 border border-amber-200 rounded-[7px] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                    <p className="text-xs font-bold text-amber-800">Returns after 7 days (within window)</p>
                  </div>
                  <ul className="space-y-2">
                    <FeeRow icon="warn" text={<><strong>15% restocking fee applies</strong></>} />
                    <FeeRow icon="warn" text={<><strong>Return freight arranged & paid by customer</strong></>} />
                  </ul>
                </div>
              </div>

              <InfoBox color="red" className="mt-4">
                Unauthorized or late returns may be <strong>refused or discarded with no refund issued</strong>.
              </InfoBox>
            </PolicyCard>

            {/* ── Section 3: Non-Returnable ─────────────────────────────── */}
            <PolicyCard
              id="non-returnable"
              icon={Ban}
              title="Non-Returnable Items"
              color="red"
              onVisible={setActive}
            >
              <p className="text-sm text-gray-600 mb-4">
                The following items are <strong className="text-gray-800">final sale and cannot be returned</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Perishable food and beverage products",
                  "Made-to-order or custom-manufactured items",
                  "Opened packaging or installed equipment",
                  "Hygiene-related products (e.g., disposables, gloves, linens)",
                  "Clearance or discontinued items",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-[7px]">
                    <XCircle size={13} className="text-red-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </PolicyCard>

            {/* ── Section 4: Return Process ─────────────────────────────── */}
            <PolicyCard
              id="process"
              icon={RefreshCw}
              title="Return Process"
              color="green"
              onVisible={setActive}
            >
              <div className="space-y-3">
                {[
                  {
                    step: "1",
                    title: "Go to your account",
                    desc: "Log in to your HorecaStore account and view your order history.",
                  },
                  {
                    step: "2",
                    title: "Select the item",
                    desc: "Choose the item you want to return and follow the on-screen steps.",
                  },
                  {
                    step: "3",
                    title: "Await approval",
                    desc: "If approved, you will receive a Return Merchandise Authorization (RMA) and instructions with the return shipping address.",
                  },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 p-4 bg-gray-50 border border-gray-100 rounded-[7px]">
                    <div className="w-8 h-8 rounded-full bg-[#186737] text-white text-sm font-black flex items-center justify-center shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <InfoBox color="amber" className="mt-4">
                <strong>Note:</strong> Returns without an RMA may be rejected.
              </InfoBox>
            </PolicyCard>

            {/* ── Section 5: Damaged or Incorrect ──────────────────────── */}
            <PolicyCard
              id="damaged"
              icon={AlertTriangle}
              title="Damaged or Incorrect Shipments"
              color="amber"
              onVisible={setActive}
            >
              <InfoBox color="amber" className="mb-4">
                Damage or order issues must be reported within{" "}
                <strong>48 hours</strong> of delivery.
              </InfoBox>

              <p className="text-sm font-semibold text-gray-900 mb-3">Please include in your report:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: FileText, text: "Order number" },
                  { icon: AlertTriangle, text: "Clear photos of the damage & packaging" },
                  { icon: MessageCircle, text: "A description of the issue" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-[7px]">
                    <Icon size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-600 mt-4">
                If eligible, we may offer a <strong className="text-gray-800">replacement, refund, or credit</strong>.
              </p>
            </PolicyCard>

            {/* ── Section 6: Refunds ────────────────────────────────────── */}
            <PolicyCard
              id="refunds"
              icon={RotateCcw}
              title="Refunds"
              color="green"
              onVisible={setActive}
            >
              <div className="space-y-3">
                {[
                  {
                    icon: Clock,
                    text: (
                      <>
                        Refunds are processed within{" "}
                        <strong className="text-gray-800">7–10 business days</strong> after we receive and inspect
                        the returned item.
                      </>
                    ),
                  },
                  {
                    icon: Truck,
                    text: "Shipping charges and restocking fees (if applicable) will be deducted.",
                  },
                  {
                    icon: CheckCircle,
                    text: (
                      <>
                        Refunds are issued to the{" "}
                        <strong className="text-gray-800">original payment method only</strong>.
                      </>
                    ),
                  },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 bg-gray-50 border border-gray-100 rounded-[7px]">
                    <Icon size={14} className="text-[#186737] shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </PolicyCard>

            {/* ── Section 7: Freight ────────────────────────────────────── */}
            <PolicyCard
              id="freight"
              icon={Package}
              title="Freight Deliveries"
              color="blue"
              onVisible={setActive}
            >
              <p className="text-sm text-gray-600 mb-4">For items shipped by freight:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { text: "Items must be unused and in original crating", warn: false },
                  { text: "Freight returns must be arranged and paid for by the customer", warn: true },
                  { text: "Inside delivery, liftgate, and accessorial fees are non-refundable", warn: true },
                  { text: "All freight returns are inspected before refunds are issued", warn: false },
                ].map(({ text, warn }) => (
                  <div
                    key={text}
                    className={`flex items-start gap-2.5 p-3 rounded-[7px] border ${
                      warn
                        ? "bg-amber-50 border-amber-100"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    {warn ? (
                      <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle size={13} className="text-[#186737] shrink-0 mt-0.5" />
                    )}
                    <span className="text-xs text-gray-700 leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </PolicyCard>

            {/* ── Section 8: Cancellations ──────────────────────────────── */}
            <PolicyCard
              id="cancellations"
              icon={XCircle}
              title="Order Cancellations After Shipment"
              color="red"
              onVisible={setActive}
            >
              <InfoBox color="red">
                Orders cannot be canceled once a shipment is in transit. Refused shipments will incur{" "}
                <strong>return freight charges and up to a 25% restocking fee</strong>.
              </InfoBox>
            </PolicyCard>

            {/* ── Section 9: Legal ──────────────────────────────────────── */}
            <PolicyCard
              id="legal"
              icon={Gavel}
              title="Legal Disclaimer"
              color="blue"
              onVisible={setActive}
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                This policy is governed by the{" "}
                <strong className="text-gray-800">laws of the State of Texas</strong>. By using HorecaStore and
                placing an order, you agree to these terms. HorecaStore reserves the right to update or amend this
                policy at any time.
              </p>
            </PolicyCard>

            {/* ── Section 10: SMS Terms ─────────────────────────────────── */}
            <PolicyCard
              id="sms"
              icon={MessageCircle}
              title="Terms of Service – HorecaStore Promo Buzz"
              color="green"
              onVisible={setActive}
            >
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Program Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    HorecaStore Promo Buzz sends you SMS updates including promotions, exclusive deals, order
                    notifications, product alerts, reminders, and other service-related messages when you opt in.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">How to Unsubscribe</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    You can cancel the SMS service at any time. Just text{" "}
                    <span className="inline-flex items-center font-mono font-bold text-[#186737] bg-[#f0f9f4] border border-[#c3e6d4] px-2 py-0.5 rounded text-xs">
                      STOP
                    </span>{" "}
                    to the short code. After sending "STOP", you'll receive a confirmation SMS and will no longer
                    receive messages. To re-subscribe, simply sign up again as you did the first time.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Reply with{" "}
                    <span className="inline-flex items-center font-mono font-bold text-[#186737] bg-[#f0f9f4] border border-[#c3e6d4] px-2 py-0.5 rounded text-xs">
                      HELP
                    </span>{" "}
                    for assistance, or contact us directly at{" "}
                    <a
                      href="mailto:sales@thehorecastore.com"
                      className="text-[#186737] font-semibold hover:underline"
                    >
                      sales@thehorecastore.com
                    </a>
                    .
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-gray-100">
                  {[
                    "Carriers are not liable for delayed or undelivered messages.",
                    "Message and data rates may apply. Contact your wireless provider for details.",
                  ].map((t) => (
                    <p key={t} className="text-xs text-gray-500 leading-relaxed">
                      {t}
                    </p>
                  ))}
                  <p className="text-xs text-gray-500 leading-relaxed">
                    For privacy inquiries, read our{" "}
                    <a
                      href="https://www.thehorecastore.com/pages/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#186737] font-semibold hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </PolicyCard>

            {/* ── Bottom CTA ─────────────────────────────────────────────── */}
            <div className="bg-linear-to-br from-[#186737] to-[#0f4523] rounded-[7px] p-6 text-white text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
                <HelpCircle size={20} className="text-white" />
              </div>
              <h3 className="text-base font-bold">Still have questions?</h3>
              <p className="text-white/70 text-sm mt-1 mb-4">
                Our support team is happy to help you with any return or policy questions.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/pages/contact-us"
                  className="px-5 py-2.5 rounded-[7px] bg-white text-[#186737] text-sm font-bold hover:bg-gray-100 transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="px-5 py-2.5 rounded-[7px] border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  View My Orders
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const COLOR_MAP = {
  green: { header: "bg-[#f0f9f4] border-[#c3e6d4]", icon: "text-[#186737]", dot: "bg-[#186737]" },
  blue:  { header: "bg-blue-50 border-blue-200",     icon: "text-blue-600",   dot: "bg-blue-600" },
  red:   { header: "bg-red-50 border-red-200",        icon: "text-red-600",    dot: "bg-red-600" },
  amber: { header: "bg-amber-50 border-amber-200",    icon: "text-amber-600",  dot: "bg-amber-500" },
};

function PolicyCard({
  id,
  icon: Icon,
  title,
  color,
  children,
  onVisible,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  color: keyof typeof COLOR_MAP;
  children: React.ReactNode;
  onVisible: (id: string) => void;
}) {
  const c = COLOR_MAP[color];

  return (
    <section
      id={id}
      className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden scroll-mt-6"
    >
      {/* Section header */}
      <div className={`px-5 py-4 border-b ${c.header} flex items-center gap-3`}>
        <div className={`w-8 h-8 rounded-[7px] bg-white border flex items-center justify-center shrink-0 ${c.header}`}>
          <Icon size={15} className={c.icon} />
        </div>
        <h2 className="font-bold text-gray-900 text-base">{title}</h2>
        <span className={`ml-auto w-2 h-2 rounded-full ${c.dot}`} />
      </div>

      {/* Content */}
      <div className="p-5">{children}</div>
    </section>
  );
}

function InfoBox({
  color,
  children,
  className,
}: {
  color: "green" | "red" | "amber" | "blue";
  children: React.ReactNode;
  className?: string;
}) {
  const map = {
    green: { bg: "bg-[#f0f9f4]", border: "border-[#c3e6d4]", text: "text-[#186737]", icon: CheckCircle },
    red:   { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",   icon: XCircle },
    amber: { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700", icon: AlertTriangle },
    blue:  { bg: "bg-blue-50",   border: "border-blue-100",   text: "text-blue-700",  icon: Shield },
  };
  const s = map[color];
  const BoxIcon = s.icon;

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-[7px] border ${s.bg} ${s.border} ${className ?? ""}`}>
      <BoxIcon size={14} className={`${s.text} shrink-0 mt-0.5`} />
      <p className={`text-sm leading-relaxed ${s.text}`}>{children}</p>
    </div>
  );
}

function FeeRow({
  icon,
  text,
}: {
  icon: "check" | "warn" | "info";
  text: React.ReactNode;
}) {
  const map = {
    check: { color: "text-emerald-600", el: CheckCircle },
    warn:  { color: "text-amber-600",   el: AlertTriangle },
    info:  { color: "text-blue-500",    el: Shield },
  };
  const { color, el: El } = map[icon];

  return (
    <li className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
      <El size={12} className={`${color} shrink-0 mt-0.5`} />
      <span>{text}</span>
    </li>
  );
}
