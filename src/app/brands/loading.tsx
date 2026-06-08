export default function BrandsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <div className="global-container">
          <div className="flex items-center h-10 gap-2">
            <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-3 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-14 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Banner Skeleton */}
      <div className="w-full h-30 md:h-55 lg:h-75 bg-gray-800 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-0 flex items-center pl-8 md:pl-16">
          <div className="space-y-2 md:space-y-3">
            <div className="h-3 md:h-5 lg:h-7 w-40 md:w-64 lg:w-80 bg-gray-600 rounded" />
            <div className="h-3 md:h-5 lg:h-7 w-32 md:w-52 lg:w-64 bg-gray-600 rounded" />
            <div className="h-3 md:h-5 lg:h-7 w-24 md:w-44 lg:w-56 bg-gray-600 rounded" />
            <div className="h-5 md:h-7 lg:h-9 w-20 md:w-28 lg:w-32 bg-gray-700 rounded mt-1" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container py-8 md:py-12 flex flex-col items-center">
          {/* Title lines */}
          <div className="h-7 md:h-9 w-3/4 md:w-130 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-7 md:h-9 w-1/2 md:w-80 bg-gray-200 rounded animate-pulse mb-4" />
          {/* Subtitle */}
          <div className="h-4 w-52 bg-gray-200 rounded animate-pulse mb-3" />
          {/* Description */}
          <div className="space-y-2 max-w-2xl w-full">
            <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse mx-auto" />
            <div className="h-3 w-4/6 bg-gray-100 rounded animate-pulse mx-auto" />
          </div>
        </div>

        {/* Alphabet Nav Skeleton */}
        <div className="border-t border-b border-gray-100 bg-white">
          <div className="global-container">
            <div className="flex items-center justify-center flex-wrap gap-0 py-1">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
                <div
                  key={l}
                  className="w-8 h-8 sm:w-9 sm:h-9 m-0.5 rounded bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Cards Grid Skeleton */}
      <div className="global-container py-8 lg:py-12">
        {/* Letter header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse shrink-0" />
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Image area — matches aspect-4/3 */}
              <div className="aspect-4/3 bg-gray-200 animate-pulse" />
              {/* Card body */}
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
