"use client";

import { useState, useMemo, useRef } from "react";
import ProductCard, { ApiProduct } from "@/components/product-card";
import Pagination from "@/components/pagination";
import { Search, X, ArrowLeft } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import BannerMegaSale from "@/assets/banners/mega-sale/sale-horeca.48eebdaf2a1a79520430.png";
import { generateDynamicCSSProductCard } from "@/utils/dynamic-css";
// ─── Sale Categories ──────────────────────────────────────────────────────────
const SALE_CATEGORIES = [
  {
    id: 1,
    name: "Planetary Mixers",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_7JiqdDIooIC58z6kKhvJ.webp",
  },
  {
    id: 2,
    name: "Spiral Dough Mixers",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMSM060_RLBR6DGi0FqAUEJjTxkW.webp",
  },
  {
    id: 3,
    name: "Commercial Refrigerators",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-36SB-N6_6bb5506e-9c7b-45cb-8134-5944faa67a1a.webp",
  },
  {
    id: 4,
    name: "Deck Ovens",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPO-206_6IarKRaJKhp0e9hQ3rkL.webp",
  },
  {
    id: 5,
    name: "Hot Food Display",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/Hatco-GRSSR-48D_a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp",
  },
  {
    id: 6,
    name: "Undercounter Dishwashers",
    image:
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMUD-CF_9f0e1d2c-3b4a-5968-7c8d-9e0f1a2b3c4d.webp",
  },
];

// ─── Sale Products Static Data ────────────────────────────────────────────────
const ALL_SALE_PRODUCTS: ApiProduct[] = [
  // Planetary Mixers
  {
    id: 2866,
    name: "BakeMax BMPM080 80 Qt. Planetary Mixer, Floor Model",
    url: "bakemax-80qt-planetary-mixer-floor-model",
    category_url: "planetary-mixer",
    parent_category_url: "restaurant-equipment",
    sku: "BMPM080",
    price: 22423,
    sale_price: 19990.26,
    original_price: 22423,
    front_sale_price: 19990.26,
    best_price: 19990.26,
    avg_rating: 4.5,
    total_reviews: 12,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_7JiqdDIooIC58z6kKhvJ.webp",
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_0jy5eJAxs5Q7MVOf1FPv.webp",
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_Ux6fx2g4m6MdrYodaWjG.webp",
    ],
    alt_tags: ["BakeMax BMPM080 80 Qt Planetary Mixer"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "7 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 2867,
    name: "BakeMax BMPM60B 60 Qt. Commercial Planetary Mixer",
    url: "bakemax-60qt-commercial-planetary-mixer-bmpm60b",
    category_url: "planetary-mixer",
    parent_category_url: "restaurant-equipment",
    sku: "BMPM60B",
    price: 14591,
    sale_price: 13099.5,
    original_price: 14591,
    front_sale_price: 13099.5,
    best_price: 13099.5,
    avg_rating: 4.2,
    total_reviews: 8,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM60B_XniHSJAto7OVaZE44uGp.webp",
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM60B_DyyhK6RikpMggEKXygaL.webp",
    ],
    alt_tags: ["BakeMax BMPM60B 60 Qt Planetary Mixer"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "7 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 2869,
    name: "BakeMax BMPM040 40 Qt. Commercial Planetary Mixer",
    url: "bakemax-40qt-commercial-planetary-mixer",
    category_url: "planetary-mixer",
    parent_category_url: "restaurant-equipment",
    sku: "BMPM040",
    price: 8545,
    sale_price: 7605.05,
    original_price: 8545,
    front_sale_price: 7605.05,
    best_price: 7605.05,
    avg_rating: 4.0,
    total_reviews: 5,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM040_SWqsva0ozhXZKsFCNKN2.webp",
    ],
    alt_tags: ["BakeMax BMPM040 40 Qt Planetary Mixer"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "7 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 2871,
    name: "BakeMax BMPM20A 20 Qt. Commercial Planetary Mixer",
    url: "bakemax-20qt-commercial-planetary-mixer-bmpm20a",
    category_url: "planetary-mixer",
    parent_category_url: "restaurant-equipment",
    sku: "BMPM20A",
    price: 3924,
    sale_price: 3335.4,
    original_price: 3924,
    front_sale_price: 3335.4,
    best_price: 3335.4,
    avg_rating: null,
    total_reviews: 0,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM20A_abc123def456.webp",
    ],
    alt_tags: ["BakeMax BMPM20A 20 Qt Planetary Mixer"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "7 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  // Bottle Coolers / Refrigeration
  {
    id: 2794,
    name: 'Turbo Air TBC-36SB-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
    url: "turbo-air-36in-bottle-cooler-9cuft-super-deluxe-tbc-36sb-n6",
    category_url: "bottle-cooler",
    parent_category_url: "refrigeration",
    sku: "TBC-36SB-N6",
    price: 2395.26,
    sale_price: 1916.21,
    original_price: 2395.26,
    front_sale_price: 1916.21,
    best_price: 1916.21,
    avg_rating: 4.7,
    total_reviews: 19,
    currency: "$",
    in_wishlist: true,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-36SB-N6_6bb5506e-9c7b-45cb-8134-5944faa67a1a.webp",
    ],
    alt_tags: ["Turbo Air TBC-36SB-N6 36 Bottle Cooler"],
    delivery_days: "5 to 7 Days",
    free_shipping: 1,
    return_policy: "90 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 2795,
    name: 'Turbo Air TBC-36SD-N6 36" Super Deluxe Bottle Cooler, 8.5 cu. Ft.',
    url: "turbo-air-36inch-bottle-cooler-9cuft-super-deluxe",
    category_url: "bottle-cooler",
    parent_category_url: "refrigeration",
    sku: "TBC-36SD-N6",
    price: 3215.84,
    sale_price: 2572.67,
    original_price: 3215.84,
    front_sale_price: 2572.67,
    best_price: 2572.67,
    avg_rating: 4.3,
    total_reviews: 7,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-36SD-N6_804ef342-b3ab-46b6-a800-d2db61ac6bdc.webp",
    ],
    alt_tags: ["Turbo Air TBC-36SD-N6 Bottle Cooler"],
    delivery_days: "5 to 7 Days",
    free_shipping: 1,
    return_policy: "90 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 2796,
    name: 'Turbo Air TBC-24SB-N6 24" Super Deluxe Bottle Cooler, 3.6 cu. Ft.',
    url: "turbo-air-24inch-bottle-cooler-5cuft-super-deluxe",
    category_url: "bottle-cooler",
    parent_category_url: "refrigeration",
    sku: "TBC-24SB-N6",
    price: 2426.63,
    sale_price: 1941.3,
    original_price: 2426.63,
    front_sale_price: 1941.3,
    best_price: 1941.3,
    avg_rating: null,
    total_reviews: 0,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TBC-24SB-N6_196b76cb-f68f-4bb2-a05e-e3da2f0b30b4.webp",
    ],
    alt_tags: ["Turbo Air TBC-24SB-N6 24 Bottle Cooler"],
    delivery_days: "5 to 7 Days",
    free_shipping: 1,
    return_policy: "90 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 31546,
    name: 'True TD-80-30-HC 80" Forced Air Bottle Cooler, Holds 720 Bottles',
    url: "true-80inch-forced-air-bottle-cooler-holds-720bottles-black",
    category_url: "bottle-cooler",
    parent_category_url: "refrigeration",
    sku: "TD-80-30-HC",
    price: 4514.06,
    sale_price: 3611.25,
    original_price: 4514.06,
    front_sale_price: 3611.25,
    best_price: 3611.25,
    avg_rating: 4.3,
    total_reviews: 6,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TD-80-30-HC_4124c01d-5b87-49e4-94c4-e3504465404b.webp",
    ],
    alt_tags: ["True TD-80-30-HC 80 Forced Air Bottle Cooler"],
    delivery_days: "5 to 7 Days",
    free_shipping: 1,
    return_policy: "90 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  // Spiral Dough Mixers
  {
    id: 3101,
    name: "BakeMax BMSM060 60 Qt. / 132 lb. Spiral Dough Mixer, Belt-Driven",
    url: "bakemax-60qt-spiral-dough-mixer-belt-driven",
    category_url: "spiral-dough-mixer",
    parent_category_url: "restaurant-equipment",
    sku: "BMSM060",
    price: 12749,
    sale_price: 9949,
    original_price: 12749,
    front_sale_price: 9949,
    best_price: 9949,
    avg_rating: 4.6,
    total_reviews: 14,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMSM060_RLBR6DGi0FqAUEJjTxkW.webp",
    ],
    alt_tags: ["BakeMax BMSM060 Spiral Dough Mixer"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "7 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 3102,
    name: "BakeMax BMSM040C 40 Qt. / 88 lb. Spiral Dough Mixer, Chain-Driven",
    url: "bakemax-40qt-spiral-dough-mixer-chain-driven",
    category_url: "spiral-dough-mixer",
    parent_category_url: "restaurant-equipment",
    sku: "BMSM040C",
    price: 10349,
    sale_price: 9349,
    original_price: 10349,
    front_sale_price: 9349,
    best_price: 9349,
    avg_rating: 4.1,
    total_reviews: 4,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMSM040C_abc789def012.webp",
    ],
    alt_tags: ["BakeMax BMSM040C Spiral Dough Mixer"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "7 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 3103,
    name: "BakeMax BMSM025 25 Qt. / 55 lb. Spiral Dough Mixer, Stainless Bowl",
    url: "bakemax-25qt-spiral-dough-mixer-stainless",
    category_url: "spiral-dough-mixer",
    parent_category_url: "restaurant-equipment",
    sku: "BMSM025",
    price: 7880,
    sale_price: 6725,
    original_price: 7880,
    front_sale_price: 6725,
    best_price: 6725,
    avg_rating: null,
    total_reviews: 0,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMSM025_def345ghi678.webp",
    ],
    alt_tags: ["BakeMax BMSM025 Spiral Dough Mixer"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "7 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 3104,
    name: "BakeMax BMSM015 15 Qt. / 33 lb. Spiral Dough Mixer, Compact",
    url: "bakemax-15qt-spiral-dough-mixer-compact",
    category_url: "spiral-dough-mixer",
    parent_category_url: "restaurant-equipment",
    sku: "BMSM015",
    price: 5500,
    sale_price: 4400,
    original_price: 5500,
    front_sale_price: 4400,
    best_price: 4400,
    avg_rating: 3.9,
    total_reviews: 3,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMSM015_ghi901jkl234.webp",
    ],
    alt_tags: ["BakeMax BMSM015 Compact Spiral Mixer"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "7 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  // Deck Ovens
  {
    id: 4001,
    name: "BakeMax BMPO-206 Double Deck Oven with 6 Deck Trays, Electric",
    url: "bakemax-double-deck-oven-6-trays-electric",
    category_url: "deck-oven",
    parent_category_url: "restaurant-equipment",
    sku: "BMPO-206",
    price: 16800,
    sale_price: 13440,
    original_price: 16800,
    front_sale_price: 13440,
    best_price: 13440,
    avg_rating: 4.4,
    total_reviews: 9,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPO-206_6IarKRaJKhp0e9hQ3rkL.webp",
    ],
    alt_tags: ["BakeMax BMPO-206 Double Deck Oven"],
    delivery_days: "7 to 10 Days",
    free_shipping: 0,
    return_policy: "7 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 4002,
    name: "BakeMax BMPO-103 Single Deck Oven with 3 Deck Trays, Electric",
    url: "bakemax-single-deck-oven-3-trays-electric",
    category_url: "deck-oven",
    parent_category_url: "restaurant-equipment",
    sku: "BMPO-103",
    price: 9200,
    sale_price: 7820,
    original_price: 9200,
    front_sale_price: 7820,
    best_price: 7820,
    avg_rating: null,
    total_reviews: 0,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPO-103_xyz789abc012.webp",
    ],
    alt_tags: ["BakeMax BMPO-103 Single Deck Oven"],
    delivery_days: "7 to 10 Days",
    free_shipping: 0,
    return_policy: "7 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  // Commercial Refrigerators
  {
    id: 5001,
    name: "Turbo Air MSR-49-N6 49 Cu. Ft. 2-Section Solid Door Reach-In Refrigerator",
    url: "turbo-air-49cuft-2section-solid-door-reach-in-refrigerator",
    category_url: "reach-in-refrigerator",
    parent_category_url: "refrigeration",
    sku: "MSR-49-N6",
    price: 3856,
    sale_price: 3085,
    original_price: 3856,
    front_sale_price: 3085,
    best_price: 3085,
    avg_rating: 4.8,
    total_reviews: 22,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MSR-49-N6_a1b2c3d4-e5f6-7890-abcd-ef0123456789.webp",
    ],
    alt_tags: ["Turbo Air MSR-49-N6 Reach-In Refrigerator"],
    delivery_days: "5 to 7 Days",
    free_shipping: 1,
    return_policy: "90 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 5002,
    name: "Turbo Air MSR-23-N6 23 Cu. Ft. 1-Section Solid Door Reach-In Refrigerator",
    url: "turbo-air-23cuft-1section-solid-door-reach-in-refrigerator",
    category_url: "reach-in-refrigerator",
    parent_category_url: "refrigeration",
    sku: "MSR-23-N6",
    price: 2648,
    sale_price: 2118.4,
    original_price: 2648,
    front_sale_price: 2118.4,
    best_price: 2118.4,
    avg_rating: 4.5,
    total_reviews: 11,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MSR-23-N6_b2c3d4e5-f6a7-8901-bcde-f12345678901.webp",
    ],
    alt_tags: ["Turbo Air MSR-23-N6 Reach-In Refrigerator"],
    delivery_days: "5 to 7 Days",
    free_shipping: 1,
    return_policy: "90 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  // Hot Food Display
  {
    id: 6001,
    name: "Hatco GRSSR-48D 48\" Slanted Glass Refrigerated Display Case",
    url: "hatco-48inch-slanted-glass-refrigerated-display",
    category_url: "hot-food-display",
    parent_category_url: "food-display",
    sku: "GRSSR-48D",
    price: 5180,
    sale_price: 3626,
    original_price: 5180,
    front_sale_price: 3626,
    best_price: 3626,
    avg_rating: 4.2,
    total_reviews: 6,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/GRSSR-48D_c3d4e5f6-a7b8-9012-cdef-g34567890123.webp",
    ],
    alt_tags: ["Hatco GRSSR-48D Refrigerated Display Case"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "30 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 6002,
    name: "Hatco GRSSR-36D 36\" Slanted Glass Hot Food Display Warmer",
    url: "hatco-36inch-slanted-glass-hot-food-display-warmer",
    category_url: "hot-food-display",
    parent_category_url: "food-display",
    sku: "GRSSR-36D",
    price: 4320,
    sale_price: 3024,
    original_price: 4320,
    front_sale_price: 3024,
    best_price: 3024,
    avg_rating: null,
    total_reviews: 0,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/GRSSR-36D_d4e5f6a7-b8c9-0123-defg-h45678901234.webp",
    ],
    alt_tags: ["Hatco GRSSR-36D Hot Food Display Warmer"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "30 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  // Undercounter Dishwashers
  {
    id: 7001,
    name: "Jackson TEMPSTAR HH High Temp Undercounter Commercial Dishwasher",
    url: "jackson-tempstar-hh-high-temp-undercounter-dishwasher",
    category_url: "undercounter-dishwasher",
    parent_category_url: "warewashing",
    sku: "TEMPSTAR-HH",
    price: 6850,
    sale_price: 5480,
    original_price: 6850,
    front_sale_price: 5480,
    best_price: 5480,
    avg_rating: 4.6,
    total_reviews: 17,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TEMPSTAR-HH_e5f6a7b8-c9d0-1234-efgh-i56789012345.webp",
    ],
    alt_tags: ["Jackson TEMPSTAR HH Undercounter Dishwasher"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "30 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
  {
    id: 7002,
    name: "Jackson TEMPSTAR LT Low Temp Undercounter Commercial Dishwasher",
    url: "jackson-tempstar-lt-low-temp-undercounter-dishwasher",
    category_url: "undercounter-dishwasher",
    parent_category_url: "warewashing",
    sku: "TEMPSTAR-LT",
    price: 5600,
    sale_price: 4200,
    original_price: 5600,
    front_sale_price: 4200,
    best_price: 4200,
    avg_rating: 4.0,
    total_reviews: 8,
    currency: "$",
    in_wishlist: false,
    images: [
      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/TEMPSTAR-LT_f6a7b8c9-d0e1-2345-fghi-j67890123456.webp",
    ],
    alt_tags: ["Jackson TEMPSTAR LT Undercounter Dishwasher"],
    delivery_days: "5 to 7 Days",
    free_shipping: 0,
    return_policy: "30 Days",
    min_quantity: 1,
    is_fixed: 0,
    quote_available: null,
    selling_type: { attribute_value: "1/Each", attribute_value_unit: "Each" },
    isRequired: false,
  },
];

const ITEMS_PER_PAGE = 10;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MegaSalePage() {
  const productsRef = useRef<HTMLDivElement>(null);

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) return "Horeca Sale";
    return SALE_CATEGORIES.find((c) => c.id === activeCategoryId)?.name ?? "Horeca Sale";
  }, [activeCategoryId]);

  const filtered = useMemo(() => {
    let list = [...ALL_SALE_PRODUCTS];

    if (activeCategoryId) {
      list = list.filter((_, i) => {
        const groupSize = Math.ceil(ALL_SALE_PRODUCTS.length / SALE_CATEGORIES.length);
        const groupIndex = Math.floor(i / groupSize);
        return groupIndex === activeCategoryId - 1;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }

    if (minPrice) list = list.filter((p) => p.best_price >= Number(minPrice));
    if (maxPrice) list = list.filter((p) => p.best_price <= Number(maxPrice));

    if (sortBy === "price_asc") list.sort((a, b) => a.best_price - b.best_price);
    else if (sortBy === "price_desc") list.sort((a, b) => b.best_price - a.best_price);
    else if (sortBy === "rating_desc")
      list.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));

    return list;
  }, [activeCategoryId, searchQuery, minPrice, maxPrice, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryClick = (id: number) => {
    setActiveCategoryId((prev) => (prev === id ? null : id));
    setCurrentPage(1);
    setSearchQuery("");
    setSortBy("");
    setTempMin("");
    setTempMax("");
    setMinPrice("");
    setMaxPrice("");
    setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleApplyPrice = () => {
    setMinPrice(tempMin);
    setMaxPrice(tempMax);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("");
    setTempMin("");
    setTempMax("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || sortBy || minPrice || maxPrice;

  return (
    <>
      {/* ── Banner ─────────────────────────────────────────────────────── */}
     {false &&  <div className="w-full">
        {/* Replace src with your actual sale banner image */}
        <div className="w-full hidden md:flex h-80 bg-linear-to-r from-[#0d3d22] via-[#186737] to-[#0d3d22] items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }}
          />
          <div className="text-center text-white z-10 px-6">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 opacity-80">Limited Time</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-3">
              UP TO <span className="text-yellow-400">50% OFF</span>
            </h1>
            <p className="text-lg opacity-90 font-medium">
              Restaurant Equipment &amp; Commercial Kitchen Supplies
            </p>
            <div className="mt-5 inline-block bg-yellow-400 text-[#0d3d22] font-black px-8 py-2.5 rounded-full text-sm uppercase tracking-wider">
              Shop Now — thehorecastore.com
            </div>
          </div>
        </div>
        {/* Mobile banner */}
        <div className="md:hidden flex h-50 bg-linear-to-br from-[#0d3d22] to-[#186737] items-center justify-center text-white text-center px-4">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Limited Time Sale</p>
            <h2 className="text-4xl font-black">
              50% <span className="text-yellow-400">OFF</span>
            </h2>
            <p className="text-xs opacity-80 mt-1">Commercial Kitchen Equipment</p>
          </div>
        </div>
      </div>}

      <div>
        <Image src={BannerMegaSale} alt="Horeca Sale Banner" className="w-full h-auto object-cover" />
      </div>

      {/* ── Promo strip ────────────────────────────────────────────────── */}
      <div className="bg-[#E2E8F04D] border-b-2 border-[#E2E8F0] py-6">
        <div className="global-container">
          <p className="text-sm md:text-base text-black font-normal">
            Enjoy <b>up to 50%</b> OFF on your favourite kitchen and horeca essentials.
            Don&apos;t miss these exclusive deals — shop now and upgrade your kitchen before the offers are gone.
          </p>
        </div>
      </div>

      {/* ── Hero text ──────────────────────────────────────────────────── */}
      <div className="py-10 pb-4 bg-white">
        <div className="global-container text-center">
          <h1 className="text-base md:text-lg lg:text-2xl font-extrabold text-[#186737] mb-3 leading-tight">
            Restaurant Equipment Sale
          </h1>
          <h2 className="text-sm md:text-[18px] font-bold text-gray-900 mb-3">
            Shop Discounted Restaurant Equipment &amp; Commercial Kitchen Equipment &amp; Supplies
          </h2>
          <p className="text-sm md:text-base text-black leading-relaxed hidden md:block max-w-4xl mx-auto">
            Take advantage of exclusive deals on commercial kitchen equipment and restaurant supplies
            with the Horeca Store sale. Discover discounted pricing on cooking equipment, refrigeration
            systems, food preparation tools, and essential kitchen supplies designed for restaurants,
            cafés, hotels, and catering businesses. Whether you&apos;re starting a new venture or
            upgrading your existing setup, enjoy cost savings without compromising on quality or
            performance.
          </p>
        </div>
      </div>

      {/* ── Browse Categories ──────────────────────────────────────────── */}
      <div className="global-container py-4 pb-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl 2xl:text-2xl font-bold text-black">Browse Categories</h2>
          {activeCategoryId && (
            <button
              onClick={() => { setActiveCategoryId(null); setCurrentPage(1); }}
              className="flex items-center gap-2 text-sm font-semibold text-[#186737] hover:underline"
            >
              <ArrowLeft size={16} /> View All
            </button>
          )}
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          breakpoints={{
            0: { slidesPerView: 2 },
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="pb-2!"
        >
          {SALE_CATEGORIES.map((cat) => (
            <SwiperSlide key={cat.id} className="h-auto!">
              <div
                onClick={() => handleCategoryClick(cat.id)}
                className={`cursor-pointer bg-[#F5F5F5] flex flex-col items-center justify-center rounded-md p-3 border transition-all hover:border-[#186737] h-55 md:h-65 ${
                  activeCategoryId === cat.id
                    ? "border-2 border-[#186737] bg-[#f0faf4]"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-35 h-35 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://d1p9kdrbe10xzz.cloudfront.net/production/products/BMPM080_7JiqdDIooIC58z6kKhvJ.webp";
                  }}
                />
                <h3 className="mt-3 text-sm font-semibold text-[#186737] text-center leading-snug">
                  {cat.name}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── Products Section ───────────────────────────────────────────── */}
      <div className="global-container py-8" ref={productsRef}>
        {/* Back button */}
        {activeCategoryId && (
          <div className="mb-4">
            <button
              onClick={() => { setActiveCategoryId(null); setCurrentPage(1); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#186737] text-white rounded-lg hover:bg-[#145a2d] transition-colors text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              Back to Horeca Sale
            </button>
          </div>
        )}

        {/* Section heading */}
        <div className="flex items-center justify-between my-4">
          <h3 className="text-xl 2xl:text-2xl font-bold text-black">
            Explore All Products Under{" "}
            <span className="text-[#186737]">{activeCategoryName}</span>
          </h3>
          <span className="text-sm text-gray-500 hidden sm:block">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Filters row */}
        <div className="my-5">
          <div className="flex flex-col xl:flex-row gap-3 items-start xl:items-center">
            {/* Search */}
            <div className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search products..."
                className="border border-gray-300 pl-4 pr-10 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#186737] focus:border-transparent text-sm"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Price range */}
            <div className="flex gap-2 items-center shrink-0">
              <input
                type="number"
                value={tempMin}
                onChange={(e) => setTempMin(e.target.value)}
                placeholder="From $"
                className="border border-gray-300 px-3 py-2.5 rounded-lg w-25 text-sm focus:outline-none focus:ring-2 focus:ring-[#186737] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onWheel={(e) => e.currentTarget.blur()}
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                value={tempMax}
                onChange={(e) => setTempMax(e.target.value)}
                placeholder="To $"
                className="border border-gray-300 px-3 py-2.5 rounded-lg w-25 text-sm focus:outline-none focus:ring-2 focus:ring-[#186737] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onWheel={(e) => e.currentTarget.blur()}
              />
              <button
                onClick={handleApplyPrice}
                className="px-4 py-2.5 bg-[#186737] text-white rounded-lg hover:bg-[#145a2d] transition-colors flex items-center gap-1 text-sm font-semibold shrink-0"
              >
                <Search size={16} />
              </button>
            </div>

            {/* Sort */}
            <div className="w-full xl:w-auto shrink-0">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="border border-gray-300 px-3 py-2.5 rounded-lg w-full xl:w-40 focus:outline-none focus:ring-2 focus:ring-[#186737] focus:border-transparent text-sm"
              >
                <option value="">Sort By</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating_desc">Top Rating</option>
              </select>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1.5 text-sm font-semibold shrink-0 whitespace-nowrap"
              >
                <X size={16} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Products grid */}
        {paginated.length > 0 ? (
          <div className={generateDynamicCSSProductCard}>
            {paginated.map((product) => (
              <ProductCard
                key={product.id + product.sku}
                product={product}
                onWishlistToggle={(p, w) => console.log("Wishlist:", p.name, w)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-semibold text-gray-500">No products found.</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query.</p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-4 px-5 py-2 bg-[#186737] text-white rounded-lg text-sm font-semibold hover:bg-[#145a2d] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              totalPages={totalPages}
              initialPage={currentPage}
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
