"use client";

import AppInitializer from "@/components/app-initializer";
import store from "@/store/store";
import React from "react";
import { Provider } from "react-redux";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "../footer";
import Header from "../header";
import type { ApiCategory } from "@/utils/types";

interface GlobalLayoutProps {
  children: React.ReactNode;
  navItemData?: ApiCategory[];
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children, navItemData }) => {
  return (
    <Provider store={store}>
      <AppInitializer />
      <Header navItemData={navItemData} />
      {children}
      <Footer navItemData={navItemData ?? []} />
    </Provider>
  );
};

export default GlobalLayout;
