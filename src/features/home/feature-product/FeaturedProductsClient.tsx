"use client";

import dynamic from "next/dynamic";
import type { FeaturedCategory } from "@/utils/types";

const Skeleton = () => (
  <div className="animate-pulse w-full bg-white py-5">
    <div className="global-container">
      <div className="h-7 bg-gray-200 rounded w-48 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-gray-200 rounded-[7px]" />
        ))}
      </div>
    </div>
  </div>
);

const FeaturedProducts = dynamic(() => import("."), {
  ssr: false,
  loading: () => <Skeleton />,
});

export default function FeaturedProductsClient({ products }: { products: FeaturedCategory[] }) {
  return <FeaturedProducts products={products} />;
}
