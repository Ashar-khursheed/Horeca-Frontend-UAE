


import { HeaderProps } from "@/utils/types";
import NavigationStatic from "./main-bar";
import DropdownPanel from "./navigation";
import TopBar from "./top-bar";
import BottomNav from "@/components/bottom-nav";

// ── Types ──────────────────────────────────────────────────────────────────

// ── Component ──────────────────────────────────────────────────────────────
 let locationData = null;
  try {
    const res = await fetch("https://pim.thehorecastore.co/api/frontend/location", {
      cache: "no-store",
    });
    if (res.ok) locationData = await res.json();
  } catch {
    // non-critical, proceed without location
  }
const Header: React.FC<HeaderProps> = ({ initialProfile = null }) => {
  return (
    <header className="w-full stickys top-0 z-50 ">
      <TopBar />
      <NavigationStatic initialProfile={initialProfile} />
      <DropdownPanel />
      <BottomNav />
    </header>
  );
};

export default Header;
