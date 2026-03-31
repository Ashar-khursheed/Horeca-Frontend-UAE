// // "use client";

// // import { useState } from "react";
// // import Image from "next/image";
// // import Link from "next/link";
// // import { Phone } from "lucide-react";
// // import chefImge from "@/assets/static/chefImg.svg";
// // import BannerImg from "@/assets/Desktop/True Refrigeration.webp";
// // // Swiper
// // import { Swiper, SwiperSlide } from "swiper/react";
// // import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// // // ── Static Data ────────────────────────────────────────────────────────────────
// // const HERO_SLIDES = [
// //   {
// //     id: 1,
// //     title: "Commercial Kitchen Equipment",
// //     link: "/restaurant-equipment",
// //     image:
// //       "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/main-banner-1150-x-500-b2-2.webp",
// //     alt: "Commercial Kitchen Equipment",
// //   },
// //   {
// //     id: 2,
// //     title: "Premium Refrigeration",
// //     link: "/refrigeration",
// //     image:
// //       "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/Landing+page+Banner.webp",
// //     alt: "Refrigeration Units",
// //   },
// //   {
// //     id: 3,
// //     title: "Hotel & Restaurant Supplies",
// //     link: "/hotel-supplies",
// //     image:
// //       "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&h=400&fit=crop",
// //     alt: "Hotel Supplies",
// //   },
// //   {
// //     id: 4,
// //     title: "Tableware & Disposables",
// //     link: "/tableware",
// //     image:
// //       "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/main-banner-1150-x-500-b1-2.webp",
// //     alt: "Tableware Collection",
// //   },
// // ];

// // const SIDE_BANNERS = [
// //   {
// //     id: 1,
// //     imgSource:
// //       "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop",
// //     link: "/coffee-machines",
// //     altText: "Coffee Machines",
// //   },
// //   {
// //     id: 2,
// //     imgSource:
// //       "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop",
// //     link: "/cooking-equipment",
// //     altText: "Cooking Equipment",
// //   },
// // ];

// // // ── Component ──────────────────────────────────────────────────────────────────
// // export const HeroBanner = () => {
// //   const [quoteModalOpen, setQuoteModalOpen] = useState(false);

// //   return (
// //     <>
// //       <section className="global-container mt-3 sm:mt-6">
// //         <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 lg:gap-4">
// //           {/* ── LEFT: Main Swiper ── */}
// //           <div className="lg:col-span-5">
// //             <Swiper
// //               modules={[Autoplay, Pagination, Navigation, EffectFade]}
// //               effect="fade"
// //               fadeEffect={{ crossFade: true }}
// //               autoplay={{
// //                 delay: 3000,
// //                 disableOnInteraction: false,
// //                 pauseOnMouseEnter: true,
// //               }}
// //               pagination={{ clickable: true }}
// //               //   navigation
// //               loop
// //               className="hero-swiper w-full rounded-xl overflow-hidden"
// //               style={{ aspectRatio: "875/380" }}
// //             >
// //               {HERO_SLIDES.map((banner, index) => (
// //                 <SwiperSlide key={banner.id}>
// //                   <Link
// //                     href={banner.link}
// //                     className="block w-full h-full outline-none"
// //                   >
// //                     <div
// //                       className="relative w-full h-full overflow-hidden "
// //                       style={{ aspectRatio: "875/380" }}
// //                     >
// //                       <img
// //                         src={banner.image}
// //                         alt={banner.alt}
// //                         className="w-full h-full object-cover "
// //                         loading={index === 0 ? "eager" : "lazy"}
// //                       />
// //                       {/* Subtle gradient overlay */}
// //                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
// //                     </div>
// //                   </Link>
// //                 </SwiperSlide>
// //               ))}
// //             </Swiper>
// //           </div>

// //           {/* ── RIGHT: CTA card + side banners ── */}
// //           <div className="lg:col-span-2 flex flex-row flex-wrap sm:flex-nowrap lg:flex-col gap-3">
// //             {/* Opening a Restaurant CTA card */}
// //             <div className="cta-card flex-1 lg:flex-none">
// //               <Link
// //                 href="/starting-a-restaurant"
// //                 className="no-underline block"
// //               >
// //                 <div className="flex items-end justify-between">
// //                   <div className="bg-[#E2E8F033] 2xl:py-0 px-3 relative rounded-md ">
// //                     <div>
// //                       <Link
// //                         href="/starting-a-restaurant"
// //                         className="no-underline cursor-pointer"
// //                       >
// //                         <div className="flex items-center relative ">
// //                           <div>
// //                             <h3 className="text-[#186737] f 2xl:text-xl text-base">
// //                               Opening a Restaurant?
// //                             </h3>
// //                             <p className="text-[#666666] 2xl:text-base text-[13px] my-3">
// //                               From kitchen equipment to financing, we’ve got you
// //                               covered.
// //                             </p>

// //                             <div
// //                               className="flex gap-2 items-center cursor-pointer"
// //                               onClick={(e) => e.stopPropagation()}
// //                             >
// //                               <Phone className="w-4 h-4 text-[#186737]" />
// //                               <a
// //                                 href="tel:+18664467322"
// //                                 className="text-[#186737] underline"
// //                               >
// //                                 +1 (866) 446-7322
// //                               </a>
// //                             </div>
// //                             <div>
// //                               <button className="bg-[#186737] text-white 2xl:px-4 px-3 2xl:py-3 py-2 rounded  text-[14px] mt-4">
// //                                 Request a Free Quote
// //                               </button>
// //                             </div>
// //                           </div>

// //                           <div className="relative">
// //                             <Image
// //                               src={chefImge}
// //                               className="h-[122%] w-[205px] relative 2xl:bottom-[-18px] bottom-0"
// //                               alt="chef image"
// //                             />
// //                           </div>
// //                         </div>
// //                       </Link>
// //                     </div>
// //                   </div>

// //                 </div>
// //               </Link>
// //             </div>

// //                     <div className="w-full h-full">
// //                       <Image
// //                         src={BannerImg}
// //                         loading="lazy"
// //                         alt={'Image'}
// //                         className="w-full h-full object-cover rounded-md"
// //                       />
// //                     </div>

// //           </div>
// //         </div>
// //       </section>

// //     </>
// //   );
// // };

// // export default HeroBanner;

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Phone } from "lucide-react";
// import chefImge from "@/assets/static/chefImg.svg";
// import BannerImg from "@/assets/Desktop/True Refrigeration.webp";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// const HERO_SLIDES = [
//   {
//     id: 1,
//     title: "Commercial Kitchen Equipment",
//     link: "/restaurant-equipment",
//     image:
//       "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/main-banner-1150-x-500-b2-2.webp",
//     alt: "Commercial Kitchen Equipment",
//   },
//   {
//     id: 2,
//     title: "Premium Refrigeration",
//     link: "/refrigeration",
//     image:
//       "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/Landing+page+Banner.webp",
//     alt: "Refrigeration Units",
//   },
//   {
//     id: 3,
//     title: "Hotel & Restaurant Supplies",
//     link: "/hotel-supplies",
//     image:
//       "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&h=400&fit=crop",
//     alt: "Hotel Supplies",
//   },
//   {
//     id: 4,
//     title: "Tableware & Disposables",
//     link: "/tableware",
//     image:
//       "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/main-banner-1150-x-500-b1-2.webp",
//     alt: "Tableware Collection",
//   },
// ];

// // ── Shared sub-components ──────────────────────────────────────────────────────

// // const CTACard = () => (
// //   <div className="cta-card flex-1 lg:flex-none">
// //     <Link href="/starting-a-restaurant" className="no-underline block">
// //       <div className="flex items-end justify-between">
// //         <div className="bg-[#E2E8F033] 2xl:py-0  relative rounded-md ">
// //           <div>
// //             <Link
// //               href="/starting-a-restaurant"
// //               className="no-underline cursor-pointer"
// //             >
// //               {/* <div className="flex items-center relative custom-padding"> */}
// //               <div className="flex items-center relative 2xl:py-9 2xl:px- xl:py-6 xl:px-3 md:py-2.5 md:px-3 py-6.5 px-3  ">
// //                 <div>
// //                   <h3 className="text-[#186737] f 2xl:text-xl text-base">
// //                     Opening a Restaurant?
// //                   </h3>
// //                   <p className="text-[#666666] 2xl:text-base text-[13px] my-3">
// //                     From kitchen equipment to financing, we’ve got you covered.
// //                   </p>

// //                   <div
// //                     className="flex gap-2 items-center cursor-pointer"
// //                     onClick={(e) => e.stopPropagation()}
// //                   >
// //                     <Phone className="w-4 h-4 text-[#186737]" />
// //                     <a
// //                       href="tel:+18664467322"
// //                       className="text-[#186737] 2xl:text-base text-[13px] underline"
// //                     >
// //                       +1 (866) 446-7322
// //                     </a>
// //                   </div>
// //                   <div>
// //                     <button className="bg-[#186737] text-white 2xl:px-4 px-2.5 2xl:py-3 py-1.5 rounded  2xl:text-[14px] text-[12px] mt-4">
// //                       Request a Free Quote
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div className="relative">
// //                   <Image
// //                     src={chefImge}
// //                     className=" relative 2xl:bottom-[-55px] xl:bottom-[-38px] bottom-0"
// //                     alt="chef image"
// //                   />
// //                 </div>
// //               </div>
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </Link>
// //   </div>
// // );

// const CTACard = () => (
//   <div className="px-3">
//     <Link href="/starting-a-restaurant" className="no-underline block ">
//       <div className="flex items-end justify-between">
//         <div className="  relative rounded-md ">
//           <div>
//             {/* <Link
//               href="/starting-a-restaurant"
//               className="no-underline cursor-pointer "
//             > */}
//               <div className=" grid grid-cols-[70%_30%] h-full gap-3  relative  ">
//               {/* <div className="flex items-center relative 2xl:py-9 2xl:px- xl:py-6 xl:px-3 md:py-2.5 md:px-3 py-6.5 px-3  "> */}
//                 <div className="flex flex-col items-start justify-center">
//                   <h3 className="text-[#186737]  2xl:text-xl text-base">
//                     Opening a Restaurant?
//                   </h3>
//                   <p className="text-[#666666] 2xl:text-base text-[13px] my-3">
//                     From kitchen equipment to financing, <span className="block">we’ve got you covered.</span>
//                   </p>

//                   <div
//                     className="flex gap-2 items-center cursor-pointer"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <Phone className="w-4 h-4 text-[#186737]" />
//                     <a
//                       href="tel:+18664467322"
//                       className="text-[#186737] 2xl:text-base text-[13px] underline"
//                     >
//                       +1 (866) 446-7322
//                     </a>
//                   </div>
//                   <div>
//                     <button className="bg-[#186737] text-white 2xl:px-4 px-2.5 2xl:py-3 py-1.5 rounded  2xl:text-[14px] text-[12px] mt-4">
//                       Request a Free Quote
//                     </button>
//                   </div>
//                 </div>

//                 <div className="relative flex items-end justify-end">
//                   <Image
//                     src={chefImge}
//                     className="  "
//                     // className=" relative 2xl:bottom-[-55px] xl:bottom-[-38px] bottom-0"
//                     alt="chef image"
//                   />
//                 </div>
//               </div>
//             {/* </Link> */}
//           </div>
//         </div>
//       </div>
//     </Link>
//   </div>
// );
// const BannerImage = () => (
//   <div className="w-full rounded-md overflow-hidden">
//     <Image
//       src={BannerImg}
//       alt="True Refrigeration Banner"
//       className="w-full h-auto block"
//     />
//   </div>
// );

// // ── Main Component ─────────────────────────────────────────────────────────────

// // export const HeroBanner = () => {
// //   const [quoteModalOpen, setQuoteModalOpen] = useState(false);

// //   return (
// //     <>
// //       <section className="global-container mt-3 sm:mt-6">
// //         <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 lg:gap-4">
// //           {/* ── Hero Swiper (all screens) ── */}
// //           <div className="lg:col-span-5 w-full">
// //             <Swiper
// //               modules={[Autoplay, Pagination, Navigation, EffectFade]}
// //               effect="fade"
// //               fadeEffect={{ crossFade: true }}
// //               autoplay={{
// //                 delay: 3000,
// //                 disableOnInteraction: false,
// //                 pauseOnMouseEnter: true,
// //               }}
// //               pagination={{ clickable: true }}
// //               loop
// //               className="hero-swiper w-full rounded-md overflow-hidden"
// //               style={{ aspectRatio: "875/380" }}
// //             >
// //               {HERO_SLIDES.map((banner, index) => (
// //                 <SwiperSlide key={banner.id}>
// //                   <Link
// //                     href={banner.link}
// //                     className="block w-full h-full outline-none"
// //                   >
// //                     <div
// //                       className="relative w-full h-full overflow-hidden"
// //                       style={{ aspectRatio: "875/380" }}
// //                     >
// //                       <img
// //                         src={banner.image}
// //                         alt={banner.alt}
// //                         className="w-full h-full object-cover"
// //                         loading={index === 0 ? "eager" : "lazy"}
// //                       />
// //                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
// //                     </div>
// //                   </Link>
// //                 </SwiperSlide>
// //               ))}
// //             </Swiper>
// //           </div>

// //           {/* ── Right Column ── */}
// //           <div className="lg:col-span-2">
// //             {/* MOBILE ONLY — slider between CTA and Banner */}
// //             <div className="block sm:hidden">
// //               <Swiper
// //                 modules={[Autoplay]}
// //                 // modules={[Autoplay, Pagination]}
// //                 autoplay={{
// //                   delay: 4000,
// //                   disableOnInteraction: false,
// //                   pauseOnMouseEnter: true,
// //                 }}
// //                 // pagination={{ clickable: true }}
// //                 loop
// //                 className="w-full rounded-md overflow-hidden pb-0"
// //                 style={{ paddingBottom: "0px", margin:"0 10px" }}
// //               >
// //                 <SwiperSlide>
// //                   <Link
// //                     href="/starting-a-restaurant"
// //                     className="block no-underline"
// //                   >
// //                     <CTACard />
// //                   </Link>
// //                 </SwiperSlide>

// //                 <SwiperSlide>
// //                   <BannerImage />
// //                 </SwiperSlide>
// //               </Swiper>
// //             </div>

// //             {/* TABLET (sm → lg) — 50/50 grid */}
// //             <div className="hidden sm:grid sm:grid-cols-2 lg:hidden gap-3">
// //               <Link href="/starting-a-restaurant" className="no-underline">
// //                 <CTACard />
// //               </Link>
// //               <BannerImage />
// //             </div>

// //             {/* DESKTOP (lg+) — stacked layout */}
// //             <div className="hidden lg:flex flex-col gap-3 h-full">
// //               <Link
// //                 href="/starting-a-restaurant"
// //                 className="no-underline flex-1"
// //               >
// //                 <CTACard />
// //               </Link>
// //               <div className="flex-1">
// //                 <BannerImage />
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   );
// // };

// // export default HeroBanner;





// export const HeroBanner = () => {
//   const [quoteModalOpen, setQuoteModalOpen] = useState(false);

//   return (
//     <>
//       <section className="global-container mt-3 sm:mt-6">
//         <div className="grid grid-cols-[70%_30%] gap-3 lg:gap-4">
//           {/* ── Hero Swiper (all screens) ── */}
//           <div className="l w-full flex">
//             <Swiper
//               modules={[Autoplay, Pagination, Navigation, EffectFade]}
//               effect="fade"
//               fadeEffect={{ crossFade: true }}
//               autoplay={{
//                 delay: 3000,
//                 disableOnInteraction: false,
//                 pauseOnMouseEnter: true,
//               }}
//               pagination={{ clickable: true }}
//               loop
//               className="hero-swiper w-full rounded-md overflow-hidden"
//               style={{ aspectRatio: "875/380" }}
//             >
//               {HERO_SLIDES.map((banner, index) => (
//                 <SwiperSlide key={banner.id}>
//                   <Link
//                     href={banner.link}
//                     className="block w-full h-full outline-none"
//                   >
//                     <div
//                       className="relative w-full h-full overflow-hidden"
//                       style={{ aspectRatio: "875/380" }}
//                     >
//                       <img
//                         src={banner.image}
//                         alt={banner.alt}
//                         className="w-full h-full object-cover"
//                         loading={index === 0 ? "eager" : "lazy"}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
//                     </div>
//                   </Link>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>

//           {/* ── Right Column ── */}
//           <div className="lg:col-s">
//             {/* MOBILE ONLY — slider between CTA and Banner */}
//             <div className="block sm:hidden">
//               <Swiper
//                 modules={[Autoplay]}
//                 // modules={[Autoplay, Pagination]}
//                 autoplay={{
//                   delay: 4000,
//                   disableOnInteraction: false,
//                   pauseOnMouseEnter: true,
//                 }}
//                 // pagination={{ clickable: true }}
//                 loop
//                 className="w-full rounded-md overflow-hidden pb-0"
//                 style={{ paddingBottom: "0px", margin:"0 10px" }}
//               >
//                 <SwiperSlide>
//                   <Link
//                     href="/starting-a-restaurant"
//                     className="block no-underline"
//                   >
//                     <CTACard />
//                   </Link>
//                 </SwiperSlide>

//                 <SwiperSlide>
//                   <BannerImage />
//                 </SwiperSlide>
//               </Swiper>
//             </div>

//             {/* TABLET (sm → lg) — 50/50 grid */}
//             <div className="hidden sm:grid sm:grid-cols-2 lg:hidden gap-3">
//               <Link href="/starting-a-restaurant" className="no-underline">
//                 <CTACard />
//               </Link>
//               <BannerImage />
//             </div>

//             {/* DESKTOP (lg+) — stacked layout */}
//             <div className="hidden lg:grid grid-rows-[auto_auto] h-full gap-3">
//               <Link
//                 href="/starting-a-restaurant"
//                 className="no-underline flex-11s bg-[#e2e8f033] flex justify-between items-center"
//               >
//                 <CTACard />
//               </Link>
//               <div className="flex-1s flex items-end justify-between">
//                 <BannerImage />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default HeroBanner;













/////////////////////////////////////////////













// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Phone } from "lucide-react";
// import chefImge from "@/assets/static/chefImg.svg";
// import BannerImg from "@/assets/Desktop/True Refrigeration.webp";
// // Swiper
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// // ── Static Data ────────────────────────────────────────────────────────────────
// const HERO_SLIDES = [
//   {
//     id: 1,
//     title: "Commercial Kitchen Equipment",
//     link: "/restaurant-equipment",
//     image:
//       "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/main-banner-1150-x-500-b2-2.webp",
//     alt: "Commercial Kitchen Equipment",
//   },
//   {
//     id: 2,
//     title: "Premium Refrigeration",
//     link: "/refrigeration",
//     image:
//       "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/Landing+page+Banner.webp",
//     alt: "Refrigeration Units",
//   },
//   {
//     id: 3,
//     title: "Hotel & Restaurant Supplies",
//     link: "/hotel-supplies",
//     image:
//       "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&h=400&fit=crop",
//     alt: "Hotel Supplies",
//   },
//   {
//     id: 4,
//     title: "Tableware & Disposables",
//     link: "/tableware",
//     image:
//       "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/main-banner-1150-x-500-b1-2.webp",
//     alt: "Tableware Collection",
//   },
// ];

// const SIDE_BANNERS = [
//   {
//     id: 1,
//     imgSource:
//       "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop",
//     link: "/coffee-machines",
//     altText: "Coffee Machines",
//   },
//   {
//     id: 2,
//     imgSource:
//       "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop",
//     link: "/cooking-equipment",
//     altText: "Cooking Equipment",
//   },
// ];

// // ── Component ──────────────────────────────────────────────────────────────────
// export const HeroBanner = () => {
//   const [quoteModalOpen, setQuoteModalOpen] = useState(false);

//   return (
//     <>
//       <section className="global-container mt-3 sm:mt-6">
//         <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 lg:gap-4">
//           {/* ── LEFT: Main Swiper ── */}
//           <div className="lg:col-span-5">
//             <Swiper
//               modules={[Autoplay, Pagination, Navigation, EffectFade]}
//               effect="fade"
//               fadeEffect={{ crossFade: true }}
//               autoplay={{
//                 delay: 3000,
//                 disableOnInteraction: false,
//                 pauseOnMouseEnter: true,
//               }}
//               pagination={{ clickable: true }}
//               //   navigation
//               loop
//               className="hero-swiper w-full rounded-xl overflow-hidden"
//               style={{ aspectRatio: "875/380" }}
//             >
//               {HERO_SLIDES.map((banner, index) => (
//                 <SwiperSlide key={banner.id}>
//                   <Link
//                     href={banner.link}
//                     className="block w-full h-full outline-none"
//                   >
//                     <div
//                       className="relative w-full h-full overflow-hidden "
//                       style={{ aspectRatio: "875/380" }}
//                     >
//                       <img
//                         src={banner.image}
//                         alt={banner.alt}
//                         className="w-full h-full object-cover "
//                         loading={index === 0 ? "eager" : "lazy"}
//                       />
//                       {/* Subtle gradient overlay */}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
//                     </div>
//                   </Link>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>

//           {/* ── RIGHT: CTA card + side banners ── */}
//           <div className="lg:col-span-2 flex flex-row flex-wrap sm:flex-nowrap lg:flex-col gap-3">
//             {/* Opening a Restaurant CTA card */}
//             <div className="cta-card flex-1 lg:flex-none">
//               <Link
//                 href="/starting-a-restaurant"
//                 className="no-underline block"
//               >
//                 <div className="flex items-end justify-between">
//                   <div className="bg-[#E2E8F033] 2xl:py-0 px-3 relative rounded-md ">
//                     <div>
//                       <Link
//                         href="/starting-a-restaurant"
//                         className="no-underline cursor-pointer"
//                       >
//                         <div className="flex items-center relative ">
//                           <div>
//                             <h3 className="text-[#186737] f 2xl:text-xl text-base">
//                               Opening a Restaurant?
//                             </h3>
//                             <p className="text-[#666666] 2xl:text-base text-[13px] my-3">
//                               From kitchen equipment to financing, we’ve got you
//                               covered.
//                             </p>

//                             <div
//                               className="flex gap-2 items-center cursor-pointer"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               <Phone className="w-4 h-4 text-[#186737]" />
//                               <a
//                                 href="tel:+18664467322"
//                                 className="text-[#186737] underline"
//                               >
//                                 +1 (866) 446-7322
//                               </a>
//                             </div>
//                             <div>
//                               <button className="bg-[#186737] text-white 2xl:px-4 px-3 2xl:py-3 py-2 rounded  text-[14px] mt-4">
//                                 Request a Free Quote
//                               </button>
//                             </div>
//                           </div>

//                           <div className="relative">
//                             <Image
//                               src={chefImge}
//                               className="h-[122%] w-[205px] relative 2xl:bottom-[-18px] bottom-0"
//                               alt="chef image"
//                             />
//                           </div>
//                         </div>
//                       </Link>
//                     </div>
//                   </div>

//                 </div>
//               </Link>
//             </div>

//                     <div className="w-full h-full">
//                       <Image
//                         src={BannerImg}
//                         loading="lazy"
//                         alt={'Image'}
//                         className="w-full h-full object-cover rounded-md"
//                       />
//                     </div>

//           </div>
//         </div>
//       </section>

//     </>
//   );
// };

// export default HeroBanner;

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import chefImge from "@/assets/static/chefImg.svg";
import BannerImg from "@/assets/Desktop/True Refrigeration.webp";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

const HERO_SLIDES = [
  {
    id: 1,
    title: "Commercial Kitchen Equipment",
    link: "/restaurant-equipment",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/main-banner-1150-x-500-b2-2.webp",
    alt: "Commercial Kitchen Equipment",
  },
  {
    id: 2,
    title: "Premium Refrigeration",
    link: "/refrigeration",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/Landing+page+Banner.webp",
    alt: "Refrigeration Units",
  },
  {
    id: 3,
    title: "Hotel & Restaurant Supplies",
    link: "/hotel-supplies",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&h=400&fit=crop",
    alt: "Hotel Supplies",
  },
  {
    id: 4,
    title: "Tableware & Disposables",
    link: "/tableware",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/sliders/main-banner-1150-x-500-b1-2.webp",
    alt: "Tableware Collection",
  },
];


const CTACard = () => (
  <div className="px-3">
      <div className="flex items-end justify-between">
        <div className="  relative rounded-md ">
          <div>
            {/* <Link
              href="/starting-a-restaurant"
              className="no-underline cursor-pointer "
            > */}
              <div className=" grid grid-cols-[70%_30%] h-full gap-3  relative  ">
              {/* <div className="flex items-center relative 2xl:py-9 2xl:px- xl:py-6 xl:px-3 md:py-2.5 md:px-3 py-6.5 px-3  "> */}
                <div className="flex flex-col items-start justify-center">
                  <h3 className="text-[#186737]  2xl:text-xl text-base">
                    Opening a Restaurant?
                  </h3>
                  <p className="text-[#666666] 2xl:text-base text-[13px] my-3">
                    From kitchen equipment to financing, <span className="2xl:blocks ">we’ve got you covered.</span>
                  </p>

                  <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="w-4 h-4 text-[#186737]" />
                    <a
                      href="tel:+18664467322"
                      className="text-[#186737] 2xl:text-base text-[13px] underline"
                    >
                      +1 (866) 446-7322
                    </a>
                  </div>
                  <div>
                    <button className="bg-[#186737] text-white 2xl:px-4 px-2.5 2xl:py-3 py-1.5 rounded  2xl:text-[14px] text-[12px] mt-4">
                      Request a Free Quote
                    </button>
                  </div>
                </div>

                <div className="relative flex items-end justify-end">
                  <Image
                    src={chefImge}
                    className="  "
                    // className=" relative 2xl:bottom-[-55px] xl:bottom-[-38px] bottom-0"
                    alt="chef image"
                  />
                </div>
              </div>
            {/* </Link> */}
          </div>
        </div>
      </div>
  </div>
);
const BannerImage = () => (
  <div className="w-full rounded-md overflow-hidden">
    <Image
      src={BannerImg}
      alt="True Refrigeration Banner"
      className="w-full h-auto block"
    />
  </div>
);



export const HeroBanner = () => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <>
      <section className="global-container mt-3 sm:mt-6">
        <div className="flex flex-col lg:grid lg:grid-cols-[70%_30%] gap-3 lg:gap-4">
          {/* ── Hero Swiper (all screens) ── */}
          <div className="l w-full flex">
            <Swiper
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              loop
              className="hero-swiper w-full rounded-md overflow-hidden"
              style={{ aspectRatio: "875/380" }}
            >
              {HERO_SLIDES.map((banner, index) => (
                <SwiperSlide key={banner.id}>
                  <Link
                    href={banner.link}
                    className="block w-full h-full outline-none"
                  >
                    <div
                      className="relative w-full h-full overflow-hidden"
                      style={{ aspectRatio: "875/380" }}
                    >
                      <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-s">
            {/* MOBILE ONLY — slider between CTA and Banner */}
            <div className="block sm:hidden">
              <Swiper
                modules={[Autoplay]}
                // modules={[Autoplay, Pagination]}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                // pagination={{ clickable: true }}
                loop
                className="w-full rounded-md overflow-hidden pb-0"
                style={{ paddingBottom: "0px", margin:"0 10px" }}
              >
                <SwiperSlide>
                  {/* <Link
                    href="/starting-a-restaurant"
                    className="block no-underline"
                  > */}
                    <CTACard />
                  {/* </Link> */}
                </SwiperSlide>

                <SwiperSlide>
                  <BannerImage />
                </SwiperSlide>
              </Swiper>
            </div>

            {/* TABLET (sm → lg) — 50/50 grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:hidden gap-3">
              {/* <Link href="/starting-a-restaurant" className="no-underline"> */}
                <CTACard />
              {/* </Link> */}
              <BannerImage />
            </div>

            {/* DESKTOP (lg+) — stacked layout */}
            <div className="hidden lg:grid grid-rows-[auto_auto] h-full gap-3">
              {/* <Link
                href="/starting-a-restaurant"
                className="no-underline flex-11s bg-[#e2e8f033] flex justify-between items-center"
              > */}

              <div     className="no-underline flex-11s bg-[#e2e8f033] flex justify-between items-center">

                <CTACard />
              </div>
              {/* </Link> */}
              <div className="flex-1s flex items-end justify-between">
                <BannerImage />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
