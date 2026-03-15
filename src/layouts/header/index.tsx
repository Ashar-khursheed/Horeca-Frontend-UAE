"use client";

import NavigationStatic from "./main-bar";
import DropdownPanel from "./navigation";
import TopBar from "./top-bar";



// ── Types ──────────────────────────────────────────────────────────────────

interface HeaderProps {
  locale?: string;
  userName?: string;
  wishlistCount?: number;
  cartCount?: number;
  deliverTo?: {
    name: string;
    address: string;
  };
}

// ── Component ──────────────────────────────────────────────────────────────

const Header: React.FC<HeaderProps> = ({
  locale = "en",
  userName,
  wishlistCount = 0,
  cartCount = 0,
  deliverTo,
}) => {
  return (
    <header
    //   dir={locale === "ar" ? "rtl" : "ltr"}
      className="w-full sticky top-0 z-50 "
    >
        <TopBar  />
         <NavigationStatic
      />
      <DropdownPanel/>
      {/* <TopBar locale={locale} />
      <MainBar
        locale={locale}
        userName={userName}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
        deliverTo={deliverTo}
      />
      <Navigation locale={locale} /> */}
    </header>
  );
};

export default Header;