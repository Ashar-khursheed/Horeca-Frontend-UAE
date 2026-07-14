"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { FeaturedBrands } from "./index";
import type { FeaturedCategory } from "@/utils/types";
import { trimFeaturedBrands } from "@/utils/homepage-payload";

export function FeaturedBrandsDynamic() {
  const [products, setProducts] = useState<FeaturedCategory[]>([]);
 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const country = useAppSelector((s) => s.country.data);
  const countryName = country?.name;
  const [initialCountry, setInitialCountry] = useState<string | null>(null);

  const loadProducts = () =>
    makeApiRequest<{ data: FeaturedCategory[] }>(apiUrls.FEATURED_BRAND_PRODUCTS, {
      params: { products_limit: 12, limit: 5, min_products: 5 },
    })
      .then((res) => {
        console.log("🚀 ~ file: FeaturedBrandsDynamic.tsx:23 ~ loadProducts ~ res:", res)
        if (res?.data) {
          setProducts(trimFeaturedBrands(res.data));
        }
      })
      .catch(() => {
        router.refresh();
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    console.log("🚀 ~ file: FeaturedBrandsDynamic.tsx:34 ~ useEffect ~ countryName:", countryName)
    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countryName) {
      if (!initialCountry) {
        setInitialCountry(countryName);
      } else if (countryName !== initialCountry) {
        setInitialCountry(countryName);
        loadProducts();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryName, initialCountry]);

  if (loading) {
    return (
      <section className="w-full bg-white py-5">
        <div className="global-container">
          <div className="h-8 w-40 bg-slate-100 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-56 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <FeaturedBrands products={products} />;
}
