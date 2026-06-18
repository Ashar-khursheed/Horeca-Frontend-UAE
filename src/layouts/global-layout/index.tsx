"use client";

import AppInitializer from "@/components/app-initializer";
import TaxInitializer from "@/components/TaxInitializer";
import store from "@/store/store";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import Footer from "../footer";
import Header from "../header";
import type { ApiCategory, SearchSuggestions } from "@/utils/types";

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
  searchData?: SearchSuggestions | null;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children, navItemData, searchData }) => {
  return (
    <Provider store={store}>
      <ScrollToTop />
      <AppInitializer />
      <TaxInitializer />
      <Header navItemData={navItemData} searchData={searchData} />
      {children}
      <Footer navItemData={navItemData ?? []} />
    </Provider>
  );
};

export default GlobalLayout;
