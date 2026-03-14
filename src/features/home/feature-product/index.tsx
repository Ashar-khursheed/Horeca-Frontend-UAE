// "use client";

// import { useState, useEffect } from "react";
// import { ChevronRight } from "lucide-react";
// import ProductCard, { ApiProduct } from "@/components/product-card";

// // ─── API Response Type ────────────────────────────────────────────────────────
// interface CategoryGroup {
//   category_name: string;
//   featured_products: ApiProduct[];
// }

// // ─── Static data (replace with your API call) ─────────────────────────────────
// // Paste your full API response here — trimmed to show structure:
// const FEATURED_DATA: CategoryGroup[] = [
//   {
//     category_name: "Bottle Cooler",
//     featured_products: [
//       {
//         id: 2794,
//         name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
//         url: "turbo-air-36in-bottle-cooler-9cuft-super-deluxe-tbc-36sb-n6",
//         category_url: "bottle-cooler",
//         parent_category_url: "refrigeration",
//         sku: "TBC-36SB-N6",
//         price: 2395.26, sale_price: 0, original_price: 2395.26, front_sale_price: 0, best_price: 2395.26,
//         avg_rating: null, total_reviews: 0, currency: "$",
//         in_wishlist: true,
//         images: ["https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-36SB-N6_6bb5506e-9c7b-45cb-8134-5944faa67a1a.webp"],
//         alt_tags: ["Turbo Air TBC-36SB-N6 Bottle Cooler"],
//         delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "90 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 2795,
//         name: 'Turbo Air TBC-36SD-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
//         url: "turbo-air-36inch-bottle-cooler-9cuft-super-deluxe",
//         category_url: "bottle-cooler", parent_category_url: "refrigeration",
//         sku: "TBC-36SD-N6",
//         price: 3215.84, sale_price: 0, original_price: 3215.84, front_sale_price: 0, best_price: 3215.84,
//         avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
//         images: ["https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-36SD-N6_804ef342-b3ab-46b6-a800-d2db61ac6bdc.webp"],
//         alt_tags: ["TBC-36SD-N6"],
//         delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "90 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 2796,
//         name: 'Turbo Air TBC-24SB-N6 24" Super Deluxe Bottle Cooler, 3.6 cu. Ft.',
//         url: "turbo-air-24inch-bottle-cooler-5cuft-super-deluxe",
//         category_url: "bottle-cooler", parent_category_url: "refrigeration",
//         sku: "TBC-24SB-N6",
//         price: 2426.63, sale_price: 0, original_price: 2426.63, front_sale_price: 0, best_price: 2426.63,
//         avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
//         images: ["https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-24SB-N6_196b76cb-f68f-4bb2-a05e-e3da2f0b30b4.webp"],
//         alt_tags: ["TBC-24SB-N6"],
//         delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "90 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 2797,
//         name: 'Turbo Air TBC-24SD-N6 24" Super Deluxe Bottle Cooler, 1 Lid, Stainless Steel, 3.6 cu.ft.',
//         url: "turbo-air-24inch-bottle-cooler-1lid-stainless-steel-4cuft",
//         category_url: "bottle-cooler", parent_category_url: "refrigeration",
//         sku: "TBC-24SD-N6",
//         price: 2931.23, sale_price: 0, original_price: 2931.23, front_sale_price: 0, best_price: 2931.23,
//         avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
//         images: ["https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-24SD-N6_22975064-10c7-4af2-9a0f-d71b10a8b938.webp"],
//         alt_tags: ["TBC-24SD-N6"],
//         delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "90 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 31546,
//         name: 'True TD-80-30-HC 80" Forced Air Bottle Cooler, Holds 720 Bottles, Black, Lid Locks',
//         url: "true-80inch-forced-air-bottle-cooler-holds-720bottles-black",
//         category_url: "bottle-cooler", parent_category_url: "refrigeration",
//         sku: "TD-80-30-HC",
//         price: 4514.06, sale_price: 0, original_price: 4514.06, front_sale_price: 0, best_price: 4514.06,
//         avg_rating: 4.333333333333333, total_reviews: 6, currency: "$", in_wishlist: false,
//         images: ["https://d1p9kdrbe10xzz.cloudfront.net/production/products/TD-80-30-HC_4124c01d-5b87-49e4-94c4-e3504465404b.webp"],
//         alt_tags: ["TD-80-30-HC"],
//         delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "90 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//     ],
//   },
//   {
//     category_name: "Planetary Mixer",
//     featured_products: [
//       {
//         id: 2866,
//         name: "BakeMax BMPM080 80 Qt. Planetary Mixer, Floor Model",
//         url: "bakemax-80qt-planetary-mixer-floor-model",
//         category_url: "planetary-mixer", parent_category_url: "restaurant-equipment",
//         sku: "BMPM080",
//         price: 22423, sale_price: 19990, original_price: 22423, front_sale_price: 19990, best_price: 22423,
//         avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
//         images: [
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_7JiqdDIooIC58z6kKhvJ.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_0jy5eJAxs5Q7MVOf1FPv.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_Ux6fx2g4m6MdrYodaWjG.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_WSnnbJOn5rsd22Zs83Ss.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_WcutCXvRKXXVQlIy7p0H.webp",
//         ],
//         alt_tags: ["BakeMax BMPM080"],
//         delivery_days: "5 to 7 Days", free_shipping: 0, return_policy: "7 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 2867,
//         name: "BakeMax BMPM60B 60 Qt. Commercial Planetary Mixer",
//         url: "bakemax-60qt-commercial-planetary-mixer-bmpm60b",
//         category_url: "planetary-mixer", parent_category_url: "restaurant-equipment",
//         sku: "BMPM60B",
//         price: 14591, sale_price: 13861.45, original_price: 14591, front_sale_price: 13861.45, best_price: 14591,
//         avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
//         images: [
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM60B_XniHSJAto7OVaZE44uGp.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM60B_DyyhK6RikpMggEKXygaL.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM60B_tJyT2blRB0wodrE75ZcL.webp",
//         ],
//         alt_tags: ["BakeMax BMPM60B"],
//         delivery_days: "5 to 7 Days", free_shipping: 0, return_policy: "7 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 2869,
//         name: "BakeMax BMPM040 40 Qt. Commercial Planetary Mixer",
//         url: "bakemax-40qt-commercial-planetary-mixer",
//         category_url: "planetary-mixer", parent_category_url: "restaurant-equipment",
//         sku: "BMPM040",
//         price: 8545, sale_price: 7605.05, original_price: 8545, front_sale_price: 7605.05, best_price: 8545,
//         avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
//         images: [
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM040_SWqsva0ozhXZKsFCNKN2.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM040_typ7y23G3QaeP65s67yk.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM040_xFl8Wui4inOgIBtYSaZ3.webp",
//         ],
//         alt_tags: ["BakeMax BMPM040"],
//         delivery_days: "5 to 7 Days", free_shipping: 0, return_policy: "7 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 2871,
//         name: "BakeMax BMPM20A 20 Qt. Commercial Planetary Mixer",
//         url: "bakemax-20qt-commercial-planetary-mixer-bmpm20a",
//         category_url: "planetary-mixer", parent_category_url: "restaurant-equipment",
//         sku: "BMPM20A",
//         price: 3924, sale_price: 0, original_price: 3924, front_sale_price: 0, best_price: 3924,
//         avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
//         images: [
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM20A_tRZdG5lTrBc0cqTpMIJK.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM20A_qoV31IE4k61xSLXkezkX.webp",
//         ],
//         alt_tags: ["BakeMax BMPM20A"],
//         delivery_days: "5 to 7 Days", free_shipping: 0, return_policy: "7 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 2875,
//         name: "BakeMax BMPME30 30 Qt. Commercial Planetary Mixer",
//         url: "bakemax-30qt-commercial-planetary-mixer",
//         category_url: "planetary-mixer", parent_category_url: "restaurant-equipment",
//         sku: "BMPME30",
//         price: 2355, sale_price: 0, original_price: 2355, front_sale_price: 0, best_price: 2355,
//         avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
//         images: [
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPME30_7DGhD1kJACNjt538DFWN.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPME30_zm4V5UP4Qw2QMhRyI6n2.webp",
//         ],
//         alt_tags: ["BakeMax BMPME30"],
//         delivery_days: "5 to 7 Days", free_shipping: 0, return_policy: "7 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//     ],
//   },
//   {
//     category_name: "Commercial Espresso Machine",
//     featured_products: [
//       {
//         id: 22024,
//         name: "Nuova Simonelli Appia Life Compact Vol 2GR Espresso Machine with Autosteam - 110V",
//         url: "nuova-simonelli-appia-life-compact-vol-2gr-espresso-machine",
//         category_url: "commercial-espresso-machine", parent_category_url: "restaurant-equipment",
//         sku: "MAPPC19VOL02ND0004",
//         price: 8250, sale_price: 0, original_price: 8250, front_sale_price: 0, best_price: 8250,
//         avg_rating: 4.6, total_reviews: 5, currency: "$", in_wishlist: false,
//         images: [
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPC19VOL02ND0004_dXz5uXPLOzoEgjqxkCYo.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPC19VOL02ND0004_IM6yxsIcbR3yWuh6onCO.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPC19VOL02ND0004_tvLFe6jRUxKWlZjKF6X5.webp",
//         ],
//         alt_tags: ["Nuova Simonelli Appia Life"],
//         delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "14 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: 0,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 22903,
//         name: "Nuova Simonelli Oscar II Pour Over Professional Espresso Coffee Machine - 110 V",
//         url: "nuova-simonelli-oscar-ii-pour-over-espresso-coffee-machine",
//         category_url: "commercial-espresso-machine", parent_category_url: "restaurant-equipment",
//         sku: "MOSCAIITEM01ND0001",
//         price: 2112, sale_price: 0, original_price: 2112, front_sale_price: 0, best_price: 2112,
//         avg_rating: 4.2, total_reviews: 5, currency: "$", in_wishlist: false,
//         images: [
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MOSCAIITEM01ND0001_kUSxdgxQoacgAt9twnVM.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MOSCAIITEM01ND0001_4WvK7IUvnHsY8OCAWxn4.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MOSCAIITEM01ND0001_V1t0FKIIn5Gjh5STkML5.webp",
//         ],
//         alt_tags: ["Oscar II Pour Over"],
//         delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "14 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: 0,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 22905,
//         name: "Nuova Simonelli Musica Pour Over Espresso Machine - 110 V",
//         url: "nuova-simonelli-musica-pour-over-espresso-machine",
//         category_url: "commercial-espresso-machine", parent_category_url: "restaurant-equipment",
//         sku: "MMUSICAVOL01ND0001",
//         price: 3150, sale_price: 0, original_price: 3150, front_sale_price: 0, best_price: 3150,
//         avg_rating: 4.6, total_reviews: 5, currency: "$", in_wishlist: false,
//         images: [
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MMUSICAVOL01ND0001_tVYw5d2SOFrhGwu8IPbd.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MMUSICAVOL01ND0001_m601jhn85N2kcytxHoe2.webp",
//         ],
//         alt_tags: ["Musica Pour Over"],
//         delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "14 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: 0,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 22913,
//         name: "Nuova Simonelli Appia Life Pearl 2GR Espresso Machine - 220 V",
//         url: "nuova-simonelli-appia-life-pearl-2gr-espresso-machine-220v",
//         category_url: "commercial-espresso-machine", parent_category_url: "restaurant-equipment",
//         sku: "MAPPI19VOL02ND0002",
//         price: 8990, sale_price: 0, original_price: 8990, front_sale_price: 0, best_price: 8990,
//         avg_rating: 4.8, total_reviews: 5, currency: "$", in_wishlist: false,
//         images: [
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPI19VOL02ND0002_WZ0HsIyZMhppNRsOKO4O.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPI19VOL02ND0002_EdGcaIPskpJJAlp9czLp.webp",
//         ],
//         alt_tags: ["Appia Life Pearl"],
//         delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "14 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//       {
//         id: 22912,
//         name: "Nuova Simonelli Appia Life 1GR Volumetric Espresso Machine - 110V",
//         url: "nuova-simonelli-appia-life-1gr-volumetric-espresso-machine",
//         category_url: "commercial-espresso-machine", parent_category_url: "restaurant-equipment",
//         sku: "MAPPI19VOL01ND0001",
//         price: 5200, sale_price: 0, original_price: 5200, front_sale_price: 0, best_price: 5200,
//         avg_rating: 4.0, total_reviews: 5, currency: "$", in_wishlist: false,
//         images: [
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPI19VOL01ND0001_G73gpINqY8uutWwYFQuZ.webp",
//           "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPI19VOL01ND0001_fwaHiYo0XmRYnKj4OJDB.webp",
//         ],
//         alt_tags: ["Appia Life 1GR"],
//         delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "14 Days",
//         min_quantity: 1, is_fixed: 0, quote_available: null,
//         selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
//         isRequired: false,
//       },
//     ],
//   },
// ];

// // ─── Section Component ────────────────────────────────────────────────────────
// export const FeaturedProducts = () => {
//   const tabs = FEATURED_DATA.map((g) => g.category_name);
//   const [activeTab, setActiveTab] = useState(tabs[0]);

//   const activeGroup = FEATURED_DATA.find((g) => g.category_name === activeTab);
//   const products = activeGroup?.featured_products?.slice(0, 5) ?? [];

//   // For API usage: replace FEATURED_DATA with fetched data
//   // useEffect(() => { fetch("/api/featured").then(...) }, []);

//   return (
//     <section className="w-full bg-white py-6 px-4 md:px-6">
//       <div className="global-container">

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
//           <h2 className="text-[18px] font-semibold text-slate-900 tracking-tight shrink-0">
//             Featured Products
//           </h2>

//           {/* Tabs */}
//           <div className="flex items-center  gap-1 pb-0.5  flex-1 justify-end ">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`
//                   whitespace-nowrap px-3 py-1.5 text-[14px] font-normal
//                   rounded-full flex-shrink-0 transition-all duration-200
//                   ${activeTab === tab
//                     ? "bg-[#186737] text-white shadow-sm"
//                     : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
//                   }
//                 `}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//         </div>

//         <div className="w-full h-px bg-slate-100 mb-4" />

//         {/* Grid — 5 cols desktop, uniform height cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-5 gap-3">
//           {products.map((product) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               onAddToCart={(p, qty) => console.log("Cart:", p.name, qty)}
//               onWishlistToggle={(p, w) => console.log("Wishlist:", p.name, w)}
//             />
//           ))}
//         </div>

//         {/* Mobile view all */}
//         <div className="mt-4 flex justify-center md:hidden">
//           <a
//             href="#"
//             className="flex items-center gap-1.5 text-[12px] font-semibold text-[#186737]
//               border border-[#BCE3C9] rounded-lg px-4 py-2
//               hover:bg-[#186737] hover:text-white transition-colors"
//           >
//             View All {activeTab} <ChevronRight size={13} />
//           </a>
//         </div>
//       </div>

//       <style >{`
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </section>
//   );
// };

// export default FeaturedProducts;

"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard, { ApiProduct } from "@/components/product-card";

// ─── API Response Type ────────────────────────────────────────────────────────
interface CategoryGroup {
  category_name: string;
  featured_products: ApiProduct[];
}

// ─── Static data (replace with API call) ─────────────────────────────────────
const FEATURED_DATA: CategoryGroup[] = [
  {
    category_name: "Bottle Cooler",
    featured_products: [
      {
        id: 2794,
        name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
        url: "turbo-air-36in-bottle-cooler-9cuft-super-deluxe-tbc-36sb-n6",
        category_url: "bottle-cooler",
        parent_category_url: "refrigeration",
        sku: "TBC-36SB-N6",
        price: 2395.26, sale_price: 0, original_price: 2395.26, front_sale_price: 0, best_price: 2395.26,
        avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: true,
        images: ["https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-36SB-N6_6bb5506e-9c7b-45cb-8134-5944faa67a1a.webp"],
        alt_tags: ["Turbo Air TBC-36SB-N6 Bottle Cooler"],
        delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "90 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 2795,
        name: 'Turbo Air TBC-36SD-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
        url: "turbo-air-36inch-bottle-cooler-9cuft-super-deluxe",
        category_url: "bottle-cooler", parent_category_url: "refrigeration",
        sku: "TBC-36SD-N6",
        price: 3215.84, sale_price: 0, original_price: 3215.84, front_sale_price: 0, best_price: 3215.84,
        avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
        images: ["https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-36SD-N6_804ef342-b3ab-46b6-a800-d2db61ac6bdc.webp"],
        alt_tags: ["TBC-36SD-N6"],
        delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "90 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 2796,
        name: 'Turbo Air TBC-24SB-N6 24" Super Deluxe Bottle Cooler, 3.6 cu. Ft.',
        url: "turbo-air-24inch-bottle-cooler-5cuft-super-deluxe",
        category_url: "bottle-cooler", parent_category_url: "refrigeration",
        sku: "TBC-24SB-N6",
        price: 2426.63, sale_price: 0, original_price: 2426.63, front_sale_price: 0, best_price: 2426.63,
        avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
        images: ["https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-24SB-N6_196b76cb-f68f-4bb2-a05e-e3da2f0b30b4.webp"],
        alt_tags: ["TBC-24SB-N6"],
        delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "90 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 2797,
        name: 'Turbo Air TBC-24SD-N6 24" Super Deluxe Bottle Cooler, 1 Lid, Stainless Steel, 3.6 cu.ft.',
        url: "turbo-air-24inch-bottle-cooler-1lid-stainless-steel-4cuft",
        category_url: "bottle-cooler", parent_category_url: "refrigeration",
        sku: "TBC-24SD-N6",
        price: 2931.23, sale_price: 0, original_price: 2931.23, front_sale_price: 0, best_price: 2931.23,
        avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
        images: ["https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-24SD-N6_22975064-10c7-4af2-9a0f-d71b10a8b938.webp"],
        alt_tags: ["TBC-24SD-N6"],
        delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "90 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 31546,
        name: 'True TD-80-30-HC 80" Forced Air Bottle Cooler, Holds 720 Bottles, Black, Lid Locks',
        url: "true-80inch-forced-air-bottle-cooler-holds-720bottles-black",
        category_url: "bottle-cooler", parent_category_url: "refrigeration",
        sku: "TD-80-30-HC",
        price: 4514.06, sale_price: 0, original_price: 4514.06, front_sale_price: 0, best_price: 4514.06,
        avg_rating: 4.3, total_reviews: 6, currency: "$", in_wishlist: false,
        images: ["https://d1p9kdrbe10xzz.cloudfront.net/production/products/TD-80-30-HC_4124c01d-5b87-49e4-94c4-e3504465404b.webp"],
        alt_tags: ["TD-80-30-HC"],
        delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "90 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      
    ],
  },
  {
    category_name: "Planetary Mixer",
    featured_products: [
      {
        id: 2866,
        name: "BakeMax BMPM080 80 Qt. Planetary Mixer, Floor Model",
        url: "bakemax-80qt-planetary-mixer-floor-model",
        category_url: "planetary-mixer", parent_category_url: "restaurant-equipment",
        sku: "BMPM080",
        price: 22423, sale_price: 19990, original_price: 22423, front_sale_price: 19990, best_price: 22423,
        avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
        images: [
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_7JiqdDIooIC58z6kKhvJ.webp",
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_0jy5eJAxs5Q7MVOf1FPv.webp",
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_Ux6fx2g4m6MdrYodaWjG.webp",
        ],
        alt_tags: ["BakeMax BMPM080"],
        delivery_days: "5 to 7 Days", free_shipping: 0, return_policy: "7 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 2867,
        name: "BakeMax BMPM60B 60 Qt. Commercial Planetary Mixer",
        url: "bakemax-60qt-commercial-planetary-mixer-bmpm60b",
        category_url: "planetary-mixer", parent_category_url: "restaurant-equipment",
        sku: "BMPM60B",
        price: 14591, sale_price: 13861.45, original_price: 14591, front_sale_price: 13861.45, best_price: 14591,
        avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
        images: [
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM60B_XniHSJAto7OVaZE44uGp.webp",
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM60B_DyyhK6RikpMggEKXygaL.webp",
        ],
        alt_tags: ["BakeMax BMPM60B"],
        delivery_days: "5 to 7 Days", free_shipping: 0, return_policy: "7 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 2869,
        name: "BakeMax BMPM040 40 Qt. Commercial Planetary Mixer",
        url: "bakemax-40qt-commercial-planetary-mixer",
        category_url: "planetary-mixer", parent_category_url: "restaurant-equipment",
        sku: "BMPM040",
        price: 8545, sale_price: 7605.05, original_price: 8545, front_sale_price: 7605.05, best_price: 8545,
        avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
        images: [
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM040_SWqsva0ozhXZKsFCNKN2.webp",
        ],
        alt_tags: ["BakeMax BMPM040"],
        delivery_days: "5 to 7 Days", free_shipping: 0, return_policy: "7 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 2871,
        name: "BakeMax BMPM20A 20 Qt. Commercial Planetary Mixer",
        url: "bakemax-20qt-commercial-planetary-mixer-bmpm20a",
        category_url: "planetary-mixer", parent_category_url: "restaurant-equipment",
        sku: "BMPM20A",
        price: 3924, sale_price: 0, original_price: 3924, front_sale_price: 0, best_price: 3924,
        avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
        images: [
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM20A_tRZdG5lTrBc0cqTpMIJK.webp",
        ],
        alt_tags: ["BakeMax BMPM20A"],
        delivery_days: "5 to 7 Days", free_shipping: 0, return_policy: "7 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 2875,
        name: "BakeMax BMPME30 30 Qt. Commercial Planetary Mixer",
        url: "bakemax-30qt-commercial-planetary-mixer",
        category_url: "planetary-mixer", parent_category_url: "restaurant-equipment",
        sku: "BMPME30",
        price: 2355, sale_price: 0, original_price: 2355, front_sale_price: 0, best_price: 2355,
        avg_rating: null, total_reviews: 0, currency: "$", in_wishlist: false,
        images: [
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPME30_7DGhD1kJACNjt538DFWN.webp",
        ],
        alt_tags: ["BakeMax BMPME30"],
        delivery_days: "5 to 7 Days", free_shipping: 0, return_policy: "7 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
    ],
  },
  {
    category_name: "Commercial Espresso Machine",
    featured_products: [
      {
        id: 22024,
        name: "Nuova Simonelli Appia Life Compact Vol 2GR Espresso Machine with Autosteam - 110V",
        url: "nuova-simonelli-appia-life-compact-vol-2gr-espresso-machine",
        category_url: "commercial-espresso-machine", parent_category_url: "restaurant-equipment",
        sku: "MAPPC19VOL02ND0004",
        price: 8250, sale_price: 0, original_price: 8250, front_sale_price: 0, best_price: 8250,
        avg_rating: 4.6, total_reviews: 5, currency: "$", in_wishlist: false,
        images: [
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPC19VOL02ND0004_dXz5uXPLOzoEgjqxkCYo.webp",
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPC19VOL02ND0004_IM6yxsIcbR3yWuh6onCO.webp",
        ],
        alt_tags: ["Nuova Simonelli Appia Life"],
        delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "14 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 22903,
        name: "Nuova Simonelli Oscar II Pour Over Professional Espresso Coffee Machine - 110 V",
        url: "nuova-simonelli-oscar-ii-pour-over-espresso-coffee-machine",
        category_url: "commercial-espresso-machine", parent_category_url: "restaurant-equipment",
        sku: "MOSCAIITEM01ND0001",
        price: 2112, sale_price: 0, original_price: 2112, front_sale_price: 0, best_price: 2112,
        avg_rating: 4.2, total_reviews: 5, currency: "$", in_wishlist: false,
        images: [
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MOSCAIITEM01ND0001_kUSxdgxQoacgAt9twnVM.webp",
        ],
        alt_tags: ["Oscar II Pour Over"],
        delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "14 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 22905,
        name: "Nuova Simonelli Musica Pour Over Espresso Machine - 110 V",
        url: "nuova-simonelli-musica-pour-over-espresso-machine",
        category_url: "commercial-espresso-machine", parent_category_url: "restaurant-equipment",
        sku: "MMUSICAVOL01ND0001",
        price: 3150, sale_price: 0, original_price: 3150, front_sale_price: 0, best_price: 3150,
        avg_rating: 4.6, total_reviews: 5, currency: "$", in_wishlist: false,
        images: [
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MMUSICAVOL01ND0001_tVYw5d2SOFrhGwu8IPbd.webp",
        ],
        alt_tags: ["Musica Pour Over"],
        delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "14 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 22913,
        name: "Nuova Simonelli Appia Life Pearl 2GR Espresso Machine - 220 V",
        url: "nuova-simonelli-appia-life-pearl-2gr-espresso-machine-220v",
        category_url: "commercial-espresso-machine", parent_category_url: "restaurant-equipment",
        sku: "MAPPI19VOL02ND0002",
        price: 8990, sale_price: 0, original_price: 8990, front_sale_price: 0, best_price: 8990,
        avg_rating: 4.8, total_reviews: 5, currency: "$", in_wishlist: false,
        images: [
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPI19VOL02ND0002_WZ0HsIyZMhppNRsOKO4O.webp",
        ],
        alt_tags: ["Appia Life Pearl"],
        delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "14 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
      {
        id: 22912,
        name: "Nuova Simonelli Appia Life 1GR Volumetric Espresso Machine - 110V",
        url: "nuova-simonelli-appia-life-1gr-volumetric-espresso-machine",
        category_url: "commercial-espresso-machine", parent_category_url: "restaurant-equipment",
        sku: "MAPPI19VOL01ND0001",
        price: 5200, sale_price: 0, original_price: 5200, front_sale_price: 0, best_price: 5200,
        avg_rating: 4.0, total_reviews: 5, currency: "$", in_wishlist: false,
        images: [
          "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MAPPI19VOL01ND0001_G73gpINqY8uutWwYFQuZ.webp",
        ],
        alt_tags: ["Appia Life 1GR"],
        delivery_days: "5 to 7 Days", free_shipping: 1, return_policy: "14 Days",
        min_quantity: 1, is_fixed: 0, quote_available: null,
        selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
        isRequired: false,
      },
    ],
  },
];

// ─── FeaturedProducts Component ───────────────────────────────────────────────
export const FeaturedProducts = () => {
  const tabs = FEATURED_DATA.map((g) => g.category_name);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const activeGroup = FEATURED_DATA.find((g) => g.category_name === activeTab);
  const products = activeGroup?.featured_products?.slice(0, 10) ?? [];

  return (
    <section className="w-full bg-white py-5 px-0 sm:px-4 md:px-6">
      <div className="global-container">

        {/* ── HEADER ─────────────────────────────────────────────────── */}
<div className="flex items-center justify-between gap-2 mb-3 px-4 sm:px-0 flex-wrap">
          <h2 className="text-[17px] sm:text-[19px] font-bold text-slate-900 shrink-0">
            Featured Products
          </h2>
    <div className="flex items-center gap-1.5 mb-4 overflow-x-auto hide-scrollbar md:px-4 px-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "whitespace-nowrap px-3.5 py-1.5 text-[13px] font-medium rounded-full flex-shrink-0 transition-all duration-200",
                activeTab === tab
                  ? "bg-[#186737] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>
         
        </div>

        {/* ── TABS ─────────────────────────────────────────────────────── */}
    

        <div className="w-full h-px bg-slate-100 mb-4 mx-4 sm:mx-0" style={{ width: "calc(100% - 2rem)" }} />

        {/* ── PRODUCT LIST ──────────────────────────────────────────────
            Mobile  : horizontal scroll, each card 180px wide
            Tablet  : 3-col grid
            Desktop : 5-col grid
        ────────────────────────────────────────────────────────────────*/}

        {/* MOBILE — horizontal scroll */}
        <div className="flex sm:hidden gap-3 overflow-x-auto hide-scrollbar px-4 pb-2">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[175px]">
              <ProductCard
                product={product}
                onAddToCart={(p, qty) => console.log("Cart:", p.name, qty)}
                onWishlistToggle={(p, w) => console.log("Wishlist:", p.name, w)}
              />
            </div>
          ))}
        </div>

        {/* TABLET + DESKTOP — grid */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(p, qty) => console.log("Cart:", p.name, qty)}
              onWishlistToggle={(p, w) => console.log("Wishlist:", p.name, w)}
            />
          ))}
        </div>

       

      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;