import { ChevronRight, Home } from "lucide-react";

export default function CartLoading() {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <div className="global-container">
          <ol className="flex items-center flex-wrap gap-y-1 h-10 text-xs">
            <li className="flex items-center text-gray-400 gap-1">
              <Home size={11} /> Home
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1.5 text-gray-300" />
              <span className="text-[#186737] font-semibold">Shopping Cart</span>
            </li>
          </ol>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-50/60">
        <div className="global-container py-6 sm:py-8">

          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[7px] bg-gray-200 animate-pulse" />
              <div className="space-y-2">
                <div className="w-36 h-5 bg-gray-200 animate-pulse rounded" />
                <div className="w-24 h-3 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
            <div className="w-28 h-4 bg-gray-200 animate-pulse rounded" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px] xl:grid-cols-[1fr_400px] gap-6 items-start">
            {/* LEFT */}
            <div className="space-y-5">

              {/* Cart items card skeleton */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                {/* Section header */}
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="w-20 h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="w-12 h-3 bg-gray-100 animate-pulse rounded" />
                  <div className="ml-auto w-5 h-5 bg-gray-100 animate-pulse rounded" />
                </div>

                {/* 3 item rows */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-5 py-5 border-b border-gray-50 flex gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 animate-pulse rounded-[7px] shrink-0" />
                    <div className="flex-1 space-y-2.5">
                      <div className="flex justify-between gap-4">
                        <div className="w-2/3 h-4 bg-gray-200 animate-pulse rounded" />
                        <div className="w-20 h-5 bg-gray-200 animate-pulse rounded shrink-0" />
                      </div>
                      <div className="w-1/4 h-3 bg-gray-100 animate-pulse rounded" />
                      <div className="w-1/3 h-3 bg-gray-100 animate-pulse rounded" />
                      <div className="flex items-center gap-3 mt-3">
                        <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-[7px]" />
                        <div className="w-28 h-8 bg-gray-100 animate-pulse rounded-[7px]" />
                        <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-[7px]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Saved for Later skeleton */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-gray-100">
                  <div className="w-40 h-4 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-[7px]" />
                        <div className="w-3/4 h-3 bg-gray-200 animate-pulse rounded" />
                        <div className="w-1/2 h-3 bg-gray-100 animate-pulse rounded" />
                        <div className="w-full h-7 bg-gray-200 animate-pulse rounded-[4px]" />
                        <div className="w-full h-7 bg-gray-100 animate-pulse rounded-[7px]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile summary skeleton */}
              <div className="md:hidden bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="w-28 h-5 bg-gray-200 animate-pulse rounded" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="w-24 h-3 bg-gray-100 animate-pulse rounded" />
                    <div className="w-16 h-3 bg-gray-100 animate-pulse rounded" />
                  </div>
                ))}
                <div className="w-full h-px bg-gray-100" />
                <div className="flex justify-between">
                  <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="w-20 h-4 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-[7px]" />
              </div>
            </div>

            {/* RIGHT — summary skeleton */}
            <div className="hidden md:block bg-white rounded-[7px] border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="w-28 h-5 bg-gray-200 animate-pulse rounded" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="w-24 h-3 bg-gray-100 animate-pulse rounded" />
                  <div className="w-16 h-3 bg-gray-100 animate-pulse rounded" />
                </div>
              ))}
              <div className="w-full h-px bg-gray-100" />
              <div className="flex justify-between">
                <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
                <div className="w-20 h-4 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="w-full h-10 bg-gray-200 animate-pulse rounded-[7px]" />
              <div className="w-full h-px bg-gray-100" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="w-24 h-3 bg-gray-200 animate-pulse rounded" />
                      <div className="w-40 h-2.5 bg-gray-100 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
