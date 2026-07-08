// import BottomNav from "@/components/bottom-nav";
// import NavigationStatic from "./main-bar";
// import DropdownPanel from "./navigation";
// import TopBar from "./top-bar";
// import { apiUrls } from "@/apis/api-endpoint";
// import { makeApiCallSSR } from "@/apis/ssr-fetch";
// import { ApiCategory } from "@/features/category";

// const Header = async ({ navItemData = [] }: { navItemData?: unknown[] }) => {
//    const navData = await makeApiCallSSR<{ data: ApiCategory[] }>(
//       apiUrls.NavigationAPI,
//       {},
//       { revalidate: 3600 },
//     );
//     const navItemDataSS = navData?.data ?? [];
//     console.log("Header navItemData:", navItemDataSS);
//   return (
//     <header className="w-full stickys top-0 z-50 ">
//       <TopBar />
//       <NavigationStatic navItemData={navItemData as any} />
//       <DropdownPanel navItemData={navItemData} />
//       <BottomNav />
//     </header>
//   );
// };

// export default Header;


import BottomNav from "@/components/bottom-nav";
import type { SearchSuggestions } from "@/utils/types";
import NavigationStatic from "./main-bar";
import DropdownPanel from "./navigation";
import TopBar from "./top-bar";

interface HeaderProps {
  navItemData?: unknown[];
  searchData?: SearchSuggestions | null;
}

const Header = ({ navItemData = [], searchData }: HeaderProps) => (
  <header className="w-full fixed top-0 z-50 ">
    <TopBar />
    <NavigationStatic navItemData={navItemData as any} searchData={searchData} />
    <DropdownPanel navItemData={navItemData} />
    <BottomNav />
  </header>
);

export default Header;
