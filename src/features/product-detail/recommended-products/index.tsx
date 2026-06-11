"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import ProductCard, { RawApiProduct } from "@/components/product-card";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalize = (p: any): RawApiProduct => {
  const images = p.images;
  const flatImages: string[] = Array.isArray(images)
    ? images
    : (images?.en ?? images?.ar ?? []);

  const currency = p.currency;
  const currencyStr: string =
    typeof currency === "object" && currency !== null
      ? (currency.symbol ?? currency.name ?? "AED")
      : (currency ?? "AED");

  return {
    ...p,
    images: flatImages,
    currency: currencyStr,
    url: p.url ?? p.seo?.url ?? "#",
    sale_price: p.sale_price ?? 0,
    avg_rating: p.avg_rating ?? null,
    total_reviews: p.total_reviews ?? 0,
    in_wishlist: p.in_wishlist ?? false,
  };
};

const SkeletonCard = () => (
  <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="bg-gray-100 aspect-square w-full" />
    <div className="p-3 space-y-2.5">
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-2.5 bg-gray-200 rounded w-1/2 mt-1" />
      <div className="h-2.5 bg-gray-200 rounded w-2/3" />
      <div className="h-7 bg-gray-200 rounded w-full mt-3" />
    </div>
  </div>
);

const RecommendedProducts = ({ productSlug }: { productSlug: string }) => {
  const [products, setProducts] = useState<RawApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productSlug) return;
    setLoading(true);
    makeApiRequest<{ success: boolean; data: unknown[] }>(
      apiUrls.RECOMMENDED_PRODUCTS(productSlug)
    )
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setProducts(res.data.map(normalize));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productSlug]);

  if (!loading && products.length === 0) return null;

  return (
    <div className="mt-3 mb-8 bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-300">
        <h2 className="heading-font-size font-bold text-gray-900">Products You May Like</h2>
        <p className="text-xs text-gray-500 mt-0.5">Handpicked based on this product</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
};

export default RecommendedProducts;
