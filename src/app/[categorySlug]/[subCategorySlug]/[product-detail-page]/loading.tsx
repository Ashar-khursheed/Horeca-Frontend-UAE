import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="global-container ">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Skeleton className="h-4 w-20" />
            {i < 3 && <Skeleton className="h-4 w-3" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="flex gap-4 lg:w-[480px] shrink-0">
          <div className="hidden lg:flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-[400px] flex-1 rounded-xl" />
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-px w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-32 rounded-md" />
            <Skeleton className="h-11 flex-1 rounded-md" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-2/3" />
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-10">
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-44 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
