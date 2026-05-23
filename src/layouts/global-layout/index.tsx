"use client";

import AppInitializer from "@/components/app-initializer";
import { LocationData } from "@/store/slices/location/locationSlice";
import type { CustomerProfile } from "@/store/slices/my-profile/profileSlice";
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
  locationData?: LocationData | null;
  initialProfile?: CustomerProfile | null;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children, locationData, initialProfile }) => {
  return (
    <Provider store={store}>
      <AppInitializer initialProfile={initialProfile} locationData={locationData} />
      <Header locationData={locationData} />
      {children}
      <Footer />
    </Provider>
  );
};

export default GlobalLayout;
