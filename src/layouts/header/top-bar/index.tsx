import React from "react";
import Link from "next/link";
import LangSwitcher from "@/components/LangSwitcher";

const NAV_LINKS = [
  { label: "Track your order", href: "/search-order" },
  { label: "Contact Us", href: "/pages/contact-us" },
  { label: "Terms & Conditions", href: "/pages/return-policy" },
  
];

const TopBar = () => {
  return (
    <div className="bg-gray-50  hidden lg:block">
      <div className="global-container flex items-center justify-between py-1.5">
        
        {/* Left: Tagline */}
        <p className="text-[14px] text-gray-500 tracking-wide">
          Discover Exceptional Products and Unmatched Service.
        </p>

        {/* Right: Nav Links */}
        <ul className="flex items-center">
          {NAV_LINKS.map((link, index) => (
            <li key={link.href} className="flex items-center">
              <Link
                href={link.href}
                className="
                  text-[15px] text-gray-500 px-3 py-0.5
                  relative
                  hover:text-[#186737]
                  transition-colors duration-200 ease-in-out
                  after:absolute after:bottom-0 after:left-3 after:right-3
                  after:h-[1px] after:bg-[#186737]
                  after:scale-x-0 after:origin-left
                  after:transition-transform after:duration-200
                  hover:after:scale-x-100
                "
              >
                {link.label}
              </Link>

              {/* Divider — last item ke baad nahi */}
              {index < NAV_LINKS.length - 1 && (
                <span className="w-[1px] h-[14px] bg-gray-300 rounded-full" />
              )}
            </li>
          ))}
          <li>
            <LangSwitcher />
          </li>
        </ul>

      </div>
    </div>
  );
};

export default TopBar;