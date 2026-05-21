import BottomNav from "@/components/bottom-nav";
import { LocationData } from "@/store/slices/location/locationSlice";
import { HeaderProps } from "@/utils/types";
import NavigationStatic from "./main-bar";
import DropdownPanel from "./navigation";
import TopBar from "./top-bar";

interface Props extends HeaderProps {
  locationData?: LocationData | null;
}

const Header: React.FC<Props> = ({ initialProfile = null, locationData }) => {
  return (
    <header className="w-full stickys top-0 z-50 ">
      <TopBar />
      <NavigationStatic initialProfile={initialProfile} locationData={locationData} />
      <DropdownPanel />
      <BottomNav />
    </header>
  );
};

export default Header;
