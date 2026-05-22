"use client";

import ProductCard, { ApiProduct } from "@/components/product-card";
import { Trash2 } from "lucide-react";
import { SavedItem } from "./cart-types";

// Map SavedItem → ApiProduct so ProductCard renders correctly
function toApiProduct(item: SavedItem): ApiProduct {
  return {
    id: item.id,
    name: item.name,
    url: item.url,
    sku: item.modelNo,
    category_url: "",
    parent_category_url: "",
    price: item.price,
    sale_price: item.price < item.originalPrice ? item.price : 0,
    original_price: item.originalPrice,
    front_sale_price: item.price,
    best_price: item.price,
    avg_rating: item.rating > 0 ? item.rating : null,
    total_reviews: item.reviews,
    delivery_days: item.deliveryDays,
    currency: "$",
    images: [item.image],
    alt_tags: [item.name],
    in_wishlist: true,
    min_quantity: item.qty,
    is_fixed: 0,
    quote_available: null,
    selling_type: {
      attribute_value: item.unit,
      attribute_value_unit: item.unit,
    },
    free_shipping: item.freeShipping ? 1 : 0,
    return_policy: "",
    isRequired: false,
  };
}

export default function SavedProductCard({
  item,
  onAddToCart,
  onRemove,
}: {
  item: SavedItem;
  onAddToCart: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const product = toApiProduct(item);

  return (
    <div className="flex flex-col h-full">
      {/* Existing ProductCard — full behaviour intact */}
      <div className="flex-1">
        <ProductCard
          product={product}
          onAddToCart={() => onAddToCart(item.id)}
          onWishlistToggle={() => {}}
        />
      </div>

      {/* Remove from Saved — sits flush below the card */}
      <button
        onClick={() => onRemove(item.id)}
        className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-1.5 rounded-[7px] border border-gray-100 text-[11px] font-semibold text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200"
      >
        <Trash2 size={11} />
        Remove from Saved
      </button>
    </div>
  );
}
