import { ProductCardSkeleton } from "@/components/loading-sketlon";

export default function SalePageLoading() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-[180px] sm:h-[280px] bg-gray-200" />
      <div className="bg-[#E2E8F04D] border-b-2 border-[#E2E8F0] py-6">
        <div className="global-container space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="global-container py-8">
        <div className="flex gap-5 items-start">
          <div className="hidden lg:block w-60 shrink-0 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-[7px]" />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-7 bg-gray-200 rounded w-64 mb-5" />
            <div className="h-10 bg-gray-100 rounded-lg mb-5" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={`sale-skeleton-${idx}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
