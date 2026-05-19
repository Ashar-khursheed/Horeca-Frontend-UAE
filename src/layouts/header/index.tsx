

"use client";

import { HeaderProps } from "@/utils/types";
import NavigationStatic from "./main-bar";
import DropdownPanel from "./navigation";
import TopBar from "./top-bar";
import BottomNav from "@/components/bottom-nav";

// ── Types ──────────────────────────────────────────────────────────────────

// ── Component ──────────────────────────────────────────────────────────────

const Header: React.FC<HeaderProps> = ({
  locale = "en",
  userName,
  wishlistCount = 0,
  cartCount = 0,
  deliverTo,
}) => {
  return (
    <header className="w-full stickys top-0 z-50 ">
      <TopBar />
      <NavigationStatic />
      <DropdownPanel />
      <BottomNav />
    </header>
  );
};

export default Header;
