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
import { useEffect, useState } from "react";

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
};

type RatingDist = { stars: number; count: number };

type ReviewsSectionProps = {
  avgRating: number;
  reviews: Review[];
  ratingDist: RatingDist[];
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
}) => (
  <div className="border border-gray-100 rounded-[7px] p-5 hover:border-gray-200 transition-colors h-full flex flex-col bg-white">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex xl:items-center items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#186737] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {review.author.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{review.author}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {review.verified && (
              <span className="inline-flex md:w-[125px] items-center gap-1 text-[10px] font-semibold text-[#186737] bg-[#f0f9f4] border border-[#c3e6d4] rounded-full px-2 py-0.5 ">
                <CheckCircle size={9} strokeWidth={2.5} />
                Verified Purchase
              </span>
            )}
            <span className="text-[10px] text-gray-400">{review.date}</span>
          </div>
        </div>
      </div>
      <RatingStars rating={review.rating} size={13} />
    </div>
    <p className="text-sm font-semibold text-gray-900 mb-1">{review.title}</p>
    <p className="text-sm text-gray-600 leading-relaxed flex-1">
      {review.body}
    </p>
    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
      <button
        onClick={onHelpful}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
          helpful
            ? "border-[#186737] bg-[#f0f9f4] text-[#186737]"
            : "border-gray-200 text-gray-500 hover:border-gray-300"
        }`}
      >
        <ThumbsUp size={12} strokeWidth={2} />
        Helpful ({review.helpful + (helpful ? 1 : 0)})
      </button>
    </div>
  </div>
);

// ─── Custom Slider (No Swiper) ────────────────────────────────────────────────
const ReviewSlider = ({
  reviews,
  helpfulVotes,
  onHelpful,
}: {
  reviews: Review[];
  helpfulVotes: Record<number, boolean>;
  onHelpful: (id: number) => void;
}) => {
  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setSlidesPerView(3);
      else if (window.innerWidth >= 640) setSlidesPerView(2);
      else setSlidesPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setCurrent(0);
  }, [slidesPerView, reviews.length]);

  const maxIndex = Math.max(0, reviews.length - slidesPerView);
  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));
  const totalDots = maxIndex + 1;

  // Each slide width as percentage
  const slideWidth = 100 / slidesPerView;
  const gap = 16; // px

  return (
    <div className="relative">
    <div className="absolutes top-0s left-0 right-0 bottom-0">
        {/* Prev Arrow */}
      <button
        onClick={prev}
        disabled={current === 0}
        className={`absolute -left-4 top-1/2 -translate-y-8 z-10 w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center transition-all ${
          current > 0
            ? "border-gray-200 text-gray-500 hover:border-[#186737] hover:text-[#186737]"
            : "border-gray-100 text-gray-300 cursor-not-allowed"
        }`}
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>

      {/* Next Arrow */}
      <button
        onClick={next}
        disabled={current >= maxIndex}
        className={`absolute -right-4 top-1/2 -translate-y-8 z-10 w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center transition-all ${
          current < maxIndex
            ? "border-gray-200 text-gray-500 hover:border-[#186737] hover:text-[#186737]"
            : "border-gray-100 text-gray-300 cursor-not-allowed"
        }`}
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>

    </div>
      {/* Track */}
      <div className="overflow-hidden md:grid ">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            gap: `${gap}px`,
            transform: `translateX(calc(-${current} * (${slideWidth}% + ${gap}px)))`,
          }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="shrink-0"
              style={{
                width: `calc(${slideWidth}% - ${(gap * (slidesPerView - 1)) / slidesPerView}px)`,
              }}
            >
              <ReviewCard
                review={review}
                helpful={!!helpfulVotes[review.id]}
                onHelpful={() => onHelpful(review.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {totalDots > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? "w-4 h-2 bg-[#186737]"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Reviews Section ──────────────────────────────────────────────────────────
export const ReviewsSection = ({
  avgRating,
  reviews,
  ratingDist,
}: ReviewsSectionProps) => {
  const [reviewFilter, setReviewFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("top");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({});
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
    // <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] 2xl:grid-cols-[20%_80%] gap-4">
      {/* ── Left ─────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="bg-[#f0f9f4] border border-[#c3e6d4] rounded-[7px] p-4 hidden">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Purchased this product?
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Share your honest review to help hotels, restaurants, and chefs make
            smarter choices.
          </p>
          <button className="w-full bg-[#186737] hover:bg-[#145c30] text-white text-sm font-bold py-2.5 rounded-[7px] transition-colors flex items-center justify-center gap-2">
            <MessageCircle size={15} strokeWidth={2} />
            Leave a Review
          </button>
        </div>

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
                <div key={stars} className="flex items-center gap-2 text-xs">
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

        <div className="md:px-5">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No reviews for this rating.
            </p>
          ) : (
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
  );
};
