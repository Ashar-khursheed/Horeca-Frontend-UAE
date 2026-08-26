"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Handshake, FileText } from "lucide-react";
import LangSwitcher from "@/components/LangSwitcher";
import FinancingModal from "@/components/financing-modal";

type HighlightVariant = "quote" | "partner";

const NAV_LINKS = [
  { label: "Track your order", href: "/track-order", isModal: false, modalTitle: "", highlight: false, variant: undefined },
  // { label: "Financing Options", href: "#", isModal: true, modalTitle: "Financing", highlight: false, variant: undefined },
 
  { label: "Contact Us", href: "/pages/contact-us", isModal: false, modalTitle: "", highlight: false, variant: undefined },
  { label: "Terms & Conditions", href: "/pages/return-policy", isModal: false, modalTitle: "", highlight: false, variant: undefined },
  // { label: "Become a Partner", href: "/register?type=vendor", isModal: false, modalTitle: "", highlight: true, variant: "partner" as HighlightVariant },
   { label: "Create Quotation", href: "/create-quotation", isModal: false, modalTitle: "", highlight: true, variant: "quote" as HighlightVariant },
];

const linkClass = `
  text-[12px] text-gray-500 px-3 py-0.5
  relative
  hover:text-[#186737]
  transition-colors duration-200 ease-in-out
  after:absolute after:bottom-0 after:left-3 after:right-3
  after:h-px after:bg-[#186737]
  after:scale-x-0 after:origin-left
  after:transition-transform after:duration-200
  hover:after:scale-x-100
`;

const HIGHLIGHT_ICON: Record<HighlightVariant, React.ElementType> = {
  quote: FileText,
  partner: Handshake,
};

const HIGHLIGHT_STYLE: Record<HighlightVariant, string> = {
  quote: `
    text-[#B4530A] bg-gradient-to-r from-amber-500/10 to-orange-500/10
    hover:from-amber-500 hover:to-orange-500 hover:text-white
    ring-1 ring-inset ring-amber-500/20 hover:ring-orange-500
  `,
  partner: `
    text-[#186737] bg-[#186737]/10
    hover:bg-[#186737] hover:text-white
    ring-1 ring-inset ring-[#186737]/20 hover:ring-[#186737]
  `,
};

const highlightLinkClass = (variant: HighlightVariant) => `
  flex items-center gap-1
  text-[12px] font-semibold px-2.5 py-1 mx-1
  rounded-full
  transition-all duration-200 ease-in-out
  ${HIGHLIGHT_STYLE[variant]}
`;

const TopBar = () => {
  const [modalTitle, setModalTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = (title: string) => {
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="bg-gray-50 hidden xl:block">
        <div className="global-container flex items-center justify-between py-1.5">
          {/* Left: Tagline */}
          <p className="text-[12px] text-gray-500 tracking-wide">
            Discover Exceptional Products and Unmatched Service.
          </p>

          {/* Right: Nav Links */}
          <ul className="flex items-center">
            {NAV_LINKS.map((link, index) => {
              const Icon = link.variant ? HIGHLIGHT_ICON[link.variant] : null;
              const className = link.highlight && link.variant ? highlightLinkClass(link.variant) : linkClass;

              return (
                <li key={link.href + link.label} className="flex items-center">
                  {link.isModal ? (
                    <button onClick={() => handleModalOpen(link.modalTitle)} className={className}>
                      {Icon && <Icon size={12} />}
                      {link.label}
                    </button>
                  ) : (
                    <Link href={link.href} className={className}>
                      {Icon && <Icon size={12} />}
                      {link.label}
                    </Link>
                  )}

                  {index < NAV_LINKS.length - 1 && !link.highlight && (
                    <span className="w-px h-3.5 bg-gray-300 rounded-full" />
                  )}
                </li>
              );
            })}
            <li>
              {/* <LangSwitcher /> */}
            </li>
          </ul>
        </div>
      </div>
      <FinancingModal isOpen={isModalOpen} onClose={handleModalClose} title={modalTitle} />
    </div>
  );
};

export default TopBar;
