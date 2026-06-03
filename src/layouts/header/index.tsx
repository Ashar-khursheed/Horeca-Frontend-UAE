import BottomNav from "@/components/bottom-nav";
import NavigationStatic from "./main-bar";
import DropdownPanel from "./navigation";
import TopBar from "./top-bar";

const Header = ({ navItemData = [] }: { navItemData?: unknown[] }) => {
  return (
    <header className="w-full stickys top-0 z-50 ">
      <TopBar />
      <NavigationStatic navItemData={navItemData as any} />
      <DropdownPanel navItemData={navItemData} />
      <BottomNav />
    </header>
  );
};

export default Header;
