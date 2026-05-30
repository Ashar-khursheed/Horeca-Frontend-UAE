// ─── ProductCard Skeleton ─────────────────────────────────────────────────────
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-[7px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full border border-transparent animate-pulse">
    {/* Image area */}
    <div className="relative bg-gray-100">
      <div className="w-full aspect-square bg-gray-200" />
      <div className="h-3" />
    </div>

    {/* Content area */}
    <div className="px-3 pb-3 pt-2 md:px-4 md:pb-4 md:pt-2 flex flex-col flex-1 border-t border-gray-100 gap-2">
      {/* Name — 2 lines */}
      <div className="space-y-1.5 mt-1">
        <div className="h-3.5 bg-gray-200 rounded w-full" />
        <div className="h-3.5 bg-gray-200 rounded w-3/4" />
      </div>

      {/* SKU */}
      <div className="h-3 bg-gray-100 rounded w-2/5" />

      {/* Stars */}
      <div className="flex items-center gap-1 mt-0.5">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded-sm" />
        ))}
        <div className="w-6 h-3 bg-gray-200 rounded ml-1" />
      </div>

      {/* Shipping */}
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      {/* Delivery days */}
      <div className="h-3 bg-gray-100 rounded w-2/5" />

      {/* Price */}
      <div className="mt-auto pt-3 space-y-1.5">
        <div className="h-6 bg-gray-200 rounded w-2/5" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>

      {/* Counter + CTA */}
      <div className="flex gap-2 items-center w-full mt-2">
        <div className="w-[75px] h-[29px] xl:w-[85px] xl:h-[35px] bg-gray-200 rounded-[4px] flex-shrink-0" />
        <div className="flex-1 h-[29px] xl:h-[35px] bg-gray-200 rounded-[4px]" />
      </div>
    </div>
  </div>
);
