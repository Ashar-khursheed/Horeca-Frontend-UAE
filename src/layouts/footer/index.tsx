"use client";

import FinancingModal from "@/components/financing-modal";
import { ApiCategory, ApiCategoryName } from "@/features/category";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import NewsletterForm from "./newsletter-form";

const getName = (name: ApiCategoryName | string, locale: string): string => {
  if (typeof name === "string") return name;
  return locale === "ar" ? name.ar || name.en : name.en || name.ar;
};

const getCategoryHref = (cat: ApiCategory): string =>
  cat.slug === "shop-by-brands" ? "/brands" : `/${cat.slug}`;

interface LinkItem {
  label: string;
  href: string;
  isModal?: boolean;
  modalTitle?: string;
}

const QUICK_LINKS: LinkItem[] = [
  { label: "About Us", href: "/pages/about-us" },
  { label: "Starting a Restaurant?", href: "/starting-a-restaurant" },
  // {
  //   label: "Financing Options",
  //   href: "#",
  //   isModal: true,
  //   modalTitle: "Financing Options",
  // },
  {
    label: "Request a Quote",
    href: "#",
    isModal: true,
    modalTitle: "Request a Quote",
  },
  { label: "Track Your Order", href: "/track-order" },
  { label: "Returns & Refunds", href: "/pages/return-policy" },
  { label: "Warranty Info", href: "/pages/extended-warranty" },
  { label: "Blog & Resources", href: "/blog" },
];

const SUPPORT_LINKS: LinkItem[] = [
  { label: "Help Center", href: "/pages/contact-us" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faq" },
  { label: "Shipping Policy", href: "/pages/shipping-policy" },
  { label: "Terms of Service", href: "/pages/cancellation-policy" },
  { label: "Privacy Policy", href: "/pages/privacy-policy" },
];

const BRAND_LINKS: LinkItem[] = [
  { label: "True Refrigeration", href: "/brands/true-refrigeration" },
  {
    label: "Medal Equipment",
    href: "/brands/medal-equipment-authorised-dealer",
  },
  { label: "Manitowoc", href: "/brands/manitowoc" },
  { label: "Arctic Air", href: "/brands/arctic-air" },
];

const SOCIAL_LINKS = [
  {
    icon: (
      <>
        <svg
          width="18"
          height="18"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_17_24)">
            <path
              d="M48 24C48 10.7453 37.2547 0 24 0C10.7453 0 0 10.7453 0 24C0 35.255 7.74912 44.6995 18.2026 47.2934V31.3344H13.2538V24H18.2026V20.8397C18.2026 12.671 21.8995 8.8848 29.9194 8.8848C31.44 8.8848 34.0637 9.18336 35.137 9.48096V16.129C34.5706 16.0694 33.5866 16.0397 32.3645 16.0397C28.4294 16.0397 26.9088 17.5306 26.9088 21.4061V24H34.7482L33.4013 31.3344H26.9088V47.8243C38.7926 46.3891 48.001 36.2707 48.001 24H48Z"
              fill="#0866FF"
            />
            <path
              d="M33.4003 31.3344L34.7472 24H26.9078V21.4061C26.9078 17.5306 28.4285 16.0397 32.3635 16.0397C33.5856 16.0397 34.5696 16.0694 35.136 16.129V9.48096C34.0627 9.1824 31.439 8.8848 29.9184 8.8848C21.8986 8.8848 18.2016 12.671 18.2016 20.8397V24H13.2528V31.3344H18.2016V47.2934C20.0582 47.7542 22.0003 48 23.999 48C24.983 48 25.9536 47.9395 26.9069 47.8243V31.3344H33.3994H33.4003Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_17_24">
              <rect width="48" height="48" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </>
    ),
    href: "https://www.facebook.com/horecastore.ae",
    label: "Facebook",
  },
  // { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  {
    icon: (
      <>
        <svg
          width="18"
          height="18"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_17_27)">
            <path
              d="M24 4.32187C30.4125 4.32187 31.1719 4.35 33.6938 4.4625C36.0375 4.56562 37.3031 4.95938 38.1469 5.2875C39.2625 5.71875 40.0688 6.24375 40.9031 7.07812C41.7469 7.92188 42.2625 8.71875 42.6938 9.83438C43.0219 10.6781 43.4156 11.9531 43.5188 14.2875C43.6313 16.8187 43.6594 17.5781 43.6594 23.9813C43.6594 30.3938 43.6313 31.1531 43.5188 33.675C43.4156 36.0188 43.0219 37.2844 42.6938 38.1281C42.2625 39.2438 41.7375 40.05 40.9031 40.8844C40.0594 41.7281 39.2625 42.2438 38.1469 42.675C37.3031 43.0031 36.0281 43.3969 33.6938 43.5C31.1625 43.6125 30.4031 43.6406 24 43.6406C17.5875 43.6406 16.8281 43.6125 14.3063 43.5C11.9625 43.3969 10.6969 43.0031 9.85313 42.675C8.7375 42.2438 7.93125 41.7188 7.09688 40.8844C6.25313 40.0406 5.7375 39.2438 5.30625 38.1281C4.97813 37.2844 4.58438 36.0094 4.48125 33.675C4.36875 31.1438 4.34063 30.3844 4.34063 23.9813C4.34063 17.5688 4.36875 16.8094 4.48125 14.2875C4.58438 11.9437 4.97813 10.6781 5.30625 9.83438C5.7375 8.71875 6.2625 7.9125 7.09688 7.07812C7.94063 6.23438 8.7375 5.71875 9.85313 5.2875C10.6969 4.95938 11.9719 4.56562 14.3063 4.4625C16.8281 4.35 17.5875 4.32187 24 4.32187ZM24 0C17.4844 0 16.6688 0.028125 14.1094 0.140625C11.5594 0.253125 9.80625 0.665625 8.2875 1.25625C6.70312 1.875 5.3625 2.69062 4.03125 4.03125C2.69063 5.3625 1.875 6.70313 1.25625 8.27813C0.665625 9.80625 0.253125 11.55 0.140625 14.1C0.028125 16.6687 0 17.4844 0 24C0 30.5156 0.028125 31.3312 0.140625 33.8906C0.253125 36.4406 0.665625 38.1938 1.25625 39.7125C1.875 41.2969 2.69063 42.6375 4.03125 43.9688C5.3625 45.3 6.70313 46.125 8.27813 46.7344C9.80625 47.325 11.55 47.7375 14.1 47.85C16.6594 47.9625 17.475 47.9906 23.9906 47.9906C30.5063 47.9906 31.3219 47.9625 33.8813 47.85C36.4313 47.7375 38.1844 47.325 39.7031 46.7344C41.2781 46.125 42.6188 45.3 43.95 43.9688C45.2812 42.6375 46.1063 41.2969 46.7156 39.7219C47.3063 38.1938 47.7188 36.45 47.8313 33.9C47.9438 31.3406 47.9719 30.525 47.9719 24.0094C47.9719 17.4938 47.9438 16.6781 47.8313 14.1188C47.7188 11.5688 47.3063 9.81563 46.7156 8.29688C46.125 6.70312 45.3094 5.3625 43.9688 4.03125C42.6375 2.7 41.2969 1.875 39.7219 1.26562C38.1938 0.675 36.45 0.2625 33.9 0.15C31.3313 0.028125 30.5156 0 24 0Z"
              fill="#000100"
            />
            <path
              d="M24 11.6719C17.1938 11.6719 11.6719 17.1938 11.6719 24C11.6719 30.8062 17.1938 36.3281 24 36.3281C30.8062 36.3281 36.3281 30.8062 36.3281 24C36.3281 17.1938 30.8062 11.6719 24 11.6719ZM24 31.9969C19.5844 31.9969 16.0031 28.4156 16.0031 24C16.0031 19.5844 19.5844 16.0031 24 16.0031C28.4156 16.0031 31.9969 19.5844 31.9969 24C31.9969 28.4156 28.4156 31.9969 24 31.9969Z"
              fill="#000100"
            />
            <path
              d="M39.6937 11.1844C39.6937 12.7782 38.4 14.0625 36.8156 14.0625C35.2219 14.0625 33.9375 12.7688 33.9375 11.1844C33.9375 9.59065 35.2313 8.30627 36.8156 8.30627C38.4 8.30627 39.6937 9.60003 39.6937 11.1844Z"
              fill="#000100"
            />
          </g>
          <defs>
            <clipPath id="clip0_17_27">
              <rect width="48" height="48" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </>
    ),
    href: "https://www.instagram.com/horecastore.ae",
    label: "Instagram",
  },
  {
    icon: (
      <>
        <svg
          width="18"
          height="18"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_17_32)">
            <path
              d="M44.4567 0H3.54333C2.60358 0 1.70232 0.373315 1.03782 1.03782C0.373315 1.70232 0 2.60358 0 3.54333V44.4567C0 45.3964 0.373315 46.2977 1.03782 46.9622C1.70232 47.6267 2.60358 48 3.54333 48H44.4567C45.3964 48 46.2977 47.6267 46.9622 46.9622C47.6267 46.2977 48 45.3964 48 44.4567V3.54333C48 2.60358 47.6267 1.70232 46.9622 1.03782C46.2977 0.373315 45.3964 0 44.4567 0ZM14.3067 40.89H7.09V17.9667H14.3067V40.89ZM10.6933 14.79C9.87473 14.7854 9.07583 14.5384 8.39747 14.0802C7.71911 13.622 7.19168 12.9731 6.88175 12.2154C6.57183 11.4577 6.4933 10.6252 6.65606 9.82291C6.81883 9.02063 7.2156 8.28455 7.79631 7.70756C8.37702 7.13057 9.11563 6.73853 9.91893 6.58092C10.7222 6.42331 11.5542 6.50719 12.3099 6.82197C13.0656 7.13675 13.7111 7.66833 14.1649 8.34962C14.6188 9.03092 14.8606 9.83138 14.86 10.65C14.8677 11.1981 14.765 11.7421 14.558 12.2496C14.351 12.7571 14.044 13.2178 13.6551 13.6041C13.2663 13.9905 12.8037 14.2946 12.2948 14.4983C11.786 14.702 11.2413 14.8012 10.6933 14.79ZM40.9067 40.91H33.6933V28.3867C33.6933 24.6933 32.1233 23.5533 30.0967 23.5533C27.9567 23.5533 25.8567 25.1667 25.8567 28.48V40.91H18.64V17.9833H25.58V21.16H25.6733C26.37 19.75 28.81 17.34 32.5333 17.34C36.56 17.34 40.91 19.73 40.91 26.73L40.9067 40.91Z"
              fill="#0A66C2"
            />
          </g>
          <defs>
            <clipPath id="clip0_17_32">
              <rect width="48" height="48" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </>
    ),
    href: "https://www.linkedin.com/company/horecastore/",
    label: "LinkedIn",
  },
  {
    icon: (
      <>
        <svg
          width="18"
          height="18"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_17_47)">
            <path
              d="M47.044 12.3709C46.7726 11.3497 46.2378 10.4178 45.493 9.66822C44.7483 8.91869 43.8197 8.37791 42.8003 8.1C39.0476 7.09091 24.0476 7.09091 24.0476 7.09091C24.0476 7.09091 9.04761 7.09091 5.29488 8.1C4.27547 8.37791 3.34693 8.91869 2.60218 9.66822C1.85744 10.4178 1.32262 11.3497 1.05124 12.3709C0.0476075 16.14 0.0476074 24 0.0476074 24C0.0476074 24 0.0476075 31.86 1.05124 35.6291C1.32262 36.6503 1.85744 37.5822 2.60218 38.3318C3.34693 39.0813 4.27547 39.6221 5.29488 39.9C9.04761 40.9091 24.0476 40.9091 24.0476 40.9091C24.0476 40.9091 39.0476 40.9091 42.8003 39.9C43.8197 39.6221 44.7483 39.0813 45.493 38.3318C46.2378 37.5822 46.7726 36.6503 47.044 35.6291C48.0476 31.86 48.0476 24 48.0476 24C48.0476 24 48.0476 16.14 47.044 12.3709Z"
              fill="#FF0302"
            />
            <path
              d="M19.1385 31.1373V16.8628L31.684 24.0001L19.1385 31.1373Z"
              fill="#FEFEFE"
            />
          </g>
          <defs>
            <clipPath id="clip0_17_47">
              <rect width="48" height="48" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </>
    ),
    href: "https://www.youtube.com/@horecastoreinternational",
    label: "YouTube",
  },
];
// ─── Category Accordion (Mobile) ─────────────────────────────────────────────
const CategoryAccordion = ({
  category,
  locale,
}: {
  category: ApiCategory;
  locale: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-semibold text-gray-800">
          {getName(category.name, locale)}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#186737]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="pb-3 pl-2 flex flex-col gap-1.5">
          {category.slug === "shop-by-brands"
            ? BRAND_LINKS.map((brand) => (
                <Link
                  key={brand.href}
                  href={brand.href}
                  className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
                >
                  {brand.label}
                </Link>
              ))
            : category.children?.slice(0, 4).map((child) => (
                <Link
                  key={child.id}
                  href={`/${category.slug}/${child.slug}`}
                  className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
                >
                  {getName(child.name, locale)}
                </Link>
              ))}
          <Link
            href={getCategoryHref(category)}
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
            ),
          )}
        </div>
      )}
    </div>
  );
};

// ─── Footer Category Picks — top 5, Tableware swapped for Shop By Brands ────
const getFooterCategories = (navItemData: ApiCategory[]): ApiCategory[] => {
  const brandsCategory = navItemData.find((c) => c.slug === "shop-by-brands");
  const rest = navItemData.filter(
    (c) => c.slug !== "tableware" && c.slug !== "shop-by-brands",
  );
  const picks = rest.slice(0, brandsCategory ? 4 : 5);
  if (brandsCategory) picks.push(brandsCategory);
  return picks;
};

// ─── Main Footer ──────────────────────────────────────────────────────────────
export const Footer = ({ navItemData }: { navItemData: ApiCategory[] }) => {
  const locale = useLocale();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const footerCategories = getFooterCategories(navItemData);

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
                  Our team is here to guide you with the best solutions for your
                  restaurant.
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
                    <p className="text-[#7e859b] text-[15px] font-medium uppercase tracking-wide">
                      Call Us
                    </p>
                    <p className="text-black font-semibold text-base">
                      {" "}
                      (866) 446-7322
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:sales@thehorecastore.com"
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-5 py-3 rounded-[7px] transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-[#7e859b] text-[15px] font-medium uppercase tracking-wide">
                      Email Support
                    </p>
                    <p className="text-black font-semibold text-base">
                      sales@thehorecastore.com
                    </p>
                  </div>
                </a>
              </div>

              <div className="block md:hidden ">
                {/* Mobile CTA Buttons */}
                <a
                  href="tel:+18664467322"
                  className="bg-[#186737] relative top-2.5 p-2.5 text-white 2xl:px-4 px-2.5 2xl:py-3 py-1.5 rounded  2xl:text-[14px] text-[12px] "
                >
                  Talk to Our Expert Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
          DESKTOP — Category Grid (md+)
      ══════════════════════════════════════════ */}
        <div className="global-container py-10 hidden md:block">
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-8">
            {footerCategories.map((cat, index) => (
              <div key={cat.id} className={index >= 3 ? "hidden lg:block" : ""}>
                <Link
                  href={getCategoryHref(cat)}
                  className="group flex items-center gap-1 mb-4"
                >
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#186737] transition-colors">
                    {getName(cat.name, locale)}
                  </h3>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#186737] transition-colors opacity-0 group-hover:opacity-100" />
                </Link>
                <ul className="flex flex-col gap-2">
                  {cat.slug === "shop-by-brands"
                    ? BRAND_LINKS.map((brand) => (
                        <li key={brand.href}>
                          <Link
                            href={brand.href}
                            className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors leading-relaxed"
                          >
                            {brand.label}
                          </Link>
                        </li>
                      ))
                    : cat.children?.slice(0, 4).map((child) => (
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
                      href={getCategoryHref(cat)}
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
          {footerCategories.map((cat) => (
            <CategoryAccordion key={cat.id} category={cat} locale={locale} />
          ))}

          {/* Quick Links */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4 pb-1">
            Company
          </p>
          <LinksAccordion
            title="Quick Links"
            links={QUICK_LINKS}
            onModalOpen={openModal}
          />

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
                    <p className="text-[11px] text-gray-400 font-medium">
                      Phone
                    </p>
                    <a
                      href="tel:+18664467322"
                      className="text-[13px] text-gray-700 hover:text-[#186737] transition-colors font-medium"
                    >
                      (866) 446-7322
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-[#186737]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Email
                    </p>
                    <a
                      href="mailto:sales@thehorecastore.com"
                      className="text-[13px] text-gray-700 hover:text-[#186737] transition-colors font-medium"
                    >
                      sales@thehorecastore.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#186737]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Address
                    </p>
                    <p className="text-[13px] text-gray-700 leading-relaxed">
                      Horecastore Showroom
                      <span className="block">
                        8800 Bissonnet Street, Ste A, Houston, Texas 77074
                      </span>
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
                Get deals, new products & restaurant tips straight to your
                inbox.
              </p>
              <NewsletterForm />
              <div className="mt-5 flex flex-col mb-3 justify-center items-center">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-3">
                  Follow Us
                </p>
                <div className="flex items-center gap-2">
                  {SOCIAL_LINKS.map(({ icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-8 h-8 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#186737] hover:text-[#186737] hover:bg-green-50 transition-all duration-200"
                    >
                      <div className="w-4 h-4">{icon}</div>
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
