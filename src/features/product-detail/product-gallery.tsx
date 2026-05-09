"use client";

import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import { useRef, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomRect, setZoomRect] = useState<DOMRect | null>(null);

  const ZOOM_FACTOR = 2.5;
  const LENS_PCT = 100 / ZOOM_FACTOR;

  const prevImg = () =>
    setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImg = () =>
    setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1));

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
          {/* Thumbnail Strip — horizontal on mobile/tablet, vertical on xl+ */}
          {images.length > 1 && (
            <div className="flex flex-row xl:flex-col gap-2 xl:shrink-0 justify-center overflow-x-auto xl:overflow-x-visible order-2 xl:order-1 pb-1 xl:pb-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 xl:w-16 xl:h-16 rounded-[7px] border-2 overflow-hidden shrink-0 transition-all duration-200 ${
                    activeImg === i
                      ? "border-[#186737] shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
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
                className={
                  wishlisted ? "fill-[#186737] text-[#186737]" : "text-gray-400"
                }
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
        </div>
      </div>

      {/* Zoom Panel — fixed, positioned to the right of gallery */}
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
