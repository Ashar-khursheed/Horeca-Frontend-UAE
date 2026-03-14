// // // // "use client";

// // // // import { useState, useRef, useEffect, useCallback } from "react";
// // // // import Link from "next/link";
// // // // import { Heart, Minus, Plus, ShoppingCart, Truck, Star, CheckCircle } from "lucide-react";

// // // // // ─── API Response Types ───────────────────────────────────────────────────────
// // // // export interface ApiProduct {
// // // //   id: number;
// // // //   name: string;
// // // //   url: string;
// // // //   sku: string;
// // // //   category_url: string;
// // // //   parent_category_url: string;
// // // //   price: number;
// // // //   sale_price: number;
// // // //   original_price: number;
// // // //   front_sale_price: number;
// // // //   best_price: number;
// // // //   avg_rating: number | null;
// // // //   total_reviews: number;
// // // //   delivery_days: string;
// // // //   currency: string;
// // // //   images: string[];
// // // //   alt_tags: string[];
// // // //   in_wishlist: boolean;
// // // //   min_quantity: number;
// // // //   is_fixed: number;
// // // //   quote_available: number | null;
// // // //   selling_type: { attribute_value: string; attribute_value_unit: string };
// // // //   free_shipping: number;
// // // //   return_policy: string;
// // // //   isRequired: boolean;
// // // // }

// // // // interface ProductCardProps {
// // // //   product: ApiProduct;
// // // //   onAddToCart?: (product: ApiProduct, quantity: number) => void;
// // // //   onWishlistToggle?: (product: ApiProduct, inWishlist: boolean) => void;
// // // // }

// // // // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // // // const getRatingStars = (rating: number) =>
// // // //   [1, 2, 3, 4, 5].map((s) => (
// // // //     <Star
// // // //       key={s}
// // // //       size={10}
// // // //       className={
// // // //         s <= Math.round(rating)
// // // //           ? "fill-amber-400 text-amber-400"
// // // //           : "fill-gray-200 text-gray-200"
// // // //       }
// // // //     />
// // // //   ));

// // // // const formatPrice = (price: number) => {
// // // //   const str = Number(price).toLocaleString("en-US", {
// // // //     minimumFractionDigits: 2,
// // // //     maximumFractionDigits: 2,
// // // //   });
// // // //   const [int, dec] = str.split(".");
// // // //   return { int, dec };
// // // // };

// // // // // ─── Quantity Counter (exported for reuse) ────────────────────────────────────
// // // // export const QuantityCounter = ({
// // // //   count,
// // // //   min,
// // // //   onIncrement,
// // // //   onDecrement,
// // // //   onChange,
// // // //   disabled = false,
// // // // }: {
// // // //   count: number;
// // // //   min: number;
// // // //   onIncrement: () => void;
// // // //   onDecrement: () => void;
// // // //   onChange: (v: number) => void;
// // // //   disabled?: boolean;
// // // // }) => (
// // // //   <div className="flex items-center h-9 border border-[#BCE3C9] rounded-lg overflow-hidden bg-white flex-shrink-0">
// // // //     <button
// // // //       onClick={onDecrement}
// // // //       disabled={count <= min || disabled}
// // // //       className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-[#186737] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
// // // //     >
// // // //       <Minus size={12} strokeWidth={2.5} />
// // // //     </button>
// // // //     <input
// // // //       type="text"
// // // //       value={count}
// // // //       disabled={disabled}
// // // //       onChange={(e) => {
// // // //         const v = parseInt(e.target.value);
// // // //         if (!isNaN(v) && v >= 1 && v <= 99) onChange(v);
// // // //       }}
// // // //       className="w-7 text-center text-xs font-bold text-[#186737] border-0 outline-none bg-transparent"
// // // //     />
// // // //     <button
// // // //       onClick={onIncrement}
// // // //       disabled={count >= 99 || disabled}
// // // //       className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-[#186737] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
// // // //     >
// // // //       <Plus size={12} strokeWidth={2.5} />
// // // //     </button>
// // // //   </div>
// // // // );

// // // // // ─── Add To Cart Button (exported for reuse) ──────────────────────────────────
// // // // export const AddToCartButton = ({
// // // //   onClick,
// // // //   label = "Add To Cart",
// // // //   variant = "cart",
// // // //   success = false,
// // // // }: {
// // // //   onClick: () => void;
// // // //   label?: string;
// // // //   variant?: "cart" | "quote";
// // // //   success?: boolean;
// // // // }) => (
// // // //   <button
// // // //     onClick={onClick}
// // // //     className={`
// // // //       flex-1 h-9 rounded-lg text-[12px] font-semibold
// // // //       flex items-center justify-center gap-1.5
// // // //       transition-all duration-200 active:scale-[0.98]
// // // //       ${
// // // //         success
// // // //           ? "bg-emerald-600 text-white"
// // // //           : variant === "quote"
// // // //           ? "bg-[#A6131D] hover:bg-[#7f1015] text-white"
// // // //           : "bg-[#186737] hover:bg-[#0f4d28] text-white"
// // // //       }
// // // //     `}
// // // //   >
// // // //     {success ? (
// // // //       <CheckCircle size={13} strokeWidth={2} />
// // // //     ) : variant !== "quote" ? (
// // // //       <ShoppingCart size={13} strokeWidth={2} />
// // // //     ) : null}
// // // //     {success ? "Added!" : label}
// // // //   </button>
// // // // );

// // // // // ─── Main ProductCard ─────────────────────────────────────────────────────────
// // // // export const ProductCard = ({
// // // //   product,
// // // //   onAddToCart,
// // // //   onWishlistToggle,
// // // // }: ProductCardProps) => {
// // // //   const minQty = product.min_quantity || 1;
// // // //   const isFixed = product.is_fixed === 1;
// // // //   const isQuote = product.quote_available === 1;

// // // //   const [count, setCount] = useState(minQty);
// // // //   const [wishlisted, setWishlisted] = useState(product.in_wishlist);
// // // //   const [added, setAdded] = useState(false);

// // // //   // Price logic — API: sale_price=0 means no sale
// // // //   const hasSale =
// // // //     product.sale_price > 0 && product.sale_price !== product.original_price;
// // // //   const displayPrice = hasSale ? product.sale_price : product.original_price;
// // // //   const discountPct = hasSale
// // // //     ? Math.round(((product.original_price - product.sale_price) / product.original_price) * 100)
// // // //     : 0;

// // // //   const { int, dec } = formatPrice(displayPrice);

// // // //   // ── Hover image slider ──────────────────────────────────────────────────────
// // // //   const images = product.images?.length > 0 ? product.images : [""];
// // // //   const hasMultipleImages = images.length > 1;
// // // //   const [imgIndex, setImgIndex] = useState(0);
// // // //   const [isHovered, setIsHovered] = useState(false);
// // // //   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

// // // //   const startSlide = useCallback(() => {
// // // //     if (!hasMultipleImages) return;
// // // //     setIsHovered(true);
// // // //     intervalRef.current = setInterval(() => {
// // // //       setImgIndex((prev) => (prev + 1) % images.length);
// // // //     }, 800);
// // // //   }, [hasMultipleImages, images.length]);

// // // //   const stopSlide = useCallback(() => {
// // // //     setIsHovered(false);
// // // //     if (intervalRef.current) {
// // // //       clearInterval(intervalRef.current);
// // // //       intervalRef.current = null;
// // // //     }
// // // //     setImgIndex(0);
// // // //   }, []);

// // // //   useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

// // // //   // ── Handlers ────────────────────────────────────────────────────────────────
// // // //   const handleIncrement = (e: React.MouseEvent) => {
// // // //     e.preventDefault(); e.stopPropagation();
// // // //     if (isFixed) { if (count + minQty <= 99) setCount(count + minQty); }
// // // //     else if (count < 99) setCount(count + 1);
// // // //   };
// // // //   const handleDecrement = (e: React.MouseEvent) => {
// // // //     e.preventDefault(); e.stopPropagation();
// // // //     if (isFixed) { if (count - minQty >= minQty) setCount(count - minQty); }
// // // //     else if (count > minQty) setCount(count - 1);
// // // //   };
// // // //   const handleAddToCart = (e: React.MouseEvent) => {
// // // //     e.preventDefault(); e.stopPropagation();
// // // //     if (onAddToCart) onAddToCart(product, count);
// // // //     setAdded(true);
// // // //     setTimeout(() => setAdded(false), 2000);
// // // //   };
// // // //   const handleWishlist = (e: React.MouseEvent) => {
// // // //     e.preventDefault(); e.stopPropagation();
// // // //     const next = !wishlisted;
// // // //     setWishlisted(next);
// // // //     if (onWishlistToggle) onWishlistToggle(product, next);
// // // //   };

// // // //   const productLink = `/${product.parent_category_url}/${product.url}`;

// // // //   return (
// // // //     <div
// // // //       className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden
// // // //         hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] hover:border-slate-300 transition-all duration-250
// // // //         flex flex-col h-full"
// // // //       onMouseEnter={startSlide}
// // // //       onMouseLeave={stopSlide}
// // // //     >
// // // //       {/* ── IMAGE SECTION — fixed height ────────────────────────────────────── */}
// // // //       <div className="relative overflow-hidden bg-slate-50 h-[190px] flex-shrink-0">

// // // //         {/* Discount badge */}
// // // //         {discountPct > 0 && (
// // // //           <div className="absolute top-2 left-2 z-10">
// // // //             <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full leading-none">
// // // //               -{discountPct}%
// // // //             </span>
// // // //           </div>
// // // //         )}

// // // //         {/* Free shipping badge */}
// // // //         {product.free_shipping === 1 && (
// // // //           <div className="absolute top-2 left-2 z-10 mt-0" style={{ top: discountPct > 0 ? "28px" : "8px" }}>
// // // //             <span className="bg-[#186737] text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full">
// // // //               Free Ship
// // // //             </span>
// // // //           </div>
// // // //         )}

// // // //         {/* Wishlist */}
// // // //         <button
// // // //           onClick={handleWishlist}
// // // //           className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full
// // // //             shadow-sm flex items-center justify-center border border-slate-100
// // // //             hover:scale-110 transition-transform duration-200"
// // // //         >
// // // //           <Heart
// // // //             size={13}
// // // //             strokeWidth={2}
// // // //             className={wishlisted ? "fill-red-500 text-red-500" : "text-slate-400"}
// // // //           />
// // // //         </button>

// // // //         {/* Image — slides on hover */}
// // // //         <Link href={productLink} className="block w-full h-full">
// // // //           <div className="relative w-full h-full p-3 flex items-center justify-center overflow-hidden">
// // // //             {images.map((img, i) => (
// // // //               <img
// // // //                 key={i}
// // // //                 src={img}
// // // //                 alt={product.alt_tags?.[i] || product.name}
// // // //                 loading={i === 0 ? "eager" : "lazy"}
// // // //                 className="absolute inset-0 w-full h-full object-contain p-3 transition-opacity duration-300"
// // // //                 style={{ opacity: imgIndex === i ? 1 : 0 }}
// // // //                 onError={(e) => { e.currentTarget.src = ""; }}
// // // //               />
// // // //             ))}
// // // //           </div>
// // // //         </Link>

// // // //         {/* Image dots indicator */}
// // // //         {hasMultipleImages && (
// // // //           <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
// // // //             {images.slice(0, 5).map((_, i) => (
// // // //               <span
// // // //                 key={i}
// // // //                 className="transition-all duration-300 rounded-full"
// // // //                 style={{
// // // //                   width: imgIndex === i ? "14px" : "5px",
// // // //                   height: "5px",
// // // //                   background: imgIndex === i ? "#186737" : "#cbd5e1",
// // // //                 }}
// // // //               />
// // // //             ))}
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* ── CONTENT SECTION — flex-grow fills remaining space ───────────────── */}
// // // //       <div className="flex flex-col flex-1 p-3">

// // // //         {/* Name — fixed 2 lines */}
// // // //         <Link href={productLink}>
// // // //           <h3 className="text-[12.5px] font-semibold text-slate-800 line-clamp-2 leading-snug
// // // //             hover:text-[#186737] transition-colors min-h-[36px]">
// // // //             {product.name}
// // // //           </h3>
// // // //         </Link>

// // // //         {/* SKU */}
// // // //         <p className="text-[10.5px] text-slate-400 font-medium truncate mt-1">
// // // //           Model: {product.sku}
// // // //         </p>

// // // //         {/* Rating — placeholder div if no rating (keeps height consistent) */}
// // // //         <div className="h-[20px] flex items-center mt-1.5">
// // // //           {product.avg_rating ? (
// // // //             <div className="flex items-center gap-1.5">
// // // //               <div className="flex items-center gap-0.5">
// // // //                 {getRatingStars(product.avg_rating)}
// // // //               </div>
// // // //               <span className="text-[10.5px] font-bold text-slate-600">
// // // //                 {product.avg_rating.toFixed(1)}
// // // //               </span>
// // // //               {product.total_reviews > 0 && (
// // // //                 <span className="text-[10px] text-slate-400">
// // // //                   ({product.total_reviews})
// // // //                 </span>
// // // //               )}
// // // //             </div>
// // // //           ) : (
// // // //             <span className="text-[10px] text-slate-300 italic">No reviews yet</span>
// // // //           )}
// // // //         </div>

// // // //         {/* Delivery */}
// // // //         <div className="flex items-center gap-1 mt-1.5 h-[18px]">
// // // //           <Truck size={11} className="text-[#186737] flex-shrink-0" />
// // // //           <span className="text-[10.5px] text-slate-500 truncate">
// // // //             {product.delivery_days ? `Ships in ${product.delivery_days}` : "Fast Shipping"}
// // // //           </span>
// // // //         </div>

// // // //         {/* ── Price ── push to bottom with mt-auto */}
// // // //         <div className="mt-auto pt-2">
// // // //           {isQuote ? (
// // // //             <div className="min-h-[44px] flex flex-col justify-center">
// // // //               <p className="text-[12px] text-[#186737] font-semibold">Can't See the Price?</p>
// // // //               <p className="text-[10px] text-slate-400 leading-snug">Request a quote for best pricing.</p>
// // // //             </div>
// // // //           ) : (
// // // //             <div className="min-h-[44px]">
// // // //               {/* Sale price display */}
// // // //               <div className="flex items-baseline gap-1.5 flex-wrap">
// // // //                 <div className="flex items-start leading-none">
// // // //                   <span className="text-[11px] font-bold text-slate-700 mt-[3px]">
// // // //                     {product.currency || "$"}
// // // //                   </span>
// // // //                   <span className={`text-[21px] font-extrabold leading-none tracking-tight ${hasSale ? "text-[#186737]" : "text-slate-900"}`}>
// // // //                     {int}
// // // //                   </span>
// // // //                   <span className={`text-[11px] font-bold mt-[3px] ${hasSale ? "text-[#186737]" : "text-slate-900"}`}>
// // // //                     .{dec}
// // // //                   </span>
// // // //                   {product.selling_type?.attribute_value_unit && (
// // // //                     <span className="text-[9.5px] text-slate-400 ml-0.5 mt-1.5 font-medium">
// // // //                       /{product.selling_type.attribute_value_unit}
// // // //                     </span>
// // // //                   )}
// // // //                 </div>
// // // //                 {hasSale && (
// // // //                   <span className="text-[10.5px] text-slate-400 line-through">
// // // //                     {product.currency || "$"}{Number(product.original_price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// // // //                   </span>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         {/* ── Counter + Add to Cart ── */}
// // // //         <div className="flex items-center gap-2 mt-2">
// // // //           {!isQuote && (
// // // //             <QuantityCounter
// // // //               count={count}
// // // //               min={minQty}
// // // //               onIncrement={handleIncrement as any}
// // // //               onDecrement={handleDecrement as any}
// // // //               onChange={setCount}
// // // //               disabled={false}
// // // //             />
// // // //           )}
// // // //           <AddToCartButton
// // // //             onClick={handleAddToCart as any}
// // // //             label={isQuote ? "Request a Quote" : "Add To Cart"}
// // // //             variant={isQuote ? "quote" : "cart"}
// // // //             success={added}
// // // //           />
// // // //         </div>

// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ProductCard;



// // // "use client";

// // // import { useState, useRef, useEffect, useCallback } from "react";
// // // import Link from "next/link";
// // // import {
// // //   Heart,
// // //   Minus,
// // //   Plus,
// // //   ShoppingCart,
// // //   Star,
// // //   Truck,
// // // } from "lucide-react";

// // // // ─── Types ─────────────────────────────────────────────────────────────────
// // // export interface ApiProduct {
// // //   id: number;
// // //   name: string;
// // //   url: string;
// // //   sku: string;
// // //   category_url: string;
// // //   parent_category_url: string;
// // //   price: number;
// // //   sale_price: number;
// // //   original_price: number;
// // //   front_sale_price: number;
// // //   best_price: number;
// // //   avg_rating: number | null;
// // //   total_reviews: number;
// // //   delivery_days: string;
// // //   currency: string;
// // //   images: string[];
// // //   alt_tags: string[];
// // //   in_wishlist: boolean;
// // //   min_quantity: number;
// // //   is_fixed: number;
// // //   quote_available: number | null;
// // //   selling_type: { attribute_value: string; attribute_value_unit: string };
// // //   free_shipping: number;
// // //   return_policy: string;
// // //   isRequired: boolean;
// // // }

// // // interface ProductCardProps {
// // //   product: ApiProduct;
// // //   newUrl?: string;
// // //   onAddToCart?: (product: ApiProduct, quantity: number) => void;
// // //   onWishlistToggle?: (product: ApiProduct, inWishlist: boolean) => void;
// // // }

// // // // ─── Rating Stars ───────────────────────────────────────────────────────────
// // // const RatingStars = ({ rating }: { rating: number }) => (
// // //   <div className="flex items-center gap-[2px]">
// // //     {[1, 2, 3, 4, 5].map((s) => (
// // //       <Star
// // //         key={s}
// // //         size={12}
// // //         className={
// // //           s <= Math.round(rating)
// // //             ? "fill-amber-400 text-amber-400"
// // //             : "fill-gray-200 text-gray-200"
// // //         }
// // //       />
// // //     ))}
// // //   </div>
// // // );

// // // // ─── Quantity Counter (reusable export) ───────────────────────────────────
// // // export const QuantityCounter = ({
// // //   count,
// // //   min,
// // //   onIncrement,
// // //   onDecrement,
// // //   onChange,
// // // }: {
// // //   count: number;
// // //   min: number;
// // //   onIncrement: (e: React.MouseEvent) => void;
// // //   onDecrement: (e: React.MouseEvent) => void;
// // //   onChange: (v: number) => void;
// // // }) => (
// // //   <div className="flex items-center h-[44px] border border-[#BCE3C9] rounded-[4px] overflow-hidden bg-white flex-shrink-0 w-[90px]">
// // //     <button
// // //       onClick={onDecrement}
// // //       disabled={count <= min}
// // //       className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
// // //     >
// // //       <Minus size={16} className="text-[#4B5563]" />
// // //     </button>
// // //     <input
// // //       type="text"
// // //       value={count}
// // //       onChange={(e) => {
// // //         const v = parseInt(e.target.value);
// // //         if (!isNaN(v) && v >= 1 && v <= 99) onChange(v);
// // //       }}
// // //       className="w-8 text-center text-[15px] font-semibold text-[#186737] border-0 outline-none bg-transparent"
// // //     />
// // //     <button
// // //       onClick={onIncrement}
// // //       disabled={count >= 99}
// // //       className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
// // //     >
// // //       <Plus size={16} className="text-[#4B5563]" />
// // //     </button>
// // //   </div>
// // // );

// // // // ─── Add To Cart Button (reusable export) ────────────────────────────────
// // // export const AddToCartButton = ({
// // //   onClick,
// // //   label = "Add To Cart",
// // //   variant = "cart",
// // // }: {
// // //   onClick: (e: React.MouseEvent) => void;
// // //   label?: string;
// // //   variant?: "cart" | "quote";
// // // }) => (
// // //   <button
// // //     onClick={onClick}
// // //     className={[
// // //       "flex-1 h-[44px] rounded-[4px] text-[14px] font-semibold",
// // //       "flex items-center justify-center gap-2 transition-all duration-300",
// // //       variant === "quote"
// // //         ? "bg-[#A6131D] hover:bg-[#7f1015] text-white"
// // //         : "bg-[#186737] hover:bg-[#0f4d28] text-white",
// // //     ].join(" ")}
// // //   >
// // //     {variant !== "quote" && <ShoppingCart size={15} strokeWidth={2} />}
// // //     {label}
// // //   </button>
// // // );

// // // // ─── Main ProductCard ─────────────────────────────────────────────────────
// // // export const ProductCard = ({
// // //   product,
// // //   newUrl = "products",
// // //   onAddToCart,
// // //   onWishlistToggle,
// // // }: ProductCardProps) => {
// // //   const minQty = product.min_quantity || 1;
// // //   const isFixed = product.is_fixed === 1;
// // //   const isQuote = product.quote_available === 1;

// // //   const [count, setCount] = useState(minQty);
// // //   const [wishlisted, setWishlisted] = useState(product.in_wishlist);

// // //   // ── Price logic (API: sale_price=0 means no sale) ────────────────────
// // //   const hasSale =
// // //     product.sale_price > 0 &&
// // //     Number(product.sale_price) !== 0 &&
// // //     product.sale_price !== product.original_price;

// // //   const activePrice = hasSale ? product.sale_price : product.original_price;

// // //   const discountPct = hasSale
// // //     ? ((product.original_price - product.sale_price) / product.original_price) * 100
// // //     : 0;

// // //   const fmtPrice = (n: number) =>
// // //     Number(n).toLocaleString("en-US", {
// // //       minimumFractionDigits: 2,
// // //       maximumFractionDigits: 2,
// // //     });

// // //   const [priceInt, priceDec] = fmtPrice(activePrice).split(".");

// // //   // ── Hover image slider ───────────────────────────────────────────────
// // //   const images = product.images?.length > 0 ? product.images : [""];
// // //   const hasMultipleImages = images.length > 1;
// // //   const [imgIndex, setImgIndex] = useState(0);
// // //   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

// // //   const startSlide = useCallback(() => {
// // //     if (!hasMultipleImages) return;
// // //     intervalRef.current = setInterval(() => {
// // //       setImgIndex((prev) => (prev + 1) % Math.min(images.length, 5));
// // //     }, 900);
// // //   }, [hasMultipleImages, images.length]);

// // //   const stopSlide = useCallback(() => {
// // //     if (intervalRef.current) {
// // //       clearInterval(intervalRef.current);
// // //       intervalRef.current = null;
// // //     }
// // //     setImgIndex(0);
// // //   }, []);

// // //   useEffect(
// // //     () => () => {
// // //       if (intervalRef.current) clearInterval(intervalRef.current);
// // //     },
// // //     []
// // //   );

// // //   // ── Handlers ────────────────────────────────────────────────────────
// // //   const handleIncrement = (e: React.MouseEvent) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();
// // //     if (isFixed) {
// // //       if (count + minQty <= 99) setCount(count + minQty);
// // //     } else if (count < 99) {
// // //       setCount(count + 1);
// // //     }
// // //   };

// // //   const handleDecrement = (e: React.MouseEvent) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();
// // //     if (isFixed) {
// // //       if (count - minQty >= minQty) setCount(count - minQty);
// // //     } else if (count > minQty) {
// // //       setCount(count - 1);
// // //     }
// // //   };

// // //   const handleAddToCart = (e: React.MouseEvent) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();
// // //     if (onAddToCart) onAddToCart(product, count);
// // //   };

// // //   const handleWishlist = (e: React.MouseEvent) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();
// // //     const next = !wishlisted;
// // //     setWishlisted(next);
// // //     if (onWishlistToggle) onWishlistToggle(product, next);
// // //   };

// // //   const productLink = `/${product.parent_category_url ?? newUrl}/${product.url}`;
// // //   const displayImages = images.slice(0, 5);

// // //   return (
// // //     <div
// // //       className="bg-white rounded-md shadow-xl overflow-hidden cursor-pointer flex flex-col h-full"
// // //       onMouseEnter={startSlide}
// // //       onMouseLeave={stopSlide}
// // //     >
// // //       {/* ── IMAGE AREA ───────────────────────────────────────────────── */}
// // //       <div className="relative">
// // //         {/* Discount badge */}
// // //         {hasSale && discountPct > 0 && (
// // //           <div className="absolute top-3 left-3 z-10">
// // //             <span className="bg-[#FCE8EA] text-red-500 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
// // //               {discountPct.toFixed(2)}% off
// // //             </span>
// // //           </div>
// // //         )}

// // //         {/* Wishlist button — lucide Heart */}
// // //         <button
// // //           onClick={handleWishlist}
// // //           className="absolute top-2 right-2 z-10 w-[40px] h-[40px] bg-gray-200 shadow-lg shadow-[#ccc]
// // //             rounded-md flex items-center justify-center hover:bg-gray-300 transition-all duration-300"
// // //         >
// // //           <Heart
// // //             size={20}
// // //             strokeWidth={2}
// // //             className={
// // //               wishlisted
// // //                 ? "fill-[#186737] text-[#186737]"   // filled green when wishlisted
// // //                 : "text-[#62666c]"                    // outline gray otherwise
// // //             }
// // //           />
// // //         </button>

// // //         {/* Product images — opacity fade on hover */}
// // //         <Link href={productLink}>
// // //           <div className="relative w-full aspect-square overflow-hidden">
// // //             {displayImages.map((img, i) => (
// // //               <img
// // //                 key={i}
// // //                 src={img}
// // //                 alt={product.alt_tags?.[i] || product.name}
// // //                 loading={i === 0 ? "eager" : "lazy"}
// // //                 className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
// // //                 style={{ opacity: imgIndex === i ? 1 : 0 }}
// // //                 onError={(e) => {
// // //                   (e.currentTarget as HTMLImageElement).style.opacity = "0";
// // //                 }}
// // //               />
// // //             ))}
// // //           </div>
// // //         </Link>

// // //         {/* Slider dots */}
// // //         {hasMultipleImages ? (
// // //           <div className="flex justify-center items-center gap-2 py-2">
// // //             {displayImages.map((_, i) => (
// // //               <span
// // //                 key={i}
// // //                 className="rounded-full block transition-all duration-300"
// // //                 style={{
// // //                   width: imgIndex === i ? "20px" : "8px",
// // //                   height: "8px",
// // //                   background: imgIndex === i ? "#186737" : "#d1d5db",
// // //                 }}
// // //               />
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <div className="h-4" />
// // //         )}
// // //       </div>

// // //       {/* ── CONTENT AREA ─────────────────────────────────────────────── */}
// // //       <div className="p-3 md:px-4 md:pb-4 flex flex-col flex-1">
// // //         {/* Name */}
// // //         <Link href={productLink}>
// // //           <p
// // //             className="font-bold text-sm lg:text-[15px] line-clamp-2 hover:underline cursor-pointer leading-snug"
// // //             style={{ minHeight: "40px" }}
// // //           >
// // //             {product.name}
// // //           </p>
// // //         </Link>

// // //         {/* SKU */}
// // //         <p className="mt-1.5 font-semibold text-[#4B5563] text-xs" title={product.sku}>
// // //           Model No: {product.sku}
// // //         </p>

// // //         {/* Rating + Shipping row */}
// // //         <div className="flexs flex-wrap items-center gap-x-2 gap-y-0.5 mt-2">
// // //           {product.avg_rating && (
// // //             <div className="flex items-center gap-1 shrink-0">
// // //               <RatingStars rating={product.avg_rating} />
// // //               <p className="text-[#4B5563] text-[13px] font-bold leading-none mt-[1px]">
// // //                 {product.avg_rating.toFixed(1)}
// // //               </p>
// // //             </div>
// // //           )}
// // //           {/* Truck icon (lucide) instead of GrDeliver */}
// // //           <p className="font-semibold text-[13px] text-[#4B5563] flex items-center gap-1">
// // //             <Truck size={14} className="text-[#186737] flex-shrink-0" />
// // //             Shipping charges apply
// // //           </p>
// // //         </div>

// // //         {/* Ships in X Days */}
// // //         <p className="mt-1 text-xs md:text-sm text-[#4B5563]">
// // //           {product.delivery_days ? (
// // //             <span className="font-semibold text-black">
// // //               Mostly Ships in {product.delivery_days}
// // //             </span>
// // //           ) : (
// // //             <span>Now Shipping Faster</span>
// // //           )}
// // //         </p>

// // //         {/* ── PRICE — mt-auto pushes to bottom ─────────────────────── */}
// // //         <div className="mt-auto pt-3">
// // //           {isQuote ? (
// // //             <div style={{ minHeight: "60px" }}>
// // //               <h2 className="text-[#186737] text-[15px] font-normal">
// // //                 Can&apos;t See the Price?
// // //               </h2>
// // //               <p className="text-[#64748B] text-[12px] mt-1 leading-snug">
// // //                 Click &ldquo;Request A Quote&rdquo; to receive your best prices.
// // //               </p>
// // //             </div>
// // //           ) : (
// // //             <div style={{ minHeight: "60px" }}>
// // //               {/* Price line: -11%  $19,990.00  /Each */}
// // //               <div className="flex items-center gap-2 flex-wrap leading-none">
// // //                 {hasSale && (
// // //                   <span className="text-red-600 text-sm font-normal relative top-[2px]">
// // //                     -{Math.round(discountPct)}%
// // //                   </span>
// // //                 )}
// // //                 <div className="flex items-baseline gap-[2px]">
// // //                   <b
// // //                     className={`font-bold text-[22px] sm:text-[24px] leading-none ${
// // //                       hasSale ? "text-[#186737]" : "text-black"
// // //                     }`}
// // //                   >
// // //                     <span className="text-[14px] font-bold mr-[1px]">$</span>
// // //                     {priceInt}
// // //                   </b>
// // //                   <span
// // //                     className={`text-[14px] sm:text-[18px] font-bold leading-none ${
// // //                       hasSale ? "text-[#186737] ml-[2px]" : "text-black ml-[1px]"
// // //                     }`}
// // //                   >
// // //                     .{priceDec}
// // //                   </span>
// // //                 </div>
// // //                 {product.selling_type?.attribute_value_unit && (
// // //                   <span className="text-sm text-[#4B5563] font-medium">
// // //                     /{product.selling_type.attribute_value_unit}
// // //                   </span>
// // //                 )}
// // //               </div>

// // //               {/* WAS price / spacer */}
// // //               {hasSale ? (
// // //                 <p className="text-[#4B5563] font-semibold text-sm line-through mt-1">
// // //                   WAS {product.currency || "$"} {fmtPrice(product.original_price)}
// // //                 </p>
// // //               ) : (
// // //                 <div className="h-[22px]" />
// // //               )}
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* ── COUNTER + CTA ────────────────────────────────────────── */}
// // //         <div className="flex gap-2 items-center w-full mt-3">
// // //           {!isQuote && (
// // //             <QuantityCounter
// // //               count={count}
// // //               min={minQty}
// // //               onIncrement={handleIncrement}
// // //               onDecrement={handleDecrement}
// // //               onChange={setCount}
// // //             />
// // //           )}
// // //           <AddToCartButton
// // //             onClick={handleAddToCart}
// // //             label={isQuote ? "Request a Quote" : "Add To Cart"}
// // //             variant={isQuote ? "quote" : "cart"}
// // //           />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ProductCard;


// // "use client";

// // import { useState, useRef, useEffect, useCallback } from "react";
// // import Link from "next/link";
// // import {
// //   Heart,
// //   Minus,
// //   Plus,
// //   ShoppingCart,
// //   Star,
// //   Truck,
// //   CheckCircle,
// // } from "lucide-react";

// // // ─── Types ──────────────────────────────────────────────────────────────────
// // export interface ApiProduct {
// //   id: number;
// //   name: string;
// //   url: string;
// //   sku: string;
// //   category_url: string;
// //   parent_category_url: string;
// //   price: number;
// //   sale_price: number;
// //   original_price: number;
// //   front_sale_price: number;
// //   best_price: number;
// //   avg_rating: number | null;
// //   total_reviews: number;
// //   delivery_days: string;
// //   currency: string;
// //   images: string[];
// //   alt_tags: string[];
// //   in_wishlist: boolean;
// //   min_quantity: number;
// //   is_fixed: number;
// //   quote_available: number | null;
// //   selling_type: { attribute_value: string; attribute_value_unit: string };
// //   free_shipping: number;
// //   return_policy: string;
// //   isRequired: boolean;
// // }

// // interface ProductCardProps {
// //   product: ApiProduct;
// //   newUrl?: string;
// //   onAddToCart?: (product: ApiProduct, quantity: number) => void;
// //   onWishlistToggle?: (product: ApiProduct, inWishlist: boolean) => void;
// // }

// // // ─── Helpers ─────────────────────────────────────────────────────────────────
// // const fmtPrice = (n: number) =>
// //   Number(n).toLocaleString("en-US", {
// //     minimumFractionDigits: 2,
// //     maximumFractionDigits: 2,
// //   });

// // // ─── Rating Stars ─────────────────────────────────────────────────────────────
// // const RatingStars = ({ rating }: { rating: number }) => (
// //   <div className="flex items-center gap-[2px]">
// //     {[1, 2, 3, 4, 5].map((s) => (
// //       <Star
// //         key={s}
// //         size={14}
// //         className={
// //           s <= Math.round(rating)
// //             ? "fill-amber-400 text-amber-400"
// //             : "fill-gray-200 text-gray-200"
// //         }
// //       />
// //     ))}
// //   </div>
// // );

// // // ─── Quantity Counter (reusable export) ──────────────────────────────────────
// // export const QuantityCounter = ({
// //   count,
// //   min,
// //   onIncrement,
// //   onDecrement,
// //   onChange,
// //   isFixed = false,
// // }: {
// //   count: number;
// //   min: number;
// //   onIncrement: (e: React.MouseEvent) => void;
// //   onDecrement: (e: React.MouseEvent) => void;
// //   onChange: (v: number) => void;
// //   isFixed?: boolean;
// // }) => (
// //   <div className="flex items-center h-[44px] border border-[#BCE3C9] rounded-[4px] overflow-hidden bg-white flex-shrink-0 w-[90px]">
// //     <button
// //       onClick={onDecrement}
// //       disabled={count <= min}
// //       className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
// //     >
// //       <Minus size={15} className="text-[#4B5563]" strokeWidth={2} />
// //     </button>
// //     <input
// //       type="text"
// //       value={count}
// //       disabled={isFixed}
// //       onChange={(e) => {
// //         const v = parseInt(e.target.value);
// //         if (!isNaN(v) && v >= 1 && v <= 99) onChange(v);
// //       }}
// //       className="w-8 text-center text-[15px] font-semibold text-[#186737] border-0 outline-none bg-transparent disabled:cursor-not-allowed"
// //     />
// //     <button
// //       onClick={onIncrement}
// //       disabled={count >= 99}
// //       className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
// //     >
// //       <Plus size={15} className="text-[#4B5563]" strokeWidth={2} />
// //     </button>
// //   </div>
// // );

// // // ─── Add To Cart Button (reusable export) ────────────────────────────────────
// // export const AddToCartButton = ({
// //   onClick,
// //   label = "Add To Cart",
// //   variant = "cart",
// //   success = false,
// // }: {
// //   onClick: (e: React.MouseEvent) => void;
// //   label?: string;
// //   variant?: "cart" | "quote";
// //   success?: boolean;
// // }) => (
// //   <button
// //     onClick={onClick}
// //     className={[
// //       "flex-1 h-[44px] rounded-[4px] text-[14px] font-semibold",
// //       "flex items-center justify-center gap-2 transition-colors duration-200",
// //       success
// //         ? "bg-emerald-600 text-white"
// //         : variant === "quote"
// //         ? "bg-[#A6131D] hover:bg-[#8b1018] text-white"
// //         : "bg-[#186737] hover:bg-[#145c30] text-white",
// //     ].join(" ")}
// //   >
// //     {success ? (
// //       <CheckCircle size={16} strokeWidth={2} />
// //     ) : variant !== "quote" ? (
// //       <ShoppingCart size={16} strokeWidth={2} />
// //     ) : null}
// //     {success ? "Added!" : label}
// //   </button>
// // );

// // // ─── Main ProductCard ─────────────────────────────────────────────────────────
// // export const ProductCard = ({
// //   product,
// //   newUrl = "products",
// //   onAddToCart,
// //   onWishlistToggle,
// // }: ProductCardProps) => {
// //   const minQty = product.min_quantity || 1;
// //   const isFixed = product.is_fixed === 1;
// //   const isQuote = product.quote_available === 1;

// //   const [count, setCount] = useState(minQty);
// //   const [wishlisted, setWishlisted] = useState(product.in_wishlist);
// //   const [addedSuccess, setAddedSuccess] = useState(false);

// //   // ── Price logic (sale_price=0 means no sale) ─────────────────────────
// //   const hasSale =
// //     product.sale_price > 0 &&
// //     product.sale_price !== product.original_price;

// //   const activePrice = hasSale ? product.sale_price : product.original_price;

// //   const discountPct = hasSale
// //     ? ((product.original_price - product.sale_price) / product.original_price) * 100
// //     : 0;

// //   const [priceInt, priceDec] = fmtPrice(activePrice).split(".");

// //   // ── Hover image slider ───────────────────────────────────────────────
// //   const images = product.images?.length > 0 ? product.images : [""];
// //   const hasMultipleImages = images.length > 1;
// //   const [imgIndex, setImgIndex] = useState(0);
// //   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

// //   const startSlide = useCallback(() => {
// //     if (!hasMultipleImages) return;
// //     intervalRef.current = setInterval(() => {
// //       setImgIndex((prev) => (prev + 1) % Math.min(images.length, 5));
// //     }, 900);
// //   }, [hasMultipleImages, images.length]);

// //   const stopSlide = useCallback(() => {
// //     if (intervalRef.current) {
// //       clearInterval(intervalRef.current);
// //       intervalRef.current = null;
// //     }
// //     setImgIndex(0);
// //   }, []);

// //   useEffect(
// //     () => () => {
// //       if (intervalRef.current) clearInterval(intervalRef.current);
// //     },
// //     []
// //   );

// //   // ── Handlers ────────────────────────────────────────────────────────
// //   const handleIncrement = (e: React.MouseEvent) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     if (isFixed) {
// //       if (count + minQty <= 99) setCount(count + minQty);
// //     } else if (count < 99) {
// //       setCount(count + 1);
// //     }
// //   };

// //   const handleDecrement = (e: React.MouseEvent) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     if (isFixed) {
// //       if (count - minQty >= minQty) setCount(count - minQty);
// //     } else if (count > minQty) {
// //       setCount(count - 1);
// //     }
// //   };

// //   const handleAddToCart = (e: React.MouseEvent) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     if (onAddToCart) onAddToCart(product, count);
// //     setAddedSuccess(true);
// //     setTimeout(() => setAddedSuccess(false), 1800);
// //   };

// //   const handleWishlist = (e: React.MouseEvent) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     const next = !wishlisted;
// //     setWishlisted(next);
// //     if (onWishlistToggle) onWishlistToggle(product, next);
// //   };

// //   const productLink = `/${product.parent_category_url ?? newUrl}/${product.url}`;
// //   const displayImages = images.slice(0, 5);

// //   return (
// //     <div
// //       className="bg-white rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer flex flex-col h-full border border-transparent hover:border-[#dceee4] hover:shadow-[0_4px_20px_rgba(0,0,0,0.11)] transition-all duration-200"
// //       onMouseEnter={startSlide}
// //       onMouseLeave={stopSlide}
// //     >
// //       {/* ── IMAGE AREA ───────────────────────────────────────────────── */}
// //       <div className="relative bg-white">

// //         {/* Discount badge */}
// //         {hasSale && discountPct > 0 && (
// //           <div className="absolute top-3 left-3 z-10">
// //             <span className="bg-[#FCE8EA] text-red-500 px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap">
// //               {discountPct.toFixed(2)}% off
// //             </span>
// //           </div>
// //         )}

// //         {/* Wishlist button */}
// //         <button
// //           onClick={handleWishlist}
// //           className="absolute top-2.5 right-2.5 z-10 w-[36px] h-[36px] bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
// //         >
// //           <Heart
// //             size={17}
// //             strokeWidth={2}
// //             className={wishlisted ? "fill-[#186737] text-[#186737]" : "text-gray-400"}
// //           />
// //         </button>

// //         {/* Product images */}
// //         <Link href={productLink}>
// //           <div className="relative w-full aspect-square overflow-hidden">
// //             {displayImages.map((img, i) => (
// //               <img
// //                 key={i}
// //                 src={img}
// //                 alt={product.alt_tags?.[i] || product.name}
// //                 loading={i === 0 ? "eager" : "lazy"}
// //                 className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-500"
// //                 style={{ opacity: imgIndex === i ? 1 : 0 }}
// //                 onError={(e) => {
// //                   (e.currentTarget as HTMLImageElement).style.opacity = "0";
// //                 }}
// //               />
// //             ))}
// //           </div>
// //         </Link>

// //         {/* Slider dots */}
// //         {hasMultipleImages ? (
// //           <div className="flex justify-center items-center gap-1.5 pb-2.5 pt-0.5">
// //             {displayImages.map((_, i) => (
// //               <span
// //                 key={i}
// //                 className="block rounded-full transition-all duration-300"
// //                 style={{
// //                   width: imgIndex === i ? "18px" : "6px",
// //                   height: "6px",
// //                   background: imgIndex === i ? "#186737" : "#d1d5db",
// //                 }}
// //               />
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="h-3" />
// //         )}
// //       </div>

// //       {/* ── CONTENT AREA ─────────────────────────────────────────────── */}
// //       <div className="px-3 pb-3 pt-2 md:px-4 md:pb-4 md:pt-2 flex flex-col flex-1 border-t border-gray-100">

// //         {/* Product name */}
// //         <Link href={productLink}>
// //           <p
// //             className="font-bold text-[13.5px] lg:text-[14.5px] text-gray-900 line-clamp-2 hover:text-[#186737] transition-colors leading-snug"
// //             style={{ minHeight: "42px" }}
// //           >
// //             {product.name}
// //           </p>
// //         </Link>

// //         {/* SKU */}
// //         <p className="mt-1.5 text-xs text-[#6B7280] font-semibold" title={product.sku}>
// //           Model No: {product.sku}
// //         </p>

// //         {/* Rating — only show if rating exists */}
// //         {product.avg_rating ? (
// //           <div className="flex items-center gap-1.5 mt-2">
// //             <RatingStars rating={product.avg_rating} />
// //             <span className="text-[13px] font-bold text-[#4B5563]">
// //               {product.avg_rating.toFixed(1)}
// //             </span>
// //             {product.total_reviews > 0 && (
// //               <span className="text-[11px] text-gray-400">
// //                 ({product.total_reviews})
// //               </span>
// //             )}
// //           </div>
// //         ) : (
// //           <div  >  <span className="text-[13px] text-slate-900 italic">No reviews yet</span></div>
// //         )}

// //         {/* Shipping row */}
// //         <p className="mt-1.5 text-[12.5px] font-semibold text-[#4B5563] flex items-center gap-1">
// //           <Truck size={13} className="text-[#186737] flex-shrink-0" />
// //           Shipping charges apply
// //         </p>

// //         {/* Ships in X Days */}
// //         <p className="mt-1 text-[12.5px] text-[#4B5563]">
// //           {product.delivery_days ? (
// //             <span className="font-bold text-gray-900">
// //               Mostly Ships in {product.delivery_days}
// //             </span>
// //           ) : (
// //             <span className="font-semibold">Now Shipping Faster</span>
// //           )}
// //         </p>

// //         {/* ── PRICE — mt-auto pushes to bottom ─────────────────────── */}
// //         <div className="mt-auto pt-3">
// //           {isQuote ? (
// //             <div style={{ minHeight: "62px" }}>
// //               <h2 className="text-[#186737] text-[15px] font-normal">
// //                 Can&apos;t See the Price?
// //               </h2>
// //               <p className="text-[#64748B] text-[12px] mt-1 leading-snug">
// //                 Click &ldquo;Request A Quote&rdquo; to receive your best prices.
// //               </p>
// //             </div>
// //           ) : (
// //             <div style={{ minHeight: "62px" }}>
// //               {/* Main price line: -11%  $19,990.26  /Each */}
// //               <div className="flex items-center gap-2 flex-wrap leading-none">
// //                 {hasSale && (
// //                   <span className="text-red-600 text-[13px] font-semibold relative top-[2px]">
// //                     -{Math.round(discountPct)}%
// //                   </span>
// //                 )}
// //                 <div className="flex items-baseline gap-[1px]">
// //                   <b
// //                     className={`font-bold leading-none ${
// //                       hasSale ? "text-[#186737]" : "text-gray-900"
// //                     }`}
// //                     style={{ fontSize: "22px" }}
// //                   >
// //                     <span className="text-[14px] font-bold mr-[1px] relative top-[-1px]">
// //                       $
// //                     </span>
// //                     {priceInt}
// //                   </b>
// //                   <span
// //                     className={`text-[14px] font-bold leading-none ${
// //                       hasSale ? "text-[#186737]" : "text-gray-900"
// //                     }`}
// //                   >
// //                     .{priceDec}
// //                   </span>
// //                 </div>
// //                 {product.selling_type?.attribute_value_unit && (
// //                   <span className="text-[13px] text-[#6B7280] font-medium">
// //                     /{product.selling_type.attribute_value_unit}
// //                   </span>
// //                 )}
// //               </div>

// //               {/* WAS price */}
// //               {hasSale ? (
// //                 <p className="text-[#6B7280] font-semibold text-[13px] line-through mt-1">
// //                   WAS {product.currency || "$"} {fmtPrice(product.original_price)}
// //                 </p>
// //               ) : (
// //                 <div className="h-[22px]" />
// //               )}
// //             </div>
// //           )}
// //         </div>

// //         {/* ── COUNTER + CTA ─────────────────────────────────────────── */}
// //         <div className="flex gap-2 items-center w-full mt-2">
// //           {!isQuote && (
// //             <QuantityCounter
// //               count={count}
// //               min={minQty}
// //               isFixed={isFixed}
// //               onIncrement={handleIncrement}
// //               onDecrement={handleDecrement}
// //               onChange={setCount}
// //             />
// //           )}
// //           <AddToCartButton
// //             onClick={handleAddToCart}
// //             label={isQuote ? "Request a Quote" : "Add To Cart"}
// //             variant={isQuote ? "quote" : "cart"}
// //             success={addedSuccess}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductCard;



// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import Link from "next/link";
// import {
//   Heart,
//   Minus,
//   Plus,
//   ShoppingCart,
//   Star,
//   Truck,
//   CheckCircle,
// } from "lucide-react";

// // ─── Types ──────────────────────────────────────────────────────────────────
// export interface ApiProduct {
//   id: number;
//   name: string;
//   url: string;
//   sku: string;
//   category_url: string;
//   parent_category_url: string;
//   price: number;
//   sale_price: number;
//   original_price: number;
//   front_sale_price: number;
//   best_price: number;
//   avg_rating: number | null;
//   total_reviews: number;
//   delivery_days: string;
//   currency: string;
//   images: string[];
//   alt_tags: string[];
//   in_wishlist: boolean;
//   min_quantity: number;
//   is_fixed: number;
//   quote_available: number | null;
//   selling_type: { attribute_value: string; attribute_value_unit: string };
//   free_shipping: number;
//   return_policy: string;
//   isRequired: boolean;
// }

// interface ProductCardProps {
//   product: ApiProduct;
//   newUrl?: string;
//   onAddToCart?: (product: ApiProduct, quantity: number) => void;
//   onWishlistToggle?: (product: ApiProduct, inWishlist: boolean) => void;
// }

// // ─── Helpers ─────────────────────────────────────────────────────────────────
// const fmtPrice = (n: number) =>
//   Number(n).toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// // ─── Rating Stars ─────────────────────────────────────────────────────────────
// const RatingStars = ({ rating }: { rating: number }) => (
//   <div className="flex items-center gap-[2px]">
//     {[1, 2, 3, 4, 5].map((s) => (
//       <Star
//         key={s}
//         size={14}
//         className={
//           s <= Math.round(rating)
//             ? "fill-amber-400 text-amber-400"
//             : "fill-gray-200 text-gray-200"
//         }
//       />
//     ))}
//   </div>
// );

// // ─── Quantity Counter (reusable export) ──────────────────────────────────────
// export const QuantityCounter = ({
//   count,
//   min,
//   onIncrement,
//   onDecrement,
//   onChange,
//   isFixed = false,
// }: {
//   count: number;
//   min: number;
//   onIncrement: (e: React.MouseEvent) => void;
//   onDecrement: (e: React.MouseEvent) => void;
//   onChange: (v: number) => void;
//   isFixed?: boolean;
// }) => (
//   <div className="flex items-center h-[44px] border border-[#BCE3C9] rounded-[4px] overflow-hidden bg-white flex-shrink-0 w-[90px]">
//     <button
//       onClick={onDecrement}
//       disabled={count <= min}
//       className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
//     >
//       <Minus size={15} className="text-[#4B5563]" strokeWidth={2} />
//     </button>
//     <input
//       type="text"
//       value={count}
//       disabled={isFixed}
//       onChange={(e) => {
//         const v = parseInt(e.target.value);
//         if (!isNaN(v) && v >= 1 && v <= 99) onChange(v);
//       }}
//       className="w-8 text-center text-[15px] font-semibold text-[#186737] border-0 outline-none bg-transparent disabled:cursor-not-allowed"
//     />
//     <button
//       onClick={onIncrement}
//       disabled={count >= 99}
//       className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
//     >
//       <Plus size={15} className="text-[#4B5563]" strokeWidth={2} />
//     </button>
//   </div>
// );

// // ─── Add To Cart Button (reusable export) ────────────────────────────────────
// export const AddToCartButton = ({
//   onClick,
//   label = "Add To Cart",
//   variant = "cart",
//   success = false,
// }: {
//   onClick: (e: React.MouseEvent) => void;
//   label?: string;
//   variant?: "cart" | "quote";
//   success?: boolean;
// }) => (
//   <button
//     onClick={onClick}
//     className={[
//       "flex-1 h-[44px] rounded-[4px] text-[14px] font-semibold",
//       "flex items-center justify-center gap-2 transition-colors duration-200",
//       success
//         ? "bg-emerald-600 text-white"
//         : variant === "quote"
//         ? "bg-[#A6131D] hover:bg-[#8b1018] text-white"
//         : "bg-[#186737] hover:bg-[#145c30] text-white",
//     ].join(" ")}
//   >
//     {success ? (
//       <CheckCircle size={16} strokeWidth={2} />
//     ) : variant !== "quote" ? (
//       <ShoppingCart size={16} strokeWidth={2} />
//     ) : null}
//     {success ? "Added!" : label}
//   </button>
// );

// // ─── Main ProductCard ─────────────────────────────────────────────────────────
// export const ProductCard = ({
//   product,
//   newUrl = "products",
//   onAddToCart,
//   onWishlistToggle,
// }: ProductCardProps) => {
//   const minQty = product.min_quantity || 1;
//   const isFixed = product.is_fixed === 1;
//   const isQuote = product.quote_available === 1;

//   const [count, setCount] = useState(minQty);
//   const [wishlisted, setWishlisted] = useState(product.in_wishlist);
//   const [addedSuccess, setAddedSuccess] = useState(false);

//   // ── Price logic (sale_price=0 means no sale) ─────────────────────────
//   const hasSale =
//     product.sale_price > 0 &&
//     product.sale_price !== product.original_price;

//   const activePrice = hasSale ? product.sale_price : product.original_price;

//   const discountPct = hasSale
//     ? ((product.original_price - product.sale_price) / product.original_price) * 100
//     : 0;

//   const [priceInt, priceDec] = fmtPrice(activePrice).split(".");

//   // ── Hover image slider ───────────────────────────────────────────────
//   const images = product.images?.length > 0 ? product.images : ["/placeholder.png"];
//   const hasMultipleImages = images.length > 1;
//   const [imgIndex, setImgIndex] = useState(0);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const startSlide = useCallback(() => {
//     if (!hasMultipleImages) return;
//     intervalRef.current = setInterval(() => {
//       setImgIndex((prev) => (prev + 1) % Math.min(images.length, 5));
//     }, 900);
//   }, [hasMultipleImages, images.length]);

//   const stopSlide = useCallback(() => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     setImgIndex(0);
//   }, []);

//   useEffect(
//     () => () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     },
//     []
//   );

//   // ── Handlers ────────────────────────────────────────────────────────
//   const handleIncrement = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (isFixed) {
//       if (count + minQty <= 99) setCount(count + minQty);
//     } else if (count < 99) {
//       setCount(count + 1);
//     }
//   };

//   const handleDecrement = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (isFixed) {
//       if (count - minQty >= minQty) setCount(count - minQty);
//     } else if (count > minQty) {
//       setCount(count - 1);
//     }
//   };

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (onAddToCart) onAddToCart(product, count);
//     setAddedSuccess(true);
//     setTimeout(() => setAddedSuccess(false), 1800);
//   };

//   const handleWishlist = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const next = !wishlisted;
//     setWishlisted(next);
//     if (onWishlistToggle) onWishlistToggle(product, next);
//   };

//   const productLink = `/${product.parent_category_url ?? newUrl}/${product.url}`;
//   const displayImages = images.slice(0, 5);

//   return (
//     <div
//       className="bg-white rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer flex flex-col h-full border border-transparent hover:border-[#dceee4] hover:shadow-[0_4px_20px_rgba(0,0,0,0.11)] transition-all duration-200"
//       onMouseEnter={startSlide}
//       onMouseLeave={stopSlide}
//     >
//       {/* ── IMAGE AREA ───────────────────────────────────────────────── */}
//       <div className="relative bg-white">

//         {/* Discount badge */}
//         {hasSale && discountPct > 0 && (
//           <div className="absolute top-3 left-3 z-10">
//             <span className="bg-[#FCE8EA] text-red-500 px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap">
//               {discountPct.toFixed(2)}% off
//             </span>
//           </div>
//         )}

//         {/* Wishlist button */}
//         <button
//           onClick={handleWishlist}
//           className="absolute top-2.5 right-2.5 z-10 w-[36px] h-[36px] bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
//         >
//           <Heart
//             size={17}
//             strokeWidth={2}
//             className={wishlisted ? "fill-[#186737] text-[#186737]" : "text-gray-400"}
//           />
//         </button>

//         {/* Product images */}
//         <Link href={productLink}>
//           <div className="relative w-full aspect-square overflow-hidden">
//             {displayImages.map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 alt={product.alt_tags?.[i] || product.name}
//                 loading={i === 0 ? "eager" : "lazy"}
//                 className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-500"
//                 style={{ opacity: imgIndex === i ? 1 : 0 }}
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.opacity = "0";
//                 }}
//               />
//             ))}
//           </div>
//         </Link>

//         {/* Slider dots */}
//         {hasMultipleImages ? (
//           <div className="flex justify-center items-center gap-1.5 pb-2.5 pt-0.5">
//             {displayImages.map((_, i) => (
//               <span
//                 key={i}
//                 className="block rounded-full transition-all duration-300"
//                 style={{
//                   width: imgIndex === i ? "18px" : "6px",
//                   height: "6px",
//                   background: imgIndex === i ? "#186737" : "#d1d5db",
//                 }}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="h-3" />
//         )}
//       </div>

//       {/* ── CONTENT AREA ─────────────────────────────────────────────── */}
//       <div className="px-3 pb-3 pt-2 md:px-4 md:pb-4 md:pt-2 flex flex-col flex-1 border-t border-gray-100">

//         {/* Product name */}
//         <Link href={productLink}>
//           <p
//             className="font-bold text-[13.5px] lg:text-[14.5px] text-gray-900 line-clamp-2 hover:text-[#186737] transition-colors leading-snug"
//             style={{ minHeight: "42px" }}
//           >
//             {product.name}
//           </p>
//         </Link>

//         {/* SKU */}
//         <p className="mt-1.5 text-xs text-[#6B7280] font-medium" title={product.sku}>
//           Model No: {product.sku}
//         </p>

//         {/* Rating — only show if rating exists */}
//         {product.avg_rating ? (
//           <div className="flex items-center gap-1.5 mt-2">
//             <RatingStars rating={product.avg_rating} />
//             <span className="text-[13px] font-bold text-[#4B5563]">
//               {product.avg_rating.toFixed(1)}
//             </span>
//             {product.total_reviews > 0 && (
//               <span className="text-[11px] text-gray-400">
//                 ({product.total_reviews})
//               </span>
//             )}
//           </div>
//         ) : (
//             <span className="text-[13px] text-slate-950 italic">No reviews yet</span>
//         )}

//         {/* Shipping row */}
//         <p className="mt-1.5 text-[12.5px] font-semibold text-[#4B5563] flex items-center gap-1">
//           <Truck size={13} className="text-[#186737] flex-shrink-0" />
//           Shipping charges apply
//         </p>

//         {/* Ships in X Days */}
//         <p className="mt-1 text-[12.5px] text-[#4B5563]">
//           {product.delivery_days ? (
//             <span className="font-semibold text-gray-900">
//               Mostly Ships in {product.delivery_days}
//             </span>
//           ) : (
//             <span className="font-semibold">Now Shipping Faster</span>
//           )}
//         </p>

//         {/* ── PRICE — mt-auto pushes to bottom ─────────────────────── */}
//         <div className={`${product.avg_rating ? "pt-3" : "mt-autos pt-3"} `}>
//           {isQuote ? (
//             <div style={{ minHeight: "62px" }}>
//               <h2 className="text-[#186737] text-[15px] font-normal">
//                 Can&apos;t See the Price?
//               </h2>
//               <p className="text-[#64748B] text-[12px] mt-1 leading-snug">
//                 Click &ldquo;Request A Quote&rdquo; to receive your best prices.
//               </p>
//             </div>
//           ) : (
//             <div style={{ minHeight: "40px" }}>
//               {/* Main price line: -11%  $19,990.26  /Each */}
//               <div className="flex items-center gap-2 flex-wrap leading-none">
//                 {hasSale && (
//                   <span className="text-red-600 text-[13px] font-semibold relative top-[2px]">
//                     -{Math.round(discountPct)}%
//                   </span>
//                 )}
//                 <div className="flex items-baseline gap-[1px]">
//                   <b
//                     className={`font-bold leading-none ${
//                       hasSale ? "text-[#186737]" : "text-gray-900"
//                     }`}
//                     style={{ fontSize: "22px" }}
//                   >
//                     $
//                     {priceInt}
//                   </b>
//                   <span
//                     className={`text-[14px] font-bold leading-none ${
//                       hasSale ? "text-[#186737]" : "text-gray-900"
//                     }`}
//                   >
//                     .{priceDec}
//                   </span>
//                 </div>
//                 {product.selling_type?.attribute_value_unit && (
//                   <span className="text-[13px] text-[#6B7280] font-medium">
//                     /{product.selling_type.attribute_value_unit}
//                   </span>
//                 )}
//               </div>

//               {/* WAS price */}
//               {hasSale ? (
//                 <p className="text-[#6B7280] font-semibold text-[13px] line-through mt-1">
//                   WAS {product.currency || "$"} {fmtPrice(product.original_price)}
//                 </p>
//               ) : null}
//             </div>
//           )}
//         </div>

//         {/* ── COUNTER + CTA ─────────────────────────────────────────── */}
//         <div className="flex gap-2 items-center w-full mt-2">
//           {!isQuote && (
//             <QuantityCounter
//               count={count}
//               min={minQty}
//               isFixed={isFixed}
//               onIncrement={handleIncrement}
//               onDecrement={handleDecrement}
//               onChange={setCount}
//             />
//           )}
//           <AddToCartButton
//             onClick={handleAddToCart}
//             label={isQuote ? "Request a Quote" : "Add To Cart"}
//             variant={isQuote ? "quote" : "cart"}
//             success={addedSuccess}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  CheckCircle,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface ApiProduct {
  id: number;
  name: string;
  url: string;
  sku: string;
  category_url: string;
  parent_category_url: string;
  price: number;
  sale_price: number;
  original_price: number;
  front_sale_price: number;
  best_price: number;
  avg_rating: number | null;
  total_reviews: number;
  delivery_days: string;
  currency: string;
  images: string[];
  alt_tags: string[];
  in_wishlist: boolean;
  min_quantity: number;
  is_fixed: number;
  quote_available: number | null;
  selling_type: { attribute_value: string; attribute_value_unit: string };
  free_shipping: number;
  return_policy: string;
  isRequired: boolean;
}

interface ProductCardProps {
  product: ApiProduct;
  newUrl?: string;
  onAddToCart?: (product: ApiProduct, quantity: number) => void;
  onWishlistToggle?: (product: ApiProduct, inWishlist: boolean) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ─── Rating Stars ─────────────────────────────────────────────────────────────
const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-[2px]">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={
          s <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ))}
  </div>
);

// ─── Quantity Counter (reusable export) ──────────────────────────────────────
export const QuantityCounter = ({
  count,
  min,
  onIncrement,
  onDecrement,
  onChange,
  isFixed = false,
}: {
  count: number;
  min: number;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
  onChange: (v: number) => void;
  isFixed?: boolean;
}) => (
  <div className="flex items-center h-[44px] border border-[#BCE3C9] rounded-[4px] overflow-hidden bg-white flex-shrink-0 w-[90px]">
    <button
      onClick={onDecrement}
      disabled={count <= min}
      className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
    >
      <Minus size={15} className="text-[#4B5563]" strokeWidth={2} />
    </button>
    <input
      type="text"
      value={count}
      disabled={isFixed}
      onChange={(e) => {
        const v = parseInt(e.target.value);
        if (!isNaN(v) && v >= 1 && v <= 99) onChange(v);
      }}
      className="w-8 text-center text-[15px] font-semibold text-[#186737] border-0 outline-none bg-transparent disabled:cursor-not-allowed"
    />
    <button
      onClick={onIncrement}
      disabled={count >= 99}
      className="w-10 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0"
    >
      <Plus size={15} className="text-[#4B5563]" strokeWidth={2} />
    </button>
  </div>
);

// ─── Add To Cart Button (reusable export) ────────────────────────────────────
export const AddToCartButton = ({
  onClick,
  label = "Add To Cart",
  variant = "cart",
  success = false,
}: {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
  variant?: "cart" | "quote";
  success?: boolean;
}) => (
  <button
    onClick={onClick}
    className={[
      "flex-1 h-[44px] rounded-[4px] text-[14px] font-semibold",
      "flex items-center justify-center gap-2 transition-colors duration-200",
      success
        ? "bg-emerald-600 text-white"
        : variant === "quote"
        ? "bg-[#A6131D] hover:bg-[#8b1018] text-white"
        : "bg-[#186737] hover:bg-[#145c30] text-white",
    ].join(" ")}
  >
    {success ? (
      <CheckCircle size={16} strokeWidth={2} />
    ) : variant !== "quote" ? (
      <ShoppingCart size={16} strokeWidth={2} />
    ) : null}
    {success ? "Added!" : label}
  </button>
);

// ─── Main ProductCard ─────────────────────────────────────────────────────────
export const ProductCard = ({
  product,
  newUrl = "products",
  onAddToCart,
  onWishlistToggle,
}: ProductCardProps) => {
  const minQty = product.min_quantity || 1;
  const isFixed = product.is_fixed === 1;
  const isQuote = product.quote_available === 1;

  const [count, setCount] = useState(minQty);
  const [wishlisted, setWishlisted] = useState(product.in_wishlist);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // ── Price logic (sale_price=0 means no sale) ─────────────────────────
  const hasSale =
    product.sale_price > 0 &&
    product.sale_price !== product.original_price;

  const activePrice = hasSale ? product.sale_price : product.original_price;

  const discountPct = hasSale
    ? ((product.original_price - product.sale_price) / product.original_price) * 100
    : 0;

  const [priceInt, priceDec] = fmtPrice(activePrice).split(".");

  // ── Hover image slider ───────────────────────────────────────────────
  const images = product.images?.length > 0 ? product.images : ["/placeholder.png"];
  const hasMultipleImages = images.length > 1;
  const [imgIndex, setImgIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSlide = useCallback(() => {
    if (!hasMultipleImages) return;
    intervalRef.current = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % Math.min(images.length, 5));
    }, 900);
  }, [hasMultipleImages, images.length]);

  const stopSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setImgIndex(0);
  }, []);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );

  // ── Handlers ────────────────────────────────────────────────────────
  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFixed) {
      if (count + minQty <= 99) setCount(count + minQty);
    } else if (count < 99) {
      setCount(count + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFixed) {
      if (count - minQty >= minQty) setCount(count - minQty);
    } else if (count > minQty) {
      setCount(count - 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product, count);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !wishlisted;
    setWishlisted(next);
    if (onWishlistToggle) onWishlistToggle(product, next);
  };

  const productLink = `/${product.parent_category_url ?? newUrl}/${product.url}`;
  const displayImages = images.slice(0, 5);

  return (
    <div
      className="bg-white rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer flex flex-col h-full border border-transparent hover:border-[#dceee4] hover:shadow-[0_4px_20px_rgba(0,0,0,0.11)] transition-all duration-200"
      onMouseEnter={startSlide}
      onMouseLeave={stopSlide}
    >
      {/* ── IMAGE AREA ───────────────────────────────────────────────── */}
      <div className="relative bg-white">

        {/* Discount badge */}
        {hasSale && discountPct > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#FCE8EA] text-red-500 px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap">
              {discountPct.toFixed(2)}% off
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 z-10 w-[36px] h-[36px] bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
        >
          <Heart
            size={17}
            strokeWidth={2}
            className={wishlisted ? "fill-[#186737] text-[#186737]" : "text-gray-400"}
          />
        </button>

        {/* Product images */}
        <Link href={productLink}>
          <div className="relative w-full aspect-square overflow-hidden">
            {displayImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={product.alt_tags?.[i] || product.name}
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-500"
                style={{ opacity: imgIndex === i ? 1 : 0 }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
            ))}
          </div>
        </Link>

        {/* Slider dots */}
        {hasMultipleImages ? (
          <div className="flex justify-center items-center gap-1.5 pb-2.5 pt-0.5">
            {displayImages.map((_, i) => (
              <span
                key={i}
                className="block rounded-full transition-all duration-300"
                style={{
                  width: imgIndex === i ? "18px" : "6px",
                  height: "6px",
                  background: imgIndex === i ? "#186737" : "#d1d5db",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="h-3" />
        )}
      </div>

      {/* ── CONTENT AREA ─────────────────────────────────────────────── */}
      <div className="px-3 pb-3 pt-2 md:px-4 md:pb-4 md:pt-2 flex flex-col flex-1 border-t border-gray-100">

        {/* Product name */}
        <Link href={productLink}>
          <p
            className="md:font-semibold font-semibold text-[13.5px] lg:text-[14.5px] text-gray-900 line-clamp-2 hover:text-[#186737] transition-colors leading-snug"
           
          >
            {product.name}
          </p>
        </Link>

        {/* SKU */}
        <p className="mt-1.5 text-xs text-[#6B7280] font-medium" title={product.sku}>
          Model No: {product.sku}
        </p>

        {/* Rating — only show if rating exists */}
        {product.avg_rating ? (
          <div className="flex items-center gap-1.5 mt-2 mb-1.5">
            <RatingStars rating={product.avg_rating} />
            <span className="text-[13px] font-bold text-[#4B5563]">
              {product.avg_rating.toFixed(1)}
            </span>
            {product.total_reviews > 0 && (
              <span className="text-[11px] text-gray-400">
                ({product.total_reviews})
              </span>
            )}
          </div>
        ) : (
          <span className="text-[13px] text-slate-900 italic py-1.5">No reviews yet</span>
        )}

        {/* Shipping row */}
        <p className="mt- text-[12.5px] font-semibold text-[#4B5563] hidden md:flex items-center gap-1">
          <Truck size={13} className="text-[#186737] flex-shrink-0" />
          Shipping charges apply
        </p>
        <p className="mt- text-[12.5px] font-semibold text-[#4B5563] md:hidden flex items-center gap-1">
          <Truck size={13} className="text-[#186737] flex-shrink-0" />
         Shipping Fee
        </p>

        {/* Ships in X Days */}
        <p className="mt-1 text-[12.5px] text-[#4B5563]">
          {product.delivery_days ? (
            <span className="font-bold text-gray-900">
              Mostly Ships in {product.delivery_days}
            </span>
          ) : (
            <span className="font-semibold">Now Shipping Faster</span>
          )}
        </p>

        {/* ── PRICE — mt-auto pushes to bottom ─────────────────────── */}
        <div className="mt-auto pt-3">
          {isQuote ? (
            <div style={{ minHeight: "62px" }}>
              <h2 className="text-[#186737] text-[15px] font-normal">
                Can&apos;t See the Price?
              </h2>
              <p className="text-[#64748B] text-[12px] mt-1 leading-snug">
                Click &ldquo;Request A Quote&rdquo; to receive your best prices.
              </p>
            </div>
          ) : (
            <div style={{ minHeight: "40px" }}>
              {/* Main price line: -11%  $19,990.26  /Each */}
              <div className="flex items-center gap-2 flex-wrap leading-none">
                {hasSale && (
                  <span className="text-red-600 text-[13px] font-semibold relative top-[2px]">
                    -{Math.round(discountPct)}%
                  </span>
                )}
                <div className="flex items-baseline gap-[1px]">
                  <b
                    className={`font-bold leading-none ${
                      hasSale ? "text-[#186737]" : "text-gray-900"
                    }`}
                    style={{ fontSize: "22px" }}
                  >
                    $
                    {priceInt}
                  </b>
                  <span
                    className={`text-[14px] font-bold leading-none ${
                      hasSale ? "text-[#186737]" : "text-gray-900"
                    }`}
                  >
                    .{priceDec}
                  </span>
                </div>
                {product.selling_type?.attribute_value_unit && (
                  <span className="text-[13px] text-[#6B7280] font-medium">
                    /{product.selling_type.attribute_value_unit}
                  </span>
                )}
              </div>

              {/* WAS price */}
              {hasSale ? (
                <p className="text-[#6B7280] font-semibold text-[13px] line-through mt-1">
                  WAS {product.currency || "$"} {fmtPrice(product.original_price)}
                </p>
              ) : null}
            </div>
          )}
        </div>

        {/* ── COUNTER + CTA ─────────────────────────────────────────── */}
        <div className="flex gap-2 items-center w-full mt-2">
          {!isQuote && (
            <QuantityCounter
              count={count}
              min={minQty}
              isFixed={isFixed}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onChange={setCount}
            />
          )}
          <AddToCartButton
            onClick={handleAddToCart}
            label={isQuote ? "Request a Quote" : "Add To Cart"}
            variant={isQuote ? "quote" : "cart"}
            success={addedSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;