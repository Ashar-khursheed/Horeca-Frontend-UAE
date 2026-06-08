export default function CategoryLoading() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb */}
      <div className="global-container py-3 flex items-center gap-2">
        <div className="h-3.5 w-10 bg-gray-200 rounded" />
        <div className="h-3.5 w-3 bg-gray-200 rounded" />
        <div className="h-3.5 w-20 bg-gray-200 rounded" />
        <div className="h-3.5 w-3 bg-gray-200 rounded" />
        <div className="h-3.5 w-32 bg-gray-200 rounded" />
      </div>

      {/* Hero Banner */}
      <div className="w-full h-45 md:h-80 bg-gray-200" />

      {/* SEO title + description */}
      <div className="global-container py-5 space-y-2">
        <div className="h-5 w-48 bg-gray-200 rounded mx-auto" />
        <div className="h-3.5 w-full max-w-2xl bg-gray-200 rounded mx-auto" />
        <div className="h-3.5 w-3/4 max-w-xl bg-gray-200 rounded mx-auto" />
      </div>

      {/* Category Grid */}
      <div className="global-container py-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 md:gap-5 gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-[7px] md:p-6 p-3 flex flex-col md:gap-4 gap-2"
            >
              {/* Image placeholder */}
              <div className="w-full h-25 md:h-55 bg-gray-200 rounded-[7px]" />
              {/* Title */}
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              {/* Badge */}
              <div className="h-5 w-20 bg-gray-200 rounded-[7px]" />
              {/* Sub-items */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-3 bg-gray-200 rounded" style={{ width: `${70 + (j % 3) * 10}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore section */}
      <div className="bg-white py-7">
        <div className="global-container space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-64 bg-gray-200 rounded" />
            <div className="h-3.5 w-full max-w-lg bg-gray-200 rounded" />
            <div className="h-3.5 w-2/3 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-30 md:h-40 bg-gray-200 rounded-[7px]" />
            ))}
          </div>
        </div>
      </div>

      {/* Top Choices slider */}
      <div className="global-container py-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-52 bg-gray-200 rounded" />
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-40 bg-gray-200 rounded-[7px]" />
              <div className="h-3.5 w-3/4 bg-gray-200 rounded" />
              <div className="h-3.5 w-1/2 bg-gray-200 rounded" />
              <div className="h-8 w-full bg-gray-200 rounded-[7px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Secondary banner */}
      <div className="global-container pb-7">
        <div className="w-full h-30 md:h-45 bg-gray-200 rounded-[7px]" />
      </div>

      {/* Brands grid */}
      <div className="py-7 bg-white border-t border-gray-100">
        <div className="global-container space-y-4">
          <div className="h-5 w-40 bg-gray-200 rounded mx-auto" />
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-[7px]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
