"use client";
import React, { useState } from "react";
import Link from "next/link";
import LangSwitcher from "@/components/LangSwitcher";
import FinancingModal from "@/components/financing-modal";

const NAV_LINKS = [
  { label: "Track your order", href: "/track-order", isModal: false, modalTitle: "" },
  { label: "Financing Options", href: "#", isModal: true, modalTitle: "Financing" },
  // { label: "Request a Quote", href: "#", isModal: true, modalTitle: "Request a Quote" },
  { label: "Contact Us", href: "/pages/contact-us", isModal: false, modalTitle: "" },
  { label: "Terms & Conditions", href: "/pages/return-policy", isModal: false, modalTitle: "" },
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
            {NAV_LINKS.map((link, index) => (
              <li key={link.href + link.label} className="flex items-center">
                {link.isModal ? (
                  <button
                    onClick={() => handleModalOpen(link.modalTitle)}
                    className={linkClass}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                )}

                {index < NAV_LINKS.length - 1 && (
                  <span className="w-px h-3.5 bg-gray-300 rounded-full" />
                )}
              </li>
            ))}
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
