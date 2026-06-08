import { Skeleton } from "@/components/ui/skeleton";

export default function BrandsLoading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <Skeleton className="h-7 w-36 mb-6" />
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-4 border rounded-lg">
            <Skeleton className="h-16 w-24 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
