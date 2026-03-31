"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PopularTagDetail {
  popularTags: string;
  popularSlug: string;
}

interface SeoData {
  id: number;
  relational_id: number;
  relational_type: string;
  internal_links: string;
  cat_desc: string;
  paragraph_1: string;
  paragraph_2: string;
  paragraph_3: string;
  paragraph_4: string;
  banner_slug: string;
  banner_image_file: string;
  banner_image_alt_text: string;
  popular_tags: string[];
  popularTag_details: PopularTagDetail[];
}

interface ParagraphProps {
  title?: string;
  content: string;
}

interface SeoContentProps {
  id?: number;
  relationalType?: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_DATA: SeoData = {
  id: 180,
  relational_id: 1,
  relational_type: "Category",
  internal_links: "null",
  cat_desc: "Heavy-duty restaurant equipment for daily commercial use",
  paragraph_1: `<h2><strong>Commercial Restaurant Equipment Supplier for Hotel, Restaurants &amp; Cafe</strong></h2>
    <p>Looking for trusted restaurant equipment that delivers real value? Get top-grade commercial kitchen equipment at low prices without cutting corners on quality. HorecaStore brings you reliable cooking ranges, commercial fryers, prep stations, and more — all built to handle daily demand. Shop smart with regular sales and special bundle deals that help you save more on every order. Fast shipping ensures your kitchen stays ready with no costly delays. Every product is selected for durability and performance to keep service running smoothly. Buy with confidence and upgrade your kitchen with tools that match your standards. HorecaStore is your source for affordable equipment that works as hard as you do.</p>`,
  paragraph_2: `<h2><strong>Types of Restaurant Equipment &amp; Their Uses</strong></h2>
    <p>The right restaurant equipment helps you run a busy kitchen efficiently and cost-effectively. From prep tables and cooking ranges to chillers and storage, each piece supports smooth daily service.</p>
    <h3><strong>Commercial Cooking Equipment</strong></h3>
    <ul>
      <li><strong>Convection ovens</strong> with digital controls and energy-efficient designs for consistent baking and roasting</li>
      <li><strong>Commercial ranges</strong> featuring heavy-duty burners and griddle combinations for high-volume cooking</li>
      <li><strong>Deep fryers</strong> with precise temperature control and oil filtration systems for perfect results</li>
      <li><strong>Grills and char broilers</strong> including gas, electric, and charcoal options for diverse menu requirements</li>
    </ul>
    <h3><strong>Food Preparation Equipment</strong></h3>
    <ul>
      <li><strong>Commercial slicers</strong> with adjustable thickness settings and food-grade stainless steel construction</li>
      <li><strong>High-performance blenders</strong> designed for smoothie bars, protein shakes, and sauce preparation</li>
      <li><strong>Food processors</strong> with multiple attachment options for chopping, grinding, and mixing operations</li>
    </ul>`,
  paragraph_3: `<h3><strong>Why Choose HorecaStore for Restaurant Equipment</strong></h3>
    <p>Choose HorecaStore for trusted restaurant equipment that balances quality and price without compromise. Every item is carefully selected to handle daily demands and help you get the most value from your investment.</p>
    <p><strong>Competitive Wholesale Pricing</strong> - We offer <strong>up to 40% savings</strong> compared to traditional restaurant equipment suppliers through direct manufacturer relationships and bulk purchasing power.</p>
    <p><strong>Rapid Delivery:</strong> Fast delivery of restaurant equipment to major cities. Get your essential kitchen gear quickly and safely — no delays, no hassle.</p>
    <p><strong>Industry Certification &amp; Compliance</strong> - All equipment meets <strong>NSF, UL, and Energy Star certifications</strong> with comprehensive warranty coverage, ensuring food safety compliance.</p>`,
  paragraph_4: `<h2><strong>Frequently Asked Questions</strong></h2>
    <p><strong>Q. What are the must-have restaurant equipment for a new pizzeria</strong><br/>
    <strong>Answer:</strong> A new pizzeria needs essential tools like aluminium trays, wide-rim pans, pizza screens, pizza cutters, dough dockers, and pizza stands to handle daily prep and baking.</p>
    <p><strong>Q. How to find restaurant equipment distributors with fast shipping</strong><br/>
    <strong>Answer:</strong> You can find restaurant equipment distributors with fast shipping by choosing suppliers that show in-stock items and list 1–2 day delivery options.</p>
    <p><strong>Q. What brands offer durable commercial fryers for restaurants</strong><br/>
    <strong>Answer:</strong> Durable commercial fryers are offered by trusted brands such as Angelo Po, Anvil, Beckers, Electrolux, Empero, Hamilton Beach, Pitco, Rational, Vulcan, and more.</p>`,
  banner_slug:
    "https://www.thehorecastore.com/restaurant-equipment/commercial-cooking-equipment",
  banner_image_file:
    "https://d1p9kdrbe10xzz.cloudfront.net/production/seo-banners/KZXv2O8oqfEBLOOa5ohCfT4snWWjrUZJ7lX0kOEm.webp",
  banner_image_alt_text:
    "Commercial-grade kitchen gear including rice cooker, cookware, utensils, knife set, grater, and tools for reliable food prep and service.",
  popular_tags: [
    "restaurants equipment suppliers",
    "commercial restaurant equipment",
    "restaurant equipment supply",
    "commercial kitchen equipment",
    "hospitality supplies",
    "catering equipment",
    "kitchen equipment deals",
    "restaurant cooking equipment",
    "Electric Range",
    "Grills Griddles",
    "Commercial Fryer",
    "Food Processor",
    "Espresso Machine",
    "Pizza Oven",
    "Convection Oven",
  ],
  popularTag_details: [
    {
      popularTags: "Restaurant Equipment",
      popularSlug: "restaurant-equipment",
    },
    {
      popularTags: "Commercial Cooking Equipment",
      popularSlug: "restaurant-equipment/commercial-cooking-equipment",
    },
    {
      popularTags: "Food Prep Equipment",
      popularSlug: "restaurant-equipment/food-prep-equipment",
    },
    {
      popularTags: "Commercial Coffee Machine",
      popularSlug: "restaurant-equipment/commercial-coffee-machine",
    },
    {
      popularTags: "Commercial Oven",
      popularSlug: "restaurant-equipment/commercial-oven",
    },
    {
      popularTags: "Beverage Equipment",
      popularSlug: "restaurant-equipment/beverage-equipment",
    },
    {
      popularTags: "Commercial Dishwasher",
      popularSlug: "restaurant-equipment/commercial-dishwasher",
    },
    {
      popularTags: "Commercial Shelving",
      popularSlug: "restaurant-equipment/commercial-shelving",
    },
  ],
};

// ─── Popular Searches Component ───────────────────────────────────────────────

function PopularSearches({ keywords }: { keywords: PopularTagDetail[] }) {
  const filtered = keywords.filter((k) => k?.popularTags?.trim() !== "");
  if (!filtered.length) return null;

  return (
    <div className="bg-gray-50 border-t border-gray-100 py-6 mt-6">
      <div className="global-container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Popular Searches
        </p>
        <div className="flex flex-wrap gap-2">
          {filtered.map((item, index) => (
            <Link
              key={index}
              href={`/${item.popularSlug}`}
              className="inline-block text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:border-[#186737] hover:text-[#186737] hover:bg-green-50 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              {item.popularTags}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Paragraph Component ──────────────────────────────────────────────────────

const Paragraph = memo(({ title, content }: ParagraphProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setShowButton(scrollHeight > clientHeight + 10);
    }
  }, [content]);

  return (
    <div className="mb-5">
      {title && (
        <p className="text-[22px] leading-[28px] font-semibold text-gray-800 mb-2">
          {title}
        </p>
      )}

      <div
        ref={contentRef}
        className={`text-[14px] leading-[24px] text-gray-500 font-normal text-left transition-all duration-300 ease-in-out seo-content ${
          isExpanded ? "" : "line-clamp-4"
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {showButton && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 text-[13px] font-semibold text-[#186737] hover:text-[#1e5230] underline underline-offset-2 transition-colors duration-200"
        >
          {isExpanded ? "Read Less ↑" : "Read More ↓"}
        </button>
      )}
    </div>
  );
});

Paragraph.displayName = "Paragraph";

// ─── Main SeoContent Component ────────────────────────────────────────────────

export default function SeoContent({ id, relationalType }: SeoContentProps) {
  // In real usage: fetch from API using id & relationalType
  // Here we use DUMMY_DATA directly
  const data = DUMMY_DATA;

  if (!data || data.banner_image_file === "null") return null;

  const hasPopularTags =
    Array.isArray(data.popularTag_details) &&
    data.popularTag_details.some((item) => item?.popularTags?.trim() !== "");

  return (
    <>
      <style>{`
        .seo-content h2 { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; margin-top: 12px; }
        .seo-content h3 { font-size: 15px; font-weight: 600; color: #1f2937; margin-bottom: 6px; margin-top: 10px; }
        .seo-content ul { list-style: disc; padding-left: 20px; margin-bottom: 8px; }
        .seo-content li { margin-bottom: 4px; }
        .seo-content p { margin-bottom: 8px; }
        .seo-content a { color: #186737; text-decoration: underline; }
        .seo-content strong { color: #374151; }
      `}</style>

      <section className="global-container px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="mt-8">
          <Link
            href={data.banner_slug || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={data.banner_image_file}
              alt={data.banner_image_alt_text}
              className="w-full rounded-lg object-cover"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Paragraphs */}
        <div className="mt-8 grid grid-cols-1 gap-2">
          {data.paragraph_1 && <Paragraph content={data.paragraph_1} />}
          {data.paragraph_2 && <Paragraph content={data.paragraph_2} />}
          {data.paragraph_3 && <Paragraph content={data.paragraph_3} />}
          {data.paragraph_4 && <Paragraph content={data.paragraph_4} />}
        </div>
      </section>

      {/* Popular Searches */}
      {hasPopularTags && (
        <PopularSearches keywords={data.popularTag_details} />
      )}
    </>
  );
}