"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import ProductCard, { RawApiProduct } from "@/components/product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalize = (p: any): RawApiProduct => {
  // images can arrive as `images` (flat/locale-wrapped) or `image_urls` (newer shape)
  const images = p.images ?? p.image_urls;
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
    avg_rating: p.avg_rating ?? null,
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
      <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
        <div>
          <h2 className="heading-font-size font-bold text-gray-900">Products You May Like</h2>
          <p className="text-xs text-gray-500 mt-0.5">Handpicked based on this product</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="recommended-slider-prev"
            className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-[#186737] hover:border-[#186737] hover:text-white text-gray-600 transition-all duration-200 disabled:opacity-30"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button
            id="recommended-slider-next"
            className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-[#186737] hover:border-[#186737] hover:text-white text-gray-600 transition-all duration-200 disabled:opacity-30"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="py-5 px-2">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: "#recommended-slider-prev",
              nextEl: "#recommended-slider-next",
            }}
            spaceBetween={12}
            breakpoints={{
              0:    { slidesPerView: 2 },
              640:  { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
              1536: { slidesPerView: 6 },
            }}
            className="pb-2!"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id} className="h-auto!">
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default RecommendedProducts;
