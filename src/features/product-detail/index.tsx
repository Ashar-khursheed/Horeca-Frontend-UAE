"use client";

import Breadcrumb from "@/components/breadcum";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useState } from "react";

import AlternateAiProducts from "./alternate-ai-products";
import { OverviewSection } from "./overview-section";
import { ProductGallery } from "./product-gallery";
import { ProductInfo } from "./product-info";
import { PurchasePanel } from "./purchase-panel";
import { QASection } from "./qa-section";
import { ReviewsSection } from "./reviews-section";
import { SpecificationsSection } from "./specifications-section";
import type { ProductDetailResponse, VariantItem } from "./types";
import { useLocationData } from "@/utils/locationStorage";

interface Props {
  productData: ProductDetailResponse;
  locale: string;
  categorySlug: string;
  subCategorySlug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  similarProductsGuest?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alternateProducts?: any[];
}

const slugToLabel = (slug: string) =>
  slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const ProductDetailPage = ({ productData, categorySlug, subCategorySlug, similarProductsGuest = [],alternateProducts = [] }: Props) => {
  console.log("ProductDetailPage render", productData);
  const name = productData.name ?? "";
  const images = productData.images ?? [];
  const description = productData.description ?? [];
  const benefitsFeatures = productData.benefits_features ?? [];
  const state = useLocationData();

  const supplier = productData.suppliers?.[0] ?? null;
  const activePrice = productData.sale_price > 0 ? productData.sale_price : productData.price;
  const unit = productData.selling_type?.attribute_value_unit ?? "Each";
  const currencySymbol = productData.currency?.symbol ?? "";
  const brand = productData.attributes?.find((a) => a.attribute_name === "Manufacturer")?.attribute_value ?? "";

  const allSpecs = (productData.attributes ?? []).map((a) => ({
    attribute_name: a.attribute_name,
    attribute_value: a.measurement_unit ? `${a.attribute_value} ${a.measurement_unit}` : a.attribute_value,
  }));
  const mid = Math.ceil(allSpecs.length / 2);
  const specifications = { left: allSpecs.slice(0, mid), right: allSpecs.slice(mid) };

  const overview = description.join("");
  const qaItems = (productData.faqs ?? []).map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  const avgRating = productData.avg_rating ?? 0;
  const variantGroups = new Map<string, VariantItem[]>();

  const reviews = (productData.reviews ?? []).map((r) => ({
    id: r.id,
    author: r.customer_name,
    verified: true,
    date: r.created_at,
    rating: r.star,
    title: "",
    body: r.comment,
    helpful: 0,
  }));

  const ratingDist = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  const [selectedVariants, setSelectedVariants] = useState<Record<string, VariantItem>>({});
  const [openOverview, setOpenOverview] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);
  const [openFaq, setOpenFaq] = useState(false);

  const selectVariant = (label: string, variant: VariantItem) => {
    setSelectedVariants((prev) => ({ ...prev, [label]: variant }));
  };


  const crumbs =
    productData.breadcrumbs && productData.breadcrumbs.length > 0
      ? [
          { label: "Home", href: "/" },
          ...productData.breadcrumbs.map((b) => ({ label: b.name, href: b.url })),
          { label: name, href: null },
        ]
      : [
          { label: "Home", href: "/" },
          { label: slugToLabel(categorySlug), href: `/${categorySlug}` },
          { label: slugToLabel(subCategorySlug), href: `/${categorySlug}/${subCategorySlug}` },
          { label: name, href: null },
        ];

  return (
    <div>
      <main className="min-h-screen bg-gray-50">
        <Breadcrumb crumbs={crumbs} />

        <div className="global-container mx-auto px-4 sm:px-6 md:py-6 py-0 ">
          <div className="grid grid-cols-1 xl:hidden">
            <div className="relative lg:sticky lg:top-4">
              <ProductGallery
                images={images}
                productName={name}
                productId={productData.id}
                inWishlist={productData.in_wishlist}
                rawProduct={productData}
              />
            </div>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[36%_38%_26%] gap-4 items-start md:mt-11 mt-11 xl:mt-0">
            <div className="relative lg:sticky lg:top-4 hidden xl:block">
              <ProductGallery
                images={images}
                productName={name}
                productId={productData.id}
                inWishlist={productData.in_wishlist}
                rawProduct={productData}
              />
            </div>

            <ProductInfo
              name={name}
              model={productData.sku}
              avgRating={avgRating}
              totalReviews={productData.total_reviews}
              benefitsFeatures={benefitsFeatures}
              variantGroups={variantGroups}
              selectedVariants={selectedVariants}
              onSelectVariant={selectVariant}
              activePrice={activePrice}
              activeOriginal={productData.price}
              unit={unit}
              currency={productData.currency?.symbol}
              freeShipping={supplier?.free_shipping ?? false}
              deliveryDays={supplier?.delivery_days ?? ""}
              returnPolicy={supplier?.return_policy ?? ""}
              accessories={productData.accessories ?? []}
            />

            <PurchasePanel
              activePrice={activePrice}
              activeOriginal={productData.price}
              unit={unit}
              currency={productData.currency?.symbol}
              freeShipping={supplier?.free_shipping ?? false}
              deliveryDays={supplier?.delivery_days ?? ""}
              shipTo={supplier ? `${supplier.vendor.city}, ${supplier.vendor.country}` : ""}
              returnPolicy={supplier?.return_policy ?? ""}
              accessories={productData.accessories ?? []}
              phone=""
              brand={brand}
              brandLogo=""
              brandUrl=""
              productData={productData}
            />
          </div>

          <AlternateAiProducts similarProductsGuest={similarProductsGuest} alternateProducts={alternateProducts} />

          <div className="mt-3 bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-300">
              <h2 className="heading-font-size font-bold text-gray-900">Key Specification</h2>
            </div>
            <div className="p-6">
              <SpecificationsSection specifications={specifications} />
            </div>
          </div>

          {overview && (
            <div className="mt-3 bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              {/* Mobile: accordion header */}
              <button
                className="md:hidden w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpenOverview((v) => !v)}
              >
                <h2 className="heading-font-size font-bold text-gray-900">Product Overview</h2>
                {openOverview ? (
                  <ChevronUp size={18} className="text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500 shrink-0" />
                )}
              </button>
              {/* Desktop: static header */}
              <div className="hidden md:block px-6 py-4 border-b border-gray-300">
                <h2 className="heading-font-size font-bold text-gray-900">Product Overview</h2>
              </div>
              <div className={`px-6 py-5 ${openOverview ? "block" : "hidden"} md:block`}>
                <OverviewSection overview={overview} />
              </div>
            </div>
          )}

          {avgRating > 0 && (
            <div className="mt-3 bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              {/* Mobile: accordion header */}
              <button
                className="md:hidden w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpenReviews((v) => !v)}
              >
                <h2 className="heading-font-size font-bold text-gray-900">Customer Ratings &amp; Reviews</h2>
                {openReviews ? (
                  <ChevronUp size={18} className="text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500 shrink-0" />
                )}
              </button>
              {/* Desktop: static header */}
              <div className="hidden md:flex px-6 py-4 border-b border-gray-300 flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                  <h2 className="heading-font-size font-bold text-gray-900">
                    Customer Ratings &amp; Reviews
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Real reviews from hotels, restaurants, and chefs who&apos;ve used this product.
                  </p>
                </div>
                <button className="bg-[#186737] px-4 hover:bg-[#145c30] text-white text-sm font-bold py-2.5 rounded-[7px] transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={15} strokeWidth={2} />
                  Leave a Review
                </button>
              </div>
              <div className={`p-6 ${openReviews ? "block" : "hidden"} md:block`}>
                <ReviewsSection avgRating={avgRating} reviews={reviews} ratingDist={ratingDist} />
              </div>
            </div>
          )}

          {qaItems.length > 0 && (
            <div className="mt-3 mb-8 bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              {/* Mobile: accordion header */}
              <button
                className="md:hidden w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpenFaq((v) => !v)}
              >
                <h2 className="heading-font-size font-bold text-gray-900">Questions from buyers like you</h2>
                {openFaq ? (
                  <ChevronUp size={18} className="text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500 shrink-0" />
                )}
              </button>
              {/* Desktop: static header */}
              <div className="hidden md:block px-6 py-4 border-b border-gray-300">
                <h2 className="heading-font-size font-bold text-gray-900">
                  Questions from buyers like you
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Answered to help you make right decisions
                </p>
              </div>
              <div className={`p-6 ${openFaq ? "block" : "hidden"} md:block`}>
                <QASection items={qaItems} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
