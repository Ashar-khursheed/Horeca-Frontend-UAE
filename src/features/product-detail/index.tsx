"use client";

import Breadcrumb from "@/components/breadcum";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

import AlternateAiProducts from "./alternate-ai-products";
import { OverviewSection } from "./overview-section";
import { ProductGallery } from "./product-gallery";
import { ProductInfo } from "./product-info";
import { PurchasePanel } from "./purchase-panel";
import { QASection } from "./qa-section";
import { ReviewsSection } from "./reviews-section";
import { SpecificationsSection } from "./specifications-section";
import type { VariantItem } from "./types";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PRODUCT = {
  name: 'Medal Equipment 27" Reach-In Refrigerator, 1 Door, 23 cu. ft., Stainless Steel, Commercial, 2 Year Warranty',
  model: "RFBM127",
  sku: "RFBM127",
  sale_price: 1295,
  original_price: 1529,
  currency: "$",
  unit: "Each",
  avg_rating: 4.5,
  total_reviews: 19,
  in_stock: true,
  delivery_days: "5 to 7 Days",
  ship_to: "Houston, Texas",
  free_shipping: true,
  return_policy: "90 Days",
  brand: "Medal Equipment",
  brand_logo:
    "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/Y5HQG9GznBFYneeKgm1Ub3zgtpGHBPIqRGCNItPf.webp",
  brand_url: "medal-equipment-authorised-dealer",
  phone: "(888) 480-7722",
  images: [
    "https://d1p9kdrbe10xzz.cloudfront.net/production/products/jNOl08wEvHaZXVAxMGMC2DlV3cOtng1wPy4RbXgF.webp",
    "https://d1p9kdrbe10xzz.cloudfront.net/production/products/m31OGvCZpK6cb2ir36O53rEmAIpZJDFHI5T5a3j3.webp",
    "https://d1p9kdrbe10xzz.cloudfront.net/production/products/2PVVLTvZ0a84B4gMbHXCxEvSHgb1Kvpe3ayRe27a.webp",
    "https://d1p9kdrbe10xzz.cloudfront.net/production/products/soAbqr3YuewI5zrkrKXWVgeZN5gaL631uNkefMc4.webp",
    "https://d1p9kdrbe10xzz.cloudfront.net/production/products/k49XDTZSyc2cSabCoOxG2yohcB00EGxC267fS0Xj.webp",
    "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MdaXVF5lIZmpwJ1bYcrp39qM0glVwBt7a5RqKowh.webp",
    "https://d1p9kdrbe10xzz.cloudfront.net/production/products/rONKFHkusKtD3dGKItl6XPE6EHcEbXXr7S24Av8r.webp",
    "https://d1p9kdrbe10xzz.cloudfront.net/production/products/jShSQWcgSXlWVgZGE1woogaw2x2X14XJio5BveuG.webp",
  ],
  benefits_features: [
    {
      benefit: "Ample Cold Storage",
      feature:
        "23 cu. ft. capacity with four PE-coated wire shelves accommodates a wide range of food items with flexible organization.",
    },
    {
      benefit: "Maintains Consistent Temperature",
      feature:
        "1/5 HP bottom-mounted compressor with forced air circulation and ECM fans maintains uniform cooling between 33°F and 41°F.",
    },
    {
      benefit: "Eco-Friendly Refrigeration",
      feature:
        "R-290 hydrocarbon refrigerant with copper evaporator and condenser coating delivers energy-efficient, environmentally responsible performance.",
    },
    {
      benefit: "Reliable Cooling Power",
      feature:
        "1670 BTU/hr capacity with 3.0 oz refrigerant ensures quick temperature recovery during frequent door openings.",
    },
    {
      benefit: "Durable Construction",
      feature:
        "Stainless steel interior and exterior with silver finish resists corrosion, dents, and scratches, while allowing easy cleaning.",
    },
    {
      benefit: "Secure Storage",
      feature:
        "Solid right-hinged swing door with keyed lock protects valuable inventory and includes vacuum release for smooth opening.",
    },
  ],
  productVariants: [
    // ── Type ──
    {
      product_id: 46600,
      sku: "RFBM127",
      attribute_value: "Reach-In Refrigerator",
      label: "Type",
      selected: true,
      price: 1529,
      sale_price: 1295,
      images: [
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/jNOl08wEvHaZXVAxMGMC2DlV3cOtng1wPy4RbXgF.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/m31OGvCZpK6cb2ir36O53rEmAIpZJDFHI5T5a3j3.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/2PVVLTvZ0a84B4gMbHXCxEvSHgb1Kvpe3ayRe27a.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/soAbqr3YuewI5zrkrKXWVgeZN5gaL631uNkefMc4.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/k49XDTZSyc2cSabCoOxG2yohcB00EGxC267fS0Xj.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MdaXVF5lIZmpwJ1bYcrp39qM0glVwBt7a5RqKowh.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/rONKFHkusKtD3dGKItl6XPE6EHcEbXXr7S24Av8r.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/jShSQWcgSXlWVgZGE1woogaw2x2X14XJio5BveuG.webp",
      ],
    },
    {
      product_id: 46608,
      sku: "FZBM271",
      attribute_value: "Reach-in Freezer",
      label: "Type",
      selected: false,
      price: 1679,
      sale_price: 1480,
      images: [
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/o9nTsUgY2BpbGMF0txGOvot3EtY5y0yG7AODROwS.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/FCwQCFIe4FMU0cr5mlJDVdI48o8Z9Ilhc19NlrIi.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/asTzT8D61x3TcH7NcNv85WE4jqk3ve1Jjy4bZQ3L.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/mNhnOJqqJfhYRGYXckC8fJnNdvE2gnPbkEsRGOt7.webp",
      ],
    },
    // ── Number of Doors ──
    {
      product_id: 46600,
      sku: "RFBM127",
      attribute_value: "1 Door",
      label: "Number of Doors",
      selected: true,
      price: 1529,
      sale_price: 1295,
      images: [
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/jNOl08wEvHaZXVAxMGMC2DlV3cOtng1wPy4RbXgF.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/m31OGvCZpK6cb2ir36O53rEmAIpZJDFHI5T5a3j3.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/2PVVLTvZ0a84B4gMbHXCxEvSHgb1Kvpe3ayRe27a.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/soAbqr3YuewI5zrkrKXWVgeZN5gaL631uNkefMc4.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/k49XDTZSyc2cSabCoOxG2yohcB00EGxC267fS0Xj.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MdaXVF5lIZmpwJ1bYcrp39qM0glVwBt7a5RqKowh.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/rONKFHkusKtD3dGKItl6XPE6EHcEbXXr7S24Av8r.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/jShSQWcgSXlWVgZGE1woogaw2x2X14XJio5BveuG.webp",
      ],
    },
    {
      product_id: 46601,
      sku: "RFBM254",
      attribute_value: "2 Doors",
      label: "Number of Doors",
      selected: false,
      price: 1950,
      sale_price: 1825,
      images: [
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/glehYJAGysEmqLp6OCAsbfPxUVqmvBXO7WnkJjia.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/6TZHtLsNYSX6osBB1n9By18vVrNimbJBIChW8oJK.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/yRgkJ6SIan8RfUX5U6ZyCY0FNtCQdmPnncqbEowz.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/qifKJiSCnbQ1bkGQX1tzEF1Dx54Uy03nKZcI49Jv.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/RExteas6GURXEfOKOyw4YfeYX3BOVLjSk1inupEW.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/fiX6B5W52C0wUYFowt9A0TkBBHHibDJKC8jc0afJ.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/gwE0CZ9Pk2NRWNT0YSUAdZYJHN0KGq5cNRrfg9VA.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/guHZZ5VNyAlExdhk4HO6iSlMrIgca1qrZYdogftB.webp",
      ],
    },
    {
      product_id: 46602,
      sku: "RFBM381",
      attribute_value: "3 Doors",
      label: "Number of Doors",
      selected: false,
      price: 3149,
      sale_price: 2995,
      images: [
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/M9vOKWkFX5hfEIapyTpYW700ZvjGpo9GTJHEJubc.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/NSeZcuoH4EHpJkWPN8gwMVAXMIJkXfc25Bo9UQkv.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/LdHS4xCCHqC8ZBkvkQKXlHPbmfeivdEgAagbrqKl.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/vmPr9C1UAxclIRqylDzzYDqzO3EHjRzE7vqFS351.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/Yyxl8KRwW9yR4ePQPtwTflUCfb38s35YbLEugfCi.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/J8r39Zxs7RZAxuRnjZGFvvtzRgRmGzSKiNM6JRpy.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/E22h9029DhhPBsiQU8Zm321IzMg0pXYO0ydjeovC.webp",
        "https://d1p9kdrbe10xzz.cloudfront.net/production/products/UZhzsWq7xrkrvnksWqOeXDat2UL1EPI64oRf42El.webp",
      ],
    },
    // ── Size (in) ──
    {
      product_id: 46600,
      sku: "RFBM127",
      attribute_value: "27",
      label: "Size (in)",
      selected: true,
      price: 1529,
      sale_price: 1295,
      images: [],
    },
    {
      product_id: 46601,
      sku: "RFBM254",
      attribute_value: "54",
      label: "Size (in)",
      selected: false,
      price: 1950,
      sale_price: 1825,
      images: [],
    },
    {
      product_id: 46602,
      sku: "RFBM381",
      attribute_value: "81",
      label: "Size (in)",
      selected: false,
      price: 3149,
      sale_price: 2995,
      images: [],
    },
  ] as VariantItem[],
  accessories: [
    {
      id: 1144,
      name: "Protect Your Product",
      isRequired: 0,
      items: [
        { id: 5011, name: "3 Year Extended Warranty", price: 101 },
        { id: 5012, name: "4 Year Extended Warranty", price: 212 },
        { id: 5013, name: "5 Year Extended Warranty", price: 290 },
      ],
    },
  ],
  specifications: {
    left: [
      { attribute_name: "Manufacturer", attribute_value: "Medal Equipment" },
      { attribute_name: "Country of Origin", attribute_value: "China" },
      { attribute_name: "Material", attribute_value: "Stainless Steel" },
      { attribute_name: "Color", attribute_value: "Silver" },
      { attribute_name: "Capacity", attribute_value: "23 cb³" },
      { attribute_name: "Amps", attribute_value: "3 A" },
      {
        attribute_name: "Compressor Location",
        attribute_value: "Bottom Mounted",
      },
      {
        attribute_name: "Dutch Half Doors",
        attribute_value: "Without Dutch Half Doors",
      },
      { attribute_name: "Phase", attribute_value: "1 Phase" },
      { attribute_name: "Power Cord Length", attribute_value: "9 ft" },
      { attribute_name: "Sections", attribute_value: "1 Section" },
      { attribute_name: "Temperature Range", attribute_value: "33°F to 41°F" },
      { attribute_name: "Hertz", attribute_value: "60 Hz" },
      { attribute_name: "Horsepower", attribute_value: "1/5 HP" },
      {
        attribute_name: "Door Gasket",
        attribute_value: "Magnetic Door Gasket",
      },
      { attribute_name: "Number of Casters", attribute_value: "4 Casters" },
      { attribute_name: "Caster Type", attribute_value: "Swivel with brake" },
      {
        attribute_name: "Temperature Control",
        attribute_value: "Dixell Electronic Thermostat",
      },
      {
        attribute_name: "Insulation Material",
        attribute_value: "Foamed-in-Place Polyurethane",
      },
      { attribute_name: "Height with Casters", attribute_value: "82.3 in" },
      { attribute_name: "Product Weight", attribute_value: "276 lb" },
      { attribute_name: "Product Depth", attribute_value: "33 in" },
      { attribute_name: "Shipping Depth", attribute_value: "34.5 in" },
      { attribute_name: "Shipping Weight", attribute_value: "313 lb" },
      { attribute_name: "Refrigerant Capacity", attribute_value: "3.0 oz" },
      { attribute_name: "Evaporator", attribute_value: "Copper" },
      { attribute_name: "Cooling Fans", attribute_value: "ECM Fan" },
      {
        attribute_name: "Temperature Display",
        attribute_value: "Digital LED Display",
      },
      {
        attribute_name: "Air Pressure Relief Door",
        attribute_value: "Vacuum Release",
      },
      { attribute_name: "Interior Height", attribute_value: "59.4 in" },
    ],
    right: [
      { attribute_name: "Selling Unit", attribute_value: "1/Each" },
      { attribute_name: "Type", attribute_value: "Reach-In Refrigerator" },
      { attribute_name: "Warranty", attribute_value: "2 Year Warranty" },
      { attribute_name: "Number of Doors", attribute_value: "1 Door" },
      { attribute_name: "Access Type", attribute_value: "Door" },
      { attribute_name: "Casters", attribute_value: "With Casters" },
      { attribute_name: "Door Type", attribute_value: "Solid" },
      { attribute_name: "Number of Shelves", attribute_value: "4 Shelves" },
      { attribute_name: "Plug Type", attribute_value: "NEMA 5-15P" },
      { attribute_name: "Refrigerant Type", attribute_value: "R-290" },
      {
        attribute_name: "Shelf Material",
        attribute_value: "PE Coated Wire Shelves",
      },
      { attribute_name: "Voltage", attribute_value: "115 V" },
      { attribute_name: "Hinge Location", attribute_value: "Right" },
      { attribute_name: "Installation Type", attribute_value: "Freestanding" },
      { attribute_name: "Lock Type", attribute_value: "Keyed Door Lock" },
      { attribute_name: "Refrigeration Type", attribute_value: "Forced Air" },
      {
        attribute_name: "Interior Material",
        attribute_value: "Stainless Steel",
      },
      { attribute_name: "Refrigerant Class", attribute_value: "Hydrocarbon" },
      { attribute_name: "Caster Size", attribute_value: "4 in" },
      { attribute_name: "Shelf Size", attribute_value: "21.5 x 24.3 in" },
      { attribute_name: "Product Width", attribute_value: "27 in" },
      { attribute_name: "Product Height", attribute_value: "82 in" },
      { attribute_name: "Shipping Height", attribute_value: "84.7 in" },
      { attribute_name: "Shipping Width", attribute_value: "29.9 in" },
      { attribute_name: "Condenser Coating", attribute_value: "Copper" },
      {
        attribute_name: "Lighting",
        attribute_value: "LED, Shielded, Rocker Switch Control",
      },
      { attribute_name: "Defrost Type", attribute_value: "Auto Defrost" },
      { attribute_name: "BTU/HR - Refrigerator", attribute_value: "1670" },
      { attribute_name: "Interior Depth", attribute_value: "27.5 in" },
      { attribute_name: "Interior Width", attribute_value: "22 in" },
    ],
  },
};

const REVIEWS = [
  {
    id: 1,
    author: "Arshad Khan",
    verified: true,
    date: "Apr 10, 2026",
    rating: 5,
    title: "Excellent refrigerator for commercial use!",
    body: "We installed this unit in our restaurant kitchen 3 months ago and it has been performing flawlessly. The temperature stays consistent, the LED lighting makes it easy to find items quickly, and the stainless steel looks great and cleans easily. Delivery was fast and the unit arrived well-packaged.",
    helpful: 12,
  },
  {
    id: 2,
    author: "Maria Santos",
    verified: true,
    date: "Mar 22, 2026",
    rating: 5,
    title: "Perfect for our catering business",
    body: "This reach-in refrigerator exceeded our expectations. The 23 cu. ft. capacity is ample for our daily prep needs. The bottom-mounted compressor is quiet, which is a plus in our open kitchen. The vacuum release door makes opening smooth even when the unit is very cold inside.",
    helpful: 8,
  },
  {
    id: 3,
    author: "James Okafor",
    verified: true,
    date: "Feb 14, 2026",
    rating: 4,
    title: "Great unit, minor setup note",
    body: "Solid build quality and excellent cooling performance. Took a bit of time to calibrate the Dixell thermostat to the right temperature but once set, it holds steady. The casters make it easy to move for cleaning. Would recommend for any commercial kitchen.",
    helpful: 5,
  },
  {
    id: 4,
    author: "Tttt",
    verified: true,
    date: "Feb 14, 2026",
    rating: 4,
    title: "Great unit, minor setup note",
    body: "Solid build quality and excellent cooling performance. Took a bit of time to calibrate the Dixell thermostat to the right temperature but once set, it holds steady. The casters make it easy to move for cleaning. Would recommend for any commercial kitchen.",
    helpful: 5,
  },
];

const RATING_DIST = [
  { stars: 5, count: 15 },
  { stars: 4, count: 3 },
  { stars: 3, count: 1 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

const QA_ITEMS = [
  {
    id: 1,
    question: "What is the storage capacity of this reach-in refrigerator?",
    answer:
      "This unit offers 23 cubic feet of storage capacity with four PE-coated wire shelves for flexible organization.",
  },
  {
    id: 2,
    question: "What temperature range does this refrigerator maintain?",
    answer:
      "The refrigerator maintains a consistent temperature range of 33°F to 41°F, ideal for commercial food storage.",
  },
  {
    id: 3,
    question: "What type of refrigerant does this unit use?",
    answer:
      "This unit uses R-290 hydrocarbon refrigerant, which is eco-friendly and energy-efficient.",
  },
  {
    id: 4,
    question: "Does it have interior lighting?",
    answer:
      "Yes, it features LED shielded lighting with a rocker switch control for easy visibility inside the unit.",
  },
  {
    id: 5,
    question: "What certifications does this reach-in refrigerator have?",
    answer:
      "This refrigerator is certified by NSF, UL, UL Sanitation, and Energy Star, meeting strict food safety and energy performance standards.",
  },
  {
    id: 6,
    question: "What is the warranty on this product?",
    answer:
      "It comes with a 2-year manufacturer warranty covering parts and labor for commercial use.",
  },
];

const PRODUCT_OVERVIEW = `The Medal Equipment 6MIFG-1 Reach-In Refrigerator is a durable and efficient commercial refrigerator designed for restaurants, hotels, and catering businesses. Constructed with a stainless steel interior and exterior with a silver finish, it offers long-lasting durability and easy cleaning. With a 23 cu. ft. capacity, this single-door unit includes four PE-coated wire shelves (21.5" x 24.3") that provide flexible storage for various food items.

It includes a solid right-hinged swing door with a vacuum release for smooth opening and a keyed door lock for product security. Powered by a 1/5 HP bottom-mounted compressor, the unit delivers consistent cooling through forced air circulation with ECM fans, maintaining temperatures between 33°F and 41°F. The R-290 hydrocarbon refrigerant, paired with a copper evaporator and copper condenser coating, ensures energy-efficient and eco-friendly performance.

It has a 1670 BTU/hr capacity, provides 16.0 W/lbs of cooling power, and uses auto defrost for minimal maintenance. A Dixell electronic thermostat with a digital LED display enables precise temperature control, while shielded LED lighting with a rocker switch ensures clear visibility inside. Measuring 27W" x 33D" x 82H" (with casters), this freestanding unit is mounted on four 4-inch swivel casters (two with brakes) for mobility and stability.

The foamed-in-place insulation and magnetic door gasket enhance temperature retention. A 9-ft power cord with a NEMA 5-15P plug allows flexible placement in busy kitchens. Certified by NSF, UL, UL Sanitation, and Energy Star, it meets strict food safety and energy performance standards. Operating at 115V, 60Hz, 1-phase, and drawing 3 amps, it is backed by a 2-year manufacturer warranty.`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function groupVariants(variants: VariantItem[]): Map<string, VariantItem[]> {
  const map = new Map<string, VariantItem[]>();
  for (const v of variants) {
    if (!map.has(v.label)) map.set(v.label, []);
    map.get(v.label)!.push(v);
  }
  return map;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ProductDetailPage = () => {
  const product = PRODUCT;
  const variantGroups = groupVariants(product.productVariants);

  const initSelected = () => {
    const result: Record<string, VariantItem> = {};
    variantGroups.forEach((items, label) => {
      result[label] = items.find((v) => v.selected) ?? items[0];
    });
    return result;
  };

  const [selectedVariants, setSelectedVariants] =
    useState<Record<string, VariantItem>>(initSelected);

  const selectVariant = (label: string, variant: VariantItem) => {
    setSelectedVariants((prev) => {
      const next = { ...prev, [label]: variant };
      if (label === "Number of Doors") {
        const linked = variantGroups
          .get("Size (in)")
          ?.find((v) => v.product_id === variant.product_id);
        if (linked) next["Size (in)"] = linked;
      } else if (label === "Size (in)") {
        const linked = variantGroups
          .get("Number of Doors")
          ?.find((v) => v.product_id === variant.product_id);
        if (linked) next["Number of Doors"] = linked;
      }
      return next;
    });
  };

  const activeVariant =
    selectedVariants["Number of Doors"] ??
    selectedVariants[Object.keys(selectedVariants)[0]];
  const activeImages = activeVariant?.images?.length
    ? activeVariant.images
    : product.images;
  const activePrice = activeVariant?.sale_price ?? product.sale_price;
  const activeOriginal = activeVariant
    ? activeVariant.price
    : product.original_price;

  return (
    <div>
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb />

        <div className="global-container mx-auto px-4 sm:px-6 py-6">
          {/* <div className="global-container mx-auto px-4 sm:px-6 py-6"> */}
          {/* ─── 3-Column Hero ──────────────────────────────────────── */}

          <div className="grid grid-cols-1  xl:hidden">
            <div className="relative lg:sticky lg:top-4 ">
              <ProductGallery
                images={activeImages}
                productName={product.name}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[36%_38%_26%] gap-4 items-start md:mt-11 mt-11 xl:mt-0">
            {/* <div className="grid grid-cols-1 2xl:grid-cols-[36%_38%_26%] xl:grid-cols-3 gap-6 items-start"> */}
            {/* Left: Image Gallery */}
            {/* <div className="relative lg:sticky lg:top-4">
              <ProductGallery
                images={activeImages}
                productName={product.name}
              />
            </div> */}
            <div className="relative lg:sticky lg:top-4 hidden xl:block">
              <ProductGallery
                images={activeImages}
                productName={product.name}
              />
            </div>
            {/* Middle: Product Info */}
            <ProductInfo
              name={product.name}
              model={product.model}
              avgRating={product.avg_rating}
              totalReviews={product.total_reviews}
              benefitsFeatures={product.benefits_features}
              variantGroups={variantGroups}
              selectedVariants={selectedVariants}
              onSelectVariant={selectVariant}
            />

            {/* Right: Purchase Panel */}
            <PurchasePanel
              activePrice={activePrice}
              activeOriginal={activeOriginal}
              unit={product.unit}
              currency={product.currency}
              freeShipping={product.free_shipping}
              deliveryDays={product.delivery_days}
              shipTo={product.ship_to}
              returnPolicy={product.return_policy}
              accessories={product.accessories}
              phone={product.phone}
              brand={product.brand}
              brandLogo={product.brand_logo}
              brandUrl={product.brand_url}
            />
          </div>
          <AlternateAiProducts />
          {/* ─── Key Specifications ──────────────────────────────────── */}
          <div className="mt-8 bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-300">
              <h2 className="heading-font-size font-bold text-gray-900">
                Key Specification
              </h2>
            </div>
            <div className="p-6">
              <SpecificationsSection specifications={product.specifications} />
            </div>
          </div>

          {/* ─── Product Overview ────────────────────────────────────── */}
          <div className="mt-8 bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-300">
              <h2 className="heading-font-size font-bold text-gray-900">
                Product Overview
              </h2>
            </div>
            <div className="px-6 py-5">
              <OverviewSection overview={PRODUCT_OVERVIEW} />
            </div>
          </div>

          {/* ─── Customer Ratings & Reviews ──────────────────────────── */}
          <div className="mt-8 bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-300 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h2 className="heading-font-size font-bold text-gray-900">
                  Customer Ratings &amp; Reviews
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real reviews from hotels, restaurants, and chefs who&apos;ve
                  used this product.
                </p>
              </div>
              <button className="bg-[#186737] px-4 hover:bg-[#145c30] text-white text-sm font-bold py-2.5 rounded-[7px] transition-colors flex items-center justify-center gap-2">
                <MessageCircle size={15} strokeWidth={2} />
                Leave a Review
              </button>
            </div>
            <div className="p-6">
              <ReviewsSection
                avgRating={product.avg_rating}
                reviews={REVIEWS}
                ratingDist={RATING_DIST}
              />
            </div>
          </div>

          {/* ─── Questions from Buyers ───────────────────────────────── */}
          <div className="mt-8 mb-8 bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-300">
              <h2 className="heading-font-size font-bold text-gray-900">
                Questions from buyers like you
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Answered to help you make right decisions
              </p>
            </div>
            <div className="p-6">
              <QASection items={QA_ITEMS} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
