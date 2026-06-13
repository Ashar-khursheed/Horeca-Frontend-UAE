export default function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-[#E2E8F066]">

      {/* Breadcrumb skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container py-3 flex items-center gap-2">
          <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="global-container py-8">
        <div className="bg-white rounded-[10px] shadow-lg overflow-hidden">

          {/* Green stripe */}
          <div className="h-2 w-full bg-gray-200 animate-pulse" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">

            {/* LEFT */}
            <div className="p-4 sm:p-6 lg:p-8 border-r border-gray-100 order-2 lg:order-1 space-y-5">

              {/* Heading */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-40" />
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Info rows */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mt-1 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-100" />

              {/* Order items heading */}
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />

              {/* Product cards */}
              <div className="border border-gray-100 rounded-[7px] overflow-hidden divide-y divide-gray-50">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-48 mb-3" />
                    <div className="flex gap-4">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-[7px] bg-gray-200 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/4" />
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-100" />

              {/* Share buttons */}
              <div className="flex gap-2">
                <div className="h-9 w-28 bg-gray-200 rounded-[7px] animate-pulse" />
                <div className="h-9 w-20 bg-gray-200 rounded-[7px] animate-pulse" />
              </div>

              <div className="h-px bg-gray-100" />

              {/* CTA */}
              <div className="flex gap-3 justify-between">
                <div className="h-10 w-36 bg-gray-200 rounded-[7px] animate-pulse" />
                <div className="h-10 w-36 bg-gray-100 rounded-[7px] animate-pulse" />
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-4 p-4 sm:p-6 order-1 lg:order-2 border-b border-gray-100 lg:border-b-0">

              {/* Thank You card */}
              <div className="bg-green-50 rounded-[10px] p-6 flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-7 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="h-12 w-full bg-white rounded-[7px] animate-pulse mt-1" />
              </div>

              {/* Order summary */}
              <div className="bg-white rounded-[7px] border border-gray-100 p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                ))}
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-24" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-[7px] border border-gray-100 p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-[7px] bg-gray-200 animate-pulse" />
                      <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-14 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="bg-white rounded-[7px] border border-gray-100 p-4">
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mx-auto mb-3" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-9 bg-gray-100 rounded-[7px] animate-pulse" />
                  <div className="h-9 bg-gray-100 rounded-[7px] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
