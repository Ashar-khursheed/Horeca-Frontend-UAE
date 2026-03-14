"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "@/store/store";
import Header from "../header";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  return (
    <>
      {/* <Provider store={store}> */}
      <Header />
        {children}
      {/* </Provider> */}
    </>
  );
};

export default GlobalLayout;
