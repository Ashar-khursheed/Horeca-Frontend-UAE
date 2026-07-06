import { Skeleton } from "@/components/ui/skeleton";

function SectionCardSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="mt-3 bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-300">
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="p-6 flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="global-container mx-auto px-4 sm:px-6 md:py-6 py-4">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Skeleton className="h-4 w-20" />
              {i < 3 && <Skeleton className="h-4 w-3" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[35%_36%_26%] 2xl:grid-cols-[36%_38%_26%] gap-4 items-start">
          {/* Gallery */}
          <div className="flex gap-4">
            <div className="hidden lg:flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-100 flex-1 rounded-xl" />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-px w-full" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-2/3" />
              ))}
            </div>
          </div>

          {/* Purchase Panel */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Key Specification */}
        <SectionCardSkeleton lines={6} />

        {/* Product Overview */}
        <SectionCardSkeleton lines={4} />

        {/* Reviews */}
        <SectionCardSkeleton lines={5} />

        {/* Q&A */}
        <SectionCardSkeleton lines={3} />

        {/* Recommended Products */}
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

        {/* Recently Viewed */}
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
    </main>
  );
}
