export default function CategoriesLoading() {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <div className="global-container">
          <div className="flex items-center h-10 gap-2">
            <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-3 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-50">
        {/* Banner Skeleton */}
        <section className="bg-white border-b border-gray-100">
          <div className="w-full h-[200px] md:h-[300px] lg:h-[360px] bg-gray-200 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent" />
            {/* fake text block on left */}
            <div className="absolute inset-0 flex flex-col justify-center pl-8 md:pl-16 gap-3">
              <div className="h-8 md:h-12 lg:h-16 w-48 md:w-72 lg:w-96 bg-gray-300 rounded" />
              <div className="h-8 md:h-12 lg:h-16 w-40 md:w-64 lg:w-80 bg-gray-300 rounded" />
              <div className="h-4 md:h-5 w-36 md:w-56 lg:w-72 bg-gray-300/70 rounded mt-1" />
              <div className="h-4 md:h-5 w-28 md:w-44 lg:w-60 bg-gray-300/70 rounded" />
            </div>
          </div>
        </section>

        {/* Filter Tabs Skeleton */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="global-container">
            <div className="flex gap-2 overflow-x-hidden py-3">
              {/* "All" pill */}
              <div className="h-7 w-10 rounded-full bg-gray-300 animate-pulse shrink-0" />
              {/* category pills */}
              {[88, 110, 96, 120, 80, 104, 92, 116, 86].map((w, i) => (
                <div
                  key={i}
                  className="h-7 rounded-full bg-gray-200 animate-pulse shrink-0"
                  style={{ width: w }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Count text skeleton */}
        <section className="global-container py-6">
          <div className="h-3.5 w-36 bg-gray-200 rounded animate-pulse mb-4" />

          {/* Sub-category grid skeleton — matches grid-cols-2 sm:4 md:5 lg:6 xl:7 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2.5 md:gap-4">
            {Array.from({ length: 42 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col border border-slate-200 rounded-[7px] overflow-hidden bg-white"
              >
                {/* image area — aspect-square */}
                <div className="aspect-square bg-gray-200 animate-pulse" />
                {/* label */}
                <div className="bg-white px-2 py-2.5 flex justify-center">
                  <div className="h-3.5 w-4/5 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
