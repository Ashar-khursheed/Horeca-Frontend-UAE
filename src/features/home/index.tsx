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
// import SEOMainContent from "@/seo/seo-main-content";
// import ShopByCategories from "@/components/category-card";

// // ── Static Data ────────────────────────────────────────────────────────────────
// const HERO_SLIDES = [
//   {
//     id: 1,
//     title: "Commercial Kitchen Equipment",
//     link: "/restaurant-equipment",
//     image:
//       "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=400&fit=crop",
//     alt: "Commercial Kitchen Equipment",
//   },
//   {
//     id: 2,
//     title: "Premium Refrigeration",
//     link: "/refrigeration",
//     image:
//       "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=900&h=400&fit=crop",
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
//       "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&h=400&fit=crop",
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
// export const Hero = () => {
//   const [quoteModalOpen, setQuoteModalOpen] = useState(false);

//   return (
//     <>
//       <section className="global-container mt-3 sm:mt-6">
//         <div className="grid lg:grid-cols-7 gap-3 lg:gap-4">
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
//               className="hero-swiper w-full rounded-[7px] overflow-hidden"
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
//                   <div className="bg-[#E2E8F033] p-3 relative ">
//                     <div>
//                       <Link
//                         href="/starting-a-restaurant"
//                         className="no-underline cursor-pointer"
//                       >
//                         <div className="flex items-center relative 2xl:h-[240px] h-[160px]">
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

//                   {/* Chef illustration placeholder */}
//                   {/* <div
//                     className="flex-shrink-0 w-[70px] 2xl:w-[90px] self-end"
//                     style={{ marginBottom: "-18px" }}
//                   >
//                     <Image
//                       src={chefImge}
//                       alt="Chef"
//                       className="w-full h-auto"
//                       onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
//                     />
//                   </div> */}
//                 </div>
//               </Link>
//             </div>

//             {/* Side banners */}
//             {/* <Swiper
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
//               className="hero-swiper w-full rounded-[7px] overflow-hidden"
//               style={{ aspectRatio: "875/380" }}
//             >
//               {SIDE_BANNERS.map((banner) => (
//                 <SwiperSlide key={banner.id}> */}
//                   {" "}
//                   {/* ✅ SwiperSlide wrap karo */}
//                   {/* <Link href={banner.link} className="block w-full h-full"> */}
//                     <div className="w-full h-full">
//                       <Image
//                         src={BannerImg}
//                         loading="lazy"
//                         alt={'Image'}
//                         className="w-full h-full object-cover rounded-[7px]"
//                       />
//                     </div>
//                   {/* </Link> */}
//                 {/* </SwiperSlide>
//               ))}
//             </Swiper> */}
//             {/* {SIDE_BANNERS.map((banner) => (
//               <Link
//                 key={banner.id}
//                 href={banner.link}
//                 className="flex-1 lg:flex-none block"
//               >
//                 <div className="side-banner-wrap w-full">
//                   <img
//                     src={banner.imgSource}
//                     loading="lazy"
//                     alt={banner.altText}
//                     className="w-full h-full object-cover min-h-[90px] lg:min-h-[110px] 2xl:min-h-[150px]"
//                   />
//                 </div>
//               </Link>
//             ))} */}
//           </div>
//         </div>
//       </section>

//       <SEOMainContent/>
//       <ShopByCategories/>
//     </>
//   );
// };

// export default Hero;


"use client";
import { BlogsCard } from "@/components/blog-card";
import SEOMainContent from "@/seo/seo-main-content";
import FeaturedProducts from "./feature-product";
import FeaturedBrands from "./features-brand";
import HeroBanner, { SliderItem } from "./hero-banner";
import ShopByCategories from "./shop-by-category";
import type { ApiCategory, FeaturedCategory } from "@/utils/types";


// ── Component ──────────────────────────────────────────────────────────────────
export const Home = ({ sliderItems = [], sliderItemsTwo = [], featuredCategories = [], featuredProducts = [], featuredBrandProducts = [], blogs = [] }: { sliderItems?: SliderItem[], sliderItemsTwo?: SliderItem[], featuredCategories?: ApiCategory[], featuredProducts?: FeaturedCategory[], featuredBrandProducts?: FeaturedCategory[], blogs?: any[] }) => {

  return (
    <>
     <HeroBanner slides={sliderItems} sliderItemsTwo={sliderItemsTwo} />
      <SEOMainContent
        categorySlug="horeca-store"
        APIDATA={{
          title: "Your One-Stop Shop for Professional Kitchen & Hospitality Equipment",
          description:
            "HorecaStore is the UAE's leading B2B marketplace for hotels, restaurants, and cafes. Browse thousands of NSF & UL certified products — from commercial cooking equipment and refrigeration to smallwares and supplies. Get competitive pricing, fast delivery, and dedicated support for all your hospitality needs.",
        }}
      />
      <ShopByCategories categories={featuredCategories} />
      <FeaturedProducts products={featuredProducts} />
      <div className="w-full md:py-10 py-4">
        <div className="global-container">
        <div className="grid grid-cols-1">
          <img src="https://www.thehorecastore.com/images/Banners/Food%20Truck/Hero%20Banner.webp" alt="" className="rounded-[7px]" />
        </div>
        </div>
      </div>
      <FeaturedBrands products={featuredBrandProducts} />
      <BlogsCard showAll={false} blogs={blogs} />
      {/* <NewsletterSection/> */}
    </>
  );
};

export default Home;
