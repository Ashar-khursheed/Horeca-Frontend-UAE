"use client";

import { Minus, Plus } from "lucide-react";
import { useRef, useState } from "react";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  unit: string;
};

const AI_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ellis Mezzaroma Dark Regular Ground Espresso 12",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/jNOl08wEvHaZXVAxMGMC2DlV3cOtng1wPy4RbXgF.webp",
    price: 59.99,
    unit: "Case",
  },
  {
    id: 2,
    name: "Crown Beverages Royal Reserve Guatemalan Coarse",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/m31OGvCZpK6cb2ir36O53rEmAIpZJDFHI5T5a3j3.webp",
    price: 104.99,
    unit: "Case",
  },
  {
    id: 3,
    name: "Crown Beverages Emperor's Finest Decaf Coarse",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/2PVVLTvZ0a84B4gMbHXCxEvSHgb1Kvpe3ayRe27a.webp",
    price: 86.99,
    unit: "Case",
  },
  {
    id: 4,
    name: "Crown Beverages Emperor's Finest Coarse Ground",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/soAbqr3YuewI5zrkrKXWVgeZN5gaL631uNkefMc4.webp",
    price: 78.99,
    unit: "Case",
  },
  {
    id: 5,
    name: "Crown Beverages Emperor's Finest Whole Bean Decaf",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/k49XDTZSyc2cSabCoOxG2yohcB00EGxC267fS0Xj.webp",
    price: 89.99,
    unit: "Case",
  },
];

const BOUGHT_TOGETHER: Product[] = [
  {
    id: 101,
    name: "Crown Beverages Emperor's Blend Decaf Coffee",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/MdaXVF5lIZmpwJ1bYcrp39qM0glVwBt7a5RqKowh.webp",
    price: 72.49,
    unit: "Case",
  },
  {
    id: 102,
    name: "Crown Beverages Single Origin Ethiopia Yirgacheffe",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/rONKFHkusKtD3dGKItl6XPE6EHcEbXXr7S24Av8r.webp",
    price: 94.99,
    unit: "Case",
  },
  {
    id: 103,
    name: "Ellis Mezzaroma Dark Regular Ground Espresso 12",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/jNOl08wEvHaZXVAxMGMC2DlV3cOtng1wPy4RbXgF.webp",
    price: 59.99,
    unit: "Case",
  },
  {
    id: 104,
    name: "Crown Beverages Emperor's Finest Whole Bean Decaf",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/k49XDTZSyc2cSabCoOxG2yohcB00EGxC267fS0Xj.webp",
    price: 89.99,
    unit: "Case",
  },
  {
    id: 105,
    name: "Crown Beverages Royal Reserve Guatemalan Coarse",
    image: "https://d1p9kdrbe10xzz.cloudfront.net/production/products/m31OGvCZpK6cb2ir36O53rEmAIpZJDFHI5T5a3j3.webp",
    price: 104.99,
    unit: "Case",
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="shrink-0 w-36 border border-gray-200 rounded-[7px] bg-white overflow-hidden">
      {/* Image */}
      <div className="bg-gray-50 h-24 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-20 w-full object-contain px-2"
        />
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-[10px] text-gray-700 leading-tight line-clamp-2 min-h-7">
          {product.name}
        </p>
        <p className="text-[#145c30] font-bold text-xs mt-1">
          ${product.price.toFixed(2)}
          <span className="text-gray-400 font-normal text-[9px]">/{product.unit}</span>
        </p>

        {/* Qty + Add */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden h-6 shrink-0">
            <button
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              disabled={qty <= 1}
              className="w-4 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={8} className="text-gray-600" strokeWidth={2.5} />
            </button>
            <span className="w-5 text-center text-[10px] font-bold text-[#186737]">
              {qty}
            </span>
            <button
              onClick={() => setQty((v) => Math.min(99, v + 1))}
              disabled={qty >= 99}
              className="w-4 h-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={8} className="text-gray-600" strokeWidth={2.5} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className={`flex-1 h-6 text-[9px] font-bold rounded flex items-center justify-center gap-0.5 transition-colors ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[#186737] hover:bg-[#145c30] text-white"
            }`}
          >
            {/* <ShoppingCart size={9} strokeWidth={2.5} /> */}
            {added ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductRow = ({ products }: { products: Product[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="relative pr-6">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {/* <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-sm rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
      >
        <ChevronRight size={12} className="text-gray-600" />
      </button> */}
    </div>
  );
};

const AlternateAiProducts = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:flex hidden">
      {/* AI-Recommended Alternatives */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          {/* <Sparkles size={14} className="text-[#186737] shrink-0" /> */}
          <h2 className="heading-font-size font-bold text-gray-800">AI-Recommended Alternatives</h2>
          {/* <HelpCircle size={13} className="text-gray-400 ml-auto shrink-0" /> */}
        </div>
        <div className="px-4 py-3">
          <ProductRow products={AI_PRODUCTS} />
        </div>
      </div>

      {/* Frequently Bought Together */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          {/* <ShoppingCart size={14} className="text-[#186737] shrink-0" /> */}
          <h2 className="heading-font-size font-bold text-gray-800">Frequently Bought Together</h2>
        </div>
        <div className="px-4 py-3">
          <ProductRow products={BOUGHT_TOGETHER} />
        </div>
      </div>
    </div>
  );
};

export default AlternateAiProducts;
