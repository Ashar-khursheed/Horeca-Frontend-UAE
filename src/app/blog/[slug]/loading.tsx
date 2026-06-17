import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetailLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container px-4 lg:px-6 h-10 flex items-center gap-2">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-3.5 w-3" />
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-3.5 w-3" />
          <Skeleton className="h-3.5 w-32" />
        </div>
      </div>

      <div className="global-container px-4 lg:px-6 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Main Content ── */}
          <article className="lg:col-span-8 min-w-0">
            {/* Title */}
            <Skeleton className="h-8 sm:h-9 w-full mb-2" />
            <Skeleton className="h-8 sm:h-9 w-2/3 mb-4" />

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-20 rounded-full ml-auto" />
            </div>

            {/* Banner */}
            <Skeleton className="w-full h-56 sm:h-80 lg:h-96 rounded-xl mb-8" />

            {/* Blog Content */}
            <div className="bg-white rounded-[7px] border border-gray-200 shadow-sm p-6 sm:p-8 mb-8 space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-40 w-full rounded-lg my-2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>

            {/* Author Bio */}
            <div className="bg-white rounded-[7px] border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
              <div className="flex items-start gap-4 sm:gap-5">
                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-3 bg-white rounded-[7px] border border-gray-200 p-4">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4 min-w-0">
            <div className="space-y-5">
              {/* TOC */}
              <div className="hidden lg:block bg-white rounded-[7px] border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                  <Skeleton className="h-4 w-36" />
                </div>
                <div className="p-3 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>

              {/* Quick Info card */}
              <div className="hidden lg:block bg-white rounded-[7px] border border-gray-200 shadow-sm p-5">
                <Skeleton className="h-3 w-32 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                      <div className="space-y-1">
                        <Skeleton className="h-2.5 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
