import BottomNav from "@/components/bottom-nav";
import { Props } from "@/utils/types";
import NavigationStatic from "./main-bar";
import DropdownPanel from "./navigation";
import TopBar from "./top-bar";


const Header = ({ initialProfile = null, locationData, navItemData = [] }: Props) => {
  return (
    <header className="w-full stickys top-0 z-50 ">
      <TopBar />
      <NavigationStatic initialProfile={initialProfile} locationData={locationData} navItemData={navItemData as any} />
      <DropdownPanel navItemData={navItemData} />
      <BottomNav />
    </header>
  );
};

export default Header;
