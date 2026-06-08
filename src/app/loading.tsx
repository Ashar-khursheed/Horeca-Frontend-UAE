import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="global-container">
      {/* Hero Banner */}
      <div className="w-full flex gap-4 p-4">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <div className="hidden lg:flex flex-col gap-4 w-[320px] shrink-0">
          <Skeleton className="h-[192px] w-full rounded-xl" />
          <Skeleton className="h-[192px] w-full rounded-xl" />
        </div>
      </div>

      {/* Featured Categories */}
      <div className="px-4 py-6">
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 py-6">
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-44 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
