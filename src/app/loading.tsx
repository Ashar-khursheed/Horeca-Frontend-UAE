import { Skeleton } from "@/components/ui/skeleton";

// ─── Product Card Skeleton ────────────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      {/* Product Image */}
      <Skeleton className="h-44 w-full rounded-lg" />
      {/* Title line 1 */}
      <Skeleton className="h-3.5 w-4/5" />
      {/* Title line 2 */}
      <Skeleton className="h-3.5 w-3/5" />
      {/* Star rating */}
      <div className="flex gap-1 mt-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-3 rounded-full" />
        ))}
      </div>
      {/* Price */}
      <Skeleton className="h-5 w-2/5 mt-1" />
      {/* Delivery badge */}
      <Skeleton className="h-3 w-3/5" />
      {/* Add to Cart button */}
      <Skeleton className="h-9 w-full rounded-lg mt-1" />
    </div>
  );
}

// ─── Category Card Skeleton ───────────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="h-[90px] w-full rounded-xl" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-10" />
    </div>
  );
}

// ─── Tab Pills Skeleton ───────────────────────────────────────────────────────
function TabsSkeleton() {
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-36 rounded-full" />
      ))}
    </div>
  );
}

// ─── Main Loading ─────────────────────────────────────────────────────────────
export default function HomeLoading() {
  return (
    <main className="global-container bg-[#f7f7f7] min-h-screen">

      {/* ── Hero Banner + Side Cards ──────────────────────────────────── */}
      <section className="w-full flex gap-3 p-4">
        {/* Main banner */}
        <Skeleton className="h-[220px] sm:h-[280px] lg:h-[340px] w-full rounded-2xl flex-1" />

        {/* Side cards — lg only */}
        <div className="hidden lg:flex flex-col gap-3 w-[300px] shrink-0">
          <Skeleton className="h-[163px] w-full rounded-2xl" />
          <Skeleton className="h-[163px] w-full rounded-2xl" />
        </div>
      </section>

      {/* ── Store Title Strip ─────────────────────────────────────────── */}
      <section className="px-4 py-3 flex flex-col items-center gap-2 mb-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-3.5 w-72" />
        <Skeleton className="h-3 w-96 max-w-full" />
      </section>

      {/* ── Shop by Categories ───────────────────────────────────────── */}
      <section className="mx-4 mb-4 rounded-2xl bg-white px-5 py-5 shadow-sm">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-24 rounded-full" />
        </div>

        {/* Row 1 – 8 categories */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 mb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>

        {/* Row 2 – 8 categories */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="mx-4 mb-6 rounded-2xl bg-white px-5 py-5 shadow-sm">
        {/* Header + tab pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <Skeleton className="h-6 w-44" />
          <TabsSkeleton />
        </div>

        {/* Product grid — Row 1 (5 cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

        {/* Product grid — Row 2 (5 cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>

    </main>
  );
}