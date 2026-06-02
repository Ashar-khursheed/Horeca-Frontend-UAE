export default function Loading() {
  return (
    <div className="animate-pulse w-full">
      <div className="global-container mt-3 sm:mt-6">
        <div className="flex flex-col lg:grid lg:grid-cols-[70%_30%] gap-3 lg:gap-4">
          <div className="w-full rounded-[7px] bg-gray-200" style={{ aspectRatio: "875/380" }} />
          <div className="rounded-[7px] bg-gray-200 h-40 lg:h-auto" />
        </div>
      </div>

      <div className="global-container py-6">
        <div className="h-7 bg-gray-200 rounded w-48 mb-5" />
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-[7px] bg-gray-200" />
          ))}
        </div>
      </div>

      <div className="global-container py-6">
        <div className="h-7 bg-gray-200 rounded w-56 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-[7px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
