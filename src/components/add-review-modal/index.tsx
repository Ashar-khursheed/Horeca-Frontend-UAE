"use client";

import { useState, useRef, useEffect } from "react";
import { Star, Upload, X, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
import { makeApiRequest } from "@/apis/axios-instance";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  onSuccess?: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

const AddReviewModal = ({
  isOpen,
  onClose,
  productId,
  onSuccess,
}: AddReviewModalProps) => {
  const router = useRouter();
  const [star, setStar] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !localStorage.getItem("token")) {
      onClose();
      router.push("/login");
    }
  }, [isOpen]);

  const reset = () => {
    setStar(0);
    setHovered(0);
    setComment("");
    setFiles([]);
    setErrors({});
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const valid: File[] = [];
    const errs: string[] = [];
    Array.from(selected).forEach((f) => {
      if (!ACCEPTED.includes(f.type))
        errs.push(`${f.name}: unsupported format`);
      else if (f.size > MAX_FILE_SIZE) errs.push(`${f.name}: exceeds 2MB`);
      else valid.push(f);
    });
    if (errs.length) setErrors((p) => ({ ...p, files: errs.join(", ") }));
    else setErrors((p) => ({ ...p, files: "" }));
    setFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!star) e.star = "Please select a rating.";
    if (!comment.trim()) e.comment = "Comment is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("product_id", String(productId));
      fd.append("star", String(star));
      fd.append("comment", comment.trim());
      files.forEach((f) => fd.append("images[]", f));

      await makeApiRequest("add-customer-reviews", {
        method: "POST",
        data: fd,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong. Please try again.";
      setErrors((p) => ({ ...p, _api: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Review"
      width="max-w-lg"
      showFooter={false}
    >
      {success ? (
        <div className="flex flex-col items-center text-center py-10 px-4">
          <div className="w-14 h-14 rounded-full bg-[#186737]/10 flex items-center justify-center mb-4">
            <CheckCircle2 size={28} className="text-[#186737]" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Review Submitted!
          </h3>
          <p className="text-sm text-gray-500">
            Thank you for your feedback. It helps others make better decisions.
          </p>
          <button
            onClick={handleClose}
            className="mt-5 h-10 px-6 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white text-sm font-bold transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="space-y-5 px-2 py-1">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div
              className="flex items-center gap-1"
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStar(s)}
                  onMouseEnter={() => setHovered(s)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={
                      s <= (hovered || star)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                </button>
              ))}
            </div>
            {errors.star && (
              <p className="text-[11px] text-red-500 mt-1">{errors.star}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setErrors((p) => ({ ...p, comment: "" }));
              }}
              placeholder="Share your experience with this product..."
              rows={4}
              className={`w-full rounded-[7px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white px-4 py-3 resize-none ${
                errors.comment
                  ? "border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
              }`}
            />
            {errors.comment && (
              <p className="text-[11px] text-red-500 mt-1">{errors.comment}</p>
            )}
          </div>

          {/* Upload Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Upload Images
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-3 h-11 px-4 rounded-[7px] border border-dashed border-gray-300 hover:border-[#186737] bg-gray-50 cursor-pointer transition-colors group"
            >
              <Upload
                size={14}
                className="text-gray-400 group-hover:text-[#186737] shrink-0 transition-colors"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors">
                Choose Files
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Max file size: 2MB • Supported: JPG, PNG, WEBP
            </p>

            {/* Selected files */}
            {files.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700"
                  >
                    <span className="max-w-[120px] truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.files && (
              <p className="text-[11px] text-red-500 mt-1">{errors.files}</p>
            )}
          </div>

          {errors._api && (
            <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-[7px] text-sm text-red-600 font-medium">
              {errors._api}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-11 rounded-[7px] bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? (
              <svg
                className="animate-spin"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeOpacity="0.3"
                  strokeWidth="3"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default AddReviewModal;


















// // ─── Custom Slider (No Swiper) ────────────────────────────────────────────────
// const ReviewSlider = ({
//   reviews,
//   helpfulVotes,
//   onHelpful,
// }: {
//   reviews: Review[];
//   helpfulVotes: Record<number, boolean>;
//   onHelpful: (id: number) => void;
// }) => {
//   const [current, setCurrent] = useState(0);
//   const [slidesPerView, setSlidesPerView] = useState(1);

//   useEffect(() => {
//     const update = () => {
//       if (window.innerWidth >= 1024) setSlidesPerView(3);
//       else if (window.innerWidth >= 640) setSlidesPerView(2);
//       else setSlidesPerView(1);
//     };
//     update();
//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, []);

//   useEffect(() => {
//     setCurrent(0);
//   }, [slidesPerView, reviews.length]);

//   const maxIndex = Math.max(0, reviews.length - slidesPerView);
//   const prev = () => setCurrent((c) => Math.max(0, c - 1));
//   const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));
//   const totalDots = maxIndex + 1;

//   // Each slide width as percentage
//   const slideWidth = 100 / slidesPerView;
//   const gap = 16; // px

//   return (
//     <div className="relative">
//       <div className="absolutes top-0s left-0 right-0 bottom-0">
//         {/* Prev Arrow */}
//         <button
//           onClick={prev}
//           disabled={current === 0}
//           className={`absolute -left-4 top-1/2 -translate-y-8 z-10 w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center transition-all ${
//             current > 0
//               ? "border-gray-200 text-gray-500 hover:border-[#186737] hover:text-[#186737]"
//               : "border-gray-100 text-gray-300 cursor-not-allowed"
//           }`}
//         >
//           <ChevronLeft size={16} strokeWidth={2} />
//         </button>

//         {/* Next Arrow */}
//         <button
//           onClick={next}
//           disabled={current >= maxIndex}
//           className={`absolute -right-4 top-1/2 -translate-y-8 z-10 w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center transition-all ${
//             current < maxIndex
//               ? "border-gray-200 text-gray-500 hover:border-[#186737] hover:text-[#186737]"
//               : "border-gray-100 text-gray-300 cursor-not-allowed"
//           }`}
//         >
//           <ChevronRight size={16} strokeWidth={2} />
//         </button>
//       </div>
//       {/* Track */}
//       <div className="overflow-hidden md:grid ">
//         <div
//           className="flex transition-transform duration-300 ease-in-out"
//           style={{
//             gap: `${gap}px`,
//             transform: `translateX(calc(-${current} * (${slideWidth}% + ${gap}px)))`,
//           }}
//         >
//           {reviews.map((review) => (
//             <div
//               key={review.id}
//               className="shrink-0"
//               style={{
//                 width: `calc(${slideWidth}% - ${(gap * (slidesPerView - 1)) / slidesPerView}px)`,
//               }}
//             >
//               <ReviewCard
//                 review={review}
//                 helpful={!!helpfulVotes[review.id]}
//                 onHelpful={() => onHelpful(review.id)}
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Dots */}
//       {totalDots > 1 && (
//         <div className="flex items-center justify-center gap-1.5 mt-4">
//           {Array.from({ length: totalDots }).map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrent(i)}
//               className={`rounded-full transition-all duration-200 ${
//                 i === current
//                   ? "w-4 h-2 bg-[#186737]"
//                   : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
//               }`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
