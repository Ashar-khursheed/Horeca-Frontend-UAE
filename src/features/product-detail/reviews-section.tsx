// "use client";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   CheckCircle,
//   ChevronLeft,
//   ChevronRight,
//   MessageCircle,
//   Star,
//   ThumbsUp,
// } from "lucide-react";
// import { useRef, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";
// import type { Swiper as SwiperType } from "swiper";
// import { RatingStars } from "./rating-stars";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type Review = {
//   id: number;
//   author: string;
//   verified: boolean;
//   date: string;
//   rating: number;
//   title: string;
//   body: string;
//   helpful: number;
// };

// type RatingDist = { stars: number; count: number };

// type ReviewsSectionProps = {
//   avgRating: number;
//   reviews: Review[];
//   ratingDist: RatingDist[];
// };

// // ─── Single Review Card ───────────────────────────────────────────────────────
// const ReviewCard = ({
//   review,
//   helpful,
//   onHelpful,
// }: {
//   review: Review;
//   helpful: boolean;
//   onHelpful: () => void;
// }) => (
//   <div className="border border-gray-100 rounded-[7px] p-5 hover:border-gray-200 transition-colors h-full flex flex-col">
//     <div className="flex items-start justify-between gap-3 mb-3">
//       <div className="flex items-center gap-3">
//         <div className="w-9 h-9 rounded-full bg-[#186737] flex items-center justify-center text-white text-sm font-bold shrink-0">
//           {review.author.charAt(0)}
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-800">{review.author}</p>
//           <div className="flex items-center gap-2 mt-0.5 flex-wrap">
//             {review.verified && (
//               <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#186737] bg-[#f0f9f4] border border-[#c3e6d4] rounded-full px-2 py-0.5">
//                 <CheckCircle size={9} strokeWidth={2.5} />
//                 Verified Purchase
//               </span>
//             )}
//             <span className="text-[10px] text-gray-400">{review.date}</span>
//           </div>
//         </div>
//       </div>
//       <RatingStars rating={review.rating} size={13} />
//     </div>

//     <p className="text-sm font-semibold text-gray-900 mb-1">{review.title}</p>
//     <p className="text-sm text-gray-600 leading-relaxed flex-1">{review.body}</p>

//     <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
//       <button
//         onClick={onHelpful}
//         className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
//           helpful
//             ? "border-[#186737] bg-[#f0f9f4] text-[#186737]"
//             : "border-gray-200 text-gray-500 hover:border-gray-300"
//         }`}
//       >
//         <ThumbsUp size={12} strokeWidth={2} />
//         Helpful ({review.helpful + (helpful ? 1 : 0)})
//       </button>
//     </div>
//   </div>
// );

// // ─── Reviews Section ──────────────────────────────────────────────────────────
// export const ReviewsSection = ({
//   avgRating,
//   reviews,
//   ratingDist,
// }: ReviewsSectionProps) => {
//   const [reviewFilter, setReviewFilter] = useState("all");
//   const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({});
//   const swiperRef = useRef<SwiperType | null>(null);
//   const totalReviews = ratingDist.reduce((s, r) => s + r.count, 0);

//   const filtered = reviews.filter(
//     (r) => reviewFilter === "all" || r.rating === Number(reviewFilter),
//   );

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
//       {/* ── Left: Summary + CTA ─────────────────────────────────── */}
//       <div className="space-y-6">
//         {/* Leave a Review CTA */}
//         <div className="bg-[#f0f9f4] border border-[#c3e6d4] rounded-[7px] p-4">
//           <p className="text-sm font-semibold text-gray-800 mb-1">
//             Purchased this product?
//           </p>
//           <p className="text-xs text-gray-500 leading-relaxed mb-3">
//             Share your honest review to help hotels, restaurants, and chefs make
//             smarter choices.
//           </p>
//           <button className="w-full bg-[#186737] hover:bg-[#145c30] text-white text-sm font-bold py-2.5 rounded-[7px] transition-colors flex items-center justify-center gap-2">
//             <MessageCircle size={15} strokeWidth={2} />
//             Leave a Review
//           </button>
//         </div>

//         {/* Overall Rating */}
//         <div>
//           <div className="flex items-end gap-3 mb-3">
//             <span className="text-5xl font-extrabold text-gray-900">
//               {avgRating.toFixed(1)}
//             </span>
//             <div className="pb-1">
//               <RatingStars rating={avgRating} size={18} />
//               <p className="text-xs text-gray-400 mt-1">
//                 {totalReviews} ratings on average
//               </p>
//             </div>
//           </div>

//           {/* Star Distribution */}
//           <div className="space-y-1.5">
//             {ratingDist.map(({ stars, count }) => {
//               const pct = totalReviews
//                 ? Math.round((count / totalReviews) * 100)
//                 : 0;
//               return (
//                 <div key={stars} className="flex items-center gap-2 text-xs">
//                   <span className="w-3 text-right text-gray-500 font-medium">
//                     {stars}
//                   </span>
//                   <Star
//                     size={11}
//                     className="fill-amber-400 text-amber-400 shrink-0"
//                   />
//                   <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-amber-400 rounded-full transition-all"
//                       style={{ width: `${pct}%` }}
//                     />
//                   </div>
//                   <span className="w-6 text-gray-400">{count}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* How to Leave a Review */}
//         <div className="border border-gray-100 rounded-[7px] p-4 bg-gray-50">
//           <p className="text-xs font-bold text-gray-700 mb-3">
//             How to Leave a Product Review
//           </p>
//           <ol className="space-y-2">
//             {[
//               "Log in to Your HorecaStore Account.",
//               'Go to the product page and click "Review".',
//               'Go to Order History and click "Submit Review" in the list.',
//               "Rate & write a quick note, and Submit.",
//             ].map((step, i) => (
//               <li key={i} className="flex gap-2 text-xs text-gray-600">
//                 <span className="w-4 h-4 rounded-full bg-[#186737] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
//                   {i + 1}
//                 </span>
//                 {step}
//               </li>
//             ))}
//           </ol>
//         </div>
//       </div>

//       {/* ── Right: Reviews Slider ────────────────────────────────── */}
//       <div>
//         {/* Filters */}
//         <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
//           <p className="text-sm text-gray-500">{totalReviews} reviews</p>
//           <div className="flex gap-2">
//             <Select value={reviewFilter} onValueChange={setReviewFilter}>
//               <SelectTrigger className="h-8 text-xs border-gray-200 w-32 focus:ring-[#186737]">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Stars</SelectItem>
//                 <SelectItem value="5">5 Stars</SelectItem>
//                 <SelectItem value="4">4 Stars</SelectItem>
//                 <SelectItem value="3">3 Stars</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select defaultValue="top">
//               <SelectTrigger className="h-8 text-xs border-gray-200 w-36 focus:ring-[#186737]">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="top">Top Reviews</SelectItem>
//                 <SelectItem value="recent">Most Recent</SelectItem>
//                 <SelectItem value="helpful">Most Helpful</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Review Cards Slider */}
//         <div className="relative">
//           <style>{`
//             .reviews-swiper .swiper-pagination { position: static; margin-top: 16px; }
//             .reviews-swiper .swiper-pagination-bullet { width: 8px; height: 8px; background: #d1d5db; opacity: 1; }
//             .reviews-swiper .swiper-pagination-bullet-active { background: #186737; }
//             .reviews-swiper .swiper-slide { height: auto; }
//           `}</style>

//           {/* Prev Arrow */}
//           <button
//             onClick={() => swiperRef.current?.slidePrev()}
//             className="absolute -left-4 top-1/2 -translate-y-6 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all"
//           >
//             <ChevronLeft size={16} strokeWidth={2} />
//           </button>

//           {/* Next Arrow */}
//           <button
//             onClick={() => swiperRef.current?.slideNext()}
//             className="absolute -right-4 top-1/2 -translate-y-6 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all"
//           >
//             <ChevronRight size={16} strokeWidth={2} />
//           </button>

//           <Swiper
//             onSwiper={(swiper) => {
//               swiperRef.current = swiper;
//             }}
//             modules={[Pagination]}
//             slidesPerView={1}
//             spaceBetween={16}
//             pagination={{ clickable: true }}
//             className="reviews-swiper pb-10!"
//             breakpoints={{
//               640: { slidesPerView: 2 },
//               1024: { slidesPerView: 3 },
//             }}
//           >
//             {filtered.map((review) => (
//               <SwiperSlide key={review.id} className="h-auto!">
//                 <ReviewCard
//                   review={review}
//                   helpful={!!helpfulVotes[review.id]}
//                   onHelpful={() =>
//                     setHelpfulVotes((prev) => ({
//                       ...prev,
//                       [review.id]: !prev[review.id],
//                     }))
//                   }
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import AddReviewModal from "@/components/add-review-modal";
import { Modal } from "@/components/modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// ─── Types ────────────────────────────────────────────────────────────────────
type Review = {
  id: number;
  author: string;
  verified: boolean;
  date: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  images?: string[];
};

type RatingDist = { stars: number; count: number };

type ReviewsSectionProps = {
  avgRating: number;
  reviews: Review[];
  ratingDist: RatingDist[];
  productId: number;
  hasReviewed?: boolean;
};

// ─── Rating Stars ─────────────────────────────────────────────────────────────
const RatingStars = ({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={
          s <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ))}
  </div>
);

// ─── Single Review Card ───────────────────────────────────────────────────────
const ReviewCard = ({
  review,
  helpful,
  onHelpful,
}: {
  review: Review;
  helpful: boolean;
  onHelpful: () => void;
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const images = review.images ?? [];
  const hasImages = images.length > 0;

  const openAt = (i: number) => setActiveIdx(i);
  const close = () => setActiveIdx(null);
  const prev = () => setActiveIdx((i) => (i != null && i > 0 ? i - 1 : i));
  const next = () =>
    setActiveIdx((i) => (i != null && i < images.length - 1 ? i + 1 : i));

  return (
    <>
      {/* ── Card ── */}
      <div className="border border-gray-100 rounded-[10px] p-4 hover:border-[#186737]/30 hover:shadow-md transition-all duration-200 h-full flex flex-col bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#186737] to-[#22a855] flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
              {review.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {review.author}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#186737] bg-[#f0f9f4] border border-[#c3e6d4] rounded-full px-2 py-0.5">
                    <CheckCircle size={8} strokeWidth={3} />
                    Verified
                  </span>
                )}
                <span className="text-[10px] text-gray-400">{review.date}</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 mt-0.5">
            <RatingStars rating={review.rating} size={12} />
          </div>
        </div>

        {/* Title + Body */}
        {review.title && (
          <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
            {review.title}
          </p>
        )}
        <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-4">
          {review.body}
        </p>

        {/* Thumbnails */}
        {hasImages && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => openAt(i)}
                className="w-14 h-14 rounded-[6px] overflow-hidden border-2 border-gray-200 hover:border-[#186737] transition-colors shrink-0"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={onHelpful}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
              helpful
                ? "border-[#186737] bg-[#f0f9f4] text-[#186737] font-semibold"
                : "border-gray-200 text-gray-500 hover:border-[#186737]/40 hover:text-[#186737]"
            }`}
          >
            <ThumbsUp size={11} strokeWidth={2} />
            Helpful ({review.helpful + (helpful ? 1 : 0)})
          </button>
        </div>
      </div>

      {/* ── Image Modal ── */}
      <Modal
        isOpen={activeIdx !== null && hasImages}
        onClose={close}
        title="Customer Ratings & Reviews"
        width="max-w-5xl"
      >
        <div className="flex flex-col sm:flex-row gap-0 min-h-[400px]">
          {/* Left — image viewer */}
          <div className="relative bg-gray-100 flex items-center justify-center flex-1 rounded-[7px] overflow-hidden min-h-[260px]">
            {activeIdx !== null && (
              <img
                src={images[activeIdx]}
                alt={`Image ${activeIdx + 1}`}
                className="max-h-[60vh] max-w-full object-contain p-4"
              />
            )}

            {activeIdx !== null && activeIdx > 0 && (
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {activeIdx !== null && activeIdx < images.length - 1 && (
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`w-10 h-10 rounded-[5px] overflow-hidden border-2 transition-colors shrink-0 ${
                      i === activeIdx
                        ? "border-[#186737]"
                        : "border-white/60 hover:border-white"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — review details */}
          <div className="sm:w-[340px] w-full flex flex-col p-4 sm:pl-5 border-t sm:border-t-0 sm:border-l border-gray-100">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#186737] to-[#22a855] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {review.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {review.author}
                </p>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#186737]">
                    <CheckCircle size={9} strokeWidth={2.5} /> Verified Purchase
                  </span>
                )}
              </div>
            </div>

            <RatingStars rating={review.rating} size={14} />
            <span className="text-[11px] text-gray-400 mt-1 mb-3">
              {review.date}
            </span>

            {review.title && (
              <p className="text-sm font-bold text-gray-900 mb-2">
                {review.title}
              </p>
            )}
            <p className="text-sm text-gray-600 leading-relaxed">
              {review.body}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

// ─── Review Slider (Swiper) ───────────────────────────────────────────────────
const ReviewSlider = ({
  reviews,
  helpfulVotes,
  onHelpful,
}: {
  reviews: Review[];
  helpfulVotes: Record<number, boolean>;
  onHelpful: (id: number) => void;
}) => (
  <div className="relative px-5">
    <style>{`
      .reviews-swiper .swiper-pagination { position: static; margin-top: 14px; }
      .reviews-swiper .swiper-pagination-bullet { width: 8px; height: 8px; background: #d1d5db; opacity: 1; }
      .reviews-swiper .swiper-pagination-bullet-active { background: #186737; width: 16px; border-radius: 4px; }
      .reviews-swiper .swiper-slide { height: auto; }
    `}</style>

    

    <Swiper
      modules={[Navigation, Pagination]}
      navigation={{ prevEl: "#reviews-prev", nextEl: "#reviews-next" }}
      // pagination={{ clickable: true }}
      spaceBetween={12}
      breakpoints={{
        0:    { slidesPerView: 1 },
        640:  { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1480: { slidesPerView: 3 },
        1920: { slidesPerView: 3 },
      }}
      className="reviews-swiper pb-8!"
    >
      {reviews.map((review) => (
        <SwiperSlide key={review.id} className="h-auto!">
          <ReviewCard
            review={review}
            helpful={!!helpfulVotes[review.id]}
            onHelpful={() => onHelpful(review.id)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
    <div className="flex gap-2.5 justify-center mt-4">
      <button
      id="reviews-prev"
      className="absolutes left-0 top-1/2 -translate-y-8 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all disabled:opacity-30"
    >
      <ChevronLeft size={16} strokeWidth={2} />
    </button>

    <button
      id="reviews-next"
      className="absolutes right-0 top-1/2 -translate-y-8 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:border-[#186737] hover:text-[#186737] transition-all disabled:opacity-30"
    >
      <ChevronRight size={16} strokeWidth={2} />
    </button>
    </div>
  </div>
);

// ─── Reviews Section ──────────────────────────────────────────────────────────
export const ReviewsSection = ({
  avgRating,
  reviews,
  ratingDist,
  productId,
  hasReviewed = false,
}: ReviewsSectionProps) => {
  const [reviewFilter, setReviewFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("top");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({});
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const totalReviews = ratingDist.reduce((s, r) => s + r.count, 0);
  const filtered = reviews
    .filter((r) => reviewFilter === "all" || r.rating === Number(reviewFilter))
    .sort((a, b) => {
      if (sortOrder === "helpful") return b.helpful - a.helpful;
      if (sortOrder === "recent")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.rating - a.rating;
    });

  return (
    <>
      {/* <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8"> */}
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] 2xl:grid-cols-[20%_80%] gap-4">
        {/* ── Left ─────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* <div className="bg-[#f0f9f4] border border-[#c3e6d4] rounded-[7px] p-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Purchased this product?
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Share your honest review to help hotels, restaurants, and chefs make
            smarter choices.
          </p>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="w-full bg-[#186737] hover:bg-[#145c30] text-white text-sm font-bold py-2.5 rounded-[7px] transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={15} strokeWidth={2} />
            Leave a Review
          </button>
        </div> */}

          {avgRating > 0 && (
            <div>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-5xl font-extrabold text-gray-900">
                  {avgRating.toFixed(1)}
                </span>
                <div className="pb-1">
                  <RatingStars rating={avgRating} size={18} />
                  <p className="text-xs text-gray-400 mt-1">
                    {totalReviews} ratings on average
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                {ratingDist.map(({ stars, count }) => {
                  const pct = totalReviews
                    ? Math.round((count / totalReviews) * 100)
                    : 0;
                  return (
                    <div
                      key={stars}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className="w-3 text-right text-gray-500 font-medium">
                        {stars}
                      </span>
                      <Star
                        size={11}
                        className="fill-amber-400 text-amber-400 shrink-0"
                      />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-gray-400">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border border-gray-100 rounded-[7px] p-4 bg-gray-50">
            <p className="text-xs font-bold text-gray-700 mb-3">
              How to Leave a Product Review
            </p>
            <ol className="space-y-2">
              {[
                "Log in to Your HorecaStore Account.",
                'Go to the product page and click "Review".',
                'Go to Order History and click "Submit Review" in the list.',
                "Rate & write a quick note, and Submit.",
              ].map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#186737] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          {!hasReviewed && (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="bg-[#186737] md:hidden block px-4 hover:bg-[#145c30] text-white text-sm font-bold py-2.5 rounded-[7px] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={15} strokeWidth={2} />
              Leave a Review
            </button>
          )}
        </div>

        {/* ── Right ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
            <p className="text-sm text-gray-500">{totalReviews} reviews</p>
            <div className="flex gap-2">
              <Select value={reviewFilter} onValueChange={setReviewFilter}>
                <SelectTrigger className="h-8 text-xs border-gray-200 w-32 focus:ring-[#186737]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-8 text-xs border-gray-200 w-36 focus:ring-[#186737]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top Reviews</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="">
            {filtered.length > 0 && (
              <ReviewSlider
                reviews={filtered}
                helpfulVotes={helpfulVotes}
                onHelpful={(id) =>
                  setHelpfulVotes((prev) => ({ ...prev, [id]: !prev[id] }))
                }
              />
            )}
          </div>
        </div>
      </div>

      <AddReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productId={productId}
      />
    </>
  );
};
