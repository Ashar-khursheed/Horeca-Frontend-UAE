"use client";

import { fetchProfile, setLoading } from "@/store/slices/my-profile/profileSlice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function ProfileInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(fetchProfile());
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return null;
}
