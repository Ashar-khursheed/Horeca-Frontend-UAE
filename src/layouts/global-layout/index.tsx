"use client";

import ProfileInitializer from "@/components/ProfileInitializer";
import { LocationData } from "@/store/slices/location/locationSlice";
import store, { AppDispatch,  RootState } from "@/store/store";
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "../footer";
import Header from "../header";
import { fetchCountryByName } from "@/store/slices/country/countrySlice";

interface GlobalLayoutProps {
  children: React.ReactNode;
  locationData?: LocationData | null;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children, locationData }) => {
  return (
    <Provider store={store}>
      <ProfileInitializer />
      <Header locationData={locationData} />
      {children}
      <Footer />
    </Provider>
  );
};

export default GlobalLayout;
