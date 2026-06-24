"use client";

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
  Info,
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
import SEOMainContent from "@/seo/seo-main-content";
import type { NavPage, ParsedContent, ContentSection } from "./page";
import Breadcrumb from "@/components/breadcum";
import CTA from "@/components/cta";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  title: string;
  parsedContent: ParsedContent;
  navPages: NavPage[];
  currentSlug: string;
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function getHeroIcon(title: string): React.ElementType {
  const t = title.toLowerCase();
  if (t.includes("return")) return RotateCcw;
  if (t.includes("refund")) return RotateCcw;
  if (t.includes("ship")) return Truck;
  if (t.includes("cancel")) return XCircle;
  if (t.includes("privacy")) return Shield;
  if (t.includes("warranty")) return CheckCircle;
  if (t.includes("vendor") || t.includes("supplier")) return ShoppingBag;
  if (t.includes("contact")) return MessageCircle;
  return FileText;
}

function getNavIcon(title: string): React.ElementType {
  const t = title.toLowerCase();
  if (t.includes("return")) return RotateCcw;
  if (t.includes("refund")) return RotateCcw;
  if (t.includes("ship")) return Truck;
  if (t.includes("cancel")) return XCircle;
  if (t.includes("privacy")) return Shield;
  if (t.includes("warranty")) return CheckCircle;
  if (t.includes("vendor") || t.includes("supplier")) return ShoppingBag;
  if (t.includes("contact")) return MessageCircle;
  return FileText;
}

type CardColor = "green" | "amber" | "red" | "blue" | "purple";

interface CardTheme {
  header: string;
  border: string;
  icon: string;
  iconBg: string;
  dot: string;
}

const CARD_THEMES: Record<CardColor, CardTheme> = {
  green:  { header: "from-[#f0f9f4] to-white", border: "border-[#c3e6d4]",  icon: "text-[#186737]", iconBg: "bg-[#f0f9f4] border-[#c3e6d4]",  dot: "bg-[#186737]" },
  amber:  { header: "from-amber-50 to-white",   border: "border-amber-200",  icon: "text-amber-600", iconBg: "bg-amber-50 border-amber-200",   dot: "bg-amber-500" },
  red:    { header: "from-red-50 to-white",      border: "border-red-200",    icon: "text-red-600",   iconBg: "bg-red-50 border-red-200",       dot: "bg-red-500" },
  blue:   { header: "from-blue-50 to-white",     border: "border-blue-200",   icon: "text-blue-600",  iconBg: "bg-blue-50 border-blue-200",     dot: "bg-blue-500" },
  purple: { header: "from-purple-50 to-white",   border: "border-purple-200", icon: "text-purple-600",iconBg: "bg-purple-50 border-purple-200",  dot: "bg-purple-500" },
};

function getSectionMeta(title: string): { icon: React.ElementType; color: CardColor } {
  const t = title.toLowerCase();
  if (t.includes("eligib") || t.includes("overview") || t.includes("guide")) return { icon: CheckCircle,    color: "green" };
  if (t.includes("fee") || t.includes("freight"))                              return { icon: Truck,          color: "amber" };
  if (t.includes("non-return") || t.includes("non-cancellable"))               return { icon: Ban,            color: "red" };
  if (t.includes("process") || t.includes("how to"))                           return { icon: RefreshCw,      color: "green" };
  if (t.includes("damage") || t.includes("incorrect") || t.includes("loss"))  return { icon: AlertTriangle,  color: "amber" };
  if (t.includes("refund") || t.includes("timeline"))                          return { icon: RotateCcw,      color: "green" };
  if (t.includes("freight") && !t.includes("fee"))                             return { icon: Package,        color: "blue" };
  if (t.includes("cancel"))                                                     return { icon: XCircle,        color: "red" };
  if (t.includes("legal") || t.includes("disclaimer"))                         return { icon: Gavel,          color: "blue" };
  if (t.includes("sms") || t.includes("promo") || t.includes("terms of"))     return { icon: MessageCircle,  color: "purple" };
  if (t.includes("ship"))                                                       return { icon: Truck,          color: "blue" };
  if (t.includes("warranty") || t.includes("repair") || t.includes("claim"))  return { icon: Shield,         color: "green" };
  if (t.includes("vendor") || t.includes("supplier"))                          return { icon: ShoppingBag,    color: "green" };
  if (t.includes("payment") || t.includes("invoice"))                          return { icon: Clock,          color: "amber" };
  if (t.includes("termination"))                                                return { icon: XCircle,        color: "red" };
  if (t.includes("privacy") || t.includes("data") || t.includes("security"))  return { icon: Shield,         color: "blue" };
  if (t.includes("cookies") || t.includes("tracking"))                         return { icon: Info,           color: "blue" };
  return { icon: FileText, color: "green" };
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ section }: { section: ContentSection }) {
  const { icon: Icon, color } = getSectionMeta(section.title);
  const theme = CARD_THEMES[color];

  return (
    <div
      id={section.id}
      className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden scroll-mt-4"
    >
      <div className={`px-5 py-4 border-b ${theme.border} bg-linear-to-r ${theme.header} flex items-center gap-3`}>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${theme.iconBg}`}>
          <Icon size={14} className={theme.icon} />
        </div>
        <h2 className="font-bold text-gray-900 text-[15px] leading-snug flex-1">{section.title}</h2>
        <span className={`w-2 h-2 rounded-full shrink-0 ${theme.dot}`} />
      </div>
      <div
        className="px-5 py-5 sm:px-6 policy-prose"
        dangerouslySetInnerHTML={{ __html: section.body }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PolicyPageContent({
  title,
  parsedContent,
  navPages,
  currentSlug,
}: Props) {
  const { introHtml, sections } = parsedContent;
  const HeroIcon = getHeroIcon(title);
 const slugToLabel = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
 const crumbs = [
    { label: "Home", href: "/" },
    { label: slugToLabel(currentSlug), href: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      {/* <div className="bg-white border-b border-gray-100">
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
            <span className="text-gray-700 font-medium">{title}</span>
          </nav>
        </div>
      </div> */}

      <Breadcrumb  crumbs={crumbs}/>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="bg-linear-to-br from-[#186737] via-[#1a7a40] to-[#0f4523] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-[7px] bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                <HeroIcon size={20} className="text-white" />
              </div>
              <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                HorecaStore · Legal & Policies
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight">
              {title}
            </h1>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">
              Please read this policy carefully. It outlines your rights and our responsibilities as a hospitality supply provider.
            </p>
            {/* Section count pill */}
            {sections.length > 0 && (
              <div className="mt-5 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
                <FileText size={12} className="text-white/70" />
                <span className="text-white/80 text-xs font-medium">
                  {sections.length} sections
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <div className="flex flex-col lg:flex-row gap-8 items-start ">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="w-full lg:w-80 shrink-0 sticky top-6 space-y-3">

            {/* Policy navigation */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <FileText size={12} className="text-[#186737]" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">All Policies</span>
              </div>
              <nav className="p-1.5">
                {navPages.map(({ id, title: pageTitle, slug }) => {
                  const Icon = getNavIcon(pageTitle);
                  const isActive = slug === currentSlug;
                  return (
                    <Link
                      key={id}
                      href={`/pages/${slug}`}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                        isActive
                          ? "bg-[#186737] text-white font-semibold shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        size={13}
                        className={`shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                      />
                      <span className="truncate leading-snug">{pageTitle}</span>
                      {isActive && <ChevronRight size={12} className="ml-auto shrink-0 opacity-80" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* In-page sections quick-jump */}
            {sections.length > 0 && (
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <Info size={12} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">On this page</span>
                </div>
                <nav className="p-1.5">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        const el = document.getElementById(s.id);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                      <span className="truncate">{s.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Contact CTA */}
           
            <CTA/>
          </aside>

          {/* ── Content ──────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Intro block (title h2s + intro paragraphs) → SEOMainContent */}
            {introHtml && (
              <SEOMainContent htmlContent={introHtml} />
            )}

            {/* Section cards */}
            {sections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}

            {/* Bottom CTA */}
            <div className="bg-linear-to-br from-[#186737] to-[#0f4523] rounded-[7px] p-8 text-white text-center mt-2">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
                <HelpCircle size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold">Still have questions?</h3>
              <p className="text-white/70 text-sm mt-2 mb-5 max-w-xs mx-auto leading-relaxed">
                Our support team is available to help clarify any part of this policy.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/pages/contact-us"
                  className="px-6 py-2.5 rounded-lg bg-white text-[#186737] text-sm font-bold hover:bg-gray-100 transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
