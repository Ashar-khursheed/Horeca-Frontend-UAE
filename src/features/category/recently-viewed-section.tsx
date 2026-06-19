"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";
import ProductCard, { RawApiProduct } from "@/components/product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function RecentlyViewedSection({ excludeId }: { excludeId?: number }) {
  const [products, setProducts] = useState<RawApiProduct[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const guestToken = localStorage.getItem("guest_token");

    if (!token && !guestToken) return;

    const url = token
      ? apiUrls.GET_RECENT_PRODUCTS(1)
      : apiUrls.GUEST_RECENT_PRODUCTS(guestToken!, 1);

    makeApiRequest<{ success: boolean; data: RawApiProduct[] }>(url)
      .then((res) => {
        const data = (res?.data ?? []).filter((p) => p.id !== excludeId);
        if (data.length) setProducts(data);
      })
      .catch(() => {});
  }, [excludeId]);

  if (products.length === 0) return null;

  return (
    <section className="md:py-7 py-3">
      <div className="global-container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-font-size font-bold text-gray-900">
            Recently Viewed
          </h2>
          <div className="flex items-center gap-2">
            <button
              id="recent-slider-prev"
              className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-[#186737] hover:border-[#186737] hover:text-white text-gray-600 transition-all duration-200 disabled:opacity-30"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button >
            <button
              id="recent-slider-next"
              className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-[#186737] hover:border-[#186737] hover:text-white text-gray-600 transition-all duration-200 disabled:opacity-30"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: "#recent-slider-prev",
            nextEl: "#recent-slider-next",
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
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto!">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
