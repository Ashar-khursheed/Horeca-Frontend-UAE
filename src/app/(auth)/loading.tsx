export default function AuthLoading() {
  return (
    <div className="min-h-screen md:bg-gray-50 bg-white flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">

        {/* Left — green brand panel skeleton */}
        <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-[#186737] via-[#1a7a3f] to-[#0f4d26] p-10 relative overflow-hidden">
          {/* faint circle pattern */}
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 8 }).map((_, r) =>
              Array.from({ length: 6 }).map((_, c) => (
                <div
                  key={`${r}-${c}`}
                  className="absolute w-20 h-20 rounded-full border-2 border-white"
                  style={{ top: r * 90 - 20, left: c * 110 - 20 }}
                />
              ))
            )}
          </div>

          <div className="relative z-10 space-y-6">
            {/* Logo row */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-white/20 animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 bg-white/30 rounded animate-pulse" />
                <div className="h-3 w-40 bg-white/20 rounded animate-pulse" />
              </div>
            </div>

            {/* Heading lines */}
            <div className="space-y-2">
              <div className="h-7 w-48 bg-white/30 rounded animate-pulse" />
              <div className="h-6 w-40 bg-white/20 rounded animate-pulse" />
            </div>

            {/* Description lines */}
            <div className="space-y-2 pt-2">
              <div className="h-3.5 w-64 bg-white/20 rounded animate-pulse" />
              <div className="h-3.5 w-56 bg-white/20 rounded animate-pulse" />
              <div className="h-3.5 w-44 bg-white/20 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right — form panel skeleton */}
        <div className="flex flex-col justify-center p-8 sm:p-10 space-y-5">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Title + subtitle */}
          <div className="space-y-2 mb-1">
            <div className="h-7 w-52 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-44 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-11 w-full bg-gray-100 rounded-[9px] animate-pulse" />
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <div className="h-3.5 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-11 w-full bg-gray-100 rounded-[9px] animate-pulse" />
          </div>

          {/* Login button */}
          <div className="h-11 w-full bg-[#186737]/20 rounded-[9px] animate-pulse" />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <div className="h-3.5 w-6 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google button */}
          <div className="h-11 w-full bg-gray-100 rounded-[9px] border border-gray-200 animate-pulse" />

          {/* Register link */}
          <div className="flex justify-center gap-1 pt-1">
            <div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-3.5 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

      </div>
    </div>
  );
}
