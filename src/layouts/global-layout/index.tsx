"use client";

import AppInitializer from "@/components/app-initializer";
import TaxInitializer from "@/components/TaxInitializer";
import store from "@/store/store";
import React from "react";
import { Provider } from "react-redux";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "../footer";
import Header from "../header";
import type { ApiCategory, SearchSuggestions } from "@/utils/types";

interface GlobalLayoutProps {
  children: React.ReactNode;
  navItemData?: ApiCategory[];
  searchData?: SearchSuggestions | null;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children, navItemData, searchData }) => {
  return (
    <Provider store={store}>
      <AppInitializer />
      <TaxInitializer />
      <Header navItemData={navItemData} searchData={searchData} />
      {children}
      <Footer navItemData={navItemData ?? []} />
    </Provider>
  );
};

export default GlobalLayout;
