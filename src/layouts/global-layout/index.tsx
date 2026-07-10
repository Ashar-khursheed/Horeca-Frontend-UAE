"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { Provider } from "react-redux";
import AppInitializer from "@/components/app-initializer";
import TaxInitializer from "@/components/TaxInitializer";
import store from "@/store/store";
import type { ApiCategory } from "@/utils/types";
import Footer from "../footer";
import Header from "../header";

function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

interface GlobalLayoutProps {
  children: React.ReactNode;
  navItemData?: ApiCategory[];
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({
  children,
  navItemData,
}) => {
  return (
    <Provider store={store}>
      <ScrollToTop />
      <AppInitializer />
      <TaxInitializer />
      <div className="flex flex-col min-h-screen">
        <Header navItemData={navItemData} />
        <main className="flex-grow">{children}</main>
        <Footer navItemData={navItemData ?? []} />
      </div>
    </Provider>
  );
};

export default GlobalLayout;
