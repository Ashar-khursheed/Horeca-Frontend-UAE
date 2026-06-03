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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../footer";
import Header from "../header";
import type { ApiCategory } from "@/utils/types";

interface GlobalLayoutProps {
  children: React.ReactNode;
  locationData?: LocationData | null;
  initialProfile?: CustomerProfile | null;
  navItemData?: ApiCategory[];
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children, locationData, initialProfile, navItemData }) => {
  return (
    <Provider store={store}>
      <AppInitializer initialProfile={initialProfile} locationData={locationData} />
      <Header locationData={locationData} navItemData={navItemData} />
      {children}
      <Footer navItemData={navItemData ?? []} />
    </Provider>
  );
};

export default GlobalLayout;
