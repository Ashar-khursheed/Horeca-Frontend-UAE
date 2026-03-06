"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "@/store/store";
interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  return (
    <>
      {/* <Provider store={store}> */}
        {children}
      {/* </Provider> */}
    </>
  );
};

export default GlobalLayout;
