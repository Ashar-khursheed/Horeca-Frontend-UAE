import { Skeleton } from "@/components/ui/skeleton";

// ── Sidebar: user card (layout) ───────────────────────────────────────────────
export function SidebarUserSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// ── Mobile: green-header user info ────────────────────────────────────────────
export function MobileUserInfoSkeleton() {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-full bg-white/20 animate-pulse shrink-0" />
      <div className="flex-1 min-w-0 space-y-2.5">
        <div className="h-5 w-36 bg-white/25 rounded animate-pulse" />
        <div className="h-3.5 w-44 bg-white/20 rounded animate-pulse" />
        <div className="h-3 w-28 bg-white/15 rounded animate-pulse" />
      </div>
    </div>
  );
}

// ── Mobile: stats cards (3 cards in the green header) ─────────────────────────
export function MobileStatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-sm rounded-[7px] p-3 text-center border border-white/20 space-y-2"
        >
          <div className="w-5 h-5 rounded bg-white/20 animate-pulse mx-auto" />
          <div className="h-5 w-8 bg-white/25 rounded animate-pulse mx-auto" />
          <div className="h-3 w-12 bg-white/15 rounded animate-pulse mx-auto" />
        </div>
      ))}
    </div>
  );
}

// ── Desktop: welcome banner ────────────────────────────────────────────────────
export function WelcomeBannerSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[7px] bg-linear-to-br from-[#186737] via-[#1e7d42] to-[#22a34e] text-white shadow-lg">
      <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -right-4 w-36 h-36 rounded-full bg-white/5" />
      <div className="absolute top-6 right-24 w-16 h-16 rounded-full bg-white/5" />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[7px] bg-white/25 animate-pulse shrink-0" />
            <div className="space-y-2.5">
              <div className="h-7 w-56 bg-white/25 rounded animate-pulse" />
              <div className="h-3.5 w-40 bg-white/20 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-[7px] px-4 py-2.5 backdrop-blur-sm">
            <div className="w-5 h-5 rounded-full bg-white/20 animate-pulse shrink-0" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-8 bg-white/20 rounded animate-pulse" />
              <div className="h-3 w-36 bg-white/25 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/15 flex items-center gap-6 flex-wrap">
          {[100, 88, 80].map((w) => (
            <div
              key={w}
              className="h-3 bg-white/20 rounded animate-pulse"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Desktop: single stat card ──────────────────────────────────────────────────
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-[7px] bg-gray-100 animate-pulse" />
        <div className="w-3.5 h-3.5 bg-gray-100 rounded animate-pulse mt-1" />
      </div>
      <Skeleton className="h-7 w-16 mb-2" />
      <Skeleton className="h-3 w-24 mb-1.5" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

// ── Desktop: recent quotes list rows ──────────────────────────────────────────
export function RecentQuotesSkeleton() {
  return (
    <div className="divide-y divide-gray-50">
      {[0, 1].map((i) => (
        <div key={i} className="px-5 py-4 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-3 pt-0.5">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
