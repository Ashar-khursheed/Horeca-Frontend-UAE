"use client";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Heart, Share2 } from "lucide-react";
import { useRef, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

const VISIBLE = 6;
const MOBILE_VISIBLE = 5;

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [mobileOffset, setMobileOffset] = useState(0);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomRect, setZoomRect] = useState<DOMRect | null>(null);

  const ZOOM_FACTOR = 2.5;
  const LENS_PCT = 100 / ZOOM_FACTOR;

  const prevImg = () => setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImg = () => setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1));

  const canScrollUp = thumbOffset > 0;
  const canScrollDown = thumbOffset + VISIBLE < images.length;
  const scrollUp = () => setThumbOffset((o) => Math.max(0, o - 1));
  const scrollDown = () => setThumbOffset((o) => Math.min(images.length - VISIBLE, o + 1));

  const canScrollLeft = mobileOffset > 0;
  const canScrollRight = mobileOffset + MOBILE_VISIBLE < images.length;
  const scrollLeft = () => setMobileOffset((o) => Math.max(0, o - 1));
  const scrollRight = () => setMobileOffset((o) => Math.min(images.length - MOBILE_VISIBLE, o + 1));

  const visibleThumbs = images.slice(thumbOffset, thumbOffset + VISIBLE);
  const mobileThumbs = images.slice(mobileOffset, mobileOffset + MOBILE_VISIBLE);

  const handleMouseEnter = () => {
    if (window.innerWidth < 1280) return;
    if (imgContainerRef.current)
      setZoomRect(imgContainerRef.current.getBoundingClientRect());
    setShowZoom(true);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100),
      y: Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100),
    });
  };

  const lensX = Math.min(Math.max(zoomPos.x - LENS_PCT / 2, 0), 100 - LENS_PCT);
  const lensY = Math.min(Math.max(zoomPos.y - LENS_PCT / 2, 0), 100 - LENS_PCT);

  return (
    <>
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col xl:flex-row gap-3">

          {/* Desktop Thumbnail Strip (vertical, xl+) */}
          {images.length > 1 && (
            <div className="hidden xl:flex flex-col gap-2 shrink-0 order-1 items-center">
              <button
                onClick={scrollUp}
                disabled={!canScrollUp}
                className={`w-16 h-6 flex items-center justify-center rounded-[6px] border transition-all ${
                  canScrollUp
                    ? "border-gray-200 text-gray-500 hover:border-[#186737] hover:text-[#186737]"
                    : "border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <ChevronUp size={16} strokeWidth={2} />
              </button>

              {visibleThumbs.map((img, i) => {
                const realIndex = thumbOffset + i;
                return (
                  <button
                    key={realIndex}
                    onClick={() => setActiveImg(realIndex)}
                    className={`w-16 h-16 rounded-[7px] border-2 overflow-hidden shrink-0 transition-all duration-200 ${
                      activeImg === realIndex
                        ? "border-[#186737] shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                );
              })}

              <button
                onClick={scrollDown}
                disabled={!canScrollDown}
                className={`w-16 h-6 flex items-center justify-center rounded-[6px] border transition-all ${
                  canScrollDown
                    ? "border-gray-200 text-gray-500 hover:border-[#186737] hover:text-[#186737]"
                    : "border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <ChevronDown size={16} strokeWidth={2} />
              </button>
            </div>
          )}

          {/* Main Image */}
          <div
            ref={imgContainerRef}
            className="relative group flex-1 xl:aspect-square overflow-hidden rounded-[7px] bg-white flex items-center justify-center cursor-crosshair order-1 xl:order-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={images[activeImg]}
              alt={productName}
              className="w-full md:h-[400px] xl:h-full object-contain p-4 transition-all duration-300 pointer-events-none select-none"
            />

            {/* Zoom Lens */}
            {showZoom && (
              <div
                className="absolute pointer-events-none"
                style={{
                  width: `${LENS_PCT}%`,
                  height: `${LENS_PCT}%`,
                  left: `${lensX}%`,
                  top: `${lensY}%`,
                  background: "rgba(173,216,230,0.35)",
                  border: "1px solid rgba(100,160,200,0.5)",
                }}
              />
            )}

           

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full border border-gray-200 shadow flex items-center justify-center transition-all hover:bg-white ${
                    showZoom ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={nextImg}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full border border-gray-200 shadow flex items-center justify-center transition-all hover:bg-white ${
                    showZoom ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </>
            )}
          </div>
           {/* Wishlist */}
            <button
              onClick={() => setWishlisted((v) => !v)}
              className={`absolute top-3 right-3 w-9 h-9 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all z-10 ${
                showZoom ? "opacity-0" : "opacity-100"
              }`}
            >
              <Heart
                size={17}
                strokeWidth={2}
                className={wishlisted ? "fill-[#186737] text-[#186737]" : "text-gray-400"}
              />
            </button>

            {/* Share */}
            <button
              className={`absolute top-3 right-14 w-9 h-9 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all z-10 ${
                showZoom ? "opacity-0" : "opacity-100"
              }`}
            >
              <Share2 size={15} className="text-gray-400" />
            </button>

          {/* Mobile Thumbnail Strip (horizontal, < xl) with left/right arrows */}
          {images.length > 1 && (
            <div className="flex xl:hidden items-center gap-2 order-2 justify-center">
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  canScrollLeft
                    ? "border-gray-200 text-gray-500 hover:border-[#186737] hover:text-[#186737]"
                    : "border-gray-100 text-gray-200 cursor-not-allowed"
                }`}
              >
                <ChevronLeft size={14} strokeWidth={2} />
              </button>

              {/* 5 Thumbnails */}
              <div className="flex gap-1.5">
                {mobileThumbs.map((img, i) => {
                  const realIndex = mobileOffset + i;
                  return (
                    <button
                      key={realIndex}
                      onClick={() => setActiveImg(realIndex)}
                      className={`w-14 h-14 rounded-[7px] border-2 overflow-hidden shrink-0 transition-all duration-200 ${
                        activeImg === realIndex
                          ? "border-[#186737] shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  );
                })}
              </div>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  canScrollRight
                    ? "border-gray-200 text-gray-500 hover:border-[#186737] hover:text-[#186737]"
                    : "border-gray-100 text-gray-200 cursor-not-allowed"
                }`}
              >
                <ChevronRight size={14} strokeWidth={2} />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Zoom Panel */}
      {showZoom && zoomRect && (
        <div
          className="fixed z-999 rounded-[7px] overflow-hidden pointer-events-none"
          style={{
            top: zoomRect.top,
            left: zoomRect.right + 16,
            width: zoomRect.height,
            height: zoomRect.height,
            boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18)",
            border: "1px solid #e5e7eb",
            backgroundImage: `url(${images[activeImg]})`,
            backgroundSize: `${ZOOM_FACTOR * 100}%`,
            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            backgroundRepeat: "no-repeat",
            backgroundColor: "white",
          }}
        />
      )}
    </>
  );
};
