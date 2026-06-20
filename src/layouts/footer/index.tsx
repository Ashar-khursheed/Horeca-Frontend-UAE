
"use client";

import FinancingModal from "@/components/financing-modal";
import { ApiCategory, ApiCategoryName } from "@/features/category";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import NewsletterForm from "./newsletter-form";

const getName = (name: ApiCategoryName | string, locale: string): string => {
  if (typeof name === "string") return name;
  return locale === "ar" ? (name.ar || name.en) : (name.en || name.ar);
};

interface LinkItem {
  label: string;
  href: string;
  isModal?: boolean;
  modalTitle?: string;
}

const QUICK_LINKS: LinkItem[] = [
  { label: "About Us", href: "/pages/about-us" },
  { label: "Starting a Restaurant?", href: "/starting-a-restaurant" },
  { label: "Financing Options", href: "#", isModal: true, modalTitle: "Financing Options" },
  { label: "Request a Quote", href: "#", isModal: true, modalTitle: "Request a Quote" },
  { label: "Track Your Order", href: "/track-order" },
  { label: "Returns & Refunds", href: "/pages/return-policy" },
  { label: "Warranty Info", href: "/pages/extended-warranty" },
  { label: "Blog & Resources", href: "/blog" },
];

const SUPPORT_LINKS: LinkItem[] = [
  { label: "Help Center", href: "/pages/contact-us" },
  // { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faq" },
  { label: "Shipping Policy", href: "/pages/shipping-policy" },
  { label: "Terms of Service", href: "/pages/cancellation-policy" },
  { label: "Privacy Policy", href: "/pages/privacy-policy" },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

// ─── Category Accordion (Mobile) ─────────────────────────────────────────────
const CategoryAccordion = ({ category, locale }: { category: ApiCategory; locale: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-semibold text-gray-800">{getName(category.name, locale)}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#186737]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="pb-3 pl-2 flex flex-col gap-1.5">
          {category.children?.map((child) => (
            <Link
              key={child.id}
              href={`/${category.slug}/${child.slug}`}
              className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
            >
              {getName(child.name, locale)}
            </Link>
          ))}
          <Link
            href={`/${category.slug}`}
            className="text-[12px] font-semibold text-[#186737] flex items-center gap-1 mt-1"
          >
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
};

// ─── Links Accordion (Mobile) — Quick Links & Support ────────────────────────
const LinksAccordion = ({
  title,
  links,
  onModalOpen,
}: {
  title: string;
  links: LinkItem[];
  onModalOpen?: (title: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#186737]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="pb-3 pl-2 flex flex-col gap-2">
          {links.map((link) =>
            link.isModal ? (
              <button
                key={link.label}
                onClick={() => onModalOpen?.(link.modalTitle ?? link.label)}
                className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors text-left"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Footer ──────────────────────────────────────────────────────────────
export const Footer = ({ navItemData }: { navItemData: ApiCategory[] }) => {
  const locale = useLocale();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (title: string) => {
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <>
    <footer className="bg-white border-t border-gray-100">

      {/* ── Top CTA Banner ── */}
      <div className="bg-[#f3f4f8] ">
        <div className="global-container py-8 sm:py-10">
          <div className="flex flex-col md:flex-row flex-wrap items-center jmd:ustify-between justify-center md:gap-6">
            <div className="text-center sm:text-left">
              <p className="text-[#7e859b] text-sm font-medium tracking-wide uppercase mb-1 md:flex hidden">
                Need Help Getting Started?
              </p>
              <p className="text-[#7e859b] text-[12px] font-medium tracking-wide uppercase mb-1 md:hidden block">
            Our team is here to guide you with the best solutions for your restaurant.

              </p>
              <h2 className="text-black text-xl sm:text-2xl font-bold md:hidden block">
                Need Expert Assistance? 
              </h2>
              <h2 className="text-black text-xl sm:text-2xl font-bold md:block hidden">
                We're Always Here To Help
              </h2>
            </div>
            <div className="md:flex hidden flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a
                href="tel:+18664467322"
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-black px-5 py-3 rounded-[7px] transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-black" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[#7e859b] text-[15px] font-medium uppercase tracking-wide">Call Us</p>
                  <p className="text-black font-semibold text-base">+1 (866) 446-7322</p>
                </div>
              </a>
              <a
                href="mailto:support@thehorecastore.com"
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-5 py-3 rounded-[7px] transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-black" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[#7e859b] text-[15px] font-medium uppercase tracking-wide">Email Support</p>
                  <p className="text-black font-semibold text-base">support@thehorecastore.com</p>
                </div>
              </a>
            </div>

            <div className="block md:hidden ">
              {/* Mobile CTA Buttons */}
           <a href="tel:+18664467322" className="bg-[#186737] relative top-2.5 p-2.5 text-white 2xl:px-4 px-2.5 2xl:py-3 py-1.5 rounded  2xl:text-[14px] text-[12px] ">Talk to Our Expert Now</a>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP — Category Grid (md+)
      ══════════════════════════════════════════ */}
      <div className="global-container py-10 hidden md:block">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-8">
          {navItemData.slice(0, 5).map((cat, index) => (
            <div key={cat.id} className={index >= 3 ? "hidden lg:block" : ""}>
              <Link href={`/${cat.slug}`} className="group flex items-center gap-1 mb-4">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#186737] transition-colors">
                  {getName(cat.name, locale)}
                </h3>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#186737] transition-colors opacity-0 group-hover:opacity-100" />
              </Link>
              <ul className="flex flex-col gap-2">
                {cat.children?.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/${cat.slug}/${child.slug}`}
                      className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors leading-relaxed"
                    >
                      {getName(child.name, locale)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-[12px] font-semibold text-[#186737] flex items-center gap-1 mt-1 hover:underline"
                  >
                    View All <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE — All Accordions (< md)
      ══════════════════════════════════════════ */}
      <div className="global-container py-4 block md:hidden">

        {/* Categories */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-3 pb-1">
          Browse Categories
        </p>
        {navItemData.slice(0, 5).map((cat) => (
          <CategoryAccordion key={cat.id} category={cat} locale={locale} />
        ))}

        {/* Quick Links */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4 pb-1">
          Company
        </p>
        <LinksAccordion title="Quick Links" links={QUICK_LINKS} onModalOpen={openModal} />

        {/* Support */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4 pb-1">
          Help
        </p>
        <LinksAccordion title="Customer Support" links={SUPPORT_LINKS} />
      </div>

      {/* ── Divider ── */}
      <div className="global-container">
        <div className="border-t border-gray-100" />
      </div>

      {/* ══════════════════════════════════════════
          Middle Row — Desktop: 4 cols | Mobile: stacked
      ══════════════════════════════════════════ */}
      <div className="global-container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Quick Links — Desktop only */}
          <div className="hidden md:block">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  {link.isModal ? (
                    <button
                      onClick={() => openModal(link.modalTitle ?? link.label)}
                      className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support — Desktop only */}
          <div className="hidden md:block">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
              Customer Support
            </h4>
            <ul className="flex flex-col gap-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info — always visible */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
              Contact Info
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#186737]" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Phone</p>
                  <a href="tel:+18664467322" className="text-[13px] text-gray-700 hover:text-[#186737] transition-colors font-medium">
                    +1 (866) 446-7322
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#186737]" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Email</p>
                  <a href="mailto:support@thehorecastore.com" className="text-[13px] text-gray-700 hover:text-[#186737] transition-colors font-medium">
                    support@thehorecastore.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#186737]" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Address</p>
                  <p className="text-[13px] text-gray-700 leading-relaxed">
                 Horecastore Showroom

<span className="block">8800 Bissonnet Street, Ste A, Houston, Texas 77074</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter — always visible */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
              Newsletter
            </h4>
            <p className="text-[12px] text-gray-400 mb-4 leading-relaxed">
              Get deals, new products & restaurant tips straight to your inbox.
            </p>
            <NewsletterForm />
            <div className="mt-5">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#186737] hover:text-[#186737] hover:bg-green-50 transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="global-container">
        <div className="border-t border-gray-100" />
      </div>

      {/* ── Bottom Bar ── */}
      <div className="global-container py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-400 text-center sm:text-left">
            © 2026 HorecaStore. All Rights Reserved.
          </p>
          {/* <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 mr-1">We Accept:</span>
            {["VISA", "MC", "AMEX", "PayPal", "CASH"].map((method) => (
              <div key={method} className="h-7 px-2 border border-gray-200 rounded-[7px] flex items-center justify-center bg-gray-50">
                <span className="text-[10px] font-bold text-gray-500">{method}</span>
              </div>
            ))}
          </div> */}
          {/* <div className="flex items-center gap-4">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Sitemap", href: "/sitemap" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-[12px] text-gray-400 hover:text-[#186737] transition-colors">
                {link.label}
              </Link>
            ))}
          </div> */}
        </div>
      </div>

    </footer>

    <FinancingModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      title={modalTitle}
    />
    </>
  );
};

export default Footer;