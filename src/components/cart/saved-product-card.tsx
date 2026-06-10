"use client";

import ProductCard, { ApiProduct } from "@/components/product-card";
import { useAppDispatch } from "@/store/hooks";
import { fetchSaveForLater, removeSaveForLater, toggleGuestSaveItem } from "@/store/slices/save-for-later/saveForLaterSlice";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { SavedItem } from "./cart-types";

function toApiProduct(item: SavedItem): ApiProduct {
  return {
    id: item.id,
    name: item.name,
    url: item.url,
    sku: item.modelNo,
    category_url: item.categoryUrl ?? "",
    parent_category_url: item.parentCategoryUrl ?? "",
    price: item.originalPrice,
    sale_price: item.salePrice ?? 0,
    original_price: item.originalPrice,
    front_sale_price: item.salePrice ?? item.price,
    best_price: item.price,
    avg_rating: item.rating > 0 ? item.rating : null,
    total_reviews: item.reviews,
    delivery_days: item.deliveryDays,
    currency: item.currencySymbol ?? "$",
    images: [item.image],
    alt_tags: item.altTags?.length ? item.altTags : [item.name],
    in_wishlist: false,
    min_quantity: item.minQty ?? 1,
    is_fixed: item.isFixed ? 1 : 0,
    quote_available: null,
    selling_type: {
      attribute_value: item.unit,
      attribute_value_unit: item.unit,
    },
    free_shipping: item.freeShipping ? 1 : 0,
    return_policy: item.returnPolicy ?? "",
    isRequired: false,
    suppliers: [
      {
        vendor_id: item.vendorId ?? 0,
        delivery_days: item.deliveryDays,
        free_shipping: item.freeShipping ? 1 : 0,
        min_quantity: item.minQty ?? 1,
        is_fixed: item.isFixed ? 1 : 0,
      },
    ],
  };
}

export default function SavedProductCard({
  item,
  onAddToCart: _onAddToCart,
  onRemove,
  onAfterAddToCart,
  isLoggedIn = true,
}: {
  item: SavedItem;
  onAddToCart: (id: number) => void;
  onRemove: (id: number) => Promise<void>;
  onAfterAddToCart?: () => void;
  isLoggedIn?: boolean;
}) {
  const dispatch = useAppDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  const product = toApiProduct(item);

  const handleBeforeAdd = async () => {
    if (isLoggedIn) {
      await dispatch(removeSaveForLater({ productId: item.id }));
      dispatch(fetchSaveForLater());
    } else {
      dispatch(toggleGuestSaveItem({ productId: item.id, quantity: item.qty, vendorId: item.vendorId ?? 0, rawProduct: null }));
    }
  };

  const handleAddSuccess = () => {
    if (isLoggedIn) {
      dispatch(fetchSaveForLater());
    }
    onAfterAddToCart?.();
  };

  const handleAddedToCart = () => {};

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <ProductCard
          product={product}
          onWishlistToggle={() => {}}
          onBeforeAdd={handleBeforeAdd}
          onAddSuccess={handleAddSuccess}
          onAddedToCart={handleAddedToCart}
        />
      </div>

      <button
        disabled={isRemoving}
        onClick={async () => {
          setIsRemoving(true);
          await onRemove(item.id);
          setIsRemoving(false);
        }}
        className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-1.5 rounded-[7px] border border-gray-100 text-[11px] font-semibold text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isRemoving ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <Trash2 size={11} />
        )}
        {isRemoving ? "Removing…" : "Remove from Saved"}
      </button>
    </div>
  );
}
