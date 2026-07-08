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


"use client";

import BottomNav from "@/components/bottom-nav";
import { useEffect, useRef, useState } from "react";
import NavigationStatic from "./main-bar";
import DropdownPanel from "./navigation";
import TopBar from "./top-bar";

interface HeaderProps {
  navItemData?: unknown[];
}

const Header = ({ navItemData = [] }: HeaderProps) => {
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Measure the header's own height so the spacer below can reserve the
  // right amount of space — height varies per breakpoint (TopBar hidden on
  // mobile, BottomNav shown on mobile), so it can't be a fixed pixel value.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setHeaderHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="w-full fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300"
      >
        <TopBar />
        <NavigationStatic navItemData={navItemData as any} />
        <DropdownPanel navItemData={navItemData} />
        <BottomNav />
      </header>
      {/* Spacer — keeps page content from sitting under the now-fixed header */}
      <div style={{ height: headerHeight }} />
    </>
  );
};

export default Header;
