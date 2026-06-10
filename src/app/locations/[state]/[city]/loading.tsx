export default function LocationPageLoading() {
  return (
    <div className="animate-pulse">

      {/* ── Hero ── */}
      <div className="relative w-full h-[280px] sm:h-[320px] bg-gray-300">
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 gap-4">
          <div className="w-64 h-8 bg-gray-400 rounded" />
          <div className="w-96 h-4 bg-gray-400/70 rounded" />
          <div className="w-80 h-4 bg-gray-400/70 rounded" />
          <div className="w-36 h-10 bg-gray-400 rounded-[7px] mt-2" />
        </div>
      </div>

      <div className="global-container py-10 space-y-12">

        {/* ── About text ── */}
        <div className="space-y-3">
          <div className="w-48 h-5 bg-gray-200 rounded" />
          <div className="w-full h-4 bg-gray-100 rounded" />
          <div className="w-5/6 h-4 bg-gray-100 rounded" />
          <div className="w-4/6 h-4 bg-gray-100 rounded" />
        </div>

        {/* ── Popular Categories ── */}
        <div className="space-y-5">
          <div className="w-48 h-6 bg-gray-200 rounded mx-auto" />
          <div className="flex gap-4 overflow-hidden justify-center flex-wrap">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200" />
                <div className="w-16 h-3 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Product Sliders (2 sections) ── */}
        {Array.from({ length: 2 }).map((_, si) => (
          <div key={si} className="space-y-4">
            {/* Section heading */}
            <div className="w-72 h-6 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-100 rounded" />
            <div className="w-5/6 h-4 bg-gray-100 rounded" />

            {/* Product cards row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-[7px] border border-gray-100 overflow-hidden space-y-3 p-3">
                  <div className="w-full aspect-square bg-gray-200 rounded-[7px]" />
                  <div className="w-3/4 h-3 bg-gray-200 rounded" />
                  <div className="w-1/2 h-3 bg-gray-100 rounded" />
                  <div className="w-1/3 h-5 bg-gray-200 rounded" />
                  <div className="w-full h-8 bg-gray-200 rounded-[7px]" />
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
