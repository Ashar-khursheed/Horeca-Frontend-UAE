"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import { FeaturedBrands } from "./index";
import type { FeaturedCategory } from "@/utils/types";

export function FeaturedBrandsDynamic({
  initialProducts,
}: {
  initialProducts: FeaturedCategory[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();

  const country = useAppSelector((s) => s.country.data);
  const countryName = country?.name;
  const [initialCountry, setInitialCountry] = useState<string | null>(null);

  useEffect(() => {
    if (countryName) {
      if (!initialCountry) {
        setInitialCountry(countryName);
      } else if (countryName !== initialCountry) {
        setInitialCountry(countryName);
        // Swap in country-correct products if country changes
        makeApiRequest<{ data: FeaturedCategory[] }>(apiUrls.FEATURED_BRAND_PRODUCTS)
          .then((res) => {
            if (res?.data) {
              setProducts(res.data);
            }
          })
          .catch(() => {
            router.refresh();
          });
      }
    }
  }, [countryName, initialCountry, router]);

  return <FeaturedBrands products={products} />;
}
