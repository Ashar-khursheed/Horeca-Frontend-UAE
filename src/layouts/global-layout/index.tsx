"use client";

import LocationInitializer from "@/components/LocationInitializer";
import ProfileInitializer from "@/components/ProfileInitializer";
import store from "@/store/store";
import React from "react";
import { Provider } from "react-redux";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "../footer";
import Header from "../header";

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <ProfileInitializer />
      <LocationInitializer />
      <Header />
      {children}
      <Footer />
    </Provider>
  );
};

export default GlobalLayout;
